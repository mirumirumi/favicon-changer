import { useState } from "react"

import { ListPage } from "./ListPage"
import { RegisterPage } from "./RegisterPage"

export const App = () => {
  const [page, setPage] = useState<"register" | "list">("register")

  return page === "register" ? (
    <RegisterPage onShowListPage={() => setPage("list")} />
  ) : (
    <ListPage onShowRegisterPage={() => setPage("register")} />
  )
}
