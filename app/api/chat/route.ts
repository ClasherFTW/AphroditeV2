import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { streamText } from "ai"

// Initialize Gemini AI client with secure API key handling
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
})

export async function POST(req: Request) {
  try {
    // Validate API key
    const apiKey = process.env.GOOGLE_API_KEY
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

    // Enhanced system prompt for comprehensive AI assistance
    const systemPrompt = `You are CoachGPT, an advanced AI assistant powered by Google Gemini. You are an expert in multiple domains:

GAMING EXPERTISE:
- Valorant, CS:GO/CS2, League of Legends, Overwatch strategies
- Aim training, crosshair placement, positioning
- Agent/character selection and abilities
- Map strategies and callouts
- Economy management and buy rounds
- Team coordination and communication
- Mental game and tilt management
- Hardware optimization and settings

GENERAL KNOWLEDGE:
- Science, technology, mathematics, physics
- History, literature, philosophy
- Current events and world affairs
- Programming and software development
- Business and economics
- Health and fitness
- Arts and culture

TECHNICAL EXPERTISE:
- Computer science and programming
- Machine learning and AI
- Web development and frameworks
- Database design and optimization
- Cloud computing and DevOps
- Cybersecurity best practices
- Hardware and system administration

CURRENT CONTEXT: ${gameContext || "General assistance"}

RESPONSE GUIDELINES:
- Provide accurate, helpful, and detailed information
- Use clear explanations with examples when appropriate
- For gaming questions: Include specific tips, strategies, and actionable advice
- For technical questions: Provide step-by-step guidance and best practices
- For general knowledge: Give comprehensive yet accessible explanations
- Maintain an encouraging, professional tone
- Cite sources when discussing factual information
- Ask clarifying questions if the request is ambiguous

Always strive to be helpful, accurate, and educational in your responses.`

    console.log("🤖 Attempting Gemini API call...")

    try {
      const result = await streamText({
        model: google("gemini-1.5-flash"),
        system: systemPrompt,
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        maxTokens: 2000,
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
