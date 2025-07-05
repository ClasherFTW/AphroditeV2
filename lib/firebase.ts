// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-ChbhqGqMsuSSSaTPpP6yaLvUkAhOEPE",
  authDomain: "aphrodite-bb376.firebaseapp.com",
  projectId: "aphrodite-bb376",
  storageBucket: "aphrodite-bb376.firebasestorage.app",
  messagingSenderId: "1098173238307",
  appId: "1:1098173238307:web:961536e68dad5ae17ab596",
  measurementId: "G-1M0B6X16HP",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null
const auth = getAuth(app)
const db = getFirestore(app)

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.addScope("email")
googleProvider.addScope("profile")
googleProvider.setCustomParameters({
  prompt: "select_account",
})

// Auth functions
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    console.log("✅ Google sign-in successful:", result.user.email)
    return result.user
  } catch (error: any) {
    console.error("❌ Error signing in with Google:", error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    console.log("✅ Email sign-in successful:", result.user.email)
    return result.user
  } catch (error: any) {
    console.error("❌ Error signing in with email:", error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

export const registerWithEmail = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)

    // Update profile with display name
    await updateProfile(result.user, {
      displayName: displayName,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
    })

    console.log("✅ Registration successful:", result.user.email)
    return result.user
  } catch (error: any) {
    console.error("❌ Error registering:", error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email)
    console.log("✅ Password reset email sent")
  } catch (error: any) {
    console.error("❌ Error sending password reset:", error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth)
    console.log("✅ User signed out successfully")
  } catch (error: any) {
    console.error("❌ Error signing out:", error)
    throw error
  }
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// User-friendly error messages
const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "This email is already registered. Try logging in instead.",
    "auth/weak-password": "Password should be at least 6 characters long.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-not-found": "No account found with this email address.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/too-many-requests": "Too many failed attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Please check your connection.",
    "auth/popup-closed-by-user": "Sign-in was cancelled. Please try again.",
    "auth/cancelled-popup-request": "Sign-in was cancelled. Please try again.",
    "auth/popup-blocked": "Pop-up was blocked by your browser. Please allow pop-ups and try again.",
  }
  return errorMessages[errorCode] || "An unexpected error occurred. Please try again."
}

// Mock user for demo purposes (fallback)
export const mockUser = {
  uid: "demo-user-123",
  email: "demo@aphrodite.gg",
  displayName: "Demo User",
  photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  providerData: [
    {
      providerId: "demo.com",
      uid: "demo@aphrodite.gg",
      displayName: "Demo User",
      email: "demo@aphrodite.gg",
      phoneNumber: null,
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    },
  ],
}

// Demo login function (fallback)
export const signInWithDemo = async (): Promise<User> => {
  console.log("✅ Demo sign-in successful")
  return mockUser as unknown as User
}

export { auth, db, analytics }
