import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  ArrowLeftIcon,
  MaximizeIcon,
  MinimizeIcon,
  PauseIcon,
  PlayIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";

import * as api from "@/lib/api";
import { formatTime } from "@/lib/formats";
import {
  Lecture as LectureEntity,
  LectureActivity as LectureActivityEntity,
  UpdateLectureActivityDto,
} from "@/generated/openapi-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-black text-white">
      Loading player...
    </div>
  ),
}) as unknown as ComponentType<any>;

interface Props {
  lecture: LectureEntity;
  lectureActivity?: LectureActivityEntity;
}

export const VideoPlayer = ({ lecture, lectureActivity }: Props) => {
  const router = useRouter();
  const updateLectureActivityMutation = useMutation({
    mutationFn: (updateLectureActivityDto: UpdateLectureActivityDto) =>
      api.updateLectureActivity(lecture.id, updateLectureActivityDto),
    onSuccess: (result) => {
      console.log("Update Lecture Activity Success");
      console.log(result);
    },
  });

  const videoUrl = (lecture.videoStorageInfo as any)?.cloudFront?.url as
    | string
    | undefined;

  const playerRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasSeekOnReadyRef = useRef(false);

  const [played, setPlayed] = useState(0); // fraction 0~1
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playing, setPlaying] = useState(true);
  const [seeking, setSeeking] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    hasSeekOnReadyRef.current = false;
    setPlayed(0);
    setPlayedSeconds(0);
  }, [lecture.id]);

  const handlePlayPause = () => {
    setPlaying((prev) => !prev);

    updateLectureActivityMutation.mutate({
      duration: playedSeconds,
      isCompleted: played >= 0.95,
      lastWatchedAt: new Date().toISOString(),
      progress: Math.round(played * 100),
    });
  };

  const handleMute = () => {
    setMuted((prev) => !prev);
  };

  const handleVolumeChange = (values: number[]) => {
    const value = values[0] / 100;
    setVolume(value);
    setMuted(value === 0);
  };

  const handleSeekChange = (values: number[]) => {
    setPlayed(values[0] / 100);
  };

  const handleSeekCommit = (values: number[]) => {
    const fraction = values[0] / 100;
    playerRef.current?.seekTo(fraction, "fraction");
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) setPlayed(state.played);

    setPlayedSeconds(Math.floor(state.playedSeconds));

    updateLectureActivityMutation.mutate({
      duration: playedSeconds,
      isCompleted: played >= 0.95,
      lastWatchedAt: new Date().toISOString(),
      progress: Math.round(played * 100),
    });
  };

  const handleEnded = () => {
    updateLectureActivityMutation.mutate({
      duration: Math.round(totalDuration),
      isCompleted: true,
      lastWatchedAt: new Date().toISOString(),
      progress: 100,
    });
  };

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapperRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === wrapperRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (!videoUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-black text-white">
        영상이 준비되지 않았습니다.
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative h-full flex-1 bg-black">
      {/* ReactPlayer maintains 16:9 responsiveness by padding */}
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        muted={muted}
        volume={volume}
        playing={playing}
        width="100%"
        height="100%"
        style={{ backgroundColor: "black" }}
        onProgress={handleProgress}
        onDuration={setTotalDuration}
        onEnded={handleEnded}
        playbackRate={playbackRate}
        onReady={() => {
          if (lectureActivity && !hasSeekOnReadyRef.current) {
            hasSeekOnReadyRef.current = true;
            playerRef.current?.seekTo(lectureActivity.duration, "seconds");
          }
        }}
      />

      {/* Lecture title overlay */}
      <div className="absolute top-2 left-2 flex items-center">
        <button className="cursor-pointer" onClick={() => router.back()}>
          <ArrowLeftIcon color="white" size={20} />
        </button>

        <span className="rounded-md bg-black/60 px-3 py-1 text-sm font-semibold text-white md:text-base">
          {lecture.title}
        </span>
      </div>

      {/* Controls */}
      <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-2 bg-black/70 px-4 pt-2 pb-3 text-white backdrop-blur">
        {/* Progress slider */}
        <Slider
          min={0}
          max={100}
          value={[played * 100]}
          onValueChange={(value) => {
            setSeeking(true);
            handleSeekChange(value);
          }}
          onValueCommit={(value) => {
            handleSeekCommit(value);
            setSeeking(false);
          }}
        />

        {/* bottom control bar */}
        <div className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            {/* play/pause */}
            <button onClick={handlePlayPause} aria-label="play-pause">
              {playing ? (
                <PauseIcon className="size-4" />
              ) : (
                <PlayIcon className="size-4" />
              )}
            </button>

            {/* time */}
            <span className="text-xs tabular-nums">
              {formatTime(played * totalDuration)} / {formatTime(totalDuration)}
            </span>

            {/* volume */}
            <button onClick={handleMute} aria-label="mute">
              {muted || volume === 0 ? (
                <VolumeXIcon className="size-4" />
              ) : (
                <Volume2Icon className="size-4" />
              )}
            </button>

            <Slider
              className="w-24"
              min={0}
              max={100}
              value={[muted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* speed select */}
            <Select
              value={playbackRate.toString()}
              onValueChange={(value) => setPlaybackRate(parseFloat(value))}
            >
              <SelectTrigger className="h-8 w-16 border border-white/20 bg-black/20 text-xs">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="border border-white/20 bg-black text-white">
                {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                  <SelectItem
                    key={rate}
                    value={rate.toString()}
                    className="text-xs"
                  >
                    {rate}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* fullscreen */}
            <button onClick={toggleFullscreen} aria-label="fullscreen">
              {isFullscreen ? (
                <MinimizeIcon className="size-4" />
              ) : (
                <MaximizeIcon className="size-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
