import { PF } from "../pipe/pipe.type.js"

export const empty: PF = ({ status, value }, next) => {
  if (status === "error") throw value
  next(value)
}
