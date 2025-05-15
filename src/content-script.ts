/**
 * Logics to change favicons
 */

import { matchUrlPattern } from "./libs/url"
import { FaviconsInLocalStorage, RegisteredFavicon } from "./popup/type"

const getRegisterdFavicon = async (): Promise<RegisteredFavicon | null> => {
  const favicons = await chrome.storage.local.get<FaviconsInLocalStorage>(null)
  const currentUrl = location.href

  for (const url in favicons) {
    if (matchUrlPattern(url, currentUrl)) {
      return {
        ...favicons[url]!,
        url,
      }
    }
  }

  return null
}

const apply = (dataURI: string) => {
  const links = document.querySelectorAll("link[rel~='icon']") as NodeListOf<HTMLLinkElement>

  if (links.length === 0) {
    const link = document.createElement("link")
    link.rel = "icon"
    document.head.appendChild(link)
    return
  }

  for (const link of links) {
    if (link.href !== dataURI) {
      link.type = ""
      link.href = dataURI
    }
  }
}

const handleApply = (favicon: RegisteredFavicon | null) => {
  if (favicon) {
    if (favicon.enabled) {
      apply(favicon.changeTo)
    } else {
      apply(favicon.original)
    }
  }
}

// When page is loaded
getRegisterdFavicon().then((favicon) => handleApply(favicon))

// Recieve from popup message
// biome-ignore lint/suspicious/noExplicitAny:
const handlerOnMessage = (msg: any) => {
  if (msg.type === "favicon-updated") {
    getRegisterdFavicon().then((favicon) => handleApply(favicon))
  }
}
chrome.runtime.onMessage.addListener(handlerOnMessage)

chrome.runtime.connect().onDisconnect.addListener(() => {
  chrome.runtime.onMessage.removeListener(handlerOnMessage)
  stopPolling()
})

// Polling at intervals
let pollingId: number | undefined
const startPolling = () => {
  pollingId = window.setInterval(async () => {
    try {
      const favicon = await getRegisterdFavicon()
      handleApply(favicon)
    } catch (err) {
      if ((err as Error).message.includes("context invalidated")) return
      throw err
    }
  }, 1_000)
}
const stopPolling = () => {
  if (pollingId !== undefined) {
    clearInterval(pollingId)
    pollingId = undefined
  }
}
startPolling()
window.addEventListener("pagehide", stopPolling)
