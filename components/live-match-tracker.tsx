"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { liveMatchService, type LiveMatch, type MatchEvent } from "@/lib/live-match-service"
import {
  PlayIcon,
  ZapIcon,
  HeartIcon,
  ShieldIcon,
  DollarSignIcon,
  MapIcon,
  EyeIcon,
  RefreshCwIcon,
  TargetIcon,
  ActivityIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "lucide-react"

export default function LiveMatchTracker() {
  const [availableMatches, setAvailableMatches] = useState<LiveMatch[]>([])
  const [currentMatch, setCurrentMatch] = useState<LiveMatch | null>(null)
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAvailableMatches()

    // Set up live match service listeners
    liveMatchService.subscribe("connected", handleConnection)
    liveMatchService.subscribe("match_update", handleMatchUpdate)
    liveMatchService.subscribe("match_event", handleMatchEvent)

    return () => {
      liveMatchService.unsubscribe("connected")
      liveMatchService.unsubscribe("match_update")
      liveMatchService.unsubscribe("match_event")
      liveMatchService.disconnect()
    }
  }, [])

  const loadAvailableMatches = async () => {
    try {
      setLoading(true)
      const matches = await liveMatchService.getAvailableMatches()
      setAvailableMatches(matches)
    } catch (error) {
      console.error("Failed to load matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnection = (data: any) => {
    setIsConnected(true)
    console.log("✅ Connected to live match:", data.matchId)
  }

  const handleMatchUpdate = (match: LiveMatch) => {
    setCurrentMatch(match)
  }

  const handleMatchEvent = (event: MatchEvent) => {
    setMatchEvents((prev) => [event, ...prev.slice(0, 49)]) // Keep last 50 events
  }

  const connectToMatch = (match: LiveMatch) => {
    setCurrentMatch(match)
    setMatchEvents([])
    liveMatchService.connect(match.id)
  }

  const getPlayerKDA = (player: any) => {
    return `${player.kills}/${player.deaths}/${player.assists}`
  }

  const getPlayerColor = (team: string) => {
    return team === "team1" ? "text-blue-400" : "text-red-400"
  }

  const getGameStateColor = (state: string) => {
    switch (state) {
      case "live":
        return "text-green-400"
      case "warmup":
        return "text-yellow-400"
      case "halftime":
        return "text-orange-400"
      case "finished":
        return "text-gray-400"
      default:
        return "text-blue-400"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCwIcon className="h-8 w-8 animate-spin text-blue-400" />
        <span className="ml-2 text-white">Loading live matches...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ActivityIcon className="h-8 w-8 text-green-400" />
          <div>
            <h2 className="text-3xl font-bold text-white">Live Match Tracker</h2>
            <p className="text-white/60">Follow matches in real-time with advanced statistics</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge
            variant="outline"
            className={isConnected ? "border-green-400 text-green-300" : "border-red-400 text-red-300"}
          >
            {isConnected ? <CheckCircleIcon className="h-3 w-3 mr-1" /> : <AlertCircleIcon className="h-3 w-3 mr-1" />}
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <Button onClick={loadAvailableMatches} variant="outline">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="matches" className="space-y-6">
        <TabsList className="bg-black/20 backdrop-blur-sm">
          <TabsTrigger value="matches">
            <EyeIcon className="h-4 w-4 mr-2" />
            Available Matches
          </TabsTrigger>
          <TabsTrigger value="live" disabled={!currentMatch}>
            <PlayIcon className="h-4 w-4 mr-2" />
            Live Match
          </TabsTrigger>
          <TabsTrigger value="events" disabled={!currentMatch}>
            <ZapIcon className="h-4 w-4 mr-2" />
            Live Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableMatches.map((match) => (
              <Card
                key={match.id}
                className="bg-black/20 border-white/10 backdrop-blur-sm hover:bg-black/30 transition-all"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <MapIcon className="h-5 w-5 mr-2 text-blue-400" />
                      {match.map}
                    </CardTitle>
                    <Badge variant="outline" className={`${getGameStateColor(match.gameState)} border-current`}>
                      {match.gameState.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription className="text-white/60">
                    {match.teams.team1.name} vs {match.teams.team2.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Score Display */}
                  <div className="flex items-center justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{match.teams.team1.score}</div>
                      <div className="text-sm text-white/60">{match.teams.team1.name}</div>
                    </div>
                    <div className="text-white/40">VS</div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{match.teams.team2.score}</div>
                      <div className="text-sm text-white/60">{match.teams.team2.name}</div>
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-white/60">Round</div>
                      <div className="text-white font-semibold">
                        {match.currentRound}/{match.maxRounds}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white/60">Spectators</div>
                      <div className="text-white font-semibold">{match.spectators.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white/60">Duration</div>
                      <div className="text-white font-semibold">{formatTime(match.startTime)}</div>
                    </div>
                  </div>

                  {/* Top Players Preview */}
                  <div className="space-y-2">
                    <div className="text-sm text-white/60">Top Performers</div>
                    <div className="grid grid-cols-2 gap-2">
                      {match.players.slice(0, 2).map((player) => (
                        <div key={player.id} className="flex items-center space-x-2 bg-white/5 rounded p-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{player.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium ${getPlayerColor(player.team)} truncate`}>
                              {player.name}
                            </div>
                            <div className="text-xs text-white/60">{getPlayerKDA(player)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => connectToMatch(match)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Watch Live
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          {currentMatch && (
            <>
              {/* Match Header */}
              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="border-green-400 text-green-300 animate-pulse">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                        LIVE
                      </Badge>
                      <div>
                        <CardTitle className="text-white">
                          {currentMatch.teams.team1.name} vs {currentMatch.teams.team2.name}
                        </CardTitle>
                        <CardDescription className="text-white/60">
                          {currentMatch.map} • Round {currentMatch.currentRound}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{currentMatch.teams.team1.score}</div>
                        <div className="text-xs text-white/60">{currentMatch.teams.team1.side.toUpperCase()}</div>
                      </div>
                      <div className="text-white/40">-</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{currentMatch.teams.team2.score}</div>
                        <div className="text-xs text-white/60">{currentMatch.teams.team2.side.toUpperCase()}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Player Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team 1 */}
                <Card className="bg-black/20 border-blue-400/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center">
                      <ShieldIcon className="h-5 w-5 mr-2" />
                      {currentMatch.teams.team1.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentMatch.players
                        .filter((p) => p.team === "team1")
                        .map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-500/20 text-blue-300">
                                  {player.name.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-white font-medium">{player.name}</div>
                                <div className="text-xs text-white/60">{player.weapon}</div>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="text-sm text-white">{getPlayerKDA(player)}</div>
                              <div className="flex items-center space-x-2 text-xs">
                                <span className="text-green-400">ADR: {player.adr.toFixed(0)}</span>
                                <span className="text-blue-400">KAST: {player.kast.toFixed(0)}%</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${player.alive ? "bg-green-400" : "bg-red-400"}`} />
                              {player.alive && (
                                <div className="flex items-center space-x-1 text-xs">
                                  <HeartIcon className="h-3 w-3 text-red-400" />
                                  <span className="text-white">{player.health}</span>
                                  <ShieldIcon className="h-3 w-3 text-blue-400" />
                                  <span className="text-white">{player.armor}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Team 2 */}
                <Card className="bg-black/20 border-red-400/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-red-400 flex items-center">
                      <ShieldIcon className="h-5 w-5 mr-2" />
                      {currentMatch.teams.team2.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentMatch.players
                        .filter((p) => p.team === "team2")
                        .map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-red-500/20 text-red-300">
                                  {player.name.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-white font-medium">{player.name}</div>
                                <div className="text-xs text-white/60">{player.weapon}</div>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="text-sm text-white">{getPlayerKDA(player)}</div>
                              <div className="flex items-center space-x-2 text-xs">
                                <span className="text-green-400">ADR: {player.adr.toFixed(0)}</span>
                                <span className="text-blue-400">KAST: {player.kast.toFixed(0)}%</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${player.alive ? "bg-green-400" : "bg-red-400"}`} />
                              {player.alive && (
                                <div className="flex items-center space-x-1 text-xs">
                                  <HeartIcon className="h-3 w-3 text-red-400" />
                                  <span className="text-white">{player.health}</span>
                                  <ShieldIcon className="h-3 w-3 text-blue-400" />
                                  <span className="text-white">{player.armor}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Economy */}
              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <DollarSignIcon className="h-5 w-5 mr-2 text-yellow-400" />
                    Team Economy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-400">{currentMatch.teams.team1.name}</span>
                        <span className="text-white font-semibold">
                          ${currentMatch.teams.team1.economy.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(currentMatch.teams.team1.economy / 25000) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-red-400">{currentMatch.teams.team2.name}</span>
                        <span className="text-white font-semibold">
                          ${currentMatch.teams.team2.economy.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(currentMatch.teams.team2.economy / 25000) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ZapIcon className="h-5 w-5 mr-2 text-yellow-400" />
                Live Events Feed
              </CardTitle>
              <CardDescription className="text-white/60">Real-time match events and highlights</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {matchEvents.length === 0 ? (
                    <div className="text-center text-white/60 py-8">
                      <ActivityIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No events yet. Events will appear here as the match progresses.</p>
                    </div>
                  ) : (
                    matchEvents.map((event) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                        <div className="flex-shrink-0">
                          {event.type === "kill" && <TargetIcon className="h-4 w-4 text-red-400" />}
                          {event.type === "death" && <AlertCircleIcon className="h-4 w-4 text-gray-400" />}
                          {event.type === "bomb_plant" && <ZapIcon className="h-4 w-4 text-orange-400" />}
                          {event.type === "round_end" && <CheckCircleIcon className="h-4 w-4 text-green-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-white">
                              {event.type === "kill" && (
                                <span>
                                  <span className="text-blue-400">{event.player}</span> eliminated{" "}
                                  <span className="text-red-400">{event.victim}</span>
                                  {event.headshot && <span className="text-yellow-400"> (Headshot!)</span>}
                                </span>
                              )}
                              {event.type === "bomb_plant" && (
                                <span>
                                  <span className="text-orange-400">{event.player}</span> planted the spike
                                </span>
                              )}
                              {event.type === "round_end" && (
                                <span className="text-green-400">Round {event.round} completed</span>
                              )}
                            </div>
                            <div className="text-xs text-white/60">Round {event.round}</div>
                          </div>
                          <div className="text-xs text-white/40 mt-1">{event.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
