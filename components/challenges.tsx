"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useGameStats } from "@/components/game-stats-provider"
import {
  TrophyIcon,
  TargetIcon,
  CalendarIcon,
  StarIcon,
  CoinsIcon,
  CheckCircleIcon,
  ClockIcon,
  FlameIcon,
  AwardIcon,
  TrendingUpIcon,
  SearchIcon,
  FilterIcon,
  PlayIcon,
  PauseIcon,
  LockIcon,
  UsersIcon,
  SwordIcon,
  ShieldIcon,
  CrownIcon,
  BoltIcon,
  HeartIcon,
  EyeIcon,
  BrainIcon,
  TimerIcon,
  GamepadIcon,
  MedalIcon,
  RocketIcon,
  DiamondIcon,
  SparklesIcon,
} from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "achievement" | "special" | "community"
  difficulty: "easy" | "medium" | "hard" | "extreme"
  category: "combat" | "skill" | "social" | "leadership" | "speed" | "versatility" | "performance" | "endurance"
  points: number
  progress: number
  maxProgress: number
  completed: boolean
  active: boolean
  locked: boolean
  expiresAt?: Date
  timeLimit?: number // in minutes
  icon: any // LucideIcon
  prerequisites?: string[]
  unlocks?: string[]
}

interface UserPoints {
  total: number
  available: number
  earned: number
  spent: number
}

