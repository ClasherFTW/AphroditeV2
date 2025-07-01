import { type NextRequest, NextResponse } from "next/server"
import { MatchService } from "@/lib/firestore"

// **FEATURE 4: API Routes for Match Submissions**

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { uid, gameType, result, score, map, duration, kills, deaths, assists, teamMembers } = body

    // Validation
    if (!uid || !gameType || !result || !score || !map) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["valorant", "cs2"].includes(gameType)) {
      return NextResponse.json({ error: "Invalid game type" }, { status: 400 })
    }

    if (!["win", "loss"].includes(result)) {
      return NextResponse.json({ error: "Invalid result" }, { status: 400 })
    }

    // Create match object
    const match = {
      gameType: gameType as "valorant" | "cs2",
      result: result as "win" | "loss",
      score,
      map,
      duration: duration || 30,
      kills: kills || 0,
      deaths: deaths || 0,
      assists: assists || 0,
      teamMembers: teamMembers || [],
    }

    // Add match to Firestore
    const matchId = await MatchService.addMatch(uid, match)

    console.log("✅ Match submitted via API:", matchId)

    return NextResponse.json({
      success: true,
      matchId,
      message: "Match submitted successfully",
    })
  } catch (error) {
    console.error("❌ API Error submitting match:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")
    const gameType = searchParams.get("gameType") as "valorant" | "cs2" | undefined
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!uid) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const matches = await MatchService.getUserMatches(uid, gameType, limit)

    return NextResponse.json({
      success: true,
      matches,
      count: matches.length,
    })
  } catch (error) {
    console.error("❌ API Error fetching matches:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
