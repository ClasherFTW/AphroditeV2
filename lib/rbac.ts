import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"

export type UserRole = "user" | "moderator" | "admin" | "super_admin"
export type Permission =
  | "read_content"
  | "create_content"
  | "edit_content"
  | "delete_content"
  | "moderate_users"
  | "manage_tournaments"
  | "access_analytics"
  | "manage_system"

export interface RolePermissions {
  role: UserRole
  permissions: Permission[]
  description: string
}

// Role-based access control system
export class RBACService {
  private static roleHierarchy: Record<UserRole, Permission[]> = {
    user: ["read_content", "create_content"],
    moderator: ["read_content", "create_content", "edit_content", "moderate_users"],
    admin: [
      "read_content",
      "create_content",
      "edit_content",
      "delete_content",
      "moderate_users",
      "manage_tournaments",
      "access_analytics",
    ],
    super_admin: [
      "read_content",
      "create_content",
      "edit_content",
      "delete_content",
      "moderate_users",
      "manage_tournaments",
      "access_analytics",
      "manage_system",
    ],
  }

  // Check if user has specific permission
  static async hasPermission(uid: string, permission: Permission): Promise<boolean> {
    try {
      const userRole = await this.getUserRole(uid)
      return this.roleHierarchy[userRole].includes(permission)
    } catch (error) {
      console.error("❌ Error checking permission:", error)
      return false
    }
  }

  // Get user role
  static async getUserRole(uid: string): Promise<UserRole> {
    try {
      const userRef = doc(db, "users", uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        return userDoc.data().role || "user"
      }
      return "user"
    } catch (error) {
      console.error("❌ Error getting user role:", error)
      return "user"
    }
  }

  // Assign role to user (admin only)
  static async assignRole(uid: string, role: UserRole, assignedBy: string): Promise<void> {
    try {
      // Check if assigner has permission
      const hasPermission = await this.hasPermission(assignedBy, "manage_system")
      if (!hasPermission) {
        throw new Error("Insufficient permissions to assign roles")
      }

      const userRef = doc(db, "users", uid)
      await updateDoc(userRef, {
        role: role,
        roleAssignedBy: assignedBy,
        roleAssignedAt: new Date(),
      })

      // Log role change
      await this.logRoleChange(uid, role, assignedBy)

      console.log(`✅ Role ${role} assigned to user ${uid}`)
    } catch (error) {
      console.error("❌ Error assigning role:", error)
      throw error
    }
  }

  // Log role changes for audit trail
  private static async logRoleChange(uid: string, newRole: UserRole, assignedBy: string): Promise<void> {
    const logRef = doc(collection(db, "audit_logs"))
    await setDoc(logRef, {
      type: "role_change",
      targetUser: uid,
      newRole: newRole,
      assignedBy: assignedBy,
      timestamp: new Date(),
      ip: "system", // In production, capture actual IP
    })
  }

  // Get all users with specific role
  static async getUsersByRole(role: UserRole): Promise<string[]> {
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("role", "==", role))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => doc.id)
    } catch (error) {
      console.error("❌ Error getting users by role:", error)
      return []
    }
  }
}
