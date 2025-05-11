import { useState } from "react"

import { ListPage } from "./ListPage"
import { RegisterPage } from "./RegisterPage"

export const App = () => {
  const [page, setPage] = useState<"register" | "list">("register")

  return page === "register" ? (
    <RegisterPage navigateListPage={() => setPage("list")} />
  ) : (
    <ListPage navigateRegisterPage={() => setPage("register")} />
  )
}
