import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Principal "mo:core/Principal";

import Common "../types/common";
import AssetT  "../types/asset";

module {

  // ── submitAsset ────────────────────────────────────────────────────────────
  // Creates a new MarketAsset with #pending status and stores it.
  public func submitAsset(
    assetMap     : Map.Map<Text, AssetT.MarketAsset>,
    id           : Common.AssetId,
    creator      : Common.UserId,
    name         : Text,
    description  : Text,
    tags         : [Text],
    assetType    : AssetT.AssetType,
    fileCategory : AssetT.FileCategory,
    storageUrl   : ?Text,
    codeContent  : ?Text,
    royaltyBps   : Nat,
  ) : Common.Result<AssetT.MarketAsset, Text> {
    if (assetMap.containsKey(id)) {
      return #err("Asset ID already exists: " # id);
    };
    let now : Nat = Int.abs(Time.now());
    let asset : AssetT.MarketAsset = {
      id;
      creator;
      name;
      description;
      tags;
      assetType;
      fileCategory;
      storageUrl;
      codeContent;
      status      = #pending;
      submittedAt = now;
      approvedAt  = null;
      royaltyBps;
      mintedAsNft = false;
      nftTokenId  = null;
    };
    assetMap.add(id, asset);
    #ok(asset)
  };

  // ── approveAsset ──────────────────────────────────────────────────────────
  // Sets status to #approved and records approvedAt timestamp.
  public func approveAsset(
    assetMap : Map.Map<Text, AssetT.MarketAsset>,
  ) : (id : Text) -> Common.Result<AssetT.MarketAsset, Text> {
    func(id : Text) : Common.Result<AssetT.MarketAsset, Text> {
      switch (assetMap.get(id)) {
        case null { #err("Asset not found: " # id) };
        case (?asset) {
          let now : Nat = Int.abs(Time.now());
          let updated = { asset with status = #approved; approvedAt = ?now };
          assetMap.add(id, updated);
          #ok(updated)
        };
      }
    }
  };

  // ── rejectAsset ───────────────────────────────────────────────────────────
  // Sets status to #rejected.
  public func rejectAsset(
    assetMap : Map.Map<Text, AssetT.MarketAsset>,
  ) : (id : Text) -> Common.Result<AssetT.MarketAsset, Text> {
    func(id : Text) : Common.Result<AssetT.MarketAsset, Text> {
      switch (assetMap.get(id)) {
        case null { #err("Asset not found: " # id) };
        case (?asset) {
          let updated = { asset with status = #rejected };
          assetMap.add(id, updated);
          #ok(updated)
        };
      }
    }
  };

  // ── getAssets ─────────────────────────────────────────────────────────────
  // Returns assets filtered by AssetFilter.
  public func getAssets(
    assetMap : Map.Map<Text, AssetT.MarketAsset>,
    filter   : AssetT.AssetFilter,
  ) : [AssetT.MarketAsset] {
    let all = assetMap.values();
    switch (filter) {
      case (#all)     { all.toArray() };
      case (#files)   { all.filter(func(a) { a.assetType == #file }).toArray() };
      case (#code)    { all.filter(func(a) { a.assetType == #code }).toArray() };
      case (#pending) { all.filter(func(a) { a.status == #pending }).toArray() };
      case (#approved){ all.filter(func(a) { a.status == #approved }).toArray() };
    }
  };

  // ── getAsset ──────────────────────────────────────────────────────────────
  public func getAsset(
    assetMap : Map.Map<Text, AssetT.MarketAsset>,
    id       : Text,
  ) : ?AssetT.MarketAsset {
    assetMap.get(id)
  };

  // ── getCreatorBalance ─────────────────────────────────────────────────────
  // Returns the creator's royalty balance, defaulting to zeros.
  public func getCreatorBalance(
    balanceMap : Map.Map<Principal, AssetT.CreatorBalance>,
    creator    : Principal,
  ) : AssetT.CreatorBalance {
    switch (balanceMap.get(creator)) {
      case (?bal) { bal };
      case null {
        { principal = creator; totalEarned = 0; claimable = 0; lastClaimed = null }
      };
    }
  };

  // ── accrueRoyalty ─────────────────────────────────────────────────────────
  // Adds a royalty entry to the ledger and increments the creator's balance.
  public func accrueRoyalty(
    assetMap    : Map.Map<Text, AssetT.MarketAsset>,
    balanceMap  : Map.Map<Principal, AssetT.CreatorBalance>,
    royaltyList : List.List<AssetT.AssetRoyaltyEntry>,
    assetId     : Common.AssetId,
    tableId     : Common.TableId,
    amount      : Nat,
  ) : Common.Result<(), Text> {
    switch (assetMap.get(assetId)) {
      case null { #err("Asset not found: " # assetId) };
      case (?asset) {
        if (asset.status != #approved) {
          return #err("Asset is not approved");
        };
        let now : Nat = Int.abs(Time.now());
        let entry : AssetT.AssetRoyaltyEntry = {
          assetId;
          tableId;
          amount;
          timestamp = now;
        };
        royaltyList.add(entry);
        let prev = getCreatorBalance(balanceMap, asset.creator);
        let updated : AssetT.CreatorBalance = {
          prev with
          totalEarned = prev.totalEarned + amount;
          claimable   = prev.claimable + amount;
        };
        balanceMap.add(asset.creator, updated);
        #ok(())
      };
    }
  };

  // ── claimRoyalties ────────────────────────────────────────────────────────
  // Resets claimable to 0, returning the amount the caller can withdraw.
  public func claimRoyalties(
    balanceMap : Map.Map<Principal, AssetT.CreatorBalance>,
    caller     : Principal,
  ) : Common.Result<Nat, Text> {
    let prev = getCreatorBalance(balanceMap, caller);
    if (prev.claimable == 0) {
      return #err("No claimable balance");
    };
    let amount = prev.claimable;
    let now : Nat = Int.abs(Time.now());
    let updated : AssetT.CreatorBalance = {
      prev with
      claimable   = 0;
      lastClaimed = ?now;
    };
    balanceMap.add(caller, updated);
    #ok(amount)
  };

};
