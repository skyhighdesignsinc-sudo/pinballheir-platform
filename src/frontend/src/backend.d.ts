import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    replayHash?: string;
    displayName: string;
    player: UserId;
    badges: Array<string>;
    bonusMultiplier: bigint;
    tableId: TableId;
    score: bigint;
    timestamp: Timestamp;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Result_2 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface PlayerProfile {
    id: UserId;
    bio: string;
    referralCode: string;
    profilePicAssetId?: AssetId;
    hideFromLeaderboard: boolean;
    twitter?: string;
    referredByTable?: TableId;
    displayName: string;
    websiteUrl?: string;
    createdAt: Timestamp;
    badges: Array<string>;
    bannerAssetId?: AssetId;
    discord?: string;
    telegram?: string;
}
export interface TableCreateInput {
    creator: UserId;
    daoJson: string;
    name: string;
    soundJson: string;
    accessJson: string;
    metadataJson: string;
    visualsJson: string;
    economyJson: string;
    rulesetJson: string;
    layoutJson: string;
    physicsJson: string;
}
export type Result_1 = {
    __kind__: "ok";
    ok: boolean;
} | {
    __kind__: "err";
    err: string;
};
export interface TableEconomy {
    jackpotPercent: bigint;
    owner: UserId;
    referralReward: bigint;
    tableId: TableId;
    leaderboardStructure: string;
    creatorRoyaltyPercent: bigint;
    goldenBallChance: bigint;
    charityTiltAmount: bigint;
    saveBallPrice: bigint;
    entryFee: bigint;
    icfcTreasury: bigint;
    nudgePrice: bigint;
    goldenBallReward: bigint;
    leaderboardPeriod: LeaderboardPeriod;
}
export type Result_4 = {
    __kind__: "ok";
    ok: MarketAsset;
} | {
    __kind__: "err";
    err: string;
};
export interface Season {
    id: string;
    startTime: Timestamp;
    endTime: Timestamp;
    bonusMultiplier: bigint;
    tableId: TableId;
    archiveJson: string;
}
export interface Achievement {
    id: string;
    iconAssetId: AssetId;
    name: string;
    description: string;
    condition: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CreatorBalance {
    principal: UserId;
    lastClaimed?: Timestamp;
    totalEarned: bigint;
    claimable: bigint;
}
export interface CoOpSession {
    id: string;
    lastActivity: Timestamp;
    tableId: TableId;
    lives: bigint;
    score: bigint;
    players: Array<UserId>;
}
export interface EconomyUpdateInput {
    jackpotPercent?: bigint;
    referralReward?: bigint;
    leaderboardStructure?: string;
    goldenBallChance?: bigint;
    charityTiltAmount?: bigint;
    saveBallPrice?: bigint;
    entryFee?: bigint;
    nudgePrice?: bigint;
    goldenBallReward?: bigint;
    leaderboardPeriod?: LeaderboardPeriod;
}
export interface PinballTable {
    id: TableId;
    status: TableStatus;
    creator: UserId;
    daoJson: string;
    tableWidth: bigint;
    name: string;
    createdAt: Timestamp;
    soundJson: string;
    accessJson: string;
    flipperStrength: number;
    gravity: number;
    visualsJson: string;
    friction: number;
    rebound: number;
    backgroundAssetId: AssetId;
    economyJson: string;
    tiltSensitivity: number;
    tableHeight: bigint;
    physicsWasmId?: AssetId;
    rulesetJson: string;
    layoutJson: string;
    musicId?: AssetId;
}
export interface SkinCollection {
    id: string;
    name: string;
    minted: bigint;
    creatorPrincipal: UserId;
    priceICFC: bigint;
    maxSupply: bigint;
    itemsJson: string;
    symbol: string;
}
export interface MarketAsset {
    id: AssetId;
    status: AssetStatus;
    creator: UserId;
    codeContent?: string;
    royaltyBps: bigint;
    approvedAt?: Timestamp;
    name: string;
    tags: Array<string>;
    submittedAt: Timestamp;
    description: string;
    mintedAsNft: boolean;
    nftTokenId?: bigint;
    storageUrl?: string;
    assetType: AssetType;
    fileCategory: FileCategory;
}
export interface EasterEgg {
    id: string;
    tableId: TableId;
    description: string;
    rewardICFC: bigint;
    discovered: boolean;
    discoverer?: UserId;
}
export interface Proposal {
    id: bigint;
    status: ProposalStatus;
    noVotes: bigint;
    yesVotes: bigint;
    paramsJson: string;
    createdAt: Timestamp;
    proposalType: ProposalType;
    votingEnds: Timestamp;
    proposer: UserId;
    abstainVotes: bigint;
    stakedAmount: bigint;
    burnPercentage: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export type Result_3 = {
    __kind__: "ok";
    ok: bigint;
} | {
    __kind__: "err";
    err: string;
};
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface ReplayRecord {
    id: string;
    rngSeed: string;
    disputed: boolean;
    playerId: UserId;
    tableId: TableId;
    score: bigint;
    movesJson: string;
    timestamp: Timestamp;
    initialParamsJson: string;
    scoreHash: string;
}
export interface ProfileUpdateInput {
    bio: string;
    hideFromLeaderboard: boolean;
    twitter?: string;
    displayName: string;
    websiteUrl?: string;
    discord?: string;
    telegram?: string;
}
export type TableId = string;
export type AssetId = string;
export enum AssetFilter {
    all = "all",
    files = "files",
    pending = "pending",
    code = "code",
    approved = "approved"
}
export enum AssetStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum AssetType {
    code = "code",
    file = "file"
}
export enum FileCategory {
    glb = "glb",
    mp3 = "mp3",
    svg = "svg",
    wav = "wav",
    json = "json",
    threejs = "threejs",
    texture = "texture",
    image = "image"
}
export enum LeaderboardPeriod {
    Weekly = "Weekly",
    Daily = "Daily"
}
export enum ProposalStatus {
    Failed = "Failed",
    Passed = "Passed",
    Open = "Open",
    Executed = "Executed",
    Voting = "Voting",
    Expired = "Expired"
}
export enum ProposalType {
    SetCharityWallet = "SetCharityWallet",
    RemoveCurrency = "RemoveCurrency",
    EditAttribute = "EditAttribute",
    BanPrincipal = "BanPrincipal",
    UpdateCSS = "UpdateCSS",
    UploadAsset = "UploadAsset",
    UploadNewPhysicsEngine = "UploadNewPhysicsEngine",
    UpdateFrontend = "UpdateFrontend",
    DeleteMethod = "DeleteMethod",
    UpdateJS = "UpdateJS",
    CreateInstance = "CreateInstance",
    DeleteInstance = "DeleteInstance",
    DisputeScore = "DisputeScore",
    ChangePlatformFee = "ChangePlatformFee",
    NewMethod = "NewMethod",
    ChangeGovernance = "ChangeGovernance",
    UpdateCanister = "UpdateCanister",
    BatchOp = "BatchOp",
    DeleteProfile = "DeleteProfile",
    ReleaseTable = "ReleaseTable",
    DeleteAsset = "DeleteAsset",
    DeleteAttribute = "DeleteAttribute",
    AddCurrency = "AddCurrency",
    EditInstance = "EditInstance",
    ConfigureGlobalAds = "ConfigureGlobalAds",
    DeleteObjectType = "DeleteObjectType",
    EditMethod = "EditMethod",
    EditObjectType = "EditObjectType",
    NewObjectType = "NewObjectType",
    NewAttribute = "NewAttribute",
    ChangeTableEconomy = "ChangeTableEconomy",
    TreasuryAction = "TreasuryAction",
    ConfigureProfileSchema = "ConfigureProfileSchema",
    SimulateProposal = "SimulateProposal"
}
export enum TableStatus {
    Beta = "Beta",
    Released = "Released"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VoteChoice {
    No = "No",
    Yes = "Yes",
    Abstain = "Abstain"
}
export interface backendInterface {
    addTable(input: TableCreateInput): Promise<Result_2>;
    approveAsset(id: AssetId): Promise<Result_4>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimRoyalties(): Promise<Result_3>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createSeason(tableId: string, endTime: bigint, bonusMultiplier: bigint): Promise<Result_2>;
    discoverEasterEgg(tableId: string, eggId: string): Promise<Result_3>;
    executeProposal(propId: bigint): Promise<Result>;
    forkTable(sourceTableId: string): Promise<Result_2>;
    getAchievements(): Promise<Array<Achievement>>;
    getAsset(id: AssetId): Promise<MarketAsset | null>;
    getAssets(filter: AssetFilter): Promise<Array<MarketAsset>>;
    getCallerUserProfile(): Promise<PlayerProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCharityWallet(): Promise<Principal | null>;
    getCoOpSession(sessionId: string): Promise<CoOpSession | null>;
    getCreatorBalance(creator: Principal): Promise<CreatorBalance>;
    getDailyMysteryTable(): Promise<string | null>;
    getEasterEggs(tableId: string): Promise<Array<EasterEgg>>;
    /**
     * / Returns the global platform fee percentage (0–100).
     * / Only the DAO can change this via a #ChangePlatformFee proposal.
     */
    getGlobalPlatformFee(): Promise<bigint>;
    getGlobalTreasury(): Promise<bigint>;
    getLeaderboard(tableId: string | null, period: string, limit: bigint): Promise<Array<LeaderboardEntry>>;
    getPlayerAchievements(principal: Principal): Promise<Array<string>>;
    getProposal(id: bigint): Promise<Proposal | null>;
    getProposals(status: string | null, limit: bigint, offset: bigint): Promise<Array<Proposal>>;
    getReplayRecord(id: string): Promise<ReplayRecord | null>;
    getSeasons(tableId: string): Promise<Array<Season>>;
    getSkinCollections(): Promise<Array<SkinCollection>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTable(id: string): Promise<PinballTable | null>;
    getTableEconomy(tableId: string): Promise<TableEconomy | null>;
    getTables(filter: string | null): Promise<Array<PinballTable>>;
    getUserProfile(principal: Principal): Promise<PlayerProfile | null>;
    giftTokens(to: Principal, amount: bigint, memo: string | null): Promise<Result>;
    initializeGenesisTable(): Promise<Result>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    joinCoOpSession(tableId: string): Promise<Result_2>;
    launchTournament(tableId: string, prizePool: bigint, durationHours: bigint): Promise<Result_2>;
    leaveCoOpSession(sessionId: string): Promise<Result>;
    nudgeTable(tableId: string): Promise<Result>;
    purchaseSkin(skinCollectionId: string, itemId: string): Promise<Result>;
    rejectAsset(id: AssetId): Promise<Result_4>;
    releaseTable(id: string): Promise<Result>;
    saveCallerUserProfile(input: ProfileUpdateInput): Promise<Result>;
    saveTheBall(tableId: string): Promise<Result>;
    setCharityWallet(wallet: Principal): Promise<Result>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitAsset(id: AssetId, name: string, description: string, tags: Array<string>, assetType: AssetType, fileCategory: FileCategory, storageUrl: string | null, codeContent: string | null, royaltyBps: bigint): Promise<Result_4>;
    submitProposal(proposalType: ProposalType, paramsJson: string, stakedAmount: bigint): Promise<Result_3>;
    submitReplay(tableId: string, movesJson: string, initialParamsJson: string, rngSeed: string, score: bigint): Promise<Result_2>;
    submitScore(tableId: string, score: bigint, replayJson: string, rngSeed: string): Promise<Result>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    triggerCharityTilt(tableId: string, amount: bigint): Promise<Result>;
    triggerGoldenBall(tableId: string): Promise<Result_1>;
    updateTable(id: string, updates: string): Promise<Result>;
    updateTableEconomy(tableId: string, updates: EconomyUpdateInput): Promise<Result>;
    voteOnProposal(proposalId: bigint, choice: VoteChoice, weight: bigint): Promise<Result>;
}
