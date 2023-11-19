import { isFunction, isPromise } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { PF } from "../../pipe/pipe.type.js"
import { empty } from "../empty.js"

export function filter(fn: Func<[any], boolean | Promise<boolean>>): PF {
  if (!isFunction(fn)) return empty
  const nextValue = (next: any, res: boolean, value: any) => res && next(value)
  return ({ status, value }, next, reject) => {
    if (status === "success") {
      let res = fn(value)
      return isPromise(res) ? res.then(v => nextValue(next, v, value)).catch(reject) : nextValue(next, res, value)
    }
    if (status === "error") throw value
  }
}
