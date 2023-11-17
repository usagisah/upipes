import { isFunction, isNumber } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { PF } from "../../pipe/pipe.type.js"

export function debounce(fnOrGap?: Func<[any], number> | number): PF {
  let gap = 0
  let getTimeout: any = () => gap
  if (isNumber(fnOrGap)) gap = fnOrGap
  else if (isFunction(fnOrGap)) getTimeout = fnOrGap

  let t: any
  return ({ status, value }, next) => {
    if (status === "error") throw value
    if (status === "close") return

    clearTimeout(t)
    t = null
    t = setTimeout(() => next(value), getTimeout(value))
  }
}
