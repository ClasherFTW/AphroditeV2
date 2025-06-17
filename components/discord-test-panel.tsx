"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useGameStats } from "@/components/game-stats-provider"
import {
  TestTubeIcon,
  CheckCircleIcon,
  XCircleIcon,
  LoaderIcon,
  TrophyIcon,
  TrendingUpIcon,
  UsersIcon,
  BotIcon,
  AlertCircleIcon,
  SparklesIcon,
} from "lucide-react"

export default function DiscordTestPanel() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { gameStats } = useGameStats()
  const [testResults, setTestResults] = useState<Record<string, "pending" | "success" | "error">>({})
  const [isTestingAll, setIsTestingAll] = useState(false)

  const runTest = async (testType: string, testData: any) => {
    setTestResults((prev) => ({ ...prev, [testType]: "pending" }))

    try {
      const response = await fetch("/api/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: testType,
          data: testData,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      setTestResults((prev) => ({ ...prev, [testType]: "success" }))
      toast({
        title: "Test Successful! ✅",
        description: `${testType.replace("_", " ")} test completed successfully.`,
      })
    } catch (error) {
      console.error(`Test ${testType} failed:`, error)
      setTestResults((prev) => ({ ...prev, [testType]: "error" }))
      toast({
        title: "Test Failed ❌",
        description: `${testType.replace("_", " ")} test failed. Check console for details.`,
        variant: "destructive",
      })
    }
  }

  const runAllTests = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to run user-specific tests.",
        variant: "destructive",
      })
      return
    }

    setIsTestingAll(true)

    const tests = [
      {
        type: "user_challenge_completed",
        data: {
          username: user.displayName || "Test User",
          challengeTitle: "Test Challenge Master",
          points: 500,
          difficulty: "hard",
          userStats: gameStats,
          userAvatar: user.photoURL,
        },
      },
      {
        type: "user_leaderboard_update",
        data: {
          username: user.displayName || "Test User",
          oldPosition: 15,
          newPosition: 8,
          points: 2450,
          userStats: gameStats,
          userAvatar: user.photoURL,
        },
      },
      {
        type: "user_rank_up",
        data: {
          username: user.displayName || "Test User",
          gameType: "valorant",
          oldRank: "Gold 2",
          newRank: "Gold 3",
          userStats: gameStats,
          userAvatar: user.photoURL,
        },
      },
    ]

    for (const test of tests) {
      await runTest(test.type, test.data)
      // Add delay between tests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    setIsTestingAll(false)
  }

  const getStatusIcon = (status: "pending" | "success" | "error" | undefined) => {
    switch (status) {
      case "pending":
        return <LoaderIcon className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircleIcon className="h-4 w-4 text-red-500" />
      default:
        return <TestTubeIcon className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: "pending" | "success" | "error" | undefined) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-blue-500 border-blue-500/30">
            Testing...
          </Badge>
        )
      case "success":
        return (
          <Badge variant="outline" className="text-green-500 border-green-500/30">
            Success
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="text-red-500 border-red-500/30">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">Ready</Badge>
    }
  }

  if (!user) {
    return (
      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircleIcon className="h-6 w-6 mr-3 text-yellow-500" />
            Authentication Required
          </CardTitle>
          <CardDescription>Please log in to test user-specific Discord notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            User authentication is required to run personalized Discord tests.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BotIcon className="h-6 w-6 mr-3 text-purple-500" />
          Discord Test Panel
        </CardTitle>
        <CardDescription>
          Test user-specific Discord notifications with your current stats and profile data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info Preview */}
        <div className="p-4 bg-muted/30 rounded-lg border">
          <h4 className="font-semibold mb-3 flex items-center">
            <SparklesIcon className="h-4 w-4 mr-2 text-primary" />
            Your Test Profile
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Username:</span>
              <div className="font-medium">{user.displayName || "Anonymous Player"}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Current Rank:</span>
              <div className="font-medium">{gameStats.currentRank}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Win Rate:</span>
              <div className="font-medium text-green-500">{gameStats.winRate}%</div>
            </div>
            <div>
              <span className="text-muted-foreground">K/D/A:</span>
              <div className="font-medium text-blue-500">{gameStats.kda}</div>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">User-Specific Tests</h4>
            <Button
              onClick={runAllTests}
              disabled={isTestingAll}
              variant="outline"
              className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20"
            >
              {isTestingAll ? (
                <>
                  <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                  Running All Tests...
                </>
              ) : (
                <>
                  <TestTubeIcon className="h-4 w-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Challenge Completion Test */}
            <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border">
              <div className="flex items-center space-x-3">
                {getStatusIcon(testResults.user_challenge_completed)}
                <div>
                  <div className="font-medium flex items-center">
                    <TrophyIcon className="h-4 w-4 mr-2 text-orange-500" />
                    Challenge Completion
                  </div>
                  <div className="text-xs text-muted-foreground">Test user-specific challenge notification</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(testResults.user_challenge_completed)}
                <Button
                  size="sm"
                  onClick={() =>
                    runTest("user_challenge_completed", {
                      username: user.displayName || "Test User",
                      challengeTitle: "Test Challenge Master",
                      points: 500,
                      difficulty: "hard",
                      userStats: gameStats,
                      userAvatar: user.photoURL,
                    })
                  }
                  disabled={testResults.user_challenge_completed === "pending"}
                >
                  Test
                </Button>
              </div>
            </div>

            {/* Leaderboard Update Test */}
            <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border">
              <div className="flex items-center space-x-3">
                {getStatusIcon(testResults.user_leaderboard_update)}
                <div>
                  <div className="font-medium flex items-center">
                    <TrendingUpIcon className="h-4 w-4 mr-2 text-blue-500" />
                    Leaderboard Climb
                  </div>
                  <div className="text-xs text-muted-foreground">Test user-specific leaderboard notification</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(testResults.user_leaderboard_update)}
                <Button
                  size="sm"
                  onClick={() =>
                    runTest("user_leaderboard_update", {
                      username: user.displayName || "Test User",
                      oldPosition: 15,
                      newPosition: 8,
                      points: 2450,
                      userStats: gameStats,
                      userAvatar: user.photoURL,
                    })
                  }
                  disabled={testResults.user_leaderboard_update === "pending"}
                >
                  Test
                </Button>
              </div>
            </div>

            {/* Rank Up Test */}
            <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border">
              <div className="flex items-center space-x-3">
                {getStatusIcon(testResults.user_rank_up)}
                <div>
                  <div className="font-medium flex items-center">
                    <TrophyIcon className="h-4 w-4 mr-2 text-purple-500" />
                    Rank Progression
                  </div>
                  <div className="text-xs text-muted-foreground">Test user-specific rank up notification</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(testResults.user_rank_up)}
                <Button
                  size="sm"
                  onClick={() =>
                    runTest("user_rank_up", {
                      username: user.displayName || "Test User",
                      gameType: "valorant",
                      oldRank: "Gold 2",
                      newRank: "Gold 3",
                      userStats: gameStats,
                      userAvatar: user.photoURL,
                    })
                  }
                  disabled={testResults.user_rank_up === "pending"}
                >
                  Test
                </Button>
              </div>
            </div>

            {/* Teammate Request Test */}
            <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border">
              <div className="flex items-center space-x-3">
                {getStatusIcon(testResults.teammate_request)}
                <div>
                  <div className="font-medium flex items-center">
                    <UsersIcon className="h-4 w-4 mr-2 text-pink-500" />
                    Teammate Request (@everyone)
                  </div>
                  <div className="text-xs text-muted-foreground">Test teammate request with user stats</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(testResults.teammate_request)}
                <Button
                  size="sm"
                  onClick={() =>
                    runTest("teammate_request", {
                      username: user.displayName || "Test User",
                      gameType: "Valorant",
                      currentRank: gameStats.currentRank,
                      preferredRole: "Duelist",
                      message: "Looking for skilled teammates to climb ranked! Let's dominate together! 🚀",
                      userStats: gameStats,
                      userAvatar: user.photoURL,
                    })
                  }
                  disabled={testResults.teammate_request === "pending"}
                >
                  Test
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results Summary */}
        {Object.keys(testResults).length > 0 && (
          <div className="p-4 bg-muted/20 rounded-lg border">
            <h4 className="font-semibold mb-2">Test Results Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {Object.values(testResults).filter((r) => r === "success").length}
                </div>
                <div className="text-muted-foreground">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {Object.values(testResults).filter((r) => r === "error").length}
                </div>
                <div className="text-muted-foreground">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">
                  {Object.values(testResults).filter((r) => r === "pending").length}
                </div>
                <div className="text-muted-foreground">Running</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
