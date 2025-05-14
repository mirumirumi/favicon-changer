export const matchUrlPattern = (url: string, currentUrl: string): boolean => {
  // https://regex101.com/r/6e0Ago/1
  const trimedUrl = url.replace(/\/(\*?)\/?$/, "$1")

  try {
    const regex = new RegExp(
      "^" + trimedUrl.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*?") + "\\/?$",
    )
    return regex.test(currentUrl)
  } catch {
    return false
  }
}
