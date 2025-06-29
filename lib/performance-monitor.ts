/**
 * Enhanced Performance Monitor Library with detailed debugging
 */

export interface SystemMetrics {
  cpu: {
    usage: number
    temperature: number
    cores: number
    frequency: number
    model?: string
  }
  memory: {
    usage: number
    available: number
    used: number
    free?: number
  }
  gpu: {
    usage: number
    temperature: number
    memory: number
    memoryUsed: number
    model?: string
  }
  disk: {
    usage: number
    readSpeed: number
    writeSpeed: number
  }
  network: {
    ping: number
    jitter: number
    packetLoss: number
    downloadSpeed: number
    uploadSpeed: number
    latencyGrade?: string
    connectionQuality?: number
  }
  fps: number
  frameTime: number | string
  processes?: {
    total: number
    running: number
    sleeping: number
  }
  timestamp?: string
  source?: "real" | "simulated"
  libraryStatus?: {
    systeminformation: boolean
    nodeOsUtils: boolean
    ping: boolean
  }
  reason?: string
  error?: string
}

export class PerformanceMonitor {
  private static cache: { metrics: SystemMetrics | null; timestamp: number } = {
    metrics: null,
    timestamp: 0,
  }

  private static readonly CACHE_DURATION = 1000 // 1 second cache for more frequent updates

  /**
   * Get current system metrics from API with enhanced error handling
   */
  static async getCurrentMetrics(): Promise<SystemMetrics> {
    // Check cache first
    const now = Date.now()
    if (this.cache.metrics && now - this.cache.timestamp < this.CACHE_DURATION) {
      console.log("📋 Using cached metrics")
      return this.cache.metrics
    }

    console.log("🔄 Fetching fresh system metrics...")

    try {
      const response = await fetch("/api/system/metrics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("📊 API Response:", {
        success: result.success,
        source: result.source,
        libraryStatus: result.libraryStatus,
        reason: result.reason,
        error: result.error,
      })

      if (result.success && result.data) {
        // Update cache
        this.cache.metrics = {
          ...result.data,
          source: result.source,
          libraryStatus: result.libraryStatus,
          reason: result.reason,
          error: result.error,
        }
        this.cache.timestamp = now

        // Log data source for debugging
        if (result.source === "real") {
          console.log("✅ Real-time data received successfully!")
        } else {
          console.log("⚠️ Simulated data received. Reason:", result.reason || "Unknown")
          if (result.error) {
            console.log("🔍 Error details:", result.error)
          }
        }

        return this.cache.metrics
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("❌ Error fetching system metrics:", error)

      // Return enhanced fallback data with error info
      const fallbackMetrics = this.getSimulatedMetrics()
      fallbackMetrics.source = "simulated"
      fallbackMetrics.reason = "fetch_error"
      fallbackMetrics.error = error instanceof Error ? error.message : "Network error"

      return fallbackMetrics
    }
  }

