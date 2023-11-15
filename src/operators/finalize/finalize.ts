import { Func } from "../../lib/type.js"
import { Pipe } from "../../pipe/pipe.type.js"

export function finalize(fn: Func<[any]>): Pipe {
  return async ({ status, value }, next) => {
    if (status === "success") return next(value)
    if (status === "fail") throw value

    fn(value)
    next(value)
  }
}
