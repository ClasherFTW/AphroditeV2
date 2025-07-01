"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import {
  MicIcon,
  MicOffIcon,
  VolumeIcon,
  VolumeXIcon,
  PhoneIcon,
  PhoneOffIcon,
  SettingsIcon,
  UsersIcon,
  WifiIcon,
  WifiOffIcon,
  HeadphonesIcon,
  HeadphonesIcon as HeadphonesOffIcon,
  SignalIcon,
  VideoIcon,
  PlusIcon,
} from "lucide-react"

interface VoiceUser {
  id: number
  name: string
  avatar: string
  isMuted: boolean
  isDeafened: boolean
  isSpeaking: boolean
  volume: number
  ping: number
  pan: number // Spatial audio pan
}

interface VoiceChannel {
  id: number
  name: string
  users: number[] // User IDs in the channel
}

export default function VoiceChat() {
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)
  const [isHeadphones, setIsHeadphones] = useState(true) // Simulate headphones status
  const [masterVolume, setMasterVolume] = useState([80])
  const [micVolume, setMicVolume] = useState([75])
  const [connectionQuality, setConnectionQuality] = useState<"excellent" | "good" | "poor">("good")
  const [noiseSuppression, setNoiseSuppression] = useState(true)
  const [echoCancellation, setEchoCancellation] = useState(true)
  const [voiceActivityDetection, setVoiceActivityDetection] = useState(true)
  const [pushToTalk, setPushToTalk] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [voiceEffect, setVoiceEffect] = useState<"none" | "chipmunk" | "robot">("none")
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  const [voiceUsers, setVoiceUsers] = useState<VoiceUser[]>([
    {
      id: 1,
      name: "ProGamer2024",
      avatar: "/placeholder.svg?height=32&width=32",
      isMuted: false,
      isDeafened: false,
      isSpeaking: false,
      volume: 80,
      ping: 23,
      pan: 0,
    },
    {
      id: 2,
      name: "ShadowStrike",
      avatar: "/placeholder.svg?height=32&width=32",
      isMuted: false,
      isDeafened: false,
      isSpeaking: true,
      volume: 85,
      ping: 45,
      pan: -0.5,
    },
    {
      id: 3,
      name: "MysticHealer",
      avatar: "/placeholder.svg?height=32&width=32",
      isMuted: true,
      isDeafened: false,
      isSpeaking: false,
      volume: 70,
      ping: 67,
      pan: 0.5,
    },
  ])

  const [voiceChannels, setVoiceChannels] = useState<VoiceChannel[]>([
    { id: 1, name: "General", users: [1, 2, 3] },
    { id: 2, name: "Gaming", users: [] },
  ])
  const [currentChannelId, setCurrentChannelId] = useState<number | null>(1)

  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null) // For voice activity detection
  const mediaRecorderRef = useRef<MediaRecorder | null>(null) // For voice recording
  const recordedChunksRef = useRef<BlobPart[]>([])

  useEffect(() => {
    // Simulate speaking animation
    const interval = setInterval(() => {
      setVoiceUsers((prev) =>
        prev.map((user) => ({
          ...user,
          isSpeaking: Math.random() > 0.8 && !user.isMuted,
        })),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Simulate connection diagnostics
    const connectionInterval = setInterval(() => {
      const randomQuality = Math.random()
      if (randomQuality < 0.2) {
        setConnectionQuality("poor")
      } else if (randomQuality < 0.6) {
        setConnectionQuality("good")
      } else {
        setConnectionQuality("excellent")
      }
    }, 5000)

    return () => clearInterval(connectionInterval)
  }, [])

  const connectToVoice = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: noiseSuppression,
          echoCancellation: echoCancellation,
        },
      })
      streamRef.current = stream

      // Create audio context for processing
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      // Create analyser node for voice activity detection
      const analyser = audioContext.createAnalyser()
      analyserRef.current = analyser
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      analyser.fftSize = 2048
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      // Voice activity detection logic
      const vadInterval = setInterval(() => {
        if (!voiceActivityDetection || isMuted || pushToTalk) return // Skip if disabled, muted, or using push-to-talk
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength
        setVoiceUsers((prev) =>
          prev.map(
            (user) => (user.id === 1 ? { ...user, isSpeaking: average > 30 } : user), // Adjust threshold as needed
          ),
        )
      }, 100)

      // Initialize media recorder for voice recording
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.ondataavailable = (event) => {
        recordedChunksRef.current.push(event.data)
      }
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "voice_recording.webm"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        recordedChunksRef.current = []
      }

      setIsConnected(true)
    } catch (error) {
      console.error("Failed to access microphone:", error)
    }
  }

  const disconnectFromVoice = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    if (analyserRef.current) {
      analyserRef.current = null
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
    mediaRecorderRef.current = null

    setIsConnected(false)
    setIsMuted(false)
    setIsDeafened(false)
    setIsRecording(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted
      })
    }
  }

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened)
    if (isDeafened) {
      setIsMuted(false)
    } else {
      setIsMuted(true)
    }
  }

  const toggleHeadphones = () => {
    setIsHeadphones(!isHeadphones)
  }

  const toggleNoiseSuppression = () => {
    setNoiseSuppression(!noiseSuppression)
    // Reconnect with new settings (simplified)
    if (isConnected) {
      disconnectFromVoice()
      connectToVoice()
    }
  }

  const toggleEchoCancellation = () => {
    setEchoCancellation(!echoCancellation)
    // Reconnect with new settings (simplified)
    if (isConnected) {
      disconnectFromVoice()
      connectToVoice()
    }
  }

  const toggleVoiceActivityDetection = () => {
    setVoiceActivityDetection(!voiceActivityDetection)
  }

  const handlePushToTalk = (event: React.KeyboardEvent) => {
    if (event.key === "Control") {
      if (!pushToTalk) {
        setIsMuted(false) // Unmute when control is pressed
      } else {
        setIsMuted(true) // Mute when control is released
      }
      setPushToTalk(!pushToTalk)
    }
  }

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "recording") {
      recordedChunksRef.current = []
      mediaRecorderRef.current.start()
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const changeVoiceEffect = (effect: "none" | "chipmunk" | "robot") => {
    setVoiceEffect(effect)
    // Implement actual audio processing logic here (using Web Audio API)
    console.log(`Voice effect set to: ${effect}`)
  }

  const toggleScreenSharing = () => {
    setIsScreenSharing(!isScreenSharing)
    // Implement screen sharing logic here (using MediaDevices.getDisplayMedia)
    console.log(`Screen sharing toggled: ${isScreenSharing}`)
  }

  const createVoiceChannel = () => {
    const newChannelId = voiceChannels.length + 1
    const newChannelName = prompt("Enter channel name:") || `Channel ${newChannelId}`
    setVoiceChannels([...voiceChannels, { id: newChannelId, name: newChannelName, users: [] }])
  }

  const joinVoiceChannel = (channelId: number) => {
    setCurrentChannelId(channelId)
    // Implement actual channel joining logic here
    console.log(`Joined channel: ${channelId}`)
  }

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case "excellent":
        return <WifiIcon className="h-4 w-4 text-green-500" />
      case "good":
        return <WifiIcon className="h-4 w-4 text-yellow-500" />
      case "poor":
        return <WifiOffIcon className="h-4 w-4 text-red-500" />
    }
  }

  const getPingColor = (ping: number) => {
    if (ping < 50) return "text-green-500"
    if (ping < 100) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <UsersIcon className="h-5 w-5 mr-2 text-primary" />
              Voice Chat
            </CardTitle>
            <CardDescription>
              {isConnected ? "Connected to voice channel" : "Connect to start voice chat"}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {getConnectionIcon()}
            <Badge variant={isConnected ? "default" : "outline"}>{isConnected ? "Connected" : "Disconnected"}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Controls */}
        <div className="grid grid-cols-2 gap-2">
          {!isConnected ? (
            <Button onClick={connectToVoice} className="col-span-2">
              <PhoneIcon className="h-4 w-4 mr-2" />
              Connect to Voice
            </Button>
          ) : (
            <>
              <Button variant={isMuted ? "destructive" : "outline"} onClick={toggleMute}>
                {isMuted ? <MicOffIcon className="h-4 w-4 mr-2" /> : <MicIcon className="h-4 w-4 mr-2" />}
                {isMuted ? "Unmute" : "Mute"}
              </Button>
              <Button variant={isDeafened ? "destructive" : "outline"} onClick={toggleDeafen}>
                {isDeafened ? <VolumeXIcon className="h-4 w-4 mr-2" /> : <VolumeIcon className="h-4 w-4 mr-2" />}
                {isDeafened ? "Undeafen" : "Deafen"}
              </Button>
              <Button variant={isHeadphones ? "outline" : "default"} onClick={toggleHeadphones}>
                {isHeadphones ? (
                  <HeadphonesIcon className="h-4 w-4 mr-2" />
                ) : (
                  <HeadphonesOffIcon className="h-4 w-4 mr-2" />
                )}
                {isHeadphones ? "Headphones" : "Speaker"}
              </Button>
              <Button variant="destructive" onClick={disconnectFromVoice}>
                <PhoneOffIcon className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
              <Button
                variant={isRecording ? "destructive" : "outline"}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? "Stop Recording" : "Record Voice"}
              </Button>
              <Button
                variant={pushToTalk ? "default" : "outline"}
                onKeyDown={handlePushToTalk}
                onKeyUp={handlePushToTalk}
              >
                Push to Talk (Ctrl)
              </Button>
              <Button variant={isScreenSharing ? "default" : "outline"} onClick={toggleScreenSharing}>
                <VideoIcon className="h-4 w-4 mr-2" />
                {isScreenSharing ? "Stop Sharing" : "Share Screen"}
              </Button>
            </>
          )}
        </div>

        {/* Voice Channels */}
        {isConnected && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Voice Channels</h4>
              <Button variant="ghost" size="sm" onClick={createVoiceChannel}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Channel
              </Button>
            </div>
            <ul className="space-y-1">
              {voiceChannels.map((channel) => (
                <li
                  key={channel.id}
                  className={`p-2 rounded-md cursor-pointer hover:bg-secondary ${
                    currentChannelId === channel.id ? "bg-secondary/50" : ""
                  }`}
                  onClick={() => joinVoiceChannel(channel.id)}
                >
                  <div className="flex items-center justify-between">
                    <span>{channel.name}</span>
                    <span className="text-xs text-muted-foreground">{channel.users.length} users</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Voice Users */}
        {isConnected && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Voice Channel ({voiceUsers.length})</h4>
            {voiceUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center space-x-3 p-2 rounded-lg border transition-all duration-200 ${
                  user.isSpeaking ? "border-green-500 bg-green-500/10 animate-pulse" : "border-border bg-card"
                }`}
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  {user.isSpeaking && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium truncate">{user.name}</span>
                    <span className={`text-xs ${getPingColor(user.ping)}`}>{user.ping}ms</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {user.isMuted && <MicOffIcon className="h-3 w-3 text-red-500" />}
                    {user.isDeafened && <VolumeXIcon className="h-3 w-3 text-red-500" />}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <VolumeIcon className="h-3 w-3 text-muted-foreground" />
                  <div className="w-12 text-xs text-muted-foreground">{user.volume}%</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Audio Settings */}
        {isConnected && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Audio Settings</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Master Volume</span>
                  <span className="text-muted-foreground">{masterVolume[0]}%</span>
                </div>
                <Slider value={masterVolume} onValueChange={setMasterVolume} max={100} step={1} className="w-full" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Microphone Volume</span>
                  <span className="text-muted-foreground">{micVolume[0]}%</span>
                </div>
                <Slider value={micVolume} onValueChange={setMicVolume} max={100} step={1} className="w-full" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Noise Suppression</span>
                  <Button variant={noiseSuppression ? "default" : "outline"} size="sm" onClick={toggleNoiseSuppression}>
                    {noiseSuppression ? "On" : "Off"}
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Echo Cancellation</span>
                  <Button variant={echoCancellation ? "default" : "outline"} size="sm" onClick={toggleEchoCancellation}>
                    {echoCancellation ? "On" : "Off"}
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Voice Activity Detection</span>
                  <Button
                    variant={voiceActivityDetection ? "default" : "outline"}
                    size="sm"
                    onClick={toggleVoiceActivityDetection}
                  >
                    {voiceActivityDetection ? "On" : "Off"}
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Voice Effect</span>
                  <select
                    className="bg-background border border-input rounded-md px-2 py-1 text-sm"
                    value={voiceEffect}
                    onChange={(e) => changeVoiceEffect(e.target.value as "none" | "chipmunk" | "robot")}
                  >
                    <option value="none">None</option>
                    <option value="chipmunk">Chipmunk</option>
                    <option value="robot">Robot</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connection Quality */}
        {isConnected && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center space-x-2">
              <span>Connection Quality: {connectionQuality}</span>
              <SignalIcon className="h-4 w-4" />
            </div>
            <span>Bitrate: 64kbps</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
