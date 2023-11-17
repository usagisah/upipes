import { isNumber } from "../../lib/check.js"
import { PF } from "../../pipe/pipe.type.js"

export function take(count: number): PF {
  const _count = isNumber(count) ? count : 0
  let index = 0
  return ({ status, value }, next) => {
    if (status === "success") return ++index > _count ? next(null, { forceClose: true }) : next(value)
    if (status === "error") throw value
  }
}
