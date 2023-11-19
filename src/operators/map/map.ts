import { isPromise } from "../../lib/check.js"
import { nextNotUndefValue } from "../../lib/nextNotUndefValue.js"
import { Func } from "../../lib/type.js"
import { PF } from "../../pipe/pipe.type.js"

export function map<T = any>(fn: Func<[T]> = () => {}): PF {
  return ({ status, value }, next, reject) => {
    if (status === "success") {
      const res = fn(value)
      return isPromise(res) ? res.then(v => nextNotUndefValue(next, v, value)).catch(reject) : nextNotUndefValue(next, res, value)
    }
    if (status === "error") throw value
  }
}
