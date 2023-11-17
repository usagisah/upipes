import { isNumber } from "../../lib/check.js"
import { createObservable } from "../../observable/observable/createObservable.js"
import { isObservable } from "../../observable/observable/isObservable.js"
import { PF } from "../../pipe/pipe.type.js"

export function mergeAll<T = any>(pipes: PF[], values: any[], limit?: number) {
  const _limit = isNumber(limit) && limit > 0 ? limit : 1
  const _values = [...values]
  return createObservable<T>(pipes, ob => {
    let index = -1
    let parallel = 0
    const tryNext = () => {
      parallel++
      index++
      if (parallel > _limit) return parallel--, index--
      if (index >= _values.length || ob.closed()) return ob.close()

      const value = _values[index]
      if (isObservable(value)) {
        value.subscribe({
          next: ob.next,
          error: ob.error,
          close: () => (parallel--, tryNext())
        })
        tryNext()
      } else ob.next(value), parallel--, tryNext()
    }
    tryNext()
  })
}
