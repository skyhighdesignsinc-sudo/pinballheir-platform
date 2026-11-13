import Common "../types/common";

module {
  public type Proposal = {
    id            : Nat;
    proposalType  : Common.ProposalType;
    proposer      : Common.UserId;
    paramsJson    : Text;
    createdAt     : Common.Timestamp;
    votingEnds    : Common.Timestamp;
    status        : Common.ProposalStatus;
    yesVotes      : Nat;
    noVotes       : Nat;
    abstainVotes  : Nat;
    stakedAmount  : Nat;
    burnPercentage : Nat;
  };

  public type Vote = {
    proposalId : Nat;
    voter      : Common.UserId;
    choice     : Common.VoteChoice;
    weight     : Nat;
    timestamp  : Common.Timestamp;
  };
};
