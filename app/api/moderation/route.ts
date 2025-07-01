import { type NextRequest, NextResponse } from "next/server"
import { ContentService } from "@/lib/content-management"
import { RBACService } from "@/lib/rbac"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId, moderatorId, action, notes } = body

    // Verify moderator permissions
    const hasPermission = await RBACService.hasPermission(moderatorId, "moderate_users")
    if (!hasPermission) {
      return NextResponse.json({ success: false, error: "Insufficient permissions" }, { status: 403 })
    }

    await ContentService.moderateContent(contentId, moderatorId, action, notes)
    return NextResponse.json({ success: true, message: "Content moderated successfully" })
  } catch (error: any) {
    console.error("❌ API Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
