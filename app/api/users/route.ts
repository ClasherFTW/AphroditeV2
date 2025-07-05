import { type NextRequest, NextResponse } from "next/server"
import { UserProfileService, RBACService } from "@/lib/firestore"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")
    const role = searchParams.get("role")

    if (uid) {
      // Get specific user profile
      const profile = await UserProfileService.getUserProfile(uid)
      return NextResponse.json({ success: true, data: profile })
    }

    if (role) {
      // Get users by role (admin only)
      const users = await RBACService.getUsersByRole(role as any)
      return NextResponse.json({ success: true, data: users })
    }

    return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 })
  } catch (error) {
    console.error("❌ API Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { uid, updates, requesterId } = body

    // Check permissions for profile updates
    if (uid !== requesterId) {
      const hasPermission = await RBACService.hasPermission(requesterId, "moderate_users")
      if (!hasPermission) {
        return NextResponse.json({ success: false, error: "Insufficient permissions" }, { status: 403 })
      }
    }

    await UserProfileService.updateUserPreferences(uid, updates)
    return NextResponse.json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    console.error("❌ API Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
