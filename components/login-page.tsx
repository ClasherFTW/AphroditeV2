"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/demo-auth-provider"
import {
  GamepadIcon,
  LoaderIcon,
  ZapIcon,
  TrophyIcon,
  UsersIcon,
  BarChart3Icon,
  AlertCircleIcon,
  CheckCircleIcon,
  MailIcon,
} from "lucide-react"

export default function LoginPage() {
  const { signIn, signInWithGoogle, signInWithDemo, signUp, resetPassword } = useAuth()
  const [email, setEmail] = useState("demo@aphrodite.gg")
  const [password, setPassword] = useState("password")
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("signin")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await signIn(email, password)
      setSuccess("Successfully signed in!")
    } catch (error: any) {
      setError(error.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await signInWithGoogle()
      setSuccess("Successfully signed in with Google!")
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Google")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await signInWithDemo()
      setSuccess("Demo account loaded!")
    } catch (error: any) {
      setError(error.message || "Failed to load demo account")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await signUp(email, password, displayName)
      setSuccess("Account created successfully!")
    } catch (error: any) {
      setError(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await resetPassword(email)
      setSuccess("Password reset email sent!")
    } catch (error: any) {
      setError(error.message || "Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="p-3 rounded-2xl bg-primary/20 backdrop-blur-sm">
                <GamepadIcon className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Aphrodite
                </h1>
                <p className="text-xl text-white/80">Gaming Assistant</p>
              </div>
            </div>
            <p className="text-xl text-white/70 max-w-md">
              Your ultimate companion for competitive gaming with advanced analytics, live tracking, and social
              features.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <ZapIcon className="h-8 w-8 text-yellow-400 mb-2" />
              <h3 className="text-white font-semibold">Live Tracking</h3>
              <p className="text-white/60 text-sm">Real-time match monitoring</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <BarChart3Icon className="h-8 w-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold">Advanced Stats</h3>
              <p className="text-white/60 text-sm">KOST, ADR, KAST analysis</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <TrophyIcon className="h-8 w-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold">Tournaments</h3>
              <p className="text-white/60 text-sm">Competitive events</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <UsersIcon className="h-8 w-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold">Social Features</h3>
              <p className="text-white/60 text-sm">Team collaboration</p>
            </div>
          </div>
        </div>

        {/* Right Side - Authentication */}
        <Card className="w-full max-w-md mx-auto bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Welcome to Aphrodite</CardTitle>
            <CardDescription className="text-white/60">Sign in to access your gaming dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertCircleIcon className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircleIcon className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">{success}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/20">
                <TabsTrigger value="signin" className="text-white data-[state=active]:bg-primary">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-primary">
                  Sign Up
                </TabsTrigger>
                <TabsTrigger value="reset" className="text-white data-[state=active]:bg-primary">
                  Reset
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                {/* Google Sign In */}
                <Button
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  disabled={loading}
                >
                  {loading ? (
                    <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
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
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black/20 px-2 text-white/60">Or</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/20 border-white/20 text-white"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-black/20 border-white/20 text-white"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-primary/80"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-white">
                      Display Name
                    </Label>
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-black/20 border-white/20 text-white"
                      placeholder="Enter your display name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/20 border-white/20 text-white"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-black/20 border-white/20 text-white"
                      placeholder="Enter your password (min 6 characters)"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset" className="space-y-4">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/20 border-white/20 text-white"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                        Sending Reset Email...
                      </>
                    ) : (
                      <>
                        <MailIcon className="h-4 w-4 mr-2" />
                        Send Reset Email
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/20 px-2 text-white/60">Demo Access</span>
              </div>
            </div>

            <Button
              onClick={handleDemoLogin}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                  Loading Demo...
                </>
              ) : (
                "Try Demo Account"
              )}
            </Button>

            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="outline" className="border-green-400/30 text-green-300 bg-green-400/10">
                  ✓ Google Authentication
                </Badge>
                <Badge variant="outline" className="border-blue-400/30 text-blue-300 bg-blue-400/10">
                  ✓ Secure Login
                </Badge>
              </div>
              <div className="text-center text-xs text-white/60">
                <p>Sign in with Google for the best experience</p>
                <p className="mt-1">Or try the demo account for instant access</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
