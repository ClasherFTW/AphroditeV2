"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUpIcon, TrendingDownIcon, TargetIcon, ClockIcon, AwardIcon, GamepadIcon, ZapIcon } from "lucide-react"

export default function PerformanceCharts() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedGame, setSelectedGame] = useState("all")

  // Mock data for different chart types
  const performanceData = [
    { date: "Mon", winRate: 75, kda: 1.8, ping: 23, fps: 144 },
    { date: "Tue", winRate: 82, kda: 2.1, ping: 25, fps: 142 },
    { date: "Wed", winRate: 68, kda: 1.6, ping: 28, fps: 138 },
    { date: "Thu", winRate: 91, kda: 2.4, ping: 22, fps: 145 },
    { date: "Fri", winRate: 77, kda: 1.9, ping: 24, fps: 143 },
    { date: "Sat", winRate: 85, kda: 2.2, ping: 21, fps: 146 },
    { date: "Sun", winRate: 79, kda: 2.0, ping: 26, fps: 141 },
  ]

  const gameDistribution = [
    { name: "Valorant", value: 45, color: "#ff6b6b" },
    { name: "CS2", value: 30, color: "#4ecdc4" },
    { name: "Overwatch 2", value: 15, color: "#45b7d1" },
    { name: "Apex Legends", value: 10, color: "#f9ca24" },
  ]

  const skillRadarData = [
    { skill: "Aim", value: 85, fullMark: 100 },
    { skill: "Game Sense", value: 78, fullMark: 100 },
    { skill: "Positioning", value: 92, fullMark: 100 },
    { skill: "Communication", value: 74, fullMark: 100 },
    { skill: "Strategy", value: 88, fullMark: 100 },
    { skill: "Reaction Time", value: 81, fullMark: 100 },
  ]

  const rankProgressData = [
    { month: "Jan", rank: 1200, target: 1500 },
    { month: "Feb", rank: 1350, target: 1500 },
    { month: "Mar", rank: 1280, target: 1500 },
    { month: "Apr", rank: 1420, target: 1500 },
    { month: "May", rank: 1480, target: 1500 },
    { month: "Jun", rank: 1520, target: 1500 },
  ]

  const sessionData = [
    { time: "00:00", performance: 65, players: 1200 },
    { time: "04:00", performance: 72, players: 800 },
    { time: "08:00", performance: 85, players: 1500 },
    { time: "12:00", performance: 91, players: 2200 },
    { time: "16:00", performance: 88, players: 2800 },
    { time: "20:00", performance: 94, players: 3200 },
  ]

  const achievementProgress = [
    { name: "Headshot Master", current: 847, target: 1000, category: "Skill" },
    { name: "Win Streak", current: 7, target: 10, category: "Performance" },
    { name: "Team Player", current: 342, target: 500, category: "Social" },
    { name: "Rank Climber", current: 1520, target: 1800, category: "Progression" },
  ]

  const getPerformanceColor = (value: number) => {
    if (value >= 80) return "text-green-400"
    if (value >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUpIcon className="h-4 w-4 text-green-400" />
    if (current < previous) return <TrendingDownIcon className="h-4 w-4 text-red-400" />
    return <div className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Performance Analytics</h2>
          <p className="text-white/60">Comprehensive gaming performance insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
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
          <Select value={selectedGame} onValueChange={setSelectedGame}>
            <SelectTrigger className="w-40 bg-black/20 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              <SelectItem value="valorant">Valorant</SelectItem>
              <SelectItem value="cs2">CS2</SelectItem>
              <SelectItem value="overwatch">Overwatch 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-black/20 backdrop-blur-sm">
          <TabsTrigger value="overview">
            <TargetIcon className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUpIcon className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="skills">
            <AwardIcon className="h-4 w-4 mr-2" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <ClockIcon className="h-4 w-4 mr-2" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <GamepadIcon className="h-4 w-4 mr-2" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Win Rate</p>
                    <p className="text-2xl font-bold text-green-400">78%</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getTrendIcon(78, 75)}
                      <span className="text-xs text-green-400">+3% vs last week</span>
                    </div>
                  </div>
                  <TargetIcon className="h-8 w-8 text-green-400/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Avg K/D/A</p>
                    <p className="text-2xl font-bold text-blue-400">2.1</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getTrendIcon(2.1, 1.9)}
                      <span className="text-xs text-blue-400">+0.2 vs last week</span>
                    </div>
                  </div>
                  <ZapIcon className="h-8 w-8 text-blue-400/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Avg Ping</p>
                    <p className="text-2xl font-bold text-yellow-400">24ms</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getTrendIcon(24, 28)}
                      <span className="text-xs text-yellow-400">-4ms vs last week</span>
                    </div>
                  </div>
                  <ClockIcon className="h-8 w-8 text-yellow-400/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Hours Played</p>
                    <p className="text-2xl font-bold text-purple-400">42h</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getTrendIcon(42, 38)}
                      <span className="text-xs text-purple-400">+4h vs last week</span>
                    </div>
                  </div>
                  <GamepadIcon className="h-8 w-8 text-purple-400/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Trend */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Performance Trend</CardTitle>
              <CardDescription className="text-white/60">Win rate and K/D/A over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="winRate" stroke="#10B981" strokeWidth={2} name="Win Rate %" />
                  <Line type="monotone" dataKey="kda" stroke="#3B82F6" strokeWidth={2} name="K/D/A" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Game Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Game Distribution</CardTitle>
                <CardDescription className="text-white/60">Time spent in different games</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={gameDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {gameDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Daily Performance</CardTitle>
                <CardDescription className="text-white/60">Performance by time of day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                    />
                    <Area type="monotone" dataKey="performance" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Technical Performance</CardTitle>
                <CardDescription className="text-white/60">Ping and FPS over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="ping" stroke="#F59E0B" strokeWidth={2} name="Ping (ms)" />
                    <Line type="monotone" dataKey="fps" stroke="#EF4444" strokeWidth={2} name="FPS" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Rank Progress</CardTitle>
                <CardDescription className="text-white/60">Ranking progression over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={rankProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                    />
                    <Area type="monotone" dataKey="rank" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Line type="monotone" dataKey="target" stroke="#6B7280" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Skill Assessment</CardTitle>
              <CardDescription className="text-white/60">Your gaming skills breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={skillRadarData}>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Session Analysis</CardTitle>
              <CardDescription className="text-white/60">
                Performance and player activity throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="performance" fill="#10B981" name="Performance Score" />
                  <Bar dataKey="players" fill="#3B82F6" name="Active Players" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="space-y-4">
            {achievementProgress.map((achievement, index) => (
              <Card key={index} className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{achievement.name}</h3>
                      <Badge variant="outline" className="border-blue-400 text-blue-300 mt-1">
                        {achievement.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {achievement.current.toLocaleString()} / {achievement.target.toLocaleString()}
                      </div>
                      <div className="text-sm text-white/60">
                        {Math.round((achievement.current / achievement.target) * 100)}% Complete
                      </div>
                    </div>
                  </div>
                  <Progress value={(achievement.current / achievement.target) * 100} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
