import { isNumber } from "../../lib/check.js"
import { PF } from "../../pipe/pipe.type.js"

export function take(count: number): PF {
  const _count = isNumber(count) ? count : 0
  let index = 0
  return ({ status, value }, next) => {
    if (status === "close") return next(value)
    if (status === "error") throw value

    index++
    if (index > _count) return next(null, { forceClose: true })
    else next(value)
  }
}
