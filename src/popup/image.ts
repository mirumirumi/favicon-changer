export const fileToFaviconDataURI = async (file: File, size = 128): Promise<string> => {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = reject
    i.src = URL.createObjectURL(file)
  })

  const { width, height } = img

  // Only scale down if larger than the `size`
  const scale = Math.min(size / width, size / height, 1)

  const w = Math.round(width * scale)
  const h = Math.round(height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(img, 0, 0, w, h)

  const dataURI = canvas.toDataURL("image/png")

  URL.revokeObjectURL(img.src)
  return dataURI
}
