"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import { logout } from "@/lib/firebase"
import GameSelector from "@/components/game-selector"
import {
  GamepadIcon,
  BotIcon,
  UsersIcon,
  TrophyIcon,
  BarChart3,
  MessageCircleIcon,
  ShieldIcon,
  ShoppingCartIcon,
  AwardIcon,
  UserIcon,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Home,
  ZapIcon,
  ChevronDown,
} from "lucide-react"

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  selectedGame: string
  setSelectedGame: (game: string) => void
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, keywords: ["home", "main", "overview"] },
  { id: "coach", label: "AI Coach", icon: BotIcon, keywords: ["ai", "coach", "assistant", "help"] },
  { id: "leaderboard", label: "Leaderboard", icon: TrophyIcon, keywords: ["ranking", "top", "best", "scores"] },
  { id: "tournaments", label: "Tournaments", icon: TrophyIcon, keywords: ["competition", "events", "matches"] },
  { id: "teammates", label: "Team Chat", icon: MessageCircleIcon, keywords: ["chat", "communication", "team"] },
  { id: "team", label: "Team", icon: UsersIcon, keywords: ["squad", "group", "members"] },
  { id: "stats", label: "Analytics", icon: BarChart3, keywords: ["statistics", "data", "performance", "charts"] },
  { id: "challenges", label: "Challenges", icon: AwardIcon, keywords: ["tasks", "goals", "achievements"] },
  { id: "store", label: "Store", icon: ShoppingCartIcon, keywords: ["shop", "buy", "purchase", "items"] },
  { id: "lagshield", label: "Lag Shield", icon: ShieldIcon, keywords: ["network", "ping", "connection"] },
  { id: "profile", label: "Profile", icon: UserIcon, keywords: ["account", "user", "personal"] },
  { id: "settings", label: "Settings", icon: Settings, keywords: ["preferences", "config", "options"] },
  { id: "demo-generator", label: "Demo Generator", icon: ZapIcon, keywords: ["demo", "test", "generate"] },
  { id: "discord-bot", label: "Discord Bot", icon: BotIcon, keywords: ["discord", "bot", "notifications", "webhook"] },
]

export default function EnhancedNavigation({
  activeTab,
  setActiveTab,
  selectedGame,
  setSelectedGame,
}: NavigationProps) {
  const { user } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Functional search implementation
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return navigationItems

    const query = searchQuery.toLowerCase().trim()
    return navigationItems.filter((item) => {
      const labelMatch = item.label.toLowerCase().includes(query)
      const keywordMatch = item.keywords.some((keyword) => keyword.includes(query))
      return labelMatch || keywordMatch
    })
  }, [searchQuery])

  const handleSearchSelect = (itemId: string) => {
    setActiveTab(itemId)
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Primary navigation items (shown in main nav)
  const primaryItems = navigationItems.slice(0, 7)
  const secondaryItems = navigationItems.slice(7)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-background/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <GamepadIcon className="h-7 w-7 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Aphrodite</h1>
                <div className="text-xs text-muted-foreground font-medium">Gaming Assistant</div>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Online
              </Badge>
              <Badge variant="outline" className="text-xs">
                v2.0
              </Badge>
            </div>
          </div>

          {/* Main Navigation - Horizontal Layout */}
          <nav className="hidden lg:flex items-center space-x-1">
            {primaryItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`
                    h-9 px-3 transition-all duration-150
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }
                  `}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              )
            })}

            {/* More Dropdown */}
            {secondaryItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 px-3 text-muted-foreground hover:text-foreground">
                    <span className="mr-1">More</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {secondaryItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <DropdownMenuItem key={item.id} onClick={() => setActiveTab(item.id)} className="cursor-pointer">
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Game Selector */}
            <div className="hidden xl:block">
              <GameSelector selectedGame={selectedGame} onGameChange={setSelectedGame} />
            </div>

            {/* Functional Search */}
            <div className="hidden md:block">
              <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-64 justify-start text-muted-foreground hover:text-foreground"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    <span>Search features...</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Search features..." value={searchQuery} onValueChange={setSearchQuery} />
                    <CommandList>
                      <CommandEmpty>No features found.</CommandEmpty>
                      <CommandGroup>
                        {filteredItems.map((item) => {
                          const Icon = item.icon
                          return (
                            <CommandItem
                              key={item.id}
                              value={item.id}
                              onSelect={() => handleSearchSelect(item.id)}
                              className="cursor-pointer"
                            >
                              <Icon className="h-4 w-4 mr-3" />
                              <span>{item.label}</span>
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                    <img
                      src={user.photoURL || "/placeholder.svg?height=32&width=32"}
                      alt={user.displayName || "User"}
                      className="h-8 w-8 rounded-full"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.displayName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveTab("profile")} className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("settings")} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <GamepadIcon className="h-6 w-6 text-primary" />
                        <div>
                          <span className="text-lg font-bold">Aphrodite</span>
                          <div className="text-xs text-muted-foreground">Gaming Assistant</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search features..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                      {(searchQuery ? filteredItems : navigationItems).map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.id

                        return (
                          <Button
                            key={item.id}
                            variant={isActive ? "default" : "ghost"}
                            className="w-full justify-start h-10"
                            onClick={() => {
                              setActiveTab(item.id)
                              setIsMobileMenuOpen(false)
                            }}
                          >
                            <Icon className="h-4 w-4 mr-3" />
                            {item.label}
                          </Button>
                        )
                      })}
                    </div>

                    {searchQuery && filteredItems.length === 0 && (
                      <div className="text-center text-muted-foreground mt-8">
                        No features found for "{searchQuery}"
                      </div>
                    )}
                  </div>

                  {/* Mobile User Section */}
                  {user && (
                    <div className="p-4 border-t">
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={user.photoURL || "/placeholder.svg?height=32&width=32"}
                          alt={user.displayName || "User"}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.displayName}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
