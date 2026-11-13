// ─── Re-export backend types that pages may need ─────────────────────────────
// NOTE: backend.ts is auto-generated (do not edit). These frontend types extend
// or alias the generated types for page-layer consumption.

import type {
  Achievement as BackendAchievement,
  LeaderboardEntry as BackendLeaderboardEntry,
  PinballTable as BackendPinballTable,
  PlayerProfile as BackendPlayerProfile,
  Proposal as BackendProposal,
  TableEconomy as BackendTableEconomy,
} from "../backend";

// Frontend-only AdSlot type (no backend equivalent)
export interface AdSlot {
  id: string;
  tableId?: string;
  position?: string;
  size?: string;
  cpmICFC?: number;
  cpcICFC?: number;
  content?: string;
  revenueShare?: bigint;
}

// Frontend-only Badge type
export interface Badge {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  tier?: "Bronze" | "Silver" | "Gold" | "Diamond";
  earnedAt?: bigint;
}

// Extended Achievement with frontend-only fields
export type Achievement = BackendAchievement & {
  icon?: string;
  unlockedAt?: bigint;
  reward?: string;
};

// Extended LeaderboardEntry with frontend-only fields
export type LeaderboardEntry = BackendLeaderboardEntry & {
  playerName?: string;
};

// Extended TableEconomy with frontend-only fields
export type TableEconomy = BackendTableEconomy & {
  jackpotBalance?: number;
  totalPayouts?: number;
  totalGamesPlayed?: number;
  lastUpdated?: bigint;
};

// Extended UserProfile (aliased from backend PlayerProfile) with frontend-only fields
export type UserProfile = BackendPlayerProfile & {
  avatarUrl?: string;
  totalGamesPlayed?: number;
  totalScore?: bigint;
};

// ─── Extended PinballTable with frontend-only structured fields ───────────────
// The backend PinballTable uses flat fields; pages use nested sub-objects for
// cleaner component APIs. This extended type adds those as optional overlays.

export interface PinballTableEconomy {
  playCostICFC?: number;
  playCostICP?: number;
  jackpotSeedICP?: number;
  jackpotContributionPct?: number;
  platformFeePct?: number;
  ownerRevenuePct?: number;
  playerPrizePct?: number;
  referralRewardICP?: number;
  referralEnabled?: boolean;
  adSlotEnabled?: boolean;
  tournamentFeeICP?: number;
}

export interface PinballTableLayout {
  bumpers?: BumperConfig[];
  flippers?: FlipperConfig[];
  ramps?: RampConfig[];
  drainWidth?: number;
  drainPosition?: number;
  plungerX?: number;
  plungerY?: number;
  playFieldWidth?: number;
  playFieldHeight?: number;
  gravity?: number;
}

export interface PinballTableVisual {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  lightTheme?: LightThemeType;
  backgroundImage?: string;
  playFieldTexture?: string;
  ballSkin?: BallSkinType;
  enableNeonGlow?: boolean;
  enableParticleEffects?: boolean;
  ballTrailEffect?: boolean;
  // Bumper visual config
  bumperColor?: string;
  bumperGlowColor?: string;
  bumperSize?: number;
  bumperGlowIntensity?: number;
  bumperHitFlashColor?: string;
  // Flipper visual config
  flipperColor?: string;
  flipperGlowColor?: string;
  flipperLength?: number;
  flipperThickness?: number;
  flipperGlowIntensity?: number;
}

export interface PinballTablePhysics {
  gravity?: number;
  ballWeight?: number;
  flipperForce?: number;
  bumperForce?: number;
  friction?: number;
  restitution?: number;
  plungerForce?: number;
  tiltSensitivity?: number;
  maxAngularVelocity?: number;
}

