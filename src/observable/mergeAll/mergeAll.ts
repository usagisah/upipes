import { isNumber } from "../../lib/check.js"
import { Pipe } from "../../pipe/pipe.type.js"
import { isObservable } from "../createObservable/isObservable.js"
import { lazyObservable } from "../createObservable/lazyObservable.js"

export function mergeAll<T = any>(pipes: Pipe[], values: any[], limit?: number) {
  const _limit = isNumber(limit) && limit > 0 ? limit : 1
  const _values = [...values]
  return lazyObservable<T>(pipes, ob => {
    let index = -1
    let parallel = 0
    const next = () => {
      parallel++
      index++
      if (parallel > _limit) return parallel--, index--
      if (index >= _values.length || ob.closed()) return ob.close()

      const value = _values[index]
      if (isObservable(value)) {
        value.then(ob.call)
        value.catch(e => ob.call(e, "fail"))
        value.finalize(() => (parallel--, next()))
        next()
      } else ob.call(value), parallel--, next()
    }
    next()
  })
}
