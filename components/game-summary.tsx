"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrophyIcon,
  StarIcon,
  CoinsIcon,
  ClockIcon,
  AwardIcon,
  TrendingUpIcon,
  GamepadIcon,
  CrownIcon,
  BoltIcon,
  RocketIcon,
  CrosshairIcon,
  TargetIcon,
  SwordIcon,
  HeartIcon,
  ActivityIcon,
  BarChart3Icon,
  PieChartIcon,
  LineChartIcon,
} from "lucide-react"

interface GameSession {
  id: string
  game: string
  date: Date
  duration: number // in minutes
  result: "win" | "loss" | "draw"
  score: string
  kda?: string
  rank?: string
  map?: string
  gameMode: string
}

interface Achievement {
  id: string
  title: string
  description: string
  game: string
  unlockedAt: Date
  rarity: "common" | "rare" | "epic" | "legendary"
  icon: any
  points: number
}

interface GameStats {
  game: string
  totalMatches: number
  wins: number
  losses: number
  winRate: number
  averageKDA: number
  bestStreak: number
  currentStreak: number
  totalPlaytime: number // in hours
  rank: string
  peakRank: string
  icon: any
}

export default function GameSummary() {
  // const [selectedPeriod, setSelectedPeriod] = useState("week") // This state was unused

  const gameStats: GameStats[] = [
    {
      game: "Valorant",
      totalMatches: 247,
      wins: 156,
      losses: 91,
      winRate: 63.2,
      averageKDA: 1.34,
      bestStreak: 12,
      currentStreak: 3,
      totalPlaytime: 89.5,
      rank: "Diamond 2",
      peakRank: "Immortal 1",
      icon: CrosshairIcon,
    },
    {
      game: "CS2",
      totalMatches: 189,
      wins: 98,
      losses: 91,
      winRate: 51.9,
      averageKDA: 1.12,
      bestStreak: 8,
      currentStreak: 0,
      totalPlaytime: 67.2,
      rank: "Legendary Eagle",
      peakRank: "Supreme Master",
      icon: TargetIcon,
    },
    {
      game: "Apex Legends",
      totalMatches: 134,
      wins: 89,
      losses: 45,
      winRate: 66.4,
      averageKDA: 1.89,
      bestStreak: 15,
      currentStreak: 7,
      totalPlaytime: 45.8,
      rank: "Diamond 4",
      peakRank: "Master",
      icon: RocketIcon,
    },
    {
      game: "League of Legends",
      totalMatches: 98,
      wins: 52,
      losses: 46,
      winRate: 53.1,
      averageKDA: 2.1,
      bestStreak: 6,
      currentStreak: 2,
      totalPlaytime: 78.3,
      rank: "Gold 1",
      peakRank: "Platinum 3",
      icon: SwordIcon,
    },
  ]

  const recentSessions: GameSession[] = [
    {
      id: "1",
      game: "Valorant",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 45,
      result: "win",
      score: "13-8",
      kda: "18/12/6",
      rank: "Diamond 2",
      map: "Ascent",
      gameMode: "Competitive",
    },
    {
      id: "2",
      game: "CS2",
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      duration: 38,
      result: "loss",
      score: "14-16",
      kda: "19/18/4",
      rank: "Legendary Eagle",
      map: "Dust2",
      gameMode: "Premier",
    },
    {
      id: "3",
      game: "Apex Legends",
      date: new Date(Date.now() - 8 * 60 * 60 * 1000),
      duration: 22,
      result: "win",
      score: "Squad #1",
      kda: "8/2/3",
      rank: "Diamond 4",
      map: "Kings Canyon",
      gameMode: "Ranked",
    },
    {
      id: "4",
      game: "Valorant",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      duration: 52,
      result: "win",
      score: "13-11",
      kda: "22/15/8",
      rank: "Diamond 2",
      map: "Haven",
      gameMode: "Competitive",
    },
    {
      id: "5",
      game: "League of Legends",
      date: new Date(Date.now() - 26 * 60 * 60 * 1000),
      duration: 34,
      result: "loss",
      score: "Defeat",
      kda: "12/8/15",
      rank: "Gold 1",
      map: "Summoner's Rift",
      gameMode: "Ranked Solo",
    },
  ]

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Ace Master",
      description: "Get 5 aces in Valorant competitive matches",
      game: "Valorant",
      unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      rarity: "legendary",
      icon: StarIcon,
      points: 500,
    },
    {
      id: "2",
      title: "Clutch King",
      description: "Win 25 1v3+ clutch situations",
      game: "CS2",
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      rarity: "epic",
      icon: BoltIcon,
      points: 300,
    },
    {
      id: "3",
      title: "Champion",
      description: "Win 10 matches in a row",
      game: "Apex Legends",
      unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      rarity: "rare",
      icon: CrownIcon,
      points: 200,
    },
    {
      id: "4",
      title: "Sharpshooter",
      description: "Maintain 75%+ headshot rate for 10 games",
      game: "Valorant",
      unlockedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      rarity: "epic",
      icon: CrosshairIcon,
      points: 350,
    },
    {
      id: "5",
      title: "Team Player",
      description: "Get 100 assists in ranked matches",
      game: "League of Legends",
      unlockedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      rarity: "rare",
      icon: HeartIcon,
      points: 150,
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-500/30 text-gray-400 bg-gray-500/10"
      case "rare":
        return "border-blue-500/30 text-blue-400 bg-blue-500/10"
      case "epic":
        return "border-purple-500/30 text-purple-400 bg-purple-500/10"
      case "legendary":
        return "border-orange-500/30 text-orange-400 bg-orange-500/10"
      default:
        return "border-gray-500/30 text-gray-400 bg-gray-500/10"
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return "text-green-400 bg-green-500/20"
      case "loss":
        return "text-red-400 bg-red-500/20"
      case "draw":
        return "text-yellow-400 bg-yellow-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const totalMatches = gameStats.reduce((sum, game) => sum + game.totalMatches, 0)
  const totalWins = gameStats.reduce((sum, game) => sum + game.wins, 0)
  const totalPlaytime = gameStats.reduce((sum, game) => sum + game.totalPlaytime, 0)
  const overallWinRate = totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0

  return (
    <div className="space-y-6 transition-all duration-700 ease-out opacity-100">
      {/* Header */}
      <div className="flex items-center justify-between transition-all duration-500 ease-out">
        <div className="flex items-center space-x-3">
          <GamepadIcon className="h-8 w-8 text-primary animate-pulse" />
          <div>
            <h2 className="text-2xl font-semibold">Game Summary</h2>
            <p className="text-sm text-muted-foreground">Your gaming journey and achievements</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrophyIcon className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-lg font-bold text-primary">{totalMatches}</div>
                  <div className="text-xs text-muted-foreground">Total Matches</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ActivityIcon className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-lg font-bold text-green-500">{overallWinRate.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="transition-all duration-300 hover:scale-105">
            <BarChart3Icon className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="recent" className="transition-all duration-300 hover:scale-105">
            <ClockIcon className="h-4 w-4 mr-2" />
            Recent Games
          </TabsTrigger>
          <TabsTrigger value="achievements" className="transition-all duration-300 hover:scale-105">
            <AwardIcon className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="stats" className="transition-all duration-300 hover:scale-105">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Summary */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 transition-all duration-700 ease-out">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChartIcon className="h-5 w-5 mr-2 text-blue-400" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-card/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{totalPlaytime.toFixed(1)}h</div>
                  <div className="text-sm text-muted-foreground">Total Playtime</div>
                </div>
                <div className="text-center p-4 bg-card/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{totalWins}</div>
                  <div className="text-sm text-muted-foreground">Total Wins</div>
                </div>
                <div className="text-center p-4 bg-card/50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400">{achievements.length}</div>
                  <div className="text-sm text-muted-foreground">Achievements</div>
                </div>
                <div className="text-center p-4 bg-card/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{gameStats.length}</div>
                  <div className="text-sm text-muted-foreground">Games Played</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gameStats.map(
              (
                game, // Removed index as it was unused
              ) => (
                <Card
                  key={game.game}
                  className="bg-card border-border transition-all duration-500 hover:scale-105 hover:shadow-lg"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <game.icon className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg">{game.game}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-primary border-primary/30">
                        {game.rank}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Matches</div>
                        <div className="font-semibold">{game.totalMatches}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Win Rate</div>
                        <div className="font-semibold text-green-400">{game.winRate.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg KDA</div>
                        <div className="font-semibold">{game.averageKDA.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Best Streak</div>
                        <div className="font-semibold text-orange-400">{game.bestStreak}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Streak</span>
                        <span className={game.currentStreak > 0 ? "text-green-400" : "text-red-400"}>
                          {game.currentStreak > 0 ? `+${game.currentStreak}` : game.currentStreak}
                        </span>
                      </div>
                      <Progress
                        value={game.bestStreak > 0 ? Math.min((game.currentStreak / game.bestStreak) * 100, 100) : 0}
                        className="h-2"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Peak: {game.peakRank}</span>
                      <span>{game.totalPlaytime.toFixed(1)}h played</span>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm transition-all duration-700 ease-out">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-blue-400" />
                Recent Gaming Sessions
              </CardTitle>
              <CardDescription>Your latest matches and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map(
                  (
                    session, // Removed index as it was unused
                  ) => (
                    <div
                      key={session.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card border border-border rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
                    >
                      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                        <div className="flex items-center space-x-2">
                          <GamepadIcon className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">{session.game}</div>
                            <div className="text-sm text-muted-foreground">{session.gameMode}</div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="text-muted-foreground">Map</div>
                          <div>{session.map || "N/A"}</div>
                        </div>
                        <div className="text-sm">
                          <div className="text-muted-foreground">Score</div>
                          <div>{session.score}</div>
                        </div>
                        {session.kda && (
                          <div className="text-sm">
                            <div className="text-muted-foreground">KDA</div>
                            <div>{session.kda}</div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getResultColor(session.result)}>{session.result.toUpperCase()}</Badge>
                        <div className="text-sm text-muted-foreground text-right">
                          <div>{formatDuration(session.duration)}</div>
                          <div>{formatTimeAgo(session.date)}</div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/20 transition-all duration-700 ease-out">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AwardIcon className="h-5 w-5 mr-2 text-orange-400" />
                Recent Achievements
              </CardTitle>
              <CardDescription>Your latest unlocked achievements and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map(
                  (
                    achievement, // Removed index as it was unused
                  ) => (
                    <Card
                      key={achievement.id}
                      className={`transition-all duration-500 hover:scale-105 hover:shadow-lg ${getRarityColor(achievement.rarity)}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <achievement.icon className="h-6 w-6 text-primary" />
                          <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <div className="text-muted-foreground">Game</div>
                            <div className="font-medium">{achievement.game}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CoinsIcon className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-primary">{achievement.points} pts</span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Unlocked {formatTimeAgo(achievement.unlockedAt)}
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Statistics */}
            <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20 transition-all duration-700 ease-out">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3Icon className="h-5 w-5 mr-2 text-green-400" />
                  Overall Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Matches</span>
                    <span className="font-semibold">{totalMatches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wins</span>
                    <span className="font-semibold text-green-400">{totalWins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Losses</span>
                    <span className="font-semibold text-red-400">{totalMatches - totalWins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Win Rate</span>
                    <span className="font-semibold text-primary">{overallWinRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Playtime</span>
                    <span className="font-semibold">{totalPlaytime.toFixed(1)} hours</span>
                  </div>
                </div>
                <Progress value={overallWinRate} className="h-3" />
              </CardContent>
            </Card>

            {/* Performance Highlights */}
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 transition-all duration-700 ease-out">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUpIcon className="h-5 w-5 mr-2 text-purple-400" />
                  Performance Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Best Win Streak</span>
                    <span className="font-semibold text-orange-400">
                      {gameStats.length > 0 ? Math.max(...gameStats.map((g) => g.bestStreak)) : 0} games
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Highest Rank</span>
                    <span className="font-semibold text-primary">
                      {gameStats.length > 0
                        ? gameStats.reduce((prev, current) => (prev.peakRank > current.peakRank ? prev : current))
                            .peakRank
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Best KDA</span>
                    <span className="font-semibold text-green-400">
                      {gameStats.length > 0 ? Math.max(...gameStats.map((g) => g.averageKDA)).toFixed(2) : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Achievement Points</span>
                    <span className="font-semibold text-yellow-400">
                      {achievements.reduce((sum, a) => sum + a.points, 0)} pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Games Mastered</span>
                    <span className="font-semibold">{gameStats.length} games</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
