"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  onAuthStateChange,
  signInWithGoogle,
  signInWithEmail,
  signInWithDemo,
  registerWithEmail,
  resetPassword,
  logout,
  type User,
} from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithDemo: () => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  signOut: () => Promise<void>
  authMethod: "firebase" | "demo" | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signInWithDemo: async () => {},
  signUp: async () => {},
  resetPassword: async () => {},
  signOut: async () => {},
  authMethod: null,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authMethod, setAuthMethod] = useState<"firebase" | "demo" | null>(null)

  useEffect(() => {
    console.log("🔄 Setting up auth listener...")

    // Check for demo user first
    const checkDemoUser = () => {
      const demoUser = localStorage.getItem("demo-user")
      if (demoUser) {
        const parsedUser = JSON.parse(demoUser) as unknown as User
        setUser(parsedUser)
        setAuthMethod("demo")
        setLoading(false)
        return true
      }
      return false
    }

    // Handle demo auth events
    const handleDemoLogin = () => {
      const demoUser = localStorage.getItem("demo-user")
      if (demoUser) {
        const parsedUser = JSON.parse(demoUser) as unknown as User
        setUser(parsedUser)
        setAuthMethod("demo")
      }
    }

    const handleDemoLogout = () => {
      setUser(null)
      setAuthMethod(null)
      localStorage.removeItem("demo-user")
    }

    // Add event listeners for demo auth
    window.addEventListener("demo-login", handleDemoLogin)
    window.addEventListener("demo-logout", handleDemoLogout)

    // If no demo user, use Firebase auth
    if (!checkDemoUser()) {
      const unsubscribe = onAuthStateChange((firebaseUser) => {
        console.log("🔄 Firebase auth state changed:", firebaseUser?.email || "No user")
        setUser(firebaseUser)
        setAuthMethod(firebaseUser ? "firebase" : null)
        setLoading(false)
      })

      return () => {
        unsubscribe()
        window.removeEventListener("demo-login", handleDemoLogin)
        window.removeEventListener("demo-logout", handleDemoLogout)
      }
    }

    // Return cleanup function for demo-only mode
    return () => {
      window.removeEventListener("demo-login", handleDemoLogin)
      window.removeEventListener("demo-logout", handleDemoLogout)
    }
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      if (email === "demo@aphrodite.gg" && password === "password") {
        // Demo login
        const demoUser = await signInWithDemo()
        localStorage.setItem("demo-user", JSON.stringify(demoUser))
        window.dispatchEvent(new Event("demo-login"))
      } else {
        // Firebase login
        await signInWithEmail(email, password)
      }
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignInWithGoogle = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.error("Google sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignInWithDemo = async () => {
    try {
      setLoading(true)
      const demoUser = await signInWithDemo()
      localStorage.setItem("demo-user", JSON.stringify(demoUser))
      window.dispatchEvent(new Event("demo-login"))
    } catch (error) {
      console.error("Demo sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true)
      await registerWithEmail(email, password, displayName)
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword(email)
    } catch (error) {
      console.error("Reset password error:", error)
      throw error
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      if (authMethod === "demo") {
        window.dispatchEvent(new Event("demo-logout"))
      } else {
        await logout()
      }
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithDemo: handleSignInWithDemo,
    signUp: handleSignUp,
    resetPassword: handleResetPassword,
    signOut: handleSignOut,
    authMethod,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
