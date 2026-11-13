import Principal "mo:core/Principal";

module {
  // ── Primitive aliases ──────────────────────────────────────────────────────
  public type AssetId    = Text;
  public type TableId    = Text;
  public type UserId     = Principal;
  public type Timestamp  = Nat; // nanoseconds from Time.now() cast to Nat

  // ── Shared result alias ────────────────────────────────────────────────────
  public type Result<T, E> = { #ok : T; #err : E };

  // ── Governance variants ────────────────────────────────────────────────────
  public type ProposalStatus = {
    #Open;
    #Voting;
    #Passed;
    #Failed;
    #Executed;
    #Expired;
  };

  public type ProposalType = {
    #NewObjectType;
    #EditObjectType;
    #DeleteObjectType;
    #NewAttribute;
    #EditAttribute;
    #DeleteAttribute;
    #NewMethod;
    #EditMethod;
    #DeleteMethod;
    #CreateInstance;
    #EditInstance;
    #DeleteInstance;
    #UploadAsset;
    #DeleteAsset;
    #UploadNewPhysicsEngine;
    #UpdateFrontend;
    #UpdateCSS;
    #UpdateJS;
    #UpdateCanister;
    #ReleaseTable;
    #ChangeTableEconomy;
    #AddCurrency;
    #RemoveCurrency;
    #ConfigureProfileSchema;
    #ConfigureGlobalAds;
    #TreasuryAction;
    #SetCharityWallet;
    #BanPrincipal;
    #DeleteProfile;
    #DisputeScore;
    #ChangeGovernance;
    #ChangePlatformFee;
    #BatchOp;
    #SimulateProposal;
  };

  public type VoteChoice = { #Yes; #No; #Abstain };

  public type LeaderboardPeriod = { #Daily; #Weekly };
};
