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
          "No code found to analyze. Make sure you're on a PR with code changes."
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
      setError(err.message || "Failed to analyze code")
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
          Review Code
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

export default GithubReview
