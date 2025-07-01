"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import DiscordStatus from "@/components/discord-status"
import DiscordTestPanel from "@/components/discord-test-panel"
import {
  BotIcon,
  SettingsIcon,
  TestTubeIcon,
  ActivityIcon,
  MessageSquareIcon,
  UsersIcon,
  TrophyIcon,
  ZapIcon,
  ShieldIcon,
  BellIcon,
} from "lucide-react"

export default function DiscordBotHub() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <BotIcon className="h-8 w-8 mr-3 text-purple-500" />
            Discord Bot Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your Discord bot integration, test notifications, and monitor connection status
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            <BotIcon className="h-3 w-3 mr-1" />
            Bot Active
          </Badge>
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Connected
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center">
            <ActivityIcon className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center">
            <ShieldIcon className="h-4 w-4 mr-2" />
            Status
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center">
            <TestTubeIcon className="h-4 w-4 mr-2" />
            Testing
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Feature Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BellIcon className="h-5 w-5 mr-2 text-purple-500" />
                  Smart Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Personalized Discord notifications for achievements, rank changes, and challenges
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Challenge completions
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    Leaderboard updates
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                    Rank progressions
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Team Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Seamless team communication with @everyone teammate requests
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mr-2" />
                    Teammate requests
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                    Match invitations
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2" />
                    Squad updates
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <TrophyIcon className="h-5 w-5 mr-2 text-green-500" />
                  Achievement Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Real-time achievement notifications with rich embeds and user stats
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                    Performance milestones
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                    Competitive achievements
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2" />
                    Social recognition
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-500">24/7</div>
                <div className="text-sm text-muted-foreground">Bot Uptime</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-500">4</div>
                <div className="text-sm text-muted-foreground">Notification Types</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-500">∞</div>
                <div className="text-sm text-muted-foreground">Messages/Day</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-500">&lt; 1s</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquareIcon className="h-5 w-5 mr-2" />
                Recent Bot Activity
              </CardTitle>
              <CardDescription>Latest Discord notifications sent by the bot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Challenge Completed</div>
                    <div className="text-xs text-muted-foreground">
                      Sent notification for "Headshot Master" challenge completion
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">2 min ago</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Leaderboard Update</div>
                    <div className="text-xs text-muted-foreground">Notified about rank climb from #15 to #8</div>
                  </div>
                  <div className="text-xs text-muted-foreground">5 min ago</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Rank Progression</div>
                    <div className="text-xs text-muted-foreground">Celebrated promotion from Gold 2 to Gold 3</div>
                  </div>
                  <div className="text-xs text-muted-foreground">12 min ago</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-pink-500 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Teammate Request</div>
                    <div className="text-xs text-muted-foreground">Posted @everyone request for ranked teammates</div>
                  </div>
                  <div className="text-xs text-muted-foreground">18 min ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <DiscordStatus />
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <DiscordTestPanel />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Bot Configuration
              </CardTitle>
              <CardDescription>Configure your Discord bot settings and notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <ZapIcon className="h-4 w-4 mr-2 text-primary" />
                    Environment Variables
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">DISCORD_WEBHOOK_MATCHES:</span>
                      <Badge variant="outline" className="text-green-600 border-green-500/30">
                        ✓ Configured
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">DISCORD_WEBHOOK_CHALLENGES:</span>
                      <Badge variant="outline" className="text-green-600 border-green-500/30">
                        ✓ Configured
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">DISCORD_WEBHOOK_LEADERBOARD:</span>
                      <Badge variant="outline" className="text-green-600 border-green-500/30">
                        ✓ Configured
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">DISCORD_WEBHOOK_GENERAL:</span>
                      <Badge variant="outline" className="text-green-600 border-green-500/30">
                        ✓ Configured
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-600">Bot Features</h4>
                  <div className="space-y-2 text-sm">
                    <div>• User-specific notifications with profile data</div>
                    <div>• Rich embeds with game statistics</div>
                    <div>• @everyone mentions for teammate requests</div>
                    <div>• Real-time webhook delivery</div>
                    <div>• Automatic retry on failure</div>
                  </div>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-600">Security Features</h4>
                  <div className="space-y-2 text-sm">
                    <div>• Secure webhook URLs</div>
                    <div>• Rate limiting protection</div>
                    <div>• Error handling and logging</div>
                    <div>• Environment variable protection</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
