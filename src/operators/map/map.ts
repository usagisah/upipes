import { isFunction, isPromise } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { PF } from "../../pipe/pipe.type.js"
import { empty } from "../empty.js"

export function map<T = any>(fn: Func<[T]>): PF {
  if (!isFunction(fn)) return empty
  const nextValue = (next: any, v1: unknown, v2: unknown) => {
    v1 === undefined ? next(v2, { skip: true }) : next(v1)
  }
  return ({ status, value }, next, reject) => {
    if (status === "success") {
      const res = fn(value)
      return isPromise(res) ? res.then(v => nextValue(next, v, value)).catch(reject) : nextValue(next, res, value)
    }
    if (status === "error") throw value
  }
}
