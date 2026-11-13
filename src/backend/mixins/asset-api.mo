import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

import Common "../types/common";
import AssetT  "../types/asset";
import AssetLib "../lib/asset";

// ── Asset Marketplace API mixin ────────────────────────────────────────────
// Receives state maps from main.mo and exposes public canister methods.
// approveAsset / rejectAsset are owner-only (caller == owner parameter).
mixin (
  owner           : Principal,
  assetMap        : Map.Map<Text, AssetT.MarketAsset>,
  creatorBalanceMap : Map.Map<Principal, AssetT.CreatorBalance>,
  royaltyLedger   : List.List<AssetT.AssetRoyaltyEntry>,
) {

  // ── Submit a new asset (creator action) ───────────────────────────────────
  public shared ({ caller }) func submitAsset(
    id           : Common.AssetId,
    name         : Text,
    description  : Text,
    tags         : [Text],
    assetType    : AssetT.AssetType,
    fileCategory : AssetT.FileCategory,
    storageUrl   : ?Text,
    codeContent  : ?Text,
    royaltyBps   : Nat,
  ) : async Common.Result<AssetT.MarketAsset, Text> {
    AssetLib.submitAsset(
      assetMap,
      id,
      caller,
      name,
      description,
      tags,
      assetType,
      fileCategory,
      storageUrl,
      codeContent,
      royaltyBps,
    )
  };

  // ── Approve a pending asset (owner-only) ───────────────────────────────────
  public shared ({ caller }) func approveAsset(
    id : Common.AssetId,
  ) : async Common.Result<AssetT.MarketAsset, Text> {
    if (caller != owner) {
      return #err("Unauthorized: only the canister owner can approve assets");
    };
    AssetLib.approveAsset(assetMap)(id)
  };

  // ── Reject a pending asset (owner-only) ───────────────────────────────────
  public shared ({ caller }) func rejectAsset(
    id : Common.AssetId,
  ) : async Common.Result<AssetT.MarketAsset, Text> {
    if (caller != owner) {
      return #err("Unauthorized: only the canister owner can reject assets");
    };
    AssetLib.rejectAsset(assetMap)(id)
  };

  // ── Query all/filtered assets (public read) ────────────────────────────────
  public query func getAssets(
    filter : AssetT.AssetFilter,
  ) : async [AssetT.MarketAsset] {
    AssetLib.getAssets(assetMap, filter)
  };

  // ── Query a single asset by ID ─────────────────────────────────────────────
  public query func getAsset(
    id : Common.AssetId,
  ) : async ?AssetT.MarketAsset {
    AssetLib.getAsset(assetMap, id)
  };

  // ── Query a creator's royalty balance ──────────────────────────────────────
  public query func getCreatorBalance(
    creator : Principal,
  ) : async AssetT.CreatorBalance {
    AssetLib.getCreatorBalance(creatorBalanceMap, creator)
  };

  // ── Claim accrued royalties (creator action) ───────────────────────────────
  // Returns the amount unlocked; actual ICFC transfer is handled off-chain/
  // via a separate ICRC-2 flow. This call resets the claimable counter.
  public shared ({ caller }) func claimRoyalties() : async Common.Result<Nat, Text> {
    AssetLib.claimRoyalties(creatorBalanceMap, caller)
  };

};
