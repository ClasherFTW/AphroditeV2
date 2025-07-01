"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SettingsPage from "@/components/settings-page"
import {
  EditIcon,
  TrophyIcon,
  CalendarIcon,
  MapPinIcon,
  GamepadIcon,
  AwardIcon,
  UsersIcon,
  ClockIcon,
  TargetIcon,
  CrownIcon,
  ZapIcon,
  SettingsIcon,
} from "lucide-react"

interface UserStats {
  totalGamesPlayed: number
  totalHoursPlayed: number
  averageWinRate: number
  bestRank: string
  currentStreak: number
  friendsCount: number
  achievementsUnlocked: number
  totalAchievements: number
}

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedDate?: Date
}

export default function UserProfileDashboard() {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    displayName: "ProGamer2024",
    bio: "Competitive gamer passionate about FPS games. Always looking to improve and climb the ranks!",
    location: "United States",
    favoriteGame: "Valorant",
    joinDate: new Date("2023-01-15"),
    website: "https://twitch.tv/progamer2024",
    discordTag: "ProGamer2024#1337",
  })

  const [userStats] = useState<UserStats>({
    totalGamesPlayed: 1247,
    totalHoursPlayed: 892,
    averageWinRate: 73,
    bestRank: "Immortal I",
    currentStreak: 7,
    friendsCount: 156,
    achievementsUnlocked: 47,
    totalAchievements: 120,
  })

  const [achievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "First Blood Master",
      description: "Get 1000 first kills",
      icon: "🎯",
      rarity: "epic",
      progress: 847,
      maxProgress: 1000,
      unlocked: false,
    },
    {
      id: 2,
      title: "Clutch King",
      description: "Win 100 1v3+ clutches",
      icon: "👑",
      rarity: "legendary",
      progress: 100,
      maxProgress: 100,
      unlocked: true,
      unlockedDate: new Date("2024-11-15"),
    },
    {
      id: 3,
      title: "Rank Climber",
      description: "Reach Diamond rank",
      icon: "💎",
      rarity: "rare",
      progress: 100,
      maxProgress: 100,
      unlocked: true,
      unlockedDate: new Date("2024-10-22"),
    },
    {
      id: 4,
      title: "Team Player",
      description: "Play 500 matches with friends",
      icon: "👥",
      rarity: "epic",
      progress: 342,
      maxProgress: 500,
      unlocked: false,
    },
    {
      id: 5,
      title: "Headshot Specialist",
      description: "Achieve 70% headshot rate",
      icon: "🔫",
      rarity: "legendary",
      progress: 68,
      maxProgress: 70,
      unlocked: false,
    },
    {
      id: 6,
      title: "Marathon Gamer",
      description: "Play for 1000 hours",
      icon: "⏰",
      rarity: "rare",
      progress: 892,
      maxProgress: 1000,
      unlocked: false,
    },
  ])

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

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Here you would typically save to a backend
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">User Profile</h2>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "default" : "outline"}>
          <EditIcon className="h-4 w-4 mr-2" />
          {isEditing ? "Save Profile" : "Edit Profile"}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-black/20 backdrop-blur-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Profile Header */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-pink-400">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="bg-pink-500/20 text-pink-300 text-2xl">
                      {userInfo.displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-black flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-white/80">Display Name</Label>
                        <Input
                          value={userInfo.displayName}
                          onChange={(e) => setUserInfo({ ...userInfo, displayName: e.target.value })}
                          className="bg-black/20 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white/80">Bio</Label>
                        <Textarea
                          value={userInfo.bio}
                          onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                          className="bg-black/20 border-white/20 text-white"
                          rows={3}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                          <span>{userInfo.displayName}</span>
                          <Badge variant="outline" className="border-yellow-400 text-yellow-300">
                            <CrownIcon className="h-3 w-3 mr-1" />
                            {userStats.bestRank}
                          </Badge>
                        </h1>
                        <p className="text-white/60">{userInfo.bio}</p>
                      </div>
                    </>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-white/80">
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{userInfo.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Joined {userInfo.joinDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GamepadIcon className="h-4 w-4" />
                      <span>Favorite: {userInfo.favoriteGame}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Badge variant="outline" className="border-green-400 text-green-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Online
                  </Badge>
                  <Badge variant="outline" className="border-purple-400 text-purple-300">
                    Level 47
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <GamepadIcon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.totalGamesPlayed.toLocaleString()}</div>
                <div className="text-xs text-white/60">Games Played</div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <ClockIcon className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.totalHoursPlayed}h</div>
                <div className="text-xs text-white/60">Hours Played</div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <TargetIcon className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.averageWinRate}%</div>
                <div className="text-xs text-white/60">Win Rate</div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <UsersIcon className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.friendsCount}</div>
                <div className="text-xs text-white/60">Friends</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <TrophyIcon className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-white">Achieved new rank: Diamond III</p>
                  <p className="text-xs text-white/60">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <AwardIcon className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-white">Unlocked achievement: Clutch King</p>
                  <p className="text-xs text-white/60">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <ZapIcon className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm text-white">Won 7 games in a row</p>
                  <p className="text-xs text-white/60">2 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`bg-black/20 border-white/10 backdrop-blur-sm ${
                  achievement.unlocked ? "ring-2 ring-green-500/30" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white">{achievement.title}</h3>
                        <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                        {achievement.unlocked && (
                          <Badge variant="outline" className="border-green-400 text-green-300">
                            ✓ Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/60">{achievement.description}</p>
                      {achievement.unlocked && achievement.unlockedDate && (
                        <p className="text-xs text-white/40 mt-1">
                          Unlocked {achievement.unlockedDate.toLocaleDateString()}
                        </p>
                      )}
                      {!achievement.unlocked && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-white/60 mb-1">
                            <span>Progress</span>
                            <span>
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Current Streak</span>
                  <span className="text-green-400 font-bold">{userStats.currentStreak} wins</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Best Rank</span>
                  <span className="text-yellow-400 font-bold">{userStats.bestRank}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Achievements</span>
                  <span className="text-purple-400 font-bold">
                    {userStats.achievementsUnlocked}/{userStats.totalAchievements}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Game Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Valorant</span>
                    <span className="text-white/60">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">CS2</span>
                    <span className="text-white/60">30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Overwatch 2</span>
                    <span className="text-white/60">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Social Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Friends</span>
                  <span className="text-blue-400 font-bold">{userStats.friendsCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Teams Joined</span>
                  <span className="text-green-400 font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Tournaments</span>
                  <span className="text-purple-400 font-bold">8</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SettingsPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
