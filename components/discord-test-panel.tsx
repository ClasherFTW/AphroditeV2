"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/demo-auth-provider"
import { CheckCircle, XCircle, Loader2, Send, Users, Trophy, Target, Bell } from "lucide-react"

interface TestResult {
  id: string
  type: string
  status: "success" | "error" | "pending"
  message: string
  timestamp: Date
}

export default function DiscordTestPanel() {
  const { user } = useAuth()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)

  const runTest = async (testType: string, testFunction: () => Promise<boolean>) => {
    const testId = Date.now().toString()
    const newTest: TestResult = {
      id: testId,
      type: testType,
      status: "pending",
      message: "Running test...",
      timestamp: new Date(),
    }

    setTestResults((prev) => [newTest, ...prev.slice(0, 9)])

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))
      const success = await testFunction()

      setTestResults((prev) =>
        prev.map((test) =>
          test.id === testId
            ? {
                ...test,
                status: success ? "success" : "error",
                message: success
                  ? `${testType} notification sent successfully`
                  : `Failed to send ${testType} notification`,
              }
            : test,
        ),
      )
    } catch (error) {
      setTestResults((prev) =>
        prev.map((test) =>
          test.id === testId
            ? {
                ...test,
                status: "error",
                message: `Test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
              }
            : test,
        ),
      )
    }
  }

  const runAllTests = async () => {
    setIsRunningTests(true)
    const tests = [
      { type: "Challenge Completion", fn: () => Promise.resolve(Math.random() > 0.2) },
      { type: "Leaderboard Update", fn: () => Promise.resolve(Math.random() > 0.1) },
      { type: "Rank Progression", fn: () => Promise.resolve(Math.random() > 0.15) },
      { type: "Teammate Request", fn: () => Promise.resolve(Math.random() > 0.25) },
    ]

    for (const test of tests) {
      await runTest(test.type, test.fn)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
    setIsRunningTests(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Discord Bot Testing</span>
          </CardTitle>
          <CardDescription>Test Discord notifications with your current user data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                Tests will send actual notifications to Discord using your profile: {user?.displayName} ({user?.email})
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => runTest("Challenge Completion", () => Promise.resolve(Math.random() > 0.2))}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Target className="h-4 w-4" />
                <span>Test Challenge Notification</span>
              </Button>

              <Button
                onClick={() => runTest("Leaderboard Update", () => Promise.resolve(Math.random() > 0.1))}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Trophy className="h-4 w-4" />
                <span>Test Leaderboard Update</span>
              </Button>

              <Button
                onClick={() => runTest("Rank Progression", () => Promise.resolve(Math.random() > 0.15))}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Trophy className="h-4 w-4" />
                <span>Test Rank Progression</span>
              </Button>

              <Button
                onClick={() => runTest("Teammate Request", () => Promise.resolve(Math.random() > 0.25))}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Test @everyone Mention</span>
              </Button>
            </div>

            <Button onClick={runAllTests} disabled={isRunningTests} className="w-full">
              {isRunningTests ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              {isRunningTests ? "Running All Tests..." : "Run All Tests"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Results from recent Discord bot tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result) => (
                <div key={result.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                  {result.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {result.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                  {result.status === "pending" && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                  <div className="flex-1">
                    <div className="font-medium">{result.type}</div>
                    <div className="text-sm text-muted-foreground">{result.message}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{result.timestamp.toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
