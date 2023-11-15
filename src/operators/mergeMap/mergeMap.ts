import { isFunction, isNumber } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { createObservable } from "../../observable/createObservable/createObservable.js"
import { Pipe, PipeNext } from "../../pipe/pipe.type.js"
import { map } from "../map/map.js"

export function mergeMap(thenFn: Func<[any]>, limit?: number | Func<[number], boolean>): Pipe {
  let max = 1
  let parallel = 0
  let checkLimit: any = () => parallel > max
  if (isNumber(limit)) max = limit
  else if (isFunction(limit)) checkLimit = limit

  let close = false
  let pending: any[] = []
  function tryNext(next: PipeNext) {
    if (close) return
    if (++parallel > max) {
      if (arguments.length > 1) pending.push(arguments[1])
      return parallel--
    }

    const o = createObservable([map(thenFn)])
    o.catch(e => {
      try {
        o.close()
        parallel--
        throw e
      } finally {
        return tryNext(next)
      }
    })
    o.then(value => {
      o.close()
      next(value)
      parallel--
      return tryNext(next)
    })
    o.call(pending.shift())
    tryNext(next)
  }

  return (ctx, next) => {
    const { status, value } = ctx
    if (status === "fail") throw value
    if (status === "close") {
      close = true
      pending.length = 0
      return next()
    }

    if (checkLimit(parallel)) return
    ;(tryNext as any)(next, value)
  }
}
