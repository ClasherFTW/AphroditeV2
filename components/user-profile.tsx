// Import the functions you need from the SDKs you need
import {
  logout as firebaseLogout,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  auth,
  db,
  analytics,
  type User,
} from "@/lib/firebase"
import { mockUser } from "@/lib/mockUser" // Declare the mockUser variable

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error: any) {
    console.error("Error signing in with Google:", error)
    throw error
  }
}

// Demo login function
export const signInWithDemo = async () => {
  // Store mock user in localStorage
  localStorage.setItem("demo-user", JSON.stringify(mockUser))
  // Trigger auth state change
  window.dispatchEvent(new Event("demo-login"))
  return mockUser
}

export const logout = async () => {
  try {
    // Clear demo user if exists
    localStorage.removeItem("demo-user")
    // Trigger auth state change for demo
    window.dispatchEvent(new Event("demo-logout"))
    // Real Firebase logout
    await firebaseLogout(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  // Check for demo user on init
  const checkDemoUser = () => {
    const demoUser = localStorage.getItem("demo-user")
    if (demoUser) {
      callback(JSON.parse(demoUser) as unknown as User)
      return true
    }
    return false
  }

  // Handle demo login/logout events
  const handleDemoLogin = () => {
    const demoUser = localStorage.getItem("demo-user")
    if (demoUser) {
      callback(JSON.parse(demoUser) as unknown as User)
    }
  }

  const handleDemoLogout = () => {
    callback(null)
  }

  // Add event listeners for demo auth
  window.addEventListener("demo-login", handleDemoLogin)
  window.addEventListener("demo-logout", handleDemoLogout)

  // If no demo user, use real Firebase auth
  if (!checkDemoUser()) {
    // Real Firebase auth state change
    const unsubscribe = onAuthStateChanged(auth, callback)
    return () => {
      unsubscribe()
      window.removeEventListener("demo-login", handleDemoLogin)
      window.removeEventListener("demo-logout", handleDemoLogout)
    }
  }

  // Return cleanup function
  return () => {
    window.removeEventListener("demo-login", handleDemoLogin)
    window.removeEventListener("demo-logout", handleDemoLogout)
  }
}

export { auth, db, analytics }
