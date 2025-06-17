"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrophyIcon, UsersIcon, PlayIcon, ClockIcon, StarIcon, ZapIcon } from "lucide-react"

interface Player {
  id: number
  name: string
  avatar: string
  rank: string
  seed: number
}

interface Match {
  id: number
  player1: Player | null
  player2: Player | null
  winner: Player | null
  score: string
  round: number
  position: number
  status: "upcoming" | "live" | "completed"
}

export default function TournamentBrackets() {
  const [selectedTournament, setSelectedTournament] = useState("current")

  const players: Player[] = [
    { id: 1, name: "ShadowStrike", avatar: "/placeholder.svg?height=32&width=32", rank: "Immortal II", seed: 1 },
    { id: 2, name: "ProGamer2024", avatar: "/placeholder.svg?height=32&width=32", rank: "Diamond III", seed: 2 },
    { id: 3, name: "MysticHealer", avatar: "/placeholder.svg?height=32&width=32", rank: "Diamond II", seed: 3 },
    { id: 4, name: "IronWill", avatar: "/placeholder.svg?height=32&width=32", rank: "Diamond I", seed: 4 },
    { id: 5, name: "QuickScope", avatar: "/placeholder.svg?height=32&width=32", rank: "Platinum III", seed: 5 },
    { id: 6, name: "NeonBlast", avatar: "/placeholder.svg?height=32&width=32", rank: "Platinum II", seed: 6 },
    { id: 7, name: "CyberNinja", avatar: "/placeholder.svg?height=32&width=32", rank: "Platinum I", seed: 7 },
    { id: 8, name: "PixelWarrior", avatar: "/placeholder.svg?height=32&width=32", rank: "Gold III", seed: 8 },
  ]

  const [matches, setMatches] = useState<Match[]>([
    // Round 1 (Quarterfinals)
    {
      id: 1,
      player1: players[0],
      player2: players[7],
      winner: players[0],
      score: "2-0",
      round: 1,
      position: 1,
      status: "completed",
    },
    {
      id: 2,
      player1: players[1],
      player2: players[6],
      winner: players[1],
      score: "2-1",
      round: 1,
      position: 2,
      status: "completed",
    },
    {
      id: 3,
      player1: players[2],
      player2: players[5],
      winner: players[2],
      score: "2-0",
      round: 1,
      position: 3,
      status: "completed",
    },
    {
      id: 4,
      player1: players[3],
      player2: players[4],
      winner: null,
      score: "1-1",
      round: 1,
      position: 4,
      status: "live",
    },

    // Round 2 (Semifinals)
    {
      id: 5,
      player1: players[0],
      player2: players[1],
      winner: null,
      score: "",
      round: 2,
      position: 1,
      status: "upcoming",
    },
    { id: 6, player1: players[2], player2: null, winner: null, score: "", round: 2, position: 2, status: "upcoming" },

    // Round 3 (Finals)
    { id: 7, player1: null, player2: null, winner: null, score: "", round: 3, position: 1, status: "upcoming" },
  ])

  const PlayerCard = ({
    player,
    isWinner = false,
    size = "sm",
  }: {
    player: Player | null
    isWinner?: boolean
    size?: "sm" | "md"
  }) => {
    if (!player) {
      return (
        <div
          className={`flex items-center space-x-2 p-2 rounded border-2 border-dashed border-muted ${
            size === "md" ? "h-16" : "h-12"
          }`}
        >
          <div className="text-xs text-muted-foreground">TBD</div>
        </div>
      )
    }

    return (
      <div
        className={`flex items-center space-x-2 p-2 rounded border-2 transition-all duration-300 hover:scale-105 ${
          isWinner ? "border-primary bg-primary/10 shadow-lg" : "border-border bg-card hover:border-primary/50"
        } ${size === "md" ? "h-16" : "h-12"}`}
      >
        <Avatar className={size === "md" ? "h-10 w-10" : "h-8 w-8"}>
          <AvatarImage src={player.avatar || "/placeholder.svg"} />
          <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className={`font-medium truncate ${size === "md" ? "text-sm" : "text-xs"}`}>{player.name}</div>
          <div className="text-xs text-muted-foreground">{player.rank}</div>
        </div>
        {isWinner && <TrophyIcon className="h-4 w-4 text-yellow-500" />}
      </div>
    )
  }

  const MatchCard = ({ match }: { match: Match }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "live":
          return "border-red-500 bg-red-500/10"
        case "completed":
          return "border-green-500 bg-green-500/10"
        default:
          return "border-blue-500 bg-blue-500/10"
      }
    }

    return (
      <Card
        className={`${getStatusColor(match.status)} transition-all duration-300 hover:scale-105 animate-in fade-in`}
      >
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {match.status === "live" ? "LIVE" : match.status === "completed" ? "FINAL" : "UPCOMING"}
            </Badge>
            {match.status === "live" && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-red-500">Live</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <PlayerCard player={match.player1} isWinner={match.winner?.id === match.player1?.id} />
            <div className="text-center text-xs text-muted-foreground">vs</div>
            <PlayerCard player={match.player2} isWinner={match.winner?.id === match.player2?.id} />
          </div>

          {match.score && <div className="text-center text-sm font-bold">{match.score}</div>}

          {match.status === "live" && (
            <Button size="sm" className="w-full">
              <PlayIcon className="h-3 w-3 mr-1" />
              Watch
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  const BracketView = () => {
    const rounds = [
      { title: "Quarterfinals", matches: matches.filter((m) => m.round === 1) },
      { title: "Semifinals", matches: matches.filter((m) => m.round === 2) },
      { title: "Finals", matches: matches.filter((m) => m.round === 3) },
    ]

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {rounds.map((round, roundIndex) => (
            <div key={roundIndex} className="space-y-4">
              <h3 className="text-lg font-semibold text-center">{round.title}</h3>
              <div className="space-y-4">
                {round.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Tournament Brackets</h2>
        <div className="flex space-x-2">
          <Badge variant="outline" className="border-red-500/30 text-red-400">
            <ZapIcon className="h-3 w-3 mr-1" />
            Live Tournament
          </Badge>
          <Badge variant="outline">
            <UsersIcon className="h-3 w-3 mr-1" />8 Players
          </Badge>
        </div>
      </div>

      <Tabs value={selectedTournament} onValueChange={setSelectedTournament} className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Current Tournament</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <TrophyIcon className="h-5 w-5 mr-2 text-primary" />
                    Aphrodite Championship - Round 1
                  </CardTitle>
                  <CardDescription>Single Elimination • Best of 3</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-500">$5,000</div>
                  <div className="text-sm text-muted-foreground">Prize Pool</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-500">Quarterfinals</div>
                  <div className="text-sm text-muted-foreground">Current Round</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-500">1/4</div>
                  <div className="text-sm text-muted-foreground">Matches Live</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-500">45min</div>
                  <div className="text-sm text-muted-foreground">Est. Remaining</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <BracketView />
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Weekly Grind Championship",
                date: "Tomorrow, 3:00 PM",
                prize: "$1,000",
                players: "32/64",
                game: "CS2",
              },
              {
                name: "Rookie Cup Finals",
                date: "Friday, 7:00 PM",
                prize: "$500",
                players: "16/16",
                game: "Valorant",
              },
            ].map((tournament, index) => (
              <Card
                key={index}
                className="bg-card border-border animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{tournament.name}</CardTitle>
                  <CardDescription>{tournament.game} • Single Elimination</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4 text-blue-500" />
                      <span>{tournament.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrophyIcon className="h-4 w-4 text-yellow-500" />
                      <span>{tournament.prize}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UsersIcon className="h-4 w-4 text-purple-500" />
                      <span>{tournament.players}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StarIcon className="h-4 w-4 text-green-500" />
                      <span>Open</span>
                    </div>
                  </div>
                  <Button className="w-full">View Bracket</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="space-y-4">
            {[
              {
                name: "Last Week's Championship",
                winner: "ShadowStrike",
                prize: "$2,500",
                date: "Last Sunday",
                participants: 16,
              },
              {
                name: "Monthly Masters",
                winner: "ProGamer2024",
                prize: "$1,000",
                date: "2 weeks ago",
                participants: 32,
              },
            ].map((tournament, index) => (
              <Card
                key={index}
                className="bg-card border-border animate-in slide-in-from-left-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <TrophyIcon className="h-8 w-8 text-yellow-500" />
                      <div>
                        <h3 className="font-medium">{tournament.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Won by {tournament.winner} • {tournament.participants} players
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-500">{tournament.prize}</div>
                      <div className="text-sm text-muted-foreground">{tournament.date}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
