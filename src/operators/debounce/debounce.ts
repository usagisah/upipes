import { isFunction, isNumber } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { Pipe } from "../../pipe/pipe.type.js"

export function debounce(fnOrGap?: Func<[any], number> | number): Pipe {
  let gap = 0
  let getTimeout: any = () => gap
  if (isNumber(fnOrGap)) gap = fnOrGap
  else if (isFunction(fnOrGap)) getTimeout = fnOrGap

  let t: any
  return ({ status, value }, next) => {
    if (status === "fail") throw value
    if (status === "close") return next()

    clearTimeout(t)
    t = null
    t = setTimeout(() => next(value), getTimeout(value))
  }
}
