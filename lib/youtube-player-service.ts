"use client"

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export interface YouTubePlayerState {
  videoId: string
  currentTime: number
  isPlaying: boolean
  duration: number
  volume: number
  playbackRate: number
}

export interface YouTubePlayerEvent {
  type: "play" | "pause" | "seek" | "ready" | "ended" | "error"
  data: any
  timestamp: Date
}

class YouTubePlayerService {
  private player: any = null
  private isReady = false
  private listeners: Map<string, (data: any) => void> = new Map()
  private syncListeners: Map<string, (event: YouTubePlayerEvent) => void> = new Map()
  private isHost = false
  private isSyncing = false

  // Initialize YouTube API
  async initializeAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) {
        resolve()
        return
      }

      // Load YouTube API script
      const script = document.createElement("script")
      script.src = "https://www.youtube.com/iframe_api"
      script.async = true

      window.onYouTubeIframeAPIReady = () => {
        console.log("✅ YouTube API loaded successfully")
        resolve()
      }

      script.onerror = () => {
        console.error("❌ Failed to load YouTube API")
        reject(new Error("Failed to load YouTube API"))
      }

      document.head.appendChild(script)
    })
  }

  // Create YouTube player
  async createPlayer(containerId: string, videoId: string, isHost = false): Promise<void> {
    try {
      await this.initializeAPI()

      this.isHost = isHost

      this.player = new window.YT.Player(containerId, {
        height: "100%",
        width: "100%",
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: isHost ? 1 : 0, // Only host gets native controls
          disablekb: !isHost ? 1 : 0, // Disable keyboard for non-hosts
          fs: 1, // Allow fullscreen
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          origin: window.location.origin,
        },
        events: {
          onReady: this.onPlayerReady.bind(this),
          onStateChange: this.onPlayerStateChange.bind(this),
          onError: this.onPlayerError.bind(this),
        },
      })

      console.log(`🎬 YouTube player created for video: ${videoId}`)
    } catch (error) {
      console.error("❌ Failed to create YouTube player:", error)
      throw error
    }
  }

  // Player ready event
  private onPlayerReady(event: any) {
    this.isReady = true
    console.log("✅ YouTube player is ready")

    this.notifyListeners("ready", {
      duration: this.player.getDuration(),
      videoId: this.getVideoId(),
    })
  }

  // Player state change event
  private onPlayerStateChange(event: any) {
    if (this.isSyncing) return // Prevent sync loops

    const state = event.data
    const currentTime = this.player.getCurrentTime()

    let eventType = "unknown"

    switch (state) {
      case window.YT.PlayerState.PLAYING:
        eventType = "play"
        break
      case window.YT.PlayerState.PAUSED:
        eventType = "pause"
        break
      case window.YT.PlayerState.ENDED:
        eventType = "ended"
        break
      case window.YT.PlayerState.BUFFERING:
        eventType = "buffering"
        break
    }

    console.log(`🎬 Player state changed: ${eventType} at ${currentTime}s`)

    // Only host can trigger sync events
    if (this.isHost && (eventType === "play" || eventType === "pause")) {
      this.broadcastSyncEvent({
        type: eventType as any,
        data: {
          currentTime,
          videoId: this.getVideoId(),
          timestamp: Date.now(),
        },
        timestamp: new Date(),
      })
    }

    this.notifyListeners("stateChange", {
      state: eventType,
      currentTime,
      duration: this.player.getDuration(),
    })
  }

  // Player error event
  private onPlayerError(event: any) {
    console.error("❌ YouTube player error:", event.data)
    this.notifyListeners("error", { error: event.data })
  }

  // Sync controls for host
  async play(): Promise<void> {
    if (!this.isReady || !this.isHost) return

    try {
      this.player.playVideo()
      console.log("▶️ Host initiated play")
    } catch (error) {
      console.error("❌ Failed to play video:", error)
    }
  }

  async pause(): Promise<void> {
    if (!this.isReady || !this.isHost) return

    try {
      this.player.pauseVideo()
      console.log("⏸️ Host initiated pause")
    } catch (error) {
      console.error("❌ Failed to pause video:", error)
    }
  }

  async seekTo(seconds: number): Promise<void> {
    if (!this.isReady || !this.isHost) return

    try {
      this.player.seekTo(seconds, true)
      console.log(`⏭️ Host seeked to ${seconds}s`)

      // Broadcast seek event
      this.broadcastSyncEvent({
        type: "seek",
        data: {
          currentTime: seconds,
          videoId: this.getVideoId(),
          timestamp: Date.now(),
        },
        timestamp: new Date(),
      })
    } catch (error) {
      console.error("❌ Failed to seek video:", error)
    }
  }

  // Sync from remote events (for participants)
  async syncPlay(currentTime: number): Promise<void> {
    if (!this.isReady || this.isHost) return

    this.isSyncing = true
    try {
      const playerTime = this.player.getCurrentTime()
      const timeDiff = Math.abs(playerTime - currentTime)

      // Sync time if difference is significant
      if (timeDiff > 2) {
        this.player.seekTo(currentTime, true)
      }

      this.player.playVideo()
      console.log(`🔄 Synced play at ${currentTime}s`)
    } catch (error) {
      console.error("❌ Failed to sync play:", error)
    } finally {
      setTimeout(() => {
        this.isSyncing = false
      }, 1000)
    }
  }

  async syncPause(currentTime: number): Promise<void> {
    if (!this.isReady || this.isHost) return

    this.isSyncing = true
    try {
      const playerTime = this.player.getCurrentTime()
      const timeDiff = Math.abs(playerTime - currentTime)

      // Sync time if difference is significant
      if (timeDiff > 2) {
        this.player.seekTo(currentTime, true)
      }

      this.player.pauseVideo()
      console.log(`🔄 Synced pause at ${currentTime}s`)
    } catch (error) {
      console.error("❌ Failed to sync pause:", error)
    } finally {
      setTimeout(() => {
        this.isSyncing = false
      }, 1000)
    }
  }

  async syncSeek(currentTime: number): Promise<void> {
    if (!this.isReady || this.isHost) return

    this.isSyncing = true
    try {
      this.player.seekTo(currentTime, true)
      console.log(`🔄 Synced seek to ${currentTime}s`)
    } catch (error) {
      console.error("❌ Failed to sync seek:", error)
    } finally {
      setTimeout(() => {
        this.isSyncing = false
      }, 500)
    }
  }

  // Utility methods
  getCurrentTime(): number {
    if (!this.isReady) return 0
    return this.player.getCurrentTime()
  }

  getDuration(): number {
    if (!this.isReady) return 0
    return this.player.getDuration()
  }

  getVideoId(): string {
    if (!this.player) return ""
    return this.player.getVideoData()?.video_id || ""
  }

  isPlaying(): boolean {
    if (!this.isReady) return false
    return this.player.getPlayerState() === window.YT.PlayerState.PLAYING
  }

  getPlayerState(): YouTubePlayerState {
    return {
      videoId: this.getVideoId(),
      currentTime: this.getCurrentTime(),
      isPlaying: this.isPlaying(),
      duration: this.getDuration(),
      volume: this.player?.getVolume() || 100,
      playbackRate: this.player?.getPlaybackRate() || 1,
    }
  }

  // Event handling
  subscribe(event: string, callback: (data: any) => void) {
    this.listeners.set(event, callback)
  }

  unsubscribe(event: string) {
    this.listeners.delete(event)
  }

  subscribeSyncEvents(callback: (event: YouTubePlayerEvent) => void) {
    this.syncListeners.set("sync", callback)
  }

  unsubscribeSyncEvents() {
    this.syncListeners.delete("sync")
  }

  private notifyListeners(event: string, data: any) {
    const callback = this.listeners.get(event)
    if (callback) {
      callback(data)
    }
  }

  private broadcastSyncEvent(event: YouTubePlayerEvent) {
    this.syncListeners.forEach((callback) => callback(event))
  }

  // Cleanup
  destroy() {
    if (this.player) {
      this.player.destroy()
      this.player = null
    }
    this.isReady = false
    this.listeners.clear()
    this.syncListeners.clear()
  }

  // Extract video ID from YouTube URL
  static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }

    return null
  }

  // Validate YouTube URL
  static isValidYouTubeUrl(url: string): boolean {
    return this.extractVideoId(url) !== null
  }
}

export const youTubePlayerService = new YouTubePlayerService()
