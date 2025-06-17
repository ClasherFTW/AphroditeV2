import { type NextRequest, NextResponse } from "next/server"
import { PlayerSearchService } from "@/lib/firestore"

// **NEW: Player Search API Route**

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!searchTerm) {
      return NextResponse.json({ error: "Search term is required" }, { status: 400 })
    }

    if (searchTerm.length < 2) {
      return NextResponse.json({ error: "Search term must be at least 2 characters" }, { status: 400 })
    }

    const players = await PlayerSearchService.searchPlayers(searchTerm, limit)

    console.log(`✅ Player search API: Found ${players.length} results for "${searchTerm}"`)

    return NextResponse.json({
      success: true,
      players,
      count: players.length,
      searchTerm,
    })
  } catch (error) {
    console.error("❌ API Error searching players:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
