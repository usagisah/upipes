import { isNumber } from "../../lib/check.js"
import { createObservable } from "../../observable/observable/createObservable.js"
import { PF } from "../../pipe/pipe.type.js"

export function defer<T = any>(pipes: PF[], timeout = 0, value?: T) {
  return createObservable<T | undefined>(pipes, ob => {
    setTimeout(
      () => {
        ob.next(value)
        ob.close()
      },
      isNumber(timeout) ? timeout : 0
    )
  })
}
