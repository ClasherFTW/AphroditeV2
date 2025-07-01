"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  GamepadIcon,
  PlayIcon,
  DownloadIcon,
  StarIcon,
  ClockIcon,
  TrophyIcon,
  SearchIcon,
  FilterIcon,
  ImageUpIcon as UpdateIcon,
} from "lucide-react"

interface Game {
  id: number
  name: string
  genre: string
  playtime: number
  lastPlayed: Date
  achievements: number
  totalAchievements: number
  rating: number
  status: "installed" | "not-installed" | "updating"
  image: string
  rank?: string
  winRate?: number
}

export default function GameLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")

  const [games] = useState<Game[]>([
    {
      id: 1,
      name: "Valorant",
      genre: "FPS",
      playtime: 247,
      lastPlayed: new Date(Date.now() - 3600000),
      achievements: 45,
      totalAchievements: 60,
      rating: 4.8,
      status: "installed",
      image: "/placeholder.svg?height=200&width=300",
      rank: "Diamond III",
      winRate: 73,
    },
    {
      id: 2,
      name: "Counter-Strike 2",
      genre: "FPS",
      playtime: 189,
      lastPlayed: new Date(Date.now() - 86400000),
      achievements: 32,
      totalAchievements: 50,
      rating: 4.6,
      status: "installed",
      image: "/placeholder.svg?height=200&width=300",
      rank: "Global Elite",
      winRate: 68,
    },
    {
      id: 3,
      name: "Overwatch 2",
      genre: "FPS",
      playtime: 156,
      lastPlayed: new Date(Date.now() - 172800000),
      achievements: 28,
      totalAchievements: 45,
      rating: 4.4,
      status: "installed",
      image: "/placeholder.svg?height=200&width=300",
      rank: "Master",
      winRate: 71,
    },
    {
      id: 4,
      name: "Apex Legends",
      genre: "Battle Royale",
      playtime: 98,
      lastPlayed: new Date(Date.now() - 604800000),
      achievements: 15,
      totalAchievements: 40,
      rating: 4.2,
      status: "not-installed",
      image: "/placeholder.svg?height=200&width=300",
      rank: "Platinum II",
      winRate: 65,
    },
    {
      id: 5,
      name: "League of Legends",
      genre: "MOBA",
      playtime: 312,
      lastPlayed: new Date(Date.now() - 259200000),
      achievements: 67,
      totalAchievements: 80,
      rating: 4.7,
      status: "updating",
      image: "/placeholder.svg?height=200&width=300",
      rank: "Gold I",
      winRate: 58,
    },
    {
      id: 6,
      name: "Rocket League",
      genre: "Sports",
      playtime: 78,
      lastPlayed: new Date(Date.now() - 432000000),
      achievements: 22,
      totalAchievements: 35,
      rating: 4.3,
      status: "installed",
      image: "/placeholder.svg?height=200&width=300",
      rank: "Champion I",
      winRate: 62,
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "installed":
        return <PlayIcon className="h-4 w-4" />
      case "not-installed":
        return <DownloadIcon className="h-4 w-4" />
      case "updating":
        return <UpdateIcon className="h-4 w-4 animate-spin" />
      default:
        return <GamepadIcon className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "installed":
        return "bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/30"
      case "not-installed":
        return "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30"
      case "updating":
        return "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border-yellow-500/30"
      default:
        return "bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 border-gray-500/30"
    }
  }

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === "all" || game.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  const installedGames = filteredGames.filter((game) => game.status === "installed")
  const recentGames = filteredGames.sort((a, b) => b.lastPlayed.getTime() - a.lastPlayed.getTime()).slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Game Library</h2>
        <div className="flex space-x-2">
          <Badge variant="outline" className="border-blue-400 text-blue-300">
            <GamepadIcon className="h-3 w-3 mr-1" />
            {installedGames.length} Installed
          </Badge>
          <Badge variant="outline" className="border-purple-400 text-purple-300">
            {games.reduce((total, game) => total + game.playtime, 0)}h Total
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-black/20 backdrop-blur-sm">
          <TabsTrigger value="all">All Games</TabsTrigger>
          <TabsTrigger value="installed">Installed</TabsTrigger>
          <TabsTrigger value="recent">Recently Played</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <div className="flex space-x-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          <Button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <Card
                key={game.id}
                className="bg-black/20 border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="pb-2">
                  <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mb-3 flex items-center justify-center">
                    <GamepadIcon className="h-12 w-12 text-white/40" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{game.name}</CardTitle>
                    <Badge variant="outline" className="border-purple-400 text-purple-300 text-xs">
                      {game.genre}
                    </Badge>
                  </div>
                  {game.rank && (
                    <CardDescription className="text-white/60">
                      {game.rank} • {game.winRate}% WR
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4 text-blue-400" />
                      <span className="text-white/80">{game.playtime}h</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrophyIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-white/80">
                        {game.achievements}/{game.totalAchievements}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StarIcon className="h-4 w-4 text-green-400" />
                      <span className="text-white/80">{game.rating}/5</span>
                    </div>
                    <div className="text-xs text-white/60">{game.lastPlayed.toLocaleDateString()}</div>
                  </div>

                  <Progress value={(game.achievements / game.totalAchievements) * 100} className="h-2" />

                  <Button className={`w-full ${getStatusColor(game.status)}`}>
                    {getStatusIcon(game.status)}
                    <span className="ml-2">
                      {game.status === "installed" ? "Play" : game.status === "updating" ? "Updating..." : "Install"}
                    </span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="installed" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {installedGames.map((game) => (
              <Card
                key={game.id}
                className="bg-black/20 border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="pb-2">
                  <div className="aspect-video bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg mb-3 flex items-center justify-center">
                    <GamepadIcon className="h-12 w-12 text-white/40" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{game.name}</CardTitle>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Ready</Badge>
                  </div>
                  {game.rank && (
                    <CardDescription className="text-white/60">
                      {game.rank} • {game.winRate}% WR
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4 text-blue-400" />
                      <span className="text-white/80">{game.playtime}h</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrophyIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-white/80">
                        {game.achievements}/{game.totalAchievements}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Launch Game
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentGames.map((game) => (
              <Card
                key={game.id}
                className="bg-black/20 border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                      <GamepadIcon className="h-8 w-8 text-white/40" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{game.name}</h3>
                      <p className="text-sm text-white/60">{game.genre}</p>
                      <p className="text-xs text-white/40">Last played: {game.lastPlayed.toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{game.playtime}h</div>
                      {game.rank && <div className="text-xs text-purple-400">{game.rank}</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Total Playtime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">
                  {games.reduce((total, game) => total + game.playtime, 0)}h
                </div>
                <p className="text-xs text-white/60">Across all games</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-400">
                  {games.reduce((total, game) => total + game.achievements, 0)}
                </div>
                <p className="text-xs text-white/60">
                  of {games.reduce((total, game) => total + game.totalAchievements, 0)} total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">
                  {(games.reduce((total, game) => total + game.rating, 0) / games.length).toFixed(1)}
                </div>
                <p className="text-xs text-white/60">Out of 5 stars</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
