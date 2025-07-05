import { db } from "@/lib/firebase"
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore"
import type { User } from "firebase/auth"

// User Profile Interface
export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  gameStats: {
    valorant: GameStats
    cs2: GameStats
  }
  preferences: {
    theme: string
    notifications: boolean
    privacy: "public" | "friends" | "private"
  }
  friends: string[]
  teams: string[]
  createdAt: Date
  lastActive: Date
}

// Game Statistics Interface
export interface GameStats {
  rank: string
  winRate: number
  kda: string
  hoursPlayed: number
  gamesPlayed: number
  weeklyLP: number
  recentMatches: Match[]
}

// Match Interface
export interface Match {
  id: string
  gameType: "valorant" | "cs2"
  result: "win" | "loss"
  score: string
  map: string
  duration: number
  kills: number
  deaths: number
  assists: number
  date: Date
  teamMembers: string[]
}

// Team Interface
export interface Team {
  id: string
  name: string
  description: string
  game: "valorant" | "cs2"
  members: TeamMember[]
  captain: string
  createdAt: Date
  isPublic: boolean
  stats: {
    wins: number
    losses: number
    tournaments: number
  }
}

export interface TeamMember {
  uid: string
  displayName: string
  role: "captain" | "member"
  joinedAt: Date
}

// **NEW: Player Search and Match History Interfaces**
export interface PlayerSearchResult {
  uid: string
  displayName: string
  photoURL?: string
  gameStats: {
    valorant: GameStats
    cs2: GameStats
  }
  privacy: "public" | "friends" | "private"
  lastActive: Date
}

export interface MatchSummary {
  totalMatches: number
  wins: number
  losses: number
  winRate: number
  averageKDA: {
    kills: number
    deaths: number
    assists: number
  }
  favoriteMap: string
  longestWinStreak: number
  recentForm: ("win" | "loss")[]
  rankProgress: {
    startRank: string
    currentRank: string
    peakRank: string
  }
}

// **FEATURE 1: User Profile Management**
export class UserProfileService {
  // Create or update user profile
  static async createUserProfile(user: User): Promise<void> {
    try {
      const userRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        const defaultProfile: UserProfile = {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "Anonymous",
          photoURL: user.photoURL || "",
          gameStats: {
            valorant: {
              rank: "Iron 1",
              winRate: 0,
              kda: "0.0/0.0/0.0",
              hoursPlayed: 0,
              gamesPlayed: 0,
              weeklyLP: 0,
              recentMatches: [],
            },
            cs2: {
              rank: "Silver 1",
              winRate: 0,
              kda: "0.0/0.0/0.0",
              hoursPlayed: 0,
              gamesPlayed: 0,
              weeklyLP: 0,
              recentMatches: [],
            },
          },
          preferences: {
            theme: "dark",
            notifications: true,
            privacy: "public",
          },
          friends: [],
          teams: [],
          createdAt: new Date(),
          lastActive: new Date(),
        }

        await setDoc(userRef, {
          ...defaultProfile,
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp(),
        })

        console.log("✅ User profile created successfully")
      } else {
        // Update last active
        await updateDoc(userRef, {
          lastActive: serverTimestamp(),
        })
      }
    } catch (error) {
      console.error("❌ Error creating user profile:", error)
      throw error
    }
  }

  // Get user profile
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, "users", uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActive: data.lastActive?.toDate() || new Date(),
        } as UserProfile
      }
      return null
    } catch (error) {
      console.error("❌ Error fetching user profile:", error)
      throw error
    }
  }

  // Update user preferences
  static async updateUserPreferences(uid: string, preferences: Partial<UserProfile["preferences"]>): Promise<void> {
    try {
      const userRef = doc(db, "users", uid)
      await updateDoc(userRef, {
        preferences: preferences,
        lastActive: serverTimestamp(),
      })
      console.log("✅ User preferences updated")
    } catch (error) {
      console.error("❌ Error updating preferences:", error)
      throw error
    }
  }

  // Real-time user profile listener
  static subscribeToUserProfile(uid: string, callback: (profile: UserProfile | null) => void) {
    const userRef = doc(db, "users", uid)
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        callback({
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActive: data.lastActive?.toDate() || new Date(),
        } as UserProfile)
      } else {
        callback(null)
      }
    })
  }
}

// **FEATURE 2: Match History Management**
export class MatchService {
  // Add new match
  static async addMatch(uid: string, match: Omit<Match, "id">): Promise<string> {
    try {
      const matchesRef = collection(db, "users", uid, "matches")
      const docRef = await addDoc(matchesRef, {
        ...match,
        date: serverTimestamp(),
      })

      // Update user stats
      await this.updateUserStats(uid, match)

      console.log("✅ Match added successfully:", docRef.id)
      return docRef.id
    } catch (error) {
      console.error("❌ Error adding match:", error)
      throw error
    }
  }

  // Also update the getUserMatches method to avoid requiring composite indexes

