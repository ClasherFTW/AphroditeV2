"use client"

export interface LiveMatch {
  id: string
  gameType: "valorant" | "cs2"
  players: LivePlayer[]
  teams: {
    team1: LiveTeam
    team2: LiveTeam
  }
  currentRound: number
  maxRounds: number
  gameState: "warmup" | "live" | "halftime" | "overtime" | "finished"
  map: string
  startTime: Date
  spectators: number
  streamUrl?: string
}

export interface LivePlayer {
  id: string
  name: string
  team: "team1" | "team2"
  kills: number
  deaths: number
  assists: number
  score: number
  alive: boolean
  health: number
  armor: number
  weapon: string
  money: number
  adr: number // Average Damage per Round
  kast: number // Kill, Assist, Survive, Trade percentage
  kost: number // Kill, Objective, Survive, Trade percentage
}

export interface LiveTeam {
  name: string
  score: number
  side: "ct" | "t" | "defense" | "attack"
  economy: number
  timeouts: number
}

export interface MatchEvent {
  id: string
  type: "kill" | "death" | "bomb_plant" | "bomb_defuse" | "round_end" | "round_start"
  timestamp: Date
  player?: string
  victim?: string
  weapon?: string
  headshot?: boolean
  round: number
  details: any
}

class LiveMatchService {
  private ws: WebSocket | null = null
  private listeners: Map<string, (data: any) => void> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  // Simulate live match data for demo
  private generateMockMatch(): LiveMatch {
    return {
      id: "match_" + Date.now(),
      gameType: "valorant",
      players: [
        {
          id: "p1",
          name: "ScreaM",
          team: "team1",
          kills: 18,
          deaths: 12,
          assists: 4,
          score: 4250,
          alive: true,
          health: 100,
          armor: 50,
          weapon: "Vandal",
          money: 3200,
          adr: 145.2,
          kast: 78.5,
          kost: 82.1,
        },
        {
          id: "p2",
          name: "TenZ",
          team: "team1",
          kills: 22,
          deaths: 10,
          assists: 6,
          score: 5100,
          alive: false,
          health: 0,
          armor: 0,
          weapon: "Phantom",
          money: 2800,
          adr: 162.8,
          kast: 85.2,
          kost: 88.9,
        },
        {
          id: "p3",
          name: "s1mple",
          team: "team2",
          kills: 20,
          deaths: 14,
          assists: 3,
          score: 4800,
          alive: true,
          health: 75,
          armor: 100,
          weapon: "Operator",
          money: 4100,
          adr: 158.4,
          kast: 81.3,
          kost: 85.7,
        },
        {
          id: "p4",
          name: "ZywOo",
          team: "team2",
          kills: 16,
          deaths: 16,
          assists: 8,
          score: 3900,
          alive: true,
          health: 100,
          armor: 25,
          weapon: "Vandal",
          money: 1900,
          adr: 138.9,
          kast: 75.0,
          kost: 79.2,
        },
      ],
      teams: {
        team1: {
          name: "Team Liquid",
          score: 12,
          side: "ct",
          economy: 18500,
          timeouts: 1,
        },
        team2: {
          name: "FaZe Clan",
          score: 10,
          side: "t",
          economy: 15200,
          timeouts: 2,
        },
      },
      currentRound: 23,
      maxRounds: 24,
      gameState: "live",
      map: "Ascent",
      startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      spectators: 15420,
      streamUrl: "https://twitch.tv/valorant",
    }
  }

  connect(matchId: string) {
    try {
      // In a real implementation, this would connect to a WebSocket server
      // For demo purposes, we'll simulate the connection
      console.log(`🔗 Connecting to live match: ${matchId}`)

      // Simulate connection success
      setTimeout(() => {
        this.notifyListeners("connected", { matchId })
        this.startMockDataStream()
      }, 1000)
    } catch (error) {
      console.error("❌ Failed to connect to live match:", error)
      this.handleReconnect()
    }
  }

  private startMockDataStream() {
    // Simulate real-time match updates
    const updateInterval = setInterval(() => {
      const mockMatch = this.generateMockMatch()

      // Simulate random updates
      if (Math.random() > 0.7) {
        // Random kill event
        const event: MatchEvent = {
          id: "event_" + Date.now(),
          type: "kill",
          timestamp: new Date(),
          player: mockMatch.players[Math.floor(Math.random() * mockMatch.players.length)].name,
          victim: mockMatch.players[Math.floor(Math.random() * mockMatch.players.length)].name,
          weapon: "Vandal",
          headshot: Math.random() > 0.6,
          round: mockMatch.currentRound,
          details: {},
        }
        this.notifyListeners("match_event", event)
      }

      // Update match state
      this.notifyListeners("match_update", mockMatch)

      // Stop after match ends
      if (mockMatch.gameState === "finished") {
        clearInterval(updateInterval)
      }
    }, 2000)
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}`)
        // Retry connection logic here
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

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

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.listeners.clear()
    console.log("🔌 Disconnected from live match")
  }

  // Get available live matches
  async getAvailableMatches(): Promise<LiveMatch[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          this.generateMockMatch(),
          {
            ...this.generateMockMatch(),
            id: "match_2",
            teams: {
              team1: { name: "Cloud9", score: 8, side: "t", economy: 12000, timeouts: 2 },
              team2: { name: "100 Thieves", score: 6, side: "ct", economy: 14500, timeouts: 1 },
            },
            map: "Haven",
            spectators: 8920,
          },
        ])
      }, 500)
    })
  }
}

export const liveMatchService = new LiveMatchService()
