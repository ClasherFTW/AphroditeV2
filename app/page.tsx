"use client"

import { useState, useEffect, Suspense, lazy } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/demo-auth-provider"
import { useGameStats } from "@/components/game-stats-provider"
import LoginPage from "@/components/login-page"
import GameSelector from "@/components/game-selector"
import {
  GamepadIcon,
  TrophyIcon,
  BarChart3Icon,
  ActivityIcon,
  EyeIcon,
  SmartphoneIcon,
  PaletteIcon,
  BotIcon,
  UsersIcon,
  MessageCircleIcon,
  ShieldIcon,
  ShoppingCartIcon,
  SettingsIcon,
  ZapIcon,
  StarIcon,
  FlameIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  Loader2Icon,
  BellIcon,
  SearchIcon,
  LogOutIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Lazy load all components for better performance
const LiveMatchTracker = lazy(() => import("@/components/live-match-tracker"))
const AdvancedStatisticsDashboard = lazy(() => import("@/components/advanced-statistics-dashboard"))
const AdvancedThemeBuilder = lazy(() => import("@/components/advanced-theme-builder"))
const MobileCompanion = lazy(() => import("@/components/mobile-companion"))
const WatchPartyHub = lazy(() => import("@/components/watch-party-hub"))
const EnhancedCoachGPT = lazy(() => import("@/components/enhanced-coach-gpt"))
const Leaderboard = lazy(() => import("@/components/leaderboard"))
const TournamentHub = lazy(() => import("@/components/tournament-hub"))
const TeamChatSimulator = lazy(() => import("@/components/team-chat-simulator"))
const PerformanceCharts = lazy(() => import("@/components/performance-charts"))
const VoiceChat = lazy(() => import("@/components/voice-chat"))
const TeamSection = lazy(() => import("@/components/team-section"))
const Challenges = lazy(() => import("@/components/challenges"))
const AphroditeStore = lazy(() => import("@/components/aphrodite-store"))
const UserProfileEnhanced = lazy(() => import("@/components/user-profile-enhanced"))
const SettingsPage = lazy(() => import("@/components/settings-page"))
const LagShield = lazy(() => import("@/components/lag-shield"))
const BackgroundMusicPlayer = lazy(() => import("@/components/background-music-player"))
const DiscordBotHub = lazy(() => import("@/components/discord-bot-hub"))
const DemoUserGeneratorPanel = lazy(() => import("@/components/demo-user-generator-panel"))

// Enhanced Loading Component
const LoadingComponent = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex items-center justify-center w-full h-64">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Loader2Icon className="h-12 w-12 text-primary animate-spin" />
        <div className="absolute inset-0 h-12 w-12 border-2 border-primary/20 rounded-full animate-pulse" />
      </div>
      <div className="text-center">
        <p className="text-muted-foreground font-medium">{text}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Please wait...</p>
      </div>
    </div>
  </div>
)

