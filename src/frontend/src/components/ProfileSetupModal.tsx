import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ProfileUpdateInput } from "../backend";
import type { UserProfile } from "../hooks/useQueries";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

interface ProfileSetupModalProps {
  open?: boolean;
  onClose?: () => void;
  existingProfile?: UserProfile;
}

export default function ProfileSetupModal({
  open = true,
  onClose,
  existingProfile,
}: ProfileSetupModalProps) {
  const [name, setName] = useState(existingProfile?.displayName ?? "");
  const [nameError, setNameError] = useState("");
  const saveProfile = useSaveCallerUserProfile();

  useEffect(() => {
    if (existingProfile) {
      setName(existingProfile.displayName);
    }
  }, [existingProfile]);

  const isEdit = !!existingProfile;

  const validateName = (val: string) => {
    if (!val.trim()) return "Player name is required";
    if (val.trim().length < 3) return "Name must be at least 3 characters";
    if (val.trim().length > 32) return "Name must be 32 characters or fewer";
    return "";
  };

  const handleNameBlur = () => {
    setNameError(validateName(name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateName(name);
    if (error) {
      setNameError(error);
      return;
    }

    const profilePayload: ProfileUpdateInput = {
      displayName: name.trim(),
      bio: existingProfile?.bio ?? "",
      hideFromLeaderboard: existingProfile?.hideFromLeaderboard ?? false,
      twitter: existingProfile?.twitter,
      discord: existingProfile?.discord,
      telegram: existingProfile?.telegram,
      websiteUrl: existingProfile?.websiteUrl,
    };

    try {
      await saveProfile.mutateAsync(profilePayload);
      toast.success(isEdit ? "Profile updated!" : "Welcome to PinballHEIR!");
      onClose?.();
    } catch (err) {
      toast.error(
        isEdit ? "Failed to update profile" : "Failed to create profile",
      );
      console.error(err);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && onClose) onClose();
    // First-setup mode: prevent closing without onClose
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md arcade-bezel bg-card border-primary/40"
        onPointerDownOutside={!onClose ? (e) => e.preventDefault() : undefined}
        data-ocid="profile.setup.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl neon-text-primary">
            {isEdit ? "Edit Your Profile" : "Welcome to PinballHEIR!"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEdit
              ? "Update your player name to be shown on leaderboards."
              : "Set up your player identity. Your name will appear on leaderboards and in gameplay."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Player name */}
          <div className="space-y-2">
            <Label htmlFor="player-name" className="font-display font-semibold">
              Player Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="player-name"
              placeholder="e.g. NeonRider42"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(validateName(e.target.value));
              }}
              onBlur={handleNameBlur}
              autoFocus
              maxLength={32}
              data-ocid="profile.setup.name.input"
              className={
                nameError
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {nameError && (
              <p
                className="text-xs text-destructive font-medium"
                data-ocid="profile.setup.name.field_error"
              >
                {nameError}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {name.length}/32 characters
            </p>
          </div>

          {/* Bio (only for edit mode — backend UserProfile doesn't have bio field) */}
          {isEdit && (
            <div className="space-y-2">
              <Label
                htmlFor="player-bio"
                className="font-display font-semibold"
              >
                Bio{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="player-bio"
                placeholder="Tell other players about yourself…"
                rows={3}
                maxLength={200}
                data-ocid="profile.setup.bio.textarea"
              />
            </div>
          )}

          {/* Social links shown in edit mode */}
          {isEdit && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-display font-semibold uppercase tracking-wider">
                Social Links (optional)
              </p>
              {(
                [
                  {
                    id: "twitter",
                    placeholder: "Twitter / X handle",
                    label: "Twitter",
                  },
                  {
                    id: "discord",
                    placeholder: "Discord username",
                    label: "Discord",
                  },
                  {
                    id: "telegram",
                    placeholder: "Telegram handle",
                    label: "Telegram",
                  },
                ] as const
              ).map(({ id, placeholder, label }) => (
                <div key={id} className="space-y-1">
                  <Label
                    htmlFor={`social-${id}`}
                    className="text-xs text-muted-foreground"
                  >
                    {label}
                  </Label>
                  <Input
                    id={`social-${id}`}
                    placeholder={placeholder}
                    className="text-sm"
                    data-ocid={`profile.setup.${id}.input`}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-1">
            {onClose && (
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                data-ocid="profile.setup.cancel_button"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={saveProfile.isPending}
              className="arcade-border arcade-glow font-semibold"
              data-ocid="profile.setup.submit_button"
            >
              {saveProfile.isPending
                ? isEdit
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                  ? "Save Changes"
                  : "Create Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
