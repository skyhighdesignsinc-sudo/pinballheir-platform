import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  AssetFilter,
  EconomyUpdateInput,
  ProfileUpdateInput,
  ProposalType,
  VoteChoice,
} from "../backend";
import type {
  Achievement,
  AdSlot,
  Badge,
  LeaderboardEntry,
  PinballTable,
  Proposal,
  TableEconomy,
  UserProfile,
} from "../types/index";

// Re-export for page consumption
export type {
  Achievement,
  AdSlot,
  Badge,
  LeaderboardEntry,
  PinballTable,
  Proposal,
  TableEconomy,
  UserProfile,
};

// ─── Actor ────────────────────────────────────────────────────────────────────

type ActorType = Awaited<ReturnType<typeof createActor>>;

function useBackendActor() {
  return useActor(createActor) as {
    actor: ActorType | null;
    isFetching: boolean;
  };
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useBackendActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile() as Promise<UserProfile | null>;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: ProfileUpdateInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetUserProfile(principal: string | null) {
  const { actor, isFetching } = useBackendActor();

  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", principal],
    queryFn: async () => {
      if (!actor || !principal) return null;
      try {
        const { Principal } = await import("@icp-sdk/core/principal");
        return actor.getUserProfile(
          Principal.fromText(principal),
        ) as Promise<UserProfile | null>;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!principal,
    retry: false,
  });
}

// ─── Tables ───────────────────────────────────────────────────────────────────

export function useGetTables(filter?: string) {
  const { actor, isFetching } = useBackendActor();

  return useQuery<PinballTable[]>({
    queryKey: ["tables", filter ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTables(filter ?? null) as Promise<PinballTable[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTable(id: string) {
  const { actor, isFetching } = useBackendActor();

  return useQuery<PinballTable | null>({
    queryKey: ["table", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTable(id) as Promise<PinballTable | null>;
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddTable() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      creator: string;
      layoutJson: string;
      visualsJson: string;
      physicsJson: string;
      economyJson: string;
      rulesetJson: string;
      metadataJson: string;
      accessJson: string;
      daoJson: string;
      soundJson: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const { Principal } = await import("@icp-sdk/core/principal");
      const result = await actor.addTable({
        name: input.name,
        creator: Principal.fromText(input.creator),
        layoutJson: input.layoutJson,
        visualsJson: input.visualsJson,
        physicsJson: input.physicsJson,
        economyJson: input.economyJson,
        rulesetJson: input.rulesetJson,
        metadataJson: input.metadataJson,
        accessJson: input.accessJson,
        daoJson: input.daoJson,
        soundJson: input.soundJson,
      });
      if (result.__kind__ === "err") throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}

export function useUpdateTable() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: string }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateTable(id, updates);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["table", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}

export function useReleaseTable() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.releaseTable(id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}

export function useForkTable() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sourceId: string) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.forkTable(sourceId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}

export function useInitializeGenesisTable() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.initializeGenesisTable();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}

// ─── Table Economy ────────────────────────────────────────────────────────────

export function useGetTableEconomy(tableId: string) {
  const { actor, isFetching } = useBackendActor();

  return useQuery<TableEconomy | null>({
    queryKey: ["tableEconomy", tableId],
    queryFn: async () => {
      if (!actor || !tableId) return null;
      return actor.getTableEconomy(tableId) as Promise<TableEconomy | null>;
    },
    enabled: !!actor && !isFetching && !!tableId,
  });
}

export function useGetTableEconomies() {
  const { actor, isFetching } = useBackendActor();

  return useQuery<TableEconomy[]>({
    queryKey: ["tableEconomies"],
    queryFn: async () => {
      if (!actor) return [];
      // Fetch economies by getting tables then their economies
      const tables = await actor.getTables(null);
      const results = await Promise.all(
        tables.map((t) => actor.getTableEconomy(t.id)),
      );
      return results.filter(
        (e): e is TableEconomy => e !== null,
      ) as TableEconomy[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateTableEconomy() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tableId,
      updates,
    }: { tableId: string; updates: EconomyUpdateInput }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateTableEconomy(tableId, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tableEconomy", variables.tableId],
      });
      queryClient.invalidateQueries({ queryKey: ["tableEconomies"] });
    },
  });
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export function useGetLeaderboard(tableId: string) {
  const { actor, isFetching } = useBackendActor();

  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard", tableId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard(
        tableId || null,
        "AllTime",
        BigInt(100),
      ) as Promise<LeaderboardEntry[]>;
    },
    enabled: !!actor && !isFetching && !!tableId,
  });
}

export function useSubmitScore() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tableId,
      score,
      replayJson,
      rngSeed,
    }: {
      tableId: string;
      score: bigint;
      replayJson: string;
      rngSeed: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitScore(tableId, score, replayJson, rngSeed);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["leaderboard", variables.tableId],
      });
    },
  });
}

