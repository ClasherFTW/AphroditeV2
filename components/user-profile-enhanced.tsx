"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { UserProfileService, type UserProfile, type Match } from "@/lib/firestore"
import { Loader2, Trophy, Target, Clock, Users, AlertTriangle } from "lucide-react"

export default function UserProfileEnhanced() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const loadUserData = async () => {
      try {
        setLoading(true)

        // Create/update user profile
        await UserProfileService.createUserProfile(user)

        // Fetch user profile
        const userProfile = await UserProfileService.getUserProfile(user.uid)
        setProfile(userProfile)

        // Fetch recent matches
        const response = await fetch(`/api/matches?uid=${user.uid}&limit=5`)
        const data = await response.json()
        if (data.success) {
          setMatches(data.matches)
        }

        console.log("✅ User data loaded successfully")
      } catch (error) {
        console.error("❌ Error loading user data:", error)
        setError("Failed to load user data")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()

    // Set up real-time profile listener
    const unsubscribe = UserProfileService.subscribeToUserProfile(user.uid, (updatedProfile) => {
      if (updatedProfile) {
        setProfile(updatedProfile)
        console.log("🔄 Profile updated in real-time")
      }
    })

    return () => unsubscribe()
  }, [user])

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading profile...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!profile) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Profile not found</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.photoURL || "/placeholder.svg"} alt={profile.displayName} />
              <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{profile.displayName}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">
                  <Users className="h-3 w-3 mr-1" />
                  {profile.friends.length} Friends
                </Badge>
                <Badge variant="outline">
                  <Trophy className="h-3 w-3 mr-1" />
                  {profile.teams.length} Teams
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Member since</div>
              <div className="font-medium">{profile.createdAt.toLocaleDateString()}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Game Statistics */}
      <Tabs defaultValue="valorant" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="valorant">Valorant</TabsTrigger>
          <TabsTrigger value="cs2">Counter-Strike 2</TabsTrigger>
        </TabsList>

        <TabsContent value="valorant" className="space-y-4">
          <GameStatsCard gameStats={profile.gameStats.valorant} gameType="Valorant" />
        </TabsContent>

        <TabsContent value="cs2" className="space-y-4">
          <GameStatsCard gameStats={profile.gameStats.cs2} gameType="Counter-Strike 2" />
        </TabsContent>
      </Tabs>

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Matches</CardTitle>
          <CardDescription>Your latest game results</CardDescription>
        </CardHeader>
        <CardContent>
          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${match.result === "win" ? "bg-green-500" : "bg-red-500"}`} />
                    <div>
                      <div className="font-medium">
                        {match.result === "win" ? "Victory" : "Defeat"} - {match.score}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {match.map} • {match.gameType.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {match.kills}/{match.deaths}/{match.assists}
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(match.date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No matches recorded yet</p>
              <p className="text-sm">Submit your first match to see statistics here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function GameStatsCard({ gameStats, gameType }: { gameStats: any; gameType: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Current Rank</span>
          </div>
          <div className="text-2xl font-bold mt-2">{gameStats.rank}</div>
          <div className="text-xs text-muted-foreground">+{gameStats.weeklyLP} LP this week</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Win Rate</span>
          </div>
          <div className="text-2xl font-bold mt-2 text-green-500">{gameStats.winRate}%</div>
          <div className="text-xs text-muted-foreground">{gameStats.gamesPlayed} games played</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">K/D/A</span>
          </div>
          <div className="text-2xl font-bold mt-2 text-blue-500">{gameStats.kda}</div>
          <div className="text-xs text-muted-foreground">Average per game</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Playtime</span>
          </div>
          <div className="text-2xl font-bold mt-2 text-purple-500">{gameStats.hoursPlayed}h</div>
          <div className="text-xs text-muted-foreground">Total in {gameType}</div>
        </CardContent>
      </Card>
    </div>
  )
}
