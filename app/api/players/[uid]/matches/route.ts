import { type NextRequest, NextResponse } from "next/server"
import { MatchService, PlayerSearchService } from "@/lib/firestore"

// **NEW: Player Match History API Route**

export async function GET(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const { uid } = params
    const { searchParams } = new URL(request.url)
    const gameType = searchParams.get("gameType") as "valorant" | "cs2" | undefined
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!uid) {
      return NextResponse.json({ error: "Player UID is required" }, { status: 400 })
    }

    // Check if player profile is public
    const playerProfile = await PlayerSearchService.getPublicPlayerProfile(uid)
    if (!playerProfile) {
      return NextResponse.json({ error: "Player not found or profile is private" }, { status: 404 })
    }

    // Get match history - modified to handle sorting in memory
    let matches = await MatchService.getUserMatches(uid, gameType, 100) // Get more matches than needed

    // Sort in memory
    matches = matches.sort((a, b) => b.date.getTime() - a.date.getTime())

    // Apply limit after sorting
    matches = matches.slice(0, limit)

    // Get match summary for both games
    const valorantSummary = await MatchService.getMatchSummary(uid, "valorant")
    const cs2Summary = await MatchService.getMatchSummary(uid, "cs2")

    console.log(`✅ Player match history API: Retrieved ${matches.length} matches for ${uid}`)

    return NextResponse.json({
      success: true,
      player: playerProfile,
      matches,
      summary: {
        valorant: valorantSummary,
        cs2: cs2Summary,
      },
      count: matches.length,
    })
  } catch (error) {
    console.error("❌ API Error fetching player matches:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
