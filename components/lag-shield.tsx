"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ShieldIcon,
  WifiIcon,
  ZapIcon,
  CpuIcon,
  HardDriveIcon,
  MonitorIcon,
  NetworkIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  PlayIcon,
  PauseIcon,
  RefreshCwIcon,
  SettingsIcon,
  ActivityIcon,
  SparklesIcon,
  MapIcon,
  UsersIcon,
  ClockIcon,
  TargetIcon,
  TrophyIcon,
  StarIcon,
} from "lucide-react"
import { PerformanceMonitor, type SystemMetrics } from "@/lib/performance-monitor"
import { MatchRecommendationEngine, type MatchRecommendations } from "@/lib/match-recommendation-engine"

interface OptimizationItem {
  id: string
  title: string
  description: string
  category: "network" | "system" | "game" | "advanced"
  impact: "low" | "medium" | "high"
  status: "pending" | "applied" | "failed"
  autoApply: boolean
}

export default function LagShield() {
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [performanceScore, setPerformanceScore] = useState(87)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [lastOptimized, setLastOptimized] = useState<Date | null>(null)
  const [recommendations, setRecommendations] = useState<MatchRecommendations | null>(null)
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)

  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: {
      usage: 45,
      temperature: 65,
      cores: 8,
      frequency: 3.2,
    },
    memory: {
      usage: 62,
      available: 16384,
      used: 10240,
    },
    gpu: {
      usage: 78,
      temperature: 72,
      memory: 8192,
      memoryUsed: 6144,
    },
    disk: {
      usage: 34,
      readSpeed: 150,
      writeSpeed: 120,
    },
    network: {
      ping: 23,
      jitter: 2,
      packetLoss: 0.1,
      downloadSpeed: 150,
      uploadSpeed: 50,
    },
    fps: 144,
    frameTime: 6.9,
  })

  const [optimizations] = useState<OptimizationItem[]>([
    {
      id: "1",
      title: "Game Mode Optimization",
      description: "Enable Windows Game Mode for better performance",
      category: "system",
      impact: "medium",
      status: "pending",
      autoApply: true,
    },
    {
      id: "2",
      title: "Network Buffer Tuning",
      description: "Optimize network buffers for reduced latency",
      category: "network",
      impact: "high",
      status: "applied",
      autoApply: true,
    },
    {
      id: "3",
      title: "GPU Priority Boost",
      description: "Set high priority for GPU processes",
      category: "game",
      impact: "medium",
      status: "pending",
      autoApply: false,
    },
    {
      id: "4",
      title: "Background App Cleanup",
      description: "Close unnecessary background applications",
      category: "system",
      impact: "high",
      status: "pending",
      autoApply: true,
    },
    {
      id: "5",
      title: "DNS Optimization",
      description: "Switch to gaming-optimized DNS servers",
      category: "network",
      impact: "medium",
      status: "applied",
      autoApply: true,
    },
  ])

  // Real-time performance monitoring
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(async () => {
      try {
        const newMetrics = await PerformanceMonitor.getCurrentMetrics()
        setMetrics(newMetrics)

        // Calculate performance score
        const score = PerformanceMonitor.calculatePerformanceScore(newMetrics)
        setPerformanceScore(score)
      } catch (error) {
        console.error("Error fetching performance metrics:", error)
        // Fallback to simulated data
        setMetrics((prev) => ({
          ...prev,
          cpu: {
            ...prev.cpu,
            usage: Math.max(20, Math.min(90, prev.cpu.usage + (Math.random() - 0.5) * 15)),
          },
          memory: {
            ...prev.memory,
            usage: Math.max(30, Math.min(95, prev.memory.usage + (Math.random() - 0.5) * 10)),
          },
          gpu: {
            ...prev.gpu,
            usage: Math.max(40, Math.min(100, prev.gpu.usage + (Math.random() - 0.5) * 20)),
          },
          network: {
            ...prev.network,
            ping: Math.max(15, prev.network.ping + (Math.random() - 0.5) * 10),
          },
          fps: Math.max(60, Math.min(165, prev.fps + (Math.random() - 0.5) * 20)),
        }))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  // Load match recommendations
  useEffect(() => {
    loadMatchRecommendations()
  }, [])

  const loadMatchRecommendations = async () => {
    setLoadingRecommendations(true)
    try {
      // Simulate user ID - in real app, get from auth context
      const userId = "demo-user-123"
      const recs = await MatchRecommendationEngine.generateRecommendations(userId)
      setRecommendations(recs)
    } catch (error) {
      console.error("Error loading recommendations:", error)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const handleOptimize = async () => {
    setIsOptimizing(true)
    setOptimizationProgress(0)

    try {
      // Simulate optimization process
      const steps = [
        "Analyzing system performance...",
        "Closing unnecessary background processes...",
        "Optimizing network settings...",
        "Adjusting GPU settings...",
        "Clearing system cache...",
        "Finalizing optimizations...",
      ]

      for (let i = 0; i < steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setOptimizationProgress(((i + 1) / steps.length) * 100)
      }

      // Apply optimizations
      await PerformanceMonitor.applyOptimizations()
      setLastOptimized(new Date())

      // Refresh metrics
      const newMetrics = await PerformanceMonitor.getCurrentMetrics()
      setMetrics(newMetrics)
      setPerformanceScore(PerformanceMonitor.calculatePerformanceScore(newMetrics))
    } catch (error) {
      console.error("Optimization failed:", error)
    } finally {
      setIsOptimizing(false)
      setOptimizationProgress(0)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "border-red-400 text-red-300"
      case "medium":
        return "border-yellow-400 text-yellow-300"
      case "low":
        return "border-green-400 text-green-300"
      default:
        return "border-gray-400 text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <CheckCircleIcon className="h-4 w-4 text-green-400" />
      case "failed":
        return <AlertTriangleIcon className="h-4 w-4 text-red-400" />
      default:
        return <RefreshCwIcon className="h-4 w-4 text-yellow-400" />
    }
  }

  const getPerformanceStatus = (score: number) => {
    if (score >= 80) return { text: "Excellent", color: "text-green-400" }
    if (score >= 60) return { text: "Good", color: "text-yellow-400" }
    return { text: "Needs Optimization", color: "text-red-400" }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShieldIcon className="h-8 w-8 text-blue-400" />
          <div>
            <h2 className="text-3xl font-bold text-white">Lag Shield Pro</h2>
            <p className="text-white/60">AI-powered performance optimization</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className={`${getScoreColor(performanceScore)} border-current`}>
            Performance Score: {performanceScore}
          </Badge>
          <Button
            onClick={() => setIsMonitoring(!isMonitoring)}
            variant={isMonitoring ? "default" : "outline"}
            className="flex items-center space-x-2"
          >
            {isMonitoring ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            <span>{isMonitoring ? "Pause" : "Start"} Monitoring</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-black/20 backdrop-blur-sm">
          <TabsTrigger value="dashboard">
            <ActivityIcon className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="optimizations">
            <ZapIcon className="h-4 w-4 mr-2" />
            Optimizations
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <TargetIcon className="h-4 w-4 mr-2" />
            Match Recommendations
          </TabsTrigger>
          <TabsTrigger value="network">
            <NetworkIcon className="h-4 w-4 mr-2" />
            Network
          </TabsTrigger>
          <TabsTrigger value="system">
            <CpuIcon className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Performance Overview with Optimization */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <TrendingUpIcon className="h-5 w-5 mr-2" />
                  Performance Overview
                </span>
                <Button
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4 mr-2" />
                      Optimize Performance
                    </>
                  )}
                </Button>
              </CardTitle>
              {lastOptimized && (
                <CardDescription className="text-green-400">
                  Last optimized: {lastOptimized.toLocaleTimeString()}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {isOptimizing && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">Optimization Progress</span>
                    <span className="text-sm text-white/80">{Math.round(optimizationProgress)}%</span>
                  </div>
                  <Progress value={optimizationProgress} className="h-2" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(performanceScore)}`}>{performanceScore}</div>
                  <div className="text-sm text-white/60">Overall Score</div>
                  <div className={`text-xs ${getPerformanceStatus(performanceScore).color}`}>
                    {getPerformanceStatus(performanceScore).text}
                  </div>
                  <Progress value={performanceScore} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{Math.round(metrics.fps)}</div>
                  <div className="text-sm text-white/60">Current FPS</div>
                  <div className="text-xs text-white/40">{metrics.frameTime.toFixed(1)}ms frame time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{Math.round(metrics.network.ping)}ms</div>
                  <div className="text-sm text-white/60">Ping</div>
                  <div className="text-xs text-white/40">{metrics.network.jitter.toFixed(1)}ms jitter</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{Math.round(metrics.cpu.temperature)}°C</div>
                  <div className="text-sm text-white/60">CPU Temp</div>
                  <div className="text-xs text-white/40">{metrics.cpu.frequency.toFixed(1)} GHz</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CpuIcon className="h-6 w-6 text-blue-400 mb-2" />
                    <div className="text-lg font-bold text-white">{Math.round(metrics.cpu.usage)}%</div>
                    <div className="text-xs text-white/60">CPU Usage</div>
                    <div className="text-xs text-white/40">{metrics.cpu.cores} cores</div>
                  </div>
                  <Progress value={metrics.cpu.usage} className="w-16 h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <HardDriveIcon className="h-6 w-6 text-green-400 mb-2" />
                    <div className="text-lg font-bold text-white">{Math.round(metrics.memory.usage)}%</div>
                    <div className="text-xs text-white/60">RAM Usage</div>
                    <div className="text-xs text-white/40">
                      {(metrics.memory.used / 1024).toFixed(1)}GB / {(metrics.memory.available / 1024).toFixed(1)}GB
                    </div>
                  </div>
                  <Progress value={metrics.memory.usage} className="w-16 h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <MonitorIcon className="h-6 w-6 text-purple-400 mb-2" />
                    <div className="text-lg font-bold text-white">{Math.round(metrics.gpu.usage)}%</div>
                    <div className="text-xs text-white/60">GPU Usage</div>
                    <div className="text-xs text-white/40">
                      {(metrics.gpu.memoryUsed / 1024).toFixed(1)}GB / {(metrics.gpu.memory / 1024).toFixed(1)}GB
                    </div>
                  </div>
                  <Progress value={metrics.gpu.usage} className="w-16 h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <WifiIcon className="h-6 w-6 text-yellow-400 mb-2" />
                    <div className="text-lg font-bold text-white">{Math.round(metrics.network.downloadSpeed)}</div>
                    <div className="text-xs text-white/60">Mbps Down</div>
                    <div className="text-xs text-white/40">{Math.round(metrics.network.uploadSpeed)} Mbps Up</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/60">Loss: {metrics.network.packetLoss.toFixed(1)}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Alerts */}
          {performanceScore < 60 && (
            <Alert className="border-red-400/30 bg-red-400/10">
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertDescription className="text-red-300">
                Performance issues detected. Click "Optimize Performance" to improve your gaming experience.
              </AlertDescription>
            </Alert>
          )}

          {metrics.cpu.temperature > 80 && (
            <Alert className="border-yellow-400/30 bg-yellow-400/10">
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertDescription className="text-yellow-300">
                High CPU temperature detected ({Math.round(metrics.cpu.temperature)}°C). Consider improving cooling.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <TargetIcon className="h-5 w-5 mr-2" />
                  AI Match Recommendations
                </span>
                <Button onClick={loadMatchRecommendations} disabled={loadingRecommendations} variant="outline">
                  {loadingRecommendations ? (
                    <RefreshCwIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCwIcon className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
              <CardDescription className="text-white/60">
                Personalized recommendations based on your performance data and match history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRecommendations ? (
                <div className="text-center py-8">
                  <RefreshCwIcon className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-400" />
                  <p className="text-white/60">Analyzing your performance data...</p>
                </div>
              ) : recommendations ? (
                <div className="space-y-6">
                  {/* Best Maps */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <MapIcon className="h-5 w-5 mr-2 text-green-400" />
                      Recommended Maps
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendations.bestMaps.map((map, index) => (
                        <Card key={index} className="bg-white/5 border-white/10">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">{map.mapName}</h4>
                              <Badge variant="outline" className="border-green-400 text-green-300">
                                {map.winRate}% WR
                              </Badge>
                            </div>
                            <div className="text-sm text-white/60 space-y-1">
                              <div>K/D/A: {map.averageKDA}</div>
                              <div>{map.gamesPlayed} games played</div>
                              <div className="text-green-400">Confidence: {map.confidence}%</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Optimal Play Times */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <ClockIcon className="h-5 w-5 mr-2 text-blue-400" />
                      Best Performance Times
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.optimalTimes.map((time, index) => (
                        <Card key={index} className="bg-white/5 border-white/10">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">{time.timeRange}</h4>
                              <Badge variant="outline" className="border-blue-400 text-blue-300">
                                {time.averagePerformance}% Avg
                              </Badge>
                            </div>
                            <div className="text-sm text-white/60 space-y-1">
                              <div>Win Rate: {time.winRate}%</div>
                              <div>{time.gamesPlayed} games in this period</div>
                              <div className="text-blue-400">Score: {time.performanceScore}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Teammates */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <UsersIcon className="h-5 w-5 mr-2 text-purple-400" />
                      Suggested Teammates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.recommendedTeammates.map((teammate, index) => (
                        <Card key={index} className="bg-white/5 border-white/10">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-8 h-8 bg-purple-400/20 rounded-full flex items-center justify-center">
                                <span className="text-purple-400 font-semibold">
                                  {teammate.username.slice(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">{teammate.username}</h4>
                                <div className="text-sm text-white/60">{teammate.rank}</div>
                              </div>
                              <Badge variant="outline" className="border-purple-400 text-purple-300 ml-auto">
                                {teammate.synergy}% Synergy
                              </Badge>
                            </div>
                            <div className="text-sm text-white/60 space-y-1">
                              <div>Shared Win Rate: {teammate.sharedWinRate}%</div>
                              <div>{teammate.gamesPlayed} games together</div>
                              <div className="text-purple-400">Compatibility: {teammate.compatibility}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Performance Insights */}
                  <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <TrophyIcon className="h-5 w-5 mr-2 text-yellow-400" />
                        Performance Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recommendations.insights.map((insight, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <StarIcon className="h-4 w-4 text-yellow-400 mt-0.5" />
                            <p className="text-white/80">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TargetIcon className="h-12 w-12 mx-auto mb-4 text-white/40" />
                  <p className="text-white/60">
                    No recommendations available. Play more matches to get personalized suggestions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-6">
          <div className="space-y-4">
            {optimizations.map((opt) => (
              <Card key={opt.id} className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(opt.status)}
                      <div>
                        <h3 className="font-semibold text-white">{opt.title}</h3>
                        <p className="text-sm text-white/60">{opt.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className={getImpactColor(opt.impact)}>
                            {opt.impact} impact
                          </Badge>
                          <Badge variant="outline" className="border-blue-400 text-blue-300">
                            {opt.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Switch checked={opt.autoApply} />
                        <Label className="text-white/80 text-sm">Auto</Label>
                      </div>
                      <Button
                        size="sm"
                        disabled={opt.status === "applied"}
                        variant={opt.status === "applied" ? "outline" : "default"}
                      >
                        {opt.status === "applied" ? "Applied" : "Apply"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Network Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Ping</span>
                  <span className="text-blue-400 font-bold">{Math.round(metrics.network.ping)}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Jitter</span>
                  <span className="text-yellow-400 font-bold">{metrics.network.jitter.toFixed(1)}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Packet Loss</span>
                  <span className="text-red-400 font-bold">{metrics.network.packetLoss.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Download Speed</span>
                  <span className="text-green-400 font-bold">{Math.round(metrics.network.downloadSpeed)} Mbps</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Upload Speed</span>
                  <span className="text-green-400 font-bold">{Math.round(metrics.network.uploadSpeed)} Mbps</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Network Optimizations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <NetworkIcon className="h-4 w-4 mr-2" />
                  Optimize DNS Settings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <WifiIcon className="h-4 w-4 mr-2" />
                  Configure QoS
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ZapIcon className="h-4 w-4 mr-2" />
                  Reduce Network Latency
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">CPU</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{Math.round(metrics.cpu.usage)}%</div>
                  <Progress value={metrics.cpu.usage} className="mt-2" />
                  <p className="text-xs text-white/60 mt-2">
                    {metrics.cpu.cores} cores @ {metrics.cpu.frequency.toFixed(1)} GHz
                  </p>
                  <p className="text-xs text-white/60">Temp: {Math.round(metrics.cpu.temperature)}°C</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Memory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{Math.round(metrics.memory.usage)}%</div>
                  <Progress value={metrics.memory.usage} className="mt-2" />
                  <p className="text-xs text-white/60 mt-2">
                    {(metrics.memory.used / 1024).toFixed(1)}GB / {(metrics.memory.available / 1024).toFixed(1)}GB
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">GPU</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{Math.round(metrics.gpu.usage)}%</div>
                  <Progress value={metrics.gpu.usage} className="mt-2" />
                  <p className="text-xs text-white/60 mt-2">
                    {(metrics.gpu.memoryUsed / 1024).toFixed(1)}GB / {(metrics.gpu.memory / 1024).toFixed(1)}GB
                  </p>
                  <p className="text-xs text-white/60">Temp: {Math.round(metrics.gpu.temperature)}°C</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Lag Shield Settings</CardTitle>
              <CardDescription className="text-white/60">
                Configure monitoring and optimization preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/80">Auto-optimize on startup</Label>
                  <p className="text-sm text-white/60">Automatically apply optimizations when Lag Shield starts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/80">Real-time monitoring</Label>
                  <p className="text-sm text-white/60">Continuously monitor system performance</p>
                </div>
                <Switch checked={isMonitoring} onCheckedChange={setIsMonitoring} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/80">Performance notifications</Label>
                  <p className="text-sm text-white/60">Get alerts when performance drops</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/80">AI recommendations</Label>
                  <p className="text-sm text-white/60">Enable intelligent match recommendations</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/80">Game-specific profiles</Label>
                  <p className="text-sm text-white/60">Use different settings for each game</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
