"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useChat } from "ai/react"
import PhotoAnalysis from "@/components/photo-analysis"
import {
  BotIcon,
  SendIcon,
  TrendingUpIcon,
  TargetIcon,
  BrainIcon,
  MessageCircleIcon,
  SparklesIcon,
  MicIcon,
  ImageIcon,
  CameraIcon,
  EyeIcon,
  LoaderIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "lucide-react"

export default function EnhancedCoachGPT() {
  const [isConnected, setIsConnected] = useState(true)
  const [apiStatus, setApiStatus] = useState<"connected" | "error" | "loading">("connected")

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm CoachGPT, powered by Google Gemini. I can help you with gaming strategies, general knowledge, technical questions, and much more. What would you like to know today?",
      },
    ],
    onError: (error) => {
      console.error("Chat error:", error)
      setApiStatus("error")
    },
    onResponse: (response) => {
      if (response.ok) {
        setApiStatus("connected")
      } else {
        setApiStatus("error")
      }
    },
  })

  const quickTips = [
    "Analyze my aim",
    "Improve positioning",
    "Economy management",
    "Team communication",
    "Map control strategies",
    "Crosshair placement",
    "Clutch situations",
    "Pre-aim techniques",
  ]

  const generalQuestions = [
    "Explain quantum computing",
    "How does machine learning work?",
    "What is blockchain technology?",
    "Explain the theory of relativity",
    "How do neural networks function?",
    "What is artificial intelligence?",
    "Explain cloud computing",
    "How does cryptocurrency work?",
  ]

  const handleQuickQuestion = (question: string) => {
    handleInputChange({ target: { value: question } } as any)
    handleSubmit({ preventDefault: () => {} } as any)
  }

  const testApiConnection = async () => {
    setApiStatus("loading")
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Test connection" }],
          gameContext: "API Test",
        }),
      })

      if (response.ok) {
        setApiStatus("connected")
        setIsConnected(true)
      } else {
        setApiStatus("error")
        setIsConnected(false)
      }
    } catch (error) {
      setApiStatus("error")
      setIsConnected(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">CoachGPT - AI Gaming Coach</h2>
        <div className="flex space-x-2">
          <Badge variant="outline" className="border-pink-400 text-pink-300">
            <BrainIcon className="h-3 w-3 mr-1" />
            Gemini Powered
          </Badge>
          <Badge
            variant="outline"
            className={`${
              apiStatus === "connected"
                ? "border-green-400 text-green-300 animate-pulse"
                : apiStatus === "error"
                  ? "border-red-400 text-red-300"
                  : "border-yellow-400 text-yellow-300"
            }`}
          >
            {apiStatus === "connected" && <CheckCircleIcon className="h-3 w-3 mr-1" />}
            {apiStatus === "error" && <AlertCircleIcon className="h-3 w-3 mr-1" />}
            {apiStatus === "loading" && <LoaderIcon className="h-3 w-3 mr-1 animate-spin" />}
            {apiStatus === "connected" ? "Online" : apiStatus === "error" ? "Error" : "Connecting"}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm">
          <TabsTrigger value="chat" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300">
            <MessageCircleIcon className="h-4 w-4 mr-2" />
            Chat Coach
          </TabsTrigger>
          <TabsTrigger value="photo" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
            <CameraIcon className="h-4 w-4 mr-2" />
            Photo Analysis
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Chat Interface */}
            <Card className="lg:col-span-2 bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <BotIcon className="h-5 w-5 mr-2 text-pink-400" />
                    Chat with CoachGPT
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testApiConnection}
                    disabled={apiStatus === "loading"}
                    className="border-white/20 text-white/80 hover:bg-white/10 bg-transparent"
                  >
                    {apiStatus === "loading" ? <LoaderIcon className="h-4 w-4 animate-spin" /> : "Test API"}
                  </Button>
                </CardTitle>
                <CardDescription className="text-white/60">
                  Get personalized coaching advice and answers to any question powered by Google Gemini AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-96 w-full rounded-md border border-white/10 p-4 bg-black/10">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-pink-500/20 text-pink-100 border border-pink-500/30"
                              : "bg-blue-500/20 text-blue-100 border border-blue-500/30"
                          }`}
                        >
                          <div className="text-sm whitespace-pre-line">{message.content}</div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-blue-500/20 text-blue-100 border border-blue-500/30 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {error && (
                      <div className="flex justify-center">
                        <div className="bg-red-500/20 text-red-100 border border-red-500/30 rounded-lg p-3 max-w-[80%]">
                          <div className="flex items-center space-x-2">
                            <AlertCircleIcon className="h-4 w-4 text-red-400" />
                            <div className="text-sm">
                              <p className="font-medium">Connection Error</p>
                              <p className="text-xs text-red-200">
                                Unable to connect to Gemini API. Please check your connection and try again.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="flex space-x-2">
                    <Textarea
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask me anything - gaming strategies, general knowledge, technical questions..."
                      className="bg-black/20 border-white/20 text-white placeholder:text-white/40 min-h-[60px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmit(e as any)
                        }
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                      >
                        <MicIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 disabled:opacity-50"
                    >
                      {isLoading ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-yellow-400" />
                    Gaming Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickTips.map((tip, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-white/10 text-white/80 transition-all duration-300 hover:scale-105"
                      onClick={() => handleQuickQuestion(tip)}
                    >
                      <MessageCircleIcon className="h-4 w-4 mr-2" />
                      {tip}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BrainIcon className="h-5 w-5 mr-2 text-purple-400" />
                    General Knowledge
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {generalQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-white/10 text-white/80 transition-all duration-300 hover:scale-105 text-xs"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      <MessageCircleIcon className="h-3 w-3 mr-2" />
                      {question}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Performance Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUpIcon className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm text-white">Improvement Area</p>
                      <p className="text-xs text-white/60">Crosshair placement</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TargetIcon className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-white">Focus This Week</p>
                      <p className="text-xs text-white/60">Positioning & map control</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BrainIcon className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-white">Skill Level</p>
                      <p className="text-xs text-white/60">Diamond tier gameplay</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">AI Features</CardTitle>
                  <CardDescription className="text-white/60">Powered by Google Gemini</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">
                    <BrainIcon className="h-4 w-4 mr-2" />
                    Analyze Gameplay Video
                  </Button>
                  <Button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                    <TargetIcon className="h-4 w-4 mr-2" />
                    Create Training Plan
                  </Button>
                  <Button className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30">
                    <TrendingUpIcon className="h-4 w-4 mr-2" />
                    Progress Tracking
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="photo" className="space-y-6">
          <PhotoAnalysis />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BrainIcon className="h-5 w-5 mr-2 text-purple-400" />
                  AI Performance Analysis
                </CardTitle>
                <CardDescription className="text-white/60">Deep insights powered by machine learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="text-green-300 font-medium mb-2">🎯 Aim Analysis</h4>
                    <p className="text-green-200 text-sm">
                      Your crosshair placement has improved by 23% over the last week. Focus on pre-aiming common
                      angles.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <h4 className="text-blue-300 font-medium mb-2">📍 Positioning Insights</h4>
                    <p className="text-blue-200 text-sm">
                      You're taking 15% fewer unnecessary duels. Continue playing off-angles and using cover
                      effectively.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <h4 className="text-purple-300 font-medium mb-2">💰 Economy Trends</h4>
                    <p className="text-purple-200 text-sm">
                      Your force-buy decisions have improved. Win rate on eco rounds increased by 12%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TargetIcon className="h-5 w-5 mr-2 text-orange-400" />
                  Recommended Training
                </CardTitle>
                <CardDescription className="text-white/60">Personalized practice routines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <h4 className="text-orange-300 font-medium mb-2">🎮 Daily Routine</h4>
                    <ul className="text-orange-200 text-sm space-y-1">
                      <li>• 15 min aim training (Gridshot)</li>
                      <li>• 10 min crosshair placement</li>
                      <li>• 5 min reaction time drills</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <h4 className="text-cyan-300 font-medium mb-2">🗺️ Map Focus</h4>
                    <p className="text-cyan-200 text-sm">
                      This week: Dust2 positioning and common angles. Practice A site retakes.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                    <h4 className="text-pink-300 font-medium mb-2">🎯 Skill Priority</h4>
                    <p className="text-pink-200 text-sm">
                      Focus on utility usage and team coordination. Your individual skill is solid.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUpIcon className="h-5 w-5 mr-2 text-green-400" />
                Progress Tracking
              </CardTitle>
              <CardDescription className="text-white/60">Your improvement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">+23%</div>
                  <div className="text-sm text-white">Aim Improvement</div>
                  <div className="text-xs text-white/60">Last 30 days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">+15%</div>
                  <div className="text-sm text-white">Win Rate</div>
                  <div className="text-xs text-white/60">This month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">+8</div>
                  <div className="text-sm text-white">Rank Points</div>
                  <div className="text-xs text-white/60">Weekly average</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