const Challenges = () => {
  const { toast } = useToast()
  const { user } = useAuth()
  const { gameStats } = useGameStats()
  const [userPoints, setUserPoints] = useState<UserPoints>({
    total: 2450,
    available: 1850,
    earned: 2450,
    spent: 600,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [showCompleted, setShowCompleted] = useState(true)

  const [challenges, setChallenges] = useState<Challenge[]>([
    // Daily Challenges
    {
      id: "daily-1",
      title: "Win Streak Warrior",
      description: "Achieve a 5-game win streak in ranked matches",
      type: "daily",
      difficulty: "medium",
      category: "combat",
      points: 200,
      progress: 2,
      maxProgress: 5,
      completed: false,
      active: false,
      locked: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: TrophyIcon,
    },
    {
      id: "daily-2",
      title: "Precision Master",
      description: "Maintain 80%+ accuracy for 10 consecutive rounds",
      type: "daily",
      difficulty: "hard",
      category: "skill",
      points: 250,
      progress: 0,
      maxProgress: 10,
      completed: false,
      active: false,
      locked: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: TargetIcon,
    },
    {
      id: "daily-3",
      title: "Team Player",
      description: "Play 5 matches with your squad members",
      type: "daily",
      difficulty: "easy",
      category: "social",
      points: 100,
      progress: 5,
      maxProgress: 5,
      completed: true,
      active: false,
      locked: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: UsersIcon,
    },
    {
      id: "daily-4",
      title: "Speed Demon",
      description: "Complete 3 matches in under 90 minutes",
      type: "daily",
      difficulty: "medium",
      category: "speed",
      points: 150,
      progress: 1,
      maxProgress: 3,
      completed: false,
      active: false,
      locked: false,
      timeLimit: 90,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: BoltIcon,
    },
    {
      id: "daily-5",
      title: "Clutch King",
      description: "Win 3 clutch situations (1v2 or better)",
      type: "daily",
      difficulty: "hard",
      category: "performance",
      points: 300,
      progress: 0,
      maxProgress: 3,
      completed: false,
      active: false,
      locked: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: CrownIcon,
    },

    // Weekly Challenges
    {
      id: "weekly-1",
      title: "Rank Climber",
      description: "Gain 200 LP this week across all ranked games",
      type: "weekly",
      difficulty: "hard",
      category: "performance",
      points: 500,
      progress: 145,
      maxProgress: 200,
      completed: false,
      active: false,
      locked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      icon: TrendingUpIcon,
    },
    {
      id: "weekly-2",
      title: "Consistency Champion",
      description: "Maintain 70%+ win rate for 20 games",
      type: "weekly",
      difficulty: "extreme",
      category: "performance",
      points: 750,
      progress: 12,
      maxProgress: 20,
      completed: false,
      active: false,
      locked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      icon: DiamondIcon,
    },
    {
      id: "weekly-3",
      title: "Social Butterfly",
      description: "Add 10 new friends and play with 5 different people",
      type: "weekly",
      difficulty: "easy",
      category: "social",
      points: 200,
      progress: 3,
      maxProgress: 15,
      completed: false,
      active: false,
      locked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      icon: HeartIcon,
    },
    {
      id: "weekly-4",
      title: "Marathon Gamer",
      description: "Play for 25 hours total this week",
      type: "weekly",
      difficulty: "medium",
      category: "endurance",
      points: 400,
      progress: 18,
      maxProgress: 25,
      completed: false,
      active: false,
      locked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      icon: TimerIcon,
    },

    // Achievement Challenges
    {
      id: "achievement-1",
      title: "First Blood Legend",
      description: "Get first blood in 50 different matches",
      type: "achievement",
      difficulty: "medium",
      category: "combat",
      points: 400,
      progress: 42,
      maxProgress: 50,
      completed: false,
      active: false,
      locked: false,
      icon: SwordIcon,
      unlocks: ["achievement-2"],
    },
    {
      id: "achievement-2",
      title: "Ace Collector",
      description: "Achieve 10 ace rounds across all games",
      type: "achievement",
      difficulty: "extreme",
      category: "skill",
      points: 1000,
      progress: 3,
      maxProgress: 10,
      completed: false,
      active: false,
      locked: true,
      icon: SparklesIcon,
      prerequisites: ["achievement-1"],
    },
    {
      id: "achievement-3",
      title: "Team Captain",
      description: "Lead your team to victory in 25 matches",
      type: "achievement",
      difficulty: "hard",
      category: "leadership",
      points: 600,
      progress: 8,
      maxProgress: 25,
      completed: false,
      active: false,
      locked: false,
      icon: ShieldIcon,
    },
    {
      id: "achievement-4",
      title: "Versatility Master",
      description: "Win matches in 5 different game modes",
      type: "achievement",
      difficulty: "medium",
      category: "versatility",
      points: 350,
      progress: 3,
      maxProgress: 5,
      completed: false,
      active: false,
      locked: false,
      icon: GamepadIcon,
    },
    {
      id: "achievement-5",
      title: "Observer Elite",
      description: "Provide 100 callouts that lead to eliminations",
      type: "achievement",
      difficulty: "hard",
      category: "skill",
      points: 500,
      progress: 67,
      maxProgress: 100,
      completed: false,
      active: false,
      locked: false,
      icon: EyeIcon,
    },

    // Special Challenges
    {
      id: "special-1",
      title: "Weekend Warrior",
      description: "Play 15 matches during weekend hours",
      type: "special",
      difficulty: "easy",
      category: "endurance",
      points: 300,
      progress: 0,
      maxProgress: 15,
      completed: false,
      active: false,
      locked: false,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      icon: FlameIcon,
    },
    {
      id: "special-2",
      title: "Night Owl Champion",
      description: "Win 5 matches between 12 AM - 6 AM",
      type: "special",
      difficulty: "medium",
      category: "performance",
      points: 400,
      progress: 0,
      maxProgress: 5,
      completed: false,
      active: false,
      locked: false,
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      icon: MedalIcon,
    },
    {
      id: "special-3",
      title: "Comeback King",
      description: "Win 3 matches after being down 0-8 rounds",
      type: "special",
      difficulty: "extreme",
      category: "performance",
      points: 800,
      progress: 0,
      maxProgress: 3,
      completed: false,
      active: false,
      locked: false,
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      icon: RocketIcon,
    },

    // Community Challenges
    {
      id: "community-1",
      title: "Mentor Master",
      description: "Help 5 new players improve their rank",
      type: "community",
      difficulty: "medium",
      category: "leadership",
      points: 500,
      progress: 1,
      maxProgress: 5,
      completed: false,
      active: false,
      locked: false,
      icon: BrainIcon,
      unlocks: ["community-2"],
    },
    {
      id: "community-2",
      title: "Tournament Organizer",
      description: "Organize and host a community tournament",
      type: "community",
      difficulty: "hard",
      category: "leadership",
      points: 750,
      progress: 0,
      maxProgress: 1,
      completed: false,
      active: false,
      locked: true,
      icon: AwardIcon,
      prerequisites: ["community-1"],
    },
    {
      id: "community-3",
      title: "Content Creator",
      description: "Share 10 gameplay highlights with the community",
      type: "community",
      difficulty: "easy",
      category: "social",
      points: 250,
      progress: 4,
      maxProgress: 10,
      completed: false,
      active: false,
      locked: false,
      icon: StarIcon,
    },
  ])

  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])
  const [streakDays, setStreakDays] = useState(7)

  const isChallengeUnlocked = useCallback((challenge: Challenge, currentChallenges: Challenge[]) => {
    if (!challenge.prerequisites || challenge.prerequisites.length === 0) return true
    return challenge.prerequisites.every((prereqId) => {
      const prereqChallenge = currentChallenges.find((c) => c.id === prereqId)
      return prereqChallenge?.completed || false
    })
  }, [])

  const startChallenge = useCallback(
    (challengeId: string) => {
      setChallenges((prevChallenges) => {
        const challengeToStart = prevChallenges.find((c) => c.id === challengeId)
        if (
          !challengeToStart ||
          !isChallengeUnlocked(challengeToStart, prevChallenges) ||
          challengeToStart.active ||
          challengeToStart.completed ||
          challengeToStart.locked
        ) {
          if (challengeToStart && (challengeToStart.locked || !isChallengeUnlocked(challengeToStart, prevChallenges))) {
            toast({
              title: "Challenge Locked",
              description: "Complete prerequisite challenges first.",
              variant: "destructive",
            })
          }
          return prevChallenges
        }

        toast({
          title: "Challenge Started!",
          description: `You've started "${challengeToStart.title}"`,
        })

        return prevChallenges.map((challenge) =>
          challenge.id === challengeId ? { ...challenge, active: true } : challenge,
        )
      })
    },
    [isChallengeUnlocked, toast],
  )

  const stopChallenge = useCallback(
    (challengeId: string) => {
      setChallenges((prevChallenges) =>
        prevChallenges.map((challenge) => {
          if (challenge.id === challengeId && challenge.active) {
            toast({
              title: "Challenge Paused",
              description: `"${challenge.title}" has been paused`,
            })
            return { ...challenge, active: false }
          }
          return challenge
        }),
      )
    },
    [toast],
  )

  const addProgress = useCallback(
    (challengeId: string, amount = 1) => {
      setChallenges((prevChall) =>
        prevChall.map((challenge) => {
          if (challenge.id === challengeId && challenge.active && !challenge.completed) {
            const newProgress = Math.min(challenge.progress + amount, challenge.maxProgress)
            const isCompleted = newProgress >= challenge.maxProgress
            let updatedChallenge = { ...challenge, progress: newProgress }

            if (isCompleted) {
              updatedChallenge = { ...updatedChallenge, completed: true, active: false }
              setUserPoints((points) => ({
                ...points,
                total: points.total + challenge.points,
                available: points.available + challenge.points,
                earned: points.earned + challenge.points,
              }))

              toast({
                title: "Challenge Completed! 🎉",
                description: `You earned ${challenge.points} Aphrodite Points for "${challenge.title}"!`,
              })

              // Send user-specific Discord notification
              fetch("/api/discord", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "user_challenge_completed",
                  data: {
                    username: user?.displayName || "Anonymous Player",
                    challengeTitle: challenge.title,
                    points: challenge.points,
                    difficulty: challenge.difficulty,
                    userStats: {
                      currentRank: gameStats.currentRank,
                      winRate: gameStats.winRate,
                      kda: gameStats.kda,
                      gamesPlayed: gameStats.gamesPlayed,
                      weeklyLP: gameStats.weeklyLP,
                      hoursPlayed: gameStats.hoursPlayed,
                      recentMatches: gameStats.recentMatches,
                    },
                    userAvatar: user?.photoURL,
                  },
                }),
              }).catch((error) => {
                console.error("Failed to send Discord notification:", error)
              })
            }
            return updatedChallenge
          }
          return challenge
        }),
      )
    },
    [toast, user, gameStats],
  )

  // Effect for unlocking challenges when prerequisites are met
  useEffect(() => {
    let madeChanges = false
    const newlyUnlockedTitles: string[] = []

    const newChallengesState = challenges.map((challenge) => {
      if (challenge.locked && isChallengeUnlocked(challenge, challenges)) {
        madeChanges = true
        newlyUnlockedTitles.push(challenge.title)
        return { ...challenge, locked: false }
      }
      return challenge
    })

    if (madeChanges) {
      setChallenges(newChallengesState)
      newlyUnlockedTitles.forEach((title) => {
        toast({ title: "Challenge Unlocked!", description: `"${title}" is now available.` })
      })
    }
  }, [challenges, isChallengeUnlocked, toast])

  const filteredChallenges = challenges.filter((challenge) => {
    const unlocked = isChallengeUnlocked(challenge, challenges) && !challenge.locked
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || challenge.category === categoryFilter
    const matchesDifficulty = difficultyFilter === "all" || challenge.difficulty === difficultyFilter
    const matchesCompleted = showCompleted || !challenge.completed

    return unlocked && matchesSearch && matchesCategory && matchesDifficulty && matchesCompleted
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "border-green-500/30 text-green-400"
      case "medium":
        return "border-yellow-500/30 text-yellow-400"
      case "hard":
        return "border-red-500/30 text-red-400"
      case "extreme":
        return "border-purple-500/30 text-purple-400"
      default:
        return "border-gray-500/30 text-gray-400"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "bg-blue-500/20 text-blue-300"
      case "weekly":
        return "bg-purple-500/20 text-purple-300"
      case "achievement":
        return "bg-orange-500/20 text-orange-300"
      case "special":
        return "bg-pink-500/20 text-pink-300"
      case "community":
        return "bg-green-500/20 text-green-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "combat":
        return SwordIcon
      case "skill":
        return TargetIcon
      case "social":
        return UsersIcon
      case "leadership":
        return ShieldIcon
      case "speed":
        return BoltIcon
      case "versatility":
        return GamepadIcon
      case "performance":
        return TrophyIcon
      case "endurance":
        return TimerIcon
      default:
        return StarIcon
    }
  }

  useEffect(() => {
    setActiveChallenges(challenges.filter((c) => c.active))
  }, [challenges])

  const dailyChallenges = filteredChallenges.filter((c) => c.type === "daily")
  const weeklyChallenges = filteredChallenges.filter((c) => c.type === "weekly")
  const achievements = filteredChallenges.filter((c) => c.type === "achievement")
  const specialChallenges = filteredChallenges.filter((c) => c.type === "special")
  const communityChallenges = filteredChallenges.filter((c) => c.type === "community")

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-700">
      {/* Header with Points */}
      <div className="flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
        <div className="flex items-center space-x-3">
          <TrophyIcon className="h-8 w-8 text-primary animate-bounce" />
          <div>
            <h2 className="text-2xl font-semibold">Challenges</h2>
            <p className="text-sm text-muted-foreground">Complete tasks to earn Aphrodite Points</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CoinsIcon className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-lg font-bold text-primary">{userPoints.available.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Available Points</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FlameIcon className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-lg font-bold text-orange-500">{streakDays}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Challenges Panel */}
      {activeChallenges.length > 0 && (
        <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20 animate-in slide-in-from-right-4 duration-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PlayIcon className="h-5 w-5 mr-2 text-green-500" />
              Active Challenges ({activeChallenges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeChallenges.map((challenge) => (
                <Card key={challenge.id} className="bg-card/50 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <challenge.icon className="h-5 w-5 text-green-500" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => stopChallenge(challenge.id)}
                        className="h-6 px-2"
                      >
                        <PauseIcon className="h-3 w-3" />
                      </Button>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{challenge.title}</h4>
                    <div className="space-y-2">
                      <Progress value={(challenge.progress / challenge.maxProgress) * 100} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {challenge.progress}/{challenge.maxProgress}
                        </span>
                        <Button size="sm" onClick={() => addProgress(challenge.id)} className="h-6 px-2 text-xs">
                          +1 Progress
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="bg-card/50 backdrop-blur-sm animate-in slide-in-from-left-4 duration-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="combat">Combat</SelectItem>
                  <SelectItem value="skill">Skill</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="speed">Speed</SelectItem>
                  <SelectItem value="versatility">Versatility</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="extreme">Extreme</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowCompleted(!showCompleted)}
                className={`w-full md:w-auto ${showCompleted ? "bg-primary/10" : ""}`}
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                {showCompleted ? "Hide" : "Show"} Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="daily" className="transition-all duration-300 hover:scale-105">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Daily ({dailyChallenges.filter((c) => !c.completed).length})
          </TabsTrigger>
          <TabsTrigger value="weekly" className="transition-all duration-300 hover:scale-105">
            <TrophyIcon className="h-4 w-4 mr-2" />
            Weekly ({weeklyChallenges.filter((c) => !c.completed).length})
          </TabsTrigger>
          <TabsTrigger value="achievements" className="transition-all duration-300 hover:scale-105">
            <AwardIcon className="h-4 w-4 mr-2" />
            Achievements ({achievements.filter((c) => !c.completed).length})
          </TabsTrigger>
          <TabsTrigger value="special" className="transition-all duration-300 hover:scale-105">
            <SparklesIcon className="h-4 w-4 mr-2" />
            Special ({specialChallenges.filter((c) => !c.completed).length})
          </TabsTrigger>
          <TabsTrigger value="community" className="transition-all duration-300 hover:scale-105">
            <UsersIcon className="h-4 w-4 mr-2" />
            Community ({communityChallenges.filter((c) => !c.completed).length})
          </TabsTrigger>
        </TabsList>

        {[
          { key: "daily", challenges: dailyChallenges, title: "Daily Challenges" },
          { key: "weekly", challenges: weeklyChallenges, title: "Weekly Challenges" },
          { key: "achievements", challenges: achievements, title: "Achievements" },
          { key: "special", challenges: specialChallenges, title: "Special Events" },
          { key: "community", challenges: communityChallenges, title: "Community Challenges" },
        ].map(({ key, challenges: tabChallenges, title }) => (
          <TabsContent key={key} value={key} className="space-y-4">
            {tabChallenges.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No {title.toLowerCase().replace(" challenges", "").replace(" events", "")} challenges found matching
                your filters.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tabChallenges.map((challenge, index) => {
                const unlocked = isChallengeUnlocked(challenge, challenges) && !challenge.locked
                const CategoryIcon = getCategoryIcon(challenge.category)

                return (
                  <Dialog key={challenge.id}>
                    <DialogTrigger asChild>
                      <Card
                        className={`bg-card border-border transition-all duration-500 hover:scale-105 hover:shadow-lg animate-in slide-in-from-bottom-4 cursor-pointer ${
                          challenge.completed
                            ? "border-green-500/30 bg-green-500/5"
                            : challenge.active
                              ? "border-blue-500/30 bg-blue-500/5"
                              : !unlocked
                                ? "border-gray-500/30 bg-gray-500/5 opacity-60 cursor-not-allowed"
                                : ""
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={(e) => {
                          if (!unlocked) e.preventDefault()
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <challenge.icon className="h-6 w-6 text-primary" />
                              <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex space-x-2">
                              {!unlocked && <LockIcon className="h-4 w-4 text-gray-500" title="Locked" />}
                              <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                                {challenge.difficulty}
                              </Badge>
                              <Badge className={getTypeColor(challenge.type)}>{challenge.type}</Badge>
                            </div>
                          </div>
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <CardDescription className="h-10 overflow-hidden text-ellipsis">
                            {challenge.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>
                                {challenge.progress}/{challenge.maxProgress}
                              </span>
                            </div>
                            <Progress
                              value={(challenge.progress / challenge.maxProgress) * 100}
                              className="h-2 transition-all duration-300"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CoinsIcon className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-primary">{challenge.points} pts</span>
                            </div>
                            {challenge.expiresAt && (
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <ClockIcon className="h-3 w-3" />
                                <span>
                                  {challenge.type === "daily"
                                    ? `${Math.ceil(Math.max(0, challenge.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))}h left`
                                    : `${Math.ceil(Math.max(0, challenge.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left`}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {challenge.completed ? (
                              <Button
                                className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                                disabled
                              >
                                <CheckCircleIcon className="h-4 w-4 mr-2" />
                                Completed
                              </Button>
                            ) : challenge.active ? (
                              <>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    addProgress(challenge.id)
                                  }}
                                  className="flex-1"
                                  disabled={!unlocked}
                                >
                                  +1 Progress
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    stopChallenge(challenge.id)
                                  }}
                                  className="px-3"
                                  disabled={!unlocked}
                                >
                                  <PauseIcon className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (unlocked) startChallenge(challenge.id)
                                }}
                                className="flex-1"
                                disabled={!unlocked}
                              >
                                {!unlocked ? (
                                  <LockIcon className="h-4 w-4 mr-2" />
                                ) : (
                                  <PlayIcon className="h-4 w-4 mr-2" />
                                )}
                                {!unlocked ? "Locked" : "Start Challenge"}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    {unlocked && (
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <challenge.icon className="h-6 w-6 text-primary" />
                            <span>{challenge.title}</span>
                          </DialogTitle>
                          <DialogDescription className="space-y-4 pt-2">
                            <p>{challenge.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-semibold">Difficulty:</span>
                                <Badge variant="outline" className={`ml-2 ${getDifficultyColor(challenge.difficulty)}`}>
                                  {challenge.difficulty}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-semibold">Category:</span>
                                <Badge variant="secondary" className="ml-2">
                                  {challenge.category}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-semibold">Reward:</span>
                                <span className="ml-2 text-primary font-bold">{challenge.points} pts</span>
                              </div>
                              <div>
                                <span className="font-semibold">Progress:</span>
                                <span className="ml-2">
                                  {challenge.progress}/{challenge.maxProgress}
                                </span>
                              </div>
                            </div>
                            {challenge.prerequisites && challenge.prerequisites.length > 0 && (
                              <div>
                                <span className="font-semibold">Prerequisites:</span>
                                <ul className="list-disc list-inside ml-2 text-xs">
                                  {challenge.prerequisites.map((prereqId) => {
                                    const prereq = challenges.find((c) => c.id === prereqId)
                                    return (
                                      <li
                                        key={prereqId}
                                        className={prereq?.completed ? "text-green-400 line-through" : "text-red-400"}
                                      >
                                        {prereq?.title} {prereq?.completed ? "(Completed)" : "(Pending)"}
                                      </li>
                                    )
                                  })}
                                </ul>
                              </div>
                            )}
                            {challenge.timeLimit && (
                              <div>
                                <span className="font-semibold">Time Limit:</span>
                                <span className="ml-2">{challenge.timeLimit} minutes</span>
                              </div>
                            )}
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    )}
                  </Dialog>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default Challenges
