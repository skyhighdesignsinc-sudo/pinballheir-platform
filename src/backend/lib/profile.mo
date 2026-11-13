import Common "../types/common";
import Types "../types/profile";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  // ── Public API types exposed to lib callers ──────────────────────────────
  public type PlayerProfile    = Types.PlayerProfile;
  public type ProfileUpdateInput = Types.ProfileUpdateInput;

  // ── Private helpers ────────────────────────────────────────────────────────

  /// Generate a deterministic referral code from a Principal.
  func makeReferralCode(p : Principal) : Text {
    let t = p.toText();
    // Take first 8 chars after the first dash for a short code
    let parts = t.split(#char '-');
    switch (parts.next()) {
      case null t;
      case (?first) {
        if (first.size() >= 6) {
          Text.fromIter(first.toIter().take(8))
        } else {
          first # "ref"
        }
      };
    }
  };

  // ── Core operations ───────────────────────────────────────────────────────

  /// Get a player's profile by principal.
  public func get(profiles : Map.Map<Principal, PlayerProfile>, id : Principal) : ?PlayerProfile {
    profiles.get(id)
  };

  /// Create or replace a caller's profile, generating a referral code.
  public func upsert(
    profiles : Map.Map<Principal, PlayerProfile>,
    caller   : Principal,
    input    : ProfileUpdateInput,
  ) : Common.Result<(), Text> {
    let rawTime = Time.now();
    let now : Common.Timestamp = if (rawTime >= 0) { rawTime.toNat() } else { 0 };
    let existing = profiles.get(caller);
    let (referralCode, referredByTable, createdAt, badges) = switch (existing) {
      case (?p) (p.referralCode, p.referredByTable, p.createdAt, p.badges);
      case null (makeReferralCode(caller), null, now, []);
    };
    let profile : PlayerProfile = {
      id                  = caller;
      displayName         = input.displayName;
      bio                 = input.bio;
      profilePicAssetId   = null;
      bannerAssetId       = null;
      websiteUrl          = input.websiteUrl;
      twitter             = input.twitter;
      discord             = input.discord;
      telegram            = input.telegram;
      referralCode;
      referredByTable;
      hideFromLeaderboard = input.hideFromLeaderboard;
      badges;
      createdAt;
    };
    profiles.add(caller, profile);
    #ok(())
  };

  /// Award a badge to a player (DAO-controlled).
  public func awardBadge(
    profiles : Map.Map<Principal, PlayerProfile>,
    player   : Principal,
    badgeId  : Text,
  ) : Common.Result<(), Text> {
    switch (profiles.get(player)) {
      case null #err("Profile not found");
      case (?p) {
        // Only add badge if not already present
        let alreadyHas = p.badges.any(func (b : Text) : Bool { b == badgeId });
        if (alreadyHas) return #ok(());
        let updated : PlayerProfile = { p with badges = p.badges.concat([badgeId]) };
        profiles.add(player, updated);
        #ok(())
      };
    }
  };

  /// Delete a profile (DAO proposal #DeleteProfile).
  public func delete(
    profiles : Map.Map<Principal, PlayerProfile>,
    player   : Principal,
  ) : Common.Result<(), Text> {
    switch (profiles.get(player)) {
      case null #err("Profile not found");
      case (?_) {
        profiles.remove(player);
        #ok(())
      };
    }
  };

  /// Mark referral: first paid table sets the referredByTable field.
  /// Never overwrites an already-set referral.
  public func setReferredByTable(
    profiles : Map.Map<Principal, PlayerProfile>,
    player   : Principal,
    tableId  : Common.TableId,
  ) : () {
    switch (profiles.get(player)) {
      case null ();
      case (?p) {
        switch (p.referredByTable) {
          case (?_) (); // already set — never overwrite
          case null {
            let updated : PlayerProfile = { p with referredByTable = ?tableId };
            profiles.add(player, updated);
          };
        }
      };
    }
  };

  /// Return all profiles as an array (for DAO queries).
  public func listAll(profiles : Map.Map<Principal, PlayerProfile>) : [PlayerProfile] {
    profiles.entries().map<(Principal, PlayerProfile), PlayerProfile>(
      func((_, v)) { v }
    ).toArray()
  };

  /// Return player achievements (badge IDs).
  public func getPlayerBadges(
    profiles : Map.Map<Principal, PlayerProfile>,
    player   : Principal,
  ) : [Text] {
    switch (profiles.get(player)) {
      case null [];
      case (?p) p.badges;
    }
  };
};
