export interface DemoUser {
  uid: string
  email: string
  displayName: string
  photoURL: string
  emailVerified: boolean
  isAnonymous: boolean
  metadata: {
    creationTime: string
    lastSignInTime: string
  }
  providerData: Array<{
    providerId: string
    uid: string
    displayName: string
    email: string
    phoneNumber: string | null
    photoURL: string
  }>
  gameStats: {
    valorant: {
      rank: string
      winRate: number
      kda: string
      gamesPlayed: number
      hoursPlayed: number
      recentMatches: Array<{
        result: "win" | "loss"
        score: string
        map: string
        date: Date
        kills: number
        deaths: number
        assists: number
      }>
    }
    cs2: {
      rank: string
      winRate: number
      kda: string
      gamesPlayed: number
      hoursPlayed: number
      recentMatches: Array<{
        result: "win" | "loss"
        score: string
        map: string
        date: Date
        kills: number
        deaths: number
        assists: number
      }>
    }
  }
  preferences: {
    theme: string
    favoriteGame: string
  }
  friends: Array<{
    uid: string
    displayName: string
    photoURL: string
    status: "online" | "offline" | "in-game"
  }>
  teams: Array<{
    id: string
    name: string
    role: "leader" | "member"
    game: string
  }>
}

export class DemoUserGenerator {
  private static valorantRanks = [
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

  private static cs2Ranks = [
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

  private static valorantMaps = ["Bind", "Haven", "Split", "Ascent", "Icebox", "Breeze", "Fracture", "Pearl", "Lotus"]
  private static cs2Maps = ["Dust2", "Mirage", "Inferno", "Cache", "Overpass", "Vertigo", "Ancient", "Anubis"]

  private static themes = ["dark", "light", "neon", "cyberpunk", "forest", "ocean"]

  private static generateUID(): string {
    return `demo-${Math.random().toString(36).substr(2, 9)}`
  }

  private static generatePhotoURL(name: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
  }

  private static generateKDA(rank: string, game: "valorant" | "cs2"): string {
    const rankIndex = game === "valorant" ? this.valorantRanks.indexOf(rank) : this.cs2Ranks.indexOf(rank)

    const maxRank = game === "valorant" ? this.valorantRanks.length : this.cs2Ranks.length
    const skillLevel = rankIndex / maxRank

    const baseKD = 0.8 + skillLevel * 1.4 // 0.8 to 2.2
    const assists = game === "valorant" ? 3 + skillLevel * 5 : 2 + skillLevel * 3

    return `${baseKD.toFixed(1)}/${assists.toFixed(1)}`
  }

  private static generateWinRate(rank: string, game: "valorant" | "cs2"): number {
    const rankIndex = game === "valorant" ? this.valorantRanks.indexOf(rank) : this.cs2Ranks.indexOf(rank)

    const maxRank = game === "valorant" ? this.valorantRanks.length : this.cs2Ranks.length
    const skillLevel = rankIndex / maxRank

    return Math.round(45 + skillLevel * 35) // 45% to 80%
  }

  private static generateRecentMatches(game: "valorant" | "cs2", winRate: number): Array<any> {
    const maps = game === "valorant" ? this.valorantMaps : this.cs2Maps
    const matches = []

    for (let i = 0; i < 10; i++) {
      const isWin = Math.random() < winRate / 100
      const map = maps[Math.floor(Math.random() * maps.length)]
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)

      let score: string
      if (game === "valorant") {
        score = isWin ? `13-${Math.floor(Math.random() * 12)}` : `${Math.floor(Math.random() * 12)}-13`
      } else {
        score = isWin ? `16-${Math.floor(Math.random() * 15)}` : `${Math.floor(Math.random() * 15)}-16`
      }

      matches.push({
        result: isWin ? "win" : "loss",
        score,
        map,
        date,
        kills: Math.floor(Math.random() * 25) + 5,
        deaths: Math.floor(Math.random() * 20) + 5,
        assists: Math.floor(Math.random() * 15) + 2,
      })
    }

    return matches
  }

  private static generateFriends(): Array<any> {
    const friendNames = ["ProGamer123", "SkillShot", "HeadshotKing", "TacticalMind", "ClutchMaster"]
    return friendNames.map((name) => ({
      uid: this.generateUID(),
      displayName: name,
      photoURL: this.generatePhotoURL(name),
      status: Math.random() > 0.5 ? "online" : Math.random() > 0.5 ? "offline" : "in-game",
    }))
  }

  private static generateTeams(): Array<any> {
    const teamNames = ["Alpha Squad", "Elite Gaming", "Pro Esports", "Victory Team"]
    return teamNames.slice(0, Math.floor(Math.random() * 3) + 1).map((name) => ({
      id: this.generateUID(),
      name,
      role: Math.random() > 0.7 ? "leader" : "member",
      game: Math.random() > 0.5 ? "valorant" : "cs2",
    }))
  }

  public static generateRandomUser(): DemoUser {
    const displayName = `Player${Math.floor(Math.random() * 9999)}`
    const email = `${displayName.toLowerCase()}@demo.com`
    const uid = this.generateUID()

    const valorantRank = this.valorantRanks[Math.floor(Math.random() * this.valorantRanks.length)]
    const cs2Rank = this.cs2Ranks[Math.floor(Math.random() * this.cs2Ranks.length)]

    const valorantWinRate = this.generateWinRate(valorantRank, "valorant")
    const cs2WinRate = this.generateWinRate(cs2Rank, "cs2")

    return {
      uid,
      email,
      displayName,
      photoURL: this.generatePhotoURL(displayName),
      emailVerified: true,
      isAnonymous: false,
      metadata: {
        creationTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastSignInTime: new Date().toISOString(),
      },
      providerData: [
        {
          providerId: "google.com",
          uid: email,
          displayName,
          email,
          phoneNumber: null,
          photoURL: this.generatePhotoURL(displayName),
        },
      ],
      gameStats: {
        valorant: {
          rank: valorantRank,
          winRate: valorantWinRate,
          kda: this.generateKDA(valorantRank, "valorant"),
          gamesPlayed: Math.floor(Math.random() * 500) + 50,
          hoursPlayed: Math.floor(Math.random() * 1000) + 100,
          recentMatches: this.generateRecentMatches("valorant", valorantWinRate),
        },
        cs2: {
          rank: cs2Rank,
          winRate: cs2WinRate,
          kda: this.generateKDA(cs2Rank, "cs2"),
          gamesPlayed: Math.floor(Math.random() * 400) + 30,
          hoursPlayed: Math.floor(Math.random() * 800) + 80,
          recentMatches: this.generateRecentMatches("cs2", cs2WinRate),
        },
      },
      preferences: {
        theme: this.themes[Math.floor(Math.random() * this.themes.length)],
        favoriteGame: Math.random() > 0.5 ? "valorant" : "cs2",
      },
      friends: this.generateFriends(),
      teams: this.generateTeams(),
    }
  }

  public static generateProPlayer(): DemoUser {
    const user = this.generateRandomUser()
    user.displayName = `Pro${Math.floor(Math.random() * 999)}`
    user.email = `${user.displayName.toLowerCase()}@proplayer.com`
    user.gameStats.valorant.rank = "Radiant"
    user.gameStats.cs2.rank = "The Global Elite"
    user.gameStats.valorant.winRate = Math.floor(Math.random() * 15) + 75 // 75-90%
    user.gameStats.cs2.winRate = Math.floor(Math.random() * 15) + 75
    user.gameStats.valorant.kda = "2.1/4.8"
    user.gameStats.cs2.kda = "1.9/3.2"
    user.gameStats.valorant.gamesPlayed = Math.floor(Math.random() * 1000) + 500
    user.gameStats.cs2.gamesPlayed = Math.floor(Math.random() * 800) + 400
    return user
  }

  public static generateBeginner(): DemoUser {
    const user = this.generateRandomUser()
    user.displayName = `Newbie${Math.floor(Math.random() * 999)}`
    user.email = `${user.displayName.toLowerCase()}@beginner.com`
    user.gameStats.valorant.rank = this.valorantRanks[Math.floor(Math.random() * 6)] // Iron-Bronze
    user.gameStats.cs2.rank = this.cs2Ranks[Math.floor(Math.random() * 4)] // Silver ranks
    user.gameStats.valorant.winRate = Math.floor(Math.random() * 20) + 35 // 35-55%
    user.gameStats.cs2.winRate = Math.floor(Math.random() * 20) + 35
    user.gameStats.valorant.kda = "0.8/2.1"
    user.gameStats.cs2.kda = "0.7/1.8"
    user.gameStats.valorant.gamesPlayed = Math.floor(Math.random() * 50) + 10
    user.gameStats.cs2.gamesPlayed = Math.floor(Math.random() * 40) + 5
    return user
  }

  public static generateCustomUser(options: {
    displayName?: string
    email?: string
    valorantRank?: string
    cs2Rank?: string
    winRate?: number
    theme?: string
  }): DemoUser {
    const user = this.generateRandomUser()

    if (options.displayName) user.displayName = options.displayName
    if (options.email) user.email = options.email
    if (options.valorantRank) user.gameStats.valorant.rank = options.valorantRank
    if (options.cs2Rank) user.gameStats.cs2.rank = options.cs2Rank
    if (options.winRate) {
      user.gameStats.valorant.winRate = options.winRate
      user.gameStats.cs2.winRate = options.winRate
    }
    if (options.theme) user.preferences.theme = options.theme

    return user
  }
}

// Preset generators for quick access
export const DEMO_USER_PRESETS = {
  radiant: () => {
    const user = DemoUserGenerator.generateProPlayer()
    user.gameStats.valorant.rank = "Radiant"
    user.displayName = "RadiantAce"
    return user
  },

  diamond: () => {
    const user = DemoUserGenerator.generateRandomUser()
    user.gameStats.valorant.rank = "Diamond 2"
    user.gameStats.cs2.rank = "Legendary Eagle Master"
    user.displayName = "DiamondPlayer"
    return user
  },

  gold: () => {
    const user = DemoUserGenerator.generateRandomUser()
    user.gameStats.valorant.rank = "Gold 2"
    user.gameStats.cs2.rank = "Gold Nova Master"
    user.displayName = "GoldGamer"
    return user
  },

  iron: () => {
    const user = DemoUserGenerator.generateBeginner()
    user.gameStats.valorant.rank = "Iron 1"
    user.gameStats.cs2.rank = "Silver I"
    user.displayName = "IronWarrior"
    return user
  },
}
