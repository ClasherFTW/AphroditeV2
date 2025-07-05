"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { youTubePlayerService, type YouTubePlayerState } from "@/lib/youtube-player-service"
import {
  PlayIcon,
  PauseIcon,
  Volume2Icon,
  VolumeXIcon,
  MaximizeIcon,
  SettingsIcon,
  SkipBackIcon,
  SkipForwardIcon,
  RotateCcwIcon,
} from "lucide-react"

interface YouTubePlayerProps {
  videoId: string
  isHost: boolean
  onPlay?: () => void
  onPause?: () => void
  onSeek?: (time: number) => void
  className?: string
}

export default function YouTubePlayer({
  videoId,
  isHost,
  onPlay,
  onPause,
  onSeek,
  className = "",
}: YouTubePlayerProps) {
  const { toast } = useToast()
  const playerRef = useRef<HTMLDivElement>(null)
  const [playerState, setPlayerState] = useState<YouTubePlayerState>({
    videoId: "",
    currentTime: 0,
    isPlaying: false,
    duration: 0,
    volume: 100,
    playbackRate: 1,
  })
  const [isReady, setIsReady] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!playerRef.current || !videoId) return

    const initializePlayer = async () => {
      try {
        setIsLoading(true)
        await youTubePlayerService.createPlayer(playerRef.current!.id, videoId, isHost)

        // Set up event listeners
        youTubePlayerService.subscribe("ready", handlePlayerReady)
        youTubePlayerService.subscribe("stateChange", handleStateChange)
        youTubePlayerService.subscribe("error", handlePlayerError)

        console.log(`🎬 YouTube player initialized for video: ${videoId}`)
      } catch (error) {
        console.error("❌ Failed to initialize YouTube player:", error)
        toast({
          title: "Player Error",
          description: "Failed to load YouTube video. Please check the URL.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    initializePlayer()

    return () => {
      youTubePlayerService.unsubscribe("ready")
      youTubePlayerService.unsubscribe("stateChange")
      youTubePlayerService.unsubscribe("error")
    }
  }, [videoId, isHost])

  // Update player state periodically
  useEffect(() => {
    if (!isReady) return

    const interval = setInterval(() => {
      const state = youTubePlayerService.getPlayerState()
      setPlayerState(state)
    }, 1000)

    return () => clearInterval(interval)
  }, [isReady])

  const handlePlayerReady = (data: any) => {
    setIsReady(true)
    setPlayerState((prev) => ({
      ...prev,
      duration: data.duration,
      videoId: data.videoId,
    }))
    console.log("✅ YouTube player ready")
  }

  const handleStateChange = (data: any) => {
    setPlayerState((prev) => ({
      ...prev,
      currentTime: data.currentTime,
      duration: data.duration,
    }))
  }

  const handlePlayerError = (data: any) => {
    console.error("❌ YouTube player error:", data.error)
    toast({
      title: "Playback Error",
      description: "There was an issue with video playback.",
      variant: "destructive",
    })
  }

  const handlePlay = async () => {
    if (!isHost) return
    await youTubePlayerService.play()
    onPlay?.()
  }

  const handlePause = async () => {
    if (!isHost) return
    await youTubePlayerService.pause()
    onPause?.()
  }

  const handleSeek = async (time: number) => {
    if (!isHost) return
    await youTubePlayerService.seekTo(time)
    onSeek?.(time)
  }

  const handleSkipBack = () => {
    const newTime = Math.max(0, playerState.currentTime - 10)
    handleSeek(newTime)
  }

  const handleSkipForward = () => {
    const newTime = Math.min(playerState.duration, playerState.currentTime + 10)
    handleSeek(newTime)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getProgressPercentage = () => {
    if (playerState.duration === 0) return 0
    return (playerState.currentTime / playerState.duration) * 100
  }

  if (isLoading) {
    return (
      <Card className={`bg-black/20 border-white/10 backdrop-blur-sm ${className}`}>
        <CardContent className="p-0">
          <div className="aspect-video bg-black/40 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4" />
              <p className="text-white/60">Loading YouTube player...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-black/20 border-white/10 backdrop-blur-sm ${className}`}>
      <CardContent className="p-0 relative group">
        {/* YouTube Player Container */}
        <div className="aspect-video bg-black rounded-t-lg relative overflow-hidden">
          <div ref={playerRef} id={`youtube-player-${videoId}`} className="w-full h-full" />

          {/* Host Badge */}
          {isHost && <Badge className="absolute top-4 right-4 bg-red-500/90 text-white z-10">🎬 Host Controls</Badge>}

          {/* Participant Badge */}
          {!isHost && <Badge className="absolute top-4 right-4 bg-blue-500/90 text-white z-10">👥 Synchronized</Badge>}

          {/* Custom Controls Overlay (only for host) */}
          {isHost && showControls && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="w-full p-4 space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[playerState.currentTime]}
                    max={playerState.duration}
                    step={1}
                    onValueChange={([value]) => handleSeek(value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/80">
                    <span>{formatTime(playerState.currentTime)}</span>
                    <span>{formatTime(playerState.duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" onClick={handleSkipBack} className="bg-white/20 hover:bg-white/30 text-white">
                      <SkipBackIcon className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      onClick={playerState.isPlaying ? handlePause : handlePlay}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      {playerState.isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                    </Button>

                    <Button size="sm" onClick={handleSkipForward} className="bg-white/20 hover:bg-white/30 text-white">
                      <SkipForwardIcon className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleSeek(0)}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <RotateCcwIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      {isMuted ? <VolumeXIcon className="h-4 w-4" /> : <Volume2Icon className="h-4 w-4" />}
                    </Button>

                    <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                      <SettingsIcon className="h-4 w-4" />
                    </Button>

                    <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                      <MaximizeIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-black/40 p-3 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant={playerState.isPlaying ? "default" : "secondary"}>
                {playerState.isPlaying ? "🔴 Playing" : "⏸️ Paused"}
              </Badge>

              <span className="text-white/60 text-sm">
                {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {isHost ? (
                <Badge className="bg-red-500/20 text-red-300">Host Controls Active</Badge>
              ) : (
                <Badge className="bg-blue-500/20 text-blue-300">Synchronized Viewing</Badge>
              )}
            </div>
          </div>

          {/* Progress indicator for non-hosts */}
          {!isHost && (
            <div className="mt-2">
              <div className="w-full bg-white/20 rounded-full h-1">
                <div
                  className="bg-red-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
