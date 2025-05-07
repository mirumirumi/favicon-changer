import { crx } from "@crxjs/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import manifest from "./manifest.json"

export default defineConfig({
  plugins: [crx({ manifest }), react(), tailwindcss()],
  legacy: {
    // https://github.com/crxjs/chrome-extension-tools/issues/971
    skipWebSocketTokenCheck: true,
  },
})
