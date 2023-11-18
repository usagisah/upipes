import { isFunction, isPromise } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { PF } from "../../pipe/pipe.type.js"
import { empty } from "../empty.js"

export function map<T = any>(fn: Func<[T]>): PF {
  if (!isFunction(fn)) return empty
  return ({ status, value }, next, reject) => {
    if (status === "success") {
      const res = fn(value)
      return isPromise(res) ? res.then(next).catch(reject) : next(res)
    }
    if (status === "error") throw value
  }
}