export interface PinballTableRuleset {
  tiltEnabled?: boolean;
  tiltWarnings?: number;
  ballSaveEnabled?: boolean;
  ballSaveDurationSecs?: number;
  extraBallEnabled?: boolean;
  extraBallThreshold?: number;
  multiBallEnabled?: boolean;
  multiBallCount?: number;
  bonusMultiplierEnabled?: boolean;
  maxBonusMultiplier?: number;
  timeBonusEnabled?: boolean;
  ballsPerGame?: number;
  highScoreRequired?: number;
}

export interface PinballTableMetadata {
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  previewVideo?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  tags?: string[];
  version?: string;
  changelog?: string;
  createdAt?: bigint;
  updatedAt?: bigint;
  author?: string;
}

export interface PinballTableAccess {
  accessType?: TableAccessType;
  whitelist?: string[];
  maxConcurrentPlayers?: number;
  maxDailyPlayers?: number;
  minICFCToPlay?: number;
  geographicRestrictions?: string[];
}

export interface PinballTableDAO {
  ownerPrincipal?: string;
  governanceToken?: string;
  votingThreshold?: number;
  quorumPct?: number;
  proposalDelayHours?: number;
  proposalDurationHours?: number;
  allowTableProposals?: boolean;
}

// Extended PinballTable: backend flat fields + frontend nested structures
export type PinballTable = BackendPinballTable & {
  // Frontend-only structured sub-objects
  physics?: PinballTablePhysics;
  layout?: PinballTableLayout;
  visual?: PinballTableVisual;
  economy?: PinballTableEconomy;
  ruleset?: PinballTableRuleset;
  metadata?: PinballTableMetadata;
  access?: PinballTableAccess;
  dao?: PinballTableDAO;
  // Frontend-only flags
  isGenesis?: boolean;
  isActive?: boolean;
};

// ─── Extended Proposal with frontend-only fields ──────────────────────────────
export type Proposal = BackendProposal & {
  type?: ProposalType;
  title?: string;
  description?: string;
  votesYes?: number;
  votesNo?: number;
  votesAbstain?: number;
  quorumRequired?: number;
  endsAt?: bigint;
  executedAt?: bigint;
  payload?: string;
  voteList?: Vote[];
};

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum TableStatus {
  Beta = "Beta",
  Released = "Released",
}

export enum TableAccessType {
  Public = "Public",
  TokenGated = "TokenGated",
  Whitelist = "Whitelist",
  InviteOnly = "InviteOnly",
}

export enum BallSkinType {
  Classic = "Classic",
  Chrome = "Chrome",
  NeonPurple = "NeonPurple",
  NeonCyan = "NeonCyan",
  Holographic = "Holographic",
  Fire = "Fire",
  Ice = "Ice",
  Galaxy = "Galaxy",
}

export enum LightThemeType {
  Cyberpunk = "Cyberpunk",
  Space = "Space",
  Ocean = "Ocean",
  Forest = "Forest",
  Inferno = "Inferno",
  Custom = "Custom",
}

export enum WeatherType {
  None = "None",
  Rain = "Rain",
  Snow = "Snow",
  Fireflies = "Fireflies",
  NorthernLights = "NorthernLights",
  Confetti = "Confetti",
  MeteorShower = "MeteorShower",
}

export enum DifficultyLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Expert = "Expert",
}

export enum LeaderboardPeriod {
  Daily = "Daily",
  Weekly = "Weekly",
  AllTime = "AllTime",
}

export enum VoteChoice {
  Yes = "Yes",
  No = "No",
  Abstain = "Abstain",
}

export enum ProposalStatus {
  Open = "Open",
  Passed = "Passed",
  Rejected = "Rejected",
  Executed = "Executed",
  Expired = "Expired",
}

