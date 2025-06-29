"use client"

// Advanced tactical shooter statistics
export interface AdvancedPlayerStats {
  // Basic stats
  kills: number
  deaths: number
  assists: number

  // Advanced tactical stats
  adr: number // Average Damage per Round
  kast: number // Kill, Assist, Survive, Trade percentage
  kost: number // Kill, Objective, Survive, Trade percentage

  // Detailed performance metrics
  headshot_percentage: number
  first_kill_percentage: number
  clutch_success_rate: number
  multi_kill_rounds: number

  // Economy and utility stats
  economy_rating: number
  utility_damage: number
  flash_assists: number

  // Positioning and game sense
  trade_kill_percentage: number
  survival_rate: number
  round_impact_rating: number

  // Map-specific stats
  site_success_rate: {
    attack: number
    defense: number
  }

  // Weapon proficiency
  weapon_stats: WeaponStats[]

  // Time-based performance
  performance_by_round: RoundPerformance[]
  performance_by_half: HalfPerformance[]
}

export interface WeaponStats {
  weapon_name: string
  kills: number
  shots_fired: number
  shots_hit: number
  accuracy: number
  headshot_rate: number
  damage_per_shot: number
}

export interface RoundPerformance {
  round_number: number
  kills: number
  deaths: number
  damage_dealt: number
  damage_received: number
  utility_used: string[]
  survived: boolean
  objective_interaction: boolean
}

export interface HalfPerformance {
  half: "first" | "second" | "overtime"
  side: "attack" | "defense" | "ct" | "t"
  rounds_won: number
  rounds_lost: number
  kills: number
  deaths: number
  adr: number
  kast: number
}

export interface TeamStats {
  team_name: string
  rounds_won: number
  rounds_lost: number

  // Team coordination metrics
  trade_success_rate: number
  execute_success_rate: number
  retake_success_rate: number

  // Economic performance
  eco_round_win_rate: number
  force_buy_success_rate: number
  full_buy_win_rate: number

  // Map control
  first_pick_success_rate: number
  site_control_percentage: number

  players: AdvancedPlayerStats[]
}

export interface MatchAnalysis {
  match_id: string
  game_type: "valorant" | "cs2"
  map: string
  date: Date
  duration: number

  // Match outcome
  winner: "team1" | "team2"
  final_score: {
    team1: number
    team2: number
  }

  // Team statistics
  teams: {
    team1: TeamStats
    team2: TeamStats
  }

  // Match insights
  key_moments: KeyMoment[]
  mvp: string
  match_rating: number

  // Performance trends
  momentum_shifts: MomentumShift[]
  round_by_round: RoundSummary[]
}

export interface KeyMoment {
  round: number
  timestamp: number
  type: "clutch" | "ace" | "comeback" | "eco_win" | "force_win"
  player: string
  description: string
  impact_score: number
}

export interface MomentumShift {
  round: number
  previous_momentum: number
  new_momentum: number
  trigger_event: string
}

export interface RoundSummary {
  round_number: number
  winner: "team1" | "team2"
  round_type: "pistol" | "eco" | "force" | "full_buy"
  duration: number
  kills: { player: string; victim: string; weapon: string; headshot: boolean }[]
  damage_summary: { player: string; damage: number }[]
  utility_usage: { player: string; utility: string; effectiveness: number }[]
}

class AdvancedStatisticsService {
  // Calculate KAST (Kill, Assist, Survive, Trade) percentage
  calculateKAST(rounds: RoundPerformance[]): number {
    if (rounds.length === 0) return 0

    const kastRounds = rounds.filter(
      (round) =>
        round.kills > 0 || // Kill
        // Assist would be tracked separately
        round.survived || // Survive
        this.hadTrade(round), // Trade
    )

    return (kastRounds.length / rounds.length) * 100
  }

  // Calculate KOST (Kill, Objective, Survive, Trade) percentage
  calculateKOST(rounds: RoundPerformance[]): number {
    if (rounds.length === 0) return 0

    const kostRounds = rounds.filter(
      (round) =>
        round.kills > 0 || // Kill
        round.objective_interaction || // Objective (plant/defuse/spike)
        round.survived || // Survive
        this.hadTrade(round), // Trade
    )

    return (kostRounds.length / rounds.length) * 100
  }

  // Calculate Average Damage per Round
  calculateADR(rounds: RoundPerformance[]): number {
    if (rounds.length === 0) return 0

    const totalDamage = rounds.reduce((sum, round) => sum + round.damage_dealt, 0)
    return totalDamage / rounds.length
  }

  // Calculate Round Impact Rating
  calculateRoundImpactRating(rounds: RoundPerformance[]): number {
    if (rounds.length === 0) return 0

    let totalImpact = 0

    rounds.forEach((round) => {
      let roundImpact = 0

      // Kill impact
      roundImpact += round.kills * 0.3

      // Damage impact
      roundImpact += (round.damage_dealt / 100) * 0.2

      // Survival impact
      if (round.survived) roundImpact += 0.2

      // Objective impact
      if (round.objective_interaction) roundImpact += 0.3

      totalImpact += Math.min(roundImpact, 1.0) // Cap at 1.0 per round
    })

    return (totalImpact / rounds.length) * 100
  }

