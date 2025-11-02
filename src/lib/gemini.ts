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
        "Gemini API key not found. Please set it in the extension popup."
      )
    }
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp"
    })
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
    } catch (error) {
      console.error("Gemini API error:", error)
      throw new Error(
        "Failed to analyze code. Check your API key and try again."
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
