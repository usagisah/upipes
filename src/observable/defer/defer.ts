import { isNumber } from "../../lib/check.js"
import { PF } from "../../pipe/pipe.type.js"
import { lazyObservable } from "../createObservable/lazyObservable.js"

export function defer<T = any>(pipes: PF[], timeout = 0, value?: T) {
  return lazyObservable<T | undefined>(pipes, ob => {
    setTimeout(
      () => {
        ob.call(value)
        ob.close()
      },
      isNumber(timeout) ? timeout : 0
    )
  })
}
