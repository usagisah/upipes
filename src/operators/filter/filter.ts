import { isFunction } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { Pipe } from "../../pipe/pipe.type.js"
import { empty } from "../empty.js"

export function filter(fn: Func<[any], boolean>): Pipe {
  if (!isFunction(fn)) return empty
  return ({ status, value }, next) => {
    if (status === "fail") throw value
    if (status === "close") return next(value)
    if (fn(value)) next(value)
  }
}
