import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  Music,
  Pause,
  Play,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { SliderField } from "../ConstructorPage";

interface SoundTabState {
  backgroundMusicFile: File | null;
  backgroundMusicName: string;
  bumperSfxFile: File | null;
  bumperSfxName: string;
  flipperSfxFile: File | null;
  flipperSfxName: string;
  drainSfxFile: File | null;
  drainSfxName: string;
  jackpotFile: File | null;
  jackpotName: string;
  masterVolume: number;
  royaltyFreeMusic: boolean;
}

interface AudioDropZoneProps {
  label: string;
  hint: string;
  accept: string;
  maxMB: number;
  fileName: string;
  ocid: string;
  onFile: (file: File, name: string) => void;
  onRemove: () => void;
}

function AudioDropZone({
  label,
  hint,
  accept,
  maxMB,
  fileName,
  ocid,
  onFile,
  onRemove,
}: AudioDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File too large (max ${maxMB}MB)`);
      return;
    }
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    audioRef.current = new Audio(url);
    audioRef.current.onended = () => setIsPlaying(false);
    onFile(file, file.name);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      void audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRemove = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
    setIsPlaying(false);
    setError(null);
    onRemove();
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-display font-medium">{label}</Label>
      {fileName ? (
        <div
          className="flex items-center gap-3 lever-control"
          data-ocid={`${ocid}.player`}
        >
          <Music className="w-4 h-4 text-accent shrink-0" />
          <span className="text-xs text-muted-foreground truncate flex-1">
            {fileName}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 shrink-0"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause preview" : "Play preview"}
            data-ocid={`${ocid}.preview_button`}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0"
            onClick={handleRemove}
            aria-label="Remove file"
            data-ocid={`${ocid}.delete_button`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          className={[
            "relative w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-6 px-4 transition-all duration-200 cursor-pointer",
            isDragging
              ? "border-accent/70 bg-accent/5"
              : "border-border/40 bg-muted/10 hover:border-primary/40 hover:bg-primary/5",
          ].join(" ")}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          data-ocid={`${ocid}.dropzone`}
          aria-label={`Upload ${label}`}
        >
          <Upload className="w-5 h-5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground text-center">
            Drag & drop or{" "}
            <span className="text-primary font-semibold">browse</span>
          </p>
          <p className="text-[10px] text-muted-foreground/60">
            {hint} · max {maxMB}MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            data-ocid={`${ocid}.upload_button`}
          />
        </button>
      )}
      {error && (
        <div
          className="flex items-center gap-1.5 text-xs text-destructive"
          data-ocid={`${ocid}.error_state`}
        >
          <AlertTriangle className="w-3 h-3 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

export default function SoundTab({
  state,
  onChange,
}: {
  state: SoundTabState;
  onChange: (s: SoundTabState) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Master volume */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SliderField
            label="Master Volume"
            value={state.masterVolume}
            min={0}
            max={100}
            step={1}
            onChange={(v) => onChange({ ...state, masterVolume: v })}
            formatValue={(v) => `${v}%`}
            descriptors={["0% Off", "50%", "100% Full"]}
            ocid="sound.master_volume"
          />
        </CardContent>
      </Card>

      {/* Background music */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Background Music
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="lever-control">
            <Switch
              checked={state.royaltyFreeMusic}
              onCheckedChange={(v) =>
                onChange({ ...state, royaltyFreeMusic: v })
              }
              data-ocid="sound.royalty_free.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">
                Use Built-in Royalty-Free Loops
              </Label>
              <p className="text-xs text-muted-foreground">
                Disables custom upload — uses curated in-game tracks
              </p>
            </div>
          </div>
          {!state.royaltyFreeMusic && (
            <AudioDropZone
              label="Background Track (MP3/WAV)"
              hint="MP3 or WAV"
              accept="audio/mp3,audio/mpeg,audio/wav"
              maxMB={10}
              fileName={state.backgroundMusicName}
              ocid="sound.bg_music"
              onFile={(f, n) =>
                onChange({
                  ...state,
                  backgroundMusicFile: f,
                  backgroundMusicName: n,
                })
              }
              onRemove={() =>
                onChange({
                  ...state,
                  backgroundMusicFile: null,
                  backgroundMusicName: "",
                })
              }
            />
          )}
        </CardContent>
      </Card>

      {/* SFX */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Sound Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <AudioDropZone
            label="Bumper Hit SFX"
            hint="Short clip · MP3 or WAV"
            accept="audio/mp3,audio/mpeg,audio/wav"
            maxMB={1}
            fileName={state.bumperSfxName}
            ocid="sound.bumper_sfx"
            onFile={(f, n) =>
              onChange({ ...state, bumperSfxFile: f, bumperSfxName: n })
            }
            onRemove={() =>
              onChange({ ...state, bumperSfxFile: null, bumperSfxName: "" })
            }
          />
          <AudioDropZone
            label="Flipper SFX"
            hint="Short clip · MP3 or WAV"
            accept="audio/mp3,audio/mpeg,audio/wav"
            maxMB={1}
            fileName={state.flipperSfxName}
            ocid="sound.flipper_sfx"
            onFile={(f, n) =>
              onChange({ ...state, flipperSfxFile: f, flipperSfxName: n })
            }
            onRemove={() =>
              onChange({ ...state, flipperSfxFile: null, flipperSfxName: "" })
            }
          />
          <AudioDropZone
            label="Ball Drain SFX"
            hint="Short clip · MP3 or WAV"
            accept="audio/mp3,audio/mpeg,audio/wav"
            maxMB={1}
            fileName={state.drainSfxName}
            ocid="sound.drain_sfx"
            onFile={(f, n) =>
              onChange({ ...state, drainSfxFile: f, drainSfxName: n })
            }
            onRemove={() =>
              onChange({ ...state, drainSfxFile: null, drainSfxName: "" })
            }
          />
          <AudioDropZone
            label="Jackpot Fanfare"
            hint="MP3 or WAV"
            accept="audio/mp3,audio/mpeg,audio/wav"
            maxMB={3}
            fileName={state.jackpotName}
            ocid="sound.jackpot_fanfare"
            onFile={(f, n) =>
              onChange({ ...state, jackpotFile: f, jackpotName: n })
            }
            onRemove={() =>
              onChange({ ...state, jackpotFile: null, jackpotName: "" })
            }
          />
        </CardContent>
      </Card>

      {/* Upload guidance */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/10 border border-border/20 px-3 py-2.5 text-xs text-muted-foreground">
        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent" />
        <span>
          <span className="text-foreground font-semibold">File limits:</span>{" "}
          Background track max 10MB, SFX max 1MB each, fanfare max 3MB.
          Recommended formats: MP3 at 128kbps for best file size/quality ratio.
          Files are stored as secure blob references.
        </span>
      </div>
    </div>
  );
}
