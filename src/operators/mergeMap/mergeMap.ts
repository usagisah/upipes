import { isFunction, isNumber } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { createObservable } from "../../observable/observable/createObservable.js"
import { PF, PipeNext } from "../../pipe/pipe.type.js"
import { map } from "../map/map.js"

export function mergeMap(thenFn: Func<[any]>, limit?: number | Func<[number], boolean>): PF {
  let max = 1
  let parallel = 0
  let checkLimit: any = (parallel: number) => parallel > max
  if (isNumber(limit)) max = limit
  else if (isFunction(limit)) checkLimit = limit

  let close = false
  let pending: any[] = []
  function tryNext(mainNext: PipeNext) {
    if (close || pending.length === 0) return
    if (++parallel > max) return parallel--

    const o = createObservable([map(thenFn)], null, { throwError: true })
    o.resolve()
      .then(mainNext)
      .finally(() => {
        parallel--
        o.close()
        tryNext(mainNext)
      })
    o.next(pending.shift())
    tryNext(mainNext)
  }

  return (ctx, next) => {
    const { status, value } = ctx
    if (status === "error") throw value
    if (status === "close") {
      close = true
      pending.length = 0
      return next()
    }

    pending.push(value)
    if (checkLimit(parallel + 1)) return
    tryNext(next)
  }
}
