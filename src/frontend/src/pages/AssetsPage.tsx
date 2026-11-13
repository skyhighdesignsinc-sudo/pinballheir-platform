import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  CheckCircle,
  Clock,
  Code,
  Coins,
  Download,
  FileImage,
  FileText,
  Music,
  Package,
  Search,
  UploadCloud,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { MarketAsset as BackendMarketAsset } from "../backend";
import {
  useApproveAsset,
  useClaimRoyalties,
  useGetAssets,
  useGetCreatorBalance,
  useRejectAsset,
  useSubmitAsset,
} from "../hooks/useQueries";
import type { AssetStatus, FileCategory, MarketAsset } from "../types/index";

// Normalize backend MarketAsset to frontend MarketAsset
function normalizeAsset(a: BackendMarketAsset): MarketAsset {
  return {
    id: a.id,
    creator: a.creator.toString(),
    name: a.name,
    description: a.description,
    tags: a.tags,
    assetType: a.assetType as MarketAsset["assetType"],
    fileCategory: a.fileCategory as FileCategory,
    storageUrl: a.storageUrl,
    codeContent: a.codeContent,
    status: a.status as AssetStatus,
    submittedAt: a.submittedAt,
    approvedAt: a.approvedAt,
    royaltyBps: Number(a.royaltyBps),
    mintedAsNft: a.mintedAsNft,
    nftTokenId: a.nftTokenId,
  };
}

// ─── Upload helper ────────────────────────────────────────────────────────────
async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/object-storage/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  const json = (await res.json()) as { url?: string; assetId?: string };
  return json.url ?? `/api/object-storage/asset/${json.assetId ?? ""}`;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCEPTED_TYPES: Record<string, FileCategory> = {
  "model/gltf-binary": "glb",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/wave": "wav",
  "image/png": "texture",
  "image/jpeg": "image",
  "image/webp": "image",
};

const CATEGORY_ICONS: Record<FileCategory, React.ReactNode> = {
  glb: <Package className="w-4 h-4" />,
  mp3: <Music className="w-4 h-4" />,
  wav: <Music className="w-4 h-4" />,
  texture: <FileImage className="w-4 h-4" />,
  image: <FileImage className="w-4 h-4" />,
  svg: <Code className="w-4 h-4" />,
  threejs: <Code className="w-4 h-4" />,
  json: <FileText className="w-4 h-4" />,
};

const CATEGORY_LABELS: Record<FileCategory, string> = {
  glb: "3D Model (GLB)",
  mp3: "Sound (MP3)",
  wav: "Sound (WAV)",
  texture: "Texture (PNG)",
  image: "Image",
  svg: "SVG Code",
  threejs: "Three.js Snippet",
  json: "JSON Definition",
};

function statusBadge(status: AssetStatus) {
  if (status === "approved")
    return (
      <Badge className="gap-1 bg-accent/20 text-accent border-accent/40 text-[10px]">
        <CheckCircle className="w-3 h-3" /> Approved
      </Badge>
    );
  if (status === "rejected")
    return (
      <Badge className="gap-1 bg-destructive/20 text-destructive border-destructive/40 text-[10px]">
        <XCircle className="w-3 h-3" /> Rejected
      </Badge>
    );
  return (
    <Badge className="gap-1 bg-primary/20 text-primary border-primary/40 text-[10px]">
      <Clock className="w-3 h-3" /> Pending
    </Badge>
  );
}

