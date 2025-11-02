import {
  AlertCircle,
  CheckCircle2,
  Code,
  Lightbulb,
  Loader2,
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
      <div className="last:pb-3">
        <button
          onClick={() => hasItems && toggleSection(id)}
          className="w-full px-4 py-3 flex items-center justify-between rounded-lg hover:bg-white/3 transition-all"
          disabled={!hasItems}>
          <div className="flex items-center gap-3">
            <div className={`p-1 rounded-md ${color} bg-white/6`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-white">{title}</div>
              <div className="text-xs text-white/70">{items.length} items</div>
            </div>
          </div>

          {hasItems && (
            <div
              className={`transform transition-transform ${isExpanded ? "rotate-180" : "rotate-0"}`}>
              <span className="text-white/60">▾</span>
            </div>
          )}
        </button>

        {isExpanded && hasItems && (
          <div className="px-4 pb-3 pt-2 space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="text-sm text-white/90 bg-white/4 p-2 rounded-md">
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className="fixed top-6 right-6 w-[380px] max-h-[86vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-[10000]"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white">Code Review Ninja</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white/90 hover:bg-white/20 rounded p-1 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-sm flex-1 overflow-y-auto p-3">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-white/80">
            <Loader2 className="w-8 h-8 text-purple-300 animate-spin" />
            <span className="mt-3">Analyzing code...</span>
          </div>
        )}

        {error && (
          <div className="m-2 p-3 bg-red-700/30 rounded-lg border border-red-700/40">
            <div className="flex items-center gap-2 text-red-200">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="mt-2 text-sm text-red-100">{error}</p>
          </div>
        )}

        {analysis && !loading && !error && (
          <div className="space-y-3">
            {analysis.overall && (
              <div className="p-3 bg-white/6 rounded-md">
                <h4 className="font-medium text-white mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" /> Overall
                  Assessment
                </h4>
                <p className="text-sm text-white/80">{analysis.overall}</p>
              </div>
            )}

            <div className="p-3 bg-white/6 rounded-md grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-medium text-purple-200">
                  Time Complexity
                </div>
                <div className="text-sm text-white/80">
                  {analysis.timeComplexity}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-blue-200">
                  Space Complexity
                </div>
                <div className="text-sm text-white/80">
                  {analysis.spaceComplexity}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Section
                id="bugs"
                title="Potential Issues"
                icon={AlertCircle}
                items={analysis.bugs}
                color="bg-red-500/80"
              />
              <Section
                id="optimizations"
                title="Optimizations"
                icon={TrendingUp}
                items={analysis.optimizations}
                color="bg-yellow-400/80"
              />
              <Section
                id="alternatives"
                title="Alternative Approaches"
                icon={Lightbulb}
                items={analysis.alternatives}
                color="bg-blue-400/80"
              />
              <Section
                id="best-practices"
                title="Best Practices"
                icon={CheckCircle2}
                items={analysis.bestPractices}
                color="bg-green-400/80"
              />
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-transparent text-center">
        <p className="text-xs text-white/60">Powered by Gemini AI</p>
      </div>
    </div>
  )
}
