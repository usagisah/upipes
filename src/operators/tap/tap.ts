import { isFunction } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { PF, PipeContext } from "../../pipe/pipe.type.js"
import { empty } from "../empty.js"

export function tap(fn: Func<[PipeContext]>): PF {
  if (!isFunction(fn)) return empty
  return (ctx, resolve, reject) => {
    fn(ctx)
    empty(ctx, resolve, reject)
  }
}
