import Common "../types/common";

module {
  public type TableStatus = { #Beta; #Released };

  public type PinballTable = {
    id              : Common.TableId;
    name            : Text;
    creator         : Common.UserId;
    backgroundAssetId : Common.AssetId;
    musicId         : ?Common.AssetId;
    physicsWasmId   : ?Common.AssetId;
    gravity         : Float;
    friction        : Float;
    flipperStrength : Float;
    rebound         : Float;
    tiltSensitivity : Float;
    tableWidth      : Nat;
    tableHeight     : Nat;
    status          : TableStatus;
    layoutJson      : Text;
    visualsJson     : Text;
    economyJson     : Text;
    rulesetJson     : Text;
    soundJson       : Text;
    accessJson      : Text;
    daoJson         : Text;
    createdAt       : Common.Timestamp;
  };

  public type TableCreateInput = {
    name            : Text;
    creator         : Common.UserId;
    layoutJson      : Text;
    visualsJson     : Text;
    physicsJson     : Text;
    economyJson     : Text;
    rulesetJson     : Text;
    metadataJson    : Text;
    accessJson      : Text;
    daoJson         : Text;
    soundJson       : Text;
  };

  public type TableEconomy = {
    tableId              : Common.TableId;
    owner                : Common.UserId;
    icfcTreasury         : Nat;
    entryFee             : Nat;
    jackpotPercent       : Nat;
    saveBallPrice        : Nat;
    nudgePrice           : Nat;
    goldenBallChance     : Nat;
    goldenBallReward     : Nat;
    referralReward       : Nat;
    charityTiltAmount    : Nat;
    creatorRoyaltyPercent : Nat;
    leaderboardStructure : Text;
    leaderboardPeriod    : Common.LeaderboardPeriod;
  };

  public type EconomyUpdateInput = {
    entryFee             : ?Nat;
    jackpotPercent       : ?Nat;
    saveBallPrice        : ?Nat;
    nudgePrice           : ?Nat;
    goldenBallChance     : ?Nat;
    goldenBallReward     : ?Nat;
    referralReward       : ?Nat;
    charityTiltAmount    : ?Nat;
    leaderboardStructure : ?Text;
    leaderboardPeriod    : ?Common.LeaderboardPeriod;
  };

  public type Season = {
    id              : Text;
    tableId         : Common.TableId;
    startTime       : Common.Timestamp;
    endTime         : Common.Timestamp;
    archiveJson     : Text;
    bonusMultiplier : Nat;
  };

  public type EasterEgg = {
    id          : Text;
    tableId     : Common.TableId;
    discovered  : Bool;
    discoverer  : ?Common.UserId;
    rewardICFC  : Nat;
    description : Text;
  };
};
