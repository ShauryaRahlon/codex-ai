// Background script for handling extension lifecycle events
export {}

console.log("Code Review Ninja background script loaded")

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("Code Review Ninja installed successfully!")

    // Open options/popup page on first install
    chrome.tabs.create({
      url: "popup.html"
    })
  } else if (details.reason === "update") {
    console.log("Code Review Ninja updated!")
  }
})

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeCode") {
    // Handle code analysis requests if needed
    console.log("Code analysis requested from:", sender.tab?.url)
  }

  return true
})
