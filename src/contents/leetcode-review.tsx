import { Code } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { ReviewPanel } from "../components/ReviewPanel"
import { DOMScraper } from "../lib/dom-scraper"
import { GeminiAnalyzer, type CodeAnalysis } from "../lib/gemini"

export const config: PlasmoCSConfig = {
  matches: ["https://leetcode.com/problems/*"],
  css: ["style.css"]
}

const LeetCodeReview = () => {
  const [showPanel, setShowPanel] = useState(false)
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [buttonVisible, setButtonVisible] = useState(false)

  useEffect(() => {
    // Wait for LeetCode editor to load
    const checkEditor = setInterval(() => {
      const editor = document.querySelector(".view-lines, [data-mode-id]")
      if (editor && !buttonVisible) {
        setButtonVisible(true)
        clearInterval(checkEditor)
      }
    }, 1000)

    return () => clearInterval(checkEditor)
  }, [buttonVisible])

  const analyzeCode = async () => {
    setShowPanel(true)
    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const scrapedData = DOMScraper.scrapeLeetCode()

      if (!scrapedData) {
        throw new Error(
          "📝 No code found! Make sure you have code in the LeetCode editor."
        )
      }

      if (!scrapedData.code || scrapedData.code.trim().length < 10) {
        throw new Error(
          "📝 Code is too short or empty! Please write some code in the editor first."
        )
      }

      const analyzer = new GeminiAnalyzer()
      const result = await analyzer.analyzeCode(
        scrapedData.code,
        scrapedData.language,
        scrapedData.context
      )

      setAnalysis(result)
    } catch (err: any) {
      console.error("Analysis error:", err)
      setError(err.message || "❌ Failed to analyze code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!buttonVisible) return null

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={analyzeCode}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all z-[9999] flex items-center gap-2 group"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <Code className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          Review Codes
        </span>
      </button>

      {/* Review Panel */}
      {showPanel && (
        <ReviewPanel
          analysis={analysis}
          loading={loading}
          error={error}
          onClose={() => setShowPanel(false)}
        />
      )}
    </>
  )
}

export default LeetCodeReview
