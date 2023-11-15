import { isFunction, isNumber } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { Pipe } from "../../pipe/pipe.type.js"
import { empty } from "../empty.js"

export function throttle(fn: Func<[any], boolean>, gap?: number): Pipe {
  if (!isFunction(fn)) return empty

  const _timer = isNumber(gap) ? gap : 700
  let active: any = null
  return ({ status, value }, next) => {
    if (status === "close") return next()
    if (status === "fail") throw value
    if (active) return
    active = setTimeout(() => {
      active = null
      next(fn(value))
    }, _timer)
  }
}
