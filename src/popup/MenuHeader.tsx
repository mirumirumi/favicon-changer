import { faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { faAngleDown, faBars, faBug, faClose, faIcons } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react"
import { MouseEvent, useState } from "react"

interface Props {
  registerPageKind: "new" | "edit" | "none"
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
      <Dialog
        open={isOpenMainMenu}
        onClose={() => setIsOpenMainMenu(false)}
        className="relative z-1 text-[14px] text-text-label"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/66" />
        <div className="fixed top-0 bottom-0 w-[67%]">
          <DialogPanel
            className="h-full pt-[9px] pl-[5px] pr-[13px] bg-[#30353D] transition duration-100 ease-out data-closed:translate-x-[-100%]"
            transition
          >
            <div className="mb-[19px] text-right">
              <CloseButton>
                <FontAwesomeIcon icon={faClose} className="text-[27px] text-[#74767D]" />
              </CloseButton>
            </div>
            <button
              type="button"
              className="flex items-center gap-[12px] w-full h-[35px] my-[7px] px-[13px] pb-[2px] rounded-[7px] hover:bg-[#454B55]"
              onClick={navigateListPage}
            >
              <FontAwesomeIcon icon={faIcons} className="pt-[2px] text-[14px] text-[#DBDBDB]" />
              Your Changed favicons
            </button>
            <hr className="my-[13px] border-[#5B5B5B]" />
            <button
              type="button"
              className="flex items-center gap-[12px] w-full h-[35px] my-[7px] px-[13px] pb-[2px] rounded-[7px] hover:bg-[#454B55]"
              onClick={() =>
                chrome.tabs.create({
                  url: "https://github.com/mirumirumi/favicon-changer/issues",
                })
              }
            >
              <FontAwesomeIcon icon={faBug} className="pt-[2px] text-[14px] text-[#DBDBDB]" />
              Bug report
            </button>
            <button
              type="button"
              className="flex items-center gap-[12px] w-full h-[35px] my-[7px] px-[13px] pb-[2px] rounded-[7px] hover:bg-[#454B55]"
              onClick={() =>
                chrome.tabs.create({
                  url: "https://x.com/__mirumi__",
                })
              }
            >
              <FontAwesomeIcon icon={faXTwitter} className="pt-[2px] text-[14px] text-[#DBDBDB]" />
              @__mirumi__
            </button>
          </DialogPanel>
        </div>
      </Dialog>

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
