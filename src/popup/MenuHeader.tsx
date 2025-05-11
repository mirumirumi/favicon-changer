import { faAngleDown, faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { MouseEvent, useState } from "react"

interface Props {
  registerPageKind: "new" | "edit"
  url?: string
  navigateListPage: () => void
}

export const MenuHeader = ({ registerPageKind, url, navigateListPage }: Props) => {
  const [isOpenMainMenu, setIsOpenMainMenu] = useState(false)
  const [isClickedDeleteOnce, setIsClickedDeleteOnce] = useState(false)

  const delete_ = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!isClickedDeleteOnce) {
      setIsClickedDeleteOnce(true)
    } else {
      await chrome.storage.local.remove(url!)
      navigateListPage()
    }
  }

  return (
    <div className="flex justify-between pt-[4px] pl-[6px] pr-[4px] pb-[33px]">
      <button type="button" className="flex pt-[1px]" onClick={() => setIsOpenMainMenu(true)}>
        <FontAwesomeIcon icon={faBars} className="text-[24px] text-[#74767D]" />
      </button>

      <Menu>
        <MenuButton className="flex">
          {registerPageKind === "edit" && (
            <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full border-[2px] border-[#74767D]">
              <FontAwesomeIcon icon={faAngleDown} className="text-[14px] text-[#74767D]" />
            </div>
          )}
        </MenuButton>
        <MenuItems
          anchor="bottom end"
          className="[--anchor-gap:10px] w-[128px] rounded-[7px] border-[1px] border-[#74767D] bg-bg origin-top transition duration-150 ease-out data-closed:translate-y-[-3px] data-closed:opacity-0"
          transition
        >
          {({ open }) => {
            // https://github.com/tailwindlabs/headlessui/discussions/1947
            if (!open) {
              setTimeout(() => {
                setIsClickedDeleteOnce(false)
              }, 100)
            }
            return (
              <MenuItem>
                <div className="flex items-center h-[38px] px-[5px] pt-[5.5px] pb-[4px]">
                  <button
                    type="button"
                    className="block w-full h-full px-[6px] text-[14px] text-text-danger text-left rounded-[3px] translate-y-[-1px] hover:bg-[#454B55]"
                    onClick={delete_}
                  >
                    {!isClickedDeleteOnce ? "Delete" : "Are you sure?"}
                  </button>
                </div>
              </MenuItem>
            )
          }}
        </MenuItems>
      </Menu>
    </div>
  )
}
