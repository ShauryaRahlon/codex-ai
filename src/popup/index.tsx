import {
  AlertCircle,
  Check,
  CheckCircle,
  Code,
  Copy,
  Eye,
  EyeOff,
  Save
} from "lucide-react"
import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

function IndexPopup() {
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApiKey()
  }, [])

  const loadApiKey = async () => {
    try {
      const key = await storage.get("gemini_api_key")
      if (key) {
        setApiKey(key)
        setSaved(true)
      }
    } catch (err) {
      console.error("Error loading API key:", err)
    } finally {
      setLoading(false)
    }
  }

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      setError("API key cannot be empty")
      return
    }

    if (!apiKey.startsWith("AIza")) {
      setError("Invalid Gemini API key format")
      return
    }

    try {
      await storage.set("gemini_api_key", apiKey.trim())
      setSaved(true)
      setError("")
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError("Failed to save API key")
    }
  }

  const copyKey = async () => {
    if (!apiKey) return
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.warn("Copy failed", e)
    }
  }

  if (loading) {
    return (
      <div className="w-96 p-6 bg-gray-900 text-white rounded-2xl shadow-lg">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-96 text-slate-100">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-white/6 to-white/3 backdrop-blur-sm shadow-2xl border border-white/6">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-purple-600/90 to-blue-500/90">
          <div className="p-2 bg-white/10 rounded-xl">
            <Code className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white">
              Code Review Ninja
            </h1>
            <p className="text-xs text-white/80">
              AI-powered code reviews in your browser
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-white/80">Gemini API Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value)
                  setError("")
                  setSaved(false)
                }}
                placeholder="AIza..."
                className="w-full px-3 py-2 rounded-xl bg-white/6 border border-white/8 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={() => setShowKey(!showKey)}
                  title={showKey ? "Hide key" : "Show key"}
                  className="p-1 text-white/80 hover:text-white">
                  {showKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={copyKey}
                  title="Copy key"
                  className="p-1 text-white/80 hover:text-white">
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-2 text-sm text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            {saved && (
              <div className="mt-2 text-sm text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>API key saved</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveApiKey}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 py-2 text-white shadow">
              <Save className="w-4 h-4" />
              <span className="text-sm font-medium">Save</span>
            </button>

            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-sm text-white/90 hover:bg-white/10">
              <span>Get Key</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/4">
              <h4 className="text-xs font-semibold text-white/90">Features</h4>
              <ul className="text-xs text-white/70 mt-2 space-y-1">
                <li>• Complexity analysis</li>
                <li>• Optimization suggestions</li>
                <li>• Best-practices & bug detection</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-white/4">
              <h4 className="text-xs font-semibold text-white/90">Usage</h4>
              <p className="text-xs text-white/70 mt-2">
                Open a GitHub PR or LeetCode problem and click the review
                button.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
