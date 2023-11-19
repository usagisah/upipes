import { Func } from "../../lib/type.js"
import { PF } from "../../pipe/pipe.type.js"

export function finalize(fn: Func<[any]>): PF {
  return async ({ status, value }, next) => {
    if (status === "success") return next(value)
    if (status === "error") throw value
    next(fn(value))
  }
}
