import { type NextRequest, NextResponse } from "next/server"
import { DiscordService } from "@/lib/discord-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    console.log(`📨 Discord API: Received ${type} request`)

    switch (type) {
      case "test_connection":
        console.log("🧪 Testing Discord connection...")
        const isConnected = await DiscordService.testConnection()
        return NextResponse.json({
          success: isConnected,
          message: isConnected ? "Test message sent successfully!" : "Failed to send test message",
          timestamp: new Date().toISOString(),
        })

      case "watch_party_announcement":
        await DiscordService.sendWatchPartyAnnouncement({
          partyId: data.partyId,
          title: data.title,
          hostUsername: data.hostUsername,
          hostAvatar: data.hostAvatar,
          description: data.description,
          streamUrl: data.streamUrl,
          maxParticipants: data.maxParticipants,
          isPrivate: data.isPrivate,
          scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : undefined,
          tags: data.tags,
          joinLink: data.joinLink,
        })
        break

      case "watch_party_update":
        await DiscordService.sendWatchPartyUpdate(
          data.partyTitle,
          data.participantName,
          data.currentParticipants,
          data.maxParticipants,
          data.joinLink,
        )
        break

      case "user_challenge_completed":
        await DiscordService.sendUserChallengeCompletion(
          data.username,
          data.challengeTitle,
          data.points,
          data.difficulty,
          data.userStats,
          data.userAvatar,
        )
        break

      case "user_leaderboard_update":
        await DiscordService.sendUserLeaderboardUpdate(
          data.username,
          data.oldPosition,
          data.newPosition,
          data.points,
          data.userStats,
          data.userAvatar,
        )
        break

      case "user_rank_up":
        await DiscordService.sendUserRankUp(
          data.username,
          data.gameType,
          data.oldRank,
          data.newRank,
          data.userStats,
          data.userAvatar,
        )
        break

      case "teammate_request":
        await DiscordService.sendTeammateRequest({
          username: data.username,
          gameType: data.gameType,
          currentRank: data.currentRank,
          preferredRole: data.preferredRole,
          message: data.message,
          userStats: data.userStats,
        })
        break

      default:
        console.warn(`⚠️ Discord API: Unknown notification type: ${type}`)
        return NextResponse.json({ error: "Unknown notification type" }, { status: 400 })
    }

    console.log(`✅ Discord API: ${type} notification sent successfully`)
    return NextResponse.json({
      success: true,
      message: "Discord notification sent successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Discord API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send Discord notification",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    console.log("🔍 Checking Discord webhook status...")

    const startTime = Date.now()
    const isConnected = await DiscordService.testConnection()
    const responseTime = Date.now() - startTime

    // Try to get webhook info for additional details
    let webhookInfo = null
    try {
      webhookInfo = await DiscordService.getWebhookInfo()
    } catch (error) {
      console.warn("⚠️ Could not fetch webhook info:", error)
    }

    const response = {
      success: isConnected,
      message: isConnected ? "Discord webhook is connected and operational" : "Discord webhook connection failed",
      timestamp: new Date().toISOString(),
      responseTime,
      webhookInfo: webhookInfo
        ? {
            name: webhookInfo.name,
            guild_id: webhookInfo.guild_id,
            channel_id: webhookInfo.channel_id,
          }
        : null,
      error: isConnected ? null : "Webhook test failed - check webhook URL and permissions",
    }

    console.log("📊 Discord status check result:", response)

    return NextResponse.json(response)
  } catch (error) {
    console.error("❌ Discord status check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check Discord connection",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
