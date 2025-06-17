// Discord Integration Service
interface DiscordMessage {
  content?: string
  embeds?: DiscordEmbed[]
  username?: string
  avatar_url?: string
}

interface DiscordEmbed {
  title?: string
  description?: string
  color?: number
  fields?: DiscordField[]
  thumbnail?: { url: string }
  footer?: { text: string; icon_url?: string }
  timestamp?: string
  author?: { name: string; icon_url?: string }
}

interface DiscordField {
  name: string
  value: string
  inline?: boolean
}

interface UserStats {
  currentRank: string
  winRate: number
  kda: string
  gamesPlayed: number
  weeklyLP: number
  hoursPlayed: number
  recentMatches: Array<{
    result: "win" | "loss"
    score: string
    map: string
    date: Date
  }>
}

interface TeammateRequest {
  username: string
  gameType: string
  currentRank: string
  preferredRole?: string
  message?: string
  userStats: UserStats
}

export class DiscordService {
  // Using your webhook URL directly
  private static readonly WEBHOOK_URL =
    "https://discord.com/api/webhooks/1384250206387699782/fsfAAo5F723F4KQlTTHJwcRbW7Qm8g6A8gH-MiB7ZKhyzKasSsrsoWICY8jA4UHohDJ9"

  private static readonly COLORS = {
    success: 0x00ff00, // Green
    warning: 0xffaa00, // Orange
    info: 0x0099ff, // Blue
    achievement: 0xff6600, // Orange-Red
    rankup: 0x9900ff, // Purple
    teammate: 0xff1493, // Deep Pink
    challenge: 0x32cd32, // Lime Green
    leaderboard: 0x4169e1, // Royal Blue
  }

  // Validate and clean embed data
  private static validateEmbed(embed: DiscordEmbed): DiscordEmbed {
    const cleanEmbed: DiscordEmbed = {}

    if (embed.title && embed.title.trim()) {
      cleanEmbed.title = embed.title.slice(0, 256)
    }

    if (embed.description && embed.description.trim()) {
      cleanEmbed.description = embed.description.slice(0, 4096)
    }

    if (typeof embed.color === "number" && embed.color >= 0 && embed.color <= 0xffffff) {
      cleanEmbed.color = embed.color
    }

    if (embed.fields && Array.isArray(embed.fields)) {
      cleanEmbed.fields = embed.fields
        .filter((field) => field.name && field.value && field.name.trim() && field.value.trim())
        .slice(0, 25)
        .map((field) => ({
          name: field.name.slice(0, 256),
          value: field.value.slice(0, 1024),
          inline: Boolean(field.inline),
        }))
    }

    if (embed.thumbnail?.url && embed.thumbnail.url.startsWith("http")) {
      cleanEmbed.thumbnail = { url: embed.thumbnail.url }
    }

    if (embed.footer?.text && embed.footer.text.trim()) {
      cleanEmbed.footer = {
        text: embed.footer.text.slice(0, 2048),
        icon_url: embed.footer.icon_url && embed.footer.icon_url.startsWith("http") ? embed.footer.icon_url : undefined,
      }
    }

    if (embed.author?.name && embed.author.name.trim()) {
      cleanEmbed.author = {
        name: embed.author.name.slice(0, 256),
        icon_url: embed.author.icon_url && embed.author.icon_url.startsWith("http") ? embed.author.icon_url : undefined,
      }
    }

    if (embed.timestamp) {
      cleanEmbed.timestamp = embed.timestamp
    }

    return cleanEmbed
  }

  // Get user performance emoji based on stats
  private static getUserPerformanceEmoji(userStats: UserStats): string {
    if (userStats.winRate >= 80) return "🔥"
    if (userStats.winRate >= 70) return "⭐"
    if (userStats.winRate >= 60) return "💪"
    if (userStats.winRate >= 50) return "👍"
    return "📈"
  }

