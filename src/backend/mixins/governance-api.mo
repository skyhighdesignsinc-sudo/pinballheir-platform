import Common "../types/common";
import GT "../types/governance";
import GovLib "../lib/governance";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

mixin (
  proposals : Map.Map<Nat, GT.Proposal>,
  votes     : Map.Map<Text, GT.Vote>,
) {

  func nowNat() : Nat {
    let t = Time.now();
    if (t >= 0) { t.toNat() } else { 0 }
  };

  public query func getProposals(
    status : ?Text,
    limit  : Nat,
    offset : Nat,
  ) : async [GT.Proposal] {
    GovLib.list(proposals, status, limit, offset)
  };

  public query func getProposal(id : Nat) : async ?GT.Proposal {
    GovLib.get(proposals, id)
  };

  public shared ({ caller }) func submitProposal(
    proposalType : Common.ProposalType,
    paramsJson   : Text,
    stakedAmount : Nat,
  ) : async Common.Result<Nat, Text> {
    // Use map size as next ID (monotonically increasing for new proposals)
    let id = proposals.size();
    GovLib.submit(proposals, id, caller, proposalType, paramsJson, stakedAmount, nowNat())
  };

  public shared ({ caller }) func voteOnProposal(
    proposalId : Nat,
    choice     : Common.VoteChoice,
    weight     : Nat,
  ) : async Common.Result<(), Text> {
    GovLib.vote(proposals, votes, caller, proposalId, choice, weight, nowNat())
  };

  // executeProposal is defined in main.mo to handle DAO side-effects by proposal type
  // (e.g. #ChangePlatformFee updates globalPlatformFeePct). Do not define it here.

};
