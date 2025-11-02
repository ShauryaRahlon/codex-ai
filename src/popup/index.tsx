import {
  AlertCircle,
  CheckCircle,
  Code,
  Eye,
  EyeOff,
  Save,
  Sparkles
} from "lucide-react"
import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

function IndexPopup() {
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
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

  if (loading) {
    return (
      <div className="w-[420px] h-[600px] bg-gradient-to-b from-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-sm text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[420px] h-[600px] bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 pb-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Code className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">Codex-AI</h1>
            <p className="text-sm text-white/80">AI-Powered Code Review</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5 -mt-4">
        {/* API Key Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <label className="text-sm font-semibold text-white">
              Gemini API Key
            </label>
          </div>

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
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 pr-12 text-sm text-white placeholder-white/30 transition-all duration-200"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
              {showKey ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {error && (
            <div className="mt-3 text-xs text-red-400 flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saved && (
            <div className="mt-3 text-xs text-emerald-400 flex items-center gap-2 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>API key saved successfully!</span>
            </div>
          )}

          <button
            onClick={saveApiKey}
            className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-medium text-sm shadow-lg shadow-indigo-500/25">
            <Save className="w-4 h-4" />
            Save API Key
          </button>
        </div>

        {/* Get API Key Card */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-5 border border-indigo-500/20">
          <h3 className="font-semibold text-indigo-300 text-sm mb-3">
            Get Your API Key
          </h3>
          <ol className="text-xs text-white/70 space-y-2 list-decimal list-inside">
            <li>
              Visit{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                className="text-indigo-400 hover:text-indigo-300 underline">
                Google AI Studio
              </a>
            </li>
            <li>Sign in with your Google account</li>
            <li>Click "Create API Key"</li>
            <li>Copy and paste it above</li>
          </ol>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10">
            <div className="text-lg mb-1">⚡</div>
            <div className="text-xs font-medium text-white/90">
              Instant Analysis
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10">
            <div className="text-lg mb-1">🎯</div>
            <div className="text-xs font-medium text-white/90">
              Bug Detection
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10">
            <div className="text-lg mb-1">🚀</div>
            <div className="text-xs font-medium text-white/90">
              Optimizations
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10">
            <div className="text-lg mb-1">💡</div>
            <div className="text-xs font-medium text-white/90">
              Best Practices
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
          <h3 className="font-semibold text-white text-sm mb-3">How to Use</h3>
          <p className="text-xs text-white/70 leading-relaxed">
            Navigate to any GitHub Pull Request or LeetCode problem. Click the{" "}
            <span className="text-indigo-400 font-medium">"Review Code"</span>{" "}
            button to get instant AI-powered analysis.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center border-t border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <p className="text-xs text-white/40">
          Made with ❤️ by developers, for developers
        </p>
      </div>
    </div>
  )
}

export default IndexPopup
