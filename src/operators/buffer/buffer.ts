import { PF } from "../../pipe/pipe.type.js"

export function buffer(count = 1): PF {
  const values: any[] = []
  return ({ status, value }, next) => {
    if (status === "success") {
      values.push(value)
      if (values.length === count) {
        const _values = [...values]
        values.length = 0
        next(_values)
      }
    } else if (status === "close") {
      next(values)
    }
  }
}
