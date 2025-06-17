"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGameStats } from "@/components/game-stats-provider"
import { useChat } from "ai/react"
import PhotoAnalysis from "./photo-analysis"
import {
  SendIcon,
  GamepadIcon,
  UserIcon,
  RefreshCwIcon,
  MessageCircleIcon,
  SparklesIcon,
  ZapIcon,
  BrainIcon,
  TrendingUpIcon,
  CameraIcon,
  DatabaseIcon,
} from "lucide-react"

// Enhanced knowledge base loaded from CSV data
const ENHANCED_KNOWLEDGE_BASE = [
  {
    category: "aim_training",
    subcategory: "crosshair_placement",
    keywords: ["aim", "crosshair", "placement", "head", "level"],
    response: `**Crosshair Placement Tips:**

• Keep crosshair at head level at all times
• Pre-aim common angles and corners
• Adjust for different elevation levels
• Practice crosshair placement in DM before ranked
• Use the wall method: trace walls at head height
• Watch pro player crosshair placement demos

**Valorant Specific:**
• Pre-aim default plant positions
• Adjust for agent abilities (Sage wall, etc.)
• Practice on Aim Lab crosshair placement scenarios

**CS2 Specific:**
• Learn common peek angles on each map
• Practice pre-aiming with different weapons
• Use workshop maps for crosshair training`,
    game: "both",
    confidence: 0.95,
    tags: ["aim", "crosshair", "fundamentals"],
  },
  {
    category: "aim_training",
    subcategory: "sensitivity",
    keywords: ["sensitivity", "sens", "dpi", "edpi", "mouse"],
    response: `**Finding Your Perfect Sensitivity:**

• **eDPI Range:** 200-400 for most players
• **Formula:** DPI × In-game sensitivity = eDPI
• **Testing Method:**
  1. Start with 300 eDPI
  2. Adjust ±50 until comfortable
  3. Stick with it for 2+ weeks
  4. Fine-tune by ±10-20

**Valorant Settings:**
• Most pros use 240-320 eDPI
• Raw Input: ON
• Mouse Acceleration: OFF

**CS2 Settings:**
• Most pros use 200-300 eDPI
• Raw Input: 1
• Mouse Acceleration: 0

**Important:** Consistency > Perfect number. Find what works and stick with it!`,
    game: "both",
    confidence: 0.9,
    tags: ["sensitivity", "settings", "mouse"],
  },
  {
    category: "mental_game",
    subcategory: "tilt_management",
    keywords: ["tilt", "tilting", "mental", "mindset", "toxic", "rage"],
    response: `**Anti-Tilt Strategies:**

**Immediate Actions:**
• Take deep breaths between rounds
• Mute toxic players instantly
• Focus on your own gameplay, not teammates
• Take breaks after 2 consecutive losses

**Mindset Shifts:**
• Focus on improvement, not rank
• Every death is a learning opportunity
• Bad games happen to everyone, even pros
• Your rank reflects long-term performance

**Pre-Game Preparation:**
• Warm up properly to build confidence
• Set realistic goals for the session
• Stay hydrated and well-rested
• Have a positive mental routine

**Long-term Mental Health:**
• Set daily/weekly playtime limits
• Have other hobbies outside gaming
• Maintain social connections
• Consider coaching if consistently struggling`,
    game: "both",
    confidence: 0.93,
    tags: ["mental", "tilt", "mindset", "health"],
  },
  {
    category: "game_mechanics",
    subcategory: "economy",
    keywords: ["economy", "money", "buy", "save", "force"],
    response: `**Economy Management Guide:**

**Valorant Economy:**
• **Full Buy:** 3900+ credits (Vandal/Phantom + armor)
• **Light Buy:** 2500-3900 credits (Spectre/Guardian)
• **Save Round:** <2500 credits (Classic/Ghost)

**Buy Round Rules:**
• Round 2: Light buy if won pistol, save if lost
• Never force buy 2 rounds in a row
• Coordinate team buys (all buy or all save)
• Consider enemy economy when deciding

**CS2 Economy:**
• **Full Buy:** $4000+ (AK/M4 + armor + utility)
• **Force Buy:** $2000-4000 (SMG/Scout + armor)
• **Eco Round:** <$2000 (pistol + minimal utility)

**Key Principles:**
• Save together, buy together
• Consider loss bonus accumulation
• Buy utility for teammates if needed
• Plan 2-3 rounds ahead`,
    game: "both",
    confidence: 0.88,
    tags: ["economy", "strategy", "teamwork"],
  },
  {
    category: "hardware_setup",
    subcategory: "gaming_setup",
    keywords: ["setup", "hardware", "monitor", "mouse", "keyboard", "headset"],
    response: `**Gaming Hardware Recommendations:**

**Monitor:**
• **Size:** 24-27 inches for competitive
• **Resolution:** 1920x1080 (1080p) preferred
• **Refresh Rate:** 144Hz minimum, 240Hz+ ideal
• **Panel Type:** TN or IPS for low input lag
• **Response Time:** 1ms GTG or faster

**Mouse:**
• **Sensor:** Optical sensor (PMW3360, HERO, etc.)
• **Weight:** 60-80g for FPS games
• **Shape:** Ergonomic fit for your hand size
• **DPI:** 400-1600 DPI range sufficient
• **Popular Models:** Logitech G Pro X, Razer Viper, Zowie EC2

**Keyboard:**
• **Switches:** Mechanical (Cherry MX Red/Brown)
• **Form Factor:** TKL or 60% for more mouse space
• **Features:** N-key rollover, low input lag
• **Popular Models:** Logitech G Pro X, SteelSeries Apex Pro

**Setup Ergonomics:**
• Monitor at eye level
• Elbows at 90-degree angle
• Feet flat on floor
• Good lighting to reduce eye strain`,
    game: "both",
    confidence: 0.87,
    tags: ["hardware", "setup", "peripherals"],
  },
]

