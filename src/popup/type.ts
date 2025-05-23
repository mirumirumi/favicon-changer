export interface RegisteredFavicon {
  url: string
  original: string // base64
  changeTo: string // base64
  enabled: boolean
  createdAt: number
}

export type FaviconsInLocalStorage = Record<string /* url */, Omit<RegisteredFavicon, "url">>
