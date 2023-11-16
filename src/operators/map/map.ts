import { isFunction, isPromise } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { PF } from "../../pipe/pipe.type.js"
import { empty } from "../empty.js"

export function map(fn: Func<[any]>): PF {
  if (!isFunction(fn)) return empty
  return ({ status, value }, next) => {
    if (status === "error") throw value
    if (status === "close") return next(value)

    const res = fn(value)
    if (isPromise(res))
      res.then(r => {
        next(r)
      })
    else next(res)
  }
}
