import { GoogleGenerativeAI } from "@google/generative-ai"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export interface CodeAnalysis {
  timeComplexity: string
  spaceComplexity: string
  optimizations: string[]
  alternatives: string[]
  bestPractices: string[]
  bugs: string[]
  overall: string
}

export class GeminiAnalyzer {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null

  async initialize() {
    const apiKey = await storage.get("gemini_api_key")
    if (!apiKey) {
      throw new Error(
        "⚠️ API key not found! Please open the extension popup and add your Gemini API key first."
      )
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp"
      })
    } catch (error) {
      console.error("Failed to initialize Gemini:", error)
      throw new Error(
        "❌ Failed to initialize AI. Please check your API key in the extension popup."
      )
    }
  }

  async analyzeCode(
    code: string,
    language: string,
    context?: string
  ): Promise<CodeAnalysis> {
    if (!this.model) {
      await this.initialize()
    }

    const prompt = `You are an expert code reviewer. Analyze the following ${language} code and provide a detailed review.

${context ? `Context: ${context}\n\n` : ""}Code:
\`\`\`${language}
${code}
\`\`\`

Provide your analysis in the following JSON format (respond ONLY with valid JSON):
{
    only tell time and space complexity in big O notation with brief explanation if its a leetcode problem not on github
  "timeComplexity": "O(?) - brief explanation",
  "spaceComplexity": "O(?) - brief explanation",
  "optimizations": ["specific optimization 1", "specific optimization 2"],
  "alternatives": ["alternative approach 1 with complexity", "alternative approach 2 with complexity"],
  "bestPractices": ["best practice suggestion 1", "best practice suggestion 2"],
  "bugs": ["potential bug or edge case 1", "potential bug or edge case 2"],
  "overall": "2-3 sentence summary of code quality and main recommendations"
}

Be specific and actionable. Focus on real improvements, not generic advice.`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Extract JSON from markdown code blocks if present
      const jsonMatch =
        text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text

      return JSON.parse(jsonText.trim())
    } catch (error: any) {
      console.error("Gemini API error:", error)

      // Provide more specific error messages
      if (error.message?.includes("API_KEY_INVALID")) {
        throw new Error(
          "❌ Invalid API key! Please check your Gemini API key in the extension popup."
        )
      }

      if (error.message?.includes("429") || error.message?.includes("quota")) {
        throw new Error(
          "⏰ API quota exceeded! Please wait a moment or check your Gemini API quota."
        )
      }

      if (
        error.message?.includes("network") ||
        error.message?.includes("fetch")
      ) {
        throw new Error(
          "🌐 Network error! Please check your internet connection and try again."
        )
      }

      if (error instanceof SyntaxError) {
        throw new Error("⚠️ Failed to parse AI response. Please try again.")
      }

      throw new Error(
        `❌ Analysis failed: ${error.message || "Unknown error. Please try again or check your API key."}`
      )
    }
  }

  async suggestFix(
    code: string,
    issue: string,
    language: string
  ): Promise<string> {
    if (!this.model) {
      await this.initialize()
    }

    const prompt = `Given this ${language} code with the issue: "${issue}"

\`\`\`${language}
${code}
\`\`\`

Provide a fixed version of the code with comments explaining the changes. Return only the code.`

    const result = await this.model.generateContent(prompt)
    const response = await result.response
    return response.text()
  }
}
