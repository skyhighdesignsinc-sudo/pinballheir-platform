import Common "../types/common";

module {
  public type PlayerProfile = {
    id            : Common.UserId;
    displayName   : Text;
    bio           : Text;
    profilePicAssetId : ?Common.AssetId;
    bannerAssetId : ?Common.AssetId;
    websiteUrl    : ?Text;
    twitter       : ?Text;
    discord       : ?Text;
    telegram      : ?Text;
    referralCode  : Text;
    referredByTable : ?Common.TableId;
    hideFromLeaderboard : Bool;
    badges        : [Text];
    createdAt     : Common.Timestamp;
  };

  public type ProfileUpdateInput = {
    displayName  : Text;
    bio          : Text;
    websiteUrl   : ?Text;
    twitter      : ?Text;
    discord      : ?Text;
    telegram     : ?Text;
    hideFromLeaderboard : Bool;
  };
};
