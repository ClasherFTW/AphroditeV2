import { db } from "@/lib/firebase"
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore"
import { RBACService } from "./rbac"

export interface ContentItem {
  id: string
  title: string
  content: string
  type: "guide" | "news" | "tutorial" | "strategy"
  game: string
  author: string
  authorName: string
  status: "draft" | "published" | "archived" | "flagged"
  tags: string[]
  views: number
  likes: number
  createdAt: Date
  updatedAt: Date
  moderatedBy?: string
  moderationNotes?: string
}

export interface Comment {
  id: string
  contentId: string
  author: string
  authorName: string
  text: string
  parentId?: string // For nested comments
  status: "active" | "flagged" | "deleted"
  createdAt: Date
  likes: number
  reports: number
}

export class ContentService {
  // Create new content
  static async createContent(
    authorId: string,
    contentData: Omit<ContentItem, "id" | "author" | "createdAt" | "updatedAt" | "views" | "likes">,
  ): Promise<string> {
    try {
      // Check permissions
      const hasPermission = await RBACService.hasPermission(authorId, "create_content")
      if (!hasPermission) {
        throw new Error("Insufficient permissions to create content")
      }

      const contentRef = collection(db, "content")
      const docRef = await addDoc(contentRef, {
        ...contentData,
        author: authorId,
        views: 0,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      console.log("✅ Content created successfully:", docRef.id)
      return docRef.id
    } catch (error) {
      console.error("❌ Error creating content:", error)
      throw error
    }
  }

  // Get content with filtering and pagination
  static async getContent(
    filters: {
      type?: string
      game?: string
      status?: string
      author?: string
      limit?: number
    } = {},
  ): Promise<ContentItem[]> {
    try {
      const contentRef = collection(db, "content")
      let q = query(contentRef, orderBy("createdAt", "desc"))

      // Apply filters
      if (filters.type) {
        q = query(q, where("type", "==", filters.type))
      }
      if (filters.game) {
        q = query(q, where("game", "==", filters.game))
      }
      if (filters.status) {
        q = query(q, where("status", "==", filters.status))
      }
      if (filters.author) {
        q = query(q, where("author", "==", filters.author))
      }
      if (filters.limit) {
        q = query(q, limit(filters.limit))
      }

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as ContentItem[]
    } catch (error) {
      console.error("❌ Error fetching content:", error)
      return []
    }
  }

  // Moderate content (moderator/admin only)
  static async moderateContent(
    contentId: string,
    moderatorId: string,
    action: "approve" | "flag" | "archive",
    notes?: string,
  ): Promise<void> {
    try {
      // Check permissions
      const hasPermission = await RBACService.hasPermission(moderatorId, "moderate_users")
      if (!hasPermission) {
        throw new Error("Insufficient permissions to moderate content")
      }

      const contentRef = doc(db, "content", contentId)
      const statusMap = {
        approve: "published",
        flag: "flagged",
        archive: "archived",
      }

      await updateDoc(contentRef, {
        status: statusMap[action],
        moderatedBy: moderatorId,
        moderationNotes: notes || "",
        moderatedAt: serverTimestamp(),
      })

      // Log moderation action
      await this.logModerationAction(contentId, moderatorId, action, notes)

      console.log(`✅ Content ${action}ed successfully`)
    } catch (error) {
      console.error("❌ Error moderating content:", error)
      throw error
    }
  }

  // Add comment to content
  static async addComment(contentId: string, authorId: string, text: string, parentId?: string): Promise<string> {
    try {
      const commentsRef = collection(db, "comments")
      const docRef = await addDoc(commentsRef, {
        contentId,
        author: authorId,
        text,
        parentId: parentId || null,
        status: "active",
        createdAt: serverTimestamp(),
        likes: 0,
        reports: 0,
      })

      console.log("✅ Comment added successfully")
      return docRef.id
    } catch (error) {
      console.error("❌ Error adding comment:", error)
      throw error
    }
  }

  // Report content/comment
  static async reportContent(
    contentId: string,
    reporterId: string,
    reason: string,
    type: "content" | "comment",
  ): Promise<void> {
    try {
      const reportsRef = collection(db, "reports")
      await addDoc(reportsRef, {
        contentId,
        reporterId,
        reason,
        type,
        status: "pending",
        createdAt: serverTimestamp(),
      })

      console.log("✅ Content reported successfully")
    } catch (error) {
      console.error("❌ Error reporting content:", error)
      throw error
    }
  }

  // Log moderation actions
  private static async logModerationAction(
    contentId: string,
    moderatorId: string,
    action: string,
    notes?: string,
  ): Promise<void> {
    const logRef = doc(collection(db, "moderation_logs"))
    await addDoc(collection(db, "moderation_logs"), {
      contentId,
      moderatorId,
      action,
      notes: notes || "",
      timestamp: serverTimestamp(),
    })
  }
}
