import { isFunction } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { PF } from "../../pipe/pipe.type.js"
import { empty } from "../empty.js"

export function filter(fn: Func<[any], boolean>): PF {
  if (!isFunction(fn)) return empty
  return ({ status, value }, next) => {
    if (status === "success") return fn(value) && next(value)
    if (status === "error") throw value
  }
}
