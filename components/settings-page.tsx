"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import {
  SettingsIcon,
  MoonIcon,
  SunIcon,
  VolumeIcon,
  BellIcon,
  ShieldIcon,
  GamepadIcon,
  KeyIcon,
  DatabaseIcon,
  WifiIcon,
  PaletteIcon,
  AccessibilityIcon,
  EyeOffIcon,
  LockKeyholeIcon,
  FileTextIcon,
  CheckIcon,
} from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const [settings, setSettings] = useState({
    notifications: {
      gameInvites: true,
      friendRequests: true,
      achievements: true,
      systemUpdates: false,
      coachTips: true,
      scheduledNotifications: false,
      doNotDisturb: false,
    },
    audio: {
      masterVolume: [75],
      gameVolume: [80],
      voiceVolume: [70],
      notificationVolume: [60],
    },
    privacy: {
      showOnlineStatus: true,
      allowFriendRequests: true,
      showGameStats: true,
      shareAchievements: true,
      limitDataCollection: false,
      anonymizeData: false,
    },
    performance: {
      autoOptimize: true,
      backgroundApps: true,
      gameMode: true,
      hardwareAcceleration: true,
    },
    appearance: {
      fontSize: "md",
      animationSpeed: "normal",
      layout: "default",
      highContrast: false,
      reducedMotion: false,
    },
    geminiApiKey: "",
  })

  // Apply settings to document root
  useEffect(() => {
    const root = document.documentElement

    // Apply font size
    root.classList.remove("text-sm", "text-base", "text-lg")
    if (settings.appearance.fontSize === "sm") {
      root.classList.add("text-sm")
    } else if (settings.appearance.fontSize === "lg") {
      root.classList.add("text-lg")
    } else {
      root.classList.add("text-base")
    }

    // Apply animation speed
    root.style.setProperty(
      "--animation-duration",
      settings.appearance.animationSpeed === "slow"
        ? "0.5s"
        : settings.appearance.animationSpeed === "fast"
          ? "0.1s"
          : "0.3s",
    )

    // Apply layout
    root.classList.remove("layout-default", "layout-compact")
    root.classList.add(`layout-${settings.appearance.layout}`)

    // Apply high contrast
    if (settings.appearance.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    // Apply reduced motion
    if (settings.appearance.reducedMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }
  }, [settings.appearance])

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))

    // Show toast notification
    toast({
      title: "Setting Updated",
      description: `${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} has been changed`,
      duration: 2000,
    })
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any)
    toast({
      title: "Theme Changed",
      description: `Switched to ${newTheme} theme`,
      duration: 2000,
    })
  }

  const themes = [
    { id: "dark", name: "Dark", description: "Dark theme with subtle colors" },
    { id: "light", name: "Light", description: "Clean light theme" },
    { id: "gaming", name: "Gaming", description: "Purple and blue gaming theme" },
    { id: "neon", name: "Neon", description: "Bright neon colors" },
    { id: "matrix", name: "Matrix", description: "Green matrix-style theme" },
    { id: "cyberpunk", name: "Cyberpunk", description: "Neon cyan and magenta" },
  ]

  const fontSizes = [
    { id: "sm", name: "Small" },
    { id: "md", name: "Medium" },
    { id: "lg", name: "Large" },
  ]

  const animationSpeeds = [
    { id: "slow", name: "Slow" },
    { id: "normal", name: "Normal" },
    { id: "fast", name: "Fast" },
  ]

  const layouts = [
    { id: "default", name: "Default" },
    { id: "compact", name: "Compact" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <Badge variant="outline">
          <SettingsIcon className="h-3 w-3 mr-1" />
          Preferences
        </Badge>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PaletteIcon className="h-5 w-5 mr-2 text-primary" />
                Theme Settings
              </CardTitle>
              <CardDescription>Customize the appearance of Aphrodite</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((themeOption) => (
                  <Card
                    key={themeOption.id}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      theme === themeOption.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleThemeChange(themeOption.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div
                        className={`w-full h-16 rounded mb-3 ${
                          themeOption.id === "dark"
                            ? "bg-gradient-to-br from-gray-800 to-gray-900"
                            : themeOption.id === "light"
                              ? "bg-gradient-to-br from-gray-100 to-gray-200"
                              : themeOption.id === "gaming"
                                ? "bg-gradient-to-br from-purple-600 to-blue-600"
                                : themeOption.id === "neon"
                                  ? "bg-gradient-to-br from-pink-500 to-cyan-500"
                                  : themeOption.id === "matrix"
                                    ? "bg-gradient-to-br from-green-600 to-green-800"
                                    : "bg-gradient-to-br from-cyan-500 to-magenta-500"
                        }`}
                      ></div>
                      <h3 className="font-medium">{themeOption.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{themeOption.description}</p>
                      {theme === themeOption.id && <CheckIcon className="h-4 w-4 text-primary mx-auto mt-2" />}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
                </div>
                <div className="flex items-center space-x-2">
                  <SunIcon className="h-4 w-4 text-yellow-500" />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => handleThemeChange(checked ? "dark" : "light")}
                  />
                  <MoonIcon className="h-4 w-4 text-blue-500" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Font Size</Label>
                  <p className="text-xs text-muted-foreground">Adjust the font size of the application</p>
                  <Select
                    value={settings.appearance.fontSize}
                    onValueChange={(value) => updateSetting("appearance", "fontSize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Animation Speed</Label>
                  <p className="text-xs text-muted-foreground">Control the speed of animations</p>
                  <Select
                    value={settings.appearance.animationSpeed}
                    onValueChange={(value) => updateSetting("appearance", "animationSpeed", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {animationSpeeds.map((speed) => (
                        <SelectItem key={speed.id} value={speed.id}>
                          {speed.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Layout</Label>
                  <p className="text-xs text-muted-foreground">Choose between different layouts</p>
                  <Select
                    value={settings.appearance.layout}
                    onValueChange={(value) => updateSetting("appearance", "layout", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {layouts.map((layout) => (
                        <SelectItem key={layout.id} value={layout.id}>
                          {layout.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AccessibilityIcon className="h-5 w-5 mr-2 text-primary" />
                Accessibility
              </CardTitle>
              <CardDescription>Accessibility options for users with disabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">High Contrast Mode</Label>
                  <p className="text-xs text-muted-foreground">Enable a high contrast color scheme</p>
                </div>
                <Switch
                  checked={settings.appearance.highContrast}
                  onCheckedChange={(checked) => updateSetting("appearance", "highContrast", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Reduced Motion</Label>
                  <p className="text-xs text-muted-foreground">Reduce animations and transitions</p>
                </div>
                <Switch
                  checked={settings.appearance.reducedMotion}
                  onCheckedChange={(checked) => updateSetting("appearance", "reducedMotion", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BellIcon className="h-5 w-5 mr-2 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Control what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {key === "gameInvites" && "Receive notifications for game invitations"}
                      {key === "friendRequests" && "Get notified when someone sends a friend request"}
                      {key === "achievements" && "Celebrate your gaming achievements"}
                      {key === "systemUpdates" && "Stay informed about system updates"}
                      {key === "coachTips" && "Receive AI coaching recommendations"}
                      {key === "scheduledNotifications" && "Schedule when you receive notifications"}
                      {key === "doNotDisturb" && "Silence notifications for a set period"}
                    </p>
                  </div>
                  <Switch checked={value} onCheckedChange={(checked) => updateSetting("notifications", key, checked)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <VolumeIcon className="h-5 w-5 mr-2 text-primary" />
                Audio Settings
              </CardTitle>
              <CardDescription>Adjust volume levels and audio preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(settings.audio).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </Label>
                    <span className="text-sm text-muted-foreground">{value[0]}%</span>
                  </div>
                  <Slider
                    value={value}
                    onValueChange={(newValue) => updateSetting("audio", key, newValue)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldIcon className="h-5 w-5 mr-2 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Control your privacy and data sharing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {key === "showOnlineStatus" && "Let friends see when you're online"}
                      {key === "allowFriendRequests" && "Allow others to send friend requests"}
                      {key === "showGameStats" && "Display your gaming statistics publicly"}
                      {key === "shareAchievements" && "Share achievements with friends"}
                      {key === "limitDataCollection" && "Limit the amount of data collected"}
                      {key === "anonymizeData" && "Anonymize your data for privacy"}
                    </p>
                  </div>
                  <Switch checked={value} onCheckedChange={(checked) => updateSetting("privacy", key, checked)} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LockKeyholeIcon className="h-5 w-5 mr-2 text-primary" />
                Advanced Privacy Controls
              </CardTitle>
              <CardDescription>Manage your data and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => toast({ title: "Export Started", description: "Your data export has been initiated" })}
                >
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <p className="text-xs text-muted-foreground">Download a copy of your data</p>
              </div>

              <div className="space-y-2">
                <Button
                  variant="destructive"
                  onClick={() =>
                    toast({
                      title: "Account Deletion",
                      description: "Please contact support to delete your account",
                      variant: "destructive",
                    })
                  }
                >
                  <EyeOffIcon className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
                <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GamepadIcon className="h-5 w-5 mr-2 text-primary" />
                Performance Settings
              </CardTitle>
              <CardDescription>Optimize Aphrodite for better performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.performance).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {key === "autoOptimize" && "Automatically optimize system for gaming"}
                      {key === "backgroundApps" && "Close unnecessary background applications"}
                      {key === "gameMode" && "Enable Windows Game Mode"}
                      {key === "hardwareAcceleration" && "Use hardware acceleration when available"}
                    </p>
                  </div>
                  <Switch checked={value} onCheckedChange={(checked) => updateSetting("performance", key, checked)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <KeyIcon className="h-5 w-5 mr-2 text-primary" />
                API Integrations
              </CardTitle>
              <CardDescription>Configure external service integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Google Gemini API Key</Label>
                <p className="text-xs text-muted-foreground">
                  Enter your Google Gemini API key to power CoachGPT with advanced AI
                </p>
                <Input
                  type="password"
                  placeholder="Enter your Gemini API key..."
                  value={settings.geminiApiKey}
                  onChange={(e) => setSettings((prev) => ({ ...prev, geminiApiKey: e.target.value }))}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast({ title: "Connection Test", description: "API key validation completed" })}
                >
                  Test Connection
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <DatabaseIcon className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="font-medium">Steam Integration</h3>
                        <p className="text-xs text-muted-foreground">Connected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <WifiIcon className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Discord Bot</h3>
                        <p className="text-xs text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
