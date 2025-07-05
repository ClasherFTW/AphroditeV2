"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageCircleIcon,
  SendIcon,
  UsersIcon,
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  SettingsIcon,
  UserPlusIcon,
  MoreVerticalIcon,
  SmileIcon,
  ImageIcon,
  PhoneIcon,
  PhoneOffIcon,
} from "lucide-react"

interface ChatMessage {
  id: number
  userId: string
  username: string
  content: string
  timestamp: Date
  type: "text" | "system" | "voice" | "image"
  avatar?: string
}

interface TeamMember {
  id: string
  username: string
  status: "online" | "away" | "busy" | "offline"
  avatar?: string
  isTyping?: boolean
  lastSeen?: Date
  game?: string
  rank?: string
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    username: "ShadowStrike",
    status: "online",
    avatar: "/placeholder.svg?height=32&width=32",
    game: "Valorant",
    rank: "Immortal 2",
  },
  {
    id: "2",
    username: "NeonBlaze",
    status: "online",
    avatar: "/placeholder.svg?height=32&width=32",
    game: "CS2",
    rank: "Global Elite",
  },
  {
    id: "3",
    username: "QuantumGamer",
    status: "away",
    avatar: "/placeholder.svg?height=32&width=32",
    game: "Overwatch 2",
    rank: "Grandmaster",
  },
  {
    id: "4",
    username: "CyberNinja",
    status: "busy",
    avatar: "/placeholder.svg?height=32&width=32",
    game: "Apex Legends",
    rank: "Predator",
  },
  {
    id: "5",
    username: "PhoenixRising",
    status: "offline",
    avatar: "/placeholder.svg?height=32&width=32",
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    game: "League of Legends",
    rank: "Challenger",
  },
]

// Realistic conversation templates for different scenarios
const CONVERSATION_TEMPLATES = {
  gameStart: [
    "Ready for some ranked games?",
    "Let's warm up in DM first",
    "Who's calling strats today?",
    "My aim is on point today 🎯",
    "Anyone want to duo queue?",
  ],
  midGame: [
    "Nice clutch! 🔥",
    "That was a clean headshot",
    "We need to work on our rotations",
    "Their economy is broken, let's force",
    "Watch out for the flanker",
    "Good comms team!",
  ],
  postGame: [
    "GG everyone, that was intense",
    "We're getting better as a team",
    "That last round was crazy",
    "Anyone up for another?",
    "I need to practice my aim more",
    "Great teamwork today!",
  ],
  casual: [
    "What's everyone playing today?",
    "Did you see that new update?",
    "Anyone tried the new map yet?",
    "My internet has been laggy today",
    "Coffee break? ☕",
    "Check out this sick play I made",
  ],
  strategy: [
    "We should practice our executes",
    "Let's review that last match",
    "I found a new smoke lineup",
    "Their playstyle is very aggressive",
    "We need better coordination",
    "Focus on crosshair placement",
  ],
}

