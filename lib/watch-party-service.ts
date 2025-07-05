"use client"

import { youTubePlayerService, type YouTubePlayerEvent } from "./youtube-player-service"

export interface WatchParty {
  id: string
  name: string
  host: string
  streamUrl: string
  videoId?: string
  participants: WatchPartyUser[]
  maxParticipants: number
  isPrivate: boolean
  password?: string
  currentTime: number
  isPlaying: boolean
  createdAt: Date
  scheduledFor?: Date
  description: string
  tags: string[]
}

export interface WatchPartyUser {
  id: string
  name: string
  avatar?: string
  isHost: boolean
  joinedAt: Date
  reactions: string[]
}

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: Date
  type: "message" | "system" | "reaction"
  reactions?: string[]
}

export interface WatchPartyEvent {
  type: "user_joined" | "user_left" | "play" | "pause" | "seek" | "chat_message" | "reaction" | "video_sync"
  data: any
  timestamp: Date
}

class WatchPartyService {
  private currentParty: WatchParty | null = null
  private ws: WebSocket | null = null
  private listeners: Map<string, (data: any) => void> = new Map()
  private chatHistory: ChatMessage[] = []
  private isHost = false

  // Create a new watch party with Discord notification and YouTube integration
  async createWatchParty(config: {
    name: string
    streamUrl: string
    maxParticipants: number
    isPrivate: boolean
    password?: string
    description: string
    scheduledFor?: Date
    hostUsername?: string
    hostAvatar?: string
  }): Promise<WatchParty> {
    // Extract video ID if it's a YouTube URL
    const videoId = youTubePlayerService.constructor.extractVideoId(config.streamUrl)

    const party: WatchParty = {
      id: `party_${Date.now()}`,
      name: config.name,
      host: config.hostUsername || "current_user",
      streamUrl: config.streamUrl,
      videoId: videoId || undefined,
      participants: [
        {
          id: "current_user",
          name: config.hostUsername || "Host User",
          avatar: config.hostAvatar,
          isHost: true,
          joinedAt: new Date(),
          reactions: [],
        },
      ],
      maxParticipants: config.maxParticipants,
      isPrivate: config.isPrivate,
      password: config.password,
      currentTime: 0,
      isPlaying: false,
      createdAt: new Date(),
      scheduledFor: config.scheduledFor,
      description: config.description,
      tags: this.generateTags(config.streamUrl),
    }

    this.currentParty = party
    this.isHost = true
    this.connectToParty(party.id)

    // Set up YouTube player sync if it's a YouTube video
    if (videoId) {
      this.setupYouTubeSync()
    }

    // Send Discord notification
    await this.sendDiscordNotification(party, config.hostUsername, config.hostAvatar)

    return party
  }

  // Set up YouTube synchronization
  private setupYouTubeSync() {
    youTubePlayerService.subscribeSyncEvents((event: YouTubePlayerEvent) => {
      if (this.isHost) {
        // Broadcast sync event to all participants
        this.broadcastEvent({
          type: "video_sync",
          data: {
            syncType: event.type,
            ...event.data,
          },
          timestamp: new Date(),
        })
      }
    })
  }

  // Handle incoming sync events
  private async handleVideoSync(syncData: any) {
    if (this.isHost) return // Host doesn't need to sync

    const { syncType, currentTime, videoId } = syncData

    switch (syncType) {
      case "play":
        await youTubePlayerService.syncPlay(currentTime)
        if (this.currentParty) {
          this.currentParty.isPlaying = true
          this.currentParty.currentTime = currentTime
        }
        break
      case "pause":
        await youTubePlayerService.syncPause(currentTime)
        if (this.currentParty) {
          this.currentParty.isPlaying = false
          this.currentParty.currentTime = currentTime
        }
        break
      case "seek":
        await youTubePlayerService.syncSeek(currentTime)
        if (this.currentParty) {
          this.currentParty.currentTime = currentTime
        }
        break
    }

    this.notifyListeners("video_sync", syncData)
  }

