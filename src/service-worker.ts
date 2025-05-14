/**
 * Observe tabs and apply immediately
 */

import { matchUrlPattern } from "./libs/url"

const broadcastFaviconUpdate = async (updatedKey: string) => {
  const tabs = await chrome.tabs.query({})

  for (const tab of tabs) {
    if (!tab.url || !tab.id) continue

    try {
      const url = new URL(tab.url)
      if (matchUrlPattern(updatedKey, url.href)) {
        chrome.tabs.sendMessage(tab.id, { type: "favicon-updated" })
      }
    } catch {
      // Ignore
    }
  }
}

// Reciece from popup message
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "favicon-updated" && msg.key) {
    broadcastFaviconUpdate(msg.key)
  }
})

// When tab URL is changed (for normal reload, navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    chrome.tabs.sendMessage(tabId, { type: "favicon-updated" })
  }
})

// When tab URL is changed (for hash history on SPA)
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.frameId === 0) {
    chrome.tabs.sendMessage(details.tabId, { type: "favicon-updated" })
  }
})

// When `storage.local` is updated on other tabs
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return

  for (const key in changes) {
    broadcastFaviconUpdate(key)
  }
})
