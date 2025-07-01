"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { MessageCircle, Send, Play, Pause, Trash2, Save, Plus, Edit, X } from "lucide-react"

// Message types
interface ChatMessage {
  id: number
  userId: string
  username: string
  content: string
  timestamp: Date
  type: "text" | "system" | "voice" | "image"
  avatar?: string
  game?: "valorant" | "csgo" | "general"
}

// Player profiles
interface Player {
  id: string
  username: string
  status: "online" | "away" | "busy" | "offline"
  avatar?: string
  isTyping?: boolean
  lastSeen?: Date
  game?: "Valorant" | "CS2"
  rank?: string
}

// Default players
const PLAYERS: Player[] = [
  {
    id: "p1",
    username: "ShadowStrike",
    status: "online",
    avatar: "/placeholder.svg?height=40&width=40",
    game: "Valorant",
    rank: "Immortal 2",
  },
  {
    id: "p2",
    username: "NeonBlaze",
    status: "online",
    avatar: "/placeholder.svg?height=40&width=40",
    game: "CS2",
    rank: "Global Elite",
  },
  {
    id: "p3",
    username: "QuantumGamer",
    status: "online",
    avatar: "/placeholder.svg?height=40&width=40",
    game: "Valorant",
    rank: "Diamond 3",
  },
  {
    id: "p4",
    username: "CyberNinja",
    status: "online",
    avatar: "/placeholder.svg?height=40&width=40",
    game: "CS2",
    rank: "Supreme",
  },
]

// Message templates by category and game
const MESSAGE_TEMPLATES = {
  valorant: {
    callouts: [
      "They're pushing A main!",
      "Sage wall mid",
      "Jett on top of boxes",
      "Omen teleported behind us",
      "Viper ult on site",
      "Chamber op watching B long",
      "Reyna dismissed to heaven",
      "Sova dart incoming!",
      "Killjoy ult planted on site",
      "Breach flash through wall",
    ],
    strategy: [
      "Let's fake A then go B",
      "Save this round, full buy next",
      "I'll smoke CT, you flash in",
      "Play retake, don't contest",
      "Stack B this round",
      "Let's play default and look for picks",
      "Slow push and wait for rotations",
      "I'll drone in first, follow me",
      "Save your ult for next round",
      "Let's do a fast A execute",
    ],
    comms: [
      "Nice shot!",
      "One enemy remaining",
      "I'm low, falling back",
      "Need healing",
      "Watching your flank",
      "Spike planted",
      "Defusing spike!",
      "Enemy spotted",
      "Reloading, cover me",
      "I'll watch heaven",
    ],
    economy: [
      "Can someone buy me a Vandal?",
      "I'll drop you an Operator",
      "Save this round",
      "Let's force buy",
      "I have ult, save your credits",
      "Drop the spike please",
      "I can buy for someone",
      "Should we save or force?",
      "Full buy next round",
      "I'll play with a Sheriff this round",
    ],
  },
  csgo: {
    callouts: [
      "Two crossing mid",
      "AWP watching long",
      "One palace, one jungle",
      "They're rushing B",
      "Smoke CT",
      "Flash through mid",
      "One connector, one stairs",
      "Bomb dropped at T spawn",
      "He's lit 87",
      "Last guy saving",
    ],
    strategy: [
      "Let's go B split through mid",
      "Eco this round, buy next",
      "I'll entry A, flash me in",
      "Play for picks this round",
      "Stack A this round",
      "Let's do a mid to B split",
      "Save your utility for retake",
      "Fake B then go A",
      "Rush B, don't stop",
      "Default setup, play for info",
    ],
    comms: [
      "Nice clutch!",
      "Bomb has been planted",
      "Defusing, cover me",
      "I'm flashed!",
      "Watching your back",
      "Enemy down",
      "Reloading",
      "Need backup at B",
      "Rotating to A",
      "Last seen at CT",
    ],
    economy: [
      "Can I get a drop?",
      "I'll drop AWP next round",
      "Force buy this round",
      "Save for AWP",
      "Drop me AK please",
      "I'll buy utility",
      "Full save this round",
      "Buy kevlar only",
      "I can drop for two",
      "Let's do a glass cannon AWP",
    ],
  },
  general: {
    greeting: [
      "Hey team",
      "What's up everyone",
      "Ready to win?",
      "Let's get this W",
      "Good luck today",
      "How's everyone doing?",
      "Let's have a good game",
      "Anyone got a mic?",
      "Team comms check",
      "Hey, can everyone hear me?",
    ],
    teamwork: [
      "Nice teamwork!",
      "Great job everyone",
      "We're playing well together",
      "Keep up the communication",
      "Good calls everyone",
      "Let's focus up",
      "We got this",
      "Stay positive team",
      "Don't tilt, we can come back",
      "One round at a time",
    ],
    questions: [
      "What's our plan this round?",
      "Should we save or force?",
      "Anyone want to switch positions?",
      "Can someone watch flank?",
      "Where do you want me to play?",
      "Need any utility?",
      "Want to duo push?",
      "Anyone know where they like to play?",
      "What went wrong last round?",
      "Should we play aggressive or passive?",
    ],
  },
}