  // Join an existing watch party
  async joinWatchParty(partyId: string, password?: string): Promise<WatchParty> {
    // Simulate API call
    const party = await this.getWatchPartyById(partyId)

    if (party.isPrivate && party.password !== password) {
      throw new Error("Invalid password")
    }

    if (party.participants.length >= party.maxParticipants) {
      throw new Error("Party is full")
    }

    // Add current user to participants
    const newUser: WatchPartyUser = {
      id: `user_${Date.now()}`,
      name: "New User",
      isHost: false,
      joinedAt: new Date(),
      reactions: [],
    }

    party.participants.push(newUser)
    this.currentParty = party
    this.isHost = false
    this.connectToParty(partyId)

    // Set up YouTube sync for participants
    if (party.videoId) {
      this.setupYouTubeSync()
    }

    // Notify other participants
    this.broadcastEvent({
      type: "user_joined",
      data: newUser,
      timestamp: new Date(),
    })

    // Send Discord update for milestone participants
    await this.sendDiscordParticipantUpdate(party, newUser.name)

    return party
  }

  // YouTube player controls (host only)
  async playVideo(): Promise<void> {
    if (!this.isHost || !this.currentParty?.videoId) return

    await youTubePlayerService.play()

    if (this.currentParty) {
      this.currentParty.isPlaying = true
      this.currentParty.currentTime = youTubePlayerService.getCurrentTime()
    }
  }

  async pauseVideo(): Promise<void> {
    if (!this.isHost || !this.currentParty?.videoId) return

    await youTubePlayerService.pause()

    if (this.currentParty) {
      this.currentParty.isPlaying = false
      this.currentParty.currentTime = youTubePlayerService.getCurrentTime()
    }
  }

  async seekVideo(time: number): Promise<void> {
    if (!this.isHost || !this.currentParty?.videoId) return

    await youTubePlayerService.seekTo(time)

    if (this.currentParty) {
      this.currentParty.currentTime = time
    }
  }

  // Get current video state
  getVideoState() {
    if (!this.currentParty?.videoId) return null
    return youTubePlayerService.getPlayerState()
  }

  // Generate tags based on URL
  private generateTags(streamUrl: string): string[] {
    const tags = ["watch-party"]

    if (streamUrl.includes("youtube.com") || streamUrl.includes("youtu.be")) {
      tags.push("youtube")
    } else if (streamUrl.includes("twitch.tv")) {
      tags.push("twitch")
    } else if (streamUrl.includes("kick.com")) {
      tags.push("kick")
    }

    tags.push("live", "synchronized")
    return tags
  }

