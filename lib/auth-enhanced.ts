import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  type User,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { UserProfileService } from "@/lib/firestore"

export interface RegistrationData {
  email: string
  password: string
  displayName: string
  gamePreferences: string[]
  region: string
  skillLevel: "beginner" | "intermediate" | "advanced" | "pro"
}

export class AuthService {
  // Enhanced registration with email verification
  static async registerUser(data: RegistrationData): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password)

      // Update profile with display name
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.displayName}`,
      })

      // Send email verification
      await sendEmailVerification(user)

      // Create enhanced user profile
      await UserProfileService.createEnhancedUserProfile(user, {
        gamePreferences: data.gamePreferences,
        region: data.region,
        skillLevel: data.skillLevel,
        registrationDate: new Date(),
        emailVerified: false,
      })

      console.log("✅ User registered successfully")
      return user
    } catch (error: any) {
      console.error("❌ Registration failed:", error)
      throw new Error(this.getAuthErrorMessage(error.code))
    }
  }

  // Enhanced login with security checks
  static async loginUser(email: string, password: string): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)

      // Update last login time
      await UserProfileService.updateLastLogin(user.uid)

      console.log("✅ User logged in successfully")
      return user
    } catch (error: any) {
      console.error("❌ Login failed:", error)
      throw new Error(this.getAuthErrorMessage(error.code))
    }
  }

  // Password reset functionality
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
      console.log("✅ Password reset email sent")
    } catch (error: any) {
      console.error("❌ Password reset failed:", error)
      throw new Error(this.getAuthErrorMessage(error.code))
    }
  }

  // User-friendly error messages
  private static getAuthErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      "auth/email-already-in-use": "This email is already registered. Try logging in instead.",
      "auth/weak-password": "Password should be at least 6 characters long.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/user-not-found": "No account found with this email address.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/too-many-requests": "Too many failed attempts. Please try again later.",
      "auth/network-request-failed": "Network error. Please check your connection.",
    }
    return errorMessages[errorCode] || "An unexpected error occurred. Please try again."
  }
}
