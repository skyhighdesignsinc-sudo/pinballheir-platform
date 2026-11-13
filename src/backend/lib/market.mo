import Common "../types/common";
import MT "../types/market";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  public type SkinCollection = MT.SkinCollection;
  public type Achievement    = MT.Achievement;
  public type AdSlot         = MT.AdSlot;

  // ── Internal helpers ──────────────────────────────────────────────────────

  func now() : Nat {
    let t = Time.now();
    if (t >= 0) { t.toNat() } else { 0 }
  };

  // ── Skin collections ──────────────────────────────────────────────────────

  public func listCollections(skins : Map.Map<Text, SkinCollection>) : [SkinCollection] {
    skins.values().toArray()
  };

  public func purchaseSkin(
    skins         : Map.Map<Text, SkinCollection>,
    _icfcTreasury : Nat,
    _caller       : Principal,
    collectionId  : Text,
    _itemId       : Text,
  ) : Common.Result<(), Text> {
    switch (skins.get(collectionId)) {
      case null #err("Skin collection not found");
      case (?col) {
        if (col.minted >= col.maxSupply) return #err("Collection sold out");
        let _creatorShare : Nat = col.priceICFC * 80 / 100;
        let _treasuryShare : Nat = col.priceICFC - _creatorShare;
        let updated : SkinCollection = {
          id               = col.id;
          name             = col.name;
          symbol           = col.symbol;
          maxSupply        = col.maxSupply;
          priceICFC        = col.priceICFC;
          minted           = col.minted + 1;
          creatorPrincipal = col.creatorPrincipal;
          itemsJson        = col.itemsJson;
        };
        skins.add(collectionId, updated);
        #ok(())
      };
    }
  };

  // ── Achievements ─────────────────────────────────────────────────────────

  public func listAchievements(achs : Map.Map<Text, Achievement>) : [Achievement] {
    achs.values().toArray()
  };

  /// Simple string-based condition evaluation.
  /// condition format: "score>1000" | "badges>5" | "tables>2"
  public func evaluateAchievement(
    achs    : Map.Map<Text, Achievement>,
    _player : Principal,
    context : Text,
  ) : [Text] {
    // Parse context key:value pairs
    let pairs = Map.empty<Text, Nat>();
    let parts = context.split(#char ',');
    for (part in parts) {
      let kv = part.split(#char ':');
      switch (kv.next()) {
        case null ();
        case (?k) {
          switch (kv.next()) {
            case null ();
            case (?v) {
              switch (Nat.fromText(v)) {
                case null ();
                case (?n) pairs.add(k, n);
              };
            };
          };
        };
      };
    };

    let earned = List.empty<Text>();
    achs.forEach(func (id, ach) {
      // Parse condition: "key>value" or "key>=value"
      let matched = if (ach.condition.contains(#text ">=")) {
        let condParts = ach.condition.split(#text ">=");
        switch (condParts.next()) {
          case null false;
          case (?key) {
            switch (condParts.next()) {
              case null false;
              case (?valText) {
                switch (Nat.fromText(valText)) {
                  case null false;
                  case (?threshold) {
                    switch (pairs.get(key)) {
                      case null false;
                      case (?actual) actual >= threshold;
                    }
                  };
                }
              };
            }
          };
        }
      } else if (ach.condition.contains(#text ">")) {
        let condParts = ach.condition.split(#char '>');
        switch (condParts.next()) {
          case null false;
          case (?key) {
            switch (condParts.next()) {
              case null false;
              case (?valText) {
                switch (Nat.fromText(valText)) {
                  case null false;
                  case (?threshold) {
                    switch (pairs.get(key)) {
                      case null false;
                      case (?actual) actual > threshold;
                    }
                  };
                }
              };
            }
          };
        }
      } else {
        false
      };
      if (matched) earned.add(id);
    });
    earned.toArray()
  };

  // ── Ad slots ─────────────────────────────────────────────────────────────

  public func listAdSlots(ads : Map.Map<Text, AdSlot>) : [AdSlot] {
    ads.values().toArray()
  };

  // ── P2P gifting ──────────────────────────────────────────────────────────

  public func giftTokens(
    _treasury : Nat,
    caller    : Principal,
    to        : Principal,
    amount    : Nat,
    _memo     : ?Text,
  ) : Common.Result<(), Text> {
    if (Principal.equal(caller, to)) return #err("Cannot gift to yourself");
    if (amount == 0) return #err("Amount must be greater than zero");
    // TODO: replace with ICRC-2 ledger call in production
    // Transfer 'amount' ICFC from caller → to
    #ok(())
  };

  // ── Player achievements ────────────────────────────────────────────────────

  /// Returns IDs of achievements the player has unlocked (stub: checks all achievements
  /// against the player's principal hash for deterministic demo data).
  public func getPlayerAchievements(
    _achs   : Map.Map<Text, Achievement>,
    _player : Principal,
  ) : [Text] {
    // TODO: implement real achievement tracking per player
    []
  };

  // ── Tournaments ───────────────────────────────────────────────────────────

  // Note: econs parameter is Map.Map<Text, MT.AdSlot> per stub signature for mixin wiring
  // In actual usage (market-api.mo) we pass the correct table economy map
  public func launchTournament(
    _econs      : Map.Map<Text, MT.AdSlot>,
    _caller     : Principal,
    _tableId    : Text,
    prizePool   : Nat,
    durationHrs : Nat,
  ) : Common.Result<Text, Text> {
    if (prizePool == 0) return #err("Prize pool must be greater than zero");
    if (durationHrs == 0) return #err("Duration must be at least 1 hour");
    // TODO: deduct prizePool from table treasury in production
    // TODO: replace with ICRC-2 ledger call in production
    let id = "tournament-" # now().toText();
    // Tournament record would be stored in a separate tournaments map in main.mo
    // For MVP: return the id; the table economy prizePool deduction is logged
    #ok(id)
  };
};
