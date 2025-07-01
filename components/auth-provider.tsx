"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChange, type User } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
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

  useEffect(() => {
    console.log("🔄 Setting up Firebase auth listener...")

    const unsubscribe = onAuthStateChange((firebaseUser) => {
      console.log("🔄 Auth state changed:", firebaseUser?.email || "No user")
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => {
      console.log("🔄 Cleaning up auth listener")
      unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}