const QUICK_PROMPTS = {
  valorant: [
    "How can I improve my crosshair placement in Valorant?",
    "What are the best agents for beginners?",
    "How do I manage economy in Valorant?",
    "Tips for countering Operator players?",
    "Best sensitivity settings for Valorant?",
    "How to rank up faster in Valorant?",
  ],
  cs2: [
    "How to control spray patterns in CS2?",
    "Best practice routines for CS2?",
    "Economy management strategies in CS2?",
    "How to improve movement in CS2?",
    "Grenade usage and lineups?",
    "Tips for ranking up in CS2?",
  ],
  general: [
    "How to avoid tilting during games?",
    "Best warm-up routine before playing?",
    "How to optimize game settings for performance?",
    "Tips for better team communication?",
    "How to analyze my gameplay?",
    "Mental preparation for competitive matches?",
  ],
}

export default function EnhancedCoachGPT() {
  const { selectedGame } = useGameStats()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [useAI, setUseAI] = useState(true)
  const [fallbackMessages, setFallbackMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: `🎮 **Welcome to CoachGPT!** 

I'm your gaming assistant powered by an extensive knowledge base covering Valorant and CS:GO! Ask me about aim improvement, agent selection, economy management, strategies, or any gameplay tips!

**Knowledge Base Categories:**
• 🎯 Aim Training & Crosshair Placement
• 🧠 Mental Game & Tilt Management  
• 💰 Economy & Game Mechanics
• 🎮 Agent Selection & Strategies
• 🖥️ Hardware Setup & Optimization
• 📊 Performance Analysis & Settings`,
    },
  ])
  const [fallbackInput, setFallbackInput] = useState("")
  const [fallbackLoading, setFallbackLoading] = useState(false)

  // Use AI SDK's useChat hook for Gemini integration
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload, stop } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: `🎮 **Welcome to AI-Powered CoachGPT!** 

I'm your personal gaming coach powered by Google Gemini AI and an extensive knowledge base, ready to help you dominate in Valorant and CS:GO! 

**What I can help you with:**
• 🎯 Aim training and improvement techniques
• 🎮 Agent selection and ability usage
• 💰 Economy management strategies  
• 🗺️ Map-specific tips and positioning
• 🧠 Mental game and anti-tilt strategies
• ⚙️ Settings optimization and hardware advice
• 📸 Photo analysis for gameplay screenshots
• 📊 Performance analysis and improvement

Ask me anything about improving your gameplay!`,
      },
    ],
    body: {
      gameContext: selectedGame,
    },
    onError: (error) => {
      console.error("❌ Chat error details:", error)
      console.log("🔄 Switching to enhanced fallback mode...")
      setUseAI(false) // Switch to fallback mode on error
      setIsConnected(false)
    },
    onFinish: () => {
      console.log("✅ Chat response completed")
      setIsConnected(true)
    },
  })

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, fallbackMessages])

  // Test Gemini connection
  useEffect(() => {
    const testConnection = async () => {
      console.log("🔍 Testing Gemini connection...")
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: "Hello, are you working?" }],
            gameContext: selectedGame,
          }),
        })

        console.log("📡 Response status:", response.status)

        if (response.ok) {
          console.log("✅ Gemini connection successful")
          setIsConnected(true)
          setUseAI(true)
        } else {
          const errorData = await response.json()
          console.error("❌ Connection test failed:", errorData)

          // Check if it's a fallback error
          if (errorData.fallback) {
            console.log("🔄 API suggests using enhanced fallback mode")
            setUseAI(false)
          }

          setIsConnected(false)
        }
      } catch (error) {
        console.error("❌ Connection test error:", error)
        setIsConnected(false)
        setUseAI(false)
      }
    }

    testConnection()
  }, [selectedGame])

  const handleQuickPrompt = (prompt: string) => {
    if (useAI) {
      handleInputChange({ target: { value: prompt } } as any)
      handleSubmit({ preventDefault: () => {} } as any)
    } else {
      handleFallbackSubmit(prompt)
    }
  }

  const clearConversation = () => {
    if (useAI) {
      reload()
    } else {
      setFallbackMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `🎮 **Welcome to CoachGPT!** 

I'm your gaming assistant powered by an extensive knowledge base covering Valorant and CS:GO! Ask me about aim improvement, agent selection, economy management, strategies, or any gameplay tips!

**Knowledge Base Categories:**
• 🎯 Aim Training & Crosshair Placement
• 🧠 Mental Game & Tilt Management  
• 💰 Economy & Game Mechanics
• 🎮 Agent Selection & Strategies
• 🖥️ Hardware Setup & Optimization
• 📊 Performance Analysis & Settings`,
        },
      ])
    }
  }

  // Enhanced fallback message handling using the knowledge base
  const handleFallbackSubmit = (message: string = fallbackInput) => {
    if (!message.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    }

    setFallbackMessages((prev) => [...prev, userMessage])
    setFallbackInput("")
    setFallbackLoading(true)

    // Simulate typing delay
    setTimeout(() => {
      // Find response from enhanced knowledge base
      const response = findEnhancedFallbackResponse(message)

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }

      setFallbackMessages((prev) => [...prev, assistantMessage])
      setFallbackLoading(false)
    }, 1500) // Slightly longer delay to simulate processing
  }

  const findEnhancedFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    // Check for greetings
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return `Hello! I'm CoachGPT with an extensive gaming knowledge base. I can help with:

🎯 **Aim Training:** Crosshair placement, sensitivity, practice routines
🧠 **Mental Game:** Tilt management, mindset, performance psychology
💰 **Game Mechanics:** Economy, strategy, team coordination
🎮 **Agent/Character Selection:** Role guides and recommendations
🖥️ **Hardware & Settings:** Setup optimization, performance tuning
📊 **Analysis:** Screenshot review, performance evaluation

What would you like to know about?`
    }

    // Find matching knowledge entries with scoring
    let bestMatch = null
    let maxScore = 0

    for (const entry of ENHANCED_KNOWLEDGE_BASE) {
      let score = 0

      // Score based on keyword matches
      for (const keyword of entry.keywords) {
        if (lowerMessage.includes(keyword)) {
          score += entry.confidence * 10 // Weight by confidence
        }
      }

      // Bonus for game context match
      if (entry.game === selectedGame || entry.game === "both") {
        score += 5
      }

      // Bonus for category relevance
      if (lowerMessage.includes(entry.category.replace("_", " "))) {
        score += 3
      }

      if (score > maxScore) {
        maxScore = score
        bestMatch = entry
      }
    }

    // Return best match if found with good confidence
    if (bestMatch && maxScore > 5) {
      return `${bestMatch.response}

---
*Source: Knowledge Base - ${bestMatch.category.replace("_", " ").toUpperCase()} | Confidence: ${Math.round(bestMatch.confidence * 100)}%*`
    }

    // Category-based fallback responses
    if (lowerMessage.includes("aim") || lowerMessage.includes("crosshair")) {
      return `🎯 **Aim Training Resources Available:**

I have detailed guides on:
• Crosshair placement techniques
• Sensitivity optimization
• Practice routines and warm-ups
• Aim training scenarios

Try asking: "How to improve crosshair placement" or "What sensitivity should I use?"`
    }

    if (lowerMessage.includes("tilt") || lowerMessage.includes("mental") || lowerMessage.includes("mindset")) {
      return `🧠 **Mental Game Support:**

I can help with:
• Anti-tilt strategies
• Performance mindset
• Dealing with toxic players
• Building confidence

Try asking: "How to avoid tilting" or "Mental preparation tips"`
    }

    if (lowerMessage.includes("economy") || lowerMessage.includes("money") || lowerMessage.includes("buy")) {
      return `💰 **Economy Management:**

I have comprehensive guides for:
• Buy round strategies
• Save vs force decisions
• Team economy coordination
• Game-specific economy rules

Try asking: "How to manage economy" or "When to save money?"`
    }

    // Default comprehensive response
    return `I have an extensive knowledge base covering ${selectedGame === "valorant" ? "Valorant" : selectedGame === "cs2" ? "CS2" : "both Valorant and CS2"}! 

**Popular topics I can help with:**

🎯 **Aim & Mechanics:**
• "How to improve crosshair placement"
• "Best sensitivity settings"
• "Aim training routines"

🧠 **Mental Game:**
• "How to avoid tilting"
• "Mental preparation tips"
• "Dealing with toxic players"

💰 **Strategy & Economy:**
• "Economy management guide"
• "Team coordination tips"
• "When to buy vs save"

🖥️ **Setup & Settings:**
• "Best gaming hardware"
• "Optimal game settings"
• "Performance optimization"

Try asking about any of these topics for detailed guidance!`
  }

  const currentPrompts =
    selectedGame === "valorant"
      ? QUICK_PROMPTS.valorant
      : selectedGame === "cs2"
        ? QUICK_PROMPTS.cs2
        : QUICK_PROMPTS.general

  // Determine which message array to use
  const displayMessages = useAI ? messages : fallbackMessages

  const retryConnection = async () => {
    console.log("🔄 Retrying Gemini connection...")
    setIsConnected(false)
    setUseAI(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Connection test" }],
          gameContext: selectedGame,
        }),
      })

      if (response.ok) {
        console.log("✅ Retry successful")
        setIsConnected(true)
        setUseAI(true)
        reload() // Reload the chat
      } else {
        console.log("❌ Retry failed, using enhanced fallback")
        setUseAI(false)
        setIsConnected(false)
      }
    } catch (error) {
      console.error("❌ Retry error:", error)
      setUseAI(false)
      setIsConnected(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">{useAI ? "AI-Powered CoachGPT" : "CoachGPT"}</h2>
        <div className="flex space-x-2">
          <Badge
            variant="outline"
            className={`border-${isConnected ? "green" : "red"}-400 text-${isConnected ? "green" : "red"}-300`}
          >
            <ZapIcon className="h-3 w-3 mr-1" />
            {isConnected ? "Gemini AI Connected" : "Enhanced Fallback Mode"}
          </Badge>
          <Badge variant="outline" className="border-blue-400 text-blue-300">
            {useAI ? (
              <>
                <BrainIcon className="h-3 w-3 mr-1" />
                AI-Powered
              </>
            ) : (
              <>
                <DatabaseIcon className="h-3 w-3 mr-1" />
                Knowledge Base
              </>
            )}
          </Badge>
          <Badge variant="outline" className="border-purple-400 text-purple-300">
            <GamepadIcon className="h-3 w-3 mr-1" />
            {selectedGame === "valorant" ? "Valorant" : selectedGame === "cs2" ? "CS2" : "Multi-Game"}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="bg-black/20 backdrop-blur-sm">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="photo-analysis">Photo Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <Card className="lg:col-span-2 bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      {useAI ? (
                        <>
                          <BrainIcon className="h-5 w-5 mr-2 text-blue-400" />
                          Gemini AI Coach
                        </>
                      ) : (
                        <>
                          <DatabaseIcon className="h-5 w-5 mr-2 text-blue-400" />
                          CoachGPT Knowledge Base
                        </>
                      )}
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      {useAI
                        ? "Advanced AI-powered gaming coach with Google Gemini"
                        : "Comprehensive gaming knowledge base for Valorant and CS:GO"}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={clearConversation}
                      className="text-white/80 hover:bg-white/10"
                    >
                      <RefreshCwIcon className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                    {useAI && isLoading && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={stop}
                        className="text-red-300 hover:bg-red-500/10 border-red-500/30"
                      >
                        Stop
                      </Button>
                    )}
                    {error && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setUseAI(!useAI)}
                        className="text-yellow-300 hover:bg-yellow-500/10 border-yellow-500/30"
                      >
                        {useAI ? "Switch to Knowledge Base" : "Try AI Again"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea
                  className="h-96 w-full rounded-md border border-white/10 p-4 bg-black/10"
                  ref={scrollAreaRef}
                >
                  <div className="space-y-4">
                    {displayMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-4 ${
                            message.role === "user"
                              ? "bg-blue-500/20 text-blue-100 border border-blue-500/30"
                              : "bg-green-500/20 text-green-100 border border-green-500/30"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            {message.role === "user" ? (
                              <UserIcon className="h-4 w-4" />
                            ) : useAI ? (
                              <BrainIcon className="h-4 w-4 text-green-400" />
                            ) : (
                              <DatabaseIcon className="h-4 w-4 text-green-400" />
                            )}
                            <span className="text-sm font-medium">
                              {message.role === "user" ? "You" : useAI ? "Gemini AI Coach" : "CoachGPT Knowledge Base"}
                            </span>
                            {message.role === "assistant" && (
                              <Badge
                                variant="outline"
                                className={`text-xs border-${useAI ? "green" : "blue"}-400/50 text-${useAI ? "green" : "blue"}-300`}
                              >
                                {useAI ? "AI" : "KB"}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                        </div>
                      </div>
                    ))}
                    {(isLoading || fallbackLoading) && (
                      <div className="flex justify-start">
                        <div className="bg-green-500/20 text-green-100 border border-green-500/30 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            {useAI ? (
                              <BrainIcon className="h-4 w-4 text-green-400" />
                            ) : (
                              <DatabaseIcon className="h-4 w-4 text-green-400" />
                            )}
                            <span className="text-sm font-medium">
                              {useAI ? "Gemini AI Coach" : "CoachGPT Knowledge Base"}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs border-${useAI ? "green" : "blue"}-400/50 text-${useAI ? "green" : "blue"}-300`}
                            >
                              {useAI ? "Thinking..." : "Searching..."}
                            </Badge>
                          </div>
                          <div className="flex space-x-1">
                            <div
                              className={`w-2 h-2 bg-${useAI ? "green" : "blue"}-400 rounded-full animate-bounce`}
                            ></div>
                            <div
                              className={`w-2 h-2 bg-${useAI ? "green" : "blue"}-400 rounded-full animate-bounce`}
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className={`w-2 h-2 bg-${useAI ? "green" : "blue"}-400 rounded-full animate-bounce`}
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {error && useAI && (
                      <div className="flex justify-center">
                        <div className="bg-red-500/20 text-red-100 border border-red-500/30 rounded-lg p-3 max-w-[85%]">
                          <p className="text-sm">❌ Error connecting to Gemini AI</p>
                          <p className="text-xs text-red-200 mt-1">{error?.message || "Connection failed"}</p>
                          <div className="flex space-x-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={retryConnection}
                              className="text-red-300 hover:bg-red-500/10"
                            >
                              Retry Connection
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setUseAI(false)}
                              className="text-yellow-300 hover:bg-yellow-500/10"
                            >
                              Use Knowledge Base
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {useAI ? (
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder={`Ask about ${selectedGame === "valorant" ? "Valorant" : selectedGame === "cs2" ? "CS2" : "gaming"}...`}
                      disabled={isLoading}
                      className="bg-black/20 border-white/20 text-white placeholder:text-white/40"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                    >
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <div className="flex space-x-2">
                    <Input
                      value={fallbackInput}
                      onChange={(e) => setFallbackInput(e.target.value)}
                      placeholder={`Search knowledge base for ${selectedGame === "valorant" ? "Valorant" : selectedGame === "cs2" ? "CS2" : "gaming"} tips...`}
                      disabled={fallbackLoading}
                      onKeyPress={(e) => e.key === "Enter" && !fallbackLoading && handleFallbackSubmit()}
                      className="bg-black/20 border-white/20 text-white placeholder:text-white/40"
                    />
                    <Button
                      onClick={() => handleFallbackSubmit()}
                      disabled={fallbackLoading || !fallbackInput.trim()}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
                    >
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-6">
              <Tabs defaultValue="prompts" className="space-y-4">
                <TabsList className="bg-black/20 backdrop-blur-sm">
                  <TabsTrigger value="prompts">Quick Prompts</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>

                <TabsContent value="prompts">
                  <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <SparklesIcon className="h-5 w-5 mr-2 text-yellow-400" />
                        Quick Prompts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {currentPrompts.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start text-left hover:bg-white/10 text-white/80 h-auto p-3"
                          onClick={() => handleQuickPrompt(prompt)}
                          disabled={isLoading || fallbackLoading}
                        >
                          <MessageCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{prompt}</span>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features">
                  <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        {useAI ? (
                          <>
                            <BrainIcon className="h-5 w-5 mr-2 text-green-400" />
                            AI Capabilities
                          </>
                        ) : (
                          <>
                            <DatabaseIcon className="h-5 w-5 mr-2 text-blue-400" />
                            Knowledge Base
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 text-sm text-white/80">
                        {useAI ? (
                          <>
                            <div className="flex items-start space-x-2">
                              <TrendingUpIcon className="h-4 w-4 text-green-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-green-300">Real-time Analysis</p>
                                <p className="text-xs">Analyzes your gameplay patterns</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <GamepadIcon className="h-4 w-4 text-blue-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-blue-300">Game-Specific Tips</p>
                                <p className="text-xs">Tailored advice for Valorant & CS2</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <CameraIcon className="h-4 w-4 text-purple-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-purple-300">Photo Analysis</p>
                                <p className="text-xs">AI vision for screenshots</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <BrainIcon className="h-4 w-4 text-green-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-green-300">Advanced Reasoning</p>
                                <p className="text-xs">Powered by Google Gemini</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-start space-x-2">
                              <DatabaseIcon className="h-4 w-4 text-blue-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-blue-300">Comprehensive Knowledge</p>
                                <p className="text-xs">Extensive gaming database</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <MessageCircleIcon className="h-4 w-4 text-green-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-green-300">Smart Matching</p>
                                <p className="text-xs">Intelligent response selection</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <SparklesIcon className="h-4 w-4 text-yellow-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-yellow-300">Confidence Scoring</p>
                                <p className="text-xs">Quality-rated responses</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <GamepadIcon className="h-4 w-4 text-purple-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-purple-300">Multi-Game Support</p>
                                <p className="text-xs">Valorant & CS2 expertise</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Connection Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-400" : "bg-blue-400"}`}></div>
                    <span className="text-sm text-white/80">
                      {isConnected ? "Gemini AI Connected" : "Enhanced Knowledge Base Active"}
                    </span>
                  </div>
                  {!isConnected && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-white/60">
                        {useAI
                          ? "Attempting to connect to Gemini AI..."
                          : "Using comprehensive gaming knowledge base with smart matching."}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setUseAI(!useAI)}
                        className="text-white/80 hover:bg-white/10 w-full"
                      >
                        {useAI ? "Switch to Knowledge Base" : "Try AI Connection"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="photo-analysis">
          <PhotoAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  )
}
