import { isPromise } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { PF } from "../../pipe/pipe.type.js"

export function catchError(fn: Func<[any]>): PF {
  return async ({ status, value }, next) => {
    if (status === "success" || status === "close") return next(value)
    let res = fn(value)
    if (isPromise(res)) res = await res
    next(res)
  }
}
