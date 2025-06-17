"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
  SkipBackIcon,
  VolumeIcon,
  Volume2Icon,
  VolumeXIcon,
  ShuffleIcon,
  RepeatIcon,
  MusicIcon,
} from "lucide-react"

interface Track {
  id: number
  title: string
  artist: string
  duration: number
  url: string
  genre: string
}

export default function BackgroundMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState([70])
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isRepeating, setIsRepeating] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  const tracks: Track[] = [
    {
      id: 1,
      title: "Epic Gaming Anthem",
      artist: "Synthwave Studios",
      duration: 180,
      url: "/placeholder-audio.mp3",
      genre: "Electronic",
    },
    {
      id: 2,
      title: "Cyberpunk Vibes",
      artist: "Neon Dreams",
      duration: 210,
      url: "/placeholder-audio-2.mp3",
      genre: "Synthwave",
    },
    {
      id: 3,
      title: "Victory March",
      artist: "Game Composers",
      duration: 165,
      url: "/placeholder-audio-3.mp3",
      genre: "Orchestral",
    },
    {
      id: 4,
      title: "Digital Battlefield",
      artist: "Pixel Beats",
      duration: 195,
      url: "/placeholder-audio-4.mp3",
      genre: "Chiptune",
    },
    {
      id: 5,
      title: "Neon Nights",
      artist: "Retro Wave",
      duration: 220,
      url: "/placeholder-audio-5.mp3",
      genre: "Retrowave",
    },
    {
      id: 6,
      title: "Boss Battle Theme",
      artist: "Epic Sounds",
      duration: 240,
      url: "/placeholder-audio-6.mp3",
      genre: "Orchestral",
    },
  ]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0
        audio.play()
      } else {
        nextTrack()
      }
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [isRepeating])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    const nextIndex = isShuffled ? Math.floor(Math.random() * tracks.length) : (currentTrack + 1) % tracks.length
    setCurrentTrack(nextIndex)
    setCurrentTime(0)
  }

  const prevTrack = () => {
    const prevIndex = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1
    setCurrentTrack(prevIndex)
    setCurrentTime(0)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getVolumeIcon = () => {
    if (isMuted || volume[0] === 0) return VolumeXIcon
    if (volume[0] < 50) return VolumeIcon
    return Volume2Icon
  }

  const VolumeIconComponent = getVolumeIcon()

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-card/90 backdrop-blur-sm border-border animate-in slide-in-from-bottom-2">
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={togglePlay}
                className="h-8 w-8 p-0 hover:scale-110 transition-transform"
              >
                {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
              </Button>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{tracks[currentTrack].title}</div>
                <div className="text-xs text-muted-foreground truncate">{tracks[currentTrack].artist}</div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setIsMinimized(false)} className="h-8 w-8 p-0">
                <MusicIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <audio ref={audioRef} src={tracks[currentTrack].url} />
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-card/95 backdrop-blur-sm border-border w-80 animate-in slide-in-from-bottom-4">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MusicIcon className="h-5 w-5 text-primary" />
              <span className="font-medium">Now Playing</span>
            </div>
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className="text-xs">
                {tracks[currentTrack].genre}
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => setIsMinimized(true)} className="h-6 w-6 p-0">
                ×
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium truncate">{tracks[currentTrack].title}</div>
            <div className="text-xs text-muted-foreground truncate">{tracks[currentTrack].artist}</div>
          </div>

          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={tracks[currentTrack].duration}
              step={1}
              className="w-full"
              onValueChange={(value) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = value[0]
                  setCurrentTime(value[0])
                }
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(tracks[currentTrack].duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsShuffled(!isShuffled)}
              className={`h-8 w-8 p-0 ${isShuffled ? "text-primary" : ""}`}
            >
              <ShuffleIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={prevTrack} className="h-8 w-8 p-0">
              <SkipBackIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={togglePlay}
              className="h-10 w-10 rounded-full hover:scale-110 transition-transform"
            >
              {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
            </Button>
            <Button size="sm" variant="ghost" onClick={nextTrack} className="h-8 w-8 p-0">
              <SkipForwardIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsRepeating(!isRepeating)}
              className={`h-8 w-8 p-0 ${isRepeating ? "text-primary" : ""}`}
            >
              <RepeatIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" onClick={() => setIsMuted(!isMuted)} className="h-8 w-8 p-0">
              <VolumeIconComponent className="h-4 w-4" />
            </Button>
            <Slider value={volume} max={100} step={1} className="flex-1" onValueChange={setVolume} />
          </div>
        </CardContent>
        <audio ref={audioRef} src={tracks[currentTrack].url} />
      </Card>
    </div>
  )
}
