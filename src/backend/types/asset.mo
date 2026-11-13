import Common "common";

module {
  // ── Asset file category ────────────────────────────────────────────────────
  public type FileCategory = {
    #glb;
    #mp3;
    #wav;
    #texture;
    #image;
    #svg;
    #threejs;
    #json;
  };

  // ── Asset submission type ──────────────────────────────────────────────────
  public type AssetType = {
    #file;
    #code;
  };

  // ── DAO approval status ────────────────────────────────────────────────────
  public type AssetStatus = {
    #pending;
    #approved;
    #rejected;
  };

  // ── Asset filter for getAssets() ──────────────────────────────────────────
  public type AssetFilter = {
    #all;
    #files;
    #code;
    #pending;
    #approved;
  };

  // ── Core marketplace asset ─────────────────────────────────────────────────
  public type MarketAsset = {
    id           : Common.AssetId;
    creator      : Common.UserId;
    name         : Text;
    description  : Text;
    tags         : [Text];
    assetType    : AssetType;
    fileCategory : FileCategory;
    storageUrl   : ?Text;       // populated for #file assets
    codeContent  : ?Text;       // populated for #code assets
    status       : AssetStatus;
    submittedAt  : Common.Timestamp;
    approvedAt   : ?Common.Timestamp;
    royaltyBps   : Nat;         // basis points of table play cost (e.g. 100 = 1%)
    mintedAsNft  : Bool;
    nftTokenId   : ?Nat;
  };

  // ── Per-creator royalty balance ────────────────────────────────────────────
  public type CreatorBalance = {
    principal    : Common.UserId;
    totalEarned  : Nat;         // cumulative ICFC (e8s)
    claimable    : Nat;         // unclaimed ICFC (e8s)
    lastClaimed  : ?Common.Timestamp;
  };

  // ── Single royalty accrual entry (append-only ledger) ─────────────────────
  public type AssetRoyaltyEntry = {
    assetId   : Common.AssetId;
    tableId   : Common.TableId;
    amount    : Nat;            // ICFC (e8s)
    timestamp : Common.Timestamp;
  };
};