// ─── Asset Card ───────────────────────────────────────────────────────────────
function AssetCard({
  asset,
  index,
  showActions,
  onApprove,
  onReject,
}: {
  asset: MarketAsset;
  index: number;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}) {
  const royaltyPct = (asset.royaltyBps / 100).toFixed(1);
  const isCode = asset.assetType === "code";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      data-ocid={`assets.browse.item.${index + 1}`}
      className="arcade-card flex flex-col gap-3 hover:border-accent/40 transition-smooth"
    >
      {/* Thumbnail / preview */}
      <div className="w-full h-32 rounded-md bg-muted/30 border border-border flex items-center justify-center overflow-hidden">
        {asset.assetType === "file" && asset.storageUrl ? (
          asset.fileCategory === "image" || asset.fileCategory === "texture" ? (
            <img
              src={asset.storageUrl}
              alt={asset.name}
              className="w-full h-full object-cover"
            />
          ) : asset.fileCategory === "mp3" || asset.fileCategory === "wav" ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Music className="w-8 h-8 text-accent opacity-70" />
              <span className="text-xs">Audio Asset</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Package className="w-8 h-8 text-primary opacity-70" />
              <span className="text-xs">3D Model</span>
            </div>
          )
        ) : isCode ? (
          <div className="w-full h-full bg-background/60 flex items-center justify-center p-3">
            <pre className="text-[10px] text-accent/80 font-mono line-clamp-5 text-left w-full overflow-hidden">
              {asset.codeContent?.slice(0, 200) ?? ""}
            </pre>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {CATEGORY_ICONS[asset.fileCategory]}
            <span className="text-xs">
              {CATEGORY_LABELS[asset.fileCategory]}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display font-bold text-sm text-foreground truncate">
            {asset.name}
          </p>
          {statusBadge(asset.status)}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {asset.description || "No description"}
        </p>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          <Badge variant="outline" className="text-[10px] border-border gap-1">
            {CATEGORY_ICONS[asset.fileCategory]}
            {CATEGORY_LABELS[asset.fileCategory]}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] border-accent/30 text-accent gap-1"
          >
            <Zap className="w-3 h-3" />
            {royaltyPct}% royalty
          </Badge>
          {asset.mintedAsNft && (
            <Badge
              variant="outline"
              className="text-[10px] border-primary/40 text-primary"
            >
              ICRC-7 NFT
            </Badge>
          )}
        </div>
        {asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {asset.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {showActions && asset.status === "pending" ? (
          <>
            <Button
              size="sm"
              className="flex-1 bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30 text-xs"
              onClick={() => onApprove?.(asset.id)}
              data-ocid={`assets.approve.button.${index + 1}`}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10 text-xs"
              onClick={() => onReject?.(asset.id)}
              data-ocid={`assets.reject.button.${index + 1}`}
            >
              <XCircle className="w-3 h-3 mr-1" />
              Reject
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-primary/40 text-primary hover:bg-primary/10 text-xs"
            data-ocid={`assets.use_in_table.button.${index + 1}`}
            onClick={() =>
              toast.info("Open Table Constructor to use this asset")
            }
          >
            <Download className="w-3 h-3 mr-1" />
            Use in Table
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Browse Tab ───────────────────────────────────────────────────────────────
function BrowseTab({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "file" | "code">("all");
  const { data: rawAssets = [], isLoading } = useGetAssets("approved");
  const assets = rawAssets.map(normalizeAsset);
  const approveAsset = useApproveAsset();
  const rejectAsset = useRejectAsset();
  const { data: rawPendingAssets = [] } = useGetAssets("pending");
  const pendingAssets = rawPendingAssets.map(normalizeAsset);

  const filtered = assets.filter((a) => {
    const matchesType = typeFilter === "all" || a.assetType === typeFilter;
    const matchesSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleApprove = async (id: string) => {
    try {
      await approveAsset.mutateAsync(id);
      toast.success("Asset approved");
    } catch {
      toast.error("Failed to approve asset");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectAsset.mutateAsync(id);
      toast.success("Asset rejected");
    } catch {
      toast.error("Failed to reject asset");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by name, tag…"
            data-ocid="assets.browse.search_input"
            className="w-full pl-9 pr-4 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex rounded-md border border-border overflow-hidden">
          {(["all", "file", "code"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setTypeFilter(f)}
              data-ocid={`assets.browse.filter.${f}`}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                typeFilter === f
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* DAO Approval Queue */}
      {isLoggedIn && pendingAssets.length > 0 && (
        <div
          className="space-y-3 p-4 rounded-xl border border-primary/30 bg-primary/5"
          data-ocid="assets.dao_queue.section"
        >
          <h3 className="font-display font-bold text-sm text-primary flex items-center gap-2">
            <Clock className="w-4 h-4" />
            DAO Approval Queue ({pendingAssets.length})
          </h3>
          <p className="text-xs text-muted-foreground">
            Review and vote on community-submitted assets awaiting DAO approval.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingAssets.map((asset, i) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                index={i}
                showActions
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        </div>
      )}

      {/* Asset grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 gap-4"
          data-ocid="assets.browse.empty_state"
        >
          <Package className="w-12 h-12 text-muted-foreground opacity-40" />
          <div className="text-center">
            <p className="font-display font-bold text-foreground mb-1">
              No assets found
            </p>
            <p className="text-sm text-muted-foreground">
              {search
                ? "Try a different search term or filter"
                : "Be the first to submit an asset to the marketplace!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((asset, i) => (
            <AssetCard key={asset.id} asset={asset} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Upload Files Tab ─────────────────────────────────────────────────────────
function UploadFilesTab() {
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const submitAsset = useSubmitAsset();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [royaltyBps, setRoyaltyBps] = useState(250);
  const [mintNft, setMintNft] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [nameError, setNameError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectedCategory: FileCategory | null = file
    ? (ACCEPTED_TYPES[file.type] ?? null)
    : null;

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) processFile(dropped);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  function processFile(f: File) {
    const cat = ACCEPTED_TYPES[f.type];
    if (!cat) {
      toast.error("Unsupported file type. Use GLB, MP3, WAV, PNG, JPG, WEBP.");
      return;
    }
    if (f.size > 4 * 1024 * 1024) {
      toast.warning("File is larger than 4MB — consider optimizing it first.");
    } else if (f.size > 1.5 * 1024 * 1024) {
      toast.warning(
        "File is over 1.5MB. Upload may be slow; consider compressing.",
      );
    }
    setFile(f);
    if (cat === "image" || cat === "texture") {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
    if (!name) setName(f.name.replace(/\.[^.]+$/, ""));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Asset name is required");
      return;
    }
    if (!file || !detectedCategory) {
      toast.error("Please select a file to upload");
      return;
    }
    setUploading(true);
    try {
      const storageUrl = await uploadFile(file);
      await submitAsset.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        assetType: "file",
        fileCategory: detectedCategory,
        storageUrl,
        codeContent: undefined,
        royaltyBps,
        mintedAsNft: mintNft,
      });
      toast.success("Asset submitted for DAO review!");
      setFile(null);
      setPreviewUrl(null);
      setName("");
      setDescription("");
      setTags("");
      setRoyaltyBps(250);
      setMintNft(false);
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 gap-4"
        data-ocid="assets.upload.login_required"
      >
        <UploadCloud className="w-12 h-12 text-muted-foreground opacity-40" />
        <p className="text-muted-foreground text-center">
          Login with Internet Identity to upload assets.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Drop zone */}
      <button
        type="button"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        aria-label="Upload file drop zone"
        data-ocid="assets.upload.dropzone"
        className={`relative w-full min-h-[180px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-smooth ${
          dragging
            ? "border-accent/70 bg-accent/10"
            : file
              ? "border-primary/50 bg-primary/5"
              : "border-border hover:border-primary/40 hover:bg-muted/20"
        }`}
      >
        {file ? (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-24 max-w-full rounded-lg object-contain"
              />
            ) : (
              <div className="text-4xl">
                {detectedCategory === "glb"
                  ? "📦"
                  : detectedCategory === "mp3" || detectedCategory === "wav"
                    ? "🎵"
                    : "📄"}
              </div>
            )}
            <p className="font-display font-bold text-sm text-foreground">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(0)} KB ·{" "}
              {detectedCategory ? CATEGORY_LABELS[detectedCategory] : "Unknown"}
            </p>
            <p className="text-xs text-accent">Click to change file</p>
          </div>
        ) : (
          <>
            <UploadCloud
              className={`w-10 h-10 ${dragging ? "text-accent" : "text-muted-foreground"}`}
            />
            <div className="text-center">
              <p className="font-display font-bold text-foreground">
                Drop file here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                GLB (3D), MP3/WAV (audio), PNG/JPG/WEBP (textures)
              </p>
              <p className="text-xs text-muted-foreground">
                Recommended max: 1.5MB · Absolute max: 4MB
              </p>
            </div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".glb,.mp3,.wav,.png,.jpg,.jpeg,.webp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) processFile(f);
          }}
          data-ocid="assets.upload.upload_button"
        />
      </button>

      {/* Audio preview */}
      {file && (detectedCategory === "mp3" || detectedCategory === "wav") && (
        // biome-ignore lint/a11y/useMediaCaption: user's own uploaded audio file
        <audio
          controls
          src={URL.createObjectURL(file)}
          className="w-full"
          data-ocid="assets.upload.audio_preview"
        />
      )}

      {/* Form fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="asset-name"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Asset Name <span className="text-destructive">*</span>
          </label>
          <input
            id="asset-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            onBlur={() => !name.trim() && setNameError("Name is required")}
            placeholder="Neon Ramp Pack"
            data-ocid="assets.upload.name.input"
            className={`w-full px-3 py-2 rounded-md bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground ${nameError ? "border-destructive" : "border-input"}`}
          />
          {nameError && (
            <p
              className="text-xs text-destructive"
              data-ocid="assets.upload.name.field_error"
            >
              {nameError}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="asset-desc"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Description
          </label>
          <textarea
            id="asset-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={400}
            placeholder="Describe your asset — what it looks/sounds like, what tables it suits…"
            data-ocid="assets.upload.description.textarea"
            className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="asset-tags"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Tags{" "}
            <span className="normal-case tracking-normal font-normal text-muted-foreground">
              (comma-separated)
            </span>
          </label>
          <input
            id="asset-tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="neon, cyberpunk, ramp, loop"
            data-ocid="assets.upload.tags.input"
            className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Royalty slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="royalty-slider"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Royalty Rate
            </label>
            <span className="font-mono text-sm text-accent font-bold">
              {(royaltyBps / 100).toFixed(1)}%
            </span>
          </div>
          <input
            id="royalty-slider"
            type="range"
            min={0}
            max={1000}
            step={25}
            value={royaltyBps}
            onChange={(e) => setRoyaltyBps(Number(e.target.value))}
            data-ocid="assets.upload.royalty.input"
            className="w-full accent-accent"
          />
          <p className="text-xs text-muted-foreground">
            You earn this % of ICFC each time a table using your asset is
            played.
          </p>
        </div>

        {/* Mint as NFT */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Mint as ICRC-7 NFT
            </p>
            <p className="text-xs text-muted-foreground">
              Tokenize your asset on the Internet Computer (stub — DAO must
              enable)
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={mintNft}
            onClick={() => setMintNft((v) => !v)}
            data-ocid="assets.upload.mint_nft.switch"
            className={`relative w-11 h-6 rounded-full border-2 transition-colors ${mintNft ? "bg-primary/80 border-primary" : "bg-muted border-border"}`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-all ${mintNft ? "left-[22px]" : "left-0.5"}`}
            />
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={uploading || submitAsset.isPending}
        className="w-full border border-primary/60 text-primary bg-primary/10 hover:bg-primary/20 font-semibold"
        style={{ boxShadow: "0 0 12px oklch(var(--primary)/0.25)" }}
        data-ocid="assets.upload.submit_button"
      >
        {uploading || submitAsset.isPending ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            Uploading…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            Submit for DAO Review
          </span>
        )}
      </Button>
    </form>
  );
}

// ─── Submit Code Tab ───────────────────────────────────────────────────────────
function SubmitCodeTab() {
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const submitAsset = useSubmitAsset();
  const [codeContent, setCodeContent] = useState("");
  const [language, setLanguage] = useState<"svg" | "threejs" | "json">("svg");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [royaltyBps, setRoyaltyBps] = useState(250);
  const [mintNft, setMintNft] = useState(false);
  const [nameError, setNameError] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  const langToCategory: Record<typeof language, FileCategory> = {
    svg: "svg",
    threejs: "threejs",
    json: "json",
  };

  // SVG live preview
  const svgPreview =
    language === "svg" && codeContent.trim().startsWith("<")
      ? codeContent
      : null;

  const jsonPreview =
    language === "json"
      ? (() => {
          try {
            return JSON.stringify(JSON.parse(codeContent), null, 2);
          } catch {
            return null;
          }
        })()
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Asset name is required");
      return;
    }
    if (!codeContent.trim()) {
      toast.error("Code content cannot be empty");
      return;
    }
    try {
      await submitAsset.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        assetType: "code",
        fileCategory: langToCategory[language],
        storageUrl: undefined,
        codeContent: codeContent.trim(),
        royaltyBps,
        mintedAsNft: mintNft,
      });
      toast.success("Code asset submitted for DAO review!");
      setCodeContent("");
      setName("");
      setDescription("");
      setTags("");
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 gap-4"
        data-ocid="assets.code.login_required"
      >
        <Code className="w-12 h-12 text-muted-foreground opacity-40" />
        <p className="text-muted-foreground text-center">
          Login with Internet Identity to submit code assets.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Language selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Language:
        </span>
        <div className="flex rounded-md border border-border overflow-hidden">
          {(["svg", "threejs", "json"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              data-ocid={`assets.code.language.${lang}`}
              className={`px-3 py-1.5 text-xs font-mono font-semibold capitalize transition-colors ${
                language === lang
                  ? "bg-accent/20 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {lang === "threejs" ? "Three.js" : lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Code editor */}
        <div className="space-y-2">
          <label
            htmlFor="code-editor"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {language === "svg"
              ? "SVG Code"
              : language === "threejs"
                ? "Three.js Snippet"
                : "JSON Definition"}
          </label>
          <textarea
            id="code-editor"
            value={codeContent}
            onChange={(e) => setCodeContent(e.target.value)}
            placeholder={
              language === "svg"
                ? '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="50" cy="50" r="40" fill="none" stroke="cyan" stroke-width="3"/>\n</svg>'
                : language === "threejs"
                  ? "// Custom Three.js bumper geometry\nconst geo = new THREE.TorusGeometry(0.5, 0.15, 8, 24);\nconst mat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x004444 });\nreturn new THREE.Mesh(geo, mat);"
                  : '{\n  "type": "bumper",\n  "radius": 0.5,\n  "points": 100,\n  "color": "#00ffff"\n}'
            }
            rows={16}
            data-ocid="assets.code.editor"
            spellCheck={false}
            className="w-full px-3 py-3 rounded-md bg-background border border-input text-xs font-mono focus:outline-none focus:ring-2 focus:ring-accent/40 text-foreground placeholder:text-muted-foreground resize-none leading-relaxed"
          />
        </div>

        {/* Live preview */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Live Preview
          </p>
          <div
            ref={previewRef}
            className="w-full h-[calc(16*1.625rem)] rounded-md bg-background/60 border border-border flex items-center justify-center overflow-hidden p-4"
            data-ocid="assets.code.preview"
          >
            {svgPreview ? (
              <div
                className="w-full h-full flex items-center justify-center"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: sandboxed SVG preview
                dangerouslySetInnerHTML={{ __html: svgPreview }}
              />
            ) : jsonPreview ? (
              <pre className="text-[10px] font-mono text-accent/80 text-left w-full overflow-auto max-h-full">
                {jsonPreview}
              </pre>
            ) : codeContent.trim() ? (
              <div className="text-center text-muted-foreground">
                <Code className="w-8 h-8 opacity-40 mx-auto mb-2" />
                <p className="text-xs">
                  {language === "threejs"
                    ? "Three.js preview renders at runtime"
                    : "Preview not available"}
                </p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Code className="w-8 h-8 opacity-40 mx-auto mb-2" />
                <p className="text-xs">Write code to see a preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="code-name"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Asset Name <span className="text-destructive">*</span>
          </label>
          <input
            id="code-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            onBlur={() => !name.trim() && setNameError("Name is required")}
            placeholder="Neon Bumper SVG"
            data-ocid="assets.code.name.input"
            className={`w-full px-3 py-2 rounded-md bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground ${nameError ? "border-destructive" : "border-input"}`}
          />
          {nameError && (
            <p
              className="text-xs text-destructive"
              data-ocid="assets.code.name.field_error"
            >
              {nameError}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="code-tags"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Tags (comma-separated)
          </label>
          <input
            id="code-tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="neon, bumper, svg"
            data-ocid="assets.code.tags.input"
            className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="code-desc"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Description
        </label>
        <textarea
          id="code-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          maxLength={400}
          placeholder="Describe what this code does and how to use it…"
          data-ocid="assets.code.description.textarea"
          className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground resize-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="code-royalty"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Royalty Rate
            </label>
            <span className="font-mono text-sm text-accent font-bold">
              {(royaltyBps / 100).toFixed(1)}%
            </span>
          </div>
          <input
            id="code-royalty"
            type="range"
            min={0}
            max={1000}
            step={25}
            value={royaltyBps}
            onChange={(e) => setRoyaltyBps(Number(e.target.value))}
            data-ocid="assets.code.royalty.input"
            className="w-full accent-accent"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Mint as ICRC-7 NFT
            </p>
            <p className="text-xs text-muted-foreground">
              Tokenize this code asset
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={mintNft}
            onClick={() => setMintNft((v) => !v)}
            data-ocid="assets.code.mint_nft.switch"
            className={`relative w-11 h-6 rounded-full border-2 transition-colors ${mintNft ? "bg-primary/80 border-primary" : "bg-muted border-border"}`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-all ${mintNft ? "left-[22px]" : "left-0.5"}`}
            />
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitAsset.isPending}
        className="w-full border border-accent/60 text-accent bg-accent/10 hover:bg-accent/20 font-semibold"
        style={{ boxShadow: "0 0 12px oklch(var(--accent)/0.25)" }}
        data-ocid="assets.code.submit_button"
      >
        {submitAsset.isPending ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-accent/40 border-t-accent rounded-full animate-spin" />
            Submitting…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Submit Code for DAO Review
          </span>
        )}
      </Button>
    </form>
  );
}

// ─── Creator Dashboard ─────────────────────────────────────────────────────────
function CreatorDashboard() {
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const { data: balance } = useGetCreatorBalance();
  const { data: rawAllAssets = [] } = useGetAssets("all");
  const callerPrincipal = identity?.getPrincipal().toText();
  const myAssets = rawAllAssets
    .map(normalizeAsset)
    .filter((a) => a.creator === callerPrincipal);
  const claimRoyalties = useClaimRoyalties();

  if (!isLoggedIn) return null;

  const claimable = balance?.claimable ?? BigInt(0);
  const totalEarned = balance?.totalEarned ?? BigInt(0);

  const handleClaim = async () => {
    if (claimable === BigInt(0)) {
      toast.info("Nothing to claim yet");
      return;
    }
    try {
      await claimRoyalties.mutateAsync();
      toast.success("Royalties claimed! ICFC sent to your wallet.");
    } catch {
      toast.error("Claim failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-5 rounded-xl border border-accent/30 bg-accent/5"
      data-ocid="assets.creator_dashboard.section"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-accent flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Creator Dashboard
        </h3>
        <Button
          size="sm"
          onClick={handleClaim}
          disabled={claimRoyalties.isPending || claimable === BigInt(0)}
          className="border border-accent/50 text-accent bg-accent/10 hover:bg-accent/20 text-xs"
          style={{ boxShadow: "0 0 12px oklch(var(--accent)/0.2)" }}
          data-ocid="assets.creator_dashboard.claim_button"
        >
          <Zap className="w-3 h-3 mr-1" />
          {claimRoyalties.isPending
            ? "Claiming…"
            : `Claim ${Number(claimable).toLocaleString()} ICFC`}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="arcade-card text-center">
          <p className="font-mono text-xl font-bold text-accent">
            {Number(totalEarned).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
            Total Earned (ICFC)
          </p>
        </div>
        <div className="arcade-card text-center">
          <p className="font-mono text-xl font-bold text-primary">
            {Number(claimable).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
            Claimable Now
          </p>
        </div>
      </div>

      {/* My submitted assets */}
      {myAssets.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            My Submissions ({myAssets.length})
          </p>
          <div className="space-y-2">
            {myAssets.map((asset, i) => (
              <div
                key={asset.id}
                data-ocid={`assets.my_assets.item.${i + 1}`}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-sm truncate">
                    {asset.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[asset.fileCategory]} ·{" "}
                    {(asset.royaltyBps / 100).toFixed(1)}% royalty
                  </p>
                </div>
                <div className="ml-3">{statusBadge(asset.status)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AssetsPage() {
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const [tab, setTab] = useState("browse");

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div
        className="bg-card border-b border-border/40"
        data-ocid="assets.page"
      >
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div>
              <h1
                className="font-display text-3xl sm:text-4xl font-bold neon-text-accent"
                style={{
                  textShadow:
                    "0 0 20px oklch(var(--accent)/0.7), 0 0 40px oklch(var(--accent)/0.4)",
                }}
              >
                Asset Marketplace
              </h1>
              <p className="text-muted-foreground mt-1 text-sm max-w-lg">
                Upload GLB models, sounds, textures, and code assets. Earn ICFC
                royalties every time your asset powers a pinball table.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="border-accent/40 text-accent gap-1 text-xs"
              >
                <Zap className="w-3 h-3" />
                ICFC Royalties
              </Badge>
              <Badge
                variant="outline"
                className="border-primary/40 text-primary gap-1 text-xs"
              >
                DAO Governed
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Creator dashboard */}
        <CreatorDashboard />

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} data-ocid="assets.tabs">
          <TabsList className="bg-muted/40 border border-border mb-6 flex overflow-x-auto w-full sm:w-auto">
            <TabsTrigger
              value="browse"
              data-ocid="assets.browse.tab"
              className="gap-1.5 flex-shrink-0"
            >
              <Package className="w-4 h-4" />
              Browse
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              data-ocid="assets.upload.tab"
              className="gap-1.5 flex-shrink-0"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger
              value="code"
              data-ocid="assets.code.tab"
              className="gap-1.5 flex-shrink-0"
            >
              <Code className="w-4 h-4" />
              Submit Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <BrowseTab isLoggedIn={isLoggedIn} />
          </TabsContent>
          <TabsContent value="upload">
            <UploadFilesTab />
          </TabsContent>
          <TabsContent value="code">
            <SubmitCodeTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
