import { type NextRequest, NextResponse } from "next/server"
import { ContentService } from "@/lib/content-management"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      type: searchParams.get("type") || undefined,
      game: searchParams.get("game") || undefined,
      status: searchParams.get("status") || "published",
      author: searchParams.get("author") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 20,
    }

    const content = await ContentService.getContent(filters)
    return NextResponse.json({ success: true, data: content })
  } catch (error) {
    console.error("❌ API Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { authorId, contentData } = body

    const contentId = await ContentService.createContent(authorId, contentData)
    return NextResponse.json({ success: true, data: { id: contentId } })
  } catch (error: any) {
    console.error("❌ API Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
