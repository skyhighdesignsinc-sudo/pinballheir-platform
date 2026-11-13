import Common "../types/common";

module {
  public type SkinItem = {
    id       : Text;
    name     : Text;
    assetId  : Common.AssetId;
    skinType : Text; // "ball" | "flipper" | "trail"
  };

  public type SkinCollection = {
    id               : Text;
    name             : Text;
    symbol           : Text;
    maxSupply        : Nat;
    priceICFC        : Nat;
    minted           : Nat;
    creatorPrincipal : Common.UserId;
    itemsJson        : Text;
  };

  public type Achievement = {
    id          : Text;
    name        : Text;
    description : Text;
    iconAssetId : Common.AssetId;
    condition   : Text;
  };

  public type AdSlot = {
    id       : Text;
    tableId  : ?Common.TableId;
    position : Text;
    size     : Text;
    cpmICFC  : Nat;
    cpcICFC  : Nat;
  };
};