  // Generate comprehensive match analysis
  generateMatchAnalysis(matchData: any): MatchAnalysis {
    // This would process raw match data and generate comprehensive analysis
    const analysis: MatchAnalysis = {
      match_id: matchData.id || `match_${Date.now()}`,
      game_type: matchData.game_type || "valorant",
      map: matchData.map || "Ascent",
      date: new Date(),
      duration: matchData.duration || 2400, // 40 minutes

      winner: "team1",
      final_score: {
        team1: 13,
        team2: 11,
      },

      teams: {
        team1: this.generateTeamStats("Team Liquid"),
        team2: this.generateTeamStats("FaZe Clan"),
      },

      key_moments: this.generateKeyMoments(),
      mvp: "TenZ",
      match_rating: 8.7,

      momentum_shifts: this.generateMomentumShifts(),
      round_by_round: this.generateRoundSummaries(),
    }

    return analysis
  }

  // Generate detailed player statistics
  generatePlayerStats(playerData: any): AdvancedPlayerStats {
    const rounds = this.generateMockRounds(24) // 24 rounds

    return {
      kills: 22,
      deaths: 14,
      assists: 6,

      adr: this.calculateADR(rounds),
      kast: this.calculateKAST(rounds),
      kost: this.calculateKOST(rounds),

      headshot_percentage: 67.3,
      first_kill_percentage: 23.5,
      clutch_success_rate: 75.0,
      multi_kill_rounds: 8,

      economy_rating: 82.4,
      utility_damage: 245,
      flash_assists: 12,

      trade_kill_percentage: 34.2,
      survival_rate: 58.3,
      round_impact_rating: this.calculateRoundImpactRating(rounds),

      site_success_rate: {
        attack: 68.5,
        defense: 72.1,
      },

      weapon_stats: this.generateWeaponStats(),
      performance_by_round: rounds,
      performance_by_half: this.generateHalfPerformance(),
    }
  }

  // Helper methods
  private hadTrade(round: RoundPerformance): boolean {
    // Simplified trade detection logic
    return round.kills > 0 && round.deaths > 0
  }

  private generateMockRounds(count: number): RoundPerformance[] {
    return Array.from({ length: count }, (_, i) => ({
      round_number: i + 1,
      kills: Math.floor(Math.random() * 3),
      deaths: Math.random() > 0.7 ? 1 : 0,
      damage_dealt: Math.floor(Math.random() * 200) + 50,
      damage_received: Math.floor(Math.random() * 150),
      utility_used: ["smoke", "flash"].slice(0, Math.floor(Math.random() * 2) + 1),
      survived: Math.random() > 0.4,
      objective_interaction: Math.random() > 0.8,
    }))
  }

  private generateTeamStats(teamName: string): TeamStats {
    return {
      team_name: teamName,
      rounds_won: 13,
      rounds_lost: 11,

      trade_success_rate: 78.5,
      execute_success_rate: 65.2,
      retake_success_rate: 42.8,

      eco_round_win_rate: 23.1,
      force_buy_success_rate: 35.7,
      full_buy_win_rate: 68.9,

      first_pick_success_rate: 58.3,
      site_control_percentage: 72.4,

      players: [
        this.generatePlayerStats({}),
        this.generatePlayerStats({}),
        this.generatePlayerStats({}),
        this.generatePlayerStats({}),
        this.generatePlayerStats({}),
      ],
    }
  }

  private generateKeyMoments(): KeyMoment[] {
    return [
      {
        round: 12,
        timestamp: 1450,
        type: "clutch",
        player: "TenZ",
        description: "1v3 clutch to secure the half",
        impact_score: 9.2,
      },
      {
        round: 18,
        timestamp: 2180,
        type: "ace",
        player: "ScreaM",
        description: "Incredible ace with headshots only",
        impact_score: 9.8,
      },
    ]
  }

  private generateMomentumShifts(): MomentumShift[] {
    return [
      {
        round: 12,
        previous_momentum: -2.1,
        new_momentum: 3.4,
        trigger_event: "TenZ clutch win",
      },
      {
        round: 18,
        previous_momentum: 1.2,
        new_momentum: 4.8,
        trigger_event: "ScreaM ace",
      },
    ]
  }

  private generateRoundSummaries(): RoundSummary[] {
    return Array.from({ length: 24 }, (_, i) => ({
      round_number: i + 1,
      winner: Math.random() > 0.5 ? "team1" : "team2",
      round_type: ["pistol", "eco", "force", "full_buy"][Math.floor(Math.random() * 4)] as any,
      duration: Math.floor(Math.random() * 60) + 30,
      kills: [],
      damage_summary: [],
      utility_usage: [],
    }))
  }

  private generateWeaponStats(): WeaponStats[] {
    return [
      {
        weapon_name: "Vandal",
        kills: 15,
        shots_fired: 89,
        shots_hit: 67,
        accuracy: 75.3,
        headshot_rate: 68.2,
        damage_per_shot: 142.5,
      },
      {
        weapon_name: "Phantom",
        kills: 7,
        shots_fired: 45,
        shots_hit: 32,
        accuracy: 71.1,
        headshot_rate: 62.5,
        damage_per_shot: 138.9,
      },
    ]
  }

  private generateHalfPerformance(): HalfPerformance[] {
    return [
      {
        half: "first",
        side: "attack",
        rounds_won: 7,
        rounds_lost: 5,
        kills: 12,
        deaths: 8,
        adr: 156.8,
        kast: 83.3,
      },
      {
        half: "second",
        side: "defense",
        rounds_won: 6,
        rounds_lost: 6,
        kills: 10,
        deaths: 6,
        adr: 142.1,
        kast: 75.0,
      },
    ]
  }
}

export const advancedStatisticsService = new AdvancedStatisticsService()
