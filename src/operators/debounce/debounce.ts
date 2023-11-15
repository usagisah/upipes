import { isFunction, isNumber } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { Pipe } from "../../pipe/pipe.type.js"
import { empty } from "../empty.js"

export function debounce(fn: Func<[any], boolean>, gap?: number): Pipe {
  if (!isFunction(fn)) return empty

  const _timer = isNumber(gap) ? gap : 700
  let t: any
  return ({ status, value }, next) => {
    if (status === "close") return next()
    if (status === "fail") throw value

    clearTimeout(t)
    t = null
    t = setTimeout(() => next(fn(value)), _timer)
  }
}
