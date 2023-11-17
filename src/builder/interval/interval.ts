import { isFunction, isNumber } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { createObservable } from "../../observable/observable/createObservable.js"
import { PF } from "../../pipe/pipe.type.js"

export function interval<T = number>(pipes: PF[], timer: number, value?: T | Func<[number], T>) {
  return createObservable<T>(pipes, ob => {
    if (!isNumber(timer)) ob.close()

    let count = 0
    const f = isFunction(value) ? value : value === undefined ? (v: any) => v : () => value
    const t: any = setInterval(() => {
      try {
        if (ob.closed()) return clearInterval(t)
        ob.next(f(count))
        count++
      } catch (e) {
        ob.error(e)
      }
    }, timer)
  })
}
