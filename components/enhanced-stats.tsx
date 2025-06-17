"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterPlot,
  Scatter,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUpIcon,
  TrendingDownIcon,
  TargetIcon,
  BarChartIcon,
  AlertTriangleIcon,
  ZapIcon,
  BrainIcon,
  EyeIcon,
  ActivityIcon,
  MapIcon,
  UsersIcon,
  TrophyIcon,
} from "lucide-react"

interface GameStats {
  game: string
  rank: string
  winRate: number
  kda: number
  playtime: number
  recentMatches: number
  improvement: number
  peakRank: string
}

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  unlockedAt: Date
}

interface PerformanceMetric {
  date: string
  winRate: number
  kda: number
  accuracy: number
  reactionTime: number
  gamesPlayed: number
  hoursPlayed: number
  rank: number
}

interface HeatmapData {
  hour: number
  day: string
  performance: number
  matches: number
}

interface MapPerformance {
  map: string
  winRate: number
  avgKDA: number
  timesPlayed: number
  lastPlayed: string
}

interface PlayerInteraction {
  playerId: string
  playerName: string
  gamesPlayed: number
  winRate: number
  synergy: number
  lastPlayed: string
}

interface AnomalyData {
  date: string
  type: "performance_drop" | "unusual_playtime" | "rank_change" | "streak"
  severity: "low" | "medium" | "high"
  description: string
  impact: number
}