// Enhanced Navigation Component
function EnhancedNavigation({
  activeTab,
  setActiveTab,
  user,
  signOut,
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  user: any
  signOut: () => void
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications] = useState(3) // Mock notification count

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: GamepadIcon },
    { id: "live-tracker", label: "Live Matches", icon: ActivityIcon },
    { id: "advanced-stats", label: "Advanced Stats", icon: BarChart3Icon },
    { id: "watch-party", label: "Watch Party", icon: EyeIcon },
    { id: "mobile", label: "Mobile App", icon: SmartphoneIcon },
    { id: "themes", label: "Themes", icon: PaletteIcon },
    { id: "coach", label: "AI Coach", icon: BotIcon },
    { id: "leaderboard", label: "Leaderboard", icon: TrophyIcon },
    { id: "tournaments", label: "Tournaments", icon: TrophyIcon },
    { id: "team", label: "Team", icon: UsersIcon },
    { id: "teammates", label: "Team Chat", icon: MessageCircleIcon },
    { id: "stats", label: "Performance", icon: BarChart3Icon },
    { id: "challenges", label: "Challenges", icon: StarIcon },
    { id: "store", label: "Store", icon: ShoppingCartIcon },
    { id: "lagshield", label: "Lag Shield", icon: ShieldIcon },
    { id: "discord-bot", label: "Discord Bot", icon: BotIcon },
    { id: "demo-generator", label: "Demo Generator", icon: UserPlusIcon },
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ]

  const filteredItems = navigationItems.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-primary/20">
              <GamepadIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Aphrodite</h1>
              <div className="text-xs text-muted-foreground">Gaming Assistant</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.slice(0, 8).map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className="h-9 px-3"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              )
            })}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 px-3">
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navigationItems.slice(8).map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.id} onClick={() => setActiveTab(item.id)}>
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Section with Search and User */}
          <div className="flex items-center space-x-4">
            {/* Enhanced Search */}
            <div className="relative hidden md:block">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-background/50 border-border/50"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
                  {filteredItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id)
                          setSearchQuery("")
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-muted text-left"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="h-4 w-4" />
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">{notifications}</span>
                </div>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || "/placeholder.svg"} />
                    <AvatarFallback>{user?.displayName?.slice(0, 2) || "DU"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.displayName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

// Enhanced Dashboard Content
function DashboardContent() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [systemStats, setSystemStats] = useState({
    cpu: 45,
    memory: 62,
    network: 28,
    fps: 240,
    ping: 12,
  })
  const { user, signOut } = useAuth()
  const { selectedGame, setSelectedGame, gameStats } = useGameStats()

  // System monitoring simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats((prev) => ({
        cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        network: Math.max(10, Math.min(50, prev.network + (Math.random() - 0.5) * 15)),
        fps: Math.max(200, Math.min(300, prev.fps + (Math.random() - 0.5) * 20)),
        ping: Math.max(8, Math.min(25, prev.ping + (Math.random() - 0.5) * 4)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getGameDisplayName = (gameId: string) => {
    const gameNames: Record<string, string> = {
      valorant: "Valorant",
      cs2: "Counter-Strike 2",
      overwatch: "Overwatch 2",
      apex: "Apex Legends",
      lol: "League of Legends",
      rocket: "Rocket League",
      fortnite: "Fortnite",
      dota2: "Dota 2",
    }
    return gameNames[gameId] || "Unknown Game"
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            {/* Welcome Section with Integrated Game Selector */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
              <div className="relative p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user?.photoURL || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xl">
                        {user?.displayName?.slice(0, 2) || "DU"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Welcome back, {user?.displayName || "Champion"}!
                      </h1>
                      <p className="text-muted-foreground">
                        Currently dominating in {getGameDisplayName(selectedGame)}
                      </p>
                    </div>
                  </div>

                  {/* Integrated Game Selector */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/10">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                        Online
                      </Badge>
                      <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                        {gameStats.gamesPlayed} Games
                      </Badge>
                    </div>

                    {/* Game Selector Component */}
                    <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Current Game</div>
                      <GameSelector selectedGame={selectedGame} onGameChange={setSelectedGame} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game-Specific Stats Section */}
            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GamepadIcon className="h-5 w-5 mr-2 text-primary" />
                  {getGameDisplayName(selectedGame)} Performance
                </CardTitle>
                <CardDescription>Your current game statistics and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
                    <TrophyIcon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary mb-1">{gameStats.currentRank}</div>
                    <div className="text-sm text-muted-foreground">Current Rank</div>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <ArrowUpIcon className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500">+{gameStats.weeklyLP} LP</span>
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/20">
                    <StarIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-500 mb-1">{gameStats.winRate}%</div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <FlameIcon className="h-3 w-3 text-orange-500" />
                      <span className="text-xs text-muted-foreground">Last {gameStats.gamesPlayed} games</span>
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20">
                    <ZapIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-500 mb-1">{gameStats.avgPing}ms</div>
                    <div className="text-sm text-muted-foreground">Average Ping</div>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <CheckCircleIcon className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">Optimized</span>
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20">
                    <UsersIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-500 mb-1">{gameStats.squadMembers}</div>
                    <div className="text-sm text-muted-foreground">Squad Members</div>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-muted-foreground">{gameStats.onlineMembers} online</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Performance */}
            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ZapIcon className="h-5 w-5 mr-2 text-yellow-400" />
                  System Performance
                </CardTitle>
                <CardDescription>Real-time monitoring of your gaming setup</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{systemStats.cpu.toFixed(0)}%</div>
                    <div className="text-sm text-muted-foreground">CPU Usage</div>
                    <Progress value={systemStats.cpu} className="h-2 mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">{systemStats.memory.toFixed(0)}%</div>
                    <div className="text-sm text-muted-foreground">Memory</div>
                    <Progress value={systemStats.memory} className="h-2 mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{systemStats.network.toFixed(0)}%</div>
                    <div className="text-sm text-muted-foreground">Network</div>
                    <Progress value={systemStats.network} className="h-2 mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{systemStats.fps.toFixed(0)}</div>
                    <div className="text-sm text-muted-foreground">FPS</div>
                    <div className="h-2 mt-2 bg-green-400/20 rounded-full">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{systemStats.ping.toFixed(0)}ms</div>
                    <div className="text-sm text-muted-foreground">Ping</div>
                    <div className="h-2 mt-2 bg-green-400/20 rounded-full">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: "90%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 hover:border-red-500/30 hover:scale-105"
                onClick={() => setActiveTab("live-tracker")}
              >
                <CardContent className="p-6 text-center">
                  <ActivityIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Live Matches</h3>
                  <p className="text-muted-foreground text-sm">Real-time tracking</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 hover:border-blue-500/30 hover:scale-105"
                onClick={() => setActiveTab("advanced-stats")}
              >
                <CardContent className="p-6 text-center">
                  <BarChart3Icon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Advanced Stats</h3>
                  <p className="text-muted-foreground text-sm">KOST, ADR, KAST</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 hover:border-purple-500/30 hover:scale-105"
                onClick={() => setActiveTab("watch-party")}
              >
                <CardContent className="p-6 text-center">
                  <EyeIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Watch Party</h3>
                  <p className="text-muted-foreground text-sm">Social viewing</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 hover:border-green-500/30 hover:scale-105"
                onClick={() => setActiveTab("mobile")}
              >
                <CardContent className="p-6 text-center">
                  <SmartphoneIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Mobile App</h3>
                  <p className="text-muted-foreground text-sm">Cross-device</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 hover:border-pink-500/30 hover:scale-105"
                onClick={() => setActiveTab("themes")}
              >
                <CardContent className="p-6 text-center">
                  <PaletteIcon className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Themes</h3>
                  <p className="text-muted-foreground text-sm">Customization</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Recent Matches</CardTitle>
                  <CardDescription>Your latest {getGameDisplayName(selectedGame)} games</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {gameStats.recentMatches.map((match, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 hover:bg-muted/30 p-3 rounded-lg transition-all duration-200"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${match.result === "win" ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div
                            className={`text-sm font-medium ${
                              match.result === "win" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {match.result === "win" ? "Victory" : "Defeat"}
                          </div>
                          <div className="text-sm font-mono">{match.score}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {match.map} • {match.date.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Your {getGameDisplayName(selectedGame)} statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{gameStats.winRate}%</div>
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{gameStats.kda}</div>
                      <div className="text-sm text-muted-foreground">K/D/A</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">{gameStats.hoursPlayed}h</div>
                      <div className="text-sm text-muted-foreground">Playtime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      // All the new integrated features
      case "live-tracker":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Live Match Tracker..." />}>
            <LiveMatchTracker />
          </Suspense>
        )

      case "advanced-stats":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Advanced Statistics..." />}>
            <AdvancedStatisticsDashboard />
          </Suspense>
        )

      case "themes":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Theme Builder..." />}>
            <AdvancedThemeBuilder />
          </Suspense>
        )

      case "mobile":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Mobile Companion..." />}>
            <MobileCompanion />
          </Suspense>
        )

      case "watch-party":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Watch Party..." />}>
            <WatchPartyHub />
          </Suspense>
        )

      // Existing features
      case "coach":
        return (
          <Suspense fallback={<LoadingComponent text="Loading AI Coach..." />}>
            <EnhancedCoachGPT />
          </Suspense>
        )

      case "leaderboard":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Leaderboard..." />}>
            <Leaderboard />
          </Suspense>
        )

      case "tournaments":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Tournaments..." />}>
            <TournamentHub />
          </Suspense>
        )

      case "team":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Team Management..." />}>
            <TeamSection />
          </Suspense>
        )

      case "teammates":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Team Chat..." />}>
            <TeamChatSimulator />
          </Suspense>
        )

      case "stats":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Performance Charts..." />}>
            <PerformanceCharts />
          </Suspense>
        )

      case "challenges":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Challenges..." />}>
            <Challenges />
          </Suspense>
        )

      case "store":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Store..." />}>
            <AphroditeStore />
          </Suspense>
        )

      case "lagshield":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Lag Shield..." />}>
            <LagShield />
          </Suspense>
        )

      case "profile":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Profile..." />}>
            <UserProfileEnhanced />
          </Suspense>
        )

      case "settings":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Settings..." />}>
            <SettingsPage />
          </Suspense>
        )
      case "discord-bot":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Discord Bot..." />}>
            <DiscordBotHub />
          </Suspense>
        )
      case "demo-generator":
        return (
          <Suspense fallback={<LoadingComponent text="Loading Demo Generator..." />}>
            <DemoUserGeneratorPanel />
          </Suspense>
        )

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Feature Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested feature could not be loaded.</p>
            <Button onClick={() => setActiveTab("dashboard")}>Return to Dashboard</Button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <EnhancedNavigation activeTab={activeTab} setActiveTab={setActiveTab} user={user} signOut={signOut} />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">{renderContent()}</div>
      </main>

      <Suspense fallback={null}>
        <BackgroundMusicPlayer />
      </Suspense>
    </div>
  )
}

// Main App Component
function AuthenticatedApp() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <GamepadIcon className="h-16 w-16 text-primary animate-pulse mx-auto" />
            <div className="absolute inset-0 h-16 w-16 border-2 border-primary/20 rounded-full animate-spin" />
          </div>
          <div>
            <p className="text-xl font-semibold">Loading Aphrodite...</p>
            <p className="text-muted-foreground">Initializing your gaming dashboard</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return <DashboardContent />
}

export default function Home() {
  return <AuthenticatedApp />
}
