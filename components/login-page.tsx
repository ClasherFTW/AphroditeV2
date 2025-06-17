"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GamepadIcon, UserCircle, Loader2, AlertCircle } from "lucide-react"
import { signInWithGoogle, signInWithDemo } from "@/lib/firebase"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      await signInWithGoogle()
      console.log("✅ Google sign-in successful")
    } catch (error: any) {
      console.error("❌ Google sign-in failed:", error)
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleDemoSignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      await signInWithDemo()
      console.log("✅ Demo sign-in successful")
      // Force a page refresh to trigger auth state change
      window.location.reload()
    } catch (error: any) {
      console.error("❌ Demo sign-in failed:", error)
      setError("Demo login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (error: any): string => {
    const errorMessages: Record<string, string> = {
      "auth/popup-closed-by-user": "Sign-in was cancelled. Please try again.",
      "auth/popup-blocked": "Pop-up was blocked. Please allow pop-ups and try again.",
      "auth/cancelled-popup-request": "Sign-in was cancelled. Please try again.",
      "auth/network-request-failed": "Network error. Please check your connection.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
    }

    return errorMessages[error.code] || error.message || "An unexpected error occurred. Please try again."
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <GamepadIcon className="h-12 w-12 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Aphrodite
            </h1>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary" className="animate-in slide-in-from-left-2 duration-300">
              Gaming Assistant
            </Badge>
            <p className="text-muted-foreground">Your ultimate gaming companion for Valorant and CS:GO</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Login Card */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to access your gaming dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2"
              size="lg"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>{loading ? "Signing in..." : "Continue with Google"}</span>
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Demo Sign In */}
            <Button
              onClick={handleDemoSignIn}
              disabled={loading}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
              size="lg"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserCircle className="h-5 w-5" />}
              <span>{loading ? "Signing in..." : "Try Demo Account"}</span>
            </Button>

            <p className="text-xs text-center text-muted-foreground">Demo mode requires no registration</p>
          </CardContent>
          <CardFooter>
            <p className="text-center text-xs text-muted-foreground w-full">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>

        {/* Features Preview */}
        <Card className="animate-in slide-in-from-bottom-6 duration-700">
          <CardHeader>
            <CardTitle className="text-lg">What's Inside</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm">AI-powered coaching for Valorant & CS:GO</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
              <span className="text-sm">Performance analytics and tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
              <span className="text-sm">Team communication simulator</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
              <span className="text-sm">Tournament hub and leaderboards</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-500"></div>
              <span className="text-sm">Discord integration and notifications</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