  // Get user matches
  static async getUserMatches(uid: string, gameType?: "valorant" | "cs2", limitCount = 10): Promise<Match[]> {
    try {
      const matchesRef = collection(db, "users", uid, "matches")
      let q

      if (gameType) {
        // Use only the where clause without orderBy
        q = query(matchesRef, where("gameType", "==", gameType))
      } else {
        // No filtering or ordering in the query
        q = query(matchesRef)
      }

      const querySnapshot = await getDocs(q)
      const matches = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as Match[]

      // Sort in memory
      matches.sort((a, b) => b.date.getTime() - a.date.getTime())

      // Apply limit after sorting
      return matches.slice(0, limitCount)
    } catch (error) {
      console.error("❌ Error fetching matches:", error)
      throw error
    }
  }

  // **NEW: Get match summary for a player**
  static async getMatchSummary(uid: string, gameType: "valorant" | "cs2"): Promise<MatchSummary> {
    try {
      const matchesRef = collection(db, "users", uid, "matches")
      // Remove the orderBy to avoid requiring a composite index
      const q = query(matchesRef, where("gameType", "==", gameType))
      const querySnapshot = await getDocs(q)

      const matches = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as Match[]

      // Sort matches in memory instead of using orderBy in the query
      matches.sort((a, b) => b.date.getTime() - a.date.getTime())

      if (matches.length === 0) {
        return {
          totalMatches: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          averageKDA: { kills: 0, deaths: 0, assists: 0 },
          favoriteMap: "N/A",
          longestWinStreak: 0,
          recentForm: [],
          rankProgress: { startRank: "N/A", currentRank: "N/A", peakRank: "N/A" },
        }
      }

      const wins = matches.filter((m) => m.result === "win").length
      const losses = matches.filter((m) => m.result === "loss").length
      const winRate = Math.round((wins / matches.length) * 100)

      // Calculate average KDA
      const totalKills = matches.reduce((sum, m) => sum + m.kills, 0)
      const totalDeaths = matches.reduce((sum, m) => sum + m.deaths, 0)
      const totalAssists = matches.reduce((sum, m) => sum + m.assists, 0)

      // Find favorite map
      const mapCounts = matches.reduce(
        (acc, m) => {
          acc[m.map] = (acc[m.map] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )
      const favoriteMap = Object.entries(mapCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

      // Calculate longest win streak
      let longestWinStreak = 0
      let currentStreak = 0

      // Create a copy and reverse for chronological order
      const chronologicalMatches = [...matches].sort((a, b) => a.date.getTime() - b.date.getTime())

      for (const match of chronologicalMatches) {
        if (match.result === "win") {
          currentStreak++
          longestWinStreak = Math.max(longestWinStreak, currentStreak)
        } else {
          currentStreak = 0
        }
      }

      // Get recent form (last 10 matches)
      const recentForm = matches.slice(0, 10).map((m) => m.result)

      // Get user profile for rank info
      const userProfile = await this.getUserProfile(uid)
      const currentRank = userProfile?.gameStats[gameType]?.rank || "N/A"

      return {
        totalMatches: matches.length,
        wins,
        losses,
        winRate,
        averageKDA: {
          kills: Math.round((totalKills / matches.length) * 10) / 10,
          deaths: Math.round((totalDeaths / matches.length) * 10) / 10,
          assists: Math.round((totalAssists / matches.length) * 10) / 10,
        },
        favoriteMap,
        longestWinStreak,
        recentForm,
        rankProgress: {
          startRank: "N/A", // Could be calculated from first match
          currentRank,
          peakRank: currentRank, // Could be tracked separately
        },
      }
    } catch (error) {
      console.error("❌ Error calculating match summary:", error)
      throw error
    }
  }

  // Update user statistics based on match
  private static async updateUserStats(uid: string, match: Omit<Match, "id">): Promise<void> {
    try {
      const userRef = doc(db, "users", uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile
        const gameStats = userData.gameStats[match.gameType]

        // Calculate new stats
        const newGamesPlayed = gameStats.gamesPlayed + 1
        const newWins = match.result === "win" ? 1 : 0
        const currentWins = Math.round((gameStats.winRate / 100) * gameStats.gamesPlayed)
        const newWinRate = Math.round(((currentWins + newWins) / newGamesPlayed) * 100)

        // Update recent matches (keep last 5)
        const recentMatches = [
          {
            result: match.result,
            score: match.score,
            map: match.map,
            date: new Date(),
          },
          ...gameStats.recentMatches.slice(0, 4),
        ]

        await updateDoc(userRef, {
          [`gameStats.${match.gameType}.gamesPlayed`]: newGamesPlayed,
          [`gameStats.${match.gameType}.winRate`]: newWinRate,
          [`gameStats.${match.gameType}.recentMatches`]: recentMatches,
          [`gameStats.${match.gameType}.hoursPlayed`]: gameStats.hoursPlayed + match.duration / 60,
          lastActive: serverTimestamp(),
        })
      }
    } catch (error) {
      console.error("❌ Error updating user stats:", error)
      throw error
    }
  }

  private static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, "users", uid)
      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActive: data.lastActive?.toDate() || new Date(),
        } as UserProfile
      }
      return null
    } catch (error) {
      console.error("❌ Error fetching user profile:", error)
      return null
    }
  }
}

