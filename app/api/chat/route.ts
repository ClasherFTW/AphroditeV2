import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { streamText } from "ai"

// Initialize Gemini AI client
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "AIzaSyCxRrjyiQHmoxsjiJyuDtHfdljM8LsjXsY",
})

export async function POST(req: Request) {
  try {
    // Validate API key
    const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyCxRrjyiQHmoxsjiJyuDtHfdljM8LsjXsY"
    if (!apiKey) {
      console.error("❌ GOOGLE_API_KEY is not configured")
      return new Response(
        JSON.stringify({
          error: "API key not configured",
          details: "GOOGLE_API_KEY environment variable is missing",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const { messages, gameContext } = await req.json()

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: "Invalid request",
          details: "Messages array is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Enhanced system prompt for gaming expertise
    const systemPrompt = `You are CoachGPT, an expert gaming coach specializing in Valorant and CS:GO/CS2. You provide detailed, actionable advice to help players improve their gameplay.

EXPERTISE AREAS:
- Aim training and crosshair placement
- Agent/character selection and abilities
- Map strategies and positioning
- Economy management and buy rounds
- Team coordination and communication
- Mental game and tilt management
- Hardware optimization and settings

CURRENT GAME CONTEXT: ${gameContext || "General gaming advice"}

RESPONSE STYLE:
- Be encouraging and supportive
- Provide specific, actionable tips
- Use gaming terminology appropriately
- Include step-by-step instructions when helpful
- Reference specific maps, agents, or weapons when relevant
- Keep responses concise but comprehensive

Always maintain a positive, coaching tone and focus on improvement strategies.`

    console.log("🤖 Attempting Gemini API call...")

    try {
      const result = await streamText({
        model: google("gemini-1.5-flash"), // Using flash model for better reliability
        system: systemPrompt,
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        maxTokens: 1000,
        temperature: 0.7,
      })

      console.log("✅ Gemini API call successful")
      return result.toDataStreamResponse()
    } catch (aiError: any) {
      console.error("❌ Gemini API Error:", aiError)

      // Return a more detailed error response
      return new Response(
        JSON.stringify({
          error: "Gemini API Error",
          details: aiError?.message || "Unknown AI error",
          fallback: true,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }
  } catch (error: any) {
    console.error("❌ Chat API Error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error?.message || "Unknown error",
        fallback: true,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
