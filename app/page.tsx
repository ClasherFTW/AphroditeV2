"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { useGameStats } from "@/components/game-stats-provider"
import LoginPage from "@/components/login-page"
import EnhancedNavigation from "@/components/enhanced-navigation"
import DiscordStatus from "@/components/discord-status"
import DiscordTestPanel from "@/components/discord-test-panel"
import TeammateRequestForm from "@/components/teammate-request-form"
import {
  TrophyIcon,
  ZapIcon,
  StarIcon,
  UsersIcon,
  BotIcon,
  AwardIcon,
  ShoppingCartIcon,
  CalendarIcon,
  TrendingUpIcon,
  GamepadIcon,
  ActivityIcon,
  FlameIcon,
} from "lucide-react"
import EnhancedCoachGPT from "@/components/enhanced-coach-gpt"
import Leaderboard from "@/components/leaderboard"
import TournamentHub from "@/components/tournament-hub"
import TeamChatSimulator from "@/components/team-chat-simulator"
import PerformanceCharts from "@/components/performance-charts"
import TournamentBrackets from "@/components/tournament-brackets"
import VoiceChat from "@/components/voice-chat"
import TeamSection from "@/components/team-section"
import BackgroundMusicPlayer from "@/components/background-music-player"
import LagShield from "@/components/lag-shield"
import Challenges from "@/components/challenges"
import AphroditeStore from "@/components/aphrodite-store"
import UserProfileEnhanced from "@/components/user-profile-enhanced"
import MatchSubmissionForm from "@/components/match-submission-form"
import DemoUserGeneratorPanel from "@/components/demo-user-generator-panel"
import SettingsPage from "@/components/settings-page"

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { selectedGame, setSelectedGame, gameStats } = useGameStats()

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
            {/* Enhanced Welcome Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
              <div className="relative p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-primary/20 backdrop-blur-sm">
                        <GamepadIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          Welcome back, Champion!
                        </h1>
                        <p className="text-muted-foreground">
                          Currently dominating in {getGameDisplayName(selectedGame)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/10">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                      Online
                    </Badge>
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                      {gameStats.gamesPlayed} Games
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-3 relative">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <div className="p-1.5 rounded-lg bg-primary/20 mr-3">
                      <TrophyIcon className="h-4 w-4 text-primary" />
                    </div>
                    Current Rank
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-primary mb-1">{gameStats.currentRank}</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                      +{gameStats.weeklyLP} LP
                    </div>
                    <span className="text-xs text-muted-foreground">this week</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-3 relative">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <div className="p-1.5 rounded-lg bg-green-500/20 mr-3">
                      <StarIcon className="h-4 w-4 text-green-500" />
                    </div>
                    Win Rate
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-green-500 mb-1">{gameStats.winRate}%</div>
                  <div className="flex items-center space-x-2">
                    <FlameIcon className="h-3 w-3 text-orange-500" />
                    <span className="text-xs text-muted-foreground">Last {gameStats.gamesPlayed} games</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-3 relative">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <div className="p-1.5 rounded-lg bg-blue-500/20 mr-3">
                      <ZapIcon className="h-4 w-4 text-blue-500" />
                    </div>
                    Network
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-blue-500 mb-1">{gameStats.avgPing}ms</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-muted-foreground">Optimized</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-3 relative">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 mr-3">
                      <UsersIcon className="h-4 w-4 text-purple-500" />
                    </div>
                    Squad
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-purple-500 mb-1">{gameStats.squadMembers}</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-muted-foreground">{gameStats.onlineMembers} online</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <Card className="lg:col-span-1 bg-gradient-to-br from-card to-card/50 border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ActivityIcon className="h-5 w-5 mr-2 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setActiveTab("coach")}
                    className="w-full justify-start group hover:bg-primary/10 transition-all duration-200"
                    variant="outline"
                  >
                    <BotIcon className="h-4 w-4 mr-3 group-hover:text-primary transition-colors" />
                    <div className="text-left">
                      <div className="font-medium">AI Coach</div>
                      <div className="text-xs text-muted-foreground">Get personalized tips</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("challenges")}
                    className="w-full justify-start group hover:bg-orange-500/10 transition-all duration-200"
                    variant="outline"
                  >
                    <AwardIcon className="h-4 w-4 mr-3 group-hover:text-orange-500 transition-colors" />
                    <div className="text-left">
                      <div className="font-medium">Challenges</div>
                      <div className="text-xs text-muted-foreground">Earn rewards</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("store")}
                    className="w-full justify-start group hover:bg-green-500/10 transition-all duration-200"
                    variant="outline"
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-3 group-hover:text-green-500 transition-colors" />
                    <div className="text-left">
                      <div className="font-medium">Store</div>
                      <div className="text-xs text-muted-foreground">Browse items</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("tournaments")}
                    className="w-full justify-start group hover:bg-purple-500/10 transition-all duration-200"
                    variant="outline"
                  >
                    <CalendarIcon className="h-4 w-4 mr-3 group-hover:text-purple-500 transition-colors" />
                    <div className="text-left">
                      <div className="font-medium">Tournaments</div>
                      <div className="text-xs text-muted-foreground">Join competitions</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Matches */}
              <Card className="lg:col-span-1 bg-gradient-to-br from-card to-card/50 border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Matches</span>
                    <Badge variant="outline" className="text-xs">
                      {getGameDisplayName(selectedGame)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {gameStats.recentMatches.map((match, index) => (
                    <div
                      key={index}
                      className="group flex items-center space-x-3 hover:bg-muted/30 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-border/50"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          match.result === "win"
                            ? "bg-green-500 shadow-lg shadow-green-500/30"
                            : "bg-red-500 shadow-lg shadow-red-500/30"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div
                            className={`text-sm font-medium ${match.result === "win" ? "text-green-600" : "text-red-600"}`}
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

              {/* Voice Chat */}
              <div className="lg:col-span-1">
                <VoiceChat />
              </div>
            </div>

            {/* Enhanced Performance Overview */}
            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUpIcon className="h-5 w-5 mr-2 text-primary" />
                  {getGameDisplayName(selectedGame)} Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 group-hover:bg-green-500/20 transition-all duration-300 mb-3">
                      <div className="text-3xl font-bold text-green-500">{gameStats.winRate}%</div>
                    </div>
                    <div className="text-sm font-medium">Win Rate</div>
                    <div className="text-xs text-muted-foreground">Current performance</div>
                  </div>
                  <div className="text-center group">
                    <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all duration-300 mb-3">
                      <div className="text-3xl font-bold text-blue-500">{gameStats.kda}</div>
                    </div>
                    <div className="text-sm font-medium">K/D/A Ratio</div>
                    <div className="text-xs text-muted-foreground">Combat effectiveness</div>
                  </div>
                  <div className="text-center group">
                    <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all duration-300 mb-3">
                      <div className="text-3xl font-bold text-purple-500">{gameStats.hoursPlayed}h</div>
                    </div>
                    <div className="text-sm font-medium">Playtime</div>
                    <div className="text-xs text-muted-foreground">Total dedication</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "coach":
        return <EnhancedCoachGPT />
      case "leaderboard":
        return <Leaderboard />
      case "tournaments":
        return (
          <Tabs defaultValue="hub" className="space-y-6">
            <TabsList>
              <TabsTrigger value="hub">Tournament Hub</TabsTrigger>
              <TabsTrigger value="brackets">Live Brackets</TabsTrigger>
            </TabsList>
            <TabsContent value="hub">
              <TournamentHub />
            </TabsContent>
            <TabsContent value="brackets">
              <TournamentBrackets />
            </TabsContent>
          </Tabs>
        )
      case "teammates":
        return <TeamChatSimulator />
      case "team":
        return <TeamSection />
      case "stats":
        return <PerformanceCharts />
      case "challenges":
        return <Challenges />
      case "store":
        return <AphroditeStore />
      case "lagshield":
        return <LagShield />
      case "profile":
        return (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Profile Overview</TabsTrigger>
              <TabsTrigger value="submit">Submit Match</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <UserProfileEnhanced />
            </TabsContent>
            <TabsContent value="submit">
              <MatchSubmissionForm />
            </TabsContent>
          </Tabs>
        )
      case "settings":
        return <SettingsPage />
      case "demo-generator":
        return <DemoUserGeneratorPanel />
      case "discord-bot":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-bold flex items-center justify-center">
                <BotIcon className="h-8 w-8 mr-3 text-purple-500" />
                Discord Bot Management
              </h1>
              <p className="text-muted-foreground">
                Monitor, test, and manage your Discord bot integration with user-specific notifications
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DiscordStatus />
              <DiscordTestPanel />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <TeammateRequestForm />
            </div>
          </div>
        )
      default:
        return <div>Page not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <EnhancedNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
      />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">{renderContent()}</div>
      </main>

      <BackgroundMusicPlayer />
    </div>
  )
}

function AuthenticatedApp() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 text-primary animate-pulse mx-auto">⚡</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return <DashboardContent />
}

export default function AphroditeDashboard() {
  return <AuthenticatedApp />
}
