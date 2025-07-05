"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
} from "lucide-react"

interface Message {
  id: number
  type: "user" | "coach"
  content: string
  timestamp: Date
}

export default function CoachGPT() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "coach",
      content:
        "Hello! I'm CoachGPT, powered by Google Gemini. I've analyzed your recent performance and I'm ready to help you improve. What would you like to work on today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

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

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate Gemini AI response with more detailed coaching
    setTimeout(() => {
      const responses = {
        "Analyze my aim":
          "Based on your recent stats, your accuracy is at 67% which is good for your rank. However, I notice your headshot rate could improve from 34% to 45%+. Here's my analysis:\n\n🎯 **Crosshair Placement**: Keep it at head level consistently\n📊 **Sensitivity**: Your current sens might be too high - try reducing by 10%\n⏱️ **Reaction Time**: Practice flick shots for 15 minutes daily\n🎮 **Aim Trainers**: Use Kovaak's or Aim Lab with these scenarios: 1wall6targets, Gridshot\n\n*Estimated improvement time: 2-3 weeks with daily practice*",
        "Improve positioning":
          "Your positioning shows room for improvement. Analysis from your last 10 matches:\n\n❌ **Common Mistakes**: Taking unnecessary duels (8 times per match)\n✅ **Improvement Areas**:\n• Use off-angles more frequently\n• Always have an escape route planned\n• Play closer to cover\n• Avoid open areas\n\n📍 **Map-Specific Tips**:\n• Dust2: Hold from car/default instead of long doors\n• Mirage: Use jungle/stairs for rotates\n• Inferno: Stick to walls in apartments\n\n*Focus on one map at a time for better results*",
        "Economy management":
          "Your economic decisions need refinement. Here's the breakdown:\n\n💰 **Current Stats**: 67% eco round efficiency\n🔴 **Issues**: Force-buying too often (12 times in last 5 games)\n\n**Improved Strategy**:\n1. **Save Rule**: If you can't afford armor + utility, save\n2. **Team Economy**: Coordinate buys with teammates\n3. **Force Buy Timing**: Only when enemy is on eco or you're desperate\n4. **Investment Priority**: Armor > Utility > Weapon upgrades\n\n📈 **Expected Improvement**: +15% win rate on eco rounds",
        "Team communication":
          'Communication analysis from recent matches:\n\n🗣️ **Current Level**: Basic callouts\n📊 **Improvement Areas**:\n\n**Essential Callouts**:\n• Enemy positions with compass directions\n• Health status ("lit 30", "one shot")\n• Utility usage ("smoke down in 10 seconds")\n• Rotation calls ("2 going B")\n\n**Advanced Tips**:\n• Use concise language during clutches\n• Call enemy economy status\n• Share timing information\n• Coordinate utility usage\n\n*Practice with your regular squad for best results*',
      }

      const coachResponse: Message = {
        id: messages.length + 2,
        type: "coach",
        content:
          responses[message as keyof typeof responses] ||
          `I understand you want to improve that aspect of your gameplay. Let me analyze your recent performance data and provide specific recommendations based on your current skill level and recent matches.\n\n🤖 **Powered by Google Gemini** - I can provide detailed analysis, create custom training routines, and track your progress over time. What specific aspect would you like me to focus on?`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, coachResponse])
      setIsTyping(false)
    }, 2000)
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
          <Badge variant="outline" className="border-green-400 text-green-300 animate-pulse">
            Online
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Chat Interface */}
        <Card className="lg:col-span-2 bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BotIcon className="h-5 w-5 mr-2 text-pink-400" />
              Chat with CoachGPT
            </CardTitle>
            <CardDescription className="text-white/60">
              Get personalized coaching advice powered by Google Gemini AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-96 w-full rounded-md border border-white/10 p-4 bg-black/10">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-pink-500/20 text-pink-100 border border-pink-500/30"
                          : "bg-blue-500/20 text-blue-100 border border-blue-500/30"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-line">{message.content}</div>
                      <p className="text-xs opacity-60 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
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
              </div>
            </ScrollArea>

            <div className="flex space-x-2">
              <Input
                placeholder="Ask for coaching advice..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
                className="bg-black/20 border-white/20 text-white placeholder:text-white/40"
              />
              <Button className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                <MicIcon className="h-4 w-4" />
              </Button>
              <Button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handleSendMessage(inputMessage)}
                className="bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30"
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Sidebar */}
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2 text-yellow-400" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickTips.map((tip, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-white/10 text-white/80 transition-all duration-300 hover:scale-105"
                  onClick={() => handleSendMessage(tip)}
                >
                  <MessageCircleIcon className="h-4 w-4 mr-2" />
                  {tip}
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
    </div>
  )
}
