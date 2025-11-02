import {
  AlertCircle,
  CheckCircle2,
  Code,
  Lightbulb,
  Loader2,
  Maximize2,
  Minimize2,
  TrendingUp,
  X
} from "lucide-react"
import React, { useState } from "react"

import type { CodeAnalysis } from "../lib/gemini"

interface ReviewPanelProps {
  analysis: CodeAnalysis | null
  loading: boolean
  error: string | null
  onClose: () => void
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  analysis,
  loading,
  error,
  onClose
}) => {
  const [expanded, setExpanded] = useState<string[]>(["overall"])
  const [minimized, setMinimized] = useState(false)

  const toggleSection = (section: string) => {
    setExpanded((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  const Section = ({
    title,
    icon: Icon,
    items,
    color,
    id
  }: {
    title: string
    icon: any
    items: string[]
    color: string
    id: string
  }) => {
    const isExpanded = expanded.includes(id)
    const hasItems = items.length > 0

    return (
      <div className="relative group">
        <div
          className={`absolute -inset-0.5 ${color.replace("text-", "bg-")}/0 group-hover:${color.replace("text-", "bg-")}/10 rounded-2xl blur-lg transition-all duration-500`}></div>
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-lg">
          <button
            onClick={() => hasItems && toggleSection(id)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-all duration-200 group/btn"
            disabled={!hasItems}>
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl ${color.replace("text-", "bg-")}/20 flex items-center justify-center shadow-lg`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-left">
                <span className="font-bold text-white text-sm block">
                  {title}
                </span>
                <span className="text-xs text-white/50 font-medium">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>
            </div>
            {hasItems && (
              <div
                className={`text-white/50 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </button>

          {isExpanded && hasItems && (
            <div className="px-5 pb-4 space-y-3 animate-slideDown">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="text-sm text-white/80 bg-black/20 p-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-black/30 transition-all duration-200 leading-relaxed">
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (minimized) {
    return (
      <div
        className="fixed bottom-8 right-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full shadow-2xl z-[99999] cursor-pointer hover:scale-110 transition-all duration-300 group"
        onClick={() => setMinimized(false)}
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <Code className="w-7 h-7 text-white drop-shadow-lg" />
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed top-6 right-6 w-[480px] max-h-[calc(100vh-3rem)] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-[99999] border-2 border-white/20 backdrop-blur-2xl"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-600/40 backdrop-blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>

        <div className="relative px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                  <Code className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              </div>
              <div>
                <h3 className="font-black text-white text-lg tracking-tight">
                  CodeHawk
                </h3>
                <p className="text-xs text-blue-300/90 font-semibold">
                  AI Code Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMinimized(true)}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all duration-200 hover:scale-110">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all duration-200 hover:scale-110">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
              <div
                className="absolute inset-2 w-12 h-12 border-4 border-transparent border-b-pink-500 border-l-cyan-500 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s"
                }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Code className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>
            </div>
            <span className="mt-6 text-white/80 text-base font-bold">
              Analyzing your code...
            </span>
            <span className="mt-2 text-white/50 text-sm">
              This may take a few seconds
            </span>
          </div>
        )}

        {error && (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl opacity-30 blur-lg"></div>
            <div className="relative bg-red-500/20 border-2 border-red-500/40 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-500/30 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <AlertCircle className="w-5 h-5 text-red-300" />
                </div>
                <div>
                  <span className="font-bold text-red-300 text-base block mb-2">
                    Analysis Failed
                  </span>
                  <p className="text-sm text-red-200/80 leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {analysis && !loading && !error && (
          <div className="space-y-5">
            {/* Overall Summary */}
            {analysis.overall && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-40 blur-lg transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/20 to-teal-500/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/30 shadow-xl">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-base mb-1">
                        Overall Assessment
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed pl-14">
                    {analysis.overall}
                  </p>
                </div>
              </div>
            )}

            {/* Complexity Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 blur-lg transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl p-5 rounded-2xl border border-purple-400/30 shadow-lg">
                  <div className="text-xs font-bold text-purple-300 mb-2 tracking-wide">
                    TIME COMPLEXITY
                  </div>
                  <div className="text-lg text-white font-bold font-mono">
                    {analysis.timeComplexity}
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-40 blur-lg transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-500/20 to-cyan-500/10 backdrop-blur-xl p-5 rounded-2xl border border-blue-400/30 shadow-lg">
                  <div className="text-xs font-bold text-blue-300 mb-2 tracking-wide">
                    SPACE COMPLEXITY
                  </div>
                  <div className="text-lg text-white font-bold font-mono">
                    {analysis.spaceComplexity}
                  </div>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              <Section
                id="bugs"
                title="Issues Found"
                icon={AlertCircle}
                items={analysis.bugs}
                color="text-red-400"
              />
              <Section
                id="optimizations"
                title="Optimizations"
                icon={TrendingUp}
                items={analysis.optimizations}
                color="text-amber-400"
              />
              <Section
                id="alternatives"
                title="Alternative Approaches"
                icon={Lightbulb}
                items={analysis.alternatives}
                color="text-cyan-400"
              />
              <Section
                id="best-practices"
                title="Best Practices"
                icon={CheckCircle2}
                items={analysis.bestPractices}
                color="text-emerald-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 py-4 bg-black/30 border-t border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50"></div>
            <div
              className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-lg shadow-blue-400/50"
              style={{ animationDelay: "0.3s" }}></div>
            <div
              className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-lg shadow-purple-400/50"
              style={{ animationDelay: "0.6s" }}></div>
          </div>
          <p className="text-xs text-white/50 font-semibold">
            Powered by Gemini AI
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5));
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.05);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(59, 130, 246, 0.7), rgba(139, 92, 246, 0.7));
        }
      `}</style>
    </div>
  )
}
