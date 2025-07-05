"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon, GamepadIcon, StarIcon, ClockIcon } from "lucide-react"

interface Game {
  id: string
  name: string
  icon: string
  rank: string
  winRate: number
  playtime: number
  isInstalled: boolean
  color: string
}

interface GameSelectorProps {
  selectedGame: string
  onGameChange: (gameId: string) => void
}

export default function GameSelector({ selectedGame, onGameChange }: GameSelectorProps) {
  const games: Game[] = [
    {
      id: "valorant",
      name: "Valorant",
      icon: "🎯",
      rank: "Diamond III",
      winRate: 73,
      playtime: 247,
      isInstalled: true,
      color: "from-red-500 to-pink-500",
    },
    {
      id: "cs2",
      name: "Counter-Strike 2",
      icon: "🔫",
      rank: "Global Elite",
      winRate: 68,
      playtime: 189,
      isInstalled: true,
      color: "from-orange-500 to-yellow-500",
    },
    {
      id: "overwatch",
      name: "Overwatch 2",
      icon: "🛡️",
      rank: "Master",
      winRate: 71,
      playtime: 156,
      isInstalled: true,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "apex",
      name: "Apex Legends",
      icon: "⚡",
      rank: "Platinum II",
      winRate: 65,
      playtime: 98,
      isInstalled: true,
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: "lol",
      name: "League of Legends",
      icon: "⚔️",
      rank: "Gold I",
      winRate: 58,
      playtime: 312,
      isInstalled: true,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "rocket",
      name: "Rocket League",
      icon: "🚗",
      rank: "Champion I",
      winRate: 62,
      playtime: 78,
      isInstalled: true,
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "fortnite",
      name: "Fortnite",
      icon: "🏗️",
      rank: "Champion",
      winRate: 45,
      playtime: 134,
      isInstalled: false,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "dota2",
      name: "Dota 2",
      icon: "🗡️",
      rank: "Ancient III",
      winRate: 55,
      playtime: 267,
      isInstalled: false,
      color: "from-red-500 to-orange-500",
    },
  ]

  const currentGame = games.find((game) => game.id === selectedGame) || games[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-3 h-12 px-4 bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-200 hover:scale-105"
        >
          <div className="flex items-center space-x-2">
            <div className="text-xl">{currentGame.icon}</div>
            <div className="text-left">
              <div className="font-medium text-sm">{currentGame.name}</div>
              <div className="text-xs text-muted-foreground">{currentGame.rank}</div>
            </div>
          </div>
          <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-card/95 backdrop-blur-sm border-border">
        <DropdownMenuLabel className="flex items-center">
          <GamepadIcon className="h-4 w-4 mr-2 text-primary" />
          Select Game
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {games.map((game) => (
          <DropdownMenuItem
            key={game.id}
            onClick={() => onGameChange(game.id)}
            className={`p-3 cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedGame === game.id ? "bg-primary/10 border-l-2 border-primary" : ""
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <div className="text-lg">{game.icon}</div>
                <div>
                  <div className="font-medium flex items-center space-x-2">
                    <span>{game.name}</span>
                    {!game.isInstalled && (
                      <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400">
                        Not Installed
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{game.rank}</div>
                </div>
              </div>
              <div className="text-right text-xs space-y-1">
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">{game.winRate}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-3 w-3 text-blue-500" />
                  <span className="text-blue-500">{game.playtime}h</span>
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-3 cursor-pointer">
          <div className="flex items-center space-x-2 text-primary">
            <GamepadIcon className="h-4 w-4" />
            <span>Add New Game</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
