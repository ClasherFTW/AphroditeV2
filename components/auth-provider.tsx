"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  isDemo?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing demo user in localStorage
    const demoUser = localStorage.getItem("demoUser")
    if (demoUser) {
      try {
        setUser(JSON.parse(demoUser))
      } catch (error) {
        console.error("Error parsing demo user:", error)
        localStorage.removeItem("demoUser")
      }
    }
    setLoading(false)

    // Listen for demo auth events
    const handleDemoLogin = (event: CustomEvent) => {
      setUser(event.detail)
      localStorage.setItem("demoUser", JSON.stringify(event.detail))
    }

    const handleDemoLogout = () => {
      setUser(null)
      localStorage.removeItem("demoUser")
    }

    window.addEventListener("demoLogin" as any, handleDemoLogin)
    window.addEventListener("demoLogout" as any, handleDemoLogout)

    return () => {
      window.removeEventListener("demoLogin" as any, handleDemoLogin)
      window.removeEventListener("demoLogout" as any, handleDemoLogout)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Demo authentication
      if (email === "demo@aphrodite.gg" && password === "password") {
        const demoUser: User = {
          uid: "demo-user-123",
          email: "demo@aphrodite.gg",
          displayName: "Demo User",
          photoURL: "/placeholder.svg?height=40&width=40",
          isDemo: true,
        }
        setUser(demoUser)
        localStorage.setItem("demoUser", JSON.stringify(demoUser))

        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent("demoLogin", { detail: demoUser }))
      } else {
        throw new Error("Invalid credentials. Use demo@aphrodite.gg / password for demo access.")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      setUser(null)
      localStorage.removeItem("demoUser")

      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent("demoLogout"))
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true)
    try {
      // For demo purposes, create a demo user
      const demoUser: User = {
        uid: `demo-${Date.now()}`,
        email,
        displayName,
        photoURL: "/placeholder.svg?height=40&width=40",
        isDemo: true,
      }
      setUser(demoUser)
      localStorage.setItem("demoUser", JSON.stringify(demoUser))

      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent("demoLogin", { detail: demoUser }))
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    signUp,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthProvider
