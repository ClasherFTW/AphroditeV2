import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"

// Initialize Gemini AI client
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
})

export async function POST(req: Request) {
  try {
    // Validate API key
    if (!process.env.GOOGLE_API_KEY) {
      return Response.json(
        {
          success: false,
          error: "API key not configured",
          details: "GOOGLE_API_KEY is not configured in environment variables",
        },
        { status: 500 },
      )
    }

    const { imageData, analysisType, gameContext } = await req.json()

    // Validate image data
    if (!imageData || typeof imageData !== "string") {
      return Response.json(
        {
          success: false,
          error: "Invalid image data",
          details: "Image data must be a valid base64 string",
        },
        { status: 400 },
      )
    }

    // Enhanced system prompt for image analysis
    const systemPrompt = `You are an expert gaming analyst with advanced computer vision capabilities. Analyze the provided image and provide detailed insights based on the analysis type requested.

ANALYSIS CAPABILITIES:
- Gaming Screenshots: Analyze gameplay, UI elements, performance metrics, settings
- Hardware Setup: Evaluate gaming setups, peripherals, ergonomics
- General Images: Object recognition, scene description, contextual analysis
- Strategy Analysis: Map positions, team formations, tactical elements

CURRENT CONTEXT: ${gameContext || "General analysis"}
ANALYSIS TYPE: ${analysisType || "comprehensive"}

RESPONSE FORMAT:
Provide a detailed analysis in the following structure:
1. **Overview**: Brief description of what you see
2. **Key Elements**: Important objects, people, or features identified
3. **Technical Analysis**: Detailed breakdown of relevant technical aspects
4. **Gaming Insights**: If applicable, provide gaming-related observations
5. **Recommendations**: Actionable suggestions based on the analysis
6. **Additional Notes**: Any other relevant observations

Be thorough, accurate, and provide actionable insights where possible.`

    try {
      // Process the image data - ensure it's properly formatted
      let processedImageData = imageData
      if (imageData.includes("base64,")) {
        processedImageData = imageData.split("base64,")[1]
      }

      const result = await generateText({
        model: google("gemini-1.5-pro-vision"),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this image with focus on: ${analysisType}. Provide comprehensive insights and recommendations.`,
              },
              {
                type: "image",
                image: processedImageData,
              },
            ],
          },
        ],
        system: systemPrompt,
        maxTokens: 1500,
        temperature: 0.3,
      })

      return Response.json({
        success: true,
        analysis: result.text,
        timestamp: new Date().toISOString(),
      })
    } catch (aiError) {
      console.error("❌ Gemini Vision Error:", aiError)

      // Return a more detailed error message with fallback
      return Response.json(
        {
          success: false,
          error: "Gemini Vision Error",
          details: aiError instanceof Error ? aiError.message : "Unknown AI error",
          fallbackAnalysis: generateFallbackAnalysis(analysisType, gameContext),
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Image Analysis API Error:", error)
    return Response.json(
      {
        success: false,
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Fallback analysis generator for when the API is unavailable
function generateFallbackAnalysis(analysisType: string, gameContext: string): string {
  const templates = {
    comprehensive: `**Overview**: This appears to be a ${gameContext || "gaming"}-related image.

**Key Elements**: 
- Various gaming elements visible
- User interface components
- Possible gameplay scenario

**Technical Analysis**:
- Image quality is sufficient for analysis
- Contains elements typical for ${gameContext || "gaming"} content
- Layout suggests standard gaming interface

**Gaming Insights**:
- Appears to be from ${gameContext || "a popular game"}
- Contains elements relevant to gameplay
- Shows typical gaming scenario

**Recommendations**:
- Consider optimizing your settings for better visibility
- Focus on key elements in the interface
- Pay attention to positioning and timing

**Additional Notes**: This is a fallback analysis as the AI vision service is currently unavailable. For more detailed analysis, please try again later.`,

    "gaming-screenshot": `**Overview**: This appears to be a screenshot from ${gameContext || "a game"}.

**Key Elements**: 
- Game interface elements
- Player character or viewpoint
- HUD elements including health/ammo/score
- Possible in-game action

**Technical Analysis**:
- UI layout typical for ${gameContext || "this type of game"}
- Game settings appear to be at medium-high quality
- Resolution seems adequate for gameplay

**Gaming Insights**:
- Game state shows typical ${gameContext || "gameplay"} scenario
- Interface elements suggest standard configuration
- Player position appears to be strategically sound

**Recommendations**:
- Consider adjusting HUD elements for better visibility
- Optimize crosshair placement for faster target acquisition
- Review minimap more frequently for better awareness

**Additional Notes**: This is a fallback analysis as the AI vision service is currently unavailable. For more detailed analysis, please try again later.`,

    "hardware-setup": `**Overview**: This appears to be a gaming hardware setup.

**Key Elements**: 
- Computer/gaming equipment
- Peripheral devices
- Desk/gaming station layout
- Lighting elements

**Technical Analysis**:
- Setup appears to be designed for ${gameContext || "gaming"} purposes
- Equipment positioning suggests standard gaming configuration
- Ergonomics could potentially be improved

**Gaming Insights**:
- Setup is suitable for ${gameContext || "competitive gaming"}
- Equipment placement allows for standard gameplay
- Lighting conditions appear adequate

**Recommendations**:
- Consider ergonomic adjustments for longer gaming sessions
- Optimize cable management for cleaner setup
- Adjust monitor height to eye level for better posture
- Consider proper lighting to reduce eye strain

**Additional Notes**: This is a fallback analysis as the AI vision service is currently unavailable. For more detailed analysis, please try again later.`,

    "strategy-analysis": `**Overview**: This appears to be a strategic scenario in ${gameContext || "a game"}.

**Key Elements**: 
- Player positioning
- Map layout elements
- Team formation (if applicable)
- Objective indicators

**Technical Analysis**:
- Positioning suggests standard approach to the scenario
- Map control elements visible in key areas
- Strategic elements typical for ${gameContext || "this type of gameplay"}

**Gaming Insights**:
- Strategy appears to follow conventional ${gameContext || "gaming"} approaches
- Position offers standard advantages/disadvantages
- Team coordination (if visible) shows typical patterns

**Recommendations**:
- Consider alternative positioning for better map control
- Maintain awareness of common enemy approaches
- Utilize utility more effectively for area denial
- Coordinate timing with team objectives

**Additional Notes**: This is a fallback analysis as the AI vision service is currently unavailable. For more detailed analysis, please try again later.`,

    "ui-analysis": `**Overview**: This appears to be a user interface from ${gameContext || "a game"}.

**Key Elements**: 
- Menu elements and navigation
- Settings configurations
- Visual indicators and feedback
- Information display components

**Technical Analysis**:
- UI layout follows standard ${gameContext || "gaming"} conventions
- Settings appear to be configured for typical gameplay
- Visual elements are arranged in expected patterns

**Gaming Insights**:
- Interface configuration is suitable for standard gameplay
- Settings align with typical ${gameContext || "gaming"} preferences
- Information display provides necessary feedback

**Recommendations**:
- Consider adjusting HUD scale for better visibility
- Optimize color settings for better target identification
- Customize keybindings for more efficient actions
- Simplify interface elements to reduce visual clutter

**Additional Notes**: This is a fallback analysis as the AI vision service is currently unavailable. For more detailed analysis, please try again later.`,
  }

  return templates[analysisType as keyof typeof templates] || templates.comprehensive
}
