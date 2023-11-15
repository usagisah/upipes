import { Pipe } from "../pipe/pipe.type.js"

export const empty: Pipe = ({ status, value }, next) => {
  if (status === "fail") throw value
  next(value)
}
