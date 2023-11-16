import { isFunction, isNumber } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { PF } from "../../pipe/pipe.type.js"

export function throttle(fnOrGap?: Func<[any], number> | number): PF {
  let gap = 0
  let getTimeout: any = () => gap
  if (isNumber(fnOrGap)) gap = fnOrGap
  else if (isFunction(fnOrGap)) getTimeout = fnOrGap

  let active: any = null
  return ({ status, value }, next) => {
    if (status === "error") throw value
    if (active) return
    if (status === "close") return next()

    active = setTimeout(() => {
      active = null
      next(value)
    }, getTimeout(value))
  }
}
