"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useGameStats } from "@/components/game-stats-provider"
import {
  UsersIcon,
  SendIcon,
  GamepadIcon,
  TrophyIcon,
  StarIcon,
  LoaderIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react"

const TeammateRequestForm = () => {
  const { toast } = useToast()
  const { user } = useAuth()
  const { gameStats, selectedGame } = useGameStats()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastRequestTime, setLastRequestTime] = useState<Date | null>(null)

  const [formData, setFormData] = useState({
    gameType: selectedGame,
    preferredRole: "",
    message: "",
  })

  const gameRoles: Record<string, string[]> = {
    valorant: ["Duelist", "Initiator", "Controller", "Sentinel", "Flexible"],
    cs2: ["Entry Fragger", "AWPer", "Support", "IGL", "Lurker", "Flexible"],
    overwatch: ["Tank", "Damage", "Support", "Flexible"],
    apex: ["Assault", "Defensive", "Support", "Recon", "Flexible"],
    lol: ["Top", "Jungle", "Mid", "ADC", "Support", "Fill"],
    rocket: ["Striker", "Midfielder", "Goalkeeper", "Flexible"],
    fortnite: ["Fragger", "Support", "Builder", "IGL", "Flexible"],
    dota2: ["Carry", "Mid", "Offlane", "Support", "Hard Support", "Flexible"],
  }

  const getGameDisplayName = (gameId: string) => {
    const gameNames: Record<string, string> = {
      valorant: "Valorant",
      cs2: "Counter-Strike 2",
      overwatch: "Overwatch 2",
      apex: "Apex Legends",
      lol: "League of Legends",
      rocket: "Rocket League",
      fortnite: "Fortnite",
      dota2: "Dota 2",
    }
    return gameNames[gameId] || "Unknown Game"
  }

  const canSendRequest = () => {
    if (!lastRequestTime) return true
    const timeDiff = Date.now() - lastRequestTime.getTime()
    const cooldownMinutes = 15
    return timeDiff > cooldownMinutes * 60 * 1000
  }

  const getRemainingCooldown = () => {
    if (!lastRequestTime) return 0
    const timeDiff = Date.now() - lastRequestTime.getTime()
    const cooldownMinutes = 15
    const remainingMs = cooldownMinutes * 60 * 1000 - timeDiff
    return Math.max(0, Math.ceil(remainingMs / (60 * 1000)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canSendRequest()) {
      toast({
        title: "Cooldown Active",
        description: `Please wait ${getRemainingCooldown()} more minutes before sending another request.`,
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to send teammate requests.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "teammate_request",
          data: {
            username: user.displayName || "Anonymous Player",
            gameType: getGameDisplayName(formData.gameType),
            currentRank: gameStats.currentRank,
            preferredRole: formData.preferredRole || "Flexible",
            message: formData.message || "Ready to grind and climb together! Let's dominate the competition! 🚀",
            userStats: {
              currentRank: gameStats.currentRank,
              winRate: gameStats.winRate,
              kda: gameStats.kda,
              gamesPlayed: gameStats.gamesPlayed,
              weeklyLP: gameStats.weeklyLP,
              hoursPlayed: gameStats.hoursPlayed,
              recentMatches: gameStats.recentMatches,
            },
            userAvatar: user.photoURL,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      setLastRequestTime(new Date())
      toast({
        title: "Teammate Request Sent! 🎮",
        description: "Your request has been posted to Discord with @everyone mention!",
      })

      // Reset form
      setFormData({
        gameType: selectedGame,
        preferredRole: "",
        message: "",
      })
    } catch (error) {
      console.error("Failed to send teammate request:", error)
      toast({
        title: "Request Failed",
        description: "Failed to send teammate request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UsersIcon className="h-6 w-6 mr-3 text-purple-500" />
          Find Teammates
        </CardTitle>
        <CardDescription>
          Send a teammate request to Discord with @everyone mention. Includes your current stats and performance data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Player Stats Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrophyIcon className="h-5 w-5 text-primary mr-2" />
              <span className="font-semibold">Current Rank</span>
            </div>
            <Badge variant="outline" className="text-primary border-primary/30">
              {gameStats.currentRank}
            </Badge>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <StarIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-semibold">Win Rate</span>
            </div>
            <Badge variant="outline" className="text-green-500 border-green-500/30">
              {gameStats.winRate}%
            </Badge>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <GamepadIcon className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-semibold">K/D/A</span>
            </div>
            <Badge variant="outline" className="text-blue-500 border-blue-500/30">
              {gameStats.kda}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Game Selection */}
          <div className="space-y-2">
            <Label htmlFor="gameType">Game</Label>
            <Select value={formData.gameType} onValueChange={(value) => handleInputChange("gameType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="valorant">Valorant</SelectItem>
                <SelectItem value="cs2">Counter-Strike 2</SelectItem>
                <SelectItem value="overwatch">Overwatch 2</SelectItem>
                <SelectItem value="apex">Apex Legends</SelectItem>
                <SelectItem value="lol">League of Legends</SelectItem>
                <SelectItem value="rocket">Rocket League</SelectItem>
                <SelectItem value="fortnite">Fortnite</SelectItem>
                <SelectItem value="dota2">Dota 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="preferredRole">Preferred Role</Label>
            <Select value={formData.preferredRole} onValueChange={(value) => handleInputChange("preferredRole", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your preferred role" />
              </SelectTrigger>
              <SelectContent>
                {gameRoles[formData.gameType]?.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Custom Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message to attract teammates..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">{formData.message.length}/500</div>
          </div>

          {/* Cooldown Warning */}
          {!canSendRequest() && (
            <div className="flex items-center space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertCircleIcon className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-yellow-600">
                Cooldown active: {getRemainingCooldown()} minutes remaining
              </span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !canSendRequest()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                Sending Request...
              </>
            ) : canSendRequest() ? (
              <>
                <SendIcon className="h-4 w-4 mr-2" />
                Send Teammate Request (@everyone)
              </>
            ) : (
              <>
                <AlertCircleIcon className="h-4 w-4 mr-2" />
                Cooldown Active ({getRemainingCooldown()}m)
              </>
            )}
          </Button>
        </form>

        {/* Info Section */}
        <div className="space-y-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold text-blue-600">What gets sent:</span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 ml-6">
            <li>• @everyone mention to notify all Discord members</li>
            <li>• Your current rank, win rate, and K/D/A ratio</li>
            <li>• Recent match history and performance trends</li>
            <li>• Preferred role and game selection</li>
            <li>• Custom message (if provided)</li>
            <li>• Instructions for teammates to connect with you</li>
          </ul>
        </div>

        {lastRequestTime && (
          <div className="text-xs text-muted-foreground text-center">
            Last request sent: {lastRequestTime.toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TeammateRequestForm
