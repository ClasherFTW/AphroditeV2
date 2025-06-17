"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface GameStats {
  currentRank: string
  winRate: number
  kda: string
  gamesPlayed: number
  weeklyLP: number
  avgPing: number
  squadMembers: number
  onlineMembers: number
  hoursPlayed: number
  recentMatches: Array<{
    result: "win" | "loss"
    score: string
    map: string
    date: Date
  }>
}

interface GameStatsContextType {
  selectedGame: string
  setSelectedGame: (game: string) => void
  gameStats: GameStats
}

const GameStatsContext = createContext<GameStatsContextType | undefined>(undefined)

export const useGameStats = () => {
  const context = useContext(GameStatsContext)
  if (!context) {
    throw new Error("useGameStats must be used within a GameStatsProvider")
  }
  return context
}

// Mock game stats
const mockGameStats: GameStats = {
  currentRank: "Diamond 2",
  winRate: 73,
  kda: "1.42",
  gamesPlayed: 127,
  weeklyLP: 156,
  avgPing: 23,
  squadMembers: 8,
  onlineMembers: 3,
  hoursPlayed: 342,
  recentMatches: [
    { result: "win", score: "13-8", map: "Ascent", date: new Date() },
    { result: "win", score: "13-11", map: "Bind", date: new Date() },
    { result: "loss", score: "11-13", map: "Haven", date: new Date() },
    { result: "win", score: "13-6", map: "Split", date: new Date() },
  ],
}

export function GameStatsProvider({ children }: { children: React.ReactNode }) {
  const [selectedGame, setSelectedGame] = useState("valorant")

  return (
    <GameStatsContext.Provider
      value={{
        selectedGame,
        setSelectedGame,
        gameStats: mockGameStats,
      }}
    >
      {children}
    </GameStatsContext.Provider>
  )
}
