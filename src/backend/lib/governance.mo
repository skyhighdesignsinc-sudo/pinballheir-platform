import Common "../types/common";
import GT "../types/governance";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  public type Proposal = GT.Proposal;
  public type Vote     = GT.Vote;

  // ── Constants ─────────────────────────────────────────────────────────────

  let VOTING_PERIOD_NS : Nat = 604_800_000_000_000; // 7 days in nanoseconds
  let PRUNE_AFTER_NS   : Nat = 7_776_000_000_000_000; // 90 days in nanoseconds
  let QUORUM_PERCENT   : Nat = 50; // 50% quorum required

  func _now() : Nat {
    let t = Time.now();
    if (t >= 0) { t.toNat() } else { 0 }
  };

  // ── Burn percentage table ─────────────────────────────────────────────────

  public func burnPercentageFor(ptype : Common.ProposalType) : Nat {
    switch (ptype) {
      case (#UpdateCanister)          500;
      case (#UploadNewPhysicsEngine)  400;
      case (#BanPrincipal)            400;
      case (#DeleteProfile)           400;
      case (#DeleteObjectType)        300;
      case (#TreasuryAction)          300;
      case (#DeleteMethod)            300;
      case (#UpdateFrontend)          150;
      case (#UpdateCSS)               150;
      case (#UpdateJS)                150;
      case (#NewMethod)               150;
      case (#EditMethod)              150;
      case (#ConfigureProfileSchema)  150;
      case (#SetCharityWallet)        200;
      case (#ChangeGovernance)        200;
      case (#ChangePlatformFee)       300; // Critical economic parameter — same burn as TreasuryAction
      case (#DeleteAttribute)         200;
      case (#DeleteInstance)          200;
      case (#DeleteAsset)             200;
      case (#EditObjectType)          100;
      case (#DisputeScore)            100;
      case (#AddCurrency)             100;
      case (#RemoveCurrency)          100;
      case (#ConfigureGlobalAds)      100;
      case (#ReleaseTable)            200;
      case (#ChangeTableEconomy)       50;
      case (#NewObjectType)            50;
      case (#NewAttribute)             50;
      case (#EditAttribute)            50;
      case (#CreateInstance)           50;
      case (#EditInstance)             50;
      case (#UploadAsset)              50;
      case (#BatchOp)                  50;
      case (#SimulateProposal)          0; // never burns
    }
  };

  // ── Queries ───────────────────────────────────────────────────────────────

  public func list(
    proposals : Map.Map<Nat, Proposal>,
    status    : ?Text,
    limit     : Nat,
    offset    : Nat,
  ) : [Proposal] {
    let all = proposals.values();
    let filtered = switch (status) {
      case null all;
      case (?s) {
        all.filter(func (p : Proposal) : Bool {
          switch (p.status, s) {
            case (#Open,     "Open")     true;
            case (#Voting,   "Voting")   true;
            case (#Passed,   "Passed")   true;
            case (#Failed,   "Failed")   true;
            case (#Executed, "Executed") true;
            case (#Expired,  "Expired")  true;
            case _                       false;
          }
        })
      };
    };
    let arr = filtered.toArray();
    // Sort by id descending (newest first)
    let sorted = arr.sort(func (a : Proposal, b : Proposal) : { #less; #equal; #greater } {
      if (b.id > a.id) #less
      else if (b.id < a.id) #greater
      else #equal
    });
    let total = sorted.size();
    if (offset >= total) return [];
    let sliceEnd = if (limit == 0) { total } else { Nat.min(offset + limit, total) };
    sorted.sliceToArray(offset, sliceEnd)
  };

  public func get(proposals : Map.Map<Nat, Proposal>, id : Nat) : ?Proposal {
    proposals.get(id)
  };

  // ── Mutations ─────────────────────────────────────────────────────────────

  public func submit(
    proposals    : Map.Map<Nat, Proposal>,
    nextId       : Nat,
    caller       : Principal,
    ptype        : Common.ProposalType,
    paramsJson   : Text,
    stakedAmount : Nat,
    now_ts       : Common.Timestamp,
  ) : Common.Result<Nat, Text> {
    if (stakedAmount == 0 and ptype != #SimulateProposal) {
      return #err("Stake required for this proposal type");
    };
    let burnPct = burnPercentageFor(ptype);
    let proposal : Proposal = {
      id            = nextId;
      proposalType  = ptype;
      proposer      = caller;
      paramsJson;
      createdAt     = now_ts;
      votingEnds    = now_ts + VOTING_PERIOD_NS;
      status        = #Open;
      yesVotes      = 0;
      noVotes       = 0;
      abstainVotes  = 0;
      stakedAmount;
      burnPercentage = burnPct;
    };
    proposals.add(nextId, proposal);
    #ok(nextId)
  };

  public func vote(
    proposals : Map.Map<Nat, Proposal>,
    votes     : Map.Map<Text, Vote>,
    caller    : Principal,
    propId    : Nat,
    choice    : Common.VoteChoice,
    weight    : Nat,
    now_ts    : Common.Timestamp,
  ) : Common.Result<(), Text> {
    switch (proposals.get(propId)) {
      case null #err("Proposal not found");
      case (?p) {
        // Check proposal is open for voting
        switch (p.status) {
          case (#Executed) return #err("Proposal already executed");
          case (#Expired)  return #err("Proposal expired");
          case (#Failed)   return #err("Proposal failed");
          case _           ();
        };
        if (now_ts > p.votingEnds) return #err("Voting period ended");

        // Check caller hasn't already voted
        let voteKey = debug_show(propId) # "-" # caller.toText();
        if (votes.containsKey(voteKey)) return #err("Already voted");

        // Record vote
        let v : Vote = { proposalId = propId; voter = caller; choice; weight; timestamp = now_ts };
        votes.add(voteKey, v);

        // Update proposal tally
        let (newYes, newNo, newAbstain) = switch (choice) {
          case (#Yes)     (p.yesVotes + weight, p.noVotes,          p.abstainVotes);
          case (#No)      (p.yesVotes,          p.noVotes + weight, p.abstainVotes);
          case (#Abstain) (p.yesVotes,          p.noVotes,          p.abstainVotes + weight);
        };
        // Check if quorum reached → advance to Passed/Failed
        let total = newYes + newNo;
        let finalStatus : Common.ProposalStatus = if (total > 0 and newYes * 100 / total >= QUORUM_PERCENT) {
          #Passed
        } else if (now_ts > p.votingEnds) {
          if (newYes > newNo) #Passed else #Failed
        } else {
          #Voting
        };
        let updated : Proposal = {
          id           = p.id;
          proposalType = p.proposalType;
          proposer     = p.proposer;
          paramsJson   = p.paramsJson;
          createdAt    = p.createdAt;
          votingEnds   = p.votingEnds;
          status       = finalStatus;
          yesVotes     = newYes;
          noVotes      = newNo;
          abstainVotes = newAbstain;
          stakedAmount = p.stakedAmount;
          burnPercentage = p.burnPercentage;
        };
        proposals.add(propId, updated);
        #ok(())
      };
    }
  };

  public func execute(
    proposals : Map.Map<Nat, Proposal>,
    propId    : Nat,
    _caller   : Principal,
    _now_ts   : Common.Timestamp,
  ) : Common.Result<(), Text> {
    switch (proposals.get(propId)) {
      case null #err("Proposal not found");
      case (?p) {
        switch (p.status) {
          case (#Passed) {
            // Mark as executed — actual side effects are dispatched by main.mo
            let updated : Proposal = {
              id           = p.id;
              proposalType = p.proposalType;
              proposer     = p.proposer;
              paramsJson   = p.paramsJson;
              createdAt    = p.createdAt;
              votingEnds   = p.votingEnds;
              status       = #Executed;
              yesVotes     = p.yesVotes;
              noVotes      = p.noVotes;
              abstainVotes = p.abstainVotes;
              stakedAmount = p.stakedAmount;
              burnPercentage = p.burnPercentage;
            };
            proposals.add(propId, updated);
            // Burn staked amount (burnPercentage of stakedAmount)
            // TODO: replace with ICRC-2 ledger burn in production
            #ok(())
          };
          case (#Executed) #err("Already executed");
          case _ #err("Proposal not in Passed state");
        }
      };
    }
  };

  // ── Auto-prune expired proposals ─────────────────────────────────────────

  public func pruneExpired(
    proposals : Map.Map<Nat, Proposal>,
    now_ts    : Common.Timestamp,
  ) : () {
    let toExpire = List.empty<Nat>();
    proposals.forEach(func (id, p) {
      let isActive = switch (p.status) {
        case (#Open)   true;
        case (#Voting) true;
        case _         false;
      };
      if (isActive and now_ts > p.createdAt + PRUNE_AFTER_NS) {
        toExpire.add(id);
      };
    });
    toExpire.forEach(func (id : Nat) {
      switch (proposals.get(id)) {
        case null ();
        case (?p) {
          let expired : Proposal = {
            id           = p.id;
            proposalType = p.proposalType;
            proposer     = p.proposer;
            paramsJson   = p.paramsJson;
            createdAt    = p.createdAt;
            votingEnds   = p.votingEnds;
            status       = #Expired;
            yesVotes     = p.yesVotes;
            noVotes      = p.noVotes;
            abstainVotes = p.abstainVotes;
            stakedAmount = p.stakedAmount;
            burnPercentage = p.burnPercentage;
          };
          proposals.add(id, expired);
        };
      }
    });
  };
};