// Conversation scenarios
const SCENARIOS = {
  matchStart: [
    { game: "valorant", category: "greeting", delay: 0 },
    { game: "general", category: "greeting", delay: 2000 },
    { game: "general", category: "questions", delay: 4000 },
    { game: "valorant", category: "strategy", delay: 7000 },
    { game: "valorant", category: "economy", delay: 10000 },
  ],
  midRound: [
    { game: "valorant", category: "callouts", delay: 0 },
    { game: "valorant", category: "callouts", delay: 1500 },
    { game: "valorant", category: "comms", delay: 3000 },
    { game: "valorant", category: "callouts", delay: 4500 },
    { game: "valorant", category: "comms", delay: 6000 },
  ],
  postRound: [
    { game: "valorant", category: "comms", delay: 0 },
    { game: "general", category: "teamwork", delay: 2000 },
    { game: "valorant", category: "economy", delay: 4000 },
    { game: "valorant", category: "strategy", delay: 7000 },
    { game: "general", category: "questions", delay: 10000 },
  ],
  csgoStart: [
    { game: "csgo", category: "greeting", delay: 0 },
    { game: "general", category: "greeting", delay: 2000 },
    { game: "general", category: "questions", delay: 4000 },
    { game: "csgo", category: "strategy", delay: 7000 },
    { game: "csgo", category: "economy", delay: 10000 },
  ],
  csgoMidRound: [
    { game: "csgo", category: "callouts", delay: 0 },
    { game: "csgo", category: "callouts", delay: 1500 },
    { game: "csgo", category: "comms", delay: 3000 },
    { game: "csgo", category: "callouts", delay: 4500 },
    { game: "csgo", category: "comms", delay: 6000 },
  ],
}

// Custom scenario type
interface CustomScenario {
  name: string
  messages: {
    game: "valorant" | "csgo" | "general"
    category: string
    delay: number
  }[]
}