// **FEATURE 3: Team Management**
export class TeamService {
  // Create new team
  static async createTeam(captainUid: string, teamData: Omit<Team, "id" | "members" | "createdAt">): Promise<string> {
    try {
      const teamsRef = collection(db, "teams")
      const docRef = await addDoc(teamsRef, {
        ...teamData,
        members: [
          {
            uid: captainUid,
            displayName: teamData.captain,
            role: "captain",
            joinedAt: serverTimestamp(),
          },
        ],
        createdAt: serverTimestamp(),
      })

      // Add team to user's teams list
      const userRef = doc(db, "users", captainUid)
      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        const userData = userDoc.data()
        await updateDoc(userRef, {
          teams: [...(userData.teams || []), docRef.id],
        })
      }

      console.log("✅ Team created successfully:", docRef.id)
      return docRef.id
    } catch (error) {
      console.error("❌ Error creating team:", error)
      throw error
    }
  }

  // Get user teams
  static async getUserTeams(uid: string): Promise<Team[]> {
    try {
      const teamsRef = collection(db, "teams")
      const q = query(teamsRef, where("members", "array-contains", { uid }))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        members: doc.data().members?.map((member: any) => ({
          ...member,
          joinedAt: member.joinedAt?.toDate() || new Date(),
        })),
      })) as Team[]
    } catch (error) {
      console.error("❌ Error fetching user teams:", error)
      throw error
    }
  }

  // Join team
  static async joinTeam(teamId: string, uid: string, displayName: string): Promise<void> {
    try {
      const teamRef = doc(db, "teams", teamId)
      const teamDoc = await getDoc(teamRef)

      if (teamDoc.exists()) {
        const teamData = teamDoc.data() as Team
        const newMember: TeamMember = {
          uid,
          displayName,
          role: "member",
          joinedAt: new Date(),
        }

        await updateDoc(teamRef, {
          members: [...teamData.members, newMember],
        })

        // Add team to user's teams list
        const userRef = doc(db, "users", uid)
        const userDoc = await getDoc(userRef)
        if (userDoc.exists()) {
          const userData = userDoc.data()
          await updateDoc(userRef, {
            teams: [...(userData.teams || []), teamId],
          })
        }

        console.log("✅ Successfully joined team")
      }
    } catch (error) {
      console.error("❌ Error joining team:", error)
      throw error
    }
  }
}

// **NEW FEATURE 4: Player Search Service**
export class PlayerSearchService {
  // Search players by username
  static async searchPlayers(searchTerm: string, limitCount = 10): Promise<PlayerSearchResult[]> {
    try {
      if (!searchTerm.trim()) return []

      const usersRef = collection(db, "users")

      // Create case-insensitive search
      const searchLower = searchTerm.toLowerCase()
      const searchUpper = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1).toLowerCase()

      // Search by display name (Firestore doesn't support full-text search, so we use range queries)
      const q = query(
        usersRef,
        where("displayName", ">=", searchTerm),
        where("displayName", "<=", searchTerm + "\uf8ff"),
        limit(limitCount),
      )

      const querySnapshot = await getDocs(q)
      const results: PlayerSearchResult[] = []

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data()

        // Only include public profiles or friends
        if (data.preferences?.privacy === "private") continue

        results.push({
          uid: docSnap.id,
          displayName: data.displayName,
          photoURL: data.photoURL,
          gameStats: data.gameStats,
          privacy: data.preferences?.privacy || "public",
          lastActive: data.lastActive?.toDate() || new Date(),
        })
      }

      // Also search case-insensitive if no exact matches
      if (results.length === 0) {
        const qLower = query(
          usersRef,
          where("displayName", ">=", searchLower),
          where("displayName", "<=", searchLower + "\uf8ff"),
          limit(limitCount),
        )

        const lowerSnapshot = await getDocs(qLower)
        for (const docSnap of lowerSnapshot.docs) {
          const data = docSnap.data()
          if (data.preferences?.privacy === "private") continue

          results.push({
            uid: docSnap.id,
            displayName: data.displayName,
            photoURL: data.photoURL,
            gameStats: data.gameStats,
            privacy: data.preferences?.privacy || "public",
            lastActive: data.lastActive?.toDate() || new Date(),
          })
        }
      }

      console.log(`✅ Found ${results.length} players for search: ${searchTerm}`)
      return results
    } catch (error) {
      console.error("❌ Error searching players:", error)
      throw error
    }
  }

  // Get public player profile
  static async getPublicPlayerProfile(uid: string): Promise<PlayerSearchResult | null> {
    try {
      const userRef = doc(db, "users", uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const data = userDoc.data()

        // Check privacy settings
        if (data.preferences?.privacy === "private") {
          return null
        }

        return {
          uid: userDoc.id,
          displayName: data.displayName,
          photoURL: data.photoURL,
          gameStats: data.gameStats,
          privacy: data.preferences?.privacy || "public",
          lastActive: data.lastActive?.toDate() || new Date(),
        }
      }
      return null
    } catch (error) {
      console.error("❌ Error fetching public player profile:", error)
      throw error
    }
  }
}
