"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { watchPartyService, type WatchParty, type ChatMessage } from "@/lib/watch-party-service"
import { youTubePlayerService } from "@/lib/youtube-player-service"
import { useAuth } from "@/components/demo-auth-provider"
import YouTubePlayer from "./youtube-player"
import {
  UsersIcon,
  MessageCircleIcon,
  PlusIcon,
  EyeIcon,
  LockIcon,
  UnlockIcon,
  SendIcon,
  BellIcon,
  YoutubeIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "lucide-react"

export default function WatchPartyHub() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [availableParties, setAvailableParties] = useState<WatchParty[]>([])
  const [currentParty, setCurrentParty] = useState<WatchParty | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isCreatingParty, setIsCreatingParty] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: "",
    streamUrl: "",
    maxParticipants: 50,
    isPrivate: false,
    password: "",
    description: "",
    scheduledFor: "",
  })

  useEffect(() => {
    loadAvailableParties()

    // Set up watch party service listeners
    watchPartyService.subscribe("connected", handleConnection)
    watchPartyService.subscribe("chat_message", handleChatMessage)
    watchPartyService.subscribe("reaction", handleReaction)
    watchPartyService.subscribe("video_sync", handleVideoSync)

    return () => {
      watchPartyService.unsubscribe("connected")
      watchPartyService.unsubscribe("chat_message")
      watchPartyService.unsubscribe("reaction")
      watchPartyService.unsubscribe("video_sync")
      watchPartyService.leaveParty()
    }
  }, [])

  const loadAvailableParties = async () => {
    try {
      const parties = await watchPartyService.getAvailableWatchParties()
      setAvailableParties(parties)
    } catch (error) {
      console.error("Failed to load watch parties:", error)
    }
  }

  const handleConnection = (data: any) => {
    console.log("✅ Connected to watch party:", data.partyId)
    toast({
      title: "Connected",
      description: "Successfully joined the watch party!",
    })
  }

  const handleChatMessage = (message: ChatMessage) => {
    setChatMessages((prev) => [...prev, message])
  }

  const handleReaction = (reaction: any) => {
    console.log("👍 Reaction received:", reaction)
  }

  const handleVideoSync = (syncData: any) => {
    console.log("🔄 Video sync event:", syncData)
    toast({
      title: "Video Synchronized",
      description: `Video ${syncData.syncType} synchronized across all participants`,
    })
  }

  const validateYouTubeUrl = (url: string): boolean => {
    return youTubePlayerService.constructor.isValidYouTubeUrl(url)
  }

  const createWatchParty = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a watch party.",
        variant: "destructive",
      })
      return
    }

    if (!validateYouTubeUrl(createForm.streamUrl)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL.",
        variant: "destructive",
      })
      return
    }

    setIsCreatingParty(true)
    try {
      const party = await watchPartyService.createWatchParty({
        ...createForm,
        hostUsername: user.displayName || user.email || "Anonymous User",
        hostAvatar: user.photoURL || undefined,
      })

      setCurrentParty(party)
      setIsCreating(false)

      toast({
        title: "🎬 Watch Party Created!",
        description: (
          <div className="space-y-2">
            <p>"{party.name}" is now live with YouTube synchronization!</p>
            <div className="flex items-center space-x-2 text-sm">
              <BellIcon className="h-4 w-4" />
              <span>Discord notification sent to announce your party!</span>
            </div>
          </div>
        ),
      })
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create watch party. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingParty(false)
    }
  }

  const joinWatchParty = async (party: WatchParty, password?: string) => {
    try {
      const joinedParty = await watchPartyService.joinWatchParty(party.id, password)
      setCurrentParty(joinedParty)
      setChatMessages(watchPartyService.getChatHistory())

      toast({
        title: "Joined Watch Party",
        description: `Welcome to "${joinedParty.name}"! Video will be synchronized automatically.`,
      })
    } catch (error) {
      toast({
        title: "Join Failed",
        description: error instanceof Error ? error.message : "Failed to join watch party",
        variant: "destructive",
      })
    }
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      watchPartyService.sendChatMessage(newMessage)
      setNewMessage("")
    }
  }

  const sendReaction = (emoji: string) => {
    watchPartyService.sendReaction(emoji)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getParticipantCount = (party: WatchParty) => {
    return `${party.participants.length}/${party.maxParticipants}`
  }

  const isYouTubeUrl = (url: string) => {
    return validateYouTubeUrl(url)
  }

  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <YoutubeIcon className="h-8 w-8 text-red-500" />
            <div>
              <h2 className="text-3xl font-bold text-white">Create YouTube Watch Party</h2>
              <p className="text-white/60">Set up synchronized YouTube viewing with Discord notifications</p>
            </div>
          </div>
          <Button onClick={() => setIsCreating(false)} variant="outline">
            Cancel
          </Button>
        </div>

        <Card className="bg-black/20 border-white/10 backdrop-blur-sm max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <YoutubeIcon className="h-5 w-5 mr-2 text-red-500" />
              YouTube Watch Party Setup
            </CardTitle>
            <CardDescription className="text-white/60">
              Create a synchronized YouTube viewing experience with real-time chat and Discord integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Party Name</Label>
                <Input
                  value={createForm.name}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-black/20 border-white/20 text-white"
                  placeholder="Epic Gaming Video Watch Party"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Max Participants</Label>
                <Select
                  value={createForm.maxParticipants.toString()}
                  onValueChange={(value) =>
                    setCreateForm((prev) => ({ ...prev, maxParticipants: Number.parseInt(value) }))
                  }
                >
                  <SelectTrigger className="bg-black/20 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 people</SelectItem>
                    <SelectItem value="25">25 people</SelectItem>
                    <SelectItem value="50">50 people</SelectItem>
                    <SelectItem value="100">100 people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center">
                <YoutubeIcon className="h-4 w-4 mr-2 text-red-500" />
                YouTube Video URL
              </Label>
              <Input
                value={createForm.streamUrl}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, streamUrl: e.target.value }))}
                className="bg-black/20 border-white/20 text-white"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {createForm.streamUrl && (
                <div className="flex items-center space-x-2 text-sm">
                  {isYouTubeUrl(createForm.streamUrl) ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      <span className="text-green-400">Valid YouTube URL detected</span>
                    </>
                  ) : (
                    <>
                      <AlertCircleIcon className="h-4 w-4 text-red-400" />
                      <span className="text-red-400">Please enter a valid YouTube URL</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white">Description</Label>
              <Textarea
                value={createForm.description}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                className="bg-black/20 border-white/20 text-white"
                placeholder="Join us for synchronized YouTube viewing! Perfect for gaming videos, tutorials, or entertainment content 🎬"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Private Party</Label>
                <p className="text-xs text-white/60">Require password to join</p>
              </div>
              <Switch
                checked={createForm.isPrivate}
                onCheckedChange={(checked) => setCreateForm((prev) => ({ ...prev, isPrivate: checked }))}
              />
            </div>

            {createForm.isPrivate && (
              <div className="space-y-2">
                <Label className="text-white">Password</Label>
                <Input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="bg-black/20 border-white/20 text-white"
                  placeholder="Enter party password"
                />
              </div>
            )}

            {/* YouTube Features Info */}
            <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <YoutubeIcon className="h-5 w-5 text-red-400" />
                <h4 className="text-white font-medium">YouTube Synchronization Features</h4>
              </div>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• 🎬 Synchronized video playback across all participants</li>
                <li>• ⏯️ Host controls for play, pause, and seeking</li>
                <li>• 🔄 Real-time synchronization when participants join</li>
                <li>• 📱 Responsive player that adapts to all screen sizes</li>
                <li>• 💬 Live chat during video playback</li>
                <li>• 🔔 Discord notifications with direct join links</li>
              </ul>
            </div>

            <Button
              onClick={createWatchParty}
              disabled={
                isCreatingParty || !createForm.name || !createForm.streamUrl || !isYouTubeUrl(createForm.streamUrl)
              }
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
            >
              {isCreatingParty ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating YouTube Watch Party...
                </>
              ) : (
                <>
                  <YoutubeIcon className="h-4 w-4 mr-2" />
                  Create YouTube Watch Party
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentParty) {
    return (
      <div className="space-y-6">
        {/* Party Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <YoutubeIcon className="h-8 w-8 text-red-500" />
            <div>
              <h2 className="text-3xl font-bold text-white">{currentParty.name}</h2>
              <p className="text-white/60">{currentParty.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              <UsersIcon className="h-3 w-3 mr-1" />
              {getParticipantCount(currentParty)}
            </Badge>
            {watchPartyService.isCurrentUserHost() && <Badge className="bg-red-500/20 text-red-300">🎬 Host</Badge>}
            <Button
              onClick={() => {
                watchPartyService.leaveParty()
                setCurrentParty(null)
              }}
              variant="outline"
              size="sm"
            >
              Leave Party
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* YouTube Player Area */}
          <div className="lg:col-span-2 space-y-4">
            {currentParty.videoId ? (
              <YouTubePlayer
                videoId={currentParty.videoId}
                isHost={watchPartyService.isCurrentUserHost()}
                onPlay={() => watchPartyService.playVideo()}
                onPause={() => watchPartyService.pauseVideo()}
                onSeek={(time) => watchPartyService.seekVideo(time)}
              />
            ) : (
              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <AlertCircleIcon className="h-16 w-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl text-white mb-2">No Video Available</h3>
                  <p className="text-white/60">This watch party doesn't have a valid YouTube video.</p>
                </CardContent>
              </Card>
            )}

            {/* Reactions */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Reactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 flex-wrap">
                  {["🔥", "😂", "😱", "👏", "❤️", "💯", "🎉", "😍", "🤯", "👀"].map((emoji) => (
                    <Button
                      key={emoji}
                      size="sm"
                      variant="outline"
                      onClick={() => sendReaction(emoji)}
                      className="text-lg hover:scale-110 transition-transform mb-2"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/20">
                <TabsTrigger value="chat" className="text-white">
                  <MessageCircleIcon className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="participants" className="text-white">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  People
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="space-y-4">
                <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Live Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ScrollArea className="h-64 w-full">
                      <div className="space-y-2">
                        {chatMessages.length === 0 ? (
                          <div className="text-center text-white/60 py-8">
                            <MessageCircleIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No messages yet. Start the conversation!</p>
                          </div>
                        ) : (
                          chatMessages.map((message) => (
                            <div key={message.id} className="flex space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">{message.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-white/80 text-sm font-medium">{message.userName}</span>
                                  <span className="text-white/40 text-xs">
                                    {message.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-white/70 text-sm">{message.message}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>

                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                        className="bg-black/20 border-white/20 text-white"
                      />
                      <Button onClick={sendMessage} size="sm">
                        <SendIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="participants" className="space-y-4">
                <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">
                      Participants ({currentParty.participants.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64 w-full">
                      <div className="space-y-2">
                        {currentParty.participants.map((participant) => (
                          <div key={participant.id} className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-white/80 text-sm">{participant.name}</span>
                                {participant.isHost && (
                                  <Badge variant="secondary" className="text-xs bg-red-500/20 text-red-300">
                                    Host
                                  </Badge>
                                )}
                              </div>
                              <p className="text-white/40 text-xs">
                                Joined {participant.joinedAt.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <YoutubeIcon className="h-8 w-8 text-red-500" />
          <div>
            <h2 className="text-3xl font-bold text-white">YouTube Watch Parties</h2>
            <p className="text-white/60">Join or create synchronized YouTube viewing experiences</p>
          </div>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-gradient-to-r from-red-500 to-pink-600">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create YouTube Party
        </Button>
      </div>

      {/* Available Parties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableParties.map((party) => (
          <Card
            key={party.id}
            className="bg-black/20 border-white/10 backdrop-blur-sm hover:bg-black/30 transition-colors"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{party.name}</CardTitle>
                <div className="flex items-center space-x-1">
                  {party.videoId && <YoutubeIcon className="h-4 w-4 text-red-400" />}
                  {party.isPrivate ? (
                    <LockIcon className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <UnlockIcon className="h-4 w-4 text-green-400" />
                  )}
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                    <UsersIcon className="h-3 w-3 mr-1" />
                    {getParticipantCount(party)}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-white/60">{party.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Host:</span>
                <span className="text-white">{party.host}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Status:</span>
                <Badge variant={party.isPlaying ? "default" : "secondary"}>
                  {party.isPlaying ? "🔴 Playing" : "⏸️ Paused"}
                </Badge>
              </div>

              {party.videoId && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Platform:</span>
                  <Badge className="bg-red-500/20 text-red-300">
                    <YoutubeIcon className="h-3 w-3 mr-1" />
                    YouTube
                  </Badge>
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                {party.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button
                onClick={() => joinWatchParty(party)}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                Join YouTube Party
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {availableParties.length === 0 && (
        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <YoutubeIcon className="h-16 w-16 text-red-400/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active YouTube Watch Parties</h3>
            <p className="text-white/60 mb-6">Be the first to create a synchronized YouTube viewing experience!</p>
            <Button onClick={() => setIsCreating(true)} className="bg-gradient-to-r from-red-500 to-pink-600">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create First YouTube Party
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