  // Get rank tier emoji
  private static getRankEmoji(rank: string): string {
    const rankLower = rank.toLowerCase()
    if (rankLower.includes("immortal") || rankLower.includes("radiant")) return "💎"
    if (rankLower.includes("diamond")) return "💠"
    if (rankLower.includes("platinum")) return "🔷"
    if (rankLower.includes("gold")) return "🟨"
    if (rankLower.includes("silver")) return "⚪"
    if (rankLower.includes("bronze")) return "🟫"
    return "🎮"
  }

  // Send user-specific challenge completion message
  static async sendUserChallengeCompletion(
    username: string,
    challengeTitle: string,
    points: number,
    difficulty: string,
    userStats: UserStats,
    userAvatar?: string,
  ): Promise<void> {
    try {
      const performanceEmoji = this.getUserPerformanceEmoji(userStats)
      const rankEmoji = this.getRankEmoji(userStats.currentRank)

      const embed: DiscordEmbed = {
        title: `${performanceEmoji} Challenge Mastered!`,
        description: `**${username}** has conquered a new challenge and continues their climb to greatness!`,
        color: this.COLORS.challenge,
        author: {
          name: `${username} • ${userStats.currentRank}`,
          icon_url: userAvatar,
        },
        fields: [
          {
            name: "🎯 Challenge Completed",
            value: `**${challengeTitle}**\n*${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty*`,
            inline: true,
          },
          {
            name: "💎 Reward Earned",
            value: `**${points} AP**\n*Aphrodite Points*`,
            inline: true,
          },
          {
            name: `${rankEmoji} Current Stats`,
            value: `**Rank:** ${userStats.currentRank}\n**Win Rate:** ${userStats.winRate}%\n**K/D/A:** ${userStats.kda}`,
            inline: true,
          },
          {
            name: "📊 Recent Performance",
            value: `**Games Played:** ${userStats.gamesPlayed}\n**Weekly LP:** +${userStats.weeklyLP}\n**Hours Played:** ${userStats.hoursPlayed}h`,
            inline: true,
          },
          {
            name: "🔥 Recent Form",
            value: userStats.recentMatches
              .slice(0, 5)
              .map((match) => (match.result === "win" ? "🟢" : "🔴"))
              .join(" "),
            inline: true,
          },
          {
            name: "💪 Achievement Level",
            value: this.getAchievementLevel(userStats),
            inline: true,
          },
        ],
        footer: {
          text: "Aphrodite Gaming Platform • Keep grinding, champion!",
        },
        timestamp: new Date().toISOString(),
      }

      const validatedEmbed = this.validateEmbed(embed)

      await this.sendWebhook({
        username: "Aphrodite Assistant",
        embeds: [validatedEmbed],
      })

      console.log(`✅ Discord: User-specific challenge completion sent for ${username}`)
    } catch (error) {
      console.error("❌ Discord: Failed to send user challenge completion:", error)
      throw error
    }
  }

  // Send user-specific leaderboard update
  static async sendUserLeaderboardUpdate(
    username: string,
    oldPosition: number,
    newPosition: number,
    points: number,
    userStats: UserStats,
    userAvatar?: string,
  ): Promise<void> {
    try {
      const positionChange = oldPosition - newPosition
      const isClimbing = positionChange > 0

      if (!isClimbing || positionChange < 3) return

      const performanceEmoji = this.getUserPerformanceEmoji(userStats)
      const rankEmoji = this.getRankEmoji(userStats.currentRank)

      const embed: DiscordEmbed = {
        title: `${performanceEmoji} Leaderboard Domination!`,
        description: `**${username}** is absolutely crushing the competition and climbing the ranks!`,
        color: this.COLORS.leaderboard,
        author: {
          name: `${username} • Rising Star`,
          icon_url: userAvatar,
        },
        fields: [
          {
            name: "🏆 New Position",
            value: `**#${newPosition}**\n*Global Ranking*`,
            inline: true,
          },
          {
            name: "📈 Positions Gained",
            value: `**+${positionChange}**\n*Rank Improvement*`,
            inline: true,
          },
          {
            name: "💎 Total Points",
            value: `**${points.toLocaleString()} AP**\n*Aphrodite Points*`,
            inline: true,
          },
          {
            name: `${rankEmoji} Player Stats`,
            value: `**Rank:** ${userStats.currentRank}\n**Win Rate:** ${userStats.winRate}%\n**K/D/A:** ${userStats.kda}`,
            inline: true,
          },
          {
            name: "🔥 Current Form",
            value: `**Weekly LP:** +${userStats.weeklyLP}\n**Games:** ${userStats.gamesPlayed}\n**Hours:** ${userStats.hoursPlayed}h`,
            inline: true,
          },
          {
            name: "🎯 Performance Trend",
            value: this.getPerformanceTrend(userStats),
            inline: true,
          },
        ],
        footer: {
          text: "Aphrodite Gaming Platform • The grind never stops!",
        },
        timestamp: new Date().toISOString(),
      }

      const validatedEmbed = this.validateEmbed(embed)

      await this.sendWebhook({
        username: "Aphrodite Assistant",
        embeds: [validatedEmbed],
      })

      console.log(`✅ Discord: User-specific leaderboard update sent for ${username}`)
    } catch (error) {
      console.error("❌ Discord: Failed to send user leaderboard update:", error)
      throw error
    }
  }

