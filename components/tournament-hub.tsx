"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  CalendarIcon,
  TrophyIcon,
  UsersIcon,
  ClockIcon,
  DollarSignIcon,
  StarIcon,
  PlayIcon,
  EyeIcon,
  UserPlusIcon,
} from "lucide-react"

interface Tournament {
  id: number
  name: string
  game: string
  prize: string
  participants: number
  maxParticipants: number
  startDate: Date
  status: "upcoming" | "live" | "completed"
  entryFee: string
  format: string
  duration: string
}

export default function TournamentHub() {
  const [registeredTournaments, setRegisteredTournaments] = useState<number[]>([1, 3])

  const [tournaments] = useState<Tournament[]>([
    {
      id: 1,
      name: "Aphrodite Championship",
      game: "Valorant",
      prize: "$5,000",
      participants: 128,
      maxParticipants: 256,
      startDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      status: "upcoming",
      entryFee: "Free",
      format: "Single Elimination",
      duration: "3 hours",
    },
    {
      id: 2,
      name: "Weekly Grind",
      game: "CS2",
      prize: "$1,000",
      participants: 64,
      maxParticipants: 128,
      startDate: new Date(Date.now() + 86400000), // 1 day from now
      status: "upcoming",
      entryFee: "$5",
      format: "Swiss System",
      duration: "4 hours",
    },
    {
      id: 3,
      name: "Pro League Qualifier",
      game: "Valorant",
      prize: "$10,000",
      participants: 200,
      maxParticipants: 512,
      startDate: new Date(Date.now() - 3600000), // 1 hour ago
      status: "live",
      entryFee: "$25",
      format: "Double Elimination",
      duration: "6 hours",
    },
    {
      id: 4,
      name: "Rookie Cup",
      game: "Overwatch 2",
      prize: "$500",
      participants: 32,
      maxParticipants: 64,
      startDate: new Date(Date.now() + 86400000 * 7), // 1 week from now
      status: "upcoming",
      entryFee: "Free",
      format: "Round Robin",
      duration: "2 hours",
    },
  ])

  const handleRegister = (tournamentId: number) => {
    setRegisteredTournaments((prev) => [...prev, tournamentId])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "border-red-400 text-red-300 animate-pulse"
      case "upcoming":
        return "border-blue-400 text-blue-300"
      case "completed":
        return "border-gray-400 text-gray-300"
      default:
        return "border-white/20 text-white/60"
    }
  }

  const upcomingTournaments = tournaments.filter((t) => t.status === "upcoming")
  const liveTournaments = tournaments.filter((t) => t.status === "live")
  const myTournaments = tournaments.filter((t) => registeredTournaments.includes(t.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Tournament Hub</h2>
        <div className="flex space-x-2">
          <Badge variant="outline" className="border-yellow-400 text-yellow-300">
            <TrophyIcon className="h-3 w-3 mr-1" />
            Competitive
          </Badge>
          <Badge variant="outline" className="border-red-400 text-red-300 animate-pulse">
            {liveTournaments.length} Live
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="bg-black/20 backdrop-blur-sm">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="live">Live ({liveTournaments.length})</TabsTrigger>
          <TabsTrigger value="my-tournaments">My Tournaments</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Featured Tournament */}
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-400/30 backdrop-blur-sm transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-white">🏆 Featured: Aphrodite Championship</CardTitle>
                  <CardDescription className="text-white/60">The biggest tournament of the season</CardDescription>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Featured</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">$5,000</div>
                  <div className="text-xs text-white/60">Prize Pool</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">128/256</div>
                  <div className="text-xs text-white/60">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">2 Days</div>
                  <div className="text-xs text-white/60">Starts In</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">Free</div>
                  <div className="text-xs text-white/60">Entry Fee</div>
                </div>
              </div>
              <Progress value={50} className="mb-4" />
              <Button
                className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30"
                disabled={registeredTournaments.includes(1)}
              >
                {registeredTournaments.includes(1) ? "Registered ✓" : "Register Now"}
              </Button>
            </CardContent>
          </Card>

          {/* Tournament Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingTournaments.slice(1).map((tournament) => (
              <Card
                key={tournament.id}
                className="bg-black/20 border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{tournament.name}</CardTitle>
                    <Badge variant="outline" className={getStatusColor(tournament.status)}>
                      {tournament.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-white/60">
                    {tournament.game} • {tournament.format}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <DollarSignIcon className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-white/80">{tournament.prize}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UsersIcon className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-white/80">
                        {tournament.participants}/{tournament.maxParticipants}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-white/80">{tournament.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-white/80">{tournament.startDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Progress value={(tournament.participants / tournament.maxParticipants) * 100} className="h-2" />
                  <Button
                    onClick={() => handleRegister(tournament.id)}
                    disabled={registeredTournaments.includes(tournament.id)}
                    className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
                  >
                    {registeredTournaments.includes(tournament.id) ? (
                      "Registered ✓"
                    ) : (
                      <>
                        <UserPlusIcon className="h-4 w-4 mr-2" />
                        Register ({tournament.entryFee})
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {liveTournaments.map((tournament) => (
              <Card
                key={tournament.id}
                className="bg-red-900/20 border-red-400/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-white">
                        <div className="w-3 h-3 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                        {tournament.name}
                      </CardTitle>
                      <CardDescription className="text-white/60">{tournament.game} • Live Now</CardDescription>
                    </div>
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 animate-pulse">LIVE</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-400">{tournament.prize}</div>
                      <div className="text-xs text-white/60">Prize Pool</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">{tournament.participants}</div>
                      <div className="text-xs text-white/60">Players</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-400">Round 3</div>
                      <div className="text-xs text-white/60">Current Stage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">2.5h</div>
                      <div className="text-xs text-white/60">Remaining</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Watch Live
                    </Button>
                    {registeredTournaments.includes(tournament.id) && (
                      <Button className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                        <PlayIcon className="h-4 w-4 mr-2" />
                        Join Match
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-tournaments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/80 flex items-center">
                  <TrophyIcon className="h-4 w-4 mr-2 text-yellow-400" />
                  Tournaments Won
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">3</div>
                <div className="text-xs text-white/60">All time</div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/80 flex items-center">
                  <DollarSignIcon className="h-4 w-4 mr-2 text-green-400" />
                  Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">$2,450</div>
                <div className="text-xs text-white/60">Total winnings</div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/80 flex items-center">
                  <StarIcon className="h-4 w-4 mr-2 text-purple-400" />
                  Tournament Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">1847</div>
                <div className="text-xs text-white/60">Current rating</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {myTournaments.map((tournament) => (
              <Card
                key={tournament.id}
                className="bg-black/20 border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" />
                        <AvatarFallback>{tournament.game.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-white">{tournament.name}</h3>
                        <p className="text-sm text-white/60">
                          {tournament.game} • {tournament.status === "live" ? "In Progress" : "Registered"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getStatusColor(tournament.status)}>
                        {tournament.status}
                      </Badge>
                      <p className="text-sm mt-1 text-white/60">{tournament.startDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Create Tournament</CardTitle>
              <CardDescription className="text-white/60">Host your own tournament and invite players</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrophyIcon className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Tournament Creation</h3>
                <p className="text-white/60 mb-6">Create custom tournaments with your own rules and prize pools</p>
                <Button className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Create Tournament
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
