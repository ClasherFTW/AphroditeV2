"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { advancedStatisticsService, type AdvancedPlayerStats, type MatchAnalysis } from "@/lib/advanced-statistics"
import {
  BarChart3Icon,
  TrendingUpIcon,
  TargetIcon,
  ShieldIcon,
  SwordIcon,
  TrophyIcon,
  MapIcon,
  AwardIcon,
  ActivityIcon,
  BrainIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
} from "lucide-react"

export default function AdvancedStatisticsDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")
  const [selectedGame, setSelectedGame] = useState("valorant")
  const [playerStats, setPlayerStats] = useState<AdvancedPlayerStats | null>(null)
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStatistics()
  }, [selectedTimeframe, selectedGame])

  const loadStatistics = async () => {
    setLoading(true)
    try {
      // Simulate API calls
      const stats = advancedStatisticsService.generatePlayerStats({})
      const analysis = advancedStatisticsService.generateMatchAnalysis({})

      setPlayerStats(stats)
      setMatchAnalysis(analysis)
    } catch (error) {
      console.error("Failed to load statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatTrend = (current: number, previous: number) => {
    if (current > previous) return { icon: ArrowUpIcon, color: "text-green-400", direction: "up" }
    if (current < previous) return { icon: ArrowDownIcon, color: "text-red-400", direction: "down" }
    return { icon: MinusIcon, color: "text-gray-400", direction: "stable" }
  }

  const getPerformanceColor = (value: number, thresholds: { good: number; average: number }) => {
    if (value >= thresholds.good) return "text-green-400"
    if (value >= thresholds.average) return "text-yellow-400"
    return "text-red-400"
  }

  const radarData = playerStats
    ? [
        { stat: "Aim", value: playerStats.headshot_percentage, fullMark: 100 },
        { stat: "Game Sense", value: playerStats.round_impact_rating, fullMark: 100 },
        { stat: "Positioning", value: playerStats.survival_rate, fullMark: 100 },
        { stat: "Teamwork", value: playerStats.trade_kill_percentage, fullMark: 100 },
        { stat: "Clutch", value: playerStats.clutch_success_rate, fullMark: 100 },
        { stat: "Economy", value: playerStats.economy_rating, fullMark: 100 },
      ]
    : []

  const weaponData =
    playerStats?.weapon_stats.map((weapon) => ({
      name: weapon.weapon_name,
      kills: weapon.kills,
      accuracy: weapon.accuracy,
      headshot_rate: weapon.headshot_rate,
    })) || []

  const performanceData =
    playerStats?.performance_by_round.slice(0, 12).map((round, index) => ({
      round: index + 1,
      damage: round.damage_dealt,
      kills: round.kills,
      survived: round.survived ? 1 : 0,
    })) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ActivityIcon className="h-8 w-8 animate-spin text-blue-400" />
        <span className="ml-2 text-white">Loading advanced statistics...</span>
      </div>
    )
  }

  if (!playerStats || !matchAnalysis) {
    return (
      <div className="text-center py-12">
        <AlertTriangleIcon className="h-16 w-16 text-white/40 mx-auto mb-4" />
        <h3 className="text-xl text-white mb-2">No Statistics Available</h3>
        <p className="text-white/60">Play some matches to see your advanced statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3Icon className="h-8 w-8 text-blue-400" />
          <div>
            <h2 className="text-3xl font-bold text-white">Advanced Statistics</h2>
            <p className="text-white/60">In-depth performance analysis with tactical shooter metrics</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedGame} onValueChange={setSelectedGame}>
            <SelectTrigger className="w-32 bg-black/20 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="valorant">Valorant</SelectItem>
              <SelectItem value="cs2">CS2</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32 bg-black/20 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-black/20 backdrop-blur-sm">
          <TabsTrigger value="overview">
            <TrophyIcon className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tactical">
            <TargetIcon className="h-4 w-4 mr-2" />
            Tactical Stats
          </TabsTrigger>
          <TabsTrigger value="weapons">
            <SwordIcon className="h-4 w-4 mr-2" />
            Weapon Analysis
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUpIcon className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="match">
            <MapIcon className="h-4 w-4 mr-2" />
            Match Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm font-medium flex items-center">
                  <TargetIcon className="h-4 w-4 mr-2 text-blue-400" />
                  ADR (Avg Damage/Round)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-white">{playerStats.adr.toFixed(1)}</div>
                  <div className="flex items-center">
                    <ArrowUpIcon className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-sm">+12.3</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={(playerStats.adr / 200) * 100} className="h-2" />
                  <p className="text-xs text-white/60 mt-1">
                    {playerStats.adr >= 150 ? "Excellent" : playerStats.adr >= 120 ? "Good" : "Needs Improvement"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm font-medium flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-400" />
                  KAST %
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-white">{playerStats.kast.toFixed(1)}%</div>
                  <div className="flex items-center">
                    <ArrowUpIcon className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-sm">+5.2%</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={playerStats.kast} className="h-2" />
                  <p className="text-xs text-white/60 mt-1">Kill, Assist, Survive, Trade</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm font-medium flex items-center">
                  <ShieldIcon className="h-4 w-4 mr-2 text-purple-400" />
                  KOST %
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-white">{playerStats.kost.toFixed(1)}%</div>
                  <div className="flex items-center">
                    <ArrowDownIcon className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 text-sm">-2.1%</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={playerStats.kost} className="h-2" />
                  <p className="text-xs text-white/60 mt-1">Kill, Objective, Survive, Trade</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm font-medium flex items-center">
                  <BrainIcon className="h-4 w-4 mr-2 text-yellow-400" />
                  Round Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-white">{playerStats.round_impact_rating.toFixed(1)}</div>
                  <div className="flex items-center">
                    <ArrowUpIcon className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-sm">+8.7</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={playerStats.round_impact_rating} className="h-2" />
                  <p className="text-xs text-white/60 mt-1">Overall round contribution</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Radar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Performance Radar</CardTitle>
                <CardDescription className="text-white/60">Multi-dimensional skill analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Performance",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="stat" className="text-white text-xs" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-white/60 text-xs" />
                      <Radar
                        name="Performance"
                        dataKey="value"
                        stroke="var(--color-value)"
                        fill="var(--color-value)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Performance Trend</CardTitle>
                <CardDescription className="text-white/60">
                  Damage and kills per round over last 12 rounds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    damage: {
                      label: "Damage",
                      color: "hsl(var(--chart-1))",
                    },
                    kills: {
                      label: "Kills",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="round" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="damage" stroke="var(--color-damage)" strokeWidth={2} />
                      <Line type="monotone" dataKey="kills" stroke="var(--color-kills)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-sm">Aim & Precision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Headshot %</span>
                  <span
                    className={`font-semibold ${getPerformanceColor(playerStats.headshot_percentage, { good: 60, average: 40 })}`}
                  >
                    {playerStats.headshot_percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">First Kill %</span>
                  <span
                    className={`font-semibold ${getPerformanceColor(playerStats.first_kill_percentage, { good: 25, average: 15 })}`}
                  >
                    {playerStats.first_kill_percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Multi-kills</span>
                  <span className="text-white font-semibold">{playerStats.multi_kill_rounds}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-sm">Game Sense</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Survival Rate</span>
                  <span
                    className={`font-semibold ${getPerformanceColor(playerStats.survival_rate, { good: 60, average: 45 })}`}
                  >
                    {playerStats.survival_rate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Trade Kill %</span>
                  <span
                    className={`font-semibold ${getPerformanceColor(playerStats.trade_kill_percentage, { good: 40, average: 25 })}`}
                  >
                    {playerStats.trade_kill_percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Clutch Success</span>
                  <span
                    className={`font-semibold ${getPerformanceColor(playerStats.clutch_success_rate, { good: 70, average: 50 })}`}
                  >
                    {playerStats.clutch_success_rate.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-sm">Utility & Economy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Economy Rating</span>
                  <span
                    className={`font-semibold ${getPerformanceColor(playerStats.economy_rating, { good: 80, average: 60 })}`}
                  >
                    {playerStats.economy_rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Utility Damage</span>
                  <span className="text-white font-semibold">{playerStats.utility_damage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Flash Assists</span>
                  <span className="text-white font-semibold">{playerStats.flash_assists}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tactical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Site Performance */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Site Performance</CardTitle>
                <CardDescription className="text-white/60">Attack vs Defense success rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Attack Success</span>
                    <span className="text-white font-semibold">{playerStats.site_success_rate.attack.toFixed(1)}%</span>
                  </div>
                  <Progress value={playerStats.site_success_rate.attack} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Defense Success</span>
                    <span className="text-white font-semibold">
                      {playerStats.site_success_rate.defense.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={playerStats.site_success_rate.defense} className="h-2" />
                </div>
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-white/80">
                    {playerStats.site_success_rate.defense > playerStats.site_success_rate.attack
                      ? "You perform better on defense. Consider working on attack strategies."
                      : "Strong attacking performance! Focus on maintaining defensive consistency."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Half Performance Comparison */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Half Performance</CardTitle>
                <CardDescription className="text-white/60">First half vs second half statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {playerStats.performance_by_half.map((half, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold capitalize">{half.half} Half</h4>
                        <Badge variant="outline" className="text-xs">
                          {half.side.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-white/60">Rounds</div>
                          <div className="text-white font-semibold">
                            {half.rounds_won}-{half.rounds_lost}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/60">K/D</div>
                          <div className="text-white font-semibold">
                            {half.kills}/{half.deaths}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/60">ADR</div>
                          <div className="text-white font-semibold">{half.adr.toFixed(1)}</div>
                        </div>
                        <div>
                          <div className="text-white/60">KAST</div>
                          <div className="text-white font-semibold">{half.kast.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Tactical Metrics */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Advanced Tactical Metrics</CardTitle>
              <CardDescription className="text-white/60">
                Detailed breakdown of tactical performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{playerStats.kast.toFixed(1)}%</div>
                  <div className="text-sm text-white/60 mb-2">KAST</div>
                  <div className="text-xs text-white/40">Kill, Assist, Survive, Trade</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{playerStats.kost.toFixed(1)}%</div>
                  <div className="text-sm text-white/60 mb-2">KOST</div>
                  <div className="text-xs text-white/40">Kill, Objective, Survive, Trade</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">{playerStats.adr.toFixed(0)}</div>
                  <div className="text-sm text-white/60 mb-2">ADR</div>
                  <div className="text-xs text-white/40">Average Damage per Round</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {playerStats.round_impact_rating.toFixed(1)}
                  </div>
                  <div className="text-sm text-white/60 mb-2">RIR</div>
                  <div className="text-xs text-white/40">Round Impact Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weapons" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Weapon Performance Analysis</CardTitle>
              <CardDescription className="text-white/60">
                Detailed breakdown of weapon usage and effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  kills: {
                    label: "Kills",
                    color: "hsl(var(--chart-1))",
                  },
                  accuracy: {
                    label: "Accuracy",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-64 mb-6"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weaponData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="kills" fill="var(--color-kills)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="space-y-4">
                {playerStats.weapon_stats.map((weapon, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{weapon.weapon_name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {weapon.kills} kills
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-white/60">Accuracy</div>
                        <div
                          className={`font-semibold ${getPerformanceColor(weapon.accuracy, { good: 75, average: 60 })}`}
                        >
                          {weapon.accuracy.toFixed(1)}%
                        </div>
                        <Progress value={weapon.accuracy} className="h-1 mt-1" />
                      </div>
                      <div>
                        <div className="text-white/60">Headshot Rate</div>
                        <div
                          className={`font-semibold ${getPerformanceColor(weapon.headshot_rate, { good: 65, average: 45 })}`}
                        >
                          {weapon.headshot_rate.toFixed(1)}%
                        </div>
                        <Progress value={weapon.headshot_rate} className="h-1 mt-1" />
                      </div>
                      <div>
                        <div className="text-white/60">Shots Hit/Fired</div>
                        <div className="text-white font-semibold">
                          {weapon.shots_hit}/{weapon.shots_fired}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60">Damage/Shot</div>
                        <div className="text-white font-semibold">{weapon.damage_per_shot.toFixed(1)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Round-by-Round Performance</CardTitle>
              <CardDescription className="text-white/60">
                Detailed analysis of your performance across all rounds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {playerStats.performance_by_round.map((round, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-white font-semibold w-12">R{round.round_number}</div>
                        <div className="flex items-center space-x-2">
                          {round.survived ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 text-red-400" />
                          )}
                          <span className="text-white text-sm">
                            {round.kills}K {round.deaths}D
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-white text-sm">{round.damage_dealt} DMG</div>
                          <div className="text-white/60 text-xs">{round.damage_received} taken</div>
                        </div>
                        <div className="flex space-x-1">
                          {round.utility_used.map((util, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {util}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="match" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Latest Match Analysis</CardTitle>
              <CardDescription className="text-white/60">
                {matchAnalysis.teams.team1.team_name} vs {matchAnalysis.teams.team2.team_name} on {matchAnalysis.map}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Match Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-1">
                    {matchAnalysis.final_score.team1}-{matchAnalysis.final_score.team2}
                  </div>
                  <div className="text-sm text-white/60">Final Score</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">{matchAnalysis.match_rating}</div>
                  <div className="text-sm text-white/60">Match Rating</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {Math.floor(matchAnalysis.duration / 60)}m
                  </div>
                  <div className="text-sm text-white/60">Duration</div>
                </div>
              </div>

              {/* Key Moments */}
              <div>
                <h3 className="text-white font-semibold mb-4">Key Moments</h3>
                <div className="space-y-3">
                  {matchAnalysis.key_moments.map((moment, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="text-xs">
                          R{moment.round}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{moment.description}</div>
                        <div className="text-white/60 text-xs">by {moment.player}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-semibold">{moment.impact_score}</div>
                        <div className="text-white/60 text-xs">Impact</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MVP */}
              <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                <div className="flex items-center space-x-3">
                  <AwardIcon className="h-6 w-6 text-yellow-400" />
                  <div>
                    <div className="text-white font-semibold">Match MVP</div>
                    <div className="text-yellow-400 text-lg font-bold">{matchAnalysis.mvp}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
