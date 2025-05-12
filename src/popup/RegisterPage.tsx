import { faImage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion, useAnimation } from "framer-motion"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"

import notFoundImage from "../assets/placeholder.png"
import { LoadSpinner } from "./LoadSpinner"
import { MenuHeader } from "./MenuHeader"
import { fileToFaviconDataURI } from "./image"
import { FaviconsInLocalStorage } from "./type"

interface Props {
  _url?: string
  navigateListPage: () => void
}

export const RegisterPage = ({ _url, navigateListPage }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [faviconOriginal, setFaviconOriginal] = useState(notFoundImage)
  const [url, setUrl] = useState(_url ?? "")
  const [filePath, setFilePath] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const timer = useRef<number>(0)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const kind = _url !== undefined ? "edit" : "new"
  const isDisabled = !(file && url)

  const originalCtrl = useAnimation()
  const changeToCtrl = useAnimation()

  useEffect(() => {
    if (kind === "new") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.favIconUrl) {
          setFaviconOriginal(tabs[0].favIconUrl)
        }
        if (tabs[0]?.url) {
          const currentUrl = new URL(tabs[0].url)
          setUrl(`${currentUrl.origin}/*`)
        }
      })
    } else {
      chrome.storage.local.get<FaviconsInLocalStorage>(_url!).then((res) => {
        Object.entries(res).forEach(([url, data]) => {
          if (url === _url) {
            setFaviconOriginal(data.original)
            setFilePath(data.changeTo)
          }
        })
      })
      setUrl(_url!)
    }
  }, [kind, _url])

  useEffect(() => {
    const prev = filePath
    return () => {
      prev && URL.revokeObjectURL(prev)
    }
  }, [filePath])

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    const inputtedUrl = (e.target as HTMLInputElement).value
    setUrl(inputtedUrl)

    clearTimeout(timer.current)
    timer.current = window.setTimeout(async () => {
      try {
        const domain = new URL(inputtedUrl).hostname
        const res = await fetch(`https://www.google.com/s2/favicons?sz=128&domain=${domain}`)
        if (res.status === 404) {
          setFaviconOriginal(notFoundImage)
        } else {
          setFaviconOriginal(res.url)
        }
      } catch (_) {}
    }, 222)
  }

  const handleFileUploadButtonClick = () => {
    fileRef.current!.value = ""
    fileRef.current!.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files?.[0]) {
      const file = files[0]
      const fileURL = URL.createObjectURL(file)
      setFilePath(fileURL)
      setFile(file)
    } else {
      // When cancelled
      setFilePath(null)
      setFile(null)
    }
  }

  const register = async () => {
    if (isAnimating) return
    setIsAnimating(true)

    await Promise.all([
      changeToCtrl.start({
        x: -72,
        transition: { type: "spring", stiffness: 555, damping: 27 },
      }),
      originalCtrl.start({
        x: -31,
        y: 0.5,
        rotate: -3.7,
        opacity: 0.23,
        transition: { type: "spring", delay: 0.09, stiffness: 333, damping: 57 },
      }),
    ])

    // For animation adjustment
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    // changeToCtrl.set({
    //   x: 0,
    // })
    // originalCtrl.set({
    //   x: 0,
    //   y: 0,
    //   rotate: 0,
    //   opacity: 1,
    // })

    const dataURI = await fileToFaviconDataURI(file!)
    await chrome.storage.local.set<FaviconsInLocalStorage>({
      [url]: {
        original: faviconOriginal,
        changeTo: dataURI,
        enabled: true,
        updatedAt: Date.now(),
      },
    }) // ~1ms

    await new Promise((resolve) => setTimeout(resolve, 333))
    navigateListPage()
  }

  return (
    <div className="pt-[12px] px-[18px] pb-[21px] text-text-white">
      <MenuHeader registerPageKind={kind} navigateListPage={navigateListPage} />

      <div className="flex justify-evenly gap-6 mb-[46px]">
        <div>
          <div className="mb-[25px] font-bold text-[15px] text-text-label text-center">
            Original
          </div>
          <div className="relative w-[82px] h-[82px]">
            <div style={isLoading ? { opacity: "1" } : { opacity: "0" }}>
              <LoadSpinner size="37%" />
            </div>
            <motion.img
              src={faviconOriginal}
              alt="favicon-original"
              className="h-full aspect-square"
              style={isLoading ? { opacity: "0" } : { opacity: "1" }}
              animate={originalCtrl}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>
        <div>
          <div className="mb-[25px] font-bold text-[15px] text-text-label text-center">
            Change to
          </div>
          <div className="relative w-[82px] h-[82px]">
            {filePath !== null ? (
              <>
                <motion.img
                  src={filePath}
                  alt="uploaded-image"
                  className="absolute h-full aspect-square"
                  style={{ top: 0, left: 0 }}
                  animate={changeToCtrl}
                />
                {!isAnimating && (
                  <button
                    type="button"
                    className="w-full mt-[4px] pt-[82px] text-[11px] text-text-label underline text-center duration-300"
                    onClick={handleFileUploadButtonClick}
                  >
                    re-upload
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                className="flex justify-center items-center w-full h-full border-dashed border-[2.3px] border-[#95A1B2] rounded-[5px] cursor-pointer"
                onClick={handleFileUploadButtonClick}
              >
                <FontAwesomeIcon icon={faImage} className="text-3xl text-[#95A1B2]" />
              </button>
            )}
            <input
              type="file"
              ref={fileRef}
              className="hidden"
              accept="jpg,jpeg,png,gif,bmp,svg,ico"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      <div className="mb-[49px]">
        <div className="mb-[6px] font-bold text-[13.6px] text-text-label">URL</div>
        <input
          type="text"
          value={url}
          className="w-full mb-[4px] px-[12px] py-[2px] border-[1.1px] border-[#74767D] rounded-[5px] text-[13.6px] leading-[2.3] bg-[#3B3F46] outline-transparent transition-outline disabled:text-[#bdbdbd] disabled:border-transparent"
          placeholder="https://google.com/*"
          disabled={kind === "edit"}
          onInput={handleInput}
        />
        <div className="px-[3px] text-[10px] text-text-label">
          {kind === "new"
            ? "You can use the glob pattern or match the URL exactly."
            : "URL cannot be updated."}
        </div>
      </div>

      <button
        type="button"
        className="w-full h-[38px] pb-[2px] font-bold text-[13.6px] rounded-[7px] bg-primary hover:opacity-75 disabled:opacity-50 disabled:cursor-auto transition duration-150"
        disabled={isDisabled || isAnimating}
        onClick={register}
      >
        {kind === "new" ? "Register" : "Update"}
      </button>
    </div>
  )
}
