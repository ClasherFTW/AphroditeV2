"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  DatabaseIcon,
  WifiIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
  GamepadIcon,
  MessageCircleIcon,
  BarChartIcon,
} from "lucide-react"

interface APIIntegration {
  id: string
  name: string
  description: string
  icon: any
  status: "connected" | "disconnected" | "error"
  lastSync: Date
  features: string[]
  apiKey?: string
  isEnabled: boolean
}

export default function APIIntegrations() {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([
    {
      id: "steam",
      name: "Steam API",
      description: "Sync your Steam games, achievements, and playtime",
      icon: DatabaseIcon,
      status: "connected",
      lastSync: new Date(Date.now() - 300000),
      features: ["Game Library", "Achievements", "Playtime", "Friends List"],
      apiKey: "STEAM_****_****_****",
      isEnabled: true,
    },
    {
      id: "discord",
      name: "Discord Bot",
      description: "Rich presence and team communication integration",
      icon: MessageCircleIcon,
      status: "disconnected",
      lastSync: new Date(Date.now() - 86400000),
      features: ["Rich Presence", "Voice Channels", "Team Chat", "Notifications"],
      isEnabled: false,
    },
    {
      id: "riot",
      name: "Riot Games API",
      description: "Valorant and League of Legends match data",
      icon: GamepadIcon,
      status: "connected",
      lastSync: new Date(Date.now() - 600000),
      features: ["Match History", "Rank Tracking", "Performance Stats", "Leaderboards"],
      apiKey: "RGAPI-****-****-****",
      isEnabled: true,
    },
    {
      id: "faceit",
      name: "FACEIT API",
      description: "CS2 and other competitive game statistics",
      icon: BarChartIcon,
      status: "error",
      lastSync: new Date(Date.now() - 3600000),
      features: ["Match Stats", "ELO Tracking", "Tournament Data", "Player Rankings"],
      apiKey: "FACEIT_****_****",
      isEnabled: true,
    },
  ])

  const [newApiKey, setNewApiKey] = useState("")
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <XCircleIcon className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "border-green-500/30 text-green-400"
      case "error":
        return "border-red-500/30 text-red-400"
      default:
        return "border-muted text-muted-foreground"
    }
  }

  const handleConnect = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? { ...integration, status: "connected" as const, lastSync: new Date(), isEnabled: true }
          : integration,
      ),
    )
  }

  const handleDisconnect = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? { ...integration, status: "disconnected" as const, isEnabled: false }
          : integration,
      ),
    )
  }

  const handleSync = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId ? { ...integration, lastSync: new Date() } : integration,
      ),
    )
  }

  const handleToggle = (integrationId: string, enabled: boolean) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId ? { ...integration, isEnabled: enabled } : integration,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">API Integrations</h2>
        <Badge variant="outline">
          <WifiIcon className="h-3 w-3 mr-1" />
          {integrations.filter((i) => i.status === "connected").length} Connected
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration, index) => {
          const IconComponent = integration.icon
          return (
            <Card
              key={integration.id}
              className="bg-card border-border transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(integration.status)}
                    <Switch
                      checked={integration.isEnabled}
                      onCheckedChange={(checked) => handleToggle(integration.id, checked)}
                      disabled={integration.status === "disconnected"}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={getStatusColor(integration.status)}>
                    {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Last sync: {integration.lastSync.toLocaleTimeString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Features</Label>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {integration.apiKey && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">API Key</Label>
                    <div className="flex items-center space-x-2">
                      <Input type="password" value={integration.apiKey} readOnly className="text-xs" />
                      <Button size="sm" variant="outline">
                        <KeyIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  {integration.status === "connected" ? (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleSync(integration.id)} className="flex-1">
                        <RefreshCwIcon className="h-3 w-3 mr-1" />
                        Sync
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDisconnect(integration.id)}
                        className="flex-1"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => handleConnect(integration.id)} className="flex-1">
                      Connect
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <ExternalLinkIcon className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add New Integration */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <KeyIcon className="h-5 w-5 mr-2 text-primary" />
            Add Custom Integration
          </CardTitle>
          <CardDescription>Connect your own API or service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Service Name</Label>
              <Input placeholder="Enter service name..." />
            </div>
            <div className="space-y-2">
              <Label>API Endpoint</Label>
              <Input placeholder="https://api.example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              placeholder="Enter your API key..."
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
            />
          </div>
          <Button className="w-full">
            <WifiIcon className="h-4 w-4 mr-2" />
            Test & Add Integration
          </Button>
        </CardContent>
      </Card>

      {/* Integration Stats */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Integration Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-green-500">
                {integrations.filter((i) => i.status === "connected").length}
              </div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-blue-500">
                {integrations.reduce((sum, i) => sum + i.features.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Features</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-purple-500">{integrations.filter((i) => i.isEnabled).length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-yellow-500">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
