"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DemoUserGenerator, DEMO_USER_PRESETS, type DemoUser } from "@/lib/demo-data-generator"
import { User, Trophy, Zap, Copy, CheckCircle, Shuffle, Crown, Target, Loader2 } from "lucide-react"

export default function DemoUserGeneratorPanel() {
  const [generatedUser, setGeneratedUser] = useState<DemoUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [applied, setApplied] = useState(false)

  // Custom user form state
  const [customForm, setCustomForm] = useState({
    displayName: "",
    email: "",
    valorantRank: "",
    cs2Rank: "",
    winRate: 50,
    theme: "dark",
  })

  const valorantRanks = [
    "Iron 1",
    "Iron 2",
    "Iron 3",
    "Bronze 1",
    "Bronze 2",
    "Bronze 3",
    "Silver 1",
    "Silver 2",
    "Silver 3",
    "Gold 1",
    "Gold 2",
    "Gold 3",
    "Platinum 1",
    "Platinum 2",
    "Platinum 3",
    "Diamond 1",
    "Diamond 2",
    "Diamond 3",
    "Ascendant 1",
    "Ascendant 2",
    "Ascendant 3",
    "Immortal 1",
    "Immortal 2",
    "Immortal 3",
    "Radiant",
  ]

  const cs2Ranks = [
    "Silver I",
    "Silver II",
    "Silver III",
    "Silver IV",
    "Silver Elite",
    "Silver Elite Master",
    "Gold Nova I",
    "Gold Nova II",
    "Gold Nova III",
    "Gold Nova Master",
    "Master Guardian I",
    "Master Guardian II",
    "Master Guardian Elite",
    "Distinguished Master Guardian",
    "Legendary Eagle",
    "Legendary Eagle Master",
    "Supreme Master First Class",
    "The Global Elite",
  ]

  const themes = ["dark", "light", "neon", "cyberpunk", "forest", "ocean"]

  const generateUser = async (type: string) => {
    setLoading(true)
    setApplied(false)
    setCopied(false)

    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    let user: DemoUser

    switch (type) {
      case "random":
        user = DemoUserGenerator.generateRandomUser()
        break
      case "pro":
        user = DemoUserGenerator.generateProPlayer()
        break
      case "beginner":
        user = DemoUserGenerator.generateBeginner()
        break
      case "radiant":
        user = DEMO_USER_PRESETS.radiant()
        break
      case "diamond":
        user = DEMO_USER_PRESETS.diamond()
        break
      case "gold":
        user = DEMO_USER_PRESETS.gold()
        break
      case "iron":
        user = DEMO_USER_PRESETS.iron()
        break
      case "custom":
        user = DemoUserGenerator.generateCustomUser(customForm)
        break
      default:
        user = DemoUserGenerator.generateRandomUser()
    }

    setGeneratedUser(user)
    setLoading(false)

    console.log("Generated Demo User:", user)
  }

  const applyToSession = () => {
    if (!generatedUser) return

    localStorage.setItem("demo-user", JSON.stringify(generatedUser))
    window.dispatchEvent(new Event("demo-login"))
    setApplied(true)

    console.log("Applied demo user to session:", generatedUser.displayName)
  }

  const copyToClipboard = async () => {
    if (!generatedUser) return

    try {
      await navigator.clipboard.writeText(JSON.stringify(generatedUser, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Demo User Generator</span>
          </CardTitle>
          <CardDescription>Generate realistic demo user profiles for testing and development</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="presets" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="presets">Quick Presets</TabsTrigger>
              <TabsTrigger value="custom">Custom Builder</TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  onClick={() => generateUser("random")}
                  disabled={loading}
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Shuffle className="h-5 w-5" />
                  <span>Random User</span>
                </Button>

                <Button
                  onClick={() => generateUser("pro")}
                  disabled={loading}
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Crown className="h-5 w-5" />
                  <span>Pro Player</span>
                </Button>

                <Button
                  onClick={() => generateUser("beginner")}
                  disabled={loading}
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Target className="h-5 w-5" />
                  <span>Beginner</span>
                </Button>

                <Button
                  onClick={() => generateUser("radiant")}
                  disabled={loading}
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Trophy className="h-5 w-5" />
                  <span>Radiant</span>
                </Button>

                <Button
                  onClick={() => generateUser("diamond")}
                  disabled={loading}
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Zap className="h-5 w-5" />
                  <span>Diamond</span>
                </Button>

                <Button
                  onClick={() => generateUser("gold")}
                  disabled={loading}
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <span className="text-yellow-500">●</span>
                  <span>Gold</span>
                </Button>

                <Button
                  onClick={() => generateUser("iron")}
                  disabled={loading}
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <span className="text-gray-500">●</span>
                  <span>Iron</span>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={customForm.displayName}
                    onChange={(e) => setCustomForm((prev) => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Enter display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customForm.email}
                    onChange={(e) => setCustomForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valorantRank">Valorant Rank</Label>
                  <Select
                    value={customForm.valorantRank}
                    onValueChange={(value) => setCustomForm((prev) => ({ ...prev, valorantRank: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Valorant rank" />
                    </SelectTrigger>
                    <SelectContent>
                      {valorantRanks.map((rank) => (
                        <SelectItem key={rank} value={rank}>
                          {rank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cs2Rank">CS2 Rank</Label>
                  <Select
                    value={customForm.cs2Rank}
                    onValueChange={(value) => setCustomForm((prev) => ({ ...prev, cs2Rank: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select CS2 rank" />
                    </SelectTrigger>
                    <SelectContent>
                      {cs2Ranks.map((rank) => (
                        <SelectItem key={rank} value={rank}>
                          {rank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="winRate">Win Rate (%)</Label>
                  <Input
                    id="winRate"
                    type="number"
                    min="0"
                    max="100"
                    value={customForm.winRate}
                    onChange={(e) =>
                      setCustomForm((prev) => ({ ...prev, winRate: Number.parseInt(e.target.value) || 50 }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={customForm.theme}
                    onValueChange={(value) => setCustomForm((prev) => ({ ...prev, theme: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme} value={theme}>
                          {theme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => generateUser("custom")} disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Generate Custom User
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Generated User Display */}
      {generatedUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated User Profile</span>
              <div className="flex space-x-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex items-center space-x-1">
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? "Copied!" : "Copy JSON"}</span>
                </Button>
                <Button onClick={applyToSession} size="sm" className="flex items-center space-x-1">
                  {applied ? <CheckCircle className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  <span>{applied ? "Applied!" : "Apply to Session"}</span>
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={generatedUser.photoURL || "/placeholder.svg"}
                alt={generatedUser.displayName}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">{generatedUser.displayName}</h3>
                <p className="text-muted-foreground">{generatedUser.email}</p>
                <div className="flex space-x-2 mt-2">
                  <Badge variant="secondary">{generatedUser.preferences.theme}</Badge>
                  <Badge variant="outline">{generatedUser.preferences.favoriteGame}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Valorant Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Rank:</span>
                    <Badge>{generatedUser.gameStats.valorant.rank}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Win Rate:</span>
                    <span>{generatedUser.gameStats.valorant.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>K/D/A:</span>
                    <span>{generatedUser.gameStats.valorant.kda}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Games:</span>
                    <span>{generatedUser.gameStats.valorant.gamesPlayed}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">CS2 Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Rank:</span>
                    <Badge>{generatedUser.gameStats.cs2.rank}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Win Rate:</span>
                    <span>{generatedUser.gameStats.cs2.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>K/D/A:</span>
                    <span>{generatedUser.gameStats.cs2.kda}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Games:</span>
                    <span>{generatedUser.gameStats.cs2.gamesPlayed}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {applied && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Demo user has been applied to your session! You can now use the dashboard with this profile.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
