// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth"
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

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    console.log("✅ Google sign-in successful:", result.user.email)
    return result.user
  } catch (error: any) {
    console.error("❌ Error signing in with Google:", error)
    throw error
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
    console.log("✅ User signed out successfully")
  } catch (error) {
    console.error("❌ Error signing out:", error)
    throw error
  }
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Mock user for demo purposes (fallback)
export const mockUser = {
  uid: "demo-user-123",
  email: "demo@aphrodite.app",
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
      providerId: "google.com",
      uid: "demo@aphrodite.app",
      displayName: "Demo User",
      email: "demo@aphrodite.app",
      phoneNumber: null,
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    },
  ],
}

// Demo login function (fallback)
export const signInWithDemo = async () => {
  return mockUser as unknown as User
}

export { auth, db, analytics }