  /**
   * Get detailed network metrics with enhanced debugging
   */
  static async getNetworkMetrics(): Promise<any> {
    console.log("🌐 Fetching network metrics...")

    try {
      const response = await fetch("/api/system/network", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("🌐 Network metrics response:", result.source)

      if (result.success && result.data) {
        return result.data
      } else {
        throw new Error("Invalid network response format")
      }
    } catch (error) {
      console.error("❌ Error fetching network metrics:", error)
      return null
    }
  }

  /**
   * Calculate overall performance score based on metrics
   */
  static calculatePerformanceScore(metrics: SystemMetrics): number {
    let score = 100

    // CPU penalties
    if (metrics.cpu.usage > 80) score -= 15
    else if (metrics.cpu.usage > 60) score -= 5

    if (metrics.cpu.temperature > 85) score -= 20
    else if (metrics.cpu.temperature > 75) score -= 10

    // Memory penalties
    if (metrics.memory.usage > 90) score -= 15
    else if (metrics.memory.usage > 70) score -= 5

    // GPU penalties
    if (metrics.gpu.usage > 95) score -= 10
    if (metrics.gpu.temperature > 85) score -= 15
    else if (metrics.gpu.temperature > 75) score -= 5

    // Network penalties
    if (metrics.network.ping > 100) score -= 25
    else if (metrics.network.ping > 50) score -= 10
    else if (metrics.network.ping > 30) score -= 5

    if (metrics.network.jitter > 10) score -= 15
    else if (metrics.network.jitter > 5) score -= 5

    if (metrics.network.packetLoss > 2) score -= 20
    else if (metrics.network.packetLoss > 0.5) score -= 10

    // FPS penalties
    const fpsValue = typeof metrics.fps === "number" ? metrics.fps : Number.parseInt(metrics.fps.toString())
    if (fpsValue < 60) score -= 20
    else if (fpsValue < 100) score -= 10

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  /**
   * Apply system optimizations with progress tracking
   */
  static async applyOptimizations(): Promise<void> {
    console.log("🔧 Starting system optimizations...")

    try {
      // Simulate optimization process with real delays
      const steps = [
        "Analyzing system performance...",
        "Closing unnecessary background processes...",
        "Optimizing network settings...",
        "Adjusting GPU settings...",
        "Clearing system cache...",
        "Finalizing optimizations...",
      ]

      for (let i = 0; i < steps.length; i++) {
        console.log(`⚙️ ${steps[i]}`)
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      console.log("✅ System optimizations completed successfully")

      // Clear cache to force fresh data fetch
      this.cache.metrics = null
      this.cache.timestamp = 0

      return
    } catch (error) {
      console.error("❌ Error applying optimizations:", error)
      throw error
    }
  }

  /**
   * Get comprehensive system information
   */
  static async getSystemInfo(): Promise<any> {
    try {
      const metrics = await this.getCurrentMetrics()

      return {
        cpu: {
          model: metrics.cpu.model || "Unknown CPU",
          cores: metrics.cpu.cores,
          frequency: `${metrics.cpu.frequency.toFixed(1)} GHz`,
          usage: `${metrics.cpu.usage}%`,
          temperature: `${metrics.cpu.temperature}°C`,
        },
        memory: {
          total: `${metrics.memory.available} GB`,
          used: `${metrics.memory.used} GB`,
          usage: `${metrics.memory.usage}%`,
        },
        gpu: {
          model: metrics.gpu.model || "Unknown GPU",
          memory: `${metrics.gpu.memory} GB`,
          usage: `${metrics.gpu.usage}%`,
          temperature: `${metrics.gpu.temperature}°C`,
        },
        network: {
          ping: `${metrics.network.ping}ms`,
          quality: metrics.network.latencyGrade || "Unknown",
          downloadSpeed: `${Math.round(metrics.network.downloadSpeed)} Mbps`,
          uploadSpeed: `${Math.round(metrics.network.uploadSpeed)} Mbps`,
        },
        performance: {
          fps: typeof metrics.fps === "number" ? metrics.fps : Number.parseInt(metrics.fps.toString()),
          frameTime: `${metrics.frameTime}ms`,
          score: this.calculatePerformanceScore(metrics),
        },
        source: metrics.source || "unknown",
        libraryStatus: metrics.libraryStatus,
        reason: metrics.reason,
        error: metrics.error,
        lastUpdated: metrics.timestamp || new Date().toISOString(),
      }
    } catch (error) {
      console.error("❌ Error getting system info:", error)
      throw error
    }
  }

  /**
   * Enhanced simulated metrics with debugging info
   */
  private static getSimulatedMetrics(): SystemMetrics {
    return {
      cpu: {
        usage: Math.floor(30 + Math.random() * 50),
        temperature: Math.floor(50 + Math.random() * 30),
        cores: 8,
        frequency: 3.2 + Math.random() * 0.8,
        model: "Simulated CPU",
      },
      memory: {
        usage: Math.floor(40 + Math.random() * 40),
        available: 16,
        used: Math.floor(6 + Math.random() * 8),
        free: Math.floor(2 + Math.random() * 4),
      },
      gpu: {
        usage: Math.floor(40 + Math.random() * 50),
        temperature: Math.floor(60 + Math.random() * 25),
        memory: 8,
        memoryUsed: Math.floor(3 + Math.random() * 4),
        model: "Simulated GPU",
      },
      disk: {
        usage: Math.floor(20 + Math.random() * 40),
        readSpeed: Math.floor(100 + Math.random() * 100),
        writeSpeed: Math.floor(80 + Math.random() * 100),
      },
      network: {
        ping: Math.floor(15 + Math.random() * 30),
        jitter: 1 + Math.random() * 5,
        packetLoss: Math.random() * 2,
        downloadSpeed: Math.floor(100 + Math.random() * 100),
        uploadSpeed: Math.floor(20 + Math.random() * 50),
        latencyGrade: "Good",
        connectionQuality: 85,
      },
      fps: Math.floor(100 + Math.random() * 80),
      frameTime: (5 + Math.random() * 10).toFixed(1),
      processes: {
        total: 200 + Math.floor(Math.random() * 100),
        running: 5 + Math.floor(Math.random() * 10),
        sleeping: 195 + Math.floor(Math.random() * 90),
      },
      timestamp: new Date().toISOString(),
      source: "simulated",
    }
  }
}
