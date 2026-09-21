import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Headphones } from "lucide-react";

interface AudioPlayerProps {
  title: string;
  audioUrl?: string;
  duration?: string;
  host?: string;
  description?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  title,
  audioUrl,
  duration = "15 min",
  host = "EncodeEdge",
  description,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setTotalDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-black-200 dark:border-black-800 bg-black-50 dark:bg-black-900 p-6 not-prose shadow-sm">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ghost-accent px-3 py-1 text-xs font-semibold text-black">
              <Headphones className="size-3.5" />
              Podcast / Audio
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              by {host}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {duration}
          </span>
        </div>

        {/* Title and Description */}
        <div>
          <h4 className="text-xl font-bold font-display tracking-tight text-foreground">
            {title}
          </h4>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-black text-white hover:scale-105 active:scale-95 dark:bg-white dark:text-black transition-transform cursor-pointer shadow-md"
          >
            {isPlaying ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="size-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Progress Slider */}
          <div className="flex flex-1 flex-col gap-1">
            <input
              type="range"
              min={0}
              max={totalDuration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="h-1.5 w-full cursor-pointer accent-black dark:accent-white bg-black-200 dark:bg-black-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{totalDuration ? formatTime(totalDuration) : duration}</span>
            </div>
          </div>

          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AudioPlayer;

