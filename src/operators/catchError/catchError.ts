import { isPromise } from "../../lib/check.js"
import { nextNotUndefValue } from "../../lib/nextNotUndefValue.js"
import { Func } from "../../lib/type.js"
import { PF } from "../../pipe/pipe.type.js"

export function catchError(fn: Func<[any]> = () => undefined): PF {
  return ({ status, value }, next, reject) => {
    if (status === "error") {
      let res = fn(value)
      return isPromise(res) ? res.then(v => nextNotUndefValue(next, v, value)).catch(reject) : nextNotUndefValue(next, res, value)
    }
    next(value)
  }
}
