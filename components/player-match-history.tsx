"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Trophy, Target, MapPin, Loader2, AlertTriangle, Zap } from "lucide-react"

interface PlayerSearchResult {
  uid: string
  displayName: string
  photoURL?: string
  gameStats: {
    valorant: any
    cs2: any
  }
  privacy: string
  lastActive: Date
}

interface Match {
  id: string
  gameType: "valorant" | "cs2"
  result: "win" | "loss"
  score: string
  map: string
  duration: number
  kills: number
  deaths: number
  assists: number
  date: Date
}

interface MatchSummary {
  totalMatches: number
  wins: number
  losses: number
  winRate: number
  averageKDA: {
    kills: number
    deaths: number
    assists: number
  }
  favoriteMap: string
  longestWinStreak: number
  recentForm: ("win" | "loss")[]
  rankProgress: {
    startRank: string
    currentRank: string
    peakRank: string
  }
}

export default function PlayerMatchHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<PlayerSearchResult[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSearchResult | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [summary, setSummary] = useState<{ valorant: MatchSummary; cs2: MatchSummary } | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  // Search for players
  const handleSearch = async () => {
    if (!searchTerm.trim() || searchTerm.length < 2) return

    setSearchLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/players/search?q=${encodeURIComponent(searchTerm)}&limit=10`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.players)
        console.log(`✅ Found ${data.players.length} players`)
      } else {
        setError(data.error || "Search failed")
      }
    } catch (error) {
      console.error("❌ Search error:", error)
      setError("Failed to search players")
    } finally {
      setSearchLoading(false)
    }
  }

  // Load player match history
  const loadPlayerHistory = async (player: PlayerSearchResult) => {
    setLoading(true)
    setError(null)
    setSelectedPlayer(player)

    try {
      const response = await fetch(`/api/players/${player.uid}/matches?limit=20`)
      const data = await response.json()

      if (data.success) {
        setMatches(data.matches)
        setSummary(data.summary)
        setOpen(true)
        console.log(`✅ Loaded ${data.matches.length} matches for ${player.displayName}`)
      } else {
        setError(data.error || "Failed to load match history")
      }
    } catch (error) {
      console.error("❌ Error loading player history:", error)
      setError("Failed to load player data")
    } finally {
      setLoading(false)
    }
  }

  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Search className="h-5 w-5 mr-2 text-blue-400" />
          Player Match History
        </CardTitle>
        <CardDescription className="text-white/60">
          Search for players and view their match history and performance statistics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Interface */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={searchLoading || searchTerm.length < 2}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
          >
            {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white/80">Search Results</h4>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {searchResults.map((player) => (
                  <div
                    key={player.uid}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={player.photoURL || "/placeholder.svg"} />
                        <AvatarFallback>{player.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">{player.displayName}</p>
                        <div className="flex items-center space-x-2 text-xs text-white/60">
                          <span>VAL: {player.gameStats.valorant.rank}</span>
                          <span>•</span>
                          <span>CS2: {player.gameStats.cs2.rank}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => loadPlayerHistory(player)}
                      disabled={loading}
                      className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
                    >
                      {loading && selectedPlayer?.uid === player.uid ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "View History"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* No Results */}
        {searchTerm.length >= 2 && searchResults.length === 0 && !searchLoading && (
          <div className="text-center py-8 text-white/60">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No players found for "{searchTerm}"</p>
            <p className="text-sm">Try a different username</p>
          </div>
        )}

        {/* Match History Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-black/90 backdrop-blur-sm border-white/30 text-white max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                {selectedPlayer && (
                  <>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedPlayer.photoURL || "/placeholder.svg"} />
                      <AvatarFallback>{selectedPlayer.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{selectedPlayer.displayName}'s Match History</span>
                  </>
                )}
              </DialogTitle>
              <DialogDescription>Performance statistics and recent match history</DialogDescription>
            </DialogHeader>

            {summary && (
              <Tabs defaultValue="valorant" className="space-y-4">
                <TabsList className="bg-black/20 backdrop-blur-sm">
                  <TabsTrigger value="valorant">Valorant</TabsTrigger>
                  <TabsTrigger value="cs2">Counter-Strike 2</TabsTrigger>
                </TabsList>

                <TabsContent value="valorant" className="space-y-4">
                  <GameSummaryCard summary={summary.valorant} gameType="Valorant" />
                  <MatchHistoryList matches={matches.filter((m) => m.gameType === "valorant")} gameType="valorant" />
                </TabsContent>

                <TabsContent value="cs2" className="space-y-4">
                  <GameSummaryCard summary={summary.cs2} gameType="Counter-Strike 2" />
                  <MatchHistoryList matches={matches.filter((m) => m.gameType === "cs2")} gameType="cs2" />
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

function GameSummaryCard({ summary, gameType }: { summary: MatchSummary; gameType: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-white/80">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-2">{summary.winRate}%</div>
          <div className="text-xs text-white/60">
            {summary.wins}W / {summary.losses}L
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white/80">Avg K/D/A</span>
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-2">
            {summary.averageKDA.kills}/{summary.averageKDA.deaths}/{summary.averageKDA.assists}
          </div>
          <div className="text-xs text-white/60">{summary.totalMatches} matches</div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-white/80">Favorite Map</span>
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{summary.favoriteMap}</div>
          <div className="text-xs text-white/60">Most played</div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-white/80">Win Streak</span>
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-2">{summary.longestWinStreak}</div>
          <div className="text-xs text-white/60">Best streak</div>
        </CardContent>
      </Card>
    </div>
  )
}

function MatchHistoryList({ matches, gameType }: { matches: Match[]; gameType: string }) {
  if (matches.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-50 text-white/40" />
          <p className="text-white/60">No {gameType} matches found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-lg">Recent Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  match.result === "win" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${match.result === "win" ? "bg-green-500" : "bg-red-500"}`} />
                  <div>
                    <div className="font-medium text-white">
                      {match.result === "win" ? "Victory" : "Defeat"} - {match.score}
                    </div>
                    <div className="text-sm text-white/60">
                      {match.map} • {Math.round(match.duration)}min
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">
                    {match.kills}/{match.deaths}/{match.assists}
                  </div>
                  <div className="text-xs text-white/60">{new Date(match.date).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
