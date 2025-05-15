import { useState } from "react"

import { ListPage } from "./ListPage"
import { RegisterPage } from "./RegisterPage"

export const App = () => {
  const [page, setPage] = useState<"register" | "list">("register")
  const [url, setUrl] = useState<string | undefined>(undefined)

  return page === "register" ? (
    <RegisterPage urlToEdit={url} navigateListPage={() => setPage("list")} />
  ) : (
    <ListPage
      navigateRegisterNewPage={() => setPage("register")}
      navigateRegisterEditPage={(url) => {
        setUrl(url)
        setPage("register")
      }}
    />
  )
}