export enum ProposalType {
  // Schema mutations
  NewObjectType = "NewObjectType",
  EditObjectType = "EditObjectType",
  DeleteObjectType = "DeleteObjectType",
  NewAttribute = "NewAttribute",
  EditAttribute = "EditAttribute",
  DeleteAttribute = "DeleteAttribute",
  NewMethod = "NewMethod",
  EditMethod = "EditMethod",
  DeleteMethod = "DeleteMethod",
  // Instance mutations
  CreateInstance = "CreateInstance",
  EditInstance = "EditInstance",
  DeleteInstance = "DeleteInstance",
  // Assets
  UploadAsset = "UploadAsset",
  DeleteAsset = "DeleteAsset",
  UploadNewPhysicsEngine = "UploadNewPhysicsEngine",
  // Frontend
  UpdateFrontend = "UpdateFrontend",
  UpdateCSS = "UpdateCSS",
  UpdateJS = "UpdateJS",
  UpdateCanister = "UpdateCanister",
  // Table governance
  ReleaseTable = "ReleaseTable",
  ChangeTableEconomy = "ChangeTableEconomy",
  // Token / currency
  AddCurrency = "AddCurrency",
  RemoveCurrency = "RemoveCurrency",
  // Profile
  ConfigureProfileSchema = "ConfigureProfileSchema",
  // Ads
  ConfigureGlobalAds = "ConfigureGlobalAds",
  // Treasury
  TreasuryAction = "TreasuryAction",
  SetCharityWallet = "SetCharityWallet",
  // Moderation
  BanPrincipal = "BanPrincipal",
  DeleteProfile = "DeleteProfile",
  DisputeScore = "DisputeScore",
  // Governance config
  ChangeGovernance = "ChangeGovernance",
  // Batch / simulate
  BatchOp = "BatchOp",
  SimulateProposal = "SimulateProposal",
}

// ─── Table Constructor Data (9 tabs) ─────────────────────────────────────────

export interface BumperConfig {
  id: string;
  x: number;
  y: number;
  radius: number;
  points: number;
  color?: string;
}

export interface FlipperConfig {
  id: string;
  side: "left" | "right";
  x: number;
  y: number;
  length: number;
  angle: number;
}

export interface RampConfig {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  points: number;
  label?: string;
}

export interface ConstructorLayoutTab {
  bumpers: BumperConfig[];
  flippers: FlipperConfig[];
  ramps: RampConfig[];
  drainWidth: number;
  plungerX: number;
  plungerY: number;
  playFieldWidth: number;
  playFieldHeight: number;
}

export interface ConstructorVisualsTab {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  feltColor: string;
  backgroundColor: string;
  lightTheme: LightThemeType;
  ballSkin: BallSkinType;
  enableNeonGlow: boolean;
  enableParticleEffects: boolean;
  weatherType: WeatherType;
  customLightColor: string;
}

export interface ConstructorPhysicsTab {
  gravityMultiplier: number;
  ballWeight: number;
  flipperStrength: number;
  bumperReboundForce: number;
  friction: number;
  restitution: number;
  plungerType: "spring" | "digital" | "auto";
  tiltSensitivity: "off" | "low" | "medium" | "high";
  enableFlipperLag: boolean;
  flipperLagMs: number;
}

export interface ConstructorEconomyTab {
  playCostICFC: number;
  jackpotSeedAmount: number;
  jackpotContributionPct: number;
  leaderboardPrizePct: number;
  referralRewardAmount: number;
  referralEnabled: boolean;
  saveTheBallFee: number;
  nudgeFee: number;
  goldenBallChance: number;
  goldenBallReward: number;
  adSlotEnabled: boolean;
  tournamentPrizePool: number;
  charityTiltAmount: number;
}

export interface ConstructorRulesetTab {
  tiltEnabled: boolean;
  tiltWarnings: number;
  ballSaveEnabled: boolean;
  ballSaveDurationSecs: number;
  extraBallEnabled: boolean;
  extraBallCondition: string;
  multiBallEnabled: boolean;
  multiBallCount: number;
  bonusMultiplierEnabled: boolean;
  bonusMultiplierRule: string;
  maxBonusMultiplier: number;
  timeBonusEnabled: boolean;
  ballsPerGame: number;
  difficulty: DifficultyLevel;
  coopEnabled: boolean;
  coopMaxPlayers: number;
}

