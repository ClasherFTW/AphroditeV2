"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircleIcon,
  XCircleIcon,
  RefreshCwIcon,
  BotIcon,
  SendIcon,
  AlertTriangleIcon,
  WifiIcon,
} from "lucide-react"

interface ConnectionStatus {
  isConnected: boolean
  lastChecked: Date | null
  responseTime: number | null
  webhookInfo: any | null
  error: string | null
}

export default function DiscordStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    lastChecked: null,
    responseTime: null,
    webhookInfo: null,
    error: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const checkConnection = async () => {
    setIsLoading(true)
    const startTime = Date.now()

    try {
      console.log("🔍 Checking Discord connection...")

      const response = await fetch("/api/discord", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      const data = await response.json()
      const responseTime = Date.now() - startTime

      console.log("📡 Discord API response:", data)

      setStatus({
        isConnected: data.success,
        lastChecked: new Date(),
        responseTime,
        webhookInfo: data.webhookInfo || null,
        error: data.success ? null : data.error || "Connection failed",
      })

      if (data.success) {
        toast({
          title: "Discord Connected ✅",
          description: `Bot is online! Response time: ${responseTime}ms`,
        })
      } else {
        toast({
          title: "Discord Connection Failed ❌",
          description: data.error || "Unable to connect to Discord webhook",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Connection check failed:", error)

      setStatus({
        isConnected: false,
        lastChecked: new Date(),
        responseTime: null,
        webhookInfo: null,
        error: error instanceof Error ? error.message : "Network error",
      })

      toast({
        title: "Connection Error ❌",
        description: "Failed to check Discord bot status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestMessage = async () => {
    setIsLoading(true)
    try {
      console.log("🧪 Sending test message...")

      const response = await fetch("/api/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "test_connection",
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Test Message Sent! 🚀",
          description: "Check your Discord channel for the test message",
        })
        // Refresh status after successful test
        setTimeout(() => checkConnection(), 1000)
      } else {
        toast({
          title: "Test Failed ❌",
          description: data.error || "Unable to send test message",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Test message failed:", error)
      toast({
        title: "Test Failed ❌",
        description: "Unable to send test message",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-check connection on mount and periodically
  useEffect(() => {
    checkConnection()

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    if (isLoading) return "bg-blue-500/20 text-blue-300"
    if (status.isConnected) return "bg-green-500/20 text-green-300"
    return "bg-red-500/20 text-red-300"
  }

  const getStatusText = () => {
    if (isLoading) return "Checking..."
    if (status.isConnected) return "Online"
    return "Offline"
  }

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCwIcon className="h-4 w-4 animate-spin" />
    if (status.isConnected) return <CheckCircleIcon className="h-4 w-4 text-green-400" />
    return <XCircleIcon className="h-4 w-4 text-red-400" />
  }

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BotIcon className="h-5 w-5 text-purple-400" />
            <span>Discord Bot Status</span>
          </div>
          <Badge variant="outline" className={getStatusColor()}>
            <WifiIcon className="h-3 w-3 mr-1" />
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg border">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <div className="font-medium text-sm">
                {status.isConnected ? "Webhook Connected" : "Connection Failed"}
              </div>
              <div className="text-xs text-muted-foreground">
                {status.lastChecked ? `Last checked: ${status.lastChecked.toLocaleTimeString()}` : "Never checked"}
              </div>
            </div>
          </div>
          {status.responseTime && (
            <div className="text-right">
              <div className="text-sm font-medium">{status.responseTime}ms</div>
              <div className="text-xs text-muted-foreground">Response time</div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {status.error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Error Details:</span>
            </div>
            <div className="text-xs text-red-300 mt-1">{status.error}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button onClick={checkConnection} disabled={isLoading} size="sm" variant="outline" className="flex-1">
            <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Status
          </Button>
          <Button
            onClick={sendTestMessage}
            disabled={isLoading || !status.isConnected}
            size="sm"
            className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
          >
            <SendIcon className="h-4 w-4 mr-2" />
            Send Test
          </Button>
        </div>

        {/* Features List */}
        <div className="text-xs text-white/60 space-y-1">
          <div className="font-medium text-white/80 mb-2">Active Features:</div>
          <div>• User-specific challenge notifications</div>
          <div>• Leaderboard position updates</div>
          <div>• Rank progression alerts</div>
          <div>• Teammate requests with @everyone</div>
          <div>• Real-time performance stats</div>
        </div>

        {/* Connection Info */}
        {status.isConnected && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">All Systems Operational</span>
            </div>
            <div className="text-xs text-green-300 mt-1">
              Discord webhook is responding normally. Notifications will be delivered.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