  // Send user-specific rank up notification
  static async sendUserRankUp(
    username: string,
    gameType: string,
    oldRank: string,
    newRank: string,
    userStats: UserStats,
    userAvatar?: string,
  ): Promise<void> {
    try {
      const performanceEmoji = this.getUserPerformanceEmoji(userStats)
      const rankEmoji = this.getRankEmoji(newRank)

      const embed: DiscordEmbed = {
        title: `${rankEmoji} RANK UP ACHIEVED! ${performanceEmoji}`,
        description: `**${username}** has ascended to new heights in ${gameType.toUpperCase()}! The dedication pays off!`,
        color: this.COLORS.rankup,
        author: {
          name: `${username} • Rank Progression`,
          icon_url: userAvatar,
        },
        fields: [
          {
            name: "🎮 Game",
            value: `**${gameType.toUpperCase()}**\n*Competitive Mode*`,
            inline: true,
          },
          {
            name: "📉 Previous Rank",
            value: `**${oldRank}**\n*Former Achievement*`,
            inline: true,
          },
          {
            name: "📈 NEW RANK",
            value: `**${newRank}** ${rankEmoji}\n*Current Achievement*`,
            inline: true,
          },
          {
            name: "💪 Player Performance",
            value: `**Win Rate:** ${userStats.winRate}%\n**K/D/A:** ${userStats.kda}\n**Games:** ${userStats.gamesPlayed}`,
            inline: true,
          },
          {
            name: "🔥 Recent Progress",
            value: `**Weekly LP:** +${userStats.weeklyLP}\n**Hours Played:** ${userStats.hoursPlayed}h\n**Dedication Level:** ${this.getDedicationLevel(userStats)}`,
            inline: true,
          },
          {
            name: "🎯 Next Goal",
            value: this.getNextRankGoal(newRank),
            inline: true,
          },
        ],
        footer: {
          text: "Aphrodite Gaming Platform • Excellence recognized!",
        },
        timestamp: new Date().toISOString(),
      }

      const validatedEmbed = this.validateEmbed(embed)

      await this.sendWebhook({
        username: "Aphrodite Assistant",
        embeds: [validatedEmbed],
      })

      console.log(`✅ Discord: User-specific rank up sent for ${username}`)
    } catch (error) {
      console.error("❌ Discord: Failed to send user rank up:", error)
      throw error
    }
  }

