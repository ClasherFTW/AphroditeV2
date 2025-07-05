"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ShoppingCartIcon,
  CoinsIcon,
  StarIcon,
  GiftIcon,
  ZapIcon,
  CrownIcon,
  SwordIcon,
  ShieldIcon,
  SparklesIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
} from "lucide-react"

interface StoreItem {
  id: string
  name: string
  description: string
  price: number
  category: "skins" | "currency" | "boosters" | "cosmetics"
  rarity: "common" | "rare" | "epic" | "legendary"
  image: string
  game: string
  inStock: boolean
  discount?: number
  featured?: boolean
}

interface UserInventory {
  points: number
  items: string[]
}

export default function AphroditeStore() {
  const [userInventory, setUserInventory] = useState<UserInventory>({
    points: 1850,
    items: [],
  })

  const [purchaseHistory, setPurchaseHistory] = useState<string[]>([])
  const [showPurchaseAlert, setShowPurchaseAlert] = useState(false)
  const [lastPurchase, setLastPurchase] = useState<string>("")

  const storeItems: StoreItem[] = [
    {
      id: "valorant-phantom-skin",
      name: "Phantom Elderflame",
      description: "Legendary dragon-themed weapon skin with unique animations",
      price: 1200,
      category: "skins",
      rarity: "legendary",
      image: "/placeholder.svg?height=200&width=300",
      game: "Valorant",
      inStock: true,
      featured: true,
    },
    {
      id: "cs2-ak47-skin",
      name: "AK-47 Redline",
      description: "Classic red and black design for the iconic rifle",
      price: 800,
      category: "skins",
      rarity: "epic",
      image: "/placeholder.svg?height=200&width=300",
      game: "CS2",
      inStock: true,
      discount: 20,
    },
    {
      id: "valorant-points",
      name: "1000 Valorant Points",
      description: "Premium currency for Valorant purchases",
      price: 600,
      category: "currency",
      rarity: "common",
      image: "/placeholder.svg?height=200&width=300",
      game: "Valorant",
      inStock: true,
    },
    {
      id: "apex-octane-skin",
      name: "Octane Speed Demon",
      description: "Rare character skin with unique finisher animation",
      price: 950,
      category: "skins",
      rarity: "rare",
      image: "/placeholder.svg?height=200&width=300",
      game: "Apex Legends",
      inStock: true,
    },
    {
      id: "xp-booster",
      name: "XP Booster (24h)",
      description: "Double XP gain for 24 hours across all games",
      price: 200,
      category: "boosters",
      rarity: "common",
      image: "/placeholder.svg?height=200&width=300",
      game: "Universal",
      inStock: true,
    },
    {
      id: "lol-rp",
      name: "1350 Riot Points",
      description: "Premium currency for League of Legends",
      price: 750,
      category: "currency",
      rarity: "common",
      image: "/placeholder.svg?height=200&width=300",
      game: "League of Legends",
      inStock: true,
    },
    {
      id: "profile-banner",
      name: "Diamond Elite Banner",
      description: "Exclusive profile banner showing your elite status",
      price: 300,
      category: "cosmetics",
      rarity: "rare",
      image: "/placeholder.svg?height=200&width=300",
      game: "Universal",
      inStock: true,
      featured: true,
    },
    {
      id: "overwatch-tracer-skin",
      name: "Tracer Graffiti",
      description: "Street art inspired legendary skin",
      price: 1100,
      category: "skins",
      rarity: "legendary",
      image: "/placeholder.svg?height=200&width=300",
      game: "Overwatch 2",
      inStock: false,
    },
  ]

  const handlePurchase = (item: StoreItem) => {
    const finalPrice = item.discount ? Math.floor(item.price * (1 - item.discount / 100)) : item.price

    if (userInventory.points >= finalPrice && item.inStock) {
      setUserInventory((prev) => ({
        points: prev.points - finalPrice,
        items: [...prev.items, item.id],
      }))
      setPurchaseHistory((prev) => [...prev, item.id])
      setLastPurchase(item.name)
      setShowPurchaseAlert(true)
      setTimeout(() => setShowPurchaseAlert(false), 3000)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-500/30 text-gray-400"
      case "rare":
        return "border-blue-500/30 text-blue-400"
      case "epic":
        return "border-purple-500/30 text-purple-400"
      case "legendary":
        return "border-orange-500/30 text-orange-400"
      default:
        return "border-gray-500/30 text-gray-400"
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common":
        return StarIcon
      case "rare":
        return ShieldIcon
      case "epic":
        return SwordIcon
      case "legendary":
        return CrownIcon
      default:
        return StarIcon
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "skins":
        return SparklesIcon
      case "currency":
        return CoinsIcon
      case "boosters":
        return ZapIcon
      case "cosmetics":
        return GiftIcon
      default:
        return StarIcon
    }
  }

  const featuredItems = storeItems.filter((item) => item.featured)
  const skinItems = storeItems.filter((item) => item.category === "skins")
  const currencyItems = storeItems.filter((item) => item.category === "currency")
  const boosterItems = storeItems.filter((item) => item.category === "boosters")
  const cosmeticItems = storeItems.filter((item) => item.category === "cosmetics")

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
        <div className="flex items-center space-x-3">
          <ShoppingCartIcon className="h-8 w-8 text-primary animate-bounce" />
          <div>
            <h2 className="text-2xl font-semibold">Aphrodite Store</h2>
            <p className="text-sm text-muted-foreground">Redeem your points for exclusive rewards</p>
          </div>
        </div>
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CoinsIcon className="h-5 w-5 text-primary" />
              <div>
                <div className="text-lg font-bold text-primary">{userInventory.points.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Available Points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Alert */}
      {showPurchaseAlert && (
        <Alert className="border-green-500/30 bg-green-500/10 animate-in slide-in-from-top-2 duration-300">
          <CheckCircleIcon className="h-4 w-4" />
          <AlertDescription className="text-green-300">
            Successfully purchased {lastPurchase}! Check your inventory.
          </AlertDescription>
        </Alert>
      )}

      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10 animate-in slide-in-from-left-4 duration-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <StarIcon className="h-5 w-5 mr-2 text-primary" />
              Featured Items
            </CardTitle>
            <CardDescription>Limited time offers and exclusive items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredItems.map((item, index) => {
                const RarityIcon = getRarityIcon(item.rarity)
                const CategoryIcon = getCategoryIcon(item.category)
                const finalPrice = item.discount ? Math.floor(item.price * (1 - item.discount / 100)) : item.price
                const canAfford = userInventory.points >= finalPrice
                const alreadyOwned = userInventory.items.includes(item.id)

                return (
                  <Card
                    key={item.id}
                    className={`bg-card border-border transition-all duration-500 hover:scale-105 hover:shadow-lg animate-in slide-in-from-bottom-4 ${
                      !item.inStock ? "opacity-50" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CategoryIcon className="h-5 w-5 text-primary" />
                        <div className="flex space-x-2">
                          <Badge variant="outline" className={getRarityColor(item.rarity)}>
                            <RarityIcon className="h-3 w-3 mr-1" />
                            {item.rarity}
                          </Badge>
                          {item.discount && <Badge className="bg-red-500/20 text-red-300">-{item.discount}%</Badge>}
                        </div>
                      </div>
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-md transition-transform duration-300 hover:scale-110"
                      />
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CoinsIcon className="h-4 w-4 text-primary" />
                          <div className="flex items-center space-x-2">
                            {item.discount && (
                              <span className="text-sm text-muted-foreground line-through">{item.price}</span>
                            )}
                            <span className="font-bold text-primary">{finalPrice}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{item.game}</Badge>
                      </div>

                      {alreadyOwned ? (
                        <Button className="w-full" disabled>
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Owned
                        </Button>
                      ) : !item.inStock ? (
                        <Button className="w-full" disabled>
                          <AlertTriangleIcon className="h-4 w-4 mr-2" />
                          Out of Stock
                        </Button>
                      ) : !canAfford ? (
                        <Button className="w-full" disabled>
                          <CoinsIcon className="h-4 w-4 mr-2" />
                          Insufficient Points
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handlePurchase(item)}
                          className="w-full transition-all duration-300 hover:scale-105"
                        >
                          <ShoppingCartIcon className="h-4 w-4 mr-2" />
                          Purchase
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="skins" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="skins" className="transition-all duration-300 hover:scale-105">
            <SparklesIcon className="h-4 w-4 mr-2" />
            Skins ({skinItems.length})
          </TabsTrigger>
          <TabsTrigger value="currency" className="transition-all duration-300 hover:scale-105">
            <CoinsIcon className="h-4 w-4 mr-2" />
            Currency ({currencyItems.length})
          </TabsTrigger>
          <TabsTrigger value="boosters" className="transition-all duration-300 hover:scale-105">
            <ZapIcon className="h-4 w-4 mr-2" />
            Boosters ({boosterItems.length})
          </TabsTrigger>
          <TabsTrigger value="cosmetics" className="transition-all duration-300 hover:scale-105">
            <GiftIcon className="h-4 w-4 mr-2" />
            Cosmetics ({cosmeticItems.length})
          </TabsTrigger>
        </TabsList>

        {[
          { key: "skins", items: skinItems },
          { key: "currency", items: currencyItems },
          { key: "boosters", items: boosterItems },
          { key: "cosmetics", items: cosmeticItems },
        ].map(({ key, items }) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item, index) => {
                const RarityIcon = getRarityIcon(item.rarity)
                const CategoryIcon = getCategoryIcon(item.category)
                const finalPrice = item.discount ? Math.floor(item.price * (1 - item.discount / 100)) : item.price
                const canAfford = userInventory.points >= finalPrice
                const alreadyOwned = userInventory.items.includes(item.id)

                return (
                  <Card
                    key={item.id}
                    className={`bg-card border-border transition-all duration-500 hover:scale-105 hover:shadow-lg animate-in slide-in-from-bottom-4 ${
                      !item.inStock ? "opacity-50" : ""
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CategoryIcon className="h-5 w-5 text-primary" />
                        <div className="flex space-x-2">
                          <Badge variant="outline" className={getRarityColor(item.rarity)}>
                            <RarityIcon className="h-3 w-3 mr-1" />
                            {item.rarity}
                          </Badge>
                          {item.discount && <Badge className="bg-red-500/20 text-red-300">-{item.discount}%</Badge>}
                        </div>
                      </div>
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-md transition-transform duration-300 hover:scale-110"
                      />
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CoinsIcon className="h-4 w-4 text-primary" />
                          <div className="flex items-center space-x-2">
                            {item.discount && (
                              <span className="text-sm text-muted-foreground line-through">{item.price}</span>
                            )}
                            <span className="font-bold text-primary">{finalPrice}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{item.game}</Badge>
                      </div>

                      {alreadyOwned ? (
                        <Button className="w-full" disabled>
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Owned
                        </Button>
                      ) : !item.inStock ? (
                        <Button className="w-full" disabled>
                          <AlertTriangleIcon className="h-4 w-4 mr-2" />
                          Out of Stock
                        </Button>
                      ) : !canAfford ? (
                        <Button className="w-full" disabled>
                          <CoinsIcon className="h-4 w-4 mr-2" />
                          Insufficient Points
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handlePurchase(item)}
                          className="w-full transition-all duration-300 hover:scale-105"
                        >
                          <ShoppingCartIcon className="h-4 w-4 mr-2" />
                          Purchase
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