export interface ConstructorMetadataTab {
  name: string;
  description: string;
  shortDescription: string;
  tags: string[];
  version: string;
  changelog: string;
}

export interface ConstructorAccessTab {
  accessType: TableAccessType;
  whitelist: string[];
  maxConcurrentPlayers: number;
  maxDailyPlayers: number;
  minICFCToPlay: number;
  geographicRestrictions: string[];
}

export interface ConstructorDAOTab {
  ownerPrincipal: string;
  governanceToken: string;
  tableVotingThreshold: number;
  quorumPct: number;
  proposalDelayHours: number;
  proposalDurationHours: number;
  allowTableProposals: boolean;
}

export interface ConstructorSoundTab {
  backgroundMusicUrl: string;
  backgroundMusicEnabled: boolean;
  backgroundVolume: number;
  bumperSoundUrl: string;
  flipperSoundUrl: string;
  drainSoundUrl: string;
  jackpotSoundUrl: string;
  tileSoundUrl: string;
  hapticsEnabled: boolean;
  hapticPatternUrl: string;
  pinballRadioEnabled: boolean;
}

export interface TableConstructorData {
  layout: ConstructorLayoutTab;
  visuals: ConstructorVisualsTab;
  physics: ConstructorPhysicsTab;
  economy: ConstructorEconomyTab;
  ruleset: ConstructorRulesetTab;
  metadata: ConstructorMetadataTab;
  access: ConstructorAccessTab;
  dao: ConstructorDAOTab;
  sound: ConstructorSoundTab;
}

// ─── Additional frontend-only types ──────────────────────────────────────────

export interface SkinCollection {
  id: string;
  name: string;
  symbol: string;
  maxSupply: number;
  priceICFC: number;
  items: SkinItem[];
}

export interface SkinItem {
  id: string;
  name: string;
  assetUrl: string;
  skinType: "ball" | "flipper" | "trail";
}

export interface Season {
  id: string;
  tableId: string;
  startTime: bigint;
  endTime: bigint;
  bonusMultiplier: number;
  archived: boolean;
}

export interface EasterEgg {
  id: string;
  tableId: string;
  targetDescription: string;
  rewardAmount: number;
  discovered: boolean;
  discoveredBy?: string;
}

export interface ReplayRecord {
  id: string;
  tableId: string;
  playerId: string;
  movesJson: string;
  initialParamsJson: string;
  rngSeed: string;
  score: bigint;
  timestamp: bigint;
  validated: boolean;
}

export interface CoOpSession {
  id: string;
  tableId: string;
  players: string[];
  maxPlayers: number;
  active: boolean;
  startedAt: bigint;
}

export interface Vote {
  voter: string;
  choice: VoteChoice;
  votingPower: number;
  timestamp: bigint;
  comment?: string;
}

// ─── Asset Marketplace Types ──────────────────────────────────────────────────

export type AssetType = "file" | "code";

export type FileCategory =
  | "glb"
  | "mp3"
  | "wav"
  | "texture"
  | "image"
  | "svg"
  | "threejs"
  | "json";

export type AssetStatus = "pending" | "approved" | "rejected";

export interface MarketAsset {
  id: string;
  creator: string;
  name: string;
  description: string;
  tags: string[];
  assetType: AssetType;
  fileCategory: FileCategory;
  storageUrl?: string;
  codeContent?: string;
  status: AssetStatus;
  submittedAt: bigint;
  approvedAt?: bigint;
  royaltyBps: number;
  mintedAsNft: boolean;
  nftTokenId?: bigint;
}

export interface CreatorBalance {
  principal: string;
  totalEarned: bigint;
  claimable: bigint;
  lastClaimed: bigint;
}

export interface AssetRoyaltyEntry {
  assetId: string;
  tableId: string;
  amount: bigint;
  timestamp: bigint;
}
