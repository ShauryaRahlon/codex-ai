import { Code } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"

import { ReviewPanel } from "../components/ReviewPanel"
import { DOMScraper } from "../lib/dom-scraper"
import { GeminiAnalyzer, type CodeAnalysis } from "../lib/gemini"

export const config: PlasmoCSConfig = {
  matches: ["https://github.com/*/*/pull/*"],
  css: ["style.css"]
}

const GithubReview = () => {
  const [showPanel, setShowPanel] = useState(false)
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [buttonVisible, setButtonVisible] = useState(false)

  useEffect(() => {
    // Wait for GitHub to load the PR content
    const observer = new MutationObserver(() => {
      const codeExists = document.querySelector(".blob-code-inner")
      if (codeExists && !buttonVisible) {
        setButtonVisible(true)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [buttonVisible])

  const analyzeCode = async () => {
    setShowPanel(true)
    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const scrapedData = DOMScraper.scrapeGitHubPR()

      if (scrapedData.length === 0) {
        throw new Error(
          "📝 No code found! Make sure you're on a GitHub PR page with code changes."
        )
      }

      if (!scrapedData[0].code || scrapedData[0].code.trim().length < 10) {
        throw new Error(
          "📝 Code is too short or empty! The PR might not have enough code to analyze."
        )
      }

      // Analyze the first file (or you can analyze all)
      const firstFile = scrapedData[0]
      const analyzer = new GeminiAnalyzer()
      const result = await analyzer.analyzeCode(
        firstFile.code,
        firstFile.language,
        firstFile.context
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
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 z-[9998] flex items-center gap-3 group hover:scale-105 border border-white/10"
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "14px 20px"
        }}>
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <Code className="w-5 h-5" />
        </div>
        <span className="font-semibold text-sm">Review Code</span>
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

export default GithubReview
