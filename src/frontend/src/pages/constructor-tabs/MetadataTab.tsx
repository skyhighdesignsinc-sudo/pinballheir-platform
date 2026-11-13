import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PinballTableMetadata } from "@/types/index";
import { useState } from "react";

const DIFFICULTIES = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

export default function MetadataTab({
  name,
  metadata,
  onNameChange,
  onChange,
}: {
  name: string;
  metadata: PinballTableMetadata;
  onNameChange: (n: string) => void;
  onChange: (m: PinballTableMetadata) => void;
}) {
  const [tagInput, setTagInput] = useState("");
  const tags = metadata.tags ?? [];
  const desc = metadata.description ?? "";
  const nameLen = name.trim().length;
  const descLen = desc.length;

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t) && tags.length < 5) {
      onChange({ ...metadata, tags: [...tags, t] });
    }
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    onChange({ ...metadata, tags: tags.filter((t) => t !== tag) });

  return (
    <div className="space-y-5">
      {/* Core info */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Table Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-display font-medium">
                Table Name <span className="text-destructive">*</span>
              </Label>
              <span
                className={[
                  "text-xs font-mono",
                  nameLen < 3 || nameLen > 64
                    ? "text-destructive"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {nameLen}/64
              </span>
            </div>
            <Input
              placeholder="e.g. Neon Nights 2"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              maxLength={64}
              className={[
                "border-primary/40",
                nameLen > 0 && (nameLen < 3 || nameLen > 64)
                  ? "border-destructive/60"
                  : "",
              ].join(" ")}
              data-ocid="metadata.table_name.input"
            />
            {nameLen > 0 && nameLen < 3 && (
              <p
                className="text-xs text-destructive"
                data-ocid="metadata.name.field_error"
              >
                Name must be at least 3 characters
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-display font-medium">
                Description
              </Label>
              <span
                className={[
                  "text-xs font-mono",
                  descLen > 500 ? "text-destructive" : "text-muted-foreground",
                ].join(" ")}
              >
                {descLen}/500
              </span>
            </div>
            <Textarea
              placeholder="Describe your table's theme, gameplay, and what makes it special..."
              value={desc}
              onChange={(e) =>
                onChange({ ...metadata, description: e.target.value })
              }
              rows={4}
              maxLength={500}
              className="resize-none text-sm"
              data-ocid="metadata.description.textarea"
            />
          </div>

          {/* Preview image upload */}
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">
              Preview Image
            </Label>
            <Input
              placeholder="https://example.com/preview.jpg or upload URL"
              value={metadata.thumbnail ?? ""}
              onChange={(e) =>
                onChange({ ...metadata, thumbnail: e.target.value })
              }
              className="text-xs"
              data-ocid="metadata.thumbnail.input"
            />
            {metadata.thumbnail && (
              <div className="w-[120px] h-[180px] rounded-lg overflow-hidden border border-border/40 bg-muted/20">
                <img
                  src={metadata.thumbnail}
                  alt="Table preview thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">
              Difficulty
            </Label>
            <div
              className="flex gap-2 flex-wrap"
              data-ocid="metadata.difficulty.select"
            >
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChange({ ...metadata, difficulty: d })}
                  data-ocid={`metadata.difficulty.${d.toLowerCase()}`}
                  className={[
                    "px-3 py-1.5 rounded-md text-xs font-display font-semibold border transition-all duration-200",
                    metadata.difficulty === d
                      ? "border-primary bg-primary/15 text-primary arcade-glow"
                      : "border-border/40 bg-card/30 text-muted-foreground hover:border-primary/30",
                  ].join(" ")}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Tags
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              (up to 5)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="e.g. cyberpunk, hard, neon…"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              disabled={tags.length >= 5}
              className="text-sm"
              data-ocid="metadata.tag.input"
            />
            <Button
              size="sm"
              onClick={addTag}
              variant="outline"
              disabled={tags.length >= 5 || !tagInput.trim()}
              data-ocid="metadata.tag.add_button"
            >
              Add
            </Button>
          </div>
          {tags.length === 0 ? (
            <p
              className="text-xs text-muted-foreground"
              data-ocid="metadata.tags.empty_state"
            >
              No tags yet — add up to 5 to help players discover your table
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1.5 cursor-pointer hover:bg-destructive/20 pr-1"
                  data-ocid={`metadata.tag.item.${i + 1}`}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-muted-foreground hover:text-foreground focus:outline-none ml-1"
                    aria-label={`Remove tag ${tag}`}
                    data-ocid={`metadata.tag.delete_button.${i + 1}`}
                  >
                    ✕
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Version / changelog */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Version Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">Version</Label>
            <Input
              placeholder="1.0.0"
              value={metadata.version ?? "1.0.0"}
              onChange={(e) =>
                onChange({ ...metadata, version: e.target.value })
              }
              className="w-32 text-xs font-mono"
              data-ocid="metadata.version.input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">
              Changelog
            </Label>
            <Textarea
              placeholder="What's new in this version..."
              value={metadata.changelog ?? ""}
              onChange={(e) =>
                onChange({ ...metadata, changelog: e.target.value })
              }
              rows={2}
              className="resize-none text-xs"
              data-ocid="metadata.changelog.textarea"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
