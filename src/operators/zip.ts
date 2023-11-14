import { PipeFactory } from "./main"

export function zip(count = 1): PipeFactory {
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
