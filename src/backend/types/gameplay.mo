import Common "../types/common";

module {
  public type LeaderboardEntry = {
    tableId         : Common.TableId;
    player          : Common.UserId;
    displayName     : Text;
    score           : Nat;
    replayHash      : ?Text;
    timestamp       : Common.Timestamp;
    bonusMultiplier : Nat;
    badges          : [Text];
  };

  public type ReplayRecord = {
    id                : Text;
    tableId           : Common.TableId;
    playerId          : Common.UserId;
    score             : Nat;
    movesJson         : Text;
    initialParamsJson : Text;
    rngSeed           : Text;
    scoreHash         : Text;
    disputed          : Bool;
    timestamp         : Common.Timestamp;
  };

  public type CoOpSession = {
    id           : Text;
    tableId      : Common.TableId;
    players      : [Common.UserId];
    score        : Nat;
    lives        : Nat;
    lastActivity : Common.Timestamp;
  };
};
