"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthService, type RegistrationData } from "@/lib/auth-enhanced"
import { GamepadIcon, Loader2, CheckCircle } from "lucide-react"

export default function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationData>({
    email: "",
    password: "",
    displayName: "",
    gamePreferences: [],
    region: "",
    skillLevel: "beginner",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const games = [
    "Valorant",
    "Counter-Strike 2",
    "Overwatch 2",
    "Apex Legends",
    "League of Legends",
    "Rocket League",
    "Fortnite",
    "Dota 2",
  ]

  const regions = ["North America", "Europe", "Asia Pacific", "South America", "Middle East", "Africa", "Oceania"]

  const handleGamePreferenceChange = (game: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      gamePreferences: checked ? [...prev.gamePreferences, game] : prev.gamePreferences.filter((g) => g !== game),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validation
      if (formData.password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }
      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }
      if (formData.gamePreferences.length === 0) {
        throw new Error("Please select at least one game")
      }

      await AuthService.registerUser(formData)
      setSuccess(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Registration Successful!</h2>
          <p className="text-muted-foreground mb-4">
            Please check your email to verify your account before signing in.
          </p>
          <Button onClick={() => window.location.reload()}>Go to Login</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <GamepadIcon className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl">Join Aphrodite</CardTitle>
        </div>
        <p className="text-muted-foreground">Create your gaming profile</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Region</Label>
            <Select
              value={formData.region}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Skill Level</Label>
            <Select
              value={formData.skillLevel}
              onValueChange={(value: any) => setFormData((prev) => ({ ...prev, skillLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="pro">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Game Preferences (select at least one)</Label>
            <div className="grid grid-cols-2 gap-2">
              {games.map((game) => (
                <div key={game} className="flex items-center space-x-2">
                  <Checkbox
                    id={game}
                    checked={formData.gamePreferences.includes(game)}
                    onCheckedChange={(checked) => handleGamePreferenceChange(game, checked as boolean)}
                  />
                  <Label htmlFor={game} className="text-sm">
                    {game}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