export default function TeamChatSimulator() {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [players, setPlayers] = useState<Player[]>(PLAYERS)
  const [activeScenario, setActiveScenario] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [selectedGame, setSelectedGame] = useState<"valorant" | "csgo">("valorant")
  const [messageSpeed, setMessageSpeed] = useState(1) // 1 = normal, 0.5 = slow, 2 = fast
  const [customScenarios, setCustomScenarios] = useState<CustomScenario[]>([])
  const [editingScenario, setEditingScenario] = useState<CustomScenario | null>(null)
  const [newScenarioName, setNewScenarioName] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Function to get a random message from a category
  const getRandomMessage = (game: "valorant" | "csgo" | "general", category: string): string => {
    if (game === "general") {
      const categoryMessages = MESSAGE_TEMPLATES.general[category as keyof typeof MESSAGE_TEMPLATES.general]
      return categoryMessages[Math.floor(Math.random() * categoryMessages.length)]
    } else if (game === "valorant") {
      const categoryMessages = MESSAGE_TEMPLATES.valorant[category as keyof typeof MESSAGE_TEMPLATES.valorant]
      return categoryMessages[Math.floor(Math.random() * categoryMessages.length)]
    } else {
      const categoryMessages = MESSAGE_TEMPLATES.csgo[category as keyof typeof MESSAGE_TEMPLATES.csgo]
      return categoryMessages[Math.floor(Math.random() * categoryMessages.length)]
    }
  }

  // Function to get a random player
  const getRandomPlayer = (): Player => {
    const onlinePlayers = players.filter((p) => p.status === "online")
    return onlinePlayers[Math.floor(Math.random() * onlinePlayers.length)]
  }

  // Function to simulate typing
  const simulateTyping = (playerId: string, duration: number) => {
    setTypingUsers((prev) => new Set(prev).add(playerId))

    const timeout = setTimeout(() => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(playerId)
        return newSet
      })
    }, duration)

    timeoutsRef.current.push(timeout)
  }

  // Function to add a message
  const addMessage = (
    content: string,
    player: Player,
    type: ChatMessage["type"] = "text",
    game?: "valorant" | "csgo" | "general",
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now() + Math.random(),
      userId: player.id,
      username: player.username,
      content,
      timestamp: new Date(),
      type,
      avatar: player.avatar,
      game: game as any,
    }

    setMessages((prev) => [...prev, newMessage])
  }

  // Function to simulate a scenario
  const simulateScenario = (scenarioName: string) => {
    // Clear previous timeouts
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    setActiveScenario(scenarioName)
    setIsSimulating(true)

    let scenario: { game: string; category: string; delay: number }[] = []

    // Check if it's a built-in scenario
    if (scenarioName in SCENARIOS) {
      scenario = SCENARIOS[scenarioName as keyof typeof SCENARIOS]
    }
    // Check if it's a custom scenario
    else {
      const customScenario = customScenarios.find((s) => s.name === scenarioName)
      if (customScenario) {
        scenario = customScenario.messages
      }
    }

    // Run the scenario
    scenario.forEach((step, index) => {
      // Simulate typing first
      const player = getRandomPlayer()
      const typingDuration = Math.random() * 1000 + 500 // 500-1500ms typing time

      const typingTimeout = setTimeout(() => {
        simulateTyping(player.id, typingDuration)
      }, step.delay / messageSpeed)

      timeoutsRef.current.push(typingTimeout)

      // Then add the message
      const messageTimeout = setTimeout(
        () => {
          const content = getRandomMessage(step.game as any, step.category)
          addMessage(content, player, "text", step.game as any)

          // If this is the last message, set simulating to false
          if (index === scenario.length - 1) {
            setIsSimulating(false)
            setActiveScenario(null)
          }
        },
        (step.delay + typingDuration) / messageSpeed,
      )

      timeoutsRef.current.push(messageTimeout)
    })
  }

  // Function to stop simulation
  const stopSimulation = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setIsSimulating(false)
    setActiveScenario(null)
    setTypingUsers(new Set())
  }

  // Function to clear chat
  const clearChat = () => {
    stopSimulation()
    setMessages([])
  }

  // Function to send a user message
  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now() + Math.random(),
      userId: "user",
      username: "You",
      content: inputMessage,
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate a response
    if (Math.random() < 0.7) {
      // 70% chance of response
      const player = getRandomPlayer()
      const typingDuration = Math.random() * 2000 + 1000 // 1-3 seconds

      setTimeout(() => {
        simulateTyping(player.id, typingDuration)
      }, 500)

      setTimeout(() => {
        // Choose a relevant category based on user message
        let category = "comms"
        const lowerMessage = inputMessage.toLowerCase()

        if (lowerMessage.includes("rush") || lowerMessage.includes("push") || lowerMessage.includes("strat")) {
          category = "strategy"
        } else if (lowerMessage.includes("a site") || lowerMessage.includes("b site") || lowerMessage.includes("mid")) {
          category = "callouts"
        } else if (lowerMessage.includes("buy") || lowerMessage.includes("eco") || lowerMessage.includes("save")) {
          category = "economy"
        }

        const content = getRandomMessage(selectedGame, category)
        addMessage(content, player, "text", selectedGame)
      }, 500 + typingDuration)
    }
  }

  // Function to create a new custom scenario
  const createCustomScenario = () => {
    if (!newScenarioName.trim()) return

    const newScenario: CustomScenario = {
      name: newScenarioName,
      messages: [
        { game: selectedGame, category: "greeting", delay: 0 },
        { game: "general", category: "teamwork", delay: 3000 },
        { game: selectedGame, category: "strategy", delay: 6000 },
      ],
    }

    setCustomScenarios([...customScenarios, newScenario])
    setNewScenarioName("")
  }

  // Function to save edited scenario
  const saveEditedScenario = () => {
    if (!editingScenario) return

    setCustomScenarios(customScenarios.map((s) => (s.name === editingScenario.name ? editingScenario : s)))

    setEditingScenario(null)
  }

  // Function to delete a custom scenario
  const deleteCustomScenario = (name: string) => {
    setCustomScenarios(customScenarios.filter((s) => s.name !== name))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Team Chat Simulator</h2>
        <div className="flex items-center space-x-2">
          <Select value={selectedGame} onValueChange={(value: "valorant" | "csgo") => setSelectedGame(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="valorant">Valorant</SelectItem>
              <SelectItem value="csgo">CS:GO</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={clearChat} className="flex items-center">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Team Chat
                </CardTitle>
                <CardDescription>
                  {isSimulating ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                      Simulating: {activeScenario}
                    </span>
                  ) : (
                    "Simulate team communication"
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="speed" className="text-sm">
                    Speed:
                  </Label>
                  <Slider
                    id="speed"
                    min={0.5}
                    max={2}
                    step={0.5}
                    value={[messageSpeed]}
                    onValueChange={(value) => setMessageSpeed(value[0])}
                    className="w-24"
                  />
                  <span className="text-xs">{messageSpeed}x</span>
                </div>
                {isSimulating ? (
                  <Button size="sm" variant="destructive" onClick={stopSimulation}>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                ) : null}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Start a simulation or send a message.</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.userId === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.userId === "user"
                            ? "bg-primary text-primary-foreground"
                            : message.type === "system"
                              ? "bg-muted text-muted-foreground"
                              : "bg-secondary text-secondary-foreground"
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
                            {message.game && (
                              <Badge variant="outline" className="text-xs">
                                {message.game}
                              </Badge>
                            )}
                          </div>
                        )}
                        <div className="text-sm">{message.content}</div>
                        <p className="text-xs opacity-60 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
                )}

                {/* Typing indicators */}
                {Array.from(typingUsers).map((userId) => {
                  const user = players.find((p) => p.id === userId)
                  if (!user) return null

                  return (
                    <div key={`typing-${userId}`} className="flex justify-start">
                      <div className="bg-muted text-muted-foreground rounded-lg p-3 max-w-[80%]">
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
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <span className="text-xs text-muted-foreground ml-2">typing...</span>
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
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={isSimulating}
              />
              <Button onClick={sendMessage} disabled={isSimulating || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scenarios Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Scenarios
            </CardTitle>
            <CardDescription>Select a scenario to simulate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="valorant">
              <TabsList className="w-full">
                <TabsTrigger value="valorant" className="flex-1">
                  Valorant
                </TabsTrigger>
                <TabsTrigger value="csgo" className="flex-1">
                  CS:GO
                </TabsTrigger>
                <TabsTrigger value="custom" className="flex-1">
                  Custom
                </TabsTrigger>
              </TabsList>

              <TabsContent value="valorant" className="space-y-2 mt-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => simulateScenario("matchStart")}
                  disabled={isSimulating}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Match Start
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => simulateScenario("midRound")}
                  disabled={isSimulating}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Mid-Round Callouts
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => simulateScenario("postRound")}
                  disabled={isSimulating}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Post-Round Discussion
                </Button>
              </TabsContent>

              <TabsContent value="csgo" className="space-y-2 mt-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => simulateScenario("csgoStart")}
                  disabled={isSimulating}
                >
                  <Play className="h-4 w-4 mr-2" />
                  CS:GO Match Start
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => simulateScenario("csgoMidRound")}
                  disabled={isSimulating}
                >
                  <Play className="h-4 w-4 mr-2" />
                  CS:GO Mid-Round
                </Button>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4 mt-2">
                {customScenarios.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4">
                    <p>No custom scenarios yet.</p>
                  </div>
                ) : (
                  customScenarios.map((scenario) => (
                    <div key={scenario.name} className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        className="flex-1 justify-start mr-2"
                        onClick={() => simulateScenario(scenario.name)}
                        disabled={isSimulating}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {scenario.name}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingScenario(scenario)}
                        disabled={isSimulating}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCustomScenario(scenario.name)}
                        disabled={isSimulating}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}

                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="New scenario name"
                    value={newScenarioName}
                    onChange={(e) => setNewScenarioName(e.target.value)}
                    disabled={isSimulating}
                  />
                  <Button onClick={createCustomScenario} disabled={isSimulating || !newScenarioName.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Message Categories */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Quick Messages</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    const player = getRandomPlayer()
                    const content = getRandomMessage(selectedGame, "callouts")
                    addMessage(content, player, "text", selectedGame)
                  }}
                  disabled={isSimulating}
                >
                  Callout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    const player = getRandomPlayer()
                    const content = getRandomMessage(selectedGame, "strategy")
                    addMessage(content, player, "text", selectedGame)
                  }}
                  disabled={isSimulating}
                >
                  Strategy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    const player = getRandomPlayer()
                    const content = getRandomMessage(selectedGame, "comms")
                    addMessage(content, player, "text", selectedGame)
                  }}
                  disabled={isSimulating}
                >
                  Comms
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    const player = getRandomPlayer()
                    const content = getRandomMessage(selectedGame, "economy")
                    addMessage(content, player, "text", selectedGame)
                  }}
                  disabled={isSimulating}
                >
                  Economy
                </Button>
              </div>
            </div>

            {/* Players */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Active Players</h4>
              <div className="space-y-1">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={player.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{player.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{player.username}</span>
                    </div>
                    <Badge variant={player.status === "online" ? "default" : "secondary"}>{player.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Scenario Dialog */}
      {editingScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Scenario: {editingScenario.name}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setEditingScenario(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingScenario.messages.map((message, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Select
                    value={message.game}
                    onValueChange={(value) => {
                      const newMessages = [...editingScenario.messages]
                      newMessages[index].game = value as any
                      setEditingScenario({ ...editingScenario, messages: newMessages })
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Game" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="valorant">Valorant</SelectItem>
                      <SelectItem value="csgo">CS:GO</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={message.category}
                    onValueChange={(value) => {
                      const newMessages = [...editingScenario.messages]
                      newMessages[index].category = value
                      setEditingScenario({ ...editingScenario, messages: newMessages })
                    }}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {message.game === "general" ? (
                        <>
                          <SelectItem value="greeting">Greeting</SelectItem>
                          <SelectItem value="teamwork">Teamwork</SelectItem>
                          <SelectItem value="questions">Questions</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="callouts">Callouts</SelectItem>
                          <SelectItem value="strategy">Strategy</SelectItem>
                          <SelectItem value="comms">Comms</SelectItem>
                          <SelectItem value="economy">Economy</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    value={message.delay}
                    onChange={(e) => {
                      const newMessages = [...editingScenario.messages]
                      newMessages[index].delay = Number.parseInt(e.target.value)
                      setEditingScenario({ ...editingScenario, messages: newMessages })
                    }}
                    className="w-[100px]"
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newMessages = editingScenario.messages.filter((_, i) => i !== index)
                      setEditingScenario({ ...editingScenario, messages: newMessages })
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const newMessages = [...editingScenario.messages]
                  newMessages.push({
                    game: selectedGame,
                    category: "comms",
                    delay:
                      editingScenario.messages.length > 0
                        ? editingScenario.messages[editingScenario.messages.length - 1].delay + 3000
                        : 0,
                  })
                  setEditingScenario({ ...editingScenario, messages: newMessages })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Message
              </Button>

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setEditingScenario(null)}>
                  Cancel
                </Button>
                <Button onClick={saveEditedScenario}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
