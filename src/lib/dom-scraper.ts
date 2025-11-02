export interface ScrapedCode {
  code: string
  language: string
  context?: string
  fileName?: string
}

export class DOMScraper {
  // GitHub PR file detection
  static scrapeGitHubPR(): ScrapedCode[] {
    const results: ScrapedCode[] = []

    // GitHub uses .blob-code-inner for code lines in PR diffs
    const fileContainers = document.querySelectorAll("[data-tagsearch-path]")

    fileContainers.forEach((container) => {
      const fileName =
        container.getAttribute("data-tagsearch-path") || "unknown"
      const language = this.detectLanguageFromFileName(fileName)

      // Get all code lines (added or unchanged)
      const codeLines = container.querySelectorAll(".blob-code-inner")
      const codeArray: string[] = []

      codeLines.forEach((line) => {
        const text = line.textContent || ""
        if (text.trim()) {
          codeArray.push(text)
        }
      })

      if (codeArray.length > 0) {
        results.push({
          code: codeArray.join("\n"),
          language,
          fileName,
          context: `GitHub PR - ${fileName}`
        })
      }
    })

    // Fallback: Try to get from code blocks
    if (results.length === 0) {
      const codeBlocks = document.querySelectorAll("pre code, .highlight")
      codeBlocks.forEach((block) => {
        const code = block.textContent || ""
        if (code.trim().length > 10) {
          const classList = Array.from(block.classList)
          const langClass = classList.find((c) => c.startsWith("language-"))
          const language = langClass
            ? langClass.replace("language-", "")
            : "javascript"

          results.push({
            code: code.trim(),
            language,
            context: "GitHub Code Block"
          })
        }
      })
    }

    return results
  }

  // LeetCode code detection
  static scrapeLeetCode(): ScrapedCode | null {
    // LeetCode uses Monaco editor - try multiple selectors
    const selectors = [
      ".view-lines", // Monaco editor
      "#editor .view-line",
      "[data-mode-id] .view-line"
    ]

    for (const selector of selectors) {
      const editorLines = document.querySelectorAll(selector)
      if (editorLines.length > 0) {
        const codeArray: string[] = []
        editorLines.forEach((line) => {
          const text = line.textContent || ""
          codeArray.push(text)
        })

        const code = codeArray.join("\n").trim()
        if (code.length > 10) {
          // Try to detect language from the page
          const language = this.detectLeetCodeLanguage()
          const problemTitle =
            document.querySelector('[data-cy="question-title"]')?.textContent ||
            "LeetCode Problem"

          return {
            code,
            language,
            context: problemTitle
          }
        }
      }
    }

    // Fallback: Try textarea or contenteditable
    const textAreas = document.querySelectorAll(
      'textarea[class*="code"], [contenteditable="true"]'
    )
    for (const area of textAreas) {
      const code = (area.textContent || "").trim()
      if (code.length > 10) {
        return {
          code,
          language: this.detectLeetCodeLanguage(),
          context: "LeetCode Solution"
        }
      }
    }

    return null
  }

  // Detect language from LeetCode UI
  private static detectLeetCodeLanguage(): string {
    // Check language selector button
    const langButton = document.querySelector(
      '[id*="headlessui-listbox-button"]'
    )
    if (langButton) {
      const text = langButton.textContent?.toLowerCase() || ""
      if (text.includes("python")) return "python"
      if (text.includes("java")) return "java"
      if (text.includes("javascript")) return "javascript"
      if (text.includes("c++")) return "cpp"
      if (text.includes("c")) return "c"
    }

    return "python" // Default
  }

  // Detect language from file extension
  private static detectLanguageFromFileName(fileName: string): string {
    const ext = fileName.split(".").pop()?.toLowerCase()
    const langMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      go: "go",
      rs: "rust",
      rb: "ruby",
      php: "php",
      cs: "csharp",
      swift: "swift",
      kt: "kotlin"
    }

    return langMap[ext || ""] || "javascript"
  }

  // Detect which platform we're on
  static detectPlatform(): "github" | "leetcode" | "unknown" {
    const hostname = window.location.hostname
    if (hostname.includes("github.com")) return "github"
    if (hostname.includes("leetcode.com")) return "leetcode"
    return "unknown"
  }
}
