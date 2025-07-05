"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import {
  UsersIcon,
  TrophyIcon,
  TargetIcon,
  MessageCircleIcon,
  CalendarIcon,
  UserPlusIcon,
  SettingsIcon,
  CrownIcon,
  ShieldIcon,
  SwordIcon,
  XIcon,
} from "lucide-react"

interface TeamMember {
  id: number
  name: string
  avatar: string
  role: "Leader" | "Co-Leader" | "Member"
  rank: string
  winRate: number
  gamesPlayed: number
  isOnline: boolean
  preferredPosition: string
  joinedDate: Date
  stats: {
    kills: number
    deaths: number
    assists: number
  }
}

interface PracticeSession {
  id: number
  title: string
  date: Date
  duration: number
  type: "Practice" | "Scrim" | "Tournament" | "Review"
  participants: number[]
  description: string
}

interface TeamSettings {
  teamName: string
  isPrivate: boolean
  autoAcceptInvites: boolean
  requireApproval: boolean
  minRankRequirement: string
  notifications: {
    matchResults: boolean
    practiceReminders: boolean
    memberJoined: boolean
    achievements: boolean
  }
}

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "ShadowStrike",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Leader",
      rank: "Immortal II",
      winRate: 78,
      gamesPlayed: 156,
      isOnline: true,
      preferredPosition: "Duelist",
      joinedDate: new Date(Date.now() - 86400000 * 90),
      stats: { kills: 2847, deaths: 1923, assists: 1456 },
    },
    {
      id: 2,
      name: "ProGamer2024",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Co-Leader",
      rank: "Diamond III",
      winRate: 73,
      gamesPlayed: 134,
      isOnline: true,
      preferredPosition: "Controller",
      joinedDate: new Date(Date.now() - 86400000 * 60),
      stats: { kills: 2156, deaths: 1678, assists: 1834 },
    },
    {
      id: 3,
      name: "MysticHealer",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Member",
      rank: "Diamond II",
      winRate: 82,
      gamesPlayed: 98,
      isOnline: false,
      preferredPosition: "Sentinel",
      joinedDate: new Date(Date.now() - 86400000 * 30),
      stats: { kills: 1789, deaths: 1234, assists: 2156 },
    },
  ])

  const [practiceSchedule, setPracticeSchedule] = useState<PracticeSession[]>([
    {
      id: 1,
      title: "Practice Session",
      date: new Date(Date.now() + 86400000),
      duration: 120,
      type: "Practice",
      participants: [1, 2, 3],
      description: "Team coordination and strategy practice",
    },
    {
      id: 2,
      title: "Tournament Match",
      date: new Date(Date.now() + 86400000 * 2),
      duration: 180,
      type: "Tournament",
      participants: [1, 2, 3],
      description: "Championship qualifier match",
    },
  ])

  const [teamSettings, setTeamSettings] = useState<TeamSettings>({
    teamName: "Team Aphrodite",
    isPrivate: false,
    autoAcceptInvites: false,
    requireApproval: true,
    minRankRequirement: "Gold I",
    notifications: {
      matchResults: true,
      practiceReminders: true,
      memberJoined: true,
      achievements: true,
    },
  })

  const [teamStats] = useState({
    teamRank: "Diamond I",
    teamWinRate: 77,
    totalGames: 89,
    currentStreak: 5,
    bestStreak: 12,
    tournamentsWon: 3,
    totalEarnings: 2450,
  })

  // Modal states
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [statsModalOpen, setStatsModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)

  // Form states
  const [inviteForm, setInviteForm] = useState({
    username: "",
    message: "",
    role: "Member" as "Member" | "Co-Leader",
  })

  const [scheduleForm, setScheduleForm] = useState({
    title: "",
    date: "",
    time: "",
    duration: "120",
    type: "Practice" as "Practice" | "Scrim" | "Tournament" | "Review",
    description: "",
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Leader":
        return <CrownIcon className="h-4 w-4 text-yellow-500" />
      case "Co-Leader":
        return <ShieldIcon className="h-4 w-4 text-blue-500" />
      default:
        return <SwordIcon className="h-4 w-4 text-purple-500" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Leader":
        return "border-yellow-500/30 text-yellow-400"
      case "Co-Leader":
        return "border-blue-500/30 text-blue-400"
      default:
        return "border-purple-500/30 text-purple-400"
    }
  }

  const calculateKDA = (stats: { kills: number; deaths: number; assists: number }) => {
    return ((stats.kills + stats.assists) / Math.max(stats.deaths, 1)).toFixed(2)
  }

  const handleInviteMember = async () => {
    if (!inviteForm.username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username to invite",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Add new member (simulation)
    const newMember: TeamMember = {
      id: Date.now(),
      name: inviteForm.username,
      avatar: "/placeholder.svg?height=40&width=40",
      role: inviteForm.role,
      rank: "Unranked",
      winRate: 0,
      gamesPlayed: 0,
      isOnline: false,
      preferredPosition: "Flex",
      joinedDate: new Date(),
      stats: { kills: 0, deaths: 0, assists: 0 },
    }

    setTeamMembers((prev) => [...prev, newMember])
    setInviteForm({ username: "", message: "", role: "Member" })
    setInviteModalOpen(false)

    toast({
      title: "Invitation Sent!",
      description: `Invitation sent to ${inviteForm.username}`,
    })
  }

  const handleSchedulePractice = async () => {
    if (!scheduleForm.title.trim() || !scheduleForm.date || !scheduleForm.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newSession: PracticeSession = {
      id: Date.now(),
      title: scheduleForm.title,
      date: new Date(`${scheduleForm.date}T${scheduleForm.time}`),
      duration: Number.parseInt(scheduleForm.duration),
      type: scheduleForm.type,
      participants: teamMembers.map((m) => m.id),
      description: scheduleForm.description,
    }

    setPracticeSchedule((prev) => [...prev, newSession].sort((a, b) => a.date.getTime() - b.date.getTime()))
    setScheduleForm({
      title: "",
      date: "",
      time: "",
      duration: "120",
      type: "Practice",
      description: "",
    })
    setScheduleModalOpen(false)

    toast({
      title: "Practice Scheduled!",
      description: `${scheduleForm.title} scheduled for ${new Date(`${scheduleForm.date}T${scheduleForm.time}`).toLocaleString()}`,
    })
  }

  const handleSaveSettings = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSettingsModalOpen(false)
    toast({
      title: "Settings Saved!",
      description: "Team settings have been updated successfully",
    })
  }

  const removeMember = (memberId: number) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId))
    toast({
      title: "Member Removed",
      description: "Team member has been removed successfully",
    })
  }

  const updateMemberRole = (memberId: number, newRole: "Leader" | "Co-Leader" | "Member") => {
    setTeamMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)))
    toast({
      title: "Role Updated",
      description: "Member role has been updated successfully",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Team Management</h2>
        <div className="flex space-x-2">
          <Badge variant="outline" className="border-primary/30 text-primary">
            <UsersIcon className="h-3 w-3 mr-1" />
            {teamSettings.teamName}
          </Badge>
          <Badge variant="outline" className="border-green-500/30 text-green-400">
            <TrophyIcon className="h-3 w-3 mr-1" />
            {teamStats.tournamentsWon} Wins
          </Badge>
        </div>
      </div>

      {/* Team Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrophyIcon className="h-5 w-5 mr-2 text-primary" />
            {teamSettings.teamName} Overview
          </CardTitle>
          <CardDescription>Elite competitive gaming team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{teamStats.teamRank}</div>
              <div className="text-sm text-muted-foreground">Team Rank</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-green-500">{teamStats.teamWinRate}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-blue-500">{teamStats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-yellow-500">${teamStats.totalEarnings}</div>
              <div className="text-sm text-muted-foreground">Total Earnings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <Card
            key={member.id}
            className="bg-card border-border transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  {member.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{member.name}</h3>
                    {getRoleIcon(member.role)}
                  </div>
                  <Badge variant="outline" className={getRoleColor(member.role)}>
                    {member.role}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateMemberRole(member.id, member.role === "Member" ? "Co-Leader" : "Member")}
                  >
                    <ShieldIcon className="h-3 w-3" />
                  </Button>
                  {member.role !== "Leader" && (
                    <Button size="sm" variant="ghost" onClick={() => removeMember(member.id)}>
                      <XIcon className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Rank</div>
                  <div className="font-medium">{member.rank}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Position</div>
                  <div className="font-medium">{member.preferredPosition}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Win Rate</div>
                  <div className="font-medium text-green-500">{member.winRate}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Games</div>
                  <div className="font-medium">{member.gamesPlayed}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Performance</span>
                  <span>{member.winRate}%</span>
                </div>
                <Progress value={member.winRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">K/D/A Stats</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 rounded bg-muted/50">
                    <div className="font-bold text-green-500">{member.stats.kills}</div>
                    <div className="text-muted-foreground">Kills</div>
                  </div>
                  <div className="text-center p-2 rounded bg-muted/50">
                    <div className="font-bold text-red-500">{member.stats.deaths}</div>
                    <div className="text-muted-foreground">Deaths</div>
                  </div>
                  <div className="text-center p-2 rounded bg-muted/50">
                    <div className="font-bold text-blue-500">{member.stats.assists}</div>
                    <div className="text-muted-foreground">Assists</div>
                  </div>
                </div>
                <div className="text-center text-sm">
                  <span className="font-bold">KDA: {calculateKDA(member.stats)}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <MessageCircleIcon className="h-3 w-3 mr-1" />
                  Message
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <TargetIcon className="h-3 w-3 mr-1" />
                  Stats
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Joined {member.joinedDate.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
              Team Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {practiceSchedule.slice(0, 3).map((session, index) => (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium">{session.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {session.date.toLocaleDateString()} at{" "}
                    {session.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    session.type === "Tournament"
                      ? "border-red-500/30 text-red-400"
                      : session.type === "Scrim"
                        ? "border-orange-500/30 text-orange-400"
                        : "border-blue-500/30 text-blue-400"
                  }
                >
                  {session.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2 text-primary" />
              Team Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Invite New Member */}
            <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Invite New Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Invite New Team Member</DialogTitle>
                  <DialogDescription>Send an invitation to a player to join your team.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={inviteForm.username}
                      onChange={(e) => setInviteForm((prev) => ({ ...prev, username: e.target.value }))}
                      className="col-span-3"
                      placeholder="Enter player username"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value: "Member" | "Co-Leader") =>
                        setInviteForm((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Member">Member</SelectItem>
                        <SelectItem value="Co-Leader">Co-Leader</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="message" className="text-right">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      value={inviteForm.message}
                      onChange={(e) => setInviteForm((prev) => ({ ...prev, message: e.target.value }))}
                      className="col-span-3"
                      placeholder="Optional invitation message"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleInviteMember}>Send Invitation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Schedule Practice */}
            <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Schedule Practice
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Schedule Practice Session</DialogTitle>
                  <DialogDescription>Create a new practice session for your team.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={scheduleForm.title}
                      onChange={(e) => setScheduleForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="col-span-3"
                      placeholder="Practice session title"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={scheduleForm.date}
                      onChange={(e) => setScheduleForm((prev) => ({ ...prev, date: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={scheduleForm.time}
                      onChange={(e) => setScheduleForm((prev) => ({ ...prev, time: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={scheduleForm.type}
                      onValueChange={(value: "Practice" | "Scrim" | "Tournament" | "Review") =>
                        setScheduleForm((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Practice">Practice</SelectItem>
                        <SelectItem value="Scrim">Scrimmage</SelectItem>
                        <SelectItem value="Tournament">Tournament</SelectItem>
                        <SelectItem value="Review">Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">
                      Duration
                    </Label>
                    <Select
                      value={scheduleForm.duration}
                      onValueChange={(value) => setScheduleForm((prev) => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="180">3 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="description"
                      value={scheduleForm.description}
                      onChange={(e) => setScheduleForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="col-span-3"
                      placeholder="Session description or notes"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSchedulePractice}>Schedule Session</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* View Team Stats */}
            <Dialog open={statsModalOpen} onOpenChange={setStatsModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  <TrophyIcon className="h-4 w-4 mr-2" />
                  View Team Stats
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Detailed Team Statistics</DialogTitle>
                  <DialogDescription>Comprehensive performance metrics for {teamSettings.teamName}</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="matches">Matches</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-primary">{teamStats.teamRank}</div>
                        <div className="text-sm text-muted-foreground">Current Rank</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-green-500">{teamStats.teamWinRate}%</div>
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-blue-500">{teamStats.totalGames}</div>
                        <div className="text-sm text-muted-foreground">Total Games</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-purple-500">{teamStats.bestStreak}</div>
                        <div className="text-sm text-muted-foreground">Best Streak</div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="members" className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.rank}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{member.winRate}%</div>
                          <div className="text-sm text-muted-foreground">Win Rate</div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="matches" className="space-y-4">
                    <div className="text-center text-muted-foreground">Match history will be displayed here</div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* Team Settings */}
            <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Team Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Team Settings</DialogTitle>
                  <DialogDescription>Configure your team preferences and privacy settings.</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="teamName">Team Name</Label>
                        <Input
                          id="teamName"
                          value={teamSettings.teamName}
                          onChange={(e) => setTeamSettings((prev) => ({ ...prev, teamName: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Private Team</Label>
                          <div className="text-sm text-muted-foreground">Only invited members can join</div>
                        </div>
                        <Switch
                          checked={teamSettings.isPrivate}
                          onCheckedChange={(checked) => setTeamSettings((prev) => ({ ...prev, isPrivate: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto-accept Invites</Label>
                          <div className="text-sm text-muted-foreground">Automatically accept join requests</div>
                        </div>
                        <Switch
                          checked={teamSettings.autoAcceptInvites}
                          onCheckedChange={(checked) =>
                            setTeamSettings((prev) => ({ ...prev, autoAcceptInvites: checked }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minRank">Minimum Rank Requirement</Label>
                        <Select
                          value={teamSettings.minRankRequirement}
                          onValueChange={(value) => setTeamSettings((prev) => ({ ...prev, minRankRequirement: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Iron I">Iron I</SelectItem>
                            <SelectItem value="Bronze I">Bronze I</SelectItem>
                            <SelectItem value="Silver I">Silver I</SelectItem>
                            <SelectItem value="Gold I">Gold I</SelectItem>
                            <SelectItem value="Platinum I">Platinum I</SelectItem>
                            <SelectItem value="Diamond I">Diamond I</SelectItem>
                            <SelectItem value="Immortal I">Immortal I</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="notifications" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Match Results</Label>
                          <div className="text-sm text-muted-foreground">Notify when matches are completed</div>
                        </div>
                        <Switch
                          checked={teamSettings.notifications.matchResults}
                          onCheckedChange={(checked) =>
                            setTeamSettings((prev) => ({
                              ...prev,
                              notifications: { ...prev.notifications, matchResults: checked },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Practice Reminders</Label>
                          <div className="text-sm text-muted-foreground">Remind about upcoming practice sessions</div>
                        </div>
                        <Switch
                          checked={teamSettings.notifications.practiceReminders}
                          onCheckedChange={(checked) =>
                            setTeamSettings((prev) => ({
                              ...prev,
                              notifications: { ...prev.notifications, practiceReminders: checked },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Member Joined</Label>
                          <div className="text-sm text-muted-foreground">Notify when new members join</div>
                        </div>
                        <Switch
                          checked={teamSettings.notifications.memberJoined}
                          onCheckedChange={(checked) =>
                            setTeamSettings((prev) => ({
                              ...prev,
                              notifications: { ...prev.notifications, memberJoined: checked },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Achievements</Label>
                          <div className="text-sm text-muted-foreground">Notify about team achievements</div>
                        </div>
                        <Switch
                          checked={teamSettings.notifications.achievements}
                          onCheckedChange={(checked) =>
                            setTeamSettings((prev) => ({
                              ...prev,
                              notifications: { ...prev.notifications, achievements: checked },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <DialogFooter>
                  <Button onClick={handleSaveSettings}>Save Settings</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Recent Team Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Recent Team Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "Won tournament match", player: "Team Aphrodite", time: "2 hours ago", type: "win" },
              { action: "Completed practice session", player: "ShadowStrike", time: "1 day ago", type: "practice" },
              { action: "New member joined", player: "MysticHealer", time: "3 days ago", type: "join" },
              { action: "Strategy review completed", player: "ProGamer2024", time: "5 days ago", type: "meeting" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg border animate-in slide-in-from-left-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "win"
                      ? "bg-green-500"
                      : activity.type === "practice"
                        ? "bg-blue-500"
                        : activity.type === "join"
                          ? "bg-purple-500"
                          : "bg-yellow-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="text-sm">{activity.action}</div>
                  <div className="text-xs text-muted-foreground">
                    {activity.player} • {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