  // Send teammate request with @everyone mention
  static async sendTeammateRequest(request: TeammateRequest): Promise<void> {
    try {
      const performanceEmoji = this.getUserPerformanceEmoji(request.userStats)
      const rankEmoji = this.getRankEmoji(request.currentRank)

      // Create the @everyone mention content
      const mentionContent = `@everyone 🎮 **TEAMMATE REQUEST** 🎮\n\n**${request.username}** is looking for skilled teammates to dominate ${request.gameType.toUpperCase()}!`

      const embed: DiscordEmbed = {
        title: `${performanceEmoji} Looking for Teammates!`,
        description: `**${request.username}** wants to team up and climb the ranks together in **${request.gameType.toUpperCase()}**!`,
        color: this.COLORS.teammate,
        author: {
          name: `${request.username} • ${request.currentRank}`,
        },
        fields: [
          {
            name: `${rankEmoji} Player Info`,
            value: `**Rank:** ${request.currentRank}\n**Game:** ${request.gameType.toUpperCase()}\n**Preferred Role:** ${request.preferredRole || "Flexible"}`,
            inline: true,
          },
          {
            name: "📊 Performance Stats",
            value: `**Win Rate:** ${request.userStats.winRate}%\n**K/D/A:** ${request.userStats.kda}\n**Games Played:** ${request.userStats.gamesPlayed}`,
            inline: true,
          },
          {
            name: "🔥 Recent Activity",
            value: `**Weekly LP:** +${request.userStats.weeklyLP}\n**Hours Played:** ${request.userStats.hoursPlayed}h\n**Skill Level:** ${this.getSkillLevel(request.userStats)}`,
            inline: true,
          },
          {
            name: "🎯 Recent Form",
            value: request.userStats.recentMatches
              .slice(0, 10)
              .map((match) => (match.result === "win" ? "🟢" : "🔴"))
              .join(" "),
            inline: false,
          },
          {
            name: "💬 Message",
            value: request.message || "Ready to grind and climb together! Let's dominate the competition! 🚀",
            inline: false,
          },
          {
            name: "📞 How to Connect",
            value:
              "React with 🎮 to show interest or DM for party invite!\n\n**Looking for:**\n• Skilled players\n• Good communication\n• Positive attitude\n• Ready to win!",
            inline: false,
          },
        ],
        footer: {
          text: "Aphrodite Gaming Platform • Building winning teams!",
        },
        timestamp: new Date().toISOString(),
      }

      const validatedEmbed = this.validateEmbed(embed)

      await this.sendWebhook({
        content: mentionContent,
        username: "Aphrodite Matchmaker",
        embeds: [validatedEmbed],
      })

      console.log(`✅ Discord: Teammate request sent for ${request.username}`)
    } catch (error) {
      console.error("❌ Discord: Failed to send teammate request:", error)
      throw error
    }
  }

  // Helper methods for dynamic content
  private static getAchievementLevel(userStats: UserStats): string {
    if (userStats.winRate >= 80 && userStats.gamesPlayed >= 50) return "🏆 Elite Performer"
    if (userStats.winRate >= 70 && userStats.gamesPlayed >= 30) return "⭐ High Achiever"
    if (userStats.winRate >= 60 && userStats.gamesPlayed >= 20) return "💪 Solid Player"
    if (userStats.winRate >= 50) return "👍 Consistent"
    return "📈 Improving"
  }

  private static getPerformanceTrend(userStats: UserStats): string {
    const recentWins = userStats.recentMatches.slice(0, 5).filter((m) => m.result === "win").length
    if (recentWins >= 4) return "🔥 On Fire!"
    if (recentWins >= 3) return "📈 Trending Up"
    if (recentWins >= 2) return "⚖️ Balanced"
    return "💪 Building Momentum"
  }

  private static getDedicationLevel(userStats: UserStats): string {
    if (userStats.hoursPlayed >= 100) return "🔥 Hardcore"
    if (userStats.hoursPlayed >= 50) return "💪 Dedicated"
    if (userStats.hoursPlayed >= 25) return "👍 Committed"
    return "📈 Growing"
  }

  private static getSkillLevel(userStats: UserStats): string {
    if (userStats.winRate >= 75) return "🏆 Expert"
    if (userStats.winRate >= 65) return "⭐ Advanced"
    if (userStats.winRate >= 55) return "💪 Skilled"
    return "📈 Developing"
  }

  private static getNextRankGoal(currentRank: string): string {
    const rankLower = currentRank.toLowerCase()
    if (rankLower.includes("iron")) return "🎯 Bronze Rank"
    if (rankLower.includes("bronze")) return "🎯 Silver Rank"
    if (rankLower.includes("silver")) return "🎯 Gold Rank"
    if (rankLower.includes("gold")) return "🎯 Platinum Rank"
    if (rankLower.includes("platinum")) return "🎯 Diamond Rank"
    if (rankLower.includes("diamond")) return "🎯 Immortal Rank"
    if (rankLower.includes("immortal")) return "🎯 Radiant Rank"
    return "🎯 Next Tier"
  }

