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
  InfoIcon,
  BugIcon,
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
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showDebugPanel, setShowDebugPanel] = useState(false)

  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: {
      usage: 45,
      temperature: 65,
      cores: 8,
      frequency: 3.2,
      model: "Loading...",
    },
    memory: {
      usage: 62,
      available: 16,
      used: 10,
    },
    gpu: {
      usage: 78,
      temperature: 72,
      memory: 8,
      memoryUsed: 6,
      model: "Loading...",
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
      latencyGrade: "Loading...",
    },
    fps: 144,
    frameTime: 6.9,
    source: "loading",
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

  // Enhanced real-time performance monitoring with debugging
  useEffect(() => {
    if (!isMonitoring) return

    const fetchMetrics = async () => {
      try {
        console.log("🔄 Fetching metrics in component...")
        const newMetrics = await PerformanceMonitor.getCurrentMetrics()

        // Update debug info
        setDebugInfo({
          lastFetch: new Date().toISOString(),
          source: newMetrics.source,
          libraryStatus: newMetrics.libraryStatus,
          reason: newMetrics.reason,
          error: newMetrics.error,
          dataReceived: !!newMetrics,
        })

        setMetrics(newMetrics)

        // Calculate performance score
        const score = PerformanceMonitor.calculatePerformanceScore(newMetrics)
        setPerformanceScore(score)

        console.log(`📊 Metrics updated - Source: ${newMetrics.source}, Score: ${score}`)
      } catch (error) {
        console.error("❌ Error in component metrics fetch:", error)
        setDebugInfo({
          lastFetch: new Date().toISOString(),
          source: "error",
          error: error instanceof Error ? error.message : "Unknown error",
          dataReceived: false,
        })
      }
    }

    // Initial fetch
    fetchMetrics()

    // Set up interval for continuous monitoring
    const interval = setInterval(fetchMetrics, 2000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  // Load match recommendations
  useEffect(() => {
    loadMatchRecommendations()
  }, [])

  const loadMatchRecommendations = async () => {
    setLoadingRecommendations(true)
    try {
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

      await PerformanceMonitor.applyOptimizations()
      setLastOptimized(new Date())

      // Force refresh metrics
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

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "real":
        return "border-green-400 text-green-300 bg-green-400/10"
      case "simulated":
        return "border-yellow-400 text-yellow-300 bg-yellow-400/10"
      case "loading":
        return "border-blue-400 text-blue-300 bg-blue-400/10"
      default:
        return "border-red-400 text-red-300 bg-red-400/10"
    }
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
          <Badge variant="outline" className={getSourceBadgeColor(metrics.source || "unknown")}>
            {metrics.source === "real" && "🟢 Live Data"}
            {metrics.source === "simulated" && "🟡 Simulated"}
            {metrics.source === "loading" && "🔵 Loading..."}
            {!metrics.source && "🔴 Error"}
          </Badge>
          <Button onClick={() => setShowDebugPanel(!showDebugPanel)} variant="outline" size="sm" className="text-xs">
            <BugIcon className="h-3 w-3 mr-1" />
            Debug
          </Button>
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

      {/* Debug Panel */}
      {showDebugPanel && debugInfo && (
        <Card className="bg-black/40 border-blue-400/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center">
              <BugIcon className="h-5 w-5 mr-2" />
              Debug Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-2">Data Source</h4>
                <p className="text-white/80">Source: {debugInfo.source}</p>
                <p className="text-white/80">Last Fetch: {new Date(debugInfo.lastFetch).toLocaleTimeString()}</p>
                <p className="text-white/80">Data Received: {debugInfo.dataReceived ? "✅ Yes" : "❌ No"}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Library Status</h4>
                {debugInfo.libraryStatus && (
                  <div className="space-y-1">
                    <p className="text-white/80">
                      systeminformation: {debugInfo.libraryStatus.systeminformation ? "✅" : "❌"}
                    </p>
                    <p className="text-white/80">node-os-utils: {debugInfo.libraryStatus.nodeOsUtils ? "✅" : "❌"}</p>
                    <p className="text-white/80">ping: {debugInfo.libraryStatus.ping ? "✅" : "❌"}</p>
                  </div>
                )}
              </div>
              {debugInfo.reason && (
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-white mb-2">Reason</h4>
                  <p className="text-yellow-400">{debugInfo.reason}</p>
                </div>
              )}
              {debugInfo.error && (
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-white mb-2">Error Details</h4>
                  <p className="text-red-400 text-xs font-mono bg-red-400/10 p-2 rounded">{debugInfo.error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
                  <div className="text-xs text-white/40">
                    {typeof metrics.frameTime === "string" ? metrics.frameTime : metrics.frameTime.toFixed(1)}ms frame
                    time
                  </div>
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

          {/* System Information */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CpuIcon className="h-5 w-5 mr-2" />
                System Information
              </CardTitle>
              <CardDescription className="text-white/60 flex items-center justify-between">
                <span>Hardware details and specifications</span>
                <Badge variant="outline" className={getSourceBadgeColor(metrics.source || "unknown")}>
                  {metrics.source === "real" && "🟢 Live Data"}
                  {metrics.source === "simulated" && "🟡 Simulated Data"}
                  {metrics.source === "loading" && "🔵 Loading..."}
                  {!metrics.source && "🔴 Error"}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Processor</h4>
                    <p className="text-sm text-white/80">{metrics.cpu.model || "Unknown CPU"}</p>
                    <p className="text-xs text-white/60">
                      {metrics.cpu.cores} cores @ {metrics.cpu.frequency.toFixed(1)} GHz
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Memory</h4>
                    <p className="text-sm text-white/80">{metrics.memory.available} GB Total</p>
                    <p className="text-xs text-white/60">
                      {metrics.memory.used} GB used ({metrics.memory.usage}%)
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Graphics</h4>
                    <p className="text-sm text-white/80">{metrics.gpu.model || "Unknown GPU"}</p>
                    <p className="text-xs text-white/60">
                      {metrics.gpu.memory} GB VRAM ({metrics.gpu.memoryUsed} GB used)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Network</h4>
                    <p className="text-sm text-white/80">Latency: {metrics.network.latencyGrade || "Unknown"}</p>
                    <p className="text-xs text-white/60">
                      {Math.round(metrics.network.downloadSpeed)} Mbps down / {Math.round(metrics.network.uploadSpeed)}{" "}
                      Mbps up
                    </p>
                  </div>
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
                      {metrics.memory.used}GB / {metrics.memory.available}GB
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
                      {metrics.gpu.memoryUsed}GB / {metrics.gpu.memory}GB
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

          {metrics.source === "simulated" && (
            <Alert className="border-blue-400/30 bg-blue-400/10">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription className="text-blue-300">
                Using simulated data. Install system monitoring libraries (systeminformation, node-os-utils, ping) for
                real-time metrics.
                {debugInfo?.reason && <div className="mt-2 text-xs">Reason: {debugInfo.reason}</div>}
              </AlertDescription>
            </Alert>
          )}

          {metrics.source === "loading" && (
            <Alert className="border-blue-400/30 bg-blue-400/10">
              <RefreshCwIcon className="h-4 w-4 animate-spin" />
              <AlertDescription className="text-blue-300">
                Loading system metrics... Please wait while we gather real-time data.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <TargetIcon className="h-5 w-5 mr-2 text-green-400" />
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
                          <Badge variant="outline" className="border-gray-400 text-gray-300">
                            {opt.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`auto-${opt.id}`} className="text-sm text-white/60">
                        Auto
                      </Label>
                      <Switch id={`auto-${opt.id}`} checked={opt.autoApply} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Network Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{Math.round(metrics.network.ping)}ms</div>
                  <div className="text-sm text-white/60">Ping</div>
                  <Progress value={Math.max(0, 100 - metrics.network.ping)} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{metrics.network.jitter.toFixed(1)}ms</div>
                  <div className="text-sm text-white/60">Jitter</div>
                  <Progress value={Math.max(0, 100 - metrics.network.jitter * 10)} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">{metrics.network.packetLoss.toFixed(1)}%</div>
                  <div className="text-sm text-white/60">Packet Loss</div>
                  <Progress value={Math.max(0, 100 - metrics.network.packetLoss * 50)} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">CPU Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/60">Usage</span>
                    <span className="text-white">{Math.round(metrics.cpu.usage)}%</span>
                  </div>
                  <Progress value={metrics.cpu.usage} />
                  <div className="flex justify-between">
                    <span className="text-white/60">Temperature</span>
                    <span className="text-white">{Math.round(metrics.cpu.temperature)}°C</span>
                  </div>
                  <Progress value={(metrics.cpu.temperature / 100) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">GPU Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/60">Usage</span>
                    <span className="text-white">{Math.round(metrics.gpu.usage)}%</span>
                  </div>
                  <Progress value={metrics.gpu.usage} />
                  <div className="flex justify-between">
                    <span className="text-white/60">Temperature</span>
                    <span className="text-white">{Math.round(metrics.gpu.temperature)}°C</span>
                  </div>
                  <Progress value={(metrics.gpu.temperature / 100) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Monitoring Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="real-time" className="text-white">
                    Real-time Monitoring
                  </Label>
                  <Switch id="real-time" checked={isMonitoring} onCheckedChange={setIsMonitoring} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="text-white">
                    Performance Notifications
                  </Label>
                  <Switch id="notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-optimize" className="text-white">
                    Auto-optimize on Low Performance
                  </Label>
                  <Switch id="auto-optimize" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
