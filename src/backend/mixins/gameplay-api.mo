import Common "../types/common";
import GT "../types/gameplay";
import TT "../types/table";
import GameLib "../lib/gameplay";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

mixin (
  boards   : Map.Map<Text, List.List<GT.LeaderboardEntry>>,
  replays  : Map.Map<Text, GT.ReplayRecord>,
  sessions : Map.Map<Text, GT.CoOpSession>,
  econs    : Map.Map<Text, TT.TableEconomy>,
) {

  public query func getLeaderboard(
    tableId : ?Text,
    period  : Text,
    limit   : Nat,
  ) : async [GT.LeaderboardEntry] {
    GameLib.getLeaderboard(boards, tableId, period, limit)
  };

  public shared ({ caller }) func submitScore(
    tableId    : Text,
    score      : Nat,
    replayJson : Text,
    rngSeed    : Text,
  ) : async Common.Result<(), Text> {
    GameLib.submitScore(boards, replays, econs, 0, null, caller, tableId, score, replayJson, rngSeed)
  };

  public query func getReplayRecord(id : Text) : async ?GT.ReplayRecord {
    GameLib.getReplay(replays, id)
  };

  public shared ({ caller }) func submitReplay(
    tableId           : Text,
    movesJson         : Text,
    initialParamsJson : Text,
    rngSeed           : Text,
    score             : Nat,
  ) : async Common.Result<Text, Text> {
    GameLib.submitReplay(replays, caller, tableId, movesJson, initialParamsJson, rngSeed, score)
  };

  public query func getCoOpSession(sessionId : Text) : async ?GT.CoOpSession {
    GameLib.getCoOpSession(sessions, sessionId)
  };

  public shared ({ caller }) func joinCoOpSession(
    tableId : Text
  ) : async Common.Result<Text, Text> {
    GameLib.joinCoOp(sessions, caller, tableId)
  };

  public shared ({ caller }) func leaveCoOpSession(
    sessionId : Text
  ) : async Common.Result<(), Text> {
    GameLib.leaveCoOp(sessions, caller, sessionId)
  };

  public shared ({ caller }) func saveTheBall(tableId : Text) : async Common.Result<(), Text> {
    GameLib.saveBall(econs, caller, tableId)
  };

  public shared ({ caller }) func nudgeTable(tableId : Text) : async Common.Result<(), Text> {
    GameLib.nudge(econs, caller, tableId)
  };

  public shared ({ caller }) func triggerGoldenBall(
    tableId : Text
  ) : async Common.Result<Bool, Text> {
    GameLib.triggerGoldenBall(econs, caller, tableId)
  };

};