  // Enhanced webhook sender with better error handling and status detection
  private static async sendWebhook(message: DiscordMessage): Promise<void> {
    try {
      const cleanMessage: DiscordMessage = {}

      if (message.content && message.content.trim()) {
        cleanMessage.content = message.content.slice(0, 2000)
      }

      if (message.username && message.username.trim()) {
        cleanMessage.username = message.username.slice(0, 80)
      }

      if (message.avatar_url && message.avatar_url.startsWith("http")) {
        cleanMessage.avatar_url = message.avatar_url
      }

      if (message.embeds && Array.isArray(message.embeds) && message.embeds.length > 0) {
        cleanMessage.embeds = message.embeds
          .map((embed) => this.validateEmbed(embed))
          .filter((embed) => embed.title || embed.description || (embed.fields && embed.fields.length > 0))
          .slice(0, 10)
      }

      if (!cleanMessage.content && (!cleanMessage.embeds || cleanMessage.embeds.length === 0)) {
        throw new Error("Message must have either content or valid embeds")
      }

      console.log("🚀 Discord: Sending webhook message...")

      const response = await fetch(this.WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Aphrodite-Gaming-Bot/1.0",
        },
        body: JSON.stringify(cleanMessage),
      })

      // Log response details for debugging
      console.log(`📡 Discord: Response status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Discord API Error Response:", errorText)

        // Handle specific Discord errors
        if (response.status === 404) {
          throw new Error("Webhook not found - check webhook URL")
        } else if (response.status === 401) {
          throw new Error("Unauthorized - webhook token may be invalid")
        } else if (response.status === 429) {
          const retryAfter = response.headers.get("retry-after")
          throw new Error(`Rate limited - retry after ${retryAfter}ms`)
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
        }
      }

      // Check for rate limiting headers
      const remaining = response.headers.get("x-ratelimit-remaining")
      const resetAfter = response.headers.get("x-ratelimit-reset-after")

      if (remaining && Number.parseInt(remaining) < 5) {
        console.warn(`⚠️ Discord: Rate limit warning - ${remaining} requests remaining, resets in ${resetAfter}s`)
      }

      console.log("✅ Discord: Message sent successfully!")
    } catch (error) {
      console.error(`❌ Discord: Webhook failed:`, error)
      throw error
    }
  }

  // Enhanced connection test with better status detection
  static async testConnection(): Promise<boolean> {
    try {
      console.log("🔍 Discord: Testing webhook connection...")

      const testMessage = {
        content:
          "🤖 **Aphrodite Bot Status Check**\n\n✅ Webhook is **ONLINE** and ready!\n🎮 All systems operational!",
        username: "Aphrodite Status",
      }

      // Test the webhook with a simple message
      const response = await fetch(this.WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Aphrodite-Gaming-Bot/1.0",
        },
        body: JSON.stringify(testMessage),
      })

      console.log(`📡 Discord: Test response: ${response.status} ${response.statusText}`)

      if (response.ok) {
        console.log("✅ Discord: Connection test successful!")
        return true
      } else {
        const errorText = await response.text()
        console.error("❌ Discord: Connection test failed:", response.status, errorText)
        return false
      }
    } catch (error) {
      console.error("❌ Discord: Connection test error:", error)
      return false
    }
  }

  // Get webhook info (for debugging)
  static async getWebhookInfo(): Promise<any> {
    try {
      const response = await fetch(this.WEBHOOK_URL, {
        method: "GET",
        headers: {
          "User-Agent": "Aphrodite-Gaming-Bot/1.0",
        },
      })

      if (response.ok) {
        const info = await response.json()
        console.log("📋 Discord: Webhook info:", info)
        return info
      } else {
        console.error("❌ Discord: Failed to get webhook info:", response.status)
        return null
      }
    } catch (error) {
      console.error("❌ Discord: Error getting webhook info:", error)
      return null
    }
  }
}
