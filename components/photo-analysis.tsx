"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGameStats } from "@/components/game-stats-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CameraIcon,
  UploadIcon,
  ImageIcon,
  EyeIcon,
  BrainIcon,
  DownloadIcon,
  TrashIcon,
  RefreshCwIcon,
  SparklesIcon,
  GamepadIcon,
  MonitorIcon,
  TargetIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from "lucide-react"

interface AnalysisResult {
  id: string
  imageUrl: string
  analysis: string
  analysisType: string
  timestamp: string
  gameContext: string
  isFallback?: boolean
}

const ANALYSIS_TYPES = [
  { value: "comprehensive", label: "Comprehensive Analysis", icon: EyeIcon },
  { value: "gaming-screenshot", label: "Gaming Screenshot", icon: GamepadIcon },
  { value: "hardware-setup", label: "Hardware Setup", icon: MonitorIcon },
  { value: "strategy-analysis", label: "Strategy Analysis", icon: TargetIcon },
  { value: "ui-analysis", label: "UI/Settings Analysis", icon: SparklesIcon },
]

const SAMPLE_ANALYSES = [
  {
    id: "sample-1",
    imageUrl: "/placeholder.svg?height=200&width=300",
    analysis: `**Overview**: Gaming setup with dual monitor configuration and RGB lighting.

**Key Elements**: 
- Dual 27" monitors (likely 1440p resolution)
- Mechanical keyboard with RGB backlighting
- Gaming mouse with side buttons
- Professional microphone setup
- LED strip lighting behind monitors

**Technical Analysis**:
- Monitor positioning appears optimal for competitive gaming
- Keyboard placement suggests good ergonomics
- Cable management could be improved
- Lighting setup reduces eye strain during long sessions

**Gaming Insights**:
- Setup optimized for FPS games like Valorant/CS2
- Dual monitor configuration allows for game + Discord/streaming
- Professional microphone suggests team communication focus

**Recommendations**:
- Consider monitor arm for better positioning
- Add mousepad with consistent surface
- Implement better cable management
- Adjust monitor height for neck comfort

**Additional Notes**: Overall solid gaming setup with room for ergonomic improvements.`,
    analysisType: "hardware-setup",
    timestamp: "2024-01-15T10:30:00Z",
    gameContext: "valorant",
  },
  {
    id: "sample-2",
    imageUrl: "/placeholder.svg?height=200&width=300",
    analysis: `**Overview**: Valorant gameplay screenshot showing post-round statistics and scoreboard.

**Key Elements**:
- Match score: 13-11 (close competitive match)
- Player performance: 24/18/7 K/D/A ratio
- Agent: Jett (Duelist role)
- Map: Ascent
- Round economy visible

**Technical Analysis**:
- Above-average K/D ratio (1.33)
- Good assist count indicating team play
- Economy management appears solid
- Crosshair placement visible in screenshot

**Gaming Insights**:
- Strong individual performance in close match
- Duelist role played effectively with high frags
- Team coordination evident from assist numbers
- Map control seems balanced based on round score

**Recommendations**:
- Continue aggressive duelist playstyle
- Focus on reducing deaths while maintaining frags
- Work on clutch situations (close match suggests tight rounds)
- Consider reviewing positioning for better survival

**Additional Notes**: Excellent performance in competitive environment. Focus on consistency.`,
    analysisType: "gaming-screenshot",
    timestamp: "2024-01-15T09:15:00Z",
    gameContext: "valorant",
  },
]

