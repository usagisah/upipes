import { isFunction, isPromise } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { Pipe } from "../../pipe/pipe.type.js"
import { empty } from "../empty.js"

export function map(fn: Func<[any]>): Pipe {
  if (!isFunction(fn)) return empty
  return ({ status, value }, next) => {
    if (status === "fail") throw value
    if (status === "close") return next(value)

    const res = fn(value)
    if (isPromise(res)) res.then(next)
    else next(res)
  }
}