export default function TeammatesChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      userId: "system",
      username: "System",
      content: "Welcome to the team chat! 🎮",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      type: "system",
    },
    {
      id: 2,
      userId: "1",
      username: "ShadowStrike",
      content: "Hey everyone! Ready for some ranked games today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      type: "text",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      userId: "2",
      username: "NeonBlaze",
      content: "I've been practicing my spray control all morning 🎯",
      timestamp: new Date(Date.now() - 1000 * 60 * 43), // 43 minutes ago
      type: "text",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(TEAM_MEMBERS)
  const [isVoiceConnected, setIsVoiceConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [simulateConversation, setSimulateConversation] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Simulate realistic conversation between team members
  useEffect(() => {
    if (!simulateConversation) return

    const simulateMessage = () => {
      const onlineMembers = teamMembers.filter((member) => member.status === "online" && member.id !== "user")
      if (onlineMembers.length === 0) return

      const randomMember = onlineMembers[Math.floor(Math.random() * onlineMembers.length)]
      const messageCategories = Object.keys(CONVERSATION_TEMPLATES)
      const randomCategory = messageCategories[Math.floor(Math.random() * messageCategories.length)]
      const templates = CONVERSATION_TEMPLATES[randomCategory as keyof typeof CONVERSATION_TEMPLATES]
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)]

      // Show typing indicator first
      setTypingUsers((prev) => new Set(prev).add(randomMember.id))

      // Realistic typing delay based on message length
      const typingDelay = Math.max(2000, randomTemplate.length * 50 + Math.random() * 2000)

      setTimeout(() => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(randomMember.id)
          return newSet
        })

        const newMessage: ChatMessage = {
          id: messages.length + Math.random() * 1000,
          userId: randomMember.id,
          username: randomMember.username,
          content: randomTemplate,
          timestamp: new Date(),
          type: "text",
          avatar: randomMember.avatar,
        }

        setMessages((prev) => [...prev, newMessage])
      }, typingDelay)
    }

    // Random intervals between 30 seconds to 3 minutes
    const interval = setInterval(simulateMessage, Math.random() * 150000 + 30000)
    return () => clearInterval(interval)
  }, [simulateConversation, teamMembers, messages.length])

  // Simulate status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTeamMembers((prev) =>
        prev.map((member) => {
          // Randomly change status occasionally
          if (Math.random() < 0.1) {
            const statuses: TeamMember["status"][] = ["online", "away", "busy", "offline"]
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
            return { ...member, status: newStatus }
          }
          return member
        }),
      )
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return

      const newMessage: ChatMessage = {
        id: messages.length + 1,
        userId: "user",
        username: "You",
        content: content.trim(),
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, newMessage])
      setInputMessage("")

      // Simulate responses to user messages occasionally
      if (Math.random() < 0.3) {
        const onlineMembers = teamMembers.filter((member) => member.status === "online" && member.id !== "user")
        if (onlineMembers.length > 0) {
          const responder = onlineMembers[Math.floor(Math.random() * onlineMembers.length)]

          // Show typing indicator
          setTypingUsers((prev) => new Set(prev).add(responder.id))

          setTimeout(
            () => {
              setTypingUsers((prev) => {
                const newSet = new Set(prev)
                newSet.delete(responder.id)
                return newSet
              })

              const responses = [
                "Agreed! 👍",
                "Good point",
                "Let's do it!",
                "I'm in",
                "Sounds good to me",
                "Nice idea",
                "For sure!",
                "Let's go! 🚀",
              ]

              const response: ChatMessage = {
                id: messages.length + Math.random() * 1000,
                userId: responder.id,
                username: responder.username,
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date(),
                type: "text",
                avatar: responder.avatar,
              }

              setMessages((prev) => [...prev, response])
            },
            Math.random() * 3000 + 1000,
          ) // 1-4 second delay
        }
      }
    },
    [messages.length, teamMembers],
  )

  const getStatusColor = (status: TeamMember["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-400"
      case "away":
        return "bg-yellow-400"
      case "busy":
        return "bg-red-400"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: TeamMember["status"]) => {
    switch (status) {
      case "online":
        return "Online"
      case "away":
        return "Away"
      case "busy":
        return "Busy"
      case "offline":
        return "Offline"
      default:
        return "Unknown"
    }
  }

  const formatLastSeen = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Team Chat</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-green-400 text-green-300">
            <UsersIcon className="h-3 w-3 mr-1" />
            {teamMembers.filter((m) => m.status === "online").length} Online
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSimulateConversation(!simulateConversation)}
            className="text-white/80 hover:bg-white/10"
          >
            {simulateConversation ? "Pause Simulation" : "Resume Simulation"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <Card className="lg:col-span-3 bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center">
                  <MessageCircleIcon className="h-5 w-5 mr-2 text-blue-400" />
                  Team Chat
                </CardTitle>
                <CardDescription className="text-white/60">Coordinate with your teammates in real-time</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={() => setIsVoiceConnected(!isVoiceConnected)}
                  className={`${
                    isVoiceConnected
                      ? "bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/30"
                      : "bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 border-gray-500/30"
                  }`}
                >
                  {isVoiceConnected ? <PhoneIcon className="h-4 w-4" /> : <PhoneOffIcon className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={!isVoiceConnected}
                  className={`${
                    isMuted
                      ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30"
                      : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30"
                  }`}
                >
                  {isMuted ? <MicOffIcon className="h-4 w-4" /> : <MicIcon className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  disabled={!isVoiceConnected}
                  className={`${
                    isVideoOn
                      ? "bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/30"
                      : "bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 border-gray-500/30"
                  }`}
                >
                  {isVideoOn ? <VideoIcon className="h-4 w-4" /> : <VideoOffIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-96 w-full rounded-md border border-white/10 p-4 bg-black/10" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.userId === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.userId === "user"
                          ? "bg-blue-500/20 text-blue-100 border border-blue-500/30"
                          : message.type === "system"
                            ? "bg-gray-500/20 text-gray-100 border border-gray-500/30"
                            : "bg-green-500/20 text-green-100 border border-green-500/30"
                      }`}
                    >
                      {message.userId !== "user" && message.type !== "system" && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={message.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {message.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-semibold">{message.username}</span>
                        </div>
                      )}
                      <div className="text-sm">{message.content}</div>
                      <p className="text-xs opacity-60 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}

                {/* Typing indicators */}
                {Array.from(typingUsers).map((userId) => {
                  const user = teamMembers.find((m) => m.id === userId)
                  if (!user) return null

                  return (
                    <div key={`typing-${userId}`} className="flex justify-start">
                      <div className="bg-gray-500/20 text-gray-100 border border-gray-500/30 rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-semibold">{user.username}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <span className="text-xs text-gray-400 ml-2">typing...</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(inputMessage)}
                className="bg-black/20 border-white/20 text-white placeholder:text-white/40"
              />
              <Button className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30">
                <SmileIcon className="h-4 w-4" />
              </Button>
              <Button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => sendMessage(inputMessage)}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Sidebar */}
        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <UsersIcon className="h-5 w-5 mr-2 text-green-400" />
              Team Members
            </CardTitle>
            <CardDescription className="text-white/60">
              {teamMembers.filter((m) => m.status === "online").length} of {teamMembers.length} online
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{member.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${getStatusColor(member.status)}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-white truncate">{member.username}</p>
                    {typingUsers.has(member.id) && (
                      <span className="text-xs text-gray-400 animate-pulse">typing...</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        member.status === "online"
                          ? "border-green-400 text-green-300"
                          : member.status === "away"
                            ? "border-yellow-400 text-yellow-300"
                            : member.status === "busy"
                              ? "border-red-400 text-red-300"
                              : "border-gray-400 text-gray-300"
                      }`}
                    >
                      {getStatusText(member.status)}
                    </Badge>
                  </div>
                  {member.status === "online" && member.game && (
                    <p className="text-xs text-white/60">Playing {member.game}</p>
                  )}
                  {member.status === "offline" && member.lastSeen && (
                    <p className="text-xs text-white/60">Last seen {formatLastSeen(member.lastSeen)}</p>
                  )}
                </div>
                <Button size="sm" variant="ghost" className="text-white/60 hover:text-white">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 mt-4">
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Invite Friend
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Voice Chat Status */}
      {isVoiceConnected && (
        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-white">Voice Chat Connected</span>
                </div>
                <Badge variant="outline" className="border-green-400 text-green-300">
                  {teamMembers.filter((m) => m.status === "online").length} in voice
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-white/60">
                  {isMuted ? "Muted" : "Unmuted"} • {isVideoOn ? "Video On" : "Video Off"}
                </span>
                <Button size="sm" variant="outline" className="text-white/80 hover:bg-white/10">
                  <SettingsIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
