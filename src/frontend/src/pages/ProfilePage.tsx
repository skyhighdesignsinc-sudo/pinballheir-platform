import { Badge as UiBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  Camera,
  Check,
  Coins,
  Copy,
  EyeOff,
  GamepadIcon,
  Gift,
  Globe,
  Lock,
  Medal,
  Pencil,
  Plus,
  Send,
  Share2,
  Shirt,
  Star,
  TableProperties,
  Trophy,
  UserCircle2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { SiDiscord, SiTelegram, SiX } from "react-icons/si";
import { toast } from "sonner";
import {
  useGetAchievements,
  useGetCallerUserProfile,
  useGetPlayerAchievements,
  useGetSkinCollections,
  useGetTables,
  useGiftTokens,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";
import type { Achievement, PinballTable, UserProfile } from "../types/index";

// ─── Object-storage file upload helper ───────────────────────────────────────
// Uses the platform's object-storage extension

async function uploadAsset(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/object-storage/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  const json = (await res.json()) as { assetId: string };
  return json.assetId;
}

function assetUrl(assetId: string | undefined): string | undefined {
  if (!assetId) return undefined;
  return `/api/object-storage/asset/${assetId}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`rounded-xl p-4 flex flex-col gap-2 border transition-smooth ${accent ? "border-accent/50 bg-card" : "border-primary/40 bg-card"}`}
      style={
        accent
          ? { boxShadow: "0 0 20px oklch(var(--accent)/0.2)" }
          : { boxShadow: "0 0 20px oklch(var(--primary)/0.15)" }
      }
    >
      <div className={`w-8 h-8 ${accent ? "text-accent" : "text-primary"}`}>
        {icon}
      </div>
      <p
        className={`font-mono text-2xl font-bold tracking-wider ${accent ? "text-accent" : "text-primary"}`}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
    </motion.div>
  );
}

function AchievementCard({
  achievement,
  earned,
}: {
  achievement: Achievement;
  earned: boolean;
}) {
  const icon = achievement.icon ?? "🏆";
  return (
    <motion.div
      whileHover={{ scale: earned ? 1.02 : 1 }}
      className={`rounded-xl p-4 border transition-all ${
        earned
          ? "bg-card border-primary/40"
          : "bg-muted/20 border-border opacity-50 grayscale"
      }`}
      style={
        earned
          ? {
              boxShadow:
                "0 0 20px oklch(var(--primary)/0.3), 0 0 40px oklch(var(--primary)/0.1)",
            }
          : {}
      }
    >
      <div className="flex items-start gap-3">
        <div
          className={`text-2xl w-11 h-11 flex items-center justify-center rounded-lg flex-shrink-0 ${earned ? "bg-primary/20" : "bg-muted"}`}
        >
          {earned ? icon : <Lock className="w-5 h-5 text-muted-foreground" />}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`font-display font-bold truncate text-sm ${earned ? "text-foreground" : "text-muted-foreground"}`}
          >
            {earned ? achievement.name : "???"}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {earned
              ? achievement.description
              : "Complete more challenges to unlock"}
          </p>
          {achievement.unlockedAt && earned && (
            <p className="text-xs text-muted-foreground mt-1">
              Earned{" "}
              {new Date(
                Number(achievement.unlockedAt) / 1_000_000,
              ).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TableRow({ table }: { table: PinballTable }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border hover:border-primary/40 transition-colors">
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold truncate text-sm">{table.name}</p>
        <p className="text-xs text-muted-foreground">
          {table.metadata?.difficulty ?? "Unknown"} ·{" "}
          {table.isGenesis
            ? "Genesis Table"
            : table.isActive
              ? "Active"
              : "Inactive"}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-3">
        {table.isGenesis && (
          <UiBadge
            variant="outline"
            className="text-xs border-accent/50 text-accent"
          >
            Genesis
          </UiBadge>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: "/constructor" })}
          data-ocid="profile.table.edit_button"
          className="text-xs"
        >
          <Pencil className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <Skeleton className="w-full h-48 rounded-2xl" />
      <div className="flex items-end gap-5 -mt-12 px-6">
        <Skeleton className="w-20 h-20 rounded-full flex-shrink-0" />
        <div className="space-y-2 pb-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

function LoginPrompt() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
      data-ocid="profile.error_state"
    >
      <div
        className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center"
        style={{ boxShadow: "0 0 24px oklch(var(--primary)/0.4)" }}
      >
        <UserCircle2 className="w-10 h-10 text-primary" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Player Profile
        </h2>
        <p className="text-muted-foreground max-w-sm">
          Connect with Internet Identity to view your arcade profile,
          achievements, and stats.
        </p>
      </div>
      <UiBadge
        variant="outline"
        className="text-sm border-primary/50 text-primary px-4 py-1.5"
      >
        Login required
      </UiBadge>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy to clipboard"
      data-ocid="profile.principal.copy_button"
      className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-accent" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

// ─── Gifting Card ──────────────────────────────────────────────────────────────

function GiftingCard() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [recipientError, setRecipientError] = useState("");
  const giftTokens = useGiftTokens();

  const handleGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) {
      setRecipientError("Recipient principal is required");
      return;
    }
    const amtNum = Number.parseInt(amount, 10);
    if (!amtNum || amtNum <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      await giftTokens.mutateAsync({
        to: recipient.trim(),
        amount: BigInt(amtNum),
        memo: memo.trim() || undefined,
      });
      toast.success(`Sent ${amtNum} ICFC! 🎁`);
      setRecipient("");
      setAmount("");
      setMemo("");
    } catch {
      toast.error("Gift failed. Check the recipient address and try again.");
    }
  };

  return (
    <div className="arcade-card space-y-4" data-ocid="profile.gifting.card">
      <div className="flex items-center gap-2">
        <Gift className="w-5 h-5 text-accent" />
        <h3 className="font-display font-bold text-foreground">
          Send ICFC Gift
        </h3>
      </div>

      <form onSubmit={handleGift} className="space-y-3">
        <div className="space-y-1">
          <label
            htmlFor="gift-recipient"
            className="text-xs text-muted-foreground font-semibold uppercase tracking-wider"
          >
            Recipient Principal
          </label>
          <input
            id="gift-recipient"
            type="text"
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              if (recipientError) setRecipientError("");
            }}
            onBlur={() => !recipient.trim() && setRecipientError("Required")}
            placeholder="aaaaa-bbbbb-ccccc-ddddd-eee"
            data-ocid="profile.gifting.recipient.input"
            className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
          />
          {recipientError && (
            <p
              className="text-xs text-destructive"
              data-ocid="profile.gifting.recipient.field_error"
            >
              {recipientError}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label
              htmlFor="gift-amount"
              className="text-xs text-muted-foreground font-semibold uppercase tracking-wider"
            >
              Amount (ICFC)
            </label>
            <input
              id="gift-amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              data-ocid="profile.gifting.amount.input"
              className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="gift-memo"
              className="text-xs text-muted-foreground font-semibold uppercase tracking-wider"
            >
              Memo (optional)
            </label>
            <input
              id="gift-memo"
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Good game!"
              data-ocid="profile.gifting.memo.input"
              maxLength={64}
              className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={giftTokens.isPending}
          className="w-full border border-accent/50 text-accent bg-accent/10 hover:bg-accent/20 font-semibold"
          style={{ boxShadow: "0 0 12px oklch(var(--accent)/0.25)" }}
          data-ocid="profile.gifting.send_button"
        >
          {giftTokens.isPending ? (
            "Sending…"
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Gift
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        Only ICFC supported. Additional token types require a DAO proposal.
      </p>
    </div>
  );
}

// ─── Edit Profile Modal ────────────────────────────────────────────────────────

interface EditModalProps {
  profile: UserProfile;
  onClose: () => void;
}

function EditProfileModal({ profile, onClose }: EditModalProps) {
  const saveProfile = useSaveCallerUserProfile();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(profile.websiteUrl ?? "");
  const [twitter, setTwitter] = useState(profile.twitter ?? "");
  const [discord, setDiscord] = useState(profile.discord ?? "");
  const [telegram, setTelegram] = useState(profile.telegram ?? "");
  const [hideFromLeaderboard, setHideFromLeaderboard] = useState(
    profile.hideFromLeaderboard,
  );
  const [nameError, setNameError] = useState("");

  // Avatar / banner upload state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    assetUrl(profile.profilePicAssetId) ?? null,
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    assetUrl(profile.bannerAssetId) ?? null,
  );
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const validateName = (v: string) => {
    if (!v.trim()) return "Display name is required";
    if (v.trim().length < 3) return "Must be at least 3 characters";
    if (v.trim().length > 32) return "Must be 32 characters or fewer";
    return "";
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarUploading(true);
    try {
      await uploadAsset(file);
      toast.success("Profile picture uploaded");
    } catch {
      toast.error("Upload failed");
      setAvatarPreview(assetUrl(profile.profilePicAssetId) ?? null);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleBannerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerPreview(URL.createObjectURL(file));
    setBannerUploading(true);
    try {
      await uploadAsset(file);
      toast.success("Banner uploaded");
    } catch {
      toast.error("Upload failed");
      setBannerPreview(assetUrl(profile.bannerAssetId) ?? null);
    } finally {
      setBannerUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateName(displayName);
    if (err) {
      setNameError(err);
      return;
    }
    try {
      await saveProfile.mutateAsync({
        displayName: displayName.trim(),
        bio: bio.trim(),
        hideFromLeaderboard,
        twitter: twitter.trim() || undefined,
        discord: discord.trim() || undefined,
        telegram: telegram.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
      });
      toast.success("Profile saved!");
      onClose();
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-sm overflow-y-auto"
      data-ocid="profile.edit.dialog"
    >
      <div
        className="relative w-full max-w-lg mx-auto my-4 sm:my-10 bg-card rounded-2xl border border-primary/30 arcade-bezel"
        style={{ boxShadow: "0 0 40px oklch(var(--primary)/0.2)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-lg font-bold neon-text-primary">
            Edit Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-ocid="profile.edit.close_button"
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* ── Banner Upload ─── */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Banner Image
            </p>
            <button
              type="button"
              className="relative w-full h-24 rounded-lg overflow-hidden bg-muted/30 border border-border cursor-pointer group text-left"
              onClick={() => bannerInputRef.current?.click()}
              aria-label="Upload banner image"
              data-ocid="profile.edit.banner.dropzone"
            >
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center gap-2 text-muted-foreground">
                  <Camera className="w-5 h-5" />
                  <span className="text-sm">Upload banner</span>
                </div>
              )}
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {bannerUploading ? (
                  <div className="w-5 h-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-foreground" />
                )}
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerFile}
                data-ocid="profile.edit.banner.upload_button"
              />
            </button>
            <p className="text-xs text-muted-foreground">
              Recommended: 1200×300px. Max 1.5 MB.
            </p>
          </div>

          {/* ── Avatar Upload ─── */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 cursor-pointer group border-2 border-primary/40"
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Upload profile picture"
              data-ocid="profile.edit.avatar.dropzone"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <span className="font-display text-xl font-bold text-primary">
                    {(displayName[0] ?? "?").toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                {avatarUploading ? (
                  <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-foreground" />
                )}
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFile}
                data-ocid="profile.edit.avatar.upload_button"
              />
            </button>
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Profile Picture
              </p>
              <p className="text-xs text-muted-foreground">
                Square image, max 1.5 MB
              </p>
            </div>
          </div>

          {/* ── Display Name ─── */}
          <div className="space-y-1.5">
            <label
              htmlFor="edit-name"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Display Name <span className="text-destructive">*</span>
            </label>
            <input
              id="edit-name"
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (nameError) setNameError(validateName(e.target.value));
              }}
              onBlur={() => setNameError(validateName(displayName))}
              maxLength={32}
              placeholder="NeonRider42"
              data-ocid="profile.edit.name.input"
              className={`w-full px-3 py-2 rounded-md bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground ${nameError ? "border-destructive" : "border-input"}`}
            />
            {nameError && (
              <p
                className="text-xs text-destructive"
                data-ocid="profile.edit.name.field_error"
              >
                {nameError}
              </p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {displayName.length}/32
            </p>
          </div>

          {/* ── Bio ─── */}
          <div className="space-y-1.5">
            <label
              htmlFor="edit-bio"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Bio{" "}
              <span className="text-muted-foreground font-normal normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="Tell other players about yourself…"
              data-ocid="profile.edit.bio.textarea"
              className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {bio.length}/200
            </p>
          </div>

          {/* ── Website ─── */}
          <div className="space-y-1.5">
            <label
              htmlFor="edit-website"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Website URL
            </label>
            <input
              id="edit-website"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yoursite.com"
              data-ocid="profile.edit.website.input"
              className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* ── Social links ─── */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Social Links
            </p>
            <div className="grid grid-cols-1 gap-2">
              {(
                [
                  {
                    id: "twitter",
                    icon: <SiX className="w-3.5 h-3.5" />,
                    placeholder: "username (no @)",
                    value: twitter,
                    set: setTwitter,
                    ocid: "profile.edit.twitter.input",
                  },
                  {
                    id: "discord",
                    icon: <SiDiscord className="w-3.5 h-3.5" />,
                    placeholder: "Discord username",
                    value: discord,
                    set: setDiscord,
                    ocid: "profile.edit.discord.input",
                  },
                  {
                    id: "telegram",
                    icon: <SiTelegram className="w-3.5 h-3.5" />,
                    placeholder: "Telegram handle (no @)",
                    value: telegram,
                    set: setTelegram,
                    ocid: "profile.edit.telegram.input",
                  },
                ] as const
              ).map(({ id, icon, placeholder, value, set, ocid }) => (
                <div key={id} className="flex items-center gap-2">
                  <div className="text-muted-foreground w-6 flex justify-center">
                    {icon}
                  </div>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    placeholder={placeholder}
                    data-ocid={ocid}
                    className="flex-1 px-3 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Hide from leaderboard ─── */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Hide from leaderboard
              </p>
              <p className="text-xs text-muted-foreground">
                Your scores won't appear in public rankings
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={hideFromLeaderboard}
              onClick={() => setHideFromLeaderboard((v) => !v)}
              data-ocid="profile.edit.hide_leaderboard.switch"
              className={`relative w-11 h-6 rounded-full border-2 transition-colors ${hideFromLeaderboard ? "bg-primary/80 border-primary" : "bg-muted border-border"}`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-all ${hideFromLeaderboard ? "left-[22px]" : "left-0.5"}`}
              />
            </button>
          </div>

          {/* ── Actions ─── */}
          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              data-ocid="profile.edit.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                saveProfile.isPending || avatarUploading || bannerUploading
              }
              className="border border-primary/60 text-primary bg-primary/10 hover:bg-primary/20 font-semibold"
              style={{ boxShadow: "0 0 12px oklch(var(--primary)/0.3)" }}
              data-ocid="profile.edit.save_button"
            >
              {saveProfile.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Profile Page ─────────────────────────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("achievements");

  const { data: profile, isLoading: profileLoading } =
    useGetCallerUserProfile();

  const principalStr = profile ? profile.id.toString() : null;

  const { data: allAchievements = [], isLoading: achievementsLoading } =
    useGetAchievements();
  const { data: earnedIds = [], isLoading: earnedLoading } =
    useGetPlayerAchievements(principalStr);
  const { data: allTables = [], isLoading: tablesLoading } = useGetTables();
  const { data: skinCollections = [], isLoading: skinsLoading } =
    useGetSkinCollections();

  if (profileLoading) return <ProfileSkeleton />;
  if (!profile) return <LoginPrompt />;

  const earnedSet = new Set(earnedIds);
  const earnedAchievements = allAchievements.filter((a) => earnedSet.has(a.id));
  const lockedAchievements = allAchievements.filter(
    (a) => !earnedSet.has(a.id),
  );

  const principalFull = profile.id.toString();
  const principalShort = `${principalFull.slice(0, 12)}…${principalFull.slice(-8)}`;

  const joinDate = new Date(
    Number(profile.createdAt) / 1_000_000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tablesOwned = allTables.filter(
    (t) => t.dao?.ownerPrincipal === principalFull,
  );

  // Flatten owned skin items from collections
  const ownedSkins = skinCollections.flatMap((col) => {
    type SkinCol = {
      id: string;
      name: string;
      items?: {
        id: string;
        name: string;
        assetUrl?: string;
        skinType?: string;
      }[];
    };
    const c = col as unknown as SkinCol;
    return (c.items ?? []).map((item) => ({ ...item, collectionName: c.name }));
  });

  const avatarSrc = assetUrl(profile.profilePicAssetId);
  const bannerSrc = assetUrl(profile.bannerAssetId);
  const initials = profile.displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const referralLink = `${window.location.origin}?ref=${profile.referralCode}`;

  const copyReferral = () => {
    void navigator.clipboard.writeText(profile.referralCode);
    toast.success("Referral code copied!");
  };

  const shareReferral = () => {
    void navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 pb-16 space-y-0">
        {/* ── Banner ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full h-40 sm:h-52 rounded-t-2xl overflow-hidden group"
          data-ocid="profile.banner.card"
        >
          {bannerSrc ? (
            <img
              src={bannerSrc}
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--primary)/0.4) 0%, oklch(var(--accent)/0.3) 50%, oklch(var(--background)) 100%)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 60%, oklch(var(--primary)/0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, oklch(var(--accent)/0.25) 0%, transparent 50%)",
                }}
              />
            </div>
          )}
          {/* Banner edit overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => setEditOpen(true)}
            aria-label="Change banner image"
            data-ocid="profile.banner.edit_button"
          >
            <div className="flex items-center gap-2 text-foreground bg-card/80 px-3 py-1.5 rounded-lg border border-border">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-semibold">Change Banner</span>
            </div>
          </button>
        </motion.div>

        {/* ── Profile header card ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-card border-x border-b border-border rounded-b-2xl px-5 pb-5 pt-0"
          data-ocid="profile.panel"
        >
          {/* Avatar + edit row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5">
            {/* Avatar overlapping banner */}
            <div className="relative -mt-10 flex-shrink-0">
              <div
                className="w-20 h-20 rounded-full overflow-hidden border-4 border-card"
                style={{
                  boxShadow: "0 0 24px oklch(var(--primary)/0.5)",
                }}
              >
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={profile.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-primary">
                      {initials || "?"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Name + info */}
            <div className="flex-1 min-w-0 pt-2 sm:pt-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground truncate">
                  {profile.displayName}
                </h1>
                {profile.hideFromLeaderboard && (
                  <UiBadge
                    variant="outline"
                    className="text-xs border-muted-foreground/40 text-muted-foreground gap-1"
                  >
                    <EyeOff className="w-3 h-3" />
                    Hidden from leaderboard
                  </UiBadge>
                )}
              </div>

              {/* Principal */}
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className="text-xs text-muted-foreground font-mono"
                  title={principalFull}
                >
                  {principalShort}
                </span>
                <CopyButton text={principalFull} />
              </div>

              <p className="text-xs text-muted-foreground mt-0.5">
                Joined {joinDate}
              </p>

              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {profile.bio}
                </p>
              )}

              {/* Social links */}
              {(profile.twitter ||
                profile.discord ||
                profile.telegram ||
                profile.websiteUrl) && (
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {profile.websiteUrl && (
                    <a
                      href={profile.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Website"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {profile.twitter && (
                    <a
                      href={`https://x.com/${profile.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="X / Twitter"
                    >
                      <SiX className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.discord && (
                    <a
                      href={`https://discord.com/users/${profile.discord}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Discord"
                    >
                      <SiDiscord className="w-4 h-4" />
                    </a>
                  )}
                  {profile.telegram && (
                    <a
                      href={`https://t.me/${profile.telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Telegram"
                    >
                      <SiTelegram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Edit button */}
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 self-start sm:self-end border-primary/40 hover:border-primary/70 gap-1.5"
              onClick={() => setEditOpen(true)}
              data-ocid="profile.edit_button"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* ── Stats Row ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
          data-ocid="profile.stats.section"
        >
          <StatCard
            icon={<GamepadIcon className="w-6 h-6" />}
            label="Games Played"
            value={profile.totalGamesPlayed ?? 0}
            accent
          />
          <StatCard
            icon={<TableProperties className="w-6 h-6" />}
            label="Tables Created"
            value={tablesOwned.length}
          />
          <StatCard
            icon={<Coins className="w-6 h-6" />}
            label="ICFC Earned"
            value="—"
            accent
          />
          <StatCard
            icon={<Star className="w-6 h-6" />}
            label="Best Score"
            value={Number(profile.totalScore ?? 0).toLocaleString()}
          />
        </motion.div>

        {/* ── Gift Card (inline) ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-6"
        >
          <GiftingCard />
        </motion.div>

        {/* ── Tabbed Content ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/40 border border-border mb-6 flex overflow-x-auto w-full sm:w-auto">
              <TabsTrigger
                value="achievements"
                data-ocid="profile.achievements.tab"
                className="gap-1.5 flex-shrink-0"
              >
                <Trophy className="w-4 h-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="skins"
                data-ocid="profile.skins.tab"
                className="gap-1.5 flex-shrink-0"
              >
                <Shirt className="w-4 h-4" />
                Skins
              </TabsTrigger>
              <TabsTrigger
                value="tables"
                data-ocid="profile.tables.tab"
                className="gap-1.5 flex-shrink-0"
              >
                <TableProperties className="w-4 h-4" />
                My Tables
              </TabsTrigger>
              <TabsTrigger
                value="referral"
                data-ocid="profile.referral.tab"
                className="gap-1.5 flex-shrink-0"
              >
                <Medal className="w-4 h-4" />
                Referral
              </TabsTrigger>
            </TabsList>

            {/* ─ Achievements tab ─ */}
            <TabsContent value="achievements">
              {achievementsLoading || earnedLoading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))}
                </div>
              ) : allAchievements.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 gap-4"
                  data-ocid="profile.achievements.empty_state"
                >
                  <Trophy className="w-12 h-12 text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground text-center">
                    No achievements available yet.
                    <br />
                    Start playing to unlock them!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {earnedAchievements.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-accent mb-3 flex items-center gap-1.5">
                        <Zap className="w-3 h-3" /> Unlocked (
                        {earnedAchievements.length})
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {earnedAchievements.map((a, i) => (
                          <motion.div
                            key={a.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            data-ocid={`profile.achievements.item.${i + 1}`}
                          >
                            <AchievementCard achievement={a} earned={true} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  {lockedAchievements.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
                        <Lock className="w-3 h-3" /> Locked (
                        {lockedAchievements.length})
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {lockedAchievements.map((a, i) => (
                          <div
                            key={a.id}
                            data-ocid={`profile.locked_achievements.item.${i + 1}`}
                          >
                            <AchievementCard achievement={a} earned={false} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* ─ Skins tab ─ */}
            <TabsContent value="skins">
              {skinsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-36 rounded-xl" />
                  ))}
                </div>
              ) : ownedSkins.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 gap-4"
                  data-ocid="profile.skins.empty_state"
                >
                  <Shirt className="w-12 h-12 text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground text-center">
                    No skins owned yet.
                    <br />
                    Visit the marketplace to purchase ICRC-7 NFT skins.
                  </p>
                  <Button
                    variant="outline"
                    className="border-accent/40 text-accent hover:border-accent/70"
                    onClick={() => navigate({ to: "/marketplace" })}
                    data-ocid="profile.skins.marketplace_button"
                  >
                    Browse Marketplace
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {ownedSkins.map((skin, i) => (
                    <motion.div
                      key={skin.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      data-ocid={`profile.skins.item.${i + 1}`}
                      className="arcade-card flex flex-col items-center gap-2 text-center"
                    >
                      {skin.assetUrl ? (
                        <img
                          src={skin.assetUrl}
                          alt={skin.name}
                          className="w-16 h-16 rounded-lg object-contain"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center text-2xl">
                          🎱
                        </div>
                      )}
                      <p className="font-display font-bold text-sm truncate w-full">
                        {skin.name}
                      </p>
                      <UiBadge
                        variant="outline"
                        className="text-[10px] border-primary/40 text-primary"
                      >
                        {skin.skinType ?? "skin"}
                      </UiBadge>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ─ Tables tab ─ */}
            <TabsContent value="tables">
              {tablesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {tablesOwned.length} table
                      {tablesOwned.length !== 1 ? "s" : ""} owned
                    </p>
                    <Button
                      size="sm"
                      className="border border-primary/50 text-primary bg-primary/10 hover:bg-primary/20"
                      onClick={() => navigate({ to: "/constructor" })}
                      data-ocid="profile.create_table_button"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Create New Table
                    </Button>
                  </div>

                  {tablesOwned.length === 0 ? (
                    <div
                      className="flex flex-col items-center justify-center py-16 gap-4"
                      data-ocid="profile.tables.empty_state"
                    >
                      <TableProperties className="w-12 h-12 text-muted-foreground opacity-40" />
                      <p className="text-muted-foreground text-center">
                        You haven't created any tables yet.
                        <br />
                        Launch your first arcade table!
                      </p>
                      <Button
                        variant="outline"
                        className="border-primary/40 mt-2"
                        onClick={() => navigate({ to: "/constructor" })}
                        data-ocid="profile.tables.create_first_button"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Build Your First Table
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tablesOwned.map((table, i) => (
                        <div
                          key={table.id}
                          data-ocid={`profile.tables.item.${i + 1}`}
                        >
                          <TableRow table={table} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* ─ Referral tab ─ */}
            <TabsContent value="referral">
              <div className="space-y-6 max-w-lg mx-auto">
                {/* Referral code box */}
                <div
                  className="rounded-xl p-6 border text-center space-y-4"
                  style={{
                    borderColor: "oklch(var(--accent)/0.6)",
                    background: "oklch(var(--accent)/0.05)",
                    boxShadow:
                      "0 0 30px oklch(var(--accent)/0.2), inset 0 0 20px oklch(var(--accent)/0.05)",
                  }}
                  data-ocid="profile.referral.card"
                >
                  <p className="text-xs uppercase tracking-widest text-accent font-semibold">
                    Your Referral Code
                  </p>
                  <p
                    className="font-mono text-3xl font-bold tracking-widest text-foreground select-all"
                    data-ocid="profile.referral.code"
                  >
                    {profile.referralCode}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      className="border-accent/50 text-accent hover:border-accent/80 gap-1.5"
                      onClick={copyReferral}
                      data-ocid="profile.referral.copy_button"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </Button>
                    <Button
                      className="border border-accent/50 text-accent bg-accent/10 hover:bg-accent/20 gap-1.5"
                      onClick={shareReferral}
                      data-ocid="profile.referral.share_button"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Link
                    </Button>
                  </div>
                </div>

                {/* How it works */}
                <div className="arcade-card space-y-3">
                  <p className="font-display font-bold text-sm text-foreground">
                    How it works
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Share your referral code or link. When a new player signs up
                    and makes their{" "}
                    <strong className="text-foreground">first paid play</strong>{" "}
                    on any table, you earn{" "}
                    <strong className="text-accent">1 ICFC</strong> — paid
                    instantly by the table's treasury.
                  </p>
                  <div className="h-px bg-border" />
                  <p className="text-xs text-muted-foreground">
                    One reward per referred player (lifetime). Additional reward
                    tiers can be voted in by the DAO.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="rounded-xl p-4 border border-border bg-card text-center"
                    data-ocid="profile.referral.total_referrals"
                  >
                    <p className="font-mono text-2xl font-bold text-primary">
                      0
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                      Total Referrals
                    </p>
                  </div>
                  <div
                    className="rounded-xl p-4 border border-border bg-card text-center"
                    data-ocid="profile.referral.total_earned"
                  >
                    <p className="font-mono text-2xl font-bold text-accent">
                      0
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                      ICFC Earned
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* ── Edit Modal ──────────────────────────────────────────────── */}
      {editOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
