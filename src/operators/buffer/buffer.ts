import { PF } from "../../pipe/pipe.type.js"

export function buffer(count = 1): PF {
  const values: any[] = []
  return ({ status, value }, next) => {
    if (status === "success") {
      values.push(value)
      if (values.length === count) {
        next([...values])
        values.length = 0
      }
      return
    }

    if (status === "close") {
      if (value !== undefined) values.push(value)
      next([...values])
      values.length = 0
    }
  }
}
