import Common "../types/common";
import TT "../types/table";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  public type PinballTable       = TT.PinballTable;
  public type TableEconomy       = TT.TableEconomy;
  public type TableCreateInput   = TT.TableCreateInput;
  public type EconomyUpdateInput = TT.EconomyUpdateInput;
  public type Season             = TT.Season;
  public type EasterEgg          = TT.EasterEgg;

  // ── Internal helpers ──────────────────────────────────────────────────────

  func freshTableId(tables : Map.Map<Text, PinballTable>) : Text {
    let sz = tables.size();
    let ts = now();
    "tbl-" # sz.toText() # "-" # (ts % 1_000_000).toText()
  };

  func freshSeasonId(seasons : Map.Map<Text, Season>) : Text {
    let sz = seasons.size();
    let ts = now();
    "season-" # sz.toText() # "-" # (ts % 1_000_000).toText()
  };

  func now() : Nat {
    let t = Time.now();
    if (t >= 0) { t.toNat() } else { 0 }
  };

  // ── Table CRUD ────────────────────────────────────────────────────────────

  public func get(tables : Map.Map<Text, PinballTable>, id : Text) : ?PinballTable {
    tables.get(id)
  };

  public func list(tables : Map.Map<Text, PinballTable>, filter : ?Text) : [PinballTable] {
    switch (filter) {
      case null {
        tables.values().toArray()
      };
      case (?statusFilter) {
        tables.values().filter(func (t : PinballTable) : Bool {
          switch (statusFilter) {
            case ("Released") { switch (t.status) { case (#Released) true; case _ false } };
            case ("Beta")     { switch (t.status) { case (#Beta)     true; case _ false } };
            case _            true;
          }
        }).toArray()
      };
    }
  };

  public func create(
    tables  : Map.Map<Text, PinballTable>,
    econs   : Map.Map<Text, TableEconomy>,
    caller  : Principal,
    input   : TableCreateInput,
  ) : Common.Result<Text, Text> {
    let id = freshTableId(tables);
    let ts = now();
    let table : PinballTable = {
      id;
      name              = input.name;
      creator           = caller;
      backgroundAssetId = "";
      musicId           = null;
      physicsWasmId     = null;
      gravity           = 9.8;
      friction          = 0.3;
      flipperStrength   = 1.0;
      rebound           = 0.8;
      tiltSensitivity   = 0.5;
      tableWidth        = 600;
      tableHeight       = 1200;
      status            = #Beta;
      layoutJson        = input.layoutJson;
      visualsJson       = input.visualsJson;
      economyJson       = input.economyJson;
      rulesetJson       = input.rulesetJson;
      soundJson         = input.soundJson;
      accessJson        = input.accessJson;
      daoJson           = input.daoJson;
      createdAt         = ts;
    };
    let economy : TableEconomy = {
      tableId               = id;
      owner                 = caller;
      icfcTreasury          = 0;
      entryFee              = 0;
      jackpotPercent        = 5;
      saveBallPrice         = 5;
      nudgePrice            = 1;
      goldenBallChance      = 100;
      goldenBallReward      = 50;
      referralReward        = 10;
      charityTiltAmount     = 1;
      creatorRoyaltyPercent = 5;
      leaderboardStructure  = "{}";
      leaderboardPeriod     = #Daily;
    };
    tables.add(id, table);
    econs.add(id, economy);
    #ok(id)
  };

  public func update(
    tables : Map.Map<Text, PinballTable>,
    caller : Principal,
    id     : Text,
    patch  : Text, // JSON patch blob — stored verbatim in layoutJson for MVP
  ) : Common.Result<(), Text> {
    switch (tables.get(id)) {
      case null #err("Table not found");
      case (?t) {
        if (not Principal.equal(t.creator, caller)) return #err("Unauthorized");
        let updated : PinballTable = { t with layoutJson = patch };
        tables.add(id, updated);
        #ok(())
      };
    }
  };

  public func release(
    tables : Map.Map<Text, PinballTable>,
    caller : Principal,
    id     : Text,
  ) : Common.Result<(), Text> {
    switch (tables.get(id)) {
      case null #err("Table not found");
      case (?t) {
        if (not Principal.equal(t.creator, caller)) return #err("Unauthorized");
        let updated : PinballTable = { t with status = #Released };
        tables.add(id, updated);
        #ok(())
      };
    }
  };

  public func fork(
    tables   : Map.Map<Text, PinballTable>,
    econs    : Map.Map<Text, TableEconomy>,
    caller   : Principal,
    sourceId : Text,
  ) : Common.Result<Text, Text> {
    switch (tables.get(sourceId)) {
      case null #err("Source table not found");
      case (?src) {
        switch (econs.get(sourceId)) {
          case null #err("Source economy not found");
          case (?srcEcon) {
            // Deduct fork fee (10 ICFC) from caller's table treasury if they own one
            // TODO: replace with ICRC-2 ledger call in production
            let forkFee : Nat = 10;
    let id = freshTableId(tables);
            let ts = now();
            let forked : PinballTable = {
              src with
              id        = id;
              creator   = caller;
              status    = #Beta;
              createdAt = ts;
              name      = src.name # " (Fork)";
            };
            let forkedEcon : TableEconomy = {
              srcEcon with
              tableId               = id;
              owner                 = caller;
              icfcTreasury          = 0;
              creatorRoyaltyPercent = 10; // 100% royalty to fork creator (capped at Nat8 max = 10 in 0-10 scale)
            };
            // Credit fork fee to source table treasury
            // TODO: replace with ICRC-2 ledger call in production
            let updatedSrcEcon : TableEconomy = {
              srcEcon with icfcTreasury = srcEcon.icfcTreasury + forkFee
            };
            tables.add(id, forked);
            econs.add(id, forkedEcon);
            econs.add(sourceId, updatedSrcEcon);
            #ok(id)
          };
        }
      };
    }
  };

  // ── Economy ───────────────────────────────────────────────────────────────

  public func getEconomy(econs : Map.Map<Text, TableEconomy>, tableId : Text) : ?TableEconomy {
    econs.get(tableId)
  };

  public func updateEconomy(
    econs   : Map.Map<Text, TableEconomy>,
    _tables  : Map.Map<Text, PinballTable>,
    caller  : Principal,
    tableId : Text,
    input   : EconomyUpdateInput,
  ) : Common.Result<(), Text> {
    switch (econs.get(tableId)) {
      case null #err("Economy not found");
      case (?e) {
        if (not Principal.equal(e.owner, caller)) return #err("Unauthorized: only table owner can update economy");
        let updated : TableEconomy = {
          e with
          entryFee             = switch (input.entryFee)             { case (?v) v; case null e.entryFee };
          jackpotPercent       = switch (input.jackpotPercent)       { case (?v) v; case null e.jackpotPercent };
          saveBallPrice        = switch (input.saveBallPrice)        { case (?v) v; case null e.saveBallPrice };
          nudgePrice           = switch (input.nudgePrice)           { case (?v) v; case null e.nudgePrice };
          goldenBallChance     = switch (input.goldenBallChance)     { case (?v) v; case null e.goldenBallChance };
          goldenBallReward     = switch (input.goldenBallReward)     { case (?v) v; case null e.goldenBallReward };
          referralReward       = switch (input.referralReward)       { case (?v) v; case null e.referralReward };
          charityTiltAmount    = switch (input.charityTiltAmount)    { case (?v) v; case null e.charityTiltAmount };
          leaderboardStructure = switch (input.leaderboardStructure) { case (?v) v; case null e.leaderboardStructure };
          leaderboardPeriod    = switch (input.leaderboardPeriod)    { case (?v) v; case null e.leaderboardPeriod };
        };
        econs.add(tableId, updated);
        #ok(())
      };
    }
  };

  // ── Seasons ───────────────────────────────────────────────────────────────

  public func getSeasons(seasons : Map.Map<Text, Season>, tableId : Text) : [Season] {
    seasons.values().filter(func (s : Season) : Bool {
      s.tableId == tableId
    }).toArray()
  };

  public func createSeason(
    seasons  : Map.Map<Text, Season>,
    tables   : Map.Map<Text, PinballTable>,
    caller   : Principal,
    tableId  : Text,
    endTime  : Common.Timestamp,
    bonusMul : Nat,
  ) : Common.Result<Text, Text> {
    switch (tables.get(tableId)) {
      case null #err("Table not found");
      case (?t) {
        if (not Principal.equal(t.creator, caller)) return #err("Unauthorized");
        let id = freshSeasonId(seasons);
        let s : Season = {
          id;
          tableId;
          startTime       = now();
          endTime;
          archiveJson     = "{}";
          bonusMultiplier = bonusMul;
        };
        seasons.add(id, s);
        #ok(id)
      };
    }
  };

  // ── Easter Eggs ───────────────────────────────────────────────────────────

  public func getEasterEggs(eggs : Map.Map<Text, EasterEgg>, tableId : Text) : [EasterEgg] {
    eggs.values().filter(func (e : EasterEgg) : Bool {
      e.tableId == tableId
    }).toArray()
  };

  public func discoverEgg(
    eggs    : Map.Map<Text, EasterEgg>,
    caller  : Principal,
    tableId : Text,
    eggId   : Text,
  ) : Common.Result<Nat, Text> {
    switch (eggs.get(eggId)) {
      case null #err("Easter egg not found");
      case (?egg) {
        if (egg.tableId != tableId) return #err("Egg does not belong to this table");
        if (egg.discovered) return #err("Already discovered");
        // Mark as discovered
        let updated : EasterEgg = {
          egg with
          discovered = true;
          discoverer = ?caller;
        };
        eggs.add(eggId, updated);
        // TODO: replace with ICRC-2 ledger call in production — pay egg.rewardICFC from table treasury to caller
        #ok(egg.rewardICFC)
      };
    }
  };

  // ── Genesis ───────────────────────────────────────────────────────────────

  public func initGenesis(
    tables : Map.Map<Text, PinballTable>,
    econs  : Map.Map<Text, TableEconomy>,
  ) : Common.Result<(), Text> {
    // Idempotent — only create if "neon-nights" doesn't exist
    switch (tables.get("neon-nights")) {
      case (?_) #ok(()); // already initialized
      case null {
        let daoOwner = Principal.fromText("2vxsx-fae"); // anonymous = DAO placeholder
        let ts = now();
        let table : PinballTable = {
          id                = "neon-nights";
          name              = "Neon Nights";
          creator           = daoOwner;
          backgroundAssetId = "neon-nights-bg";
          musicId           = ?"neon-nights-music";
          physicsWasmId     = ?"default-physics";
          gravity           = 9.8;
          friction          = 0.2;
          flipperStrength   = 1.2;
          rebound           = 0.85;
          tiltSensitivity   = 0.4;
          tableWidth        = 600;
          tableHeight       = 1200;
          status            = #Released;
          layoutJson        = "{\"theme\":\"cyberpunk-neon\",\"bumpers\":[{\"x\":150,\"y\":400},{\"x\":300,\"y\":350},{\"x\":450,\"y\":400},{\"x\":200,\"y\":550},{\"x\":400,\"y\":550}],\"flippers\":[{\"x\":150,\"y\":1100,\"side\":\"left\"},{\"x\":450,\"y\":1100,\"side\":\"right\"}],\"ramps\":[{\"x\":100,\"y\":300,\"angle\":30},{\"x\":500,\"y\":300,\"angle\":-30}]}";
          visualsJson       = "{\"backgroundColor\":\"#0a0a1a\",\"feltColor\":\"#1a0a3a\",\"lightTheme\":\"neon\",\"lightColor\":\"#ff00ff\",\"ballSkin\":\"silver-glow\",\"trailEffect\":\"neon-purple\"}";
          economyJson       = "{\"free\":true}";
          rulesetJson       = "{\"multiball\":true,\"extraBall\":true,\"bonusMultiplier\":1}";
          soundJson         = "{\"bgTrack\":\"synthwave-loop\",\"bumperSound\":\"neon-ping\",\"flipperSound\":\"electric-flip\"}";
          accessJson        = "{\"type\":\"public\",\"maxConcurrent\":50}";
          daoJson           = "{\"governanceToken\":\"ddsp7-7iaaa-aaaaq-aacqq-cai\",\"votingThreshold\":5}";
          createdAt         = ts;
        };
        let economy : TableEconomy = {
          tableId               = "neon-nights";
          owner                 = daoOwner;
          icfcTreasury          = 1000; // 1000 ICFC seeded by DAO
          entryFee              = 0;    // Free table
          jackpotPercent        = 0;
          saveBallPrice         = 0;
          nudgePrice            = 0;
          goldenBallChance      = 0;
          goldenBallReward      = 0;
          referralReward        = 0;
          charityTiltAmount     = 0;
          creatorRoyaltyPercent = 0;
          leaderboardStructure  = "{\"top3\":true,\"rewards\":[{\"rank\":1,\"percent\":0},{\"rank\":2,\"percent\":0},{\"rank\":3,\"percent\":0}]}";
          leaderboardPeriod     = #Weekly;
        };
        tables.add("neon-nights", table);
        econs.add("neon-nights", economy);
        #ok(())
      };
    }
  };
};
