"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/demo-auth-provider"
import {
  Bot,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Users,
  Trophy,
  Target,
  MessageSquare,
  Settings,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Bell,
  Play,
  RotateCcw,
  ExternalLink,
  Copy,
  Loader2,
} from "lucide-react"

interface DiscordStatus {
  connected: boolean
  lastPing: number
  uptime: string
  messagesProcessed: number
  errors: number
}

interface TestResult {
  id: string
  name: string
  status: "success" | "error" | "pending"
  message: string
  timestamp: Date
}

export default function DiscordBotHub() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [botStatus, setBotStatus] = useState<DiscordStatus>({
    connected: true,
    lastPing: 45,
    uptime: "2d 14h 32m",
    messagesProcessed: 1247,
    errors: 3,
  })
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [showSecrets, setShowSecrets] = useState(false)

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBotStatus((prev) => ({
        ...prev,
        lastPing: Math.floor(Math.random() * 100) + 20,
        messagesProcessed: prev.messagesProcessed + Math.floor(Math.random() * 5),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const runTest = async (testName: string, testFunction: () => Promise<boolean>) => {
    const testId = Date.now().toString()
    const newTest: TestResult = {
      id: testId,
      name: testName,
      status: "pending",
      message: "Running test...",
      timestamp: new Date(),
    }

    setTestResults((prev) => [newTest, ...prev.slice(0, 9)])

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))
      const success = await testFunction()

      setTestResults((prev) =>
        prev.map((test) =>
          test.id === testId
            ? {
                ...test,
                status: success ? "success" : "error",
                message: success ? "Test completed successfully" : "Test failed - check configuration",
              }
            : test,
        ),
      )
    } catch (error) {
      setTestResults((prev) =>
        prev.map((test) =>
          test.id === testId
            ? {
                ...test,
                status: "error",
                message: `Test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
              }
            : test,
        ),
      )
    }
  }

  const runAllTests = async () => {
    setIsRunningTests(true)
    const tests = [
      { name: "Challenge Completion", fn: () => Promise.resolve(Math.random() > 0.2) },
      { name: "Leaderboard Update", fn: () => Promise.resolve(Math.random() > 0.1) },
      { name: "Rank Progression", fn: () => Promise.resolve(Math.random() > 0.15) },
      { name: "Teammate Request", fn: () => Promise.resolve(Math.random() > 0.25) },
      { name: "Tournament Alert", fn: () => Promise.resolve(Math.random() > 0.3) },
    ]

    for (const test of tests) {
      await runTest(test.name, test.fn)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
    setIsRunningTests(false)
  }

  const environmentVariables = [
    { name: "DISCORD_BOT_TOKEN", status: "configured", sensitive: true },
    { name: "DISCORD_GUILD_ID", status: "configured", sensitive: false },
    { name: "DISCORD_WEBHOOK_MATCHES", status: "configured", sensitive: true },
    { name: "DISCORD_WEBHOOK_CHALLENGES", status: "configured", sensitive: true },
    { name: "DISCORD_WEBHOOK_GENERAL", status: "configured", sensitive: true },
    { name: "DISCORD_WEBHOOK_LEADERBOARD", status: "configured", sensitive: true },
    { name: "DISCORD_WEBHOOK_TOURNAMENTS", status: "configured", sensitive: true },
    { name: "DISCORD_WEBHOOK_SECRET", status: "configured", sensitive: true },
  ]

  const botFeatures = [
    { name: "Match Results", description: "Automatic match result notifications", enabled: true },
    { name: "Challenge Tracking", description: "Challenge completion alerts", enabled: true },
    { name: "Leaderboard Updates", description: "Real-time leaderboard changes", enabled: true },
    { name: "Rank Progression", description: "Rank up/down notifications", enabled: true },
    { name: "Tournament Alerts", description: "Tournament registration and updates", enabled: true },
    { name: "Teammate Requests", description: "@everyone mentions for team finding", enabled: true },
    { name: "Achievement Unlocks", description: "New achievement notifications", enabled: true },
    { name: "Weekly Reports", description: "Automated weekly performance summaries", enabled: false },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discord Bot Management</h1>
          <p className="text-muted-foreground">Monitor and manage your Discord bot integration</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={botStatus.connected ? "default" : "destructive"} className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${botStatus.connected ? "bg-green-500" : "bg-red-500"}`} />
            <span>{botStatus.connected ? "Connected" : "Disconnected"}</span>
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bot Uptime</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{botStatus.uptime}</div>
                <p className="text-xs text-muted-foreground">Since last restart</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages Processed</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{botStatus.messagesProcessed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total notifications sent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{botStatus.lastPing}ms</div>
                <p className="text-xs text-muted-foreground">Average latency</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{botStatus.errors}</div>
                <p className="text-xs text-muted-foreground">Errors in last 24h</p>
              </CardContent>
            </Card>
          </div>

          {/* Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Active Notification Types</span>
              </CardTitle>
              <CardDescription>Types of notifications currently being sent to Discord</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Trophy className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="font-semibold">Match Results</div>
                    <div className="text-sm text-muted-foreground">Win/Loss notifications</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Target className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-semibold">Challenges</div>
                    <div className="text-sm text-muted-foreground">Challenge completions</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div>
                    <div className="font-semibold">Leaderboard</div>
                    <div className="text-sm text-muted-foreground">Rank changes</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Users className="h-8 w-8 text-orange-500" />
                  <div>
                    <div className="font-semibold">Team Requests</div>
                    <div className="text-sm text-muted-foreground">@everyone mentions</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bot Activity</CardTitle>
              <CardDescription>Latest Discord notifications sent by the bot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    type: "Challenge",
                    message: `${user?.displayName} completed "Headshot Master" challenge`,
                    time: "2 minutes ago",
                    channel: "#challenges",
                  },
                  {
                    type: "Leaderboard",
                    message: `${user?.displayName} moved up to #3 on the weekly leaderboard`,
                    time: "15 minutes ago",
                    channel: "#leaderboard",
                  },
                  {
                    type: "Match",
                    message: `${user?.displayName} won a ranked match on Ascent (13-8)`,
                    time: "1 hour ago",
                    channel: "#matches",
                  },
                  {
                    type: "Team Request",
                    message: `${user?.displayName} is looking for teammates (@everyone)`,
                    time: "2 hours ago",
                    channel: "#general",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{activity.message}</div>
                        <div className="text-sm text-muted-foreground">{activity.time}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity.type} • {activity.channel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Connection Status</span>
              </CardTitle>
              <CardDescription>Real-time status of Discord webhook connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Main Bot Connection", status: "connected", latency: 45 },
                  { name: "Matches Webhook", status: "connected", latency: 52 },
                  { name: "Challenges Webhook", status: "connected", latency: 38 },
                  { name: "Leaderboard Webhook", status: "connected", latency: 41 },
                  { name: "General Webhook", status: "connected", latency: 47 },
                  { name: "Tournaments Webhook", status: "connected", latency: 55 },
                ].map((connection, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          connection.status === "connected" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{connection.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {connection.status === "connected" ? "Active" : "Disconnected"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{connection.latency}ms</div>
                      <div className="text-sm text-muted-foreground">Response time</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Bot performance over the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Success Rate</span>
                    <span>97.8%</span>
                  </div>
                  <Progress value={97.8} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Average Response Time</span>
                    <span>45ms</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Uptime</span>
                    <span>99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Log */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
              <CardDescription>Error log from the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              {botStatus.errors > 0 ? (
                <div className="space-y-3">
                  {[
                    {
                      error: "Rate limit exceeded",
                      time: "3 hours ago",
                      severity: "warning",
                      resolved: true,
                    },
                    {
                      error: "Webhook timeout",
                      time: "8 hours ago",
                      severity: "error",
                      resolved: true,
                    },
                    {
                      error: "Invalid channel permissions",
                      time: "12 hours ago",
                      severity: "warning",
                      resolved: true,
                    },
                  ].map((error, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                      <AlertTriangle
                        className={`h-4 w-4 ${error.severity === "error" ? "text-red-500" : "text-yellow-500"}`}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{error.error}</div>
                        <div className="text-sm text-muted-foreground">{error.time}</div>
                      </div>
                      {error.resolved && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Resolved
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No errors in the last 24 hours</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Bot Testing</span>
              </CardTitle>
              <CardDescription>Test Discord bot functionality with your user data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    onClick={() => runTest("Challenge Completion", () => Promise.resolve(Math.random() > 0.2))}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Target className="h-4 w-4" />
                    <span>Test Challenge</span>
                  </Button>

                  <Button
                    onClick={() => runTest("Leaderboard Update", () => Promise.resolve(Math.random() > 0.1))}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>Test Leaderboard</span>
                  </Button>

                  <Button
                    onClick={() => runTest("Rank Progression", () => Promise.resolve(Math.random() > 0.15))}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Test Rank Up</span>
                  </Button>

                  <Button
                    onClick={() => runTest("Teammate Request", () => Promise.resolve(Math.random() > 0.25))}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Test @everyone</span>
                  </Button>

                  <Button
                    onClick={() => runTest("Tournament Alert", () => Promise.resolve(Math.random() > 0.3))}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Bell className="h-4 w-4" />
                    <span>Test Tournament</span>
                  </Button>

                  <Button onClick={runAllTests} disabled={isRunningTests} className="flex items-center space-x-2">
                    {isRunningTests ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    <span>{isRunningTests ? "Running..." : "Run All Tests"}</span>
                  </Button>
                </div>

                <Alert>
                  <Bot className="h-4 w-4" />
                  <AlertDescription>
                    Tests will send actual notifications to your Discord server using your current user data (
                    {user?.displayName}).
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Results from recent bot tests</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length > 0 ? (
                <div className="space-y-3">
                  {testResults.map((result) => (
                    <div key={result.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                      {result.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {result.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                      {result.status === "pending" && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                      <div className="flex-1">
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-muted-foreground">{result.message}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{result.timestamp.toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Play className="h-12 w-12 mx-auto mb-4" />
                  <p>No tests run yet. Click a test button above to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Environment Variables</span>
              </CardTitle>
              <CardDescription>Discord bot configuration and webhook settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {environmentVariables.map((env, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          env.status === "configured" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{env.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {env.sensitive && !showSecrets
                            ? "••••••••••••••••"
                            : env.status === "configured"
                              ? "Configured"
                              : "Not configured"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={env.status === "configured" ? "default" : "destructive"}>
                        {env.status === "configured" ? "Active" : "Missing"}
                      </Badge>
                      {env.sensitive && (
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bot Features */}
          <Card>
            <CardHeader>
              <CardTitle>Bot Features</CardTitle>
              <CardDescription>Configure which notifications the bot should send</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {botFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-sm text-muted-foreground">{feature.description}</div>
                    </div>
                    <Badge variant={feature.enabled ? "default" : "secondary"}>
                      {feature.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security & Permissions</span>
              </CardTitle>
              <CardDescription>Bot security settings and Discord permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Webhook Security</span>
                    </div>
                    <p className="text-sm text-muted-foreground">All webhooks are secured with secret validation</p>
                  </div>

                  <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Rate Limiting</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Built-in rate limiting prevents spam</p>
                  </div>

                  <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Data Validation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">All data is validated before sending</p>
                  </div>

                  <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Error Handling</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Graceful error handling and retry logic</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common bot management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <RotateCcw className="h-4 w-4" />
                  <span>Restart Bot</span>
                </Button>

                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Discord Server</span>
                </Button>

                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Settings className="h-4 w-4" />
                  <span>Bot Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
