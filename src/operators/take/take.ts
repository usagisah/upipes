import { isNumber } from "../../lib/check.js"
import { Pipe } from "../../pipe/pipe.type.js"

export function take(count: number): Pipe {
  const _count = isNumber(count) ? count : 0
  let index = 0
  return ({ status, value }, next) => {
    if (status === "close") return next(value)
    if (status === "fail") throw value

    index++
    if (index > _count) return next(null, { forceClose: true })
    else next(value)
  }
}
