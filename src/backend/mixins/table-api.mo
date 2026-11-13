import Common "../types/common";
import TT "../types/table";
import TableLib "../lib/table";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

mixin (
  tables  : Map.Map<Text, TT.PinballTable>,
  econs   : Map.Map<Text, TT.TableEconomy>,
  seasons : Map.Map<Text, TT.Season>,
  eggs    : Map.Map<Text, TT.EasterEgg>,
) {

  public query func getTables(filter : ?Text) : async [TT.PinballTable] {
    TableLib.list(tables, filter)
  };

  public query func getTable(id : Text) : async ?TT.PinballTable {
    TableLib.get(tables, id)
  };

  public shared ({ caller }) func addTable(
    input : TT.TableCreateInput
  ) : async Common.Result<Text, Text> {
    TableLib.create(tables, econs, caller, input)
  };

  public shared ({ caller }) func updateTable(
    id      : Text,
    updates : Text,
  ) : async Common.Result<(), Text> {
    TableLib.update(tables, caller, id, updates)
  };

  public shared ({ caller }) func releaseTable(id : Text) : async Common.Result<(), Text> {
    TableLib.release(tables, caller, id)
  };

  public shared ({ caller }) func forkTable(
    sourceTableId : Text
  ) : async Common.Result<Text, Text> {
    TableLib.fork(tables, econs, caller, sourceTableId)
  };

  public query func getTableEconomy(tableId : Text) : async ?TT.TableEconomy {
    TableLib.getEconomy(econs, tableId)
  };

  public shared ({ caller }) func updateTableEconomy(
    tableId : Text,
    updates : TT.EconomyUpdateInput,
  ) : async Common.Result<(), Text> {
    TableLib.updateEconomy(econs, tables, caller, tableId, updates)
  };

  public query func getSeasons(tableId : Text) : async [TT.Season] {
    TableLib.getSeasons(seasons, tableId)
  };

  public shared ({ caller }) func createSeason(
    tableId         : Text,
    endTime         : Nat,
    bonusMultiplier : Nat,
  ) : async Common.Result<Text, Text> {
    TableLib.createSeason(seasons, tables, caller, tableId, endTime, bonusMultiplier)
  };

  public query func getEasterEggs(tableId : Text) : async [TT.EasterEgg] {
    TableLib.getEasterEggs(eggs, tableId)
  };

  public shared ({ caller }) func discoverEasterEgg(
    tableId : Text,
    eggId   : Text,
  ) : async Common.Result<Nat, Text> {
    TableLib.discoverEgg(eggs, caller, tableId, eggId)
  };

  public shared func initializeGenesisTable() : async Common.Result<(), Text> {
    TableLib.initGenesis(tables, econs)
  };

};
