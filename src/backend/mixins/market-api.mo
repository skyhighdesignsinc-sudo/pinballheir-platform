import Common "../types/common";
import MT "../types/market";
import MarketLib "../lib/market";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

mixin (
  skins        : Map.Map<Text, MT.SkinCollection>,
  achievements : Map.Map<Text, MT.Achievement>,
  ads          : Map.Map<Text, MT.AdSlot>,
) {

  public query func getSkinCollections() : async [MT.SkinCollection] {
    MarketLib.listCollections(skins)
  };

  public shared ({ caller }) func purchaseSkin(
    skinCollectionId : Text,
    itemId           : Text,
  ) : async Common.Result<(), Text> {
    MarketLib.purchaseSkin(skins, 0, caller, skinCollectionId, itemId)
  };

  public query func getAchievements() : async [MT.Achievement] {
    MarketLib.listAchievements(achievements)
  };

  public shared ({ caller }) func giftTokens(
    to     : Principal,
    amount : Nat,
    memo   : ?Text,
  ) : async Common.Result<(), Text> {
    MarketLib.giftTokens(0, caller, to, amount, memo)
  };

  public shared ({ caller }) func launchTournament(
    tableId       : Text,
    prizePool     : Nat,
    durationHours : Nat,
  ) : async Common.Result<Text, Text> {
    MarketLib.launchTournament(ads, caller, tableId, prizePool, durationHours)
  };

};