export default function EnhancedStats() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedGame, setSelectedGame] = useState("valorant")
  const [analyticsView, setAnalyticsView] = useState("overview")

  // Enhanced mock data with more comprehensive metrics
  const [gameStats] = useState<GameStats[]>([
    {
      game: "Valorant",
      rank: "Diamond III",
      winRate: 73,
      kda: 1.42,
      playtime: 247,
      recentMatches: 15,
      improvement: 12,
      peakRank: "Immortal I",
    },
    {
      game: "CS2",
      rank: "Global Elite",
      winRate: 68,
      kda: 1.38,
      playtime: 189,
      recentMatches: 8,
      improvement: -3,
      peakRank: "Global Elite",
    },
    {
      game: "Overwatch 2",
      rank: "Master",
      winRate: 71,
      kda: 2.1,
      playtime: 156,
      recentMatches: 12,
      improvement: 8,
      peakRank: "Grandmaster",
    },
  ])

  // Advanced performance data
  const performanceData: PerformanceMetric[] = [
    {
      date: "2024-01-01",
      winRate: 65,
      kda: 1.2,
      accuracy: 68,
      reactionTime: 180,
      gamesPlayed: 8,
      hoursPlayed: 6.5,
      rank: 1200,
    },
    {
      date: "2024-01-02",
      winRate: 70,
      kda: 1.4,
      accuracy: 72,
      reactionTime: 175,
      gamesPlayed: 12,
      hoursPlayed: 8.2,
      rank: 1250,
    },
    {
      date: "2024-01-03",
      winRate: 68,
      kda: 1.3,
      accuracy: 70,
      reactionTime: 178,
      gamesPlayed: 10,
      hoursPlayed: 7.1,
      rank: 1230,
    },
    {
      date: "2024-01-04",
      winRate: 75,
      kda: 1.6,
      accuracy: 76,
      reactionTime: 170,
      gamesPlayed: 15,
      hoursPlayed: 9.8,
      rank: 1320,
    },
    {
      date: "2024-01-05",
      winRate: 72,
      kda: 1.5,
      accuracy: 74,
      reactionTime: 172,
      gamesPlayed: 11,
      hoursPlayed: 7.8,
      rank: 1300,
    },
    {
      date: "2024-01-06",
      winRate: 78,
      kda: 1.7,
      accuracy: 78,
      reactionTime: 168,
      gamesPlayed: 14,
      hoursPlayed: 9.2,
      rank: 1380,
    },
    {
      date: "2024-01-07",
      winRate: 80,
      kda: 1.8,
      accuracy: 80,
      reactionTime: 165,
      gamesPlayed: 16,
      hoursPlayed: 10.5,
      rank: 1420,
    },
  ]

  // Performance heatmap data
  const heatmapData: HeatmapData[] = [
    { hour: 9, day: "Monday", performance: 75, matches: 3 },
    { hour: 14, day: "Monday", performance: 82, matches: 5 },
    { hour: 19, day: "Monday", performance: 88, matches: 8 },
    { hour: 22, day: "Monday", performance: 85, matches: 6 },
    { hour: 10, day: "Tuesday", performance: 78, matches: 4 },
    { hour: 15, day: "Tuesday", performance: 85, matches: 7 },
    { hour: 20, day: "Tuesday", performance: 92, matches: 10 },
    { hour: 23, day: "Tuesday", performance: 87, matches: 5 },
    // Add more data points...
  ]

  // Map performance analysis
  const mapPerformance: MapPerformance[] = [
    { map: "Ascent", winRate: 78, avgKDA: 1.6, timesPlayed: 45, lastPlayed: "2024-01-07" },
    { map: "Bind", winRate: 72, avgKDA: 1.4, timesPlayed: 38, lastPlayed: "2024-01-06" },
    { map: "Haven", winRate: 85, avgKDA: 1.8, timesPlayed: 32, lastPlayed: "2024-01-07" },
    { map: "Split", winRate: 68, avgKDA: 1.3, timesPlayed: 28, lastPlayed: "2024-01-05" },
    { map: "Icebox", winRate: 75, avgKDA: 1.5, timesPlayed: 25, lastPlayed: "2024-01-04" },
  ]

  // Player interaction data
  const playerInteractions: PlayerInteraction[] = [
    { playerId: "1", playerName: "ProGamer123", gamesPlayed: 15, winRate: 87, synergy: 92, lastPlayed: "2024-01-07" },
    { playerId: "2", playerName: "SkillMaster", gamesPlayed: 12, winRate: 83, synergy: 88, lastPlayed: "2024-01-06" },
    { playerId: "3", playerName: "TeamPlayer", gamesPlayed: 18, winRate: 79, synergy: 85, lastPlayed: "2024-01-07" },
    { playerId: "4", playerName: "ClutchKing", gamesPlayed: 8, winRate: 75, synergy: 82, lastPlayed: "2024-01-05" },
  ]

  // Anomaly detection data
  const anomalies: AnomalyData[] = [
    {
      date: "2024-01-03",
      type: "performance_drop",
      severity: "medium",
      description: "Significant drop in accuracy (8% below average)",
      impact: -12,
    },
    {
      date: "2024-01-06",
      type: "unusual_playtime",
      severity: "low",
      description: "Extended gaming session (3 hours above average)",
      impact: 5,
    },
    {
      date: "2024-01-07",
      type: "streak",
      severity: "high",
      description: "7-game winning streak detected",
      impact: 25,
    },
  ]

  // Advanced analytics calculations
  const analytics = useMemo(() => {
    const totalGames = performanceData.reduce((sum, day) => sum + day.gamesPlayed, 0)
    const avgWinRate = performanceData.reduce((sum, day) => sum + day.winRate, 0) / performanceData.length
    const avgKDA = performanceData.reduce((sum, day) => sum + day.kda, 0) / performanceData.length
    const avgAccuracy = performanceData.reduce((sum, day) => sum + day.accuracy, 0) / performanceData.length
    const avgReactionTime = performanceData.reduce((sum, day) => sum + day.reactionTime, 0) / performanceData.length

    // Trend analysis
    const recentData = performanceData.slice(-3)
    const olderData = performanceData.slice(0, 3)
    const winRateTrend =
      recentData.reduce((sum, day) => sum + day.winRate, 0) / recentData.length -
      olderData.reduce((sum, day) => sum + day.winRate, 0) / olderData.length

    // Performance consistency
    const winRateVariance =
      performanceData.reduce((sum, day) => sum + Math.pow(day.winRate - avgWinRate, 2), 0) / performanceData.length
    const consistency = Math.max(0, 100 - Math.sqrt(winRateVariance))

    return {
      totalGames,
      avgWinRate: Math.round(avgWinRate),
      avgKDA: Math.round(avgKDA * 100) / 100,
      avgAccuracy: Math.round(avgAccuracy),
      avgReactionTime: Math.round(avgReactionTime),
      winRateTrend: Math.round(winRateTrend * 100) / 100,
      consistency: Math.round(consistency),
    }
  }, [performanceData])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-500/30 text-gray-400"
      case "rare":
        return "border-blue-500/30 text-blue-400"
      case "epic":
        return "border-purple-500/30 text-purple-400"
      case "legendary":
        return "border-yellow-500/30 text-yellow-400"
      default:
        return "border-gray-500/30 text-gray-400"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "high":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const overallStats = {
    totalPlaytime: gameStats.reduce((sum, game) => sum + game.playtime, 0),
    averageWinRate: Math.round(gameStats.reduce((sum, game) => sum + game.winRate, 0) / gameStats.length),
    totalMatches: gameStats.reduce((sum, game) => sum + game.recentMatches, 0),
    averageKDA: (gameStats.reduce((sum, game) => sum + game.kda, 0) / gameStats.length).toFixed(2),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Advanced Analytics</h2>
          <p className="text-muted-foreground">Comprehensive performance insights and trend analysis</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedGame} onValueChange={setSelectedGame}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="valorant">Valorant</SelectItem>
              <SelectItem value="cs2">CS2</SelectItem>
              <SelectItem value="overwatch">Overwatch 2</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="season">Season</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={analyticsView} onValueChange={setAnalyticsView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">
            <BarChartIcon className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUpIcon className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="patterns">
            <BrainIcon className="h-4 w-4 mr-2" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="maps">
            <MapIcon className="h-4 w-4 mr-2" />
            Maps
          </TabsTrigger>
          <TabsTrigger value="social">
            <UsersIcon className="h-4 w-4 mr-2" />
            Social
          </TabsTrigger>
          <TabsTrigger value="insights">
            <EyeIcon className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrophyIcon className="h-4 w-4 mr-2 text-blue-400" />
                  Win Rate Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{analytics.avgWinRate}%</div>
                <div className="flex items-center space-x-1 mt-1">
                  {analytics.winRateTrend > 0 ? (
                    <TrendingUpIcon className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDownIcon className="h-4 w-4 text-red-400" />
                  )}
                  <span className={`text-xs ${analytics.winRateTrend > 0 ? "text-green-400" : "text-red-400"}`}>
                    {analytics.winRateTrend > 0 ? "+" : ""}
                    {analytics.winRateTrend}% vs last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TargetIcon className="h-4 w-4 mr-2 text-green-400" />
                  Consistency Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{analytics.consistency}%</div>
                <p className="text-xs text-muted-foreground">Performance stability</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <ZapIcon className="h-4 w-4 mr-2 text-purple-400" />
                  Reaction Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{analytics.avgReactionTime}ms</div>
                <p className="text-xs text-muted-foreground">Average response time</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <ActivityIcon className="h-4 w-4 mr-2 text-orange-400" />
                  Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">{analytics.avgAccuracy}%</div>
                <p className="text-xs text-muted-foreground">Shot accuracy</p>
              </CardContent>
            </Card>
          </div>

          {/* Multi-metric Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Multi-dimensional performance analysis over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis yAxisId="left" stroke="#9CA3AF" />
                  <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="winRate"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    stroke="#3B82F6"
                    name="Win Rate %"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Accuracy %"
                  />
                  <Bar yAxisId="right" dataKey="gamesPlayed" fill="#8B5CF6" name="Games Played" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Anomaly Detection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangleIcon className="h-5 w-5 mr-2 text-yellow-400" />
                Anomaly Detection
              </CardTitle>
              <CardDescription>Unusual patterns and performance outliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {anomalies.map((anomaly, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${getSeverityColor(anomaly.severity)}`} />
                      <div>
                        <p className="font-medium">{anomaly.description}</p>
                        <p className="text-sm text-muted-foreground">{anomaly.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getSeverityColor(anomaly.severity)}>
                      {anomaly.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Correlation Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Correlation</CardTitle>
                <CardDescription>Relationship between different metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterPlot data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="accuracy" stroke="#9CA3AF" name="Accuracy" />
                    <YAxis dataKey="winRate" stroke="#9CA3AF" name="Win Rate" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                    />
                    <Scatter dataKey="winRate" fill="#3B82F6" />
                  </ScatterPlot>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Radar</CardTitle>
                <CardDescription>Multi-dimensional skill assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart
                    data={[
                      { skill: "Aim", value: analytics.avgAccuracy, fullMark: 100 },
                      { skill: "Game Sense", value: 78, fullMark: 100 },
                      { skill: "Positioning", value: 85, fullMark: 100 },
                      { skill: "Communication", value: 72, fullMark: 100 },
                      { skill: "Strategy", value: 88, fullMark: 100 },
                      { skill: "Consistency", value: analytics.consistency, fullMark: 100 },
                    ]}
                  >
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: "#9CA3AF" }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9CA3AF" }} />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
              <CardDescription>Detailed analysis of key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Aim Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Headshot Rate</span>
                      <span className="text-sm font-medium">24%</span>
                    </div>
                    <Progress value={24} className="h-2" />
                    <div className="flex justify-between">
                      <span className="text-sm">First Shot Accuracy</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Game Sense</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Clutch Success</span>
                      <span className="text-sm font-medium">32%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                    <div className="flex justify-between">
                      <span className="text-sm">Economy Management</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Team Play</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Assist Rate</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                    <div className="flex justify-between">
                      <span className="text-sm">Trade Success</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          {/* Performance Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Heatmap</CardTitle>
              <CardDescription>When you perform best throughout the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-8 gap-1 text-xs">
                <div></div>
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="text-center p-1">
                    {i}
                  </div>
                ))}
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="flex items-center">
                    <div className="w-8 text-right pr-2">{day}</div>
                    {Array.from({ length: 24 }, (_, hour) => {
                      const data = heatmapData.find((d) => d.day === day && d.hour === hour)
                      const performance = data?.performance || 0
                      const opacity = performance / 100
                      return (
                        <div
                          key={hour}
                          className="w-4 h-4 rounded-sm border border-border"
                          style={{
                            backgroundColor: `rgba(59, 130, 246, ${opacity})`,
                          }}
                          title={`${day} ${hour}:00 - ${performance}% performance`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                <span>Lower performance</span>
                <div className="flex space-x-1">
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity) => (
                    <div
                      key={opacity}
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: `rgba(59, 130, 246, ${opacity})` }}
                    />
                  ))}
                </div>
                <span>Higher performance</span>
              </div>
            </CardContent>
          </Card>

          {/* Trend Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Patterns</CardTitle>
                <CardDescription>Performance trends by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={[
                      { day: "Mon", performance: 72, games: 8 },
                      { day: "Tue", performance: 78, games: 12 },
                      { day: "Wed", performance: 75, games: 10 },
                      { day: "Thu", performance: 82, games: 15 },
                      { day: "Fri", performance: 85, games: 18 },
                      { day: "Sat", performance: 88, games: 22 },
                      { day: "Sun", performance: 80, games: 16 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#3B82F6" name="Performance %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Length Impact</CardTitle>
                <CardDescription>How session duration affects performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={[
                      { duration: "0-1h", performance: 85, fatigue: 10 },
                      { duration: "1-2h", performance: 88, fatigue: 15 },
                      { duration: "2-3h", performance: 92, fatigue: 25 },
                      { duration: "3-4h", performance: 87, fatigue: 40 },
                      { duration: "4-5h", performance: 78, fatigue: 60 },
                      { duration: "5h+", performance: 65, fatigue: 85 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="duration" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Line type="monotone" dataKey="performance" stroke="#10B981" name="Performance" />
                    <Line type="monotone" dataKey="fatigue" stroke="#EF4444" name="Fatigue" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maps" className="space-y-6">
          {/* Map Performance Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mapPerformance.map((map, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{map.map}</CardTitle>
                    <Badge variant={map.winRate > 75 ? "default" : map.winRate > 60 ? "secondary" : "destructive"}>
                      {map.winRate}% WR
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Avg K/D/A</div>
                      <div className="text-lg font-semibold">{map.avgKDA}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Times Played</div>
                      <div className="text-lg font-semibold">{map.timesPlayed}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Win Rate</span>
                      <span>{map.winRate}%</span>
                    </div>
                    <Progress value={map.winRate} className="h-2" />
                  </div>
                  <div className="text-xs text-muted-foreground">Last played: {map.lastPlayed}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Map Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions based on your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUpIcon className="h-4 w-4 text-green-400" />
                    <span className="font-medium text-green-400">Recommended</span>
                  </div>
                  <p className="text-sm">
                    Focus on <strong>Haven</strong> - your highest win rate map (85%). Consider queuing for this map
                    during peak hours.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangleIcon className="h-4 w-4 text-yellow-400" />
                    <span className="font-medium text-yellow-400">Needs Improvement</span>
                  </div>
                  <p className="text-sm">
                    Practice <strong>Split</strong> - your lowest win rate map (68%). Focus on learning common angles
                    and rotations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          {/* Player Synergy Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Player Synergy</CardTitle>
              <CardDescription>Your performance with different teammates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {playerInteractions.map((player, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {player.playerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{player.playerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {player.gamesPlayed} games • {player.winRate}% win rate
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-400">{player.synergy}%</div>
                      <div className="text-xs text-muted-foreground">Synergy</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Analysis</CardTitle>
              <CardDescription>How different team compositions affect your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { composition: "Solo Queue", winRate: 68, games: 45 },
                    { composition: "Duo Queue", winRate: 75, games: 32 },
                    { composition: "Trio Queue", winRate: 82, games: 28 },
                    { composition: "5-Stack", winRate: 88, games: 15 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="composition" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Bar dataKey="winRate" fill="#3B82F6" name="Win Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* AI-Generated Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BrainIcon className="h-5 w-5 mr-2 text-purple-400" />
                AI Performance Insights
              </CardTitle>
              <CardDescription>Machine learning-powered analysis of your gameplay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h4 className="font-semibold text-blue-400 mb-2">Peak Performance Window</h4>
                  <p className="text-sm">
                    Your optimal performance occurs between 7-10 PM on weekends, with a 15% higher win rate during these
                    hours. Consider scheduling ranked games during this time.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <h4 className="font-semibold text-green-400 mb-2">Improvement Trend</h4>
                  <p className="text-sm">
                    Your accuracy has improved by 12% over the last month, particularly on long-range engagements. This
                    correlates with your increased practice time in aim trainers.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <h4 className="font-semibold text-purple-400 mb-2">Strategic Recommendation</h4>
                  <p className="text-sm">
                    Your K/D ratio is 23% higher when playing with ProGamer123. Consider duo queuing more often to
                    maximize your ranking potential.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <h4 className="font-semibold text-orange-400 mb-2">Fatigue Pattern</h4>
                  <p className="text-sm">
                    Performance drops by 18% after 3+ hour sessions. Consider taking breaks every 2 hours to maintain
                    peak performance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actionable Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Actionable Recommendations</CardTitle>
              <CardDescription>Specific steps to improve your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Optimize Your Schedule</h4>
                    <p className="text-sm text-muted-foreground">
                      Play ranked matches between 7-10 PM for 15% better performance
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Focus on Split Map</h4>
                    <p className="text-sm text-muted-foreground">
                      Practice Split rotations and common angles to improve your 68% win rate
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Duo Queue Strategy</h4>
                    <p className="text-sm text-muted-foreground">
                      Team up with ProGamer123 more often for improved synergy and win rate
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Session Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Take 15-minute breaks every 2 hours to prevent performance degradation
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Prediction */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Prediction</CardTitle>
              <CardDescription>AI forecast of your next rank milestone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Current Rank</span>
                  <Badge>Diamond III</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Predicted Next Rank</span>
                  <Badge variant="outline">Immortal I</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Immortal</span>
                    <span>73%</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on current trends, you're likely to reach Immortal I in approximately 2-3 weeks with consistent
                  play.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