  // Send Discord notification for new watch party
  private async sendDiscordNotification(party: WatchParty, hostUsername?: string, hostAvatar?: string): Promise<void> {
    try {
      const joinLink = `${window.location.origin}/watch-party/${party.id}`

      const watchPartyData = {
        partyId: party.id,
        title: party.name,
        hostUsername: hostUsername || party.host,
        hostAvatar: hostAvatar,
        description: party.description,
        streamUrl: party.streamUrl,
        maxParticipants: party.maxParticipants,
        isPrivate: party.isPrivate,
        scheduledFor: party.scheduledFor,
        tags: party.tags,
        joinLink: joinLink,
      }

      const response = await fetch("/api/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "watch_party_announcement",
          data: watchPartyData,
        }),
      })

      if (response.ok) {
        console.log("✅ Discord notification sent successfully for watch party:", party.name)
      } else {
        console.error("❌ Failed to send Discord notification:", await response.text())
      }
    } catch (error) {
      console.error("❌ Error sending Discord notification:", error)
    }
  }

  // Send Discord update when someone joins
  private async sendDiscordParticipantUpdate(party: WatchParty, participantName: string): Promise<void> {
    try {
      const joinLink = `${window.location.origin}/watch-party/${party.id}`

      const response = await fetch("/api/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "watch_party_update",
          data: {
            partyTitle: party.name,
            participantName: participantName,
            currentParticipants: party.participants.length,
            maxParticipants: party.maxParticipants,
            joinLink: joinLink,
          },
        }),
      })

      if (response.ok) {
        console.log("✅ Discord participant update sent for:", party.name)
      }
    } catch (error) {
      console.error("❌ Error sending Discord participant update:", error)
    }
  }

  // Get available watch parties
  async getAvailableWatchParties(): Promise<WatchParty[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "party_1",
            name: "VCT Champions Finals",
            host: "esports_fan",
            streamUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            videoId: "dQw4w9WgXcQ",
            participants: [
              { id: "1", name: "esports_fan", isHost: true, joinedAt: new Date(), reactions: [] },
              { id: "2", name: "gamer123", isHost: false, joinedAt: new Date(), reactions: [] },
              { id: "3", name: "pro_watcher", isHost: false, joinedAt: new Date(), reactions: [] },
            ],
            maxParticipants: 50,
            isPrivate: false,
            currentTime: 1250,
            isPlaying: true,
            createdAt: new Date(Date.now() - 30 * 60 * 1000),
            description: "Watching the epic VCT Champions finals! Join us for the hype!",
            tags: ["valorant", "vct", "finals", "esports", "youtube"],
          },
          {
            id: "party_2",
            name: "CS2 Major Highlights",
            host: "cs_legend",
            streamUrl: "https://www.youtube.com/watch?v=example123",
            videoId: "example123",
            participants: [
              { id: "4", name: "cs_legend", isHost: true, joinedAt: new Date(), reactions: [] },
              { id: "5", name: "awp_master", isHost: false, joinedAt: new Date(), reactions: [] },
            ],
            maxParticipants: 25,
            isPrivate: false,
            currentTime: 890,
            isPlaying: true,
            createdAt: new Date(Date.now() - 15 * 60 * 1000),
            description: "Best moments from the recent CS2 Major tournament",
            tags: ["cs2", "major", "highlights", "youtube"],
          },
        ])
      }, 500)
    })
  }

  // Send chat message
  sendChatMessage(message: string) {
    if (!this.currentParty) return

    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: "current_user",
      userName: "Current User",
      message,
      timestamp: new Date(),
      type: "message",
      reactions: [],
    }

    this.chatHistory.push(chatMessage)
    this.broadcastEvent({
      type: "chat_message",
      data: chatMessage,
      timestamp: new Date(),
    })

    this.notifyListeners("chat_message", chatMessage)
  }

  // Send reaction
  sendReaction(emoji: string) {
    if (!this.currentParty) return

    const reaction = {
      userId: "current_user",
      emoji,
      timestamp: new Date(),
    }

    this.broadcastEvent({
      type: "reaction",
      data: reaction,
      timestamp: new Date(),
    })

    this.notifyListeners("reaction", reaction)
  }

  // Subscribe to events
  subscribe(event: string, callback: (data: any) => void) {
    this.listeners.set(event, callback)
  }

  unsubscribe(event: string) {
    this.listeners.delete(event)
  }

  private notifyListeners(event: string, data: any) {
    const callback = this.listeners.get(event)
    if (callback) {
      callback(data)
    }
  }

  private connectToParty(partyId: string) {
    // Simulate WebSocket connection
    console.log(`🎬 Connecting to watch party: ${partyId}`)

    // Set up event handling for video sync
    this.subscribe("video_sync", this.handleVideoSync.bind(this))

    // Simulate receiving events
    setTimeout(() => {
      this.notifyListeners("connected", { partyId })
    }, 1000)
  }

  private broadcastEvent(event: WatchPartyEvent) {
    // In a real implementation, this would send to WebSocket server
    console.log("📡 Broadcasting event:", event)

    // Handle video sync events locally for demo
    if (event.type === "video_sync") {
      setTimeout(() => {
        this.handleVideoSync(event.data)
      }, 100)
    }
  }

  private async getWatchPartyById(id: string): Promise<WatchParty> {
    const parties = await this.getAvailableWatchParties()
    const party = parties.find((p) => p.id === id)
    if (!party) {
      throw new Error("Watch party not found")
    }
    return party
  }

  getCurrentParty(): WatchParty | null {
    return this.currentParty
  }

  getChatHistory(): ChatMessage[] {
    return this.chatHistory
  }

  isCurrentUserHost(): boolean {
    return this.isHost
  }

  leaveParty() {
    if (this.currentParty) {
      this.broadcastEvent({
        type: "user_left",
        data: { userId: "current_user" },
        timestamp: new Date(),
      })

      // Clean up YouTube player
      youTubePlayerService.destroy()
      youTubePlayerService.unsubscribeSyncEvents()

      this.currentParty = null
      this.chatHistory = []
      this.isHost = false

      if (this.ws) {
        this.ws.close()
        this.ws = null
      }
    }
  }
}

export const watchPartyService = new WatchPartyService()
