import { isNumber } from "../../lib/check.js"
import { Pipe } from "../../pipe/pipe.type.js"

export function timeout(timer: number): Pipe {
  const _timer = isNumber(timer) ? timer : 0
  return ({ status, value }, next) => {
    if (status === "close") return next(value)

    setTimeout(() => next(null, { forceClose: true }), _timer)

    if (status === "fail") throw value
    else next(value)
  }
}
