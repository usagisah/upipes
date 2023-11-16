import { isFunction, isNumber } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { Pipe } from "../../pipe/pipe.type.js"
import { lazyObservable } from "../createObservable/lazyObservable.js"

export function interval<T = number>(pipes: Pipe[], timer: number, value?: T | Func<[number], T>) {
  return lazyObservable<T>(pipes, ob => {
    if (!isNumber(timer)) ob.close()

    let count = 0
    const f = isFunction(value) ? value : value === undefined ? (v: any) => v : () => value
    const t: any = setInterval(() => {
      try {
        if (ob.closed()) return clearInterval(t)
        ob.call(f(count))
        count++
      } catch (e) {
        console.error(e)
      }
    }, timer)
  })
}
