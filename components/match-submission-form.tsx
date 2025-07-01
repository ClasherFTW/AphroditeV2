"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react"

export default function MatchSubmissionForm() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    gameType: "",
    result: "",
    score: "",
    map: "",
    duration: "",
    kills: "",
    deaths: "",
    assists: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          ...formData,
          duration: Number.parseInt(formData.duration) || 30,
          kills: Number.parseInt(formData.kills) || 0,
          deaths: Number.parseInt(formData.deaths) || 0,
          assists: Number.parseInt(formData.assists) || 0,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setFormData({
          gameType: "",
          result: "",
          score: "",
          map: "",
          duration: "",
          kills: "",
          deaths: "",
          assists: "",
        })

        // Queue background task for rank update
        await fetch("/api/background-tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "rank_update",
            userId: user.uid,
            data: { gameType: formData.gameType },
          }),
        })

        console.log("✅ Match submitted and rank update queued")
      } else {
        setError(data.error || "Failed to submit match")
      }
    } catch (error) {
      console.error("❌ Error submitting match:", error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Match Result</CardTitle>
        <CardDescription>Record your latest game performance and update your statistics</CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4 border-green-500/30 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              Match submitted successfully! Your stats are being updated.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gameType">Game Type</Label>
              <Select value={formData.gameType} onValueChange={(value) => handleInputChange("gameType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valorant">Valorant</SelectItem>
                  <SelectItem value="cs2">Counter-Strike 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="result">Match Result</Label>
              <Select value={formData.result} onValueChange={(value) => handleInputChange("result", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="win">Victory</SelectItem>
                  <SelectItem value="loss">Defeat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                placeholder="13-7"
                value={formData.score}
                onChange={(e) => handleInputChange("score", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="map">Map</Label>
              <Input
                id="map"
                placeholder="Dust2, Bind, etc."
                value={formData.map}
                onChange={(e) => handleInputChange("map", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="30"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kills">Kills</Label>
              <Input
                id="kills"
                type="number"
                placeholder="15"
                value={formData.kills}
                onChange={(e) => handleInputChange("kills", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deaths">Deaths</Label>
              <Input
                id="deaths"
                type="number"
                placeholder="8"
                value={formData.deaths}
                onChange={(e) => handleInputChange("deaths", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assists">Assists</Label>
              <Input
                id="assists"
                type="number"
                placeholder="5"
                value={formData.assists}
                onChange={(e) => handleInputChange("assists", e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading || !formData.gameType || !formData.result} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting Match...
              </>
            ) : (
              "Submit Match"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
