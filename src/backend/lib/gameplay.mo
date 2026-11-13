import Common "../types/common";
import GT "../types/gameplay";
import TT "../types/table";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Char "mo:core/Char";

module {
  public type LeaderboardEntry = GT.LeaderboardEntry;
  public type ReplayRecord     = GT.ReplayRecord;
  public type CoOpSession      = GT.CoOpSession;
  public type TableEconomy     = TT.TableEconomy;

  // ── Internal helpers ──────────────────────────────────────────────────────

  func now() : Nat {
    let t = Time.now();
    if (t >= 0) { t.toNat() } else { 0 }
  };

  func freshReplayId(replays : Map.Map<Text, ReplayRecord>) : Text {
    "replay-" # replays.size().toText() # "-" # (now() % 1_000_000).toText()
  };

  func freshSessionId(sessions : Map.Map<Text, CoOpSession>) : Text {
    "coop-" # sessions.size().toText() # "-" # (now() % 1_000_000).toText()
  };

  /// Simple deterministic hash from Text (XOR fold over char codes).
  func hashText(t : Text) : Nat {
    t.foldLeft<Nat>(0, func(acc, c) {
      (acc * 31 + c.toNat32().toNat()) % 1_000_000_007
    })
  };

  /// Compute a score hash: hash(tableId # player.toText() # Nat.toText(score) # rngSeed).
  func scoreHash(tableId : Text, player : Principal, score : Nat, rngSeed : Text) : Text {
    let raw = tableId # player.toText() # score.toText() # rngSeed;
    hashText(raw).toText()
  };

  // ── Leaderboard ───────────────────────────────────────────────────────────

  public func getLeaderboard(
    boards  : Map.Map<Text, List.List<LeaderboardEntry>>,
    tableId : ?Text,
    _period : Text,
    limit   : Nat,
  ) : [LeaderboardEntry] {
    let key = switch (tableId) { case (?id) id; case null "global" };
    let entries = switch (boards.get(key)) {
      case null [];
      case (?lst) {
        // Sort descending by score
        let arr = lst.toArray();
        arr.sort(func (a : LeaderboardEntry, b : LeaderboardEntry) : { #less; #equal; #greater } {
          if (b.score > a.score) #less
          else if (b.score < a.score) #greater
          else #equal
        })
      };
    };
    if (limit == 0 or limit >= entries.size()) {
      entries
    } else {
      entries.sliceToArray(0, limit)
    }
  };

  public func submitScore(
    boards        : Map.Map<Text, List.List<LeaderboardEntry>>,
    replays       : Map.Map<Text, ReplayRecord>,
    econs         : Map.Map<Text, TableEconomy>,
    _globalTreasury : Nat,
    _charityWallet : ?Principal,
    caller        : Principal,
    tableId       : Text,
    score         : Nat,
    replayJson    : Text,
    rngSeed       : Text,
  ) : Common.Result<(), Text> {
    let ts = now();
    let hash = scoreHash(tableId, caller, score, rngSeed);

    // Look up economy for bonus multiplier
    let bonusMul = switch (econs.get(tableId)) {
      case null 1;
      case (?e) {
        // Entry fee flow: deducted from caller → table treasury
        // TODO: replace with ICRC-2 ledger call in production
        if (e.entryFee > 0) {
          let updated : TableEconomy = {
            tableId              = e.tableId;
            owner                = e.owner;
            icfcTreasury         = e.icfcTreasury + e.entryFee;
            entryFee             = e.entryFee;
            jackpotPercent       = e.jackpotPercent;
            saveBallPrice        = e.saveBallPrice;
            nudgePrice           = e.nudgePrice;
            goldenBallChance     = e.goldenBallChance;
            goldenBallReward     = e.goldenBallReward;
            referralReward       = e.referralReward;
            charityTiltAmount    = e.charityTiltAmount;
            creatorRoyaltyPercent = e.creatorRoyaltyPercent;
            leaderboardStructure = e.leaderboardStructure;
            leaderboardPeriod    = e.leaderboardPeriod;
          };
          econs.add(tableId, updated);
        };
        1
      };
    };

    let entry : LeaderboardEntry = {
      tableId;
      player          = caller;
      displayName     = caller.toText();
      score;
      replayHash      = ?hash;
      timestamp       = ts;
      bonusMultiplier = bonusMul;
      badges          = [];
    };

    // Add to per-table leaderboard
    let board = switch (boards.get(tableId)) {
      case null {
        let lst = List.empty<LeaderboardEntry>();
        boards.add(tableId, lst);
        lst
      };
      case (?lst) lst;
    };
    board.add(entry);

    // Store replay
    let replayId = freshReplayId(replays);
    let record : ReplayRecord = {
      id                = replayId;
      tableId;
      playerId          = caller;
      score;
      movesJson         = replayJson;
      initialParamsJson = "{}";
      rngSeed;
      scoreHash         = hash;
      disputed          = false;
      timestamp         = ts;
    };
    replays.add(replayId, record);

    #ok(())
  };

  // ── Replay ────────────────────────────────────────────────────────────────

  public func getReplay(replays : Map.Map<Text, ReplayRecord>, id : Text) : ?ReplayRecord {
    replays.get(id)
  };

  public func submitReplay(
    replays          : Map.Map<Text, ReplayRecord>,
    caller           : Principal,
    tableId          : Text,
    movesJson        : Text,
    initialParams    : Text,
    rngSeed          : Text,
    score            : Nat,
  ) : Common.Result<Text, Text> {
    let ts = now();
    let hash = scoreHash(tableId, caller, score, rngSeed);
    let id = freshReplayId(replays);
    let record : ReplayRecord = {
      id;
      tableId;
      playerId          = caller;
      score;
      movesJson;
      initialParamsJson = initialParams;
      rngSeed;
      scoreHash         = hash;
      disputed          = false;
      timestamp         = ts;
    };
    replays.add(id, record);
    #ok(id)
  };

  // ── Co-op ────────────────────────────────────────────────────────────────

  public func getCoOpSession(sessions : Map.Map<Text, CoOpSession>, id : Text) : ?CoOpSession {
    sessions.get(id)
  };

  public func joinCoOp(
    sessions : Map.Map<Text, CoOpSession>,
    caller   : Principal,
    tableId  : Text,
  ) : Common.Result<Text, Text> {
    // Find existing open session for table, or create one
    let existing = sessions.entries().find(func((_, s) : (Text, CoOpSession)) : Bool {
      s.tableId == tableId and s.players.size() < 4
    });
    switch (existing) {
      case (?(sid, s)) {
        // Check not already in session
        if (s.players.any(func (p : Principal) : Bool { Principal.equal(p, caller) })) {
          return #ok(sid)
        };
        let updated : CoOpSession = {
          id           = s.id;
          tableId      = s.tableId;
          players      = s.players.concat([caller]);
          score        = s.score;
          lives        = s.lives;
          lastActivity = now();
        };
        sessions.add(sid, updated);
        #ok(sid)
      };
      case null {
        let id = freshSessionId(sessions);
        let session : CoOpSession = {
          id;
          tableId;
          players      = [caller];
          score        = 0;
          lives        = 3;
          lastActivity = now();
        };
        sessions.add(id, session);
        #ok(id)
      };
    }
  };

  public func leaveCoOp(
    sessions  : Map.Map<Text, CoOpSession>,
    caller    : Principal,
    sessionId : Text,
  ) : Common.Result<(), Text> {
    switch (sessions.get(sessionId)) {
      case null #err("Session not found");
      case (?s) {
        let remaining = s.players.filter(func (p : Principal) : Bool {
          not Principal.equal(p, caller)
        });
        if (remaining.size() == 0) {
          sessions.remove(sessionId);
        } else {
          let updated : CoOpSession = {
            id           = s.id;
            tableId      = s.tableId;
            players      = remaining;
            score        = s.score;
            lives        = s.lives;
            lastActivity = now();
          };
          sessions.add(sessionId, updated);
        };
        #ok(())
      };
    }
  };

  // ── Special mechanics ────────────────────────────────────────────────────

  public func saveBall(
    econs   : Map.Map<Text, TableEconomy>,
    _caller : Principal,
    tableId : Text,
  ) : Common.Result<(), Text> {
    switch (econs.get(tableId)) {
      case null #err("Table economy not found");
      case (?e) {
        if (e.saveBallPrice == 0) return #ok(()); // Free save
        // TODO: replace with ICRC-2 ledger call in production
        // Deduct saveBallPrice from caller → table treasury
        let updated : TableEconomy = {
          tableId              = e.tableId;
          owner                = e.owner;
          icfcTreasury         = e.icfcTreasury + e.saveBallPrice;
          entryFee             = e.entryFee;
          jackpotPercent       = e.jackpotPercent;
          saveBallPrice        = e.saveBallPrice;
          nudgePrice           = e.nudgePrice;
          goldenBallChance     = e.goldenBallChance;
          goldenBallReward     = e.goldenBallReward;
          referralReward       = e.referralReward;
          charityTiltAmount    = e.charityTiltAmount;
          creatorRoyaltyPercent = e.creatorRoyaltyPercent;
          leaderboardStructure = e.leaderboardStructure;
          leaderboardPeriod    = e.leaderboardPeriod;
        };
        econs.add(tableId, updated);
        #ok(())
      };
    }
  };

  public func nudge(
    econs   : Map.Map<Text, TableEconomy>,
    _caller : Principal,
    tableId : Text,
  ) : Common.Result<(), Text> {
    switch (econs.get(tableId)) {
      case null #err("Table economy not found");
      case (?e) {
        if (e.nudgePrice > 0) {
          // TODO: replace with ICRC-2 ledger call in production
          // Deduct nudgePrice from caller → table treasury
          let updated : TableEconomy = {
            tableId              = e.tableId;
            owner                = e.owner;
            icfcTreasury         = e.icfcTreasury + e.nudgePrice;
            entryFee             = e.entryFee;
            jackpotPercent       = e.jackpotPercent;
            saveBallPrice        = e.saveBallPrice;
            nudgePrice           = e.nudgePrice;
            goldenBallChance     = e.goldenBallChance;
            goldenBallReward     = e.goldenBallReward;
            referralReward       = e.referralReward;
            charityTiltAmount    = e.charityTiltAmount;
            creatorRoyaltyPercent = e.creatorRoyaltyPercent;
            leaderboardStructure = e.leaderboardStructure;
            leaderboardPeriod    = e.leaderboardPeriod;
          };
          econs.add(tableId, updated);
        };
        // 50% chance of tilt (using timestamp as pseudo-RNG for MVP)
        // TODO: replace with on-chain randomness beacon in production
        let tilts = now() % 2 == 0;
        if (tilts) {
          #err("TILT")
        } else {
          #ok(())
        }
      };
    }
  };

  public func triggerGoldenBall(
    econs   : Map.Map<Text, TableEconomy>,
    caller  : Principal,
    tableId : Text,
  ) : Common.Result<Bool, Text> {
    switch (econs.get(tableId)) {
      case null #err("Table economy not found");
      case (?e) {
        if (e.goldenBallChance == 0) return #ok(false);
        // On-chain RNG check: hash(now # caller # tableId) % goldenBallChance == 0
        // TODO: replace with on-chain randomness beacon in production
        let seed = hashText(now().toText() # caller.toText() # tableId);
        let won = seed % e.goldenBallChance == 0;
        if (won) {
          if (e.icfcTreasury < e.goldenBallReward) return #err("Insufficient table treasury");
          // TODO: replace with ICRC-2 ledger call in production
          // Payout goldenBallReward from table treasury to caller
          let updated : TableEconomy = {
            tableId              = e.tableId;
            owner                = e.owner;
            icfcTreasury         = e.icfcTreasury - e.goldenBallReward;
            entryFee             = e.entryFee;
            jackpotPercent       = e.jackpotPercent;
            saveBallPrice        = e.saveBallPrice;
            nudgePrice           = e.nudgePrice;
            goldenBallChance     = e.goldenBallChance;
            goldenBallReward     = e.goldenBallReward;
            referralReward       = e.referralReward;
            charityTiltAmount    = e.charityTiltAmount;
            creatorRoyaltyPercent = e.creatorRoyaltyPercent;
            leaderboardStructure = e.leaderboardStructure;
            leaderboardPeriod    = e.leaderboardPeriod;
          };
          econs.add(tableId, updated);
        };
        #ok(won)
      };
    }
  };

  public func triggerCharityTilt(
    _econs         : Map.Map<Text, TableEconomy>,
    _treasury      : Nat,
    _charityWallet : ?Principal,
    _tableId       : Text,
    _amount        : Nat,
  ) : Common.Result<(), Text> {
    #ok(())
  };

  public func getDailyMysteryTable(
    _tables      : Map.Map<Text, GT.CoOpSession>,
    mysteryState : ?Text,
  ) : ?Text {
    mysteryState
  };
};
