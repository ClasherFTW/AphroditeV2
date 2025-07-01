"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/demo-auth-provider"
import {
  SmartphoneIcon,
  QrCodeIcon,
  DownloadIcon,
  WifiIcon,
  BellIcon,
  GamepadIcon,
  TrophyIcon,
  UsersIcon,
  MessageCircleIcon,
  BarChart3Icon,
  SettingsIcon,
  FolderSyncIcon as SyncIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ZapIcon,
  EyeIcon,
  HeadphonesIcon,
  MicIcon,
  RefreshCwIcon,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface MobileFeature {
  id: string
  name: string
  description: string
  icon: any
  status: "available" | "coming_soon" | "beta"
  category: "core" | "social" | "performance" | "utility"
}

export default function MobileCompanion() {
  const { user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("synced")
  const [qrCode, setQrCode] = useState<string>("")
  const [deviceInfo, setDeviceInfo] = useState({
    name: "iPhone 15 Pro",
    os: "iOS 17.2",
    appVersion: "2.1.0",
    lastSync: new Date(),
  })

  const mobileFeatures: MobileFeature[] = [
    {
      id: "live-stats",
      name: "Live Match Stats",
      description: "View real-time match statistics and player performance",
      icon: BarChart3Icon,
      status: "available",
      category: "core",
    },
    {
      id: "notifications",
      name: "Smart Notifications",
      description: "Get notified about match invites, friend requests, and achievements",
      icon: BellIcon,
      status: "available",
      category: "core",
    },
    {
      id: "voice-chat",
      name: "Voice Chat",
      description: "Join team voice channels directly from your mobile device",
      icon: HeadphonesIcon,
      status: "available",
      category: "social",
    },
    {
      id: "quick-commands",
      name: "Quick Commands",
      description: "Control your gaming setup with voice commands and shortcuts",
      icon: MicIcon,
      status: "beta",
      category: "utility",
    },
    {
      id: "team-chat",
      name: "Team Chat",
      description: "Stay connected with your team even when away from PC",
      icon: MessageCircleIcon,
      status: "available",
      category: "social",
    },
    {
      id: "performance-monitor",
      name: "Performance Monitor",
      description: "Monitor your PC performance and get optimization alerts",
      icon: ZapIcon,
      status: "available",
      category: "performance",
    },
    {
      id: "match-finder",
      name: "Match Finder",
      description: "Find and join matches while on the go",
      icon: GamepadIcon,
      status: "available",
      category: "core",
    },
    {
      id: "tournament-tracker",
      name: "Tournament Tracker",
      description: "Follow tournament brackets and schedules",
      icon: TrophyIcon,
      status: "available",
      category: "core",
    },
    {
      id: "remote-control",
      name: "Remote Control",
      description: "Control your desktop app remotely",
      icon: SettingsIcon,
      status: "coming_soon",
      category: "utility",
    },
    {
      id: "watch-party",
      name: "Watch Party",
      description: "Join and host watch parties from your mobile device",
      icon: EyeIcon,
      status: "beta",
      category: "social",
    },
  ]

  useEffect(() => {
    // Generate QR code for mobile app connection
    generateQRCode()

    // Simulate connection status
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.3) // 70% chance of being connected
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const generateQRCode = () => {
    // In a real implementation, this would generate an actual QR code
    const connectionData = {
      userId: user?.uid || "demo-user",
      sessionId: Date.now().toString(),
      serverUrl: "wss://api.aphrodite.gg/mobile",
      timestamp: Date.now(),
    }

    // Simulate QR code data
    setQrCode(btoa(JSON.stringify(connectionData)))
  }

  const handleSync = () => {
    setSyncStatus("syncing")

    // Simulate sync process
    setTimeout(() => {
      setSyncStatus("synced")
      setDeviceInfo((prev) => ({ ...prev, lastSync: new Date() }))
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "border-green-400 text-green-300"
      case "beta":
        return "border-yellow-400 text-yellow-300"
      case "coming_soon":
        return "border-gray-400 text-gray-300"
      default:
        return "border-gray-400 text-gray-300"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "core":
        return GamepadIcon
      case "social":
        return UsersIcon
      case "performance":
        return ZapIcon
      case "utility":
        return SettingsIcon
      default:
        return GamepadIcon
    }
  }

  const formatLastSync = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SmartphoneIcon className="h-8 w-8 text-blue-400" />
          <div>
            <h2 className="text-3xl font-bold text-white">Mobile Companion</h2>
            <p className="text-white/60">Seamless gaming experience across all your devices</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge
            variant="outline"
            className={isConnected ? "border-green-400 text-green-300" : "border-red-400 text-red-300"}
          >
            {isConnected ? <CheckCircleIcon className="h-3 w-3 mr-1" /> : <AlertCircleIcon className="h-3 w-3 mr-1" />}
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <Button onClick={handleSync} disabled={syncStatus === "syncing"} variant="outline">
            <SyncIcon className={`h-4 w-4 mr-2 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
            Sync
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-black/20 backdrop-blur-sm">
          <TabsTrigger value="overview">
            <SmartphoneIcon className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="features">
            <ZapIcon className="h-4 w-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="setup">
            <QrCodeIcon className="h-4 w-4 mr-2" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Connection Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <WifiIcon className="h-5 w-5 mr-2 text-blue-400" />
                  Connection Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Status</span>
                  <Badge
                    variant="outline"
                    className={isConnected ? "border-green-400 text-green-300" : "border-red-400 text-red-300"}
                  >
                    {isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Device</span>
                  <span className="text-white">{deviceInfo.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">App Version</span>
                  <span className="text-white">{deviceInfo.appVersion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Last Sync</span>
                  <span className="text-white">{formatLastSync(deviceInfo.lastSync)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3Icon className="h-5 w-5 mr-2 text-green-400" />
                  Mobile Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Daily Active Time</span>
                    <span className="text-white">2h 34m</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Features Used</span>
                    <span className="text-white">7/10</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Notifications</span>
                    <span className="text-white">23 today</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrophyIcon className="h-5 w-5 mr-2 text-yellow-400" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">12</div>
                  <div className="text-sm text-white/60">Matches Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">68%</div>
                  <div className="text-sm text-white/60">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">1,247</div>
                  <div className="text-sm text-white/60">Rank Points</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Recent Mobile Activity</CardTitle>
              <CardDescription className="text-white/60">Your latest interactions from the mobile app</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {[
                    {
                      action: "Joined voice chat",
                      time: "2 minutes ago",
                      icon: HeadphonesIcon,
                      color: "text-green-400",
                    },
                    {
                      action: "Checked match stats",
                      time: "15 minutes ago",
                      icon: BarChart3Icon,
                      color: "text-blue-400",
                    },
                    {
                      action: "Sent team message",
                      time: "32 minutes ago",
                      icon: MessageCircleIcon,
                      color: "text-purple-400",
                    },
                    { action: "Received achievement", time: "1 hour ago", icon: TrophyIcon, color: "text-yellow-400" },
                    { action: "Updated settings", time: "2 hours ago", icon: SettingsIcon, color: "text-gray-400" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                      <div className="flex-1">
                        <div className="text-white text-sm">{activity.action}</div>
                        <div className="text-white/60 text-xs">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mobileFeatures.map((feature) => {
              const Icon = feature.icon
              const CategoryIcon = getCategoryIcon(feature.category)

              return (
                <Card
                  key={feature.id}
                  className="bg-black/20 border-white/10 backdrop-blur-sm hover:bg-black/30 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="h-6 w-6 text-blue-400" />
                      <Badge variant="outline" className={getStatusColor(feature.status)}>
                        {feature.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <CardTitle className="text-white">{feature.name}</CardTitle>
                    <CardDescription className="text-white/60">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CategoryIcon className="h-4 w-4 text-white/60" />
                        <span className="text-sm text-white/60 capitalize">{feature.category}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={feature.status === "available" ? "default" : "outline"}
                        disabled={feature.status === "coming_soon"}
                      >
                        {feature.status === "available" && "Use Now"}
                        {feature.status === "beta" && "Try Beta"}
                        {feature.status === "coming_soon" && "Coming Soon"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Code Setup */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <QrCodeIcon className="h-5 w-5 mr-2 text-blue-400" />
                  Quick Setup
                </CardTitle>
                <CardDescription className="text-white/60">
                  Scan the QR code with your mobile device to connect instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* QR Code Display */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCodeIcon className="h-16 w-16 mx-auto mb-2 text-gray-800" />
                      <div className="text-xs text-gray-600 font-mono break-all px-2">{qrCode.slice(0, 20)}...</div>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-white text-sm">1. Download the Aphrodite mobile app</p>
                  <p className="text-white text-sm">2. Open the app and tap "Connect to PC"</p>
                  <p className="text-white text-sm">3. Scan this QR code to connect</p>
                </div>

                <Button onClick={generateQRCode} variant="outline" className="w-full">
                  <RefreshCwIcon className="h-4 w-4 mr-2" />
                  Generate New Code
                </Button>
              </CardContent>
            </Card>

            {/* Manual Setup */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DownloadIcon className="h-5 w-5 mr-2 text-green-400" />
                  Download App
                </CardTitle>
                <CardDescription className="text-white/60">
                  Get the Aphrodite mobile app for your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* App Store Links */}
                <div className="space-y-4">
                  <Button className="w-full bg-black text-white border border-white/20 hover:bg-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-black text-xs font-bold">📱</span>
                      </div>
                      <div className="text-left">
                        <div className="text-sm">Download on the</div>
                        <div className="text-lg font-semibold">App Store</div>
                      </div>
                    </div>
                  </Button>

                  <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-xs font-bold">▶</span>
                      </div>
                      <div className="text-left">
                        <div className="text-sm">Get it on</div>
                        <div className="text-lg font-semibold">Google Play</div>
                      </div>
                    </div>
                  </Button>
                </div>

                {/* App Features */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold">App Features:</h4>
                  <div className="space-y-2">
                    {[
                      "Real-time match tracking",
                      "Voice chat integration",
                      "Performance monitoring",
                      "Team communication",
                      "Tournament updates",
                      "Achievement notifications",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-400" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Requirements */}
                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Requirements:</h4>
                  <div className="text-sm text-white/60">
                    <p>iOS 14.0+ or Android 8.0+</p>
                    <p>50MB storage space</p>
                    <p>Internet connection required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Mobile App Settings</CardTitle>
              <CardDescription className="text-white/60">Configure your mobile companion experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Settings */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Notifications</h3>
                <div className="space-y-3">
                  {[
                    { label: "Match Invites", description: "Get notified when friends invite you to matches" },
                    { label: "Achievement Unlocked", description: "Celebrate your gaming achievements" },
                    { label: "Team Messages", description: "Stay updated with team communications" },
                    { label: "Tournament Updates", description: "Follow your favorite tournaments" },
                    { label: "Performance Alerts", description: "Get notified about PC performance issues" },
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white text-sm font-medium">{setting.label}</div>
                        <div className="text-white/60 text-xs">{setting.description}</div>
                      </div>
                      <Switch defaultChecked={index < 3} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sync Settings */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Synchronization</h3>
                <div className="space-y-3">
                  {[
                    { label: "Auto Sync", description: "Automatically sync data when connected" },
                    { label: "Background Sync", description: "Sync data in the background" },
                    { label: "WiFi Only", description: "Only sync when connected to WiFi" },
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white text-sm font-medium">{setting.label}</div>
                        <div className="text-white/60 text-xs">{setting.description}</div>
                      </div>
                      <Switch defaultChecked={index === 0} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Privacy</h3>
                <div className="space-y-3">
                  {[
                    { label: "Share Usage Data", description: "Help improve the app by sharing anonymous usage data" },
                    { label: "Location Services", description: "Allow location access for nearby player features" },
                    { label: "Camera Access", description: "Allow camera access for QR code scanning" },
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white text-sm font-medium">{setting.label}</div>
                        <div className="text-white/60 text-xs">{setting.description}</div>
                      </div>
                      <Switch defaultChecked={index === 2} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
