import Common "../types/common";
import Types "../types/profile";
import ProfileLib "../lib/profile";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

mixin (profiles : Map.Map<Principal, ProfileLib.PlayerProfile>) {

  /// Returns the caller's own profile.
  public query ({ caller }) func getCallerUserProfile() : async ?ProfileLib.PlayerProfile {
    ProfileLib.get(profiles, caller)
  };

  /// Returns any player's public profile.
  public query func getUserProfile(principal : Principal) : async ?ProfileLib.PlayerProfile {
    ProfileLib.get(profiles, principal)
  };

  /// Create or update the caller's profile.
  public shared ({ caller }) func saveCallerUserProfile(
    input : Types.ProfileUpdateInput
  ) : async Common.Result<(), Text> {
    ProfileLib.upsert(profiles, caller, input)
  };

  /// Return all badge IDs earned by a player.
  public query func getPlayerAchievements(principal : Principal) : async [Text] {
    ProfileLib.getPlayerBadges(profiles, principal)
  };

};
