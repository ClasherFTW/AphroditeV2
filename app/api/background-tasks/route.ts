import { type NextRequest, NextResponse } from "next/server"
import { UserProfileService } from "@/lib/firestore"

// **FEATURE 5: Background Tasks for Data Processing**

interface TaskQueue {
  id: string
  type: "rank_update" | "stats_calculation" | "leaderboard_update"
  userId?: string
  data: any
  status: "pending" | "processing" | "completed" | "failed"
  createdAt: Date
  completedAt?: Date
}

// In-memory task queue (in production, use Redis or a proper queue system)
const taskQueue: TaskQueue[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, userId, data } = body

    // Create new task
    const task: TaskQueue = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      userId,
      data,
      status: "pending",
      createdAt: new Date(),
    }

    taskQueue.push(task)

    // Process task asynchronously
    processTask(task)

    console.log("✅ Background task queued:", task.id)

    return NextResponse.json({
      success: true,
      taskId: task.id,
      message: "Task queued successfully",
    })
  } catch (error) {
    console.error("❌ API Error queuing task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get("taskId")

    if (taskId) {
      const task = taskQueue.find((t) => t.id === taskId)
      if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, task })
    }

    // Return all tasks
    return NextResponse.json({
      success: true,
      tasks: taskQueue.slice(-10), // Last 10 tasks
      count: taskQueue.length,
    })
  } catch (error) {
    console.error("❌ API Error fetching tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Background task processor
async function processTask(task: TaskQueue) {
  try {
    // Update task status
    task.status = "processing"
    console.log(`🔄 Processing task: ${task.id} (${task.type})`)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    switch (task.type) {
      case "rank_update":
        await processRankUpdate(task)
        break
      case "stats_calculation":
        await processStatsCalculation(task)
        break
      case "leaderboard_update":
        await processLeaderboardUpdate(task)
        break
      default:
        throw new Error(`Unknown task type: ${task.type}`)
    }

    task.status = "completed"
    task.completedAt = new Date()
    console.log(`✅ Task completed: ${task.id}`)
  } catch (error) {
    task.status = "failed"
    task.completedAt = new Date()
    console.error(`❌ Task failed: ${task.id}`, error)
  }
}

async function processRankUpdate(task: TaskQueue) {
  // Simulate rank calculation based on recent matches
  const { userId, gameType } = task.data

  if (!userId) return

  try {
    const userProfile = await UserProfileService.getUserProfile(userId)
    if (!userProfile) return

    const gameStats = userProfile.gameStats[gameType as keyof typeof userProfile.gameStats]
    let newRank = gameStats.rank

    // Simple rank progression logic
    if (gameStats.winRate > 70 && gameStats.gamesPlayed > 10) {
      const ranks = ["Iron 1", "Iron 2", "Iron 3", "Bronze 1", "Bronze 2", "Bronze 3", "Silver 1", "Silver 2"]
      const currentIndex = ranks.indexOf(gameStats.rank)
      if (currentIndex < ranks.length - 1) {
        newRank = ranks[currentIndex + 1]
      }
    }

    // Update user profile with new rank
    await UserProfileService.updateUserPreferences(userId, {
      [`gameStats.${gameType}.rank`]: newRank,
    } as any)

    console.log(`✅ Rank updated for user ${userId}: ${newRank}`)
  } catch (error) {
    console.error("❌ Error processing rank update:", error)
    throw error
  }
}

async function processStatsCalculation(task: TaskQueue) {
  // Simulate complex statistics calculation
  const { userId, period } = task.data

  console.log(`📊 Calculating stats for user ${userId} (period: ${period})`)

  // Simulate heavy computation
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real implementation, this would:
  // 1. Fetch all user matches for the period
  // 2. Calculate advanced statistics
  // 3. Update user profile with calculated stats
  // 4. Generate performance insights

  console.log(`✅ Stats calculation completed for user ${userId}`)
}

async function processLeaderboardUpdate(task: TaskQueue) {
  // Simulate leaderboard recalculation
  const { gameType } = task.data

  console.log(`🏆 Updating leaderboard for ${gameType}`)

  // Simulate leaderboard calculation
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In a real implementation, this would:
  // 1. Fetch all users' stats for the game type
  // 2. Sort by ranking criteria
  // 3. Update leaderboard collection in Firestore
  // 4. Cache results for fast access

  console.log(`✅ Leaderboard updated for ${gameType}`)
}