// ─── Governance / Proposals ───────────────────────────────────────────────────

export function useGetProposals(status?: string) {
  const { actor, isFetching } = useBackendActor();

  return useQuery<Proposal[]>({
    queryKey: ["proposals", status ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      const proposals = await actor.getProposals(
        status && status !== "all" ? status : null,
        BigInt(100),
        BigInt(0),
      );
      return proposals as Proposal[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProposal(id: bigint | null) {
  const { actor, isFetching } = useBackendActor();

  return useQuery<Proposal | null>({
    queryKey: ["proposal", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getProposal(id) as Promise<Proposal | null>;
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSubmitProposal() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      proposalType,
      paramsJson,
      stakedAmount,
    }: {
      proposalType: ProposalType;
      paramsJson: string;
      stakedAmount: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitProposal(proposalType, paramsJson, stakedAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}

export function useVoteOnProposal() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      proposalId,
      choice,
      weight,
    }: { proposalId: bigint; choice: VoteChoice; weight: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.voteOnProposal(proposalId, choice, weight);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}

export function useExecuteProposal() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proposalId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.executeProposal(proposalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export function useGetAchievements() {
  const { actor, isFetching } = useBackendActor();

  return useQuery<Achievement[]>({
    queryKey: ["achievements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAchievements() as Promise<Achievement[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBadges() {
  // Badges are stored as string IDs on player profiles — no dedicated backend method
  return useQuery<Badge[]>({
    queryKey: ["badges"],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useGetPlayerAchievements(principal: string | null) {
  const { actor, isFetching } = useBackendActor();

  return useQuery<string[]>({
    queryKey: ["playerAchievements", principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      try {
        const { Principal } = await import("@icp-sdk/core/principal");
        return actor.getPlayerAchievements(Principal.fromText(principal));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

// ─── Marketplace / Skins ─────────────────────────────────────────────────────

export function useGetSkinCollections() {
  const { actor, isFetching } = useBackendActor();

  return useQuery({
    queryKey: ["skinCollections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSkinCollections();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdSlots(): { data: AdSlot[]; isLoading: boolean } {
  // Ad slots are not in the backend interface — return empty
  return { data: [], isLoading: false };
}

export function usePurchaseSkin() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      itemId,
    }: { collectionId: string; itemId: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.purchaseSkin(collectionId, itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skinCollections"] });
    },
  });
}

// ─── Replay ──────────────────────────────────────────────────────────────────

export function useSubmitReplay() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tableId,
      movesJson,
      initialParamsJson,
      rngSeed,
      score,
    }: {
      tableId: string;
      movesJson: string;
      initialParamsJson: string;
      rngSeed: string;
      score: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitReplay(
        tableId,
        movesJson,
        initialParamsJson,
        rngSeed,
        score,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["leaderboard", variables.tableId],
      });
    },
  });
}

export function useGetReplayRecord(id: string) {
  const { actor, isFetching } = useBackendActor();

  return useQuery({
    queryKey: ["replay", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getReplayRecord(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

// ─── Co-op ────────────────────────────────────────────────────────────────────

export function useJoinCoOpSession() {
  const { actor } = useBackendActor();

  return useMutation({
    mutationFn: async (tableId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.joinCoOpSession(tableId);
    },
  });
}

export function useLeaveCoOpSession() {
  const { actor } = useBackendActor();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.leaveCoOpSession(sessionId);
    },
  });
}

// ─── Game actions ─────────────────────────────────────────────────────────────

export function useSaveTheBall() {
  const { actor } = useBackendActor();

  return useMutation({
    mutationFn: async (tableId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveTheBall(tableId);
    },
  });
}

export function useNudgeTable() {
  const { actor } = useBackendActor();

  return useMutation({
    mutationFn: async (tableId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.nudgeTable(tableId);
    },
  });
}

export function useTriggerGoldenBall() {
  const { actor } = useBackendActor();

  return useMutation({
    mutationFn: async (tableId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.triggerGoldenBall(tableId);
    },
  });
}

export function useTriggerCharityTilt() {
  const { actor } = useBackendActor();

  return useMutation({
    mutationFn: async ({
      tableId,
      amount,
    }: { tableId: string; amount: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.triggerCharityTilt(tableId, amount);
    },
  });
}

// ─── Global Platform Fee ─────────────────────────────────────────────────────

export function useGetGlobalPlatformFee() {
  const { actor, isFetching } = useBackendActor();

  return useQuery<number>({
    queryKey: ["globalPlatformFee"],
    queryFn: async () => {
      if (!actor) return 10;
      const fee = await actor.getGlobalPlatformFee();
      return Number(fee);
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000 * 5,
  });
}

// ─── Treasury / Charity ───────────────────────────────────────────────────────

export function useGetGlobalTreasury() {
  const { actor, isFetching } = useBackendActor();

  return useQuery<bigint>({
    queryKey: ["globalTreasury"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getGlobalTreasury();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCharityWallet() {
  const { actor, isFetching } = useBackendActor();

  return useQuery<string | null>({
    queryKey: ["charityWallet"],
    queryFn: async () => {
      if (!actor) return null;
      const principal = await actor.getCharityWallet();
      return principal ? principal.toString() : null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetCharityWallet() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wallet: string) => {
      if (!actor) throw new Error("Actor not available");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.setCharityWallet(Principal.fromText(wallet));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["charityWallet"] });
    },
  });
}

// ─── Daily Mystery Table ──────────────────────────────────────────────────────

export function useGetDailyMysteryTable() {
  const { actor, isFetching } = useBackendActor();

  return useQuery<string | null>({
    queryKey: ["dailyMysteryTable"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDailyMysteryTable();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000 * 60,
  });
}

// ─── Gifting ──────────────────────────────────────────────────────────────────

export function useGiftTokens() {
  const { actor } = useBackendActor();

  return useMutation({
    mutationFn: async ({
      to,
      amount,
      memo,
    }: { to: string; amount: bigint; memo?: string }) => {
      if (!actor) throw new Error("Actor not available");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.giftTokens(Principal.fromText(to), amount, memo ?? null);
    },
  });
}

// ─── Tournaments ──────────────────────────────────────────────────────────────

export function useLaunchTournament() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tableId,
      prizePool,
      durationHours,
    }: { tableId: string; prizePool: bigint; durationHours: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.launchTournament(tableId, prizePool, durationHours);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}

// ─── Seasons ──────────────────────────────────────────────────────────────────

export function useGetSeasons(tableId: string) {
  const { actor, isFetching } = useBackendActor();

  return useQuery({
    queryKey: ["seasons", tableId],
    queryFn: async () => {
      if (!actor || !tableId) return [];
      return actor.getSeasons(tableId);
    },
    enabled: !!actor && !isFetching && !!tableId,
  });
}

export function useCreateSeason() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tableId,
      endTime,
      bonusMultiplier,
    }: { tableId: string; endTime: bigint; bonusMultiplier: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createSeason(tableId, endTime, bonusMultiplier);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["seasons", variables.tableId],
      });
    },
  });
}

// ─── Easter Eggs ──────────────────────────────────────────────────────────────

export function useGetEasterEggs(tableId: string) {
  const { actor, isFetching } = useBackendActor();

  return useQuery({
    queryKey: ["easterEggs", tableId],
    queryFn: async () => {
      if (!actor || !tableId) return [];
      return actor.getEasterEggs(tableId);
    },
    enabled: !!actor && !isFetching && !!tableId,
  });
}

export function useDiscoverEasterEgg() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tableId,
      eggId,
    }: { tableId: string; eggId: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.discoverEasterEgg(tableId, eggId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["easterEggs", variables.tableId],
      });
    },
  });
}

// ─── Asset Marketplace ────────────────────────────────────────────────────────

export function useGetAssets(filter?: string) {
  const { actor, isFetching } = useBackendActor();

  return useQuery({
    queryKey: ["assets", filter ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      // Map string filter to AssetFilter enum value
      const assetFilter = (filter ?? "all") as AssetFilter;
      return actor.getAssets(assetFilter);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAsset(id: string) {
  const { actor, isFetching } = useBackendActor();

  return useQuery({
    queryKey: ["asset", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getAsset(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSubmitAsset() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      description: string;
      tags: string[];
      assetType: string;
      fileCategory: string;
      storageUrl?: string;
      codeContent?: string;
      royaltyBps: number;
      mintedAsNft: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      // backend: submitAsset(id, name, description, tags, assetType, fileCategory, storageUrl, codeContent, royaltyBps)
      const { AssetType, FileCategory } = await import("../backend");
      return actor.submitAsset(
        `asset-${Date.now()}`,
        input.name,
        input.description,
        input.tags,
        AssetType[input.assetType as keyof typeof AssetType] ?? AssetType.file,
        FileCategory[input.fileCategory as keyof typeof FileCategory] ??
          FileCategory.image,
        input.storageUrl ?? null,
        input.codeContent ?? null,
        BigInt(input.royaltyBps),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

export function useApproveAsset() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.approveAsset(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

export function useRejectAsset() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.rejectAsset(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

export function useGetCreatorBalance() {
  const { actor, isFetching } = useBackendActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ["creatorBalance", identity?.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      try {
        const caller = identity.getPrincipal();
        return actor.getCreatorBalance(caller);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useClaimRoyalties() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.claimRoyalties();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creatorBalance"] });
    },
  });
}
