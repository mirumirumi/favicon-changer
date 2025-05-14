import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

import { Switch } from "@headlessui/react"
import { MenuHeader } from "./MenuHeader"
import { FaviconsInLocalStorage, RegisteredFavicon } from "./type"

interface Props {
  navigateRegisterPage: (url: string) => void
}

export const ListPage = ({ navigateRegisterPage }: Props) => {
  const [favicons, setFavicons] = useState<Array<RegisteredFavicon>>([])

  useEffect(() => {
    chrome.storage.local.get<FaviconsInLocalStorage>(null).then((res) => {
      const mapped = Object.entries(res)
        .map(([url, data]) => {
          return {
            url,
            original: data.original,
            changeTo: data.changeTo,
            enabled: data.enabled,
            createdAt: data.createdAt,
          }
        })
        .toSorted((a, b) => a.createdAt - b.createdAt)
      setFavicons(mapped)
    })
  }, [])

  const toggleEnabled = async (url: string) => {
    const newFavicons = favicons.map((favicon) => {
      if (favicon.url === url) {
        return {
          ...favicon,
          enabled: !favicon.enabled,
        }
      } else {
        return favicon
      }
    })

    const changed = newFavicons.find((favicon) => favicon.url === url)
    await chrome.storage.local.set<FaviconsInLocalStorage>({
      [url]: {
        original: changed!.original,
        changeTo: changed!.changeTo,
        enabled: changed!.enabled,
        createdAt: changed!.createdAt,
      },
    })

    setFavicons(newFavicons)
  }

  const delete_ = async (url: string) => {
    await chrome.storage.local.remove(url)
    setFavicons(favicons.filter((favicon) => favicon.url !== url))
  }

  return (
    <div className="pt-[12px] px-[4px] text-text-white">
      <div className="px-[14px]">
        <MenuHeader registerPageKind="none" navigateListPage={() => {}} />
      </div>

      <div
        className=" overflow-y-auto"
        style={{ height: `${444 - 62 /* header */ - 12 /* padding-top */}px` }}
      >
        {favicons.length === 0 ? (
          <div className="text-[14px] text-center">No registered favicons</div>
        ) : (
          favicons.map((favicon) => (
            <div
              className="flex justify-between items-center gap-[13px] h-[37px] pb-[1px] px-[10px] rounded-[7px] hover:bg-[#454B55]"
              key={favicon.url}
            >
              <div className="flex-shrink-0 w-[24px]">
                <img src={favicon.changeTo} alt={`favicon-${favicon.url}`} />
              </div>
              <div className="flex-grow overflow-hidden">
                <button
                  type="button"
                  className="inline-block w-full text-[14px] text-left text-ellipsis overflow-hidden whitespace-nowrap hover:underline"
                  title={favicon.url}
                  onClick={() => navigateRegisterPage(favicon.url)}
                >
                  {favicon.url}
                </button>
              </div>
              <div className="flex-shrink-0 flex items-center">
                <Switch
                  checked={favicon.enabled}
                  className="group inline-flex w-[27px] h-[12px] items-center rounded-full bg-[#7B7B7B] translate-y-[0.5px] transition data-checked:bg-primary"
                  onChange={() => toggleEnabled(favicon.url)}
                >
                  <span className="w-[15px] h-[15px] rounded-full bg-[#C4C4C4] translate-y-[-0.5px] transition group-data-checked:bg-[#F2F2F2] group-data-checked:translate-x-[15px]" />
                </Switch>
              </div>
              <button type="button" className="flex-shrink-0" onClick={() => delete_(favicon.url)}>
                <FontAwesomeIcon icon={faTrash} className="pt-[2px] text-[16px] text-[#74767D]" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
