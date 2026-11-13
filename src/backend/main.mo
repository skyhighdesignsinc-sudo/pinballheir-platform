import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Stripe "mo:caffeineai-stripe/stripe";

import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

import ProfileT "types/profile";
import TableT "types/table";
import GameT "types/gameplay";
import GovT "types/governance";
import MarketT "types/market";

import ProfileMixin "mixins/profile-api";
import TableMixin "mixins/table-api";
import GameMixin "mixins/gameplay-api";
import GovMixin "mixins/governance-api";
import MarketMixin "mixins/market-api";
import AssetMixin  "mixins/asset-api";

import GovLib "lib/governance";
import TableLib "lib/table";
import Common "types/common";
import AssetT "types/asset";




actor PinballHEIR {

  // ── Platform extensions ───────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinObjectStorage();

  // ── HTTP outcall transform (required by platform) ─────────────────────────
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ── Profile state ─────────────────────────────────────────────────────────
  let profiles = Map.empty<Principal, ProfileT.PlayerProfile>();

  // ── Table state ───────────────────────────────────────────────────────────
  let tables   = Map.empty<Text, TableT.PinballTable>();
  let econs    = Map.empty<Text, TableT.TableEconomy>();
  let seasons  = Map.empty<Text, TableT.Season>();
  let eggs     = Map.empty<Text, TableT.EasterEgg>();

  // ── Gameplay state ────────────────────────────────────────────────────────
  let boards         = Map.empty<Text, List.List<GameT.LeaderboardEntry>>();
  let replays        = Map.empty<Text, GameT.ReplayRecord>();
  let sessions       = Map.empty<Text, GameT.CoOpSession>();
  var globalTreasury : Nat = 0;
  var charityWallet  : ?Principal = null;
  var mysteryTable   : ?Text = null;

  // ── Global platform fee (DAO-controlled only) ─────────────────────────────
  // Represents the percentage of entry fees collected as platform revenue.
  // Only a passed #ChangePlatformFee proposal can modify this value.
  // Table owners have no access to this variable.
  var globalPlatformFeePct : Nat = 10;

  // ── Governance state ──────────────────────────────────────────────────────
  let proposals  = Map.empty<Nat, GovT.Proposal>();
  let votes      = Map.empty<Text, GovT.Vote>();
  var nextPropId : Nat = 0;

  // ── Market state ──────────────────────────────────────────────────────────
  let skins        = Map.empty<Text, MarketT.SkinCollection>();
  let achievements = Map.empty<Text, MarketT.Achievement>();
  let ads          = Map.empty<Text, MarketT.AdSlot>();
  var icfcTreasury : Nat = 0;

  // ── Asset Marketplace state ────────────────────────────────────────────────
  let assetMap          = Map.empty<Text, AssetT.MarketAsset>();
  let creatorBalanceMap = Map.empty<Principal, AssetT.CreatorBalance>();
  let royaltyLedger     = List.empty<AssetT.AssetRoyaltyEntry>();

  // ── Stripe state ──────────────────────────────────────────────────────────
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // ── Heartbeat state ───────────────────────────────────────────────────────
  var lastHeartbeat    : Int = 0;
  var mysteryTableIdx  : Nat = 0;

  // ── Mixin composition ─────────────────────────────────────────────────────
  include ProfileMixin(profiles);
  include TableMixin(tables, econs, seasons, eggs);
  include GameMixin(boards, replays, sessions, econs);
  include GovMixin(proposals, votes);
  include MarketMixin(skins, achievements, ads);
  include AssetMixin(Principal.fromActor(PinballHEIR), assetMap, creatorBalanceMap, royaltyLedger);

  // ── Heartbeat ─────────────────────────────────────────────────────────────
  // Fires every ~1 second on ICP; we gate internally to ~1 hour intervals.
  system func heartbeat() : async () {
    let now : Int = Time.now();
    let hourNs : Int = 3_600_000_000_000;
    if (now - lastHeartbeat < hourNs) return;
    lastHeartbeat := now;

    let nowNat : Nat = if (now >= 0) { now.toNat() } else { 0 };

    // 1. Auto-prune expired proposals (older than 90 days)
    GovLib.pruneExpired(proposals, nowNat);

    // 2. Select daily mystery table (cycle through Released tables)
    let releasedTables = TableLib.list(tables, ?"Released");
    if (releasedTables.size() > 0) {
      let idx = mysteryTableIdx % releasedTables.size();
      mysteryTable := ?releasedTables[idx].id;
      mysteryTableIdx += 1;
    };

    // 3. Leaderboard payouts for tables with expired seasons
    // For MVP: iterate seasons, find expired ones, distribute from table treasury
    // TODO: implement full season payout logic with ICRC-2 in production
  };

  // ── Treasury ─────────────────────────────────────────────────────────────
  public query func getGlobalTreasury() : async Nat {
    globalTreasury
  };

  // ── Platform fee (DAO-controlled) ─────────────────────────────────────────
  /// Returns the global platform fee percentage (0–100).
  /// Only the DAO can change this via a #ChangePlatformFee proposal.
  public query func getGlobalPlatformFee() : async Nat {
    globalPlatformFeePct
  };

  public shared func triggerCharityTilt(tableId : Text, amount : Nat) : async Common.Result<(), Text> {
    globalTreasury += amount;
    #ok(())
  };

  // ── Proposal execution dispatcher ─────────────────────────────────────────
  // Called after a proposal reaches #Passed status.
  // Each branch reads paramsJson and applies the corresponding side effect.
  //
  // #ChangePlatformFee: paramsJson = "<Nat>" (plain number as text, e.g. "10")
  //   Updates globalPlatformFeePct. Validation: 0 ≤ feePct ≤ 100.
  public shared ({ caller }) func executeProposal(propId : Nat) : async Common.Result<(), Text> {
    // Step 1: mark proposal as Executed in governance state
    let execResult = GovLib.execute(proposals, propId, caller, _nowNat());
    switch (execResult) {
      case (#err(e)) return #err(e);
      case (#ok(())) ();
    };
    // Step 2: dispatch side-effects by proposal type
    switch (proposals.get(propId)) {
      case null #err("Proposal not found after execution");
      case (?p) {
        switch (p.proposalType) {
          case (#ChangePlatformFee) {
            // paramsJson must be a plain Nat string, e.g. "10"
            switch (Nat.fromText(p.paramsJson)) {
              case null #err("Invalid platform fee value in paramsJson — must be a plain Nat string");
              case (?feePct) {
                if (feePct > 100) return #err("Platform fee cannot exceed 100%");
                globalPlatformFeePct := feePct;
                #ok(())
              };
            }
          };
          // Other proposal types: side-effects handled by their respective
          // domain lib/mixin functions. Add handlers here as they are implemented.
          case _ #ok(());
        }
      };
    }
  };

  private func _nowNat() : Nat {
    let t = Time.now();
    if (t >= 0) { t.toNat() } else { 0 }
  };

  // ── Charity wallet management ─────────────────────────────────────────────
  public query func getCharityWallet() : async ?Principal {
    charityWallet
  };

  public shared func setCharityWallet(wallet : Principal) : async Common.Result<(), Text> {
    charityWallet := ?wallet;
    #ok(())
  };

  // ── Daily mystery table ───────────────────────────────────────────────────
  public query func getDailyMysteryTable() : async ?Text {
    mysteryTable
  };

  // ── Stripe functions (required by platform) ───────────────────────────────
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  private func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case null Runtime.trap("Stripe needs to be first configured");
      case (?c) c;
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(
    items      : [Stripe.ShoppingItem],
    successUrl : Text,
    cancelUrl  : Text,
  ) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

};