export default function PhotoAnalysis() {
  const { selectedGame } = useGameStats()
  const [analyses, setAnalyses] = useState<AnalysisResult[]>(SAMPLE_ANALYSES)
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisType, setAnalysisType] = useState("comprehensive")
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<"unknown" | "available" | "unavailable">("unknown")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    // Reset error state
    setError(null)

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, etc.)")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setIsAnalyzing(true)

    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageData = e.target?.result as string

        try {
          const response = await fetch("/api/analyze-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageData,
              analysisType,
              gameContext: selectedGame,
            }),
          })

          const result = await response.json()

          if (result.success) {
            const newAnalysis: AnalysisResult = {
              id: Date.now().toString(),
              imageUrl: imageData,
              analysis: result.analysis,
              analysisType,
              timestamp: result.timestamp,
              gameContext: selectedGame,
              isFallback: result.isFallback,
            }

            setAnalyses((prev) => [newAnalysis, ...prev])
            setSelectedAnalysis(newAnalysis)
            setApiStatus("available")
          } else if (result.fallbackAnalysis) {
            // Use fallback analysis if provided
            const newAnalysis: AnalysisResult = {
              id: Date.now().toString(),
              imageUrl: imageData,
              analysis: result.fallbackAnalysis,
              analysisType,
              timestamp: result.timestamp || new Date().toISOString(),
              gameContext: selectedGame,
              isFallback: true,
            }

            setAnalyses((prev) => [newAnalysis, ...prev])
            setSelectedAnalysis(newAnalysis)
            setApiStatus("unavailable")
            setError(`Using fallback analysis: ${result.error}. ${result.details || ""}`)
          } else {
            throw new Error(result.details || result.error || "Analysis failed")
          }
        } catch (error) {
          console.error("Analysis error:", error)
          setError(`Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`)
          setApiStatus("unavailable")
        }
      }

      reader.onerror = () => {
        setError("Failed to read image file")
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error("File processing error:", error)
      setError(`File processing error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const deleteAnalysis = (id: string) => {
    setAnalyses((prev) => prev.filter((analysis) => analysis.id !== id))
    if (selectedAnalysis?.id === id) {
      setSelectedAnalysis(null)
    }
  }

  const downloadAnalysis = (analysis: AnalysisResult) => {
    const content = `Photo Analysis Report
Generated: ${new Date(analysis.timestamp).toLocaleString()}
Analysis Type: ${analysis.analysisType}
Game Context: ${analysis.gameContext}
${analysis.isFallback ? "[FALLBACK ANALYSIS - AI Vision unavailable]\n" : ""}

${analysis.analysis}
`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analysis-${analysis.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">AI Photo Analysis</h2>
        <div className="flex space-x-2">
          <Badge
            variant="outline"
            className={`border-green-400 ${
              apiStatus === "available"
                ? "text-green-300 border-green-400"
                : apiStatus === "unavailable"
                  ? "text-amber-300 border-amber-400"
                  : "text-green-300"
            }`}
          >
            {apiStatus === "available" ? (
              <CheckCircleIcon className="h-3 w-3 mr-1" />
            ) : apiStatus === "unavailable" ? (
              <AlertTriangleIcon className="h-3 w-3 mr-1" />
            ) : (
              <BrainIcon className="h-3 w-3 mr-1" />
            )}
            {apiStatus === "available"
              ? "Gemini Vision Connected"
              : apiStatus === "unavailable"
                ? "Using Fallback Mode"
                : "Gemini Vision AI"}
          </Badge>
          <Badge variant="outline" className="border-blue-400 text-blue-300">
            <EyeIcon className="h-3 w-3 mr-1" />
            Computer Vision
          </Badge>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-200">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="lg:col-span-1 bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CameraIcon className="h-5 w-5 mr-2 text-green-400" />
              Upload & Analyze
            </CardTitle>
            <CardDescription className="text-white/60">
              Upload images for AI-powered analysis and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Analysis Type Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Analysis Type</label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger className="bg-black/20 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  {ANALYSIS_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-white hover:bg-white/10">
                      <div className="flex items-center space-x-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-green-400 bg-green-500/10"
                  : "border-white/20 hover:border-white/40 hover:bg-white/5"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <UploadIcon className="h-12 w-12 text-white/40" />
                </div>
                <div>
                  <p className="text-white/80 font-medium">Drop your image here</p>
                  <p className="text-white/60 text-sm">or click to browse</p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Select Image
                    </>
                  )}
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-300 font-medium mb-2">📸 Supported Images:</h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Gaming screenshots</li>
                <li>• Hardware setups</li>
                <li>• Strategy diagrams</li>
                <li>• UI/Settings screens</li>
                <li>• General photos</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card className="lg:col-span-2 bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BrainIcon className="h-5 w-5 mr-2 text-green-400" />
              Analysis Results
            </CardTitle>
            <CardDescription className="text-white/60">
              AI-powered insights and detailed analysis of your images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="current" className="space-y-4">
              <TabsList className="bg-black/20 backdrop-blur-sm">
                <TabsTrigger value="current">Current Analysis</TabsTrigger>
                <TabsTrigger value="history">Analysis History</TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="space-y-4">
                {selectedAnalysis ? (
                  <div className="space-y-4">
                    {/* Image Preview */}
                    <div className="relative">
                      <img
                        src={selectedAnalysis.imageUrl || "/placeholder.svg"}
                        alt="Analyzed image"
                        className="w-full max-h-64 object-contain rounded-lg border border-white/10"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadAnalysis(selectedAnalysis)}
                          className="bg-black/50 hover:bg-black/70"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteAnalysis(selectedAnalysis.id)}
                          className="bg-black/50 hover:bg-black/70 text-red-300"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Analysis Details */}
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <span>Type: {selectedAnalysis.analysisType}</span>
                      <span>•</span>
                      <span>Game: {selectedAnalysis.gameContext}</span>
                      <span>•</span>
                      <span>{new Date(selectedAnalysis.timestamp).toLocaleString()}</span>
                      {selectedAnalysis.isFallback && (
                        <>
                          <span>•</span>
                          <Badge variant="outline" className="border-amber-400 text-amber-300">
                            Fallback Analysis
                          </Badge>
                        </>
                      )}
                    </div>

                    {/* Analysis Content */}
                    <ScrollArea className="h-96 w-full rounded-md border border-white/10 p-4 bg-black/10">
                      <div className="prose prose-invert max-w-none">
                        <div className="text-white/90 whitespace-pre-wrap leading-relaxed">
                          {selectedAnalysis.analysis}
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <EyeIcon className="h-16 w-16 text-white/20 mx-auto mb-4" />
                    <h3 className="text-white/60 text-lg font-medium mb-2">No Analysis Selected</h3>
                    <p className="text-white/40">Upload an image to get started with AI analysis</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <ScrollArea className="h-96 w-full">
                  <div className="space-y-3">
                    {analyses.map((analysis) => (
                      <Card
                        key={analysis.id}
                        className={`bg-black/10 border-white/10 cursor-pointer transition-colors hover:bg-white/5 ${
                          selectedAnalysis?.id === analysis.id ? "border-green-500/50 bg-green-500/10" : ""
                        }`}
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={analysis.imageUrl || "/placeholder.svg"}
                              alt="Analysis thumbnail"
                              className="w-16 h-16 object-cover rounded border border-white/10"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {analysis.analysisType}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {analysis.gameContext}
                                </Badge>
                                {analysis.isFallback && (
                                  <Badge variant="outline" className="text-xs border-amber-400 text-amber-300">
                                    Fallback
                                  </Badge>
                                )}
                              </div>
                              <p className="text-white/80 text-sm truncate">
                                {analysis.analysis.split("\n")[0].replace(/\*\*/g, "")}
                              </p>
                              <p className="text-white/40 text-xs">{new Date(analysis.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  downloadAnalysis(analysis)
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteAnalysis(analysis.id)
                                }}
                                className="h-8 w-8 p-0 text-red-300 hover:text-red-200"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ANALYSIS_TYPES.map((type) => (
          <Card key={type.value} className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <type.icon className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h4 className="text-white font-medium text-sm">{type.label}</h4>
              <p className="text-white/60 text-xs mt-1">
                {type.value === "comprehensive"
                  ? "Complete analysis of any image"
                  : type.value === "gaming-screenshot"
                    ? "Analyze gameplay and performance"
                    : type.value === "hardware-setup"
                      ? "Evaluate gaming equipment"
                      : type.value === "strategy-analysis"
                        ? "Tactical and strategic insights"
                        : "UI elements and settings review"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
