import { isFunction, isNumber } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { PF } from "../../pipe/pipe.type.js"
import { map } from "../map/map.js"

export function delay(timeout: number): PF
export function delay(fn: Func<[], number>): PF
export function delay(timeoutOrFn: number | Func<[], number>): PF {
  let _timeout = 0
  let _getTimeout = () => _timeout
  if (isNumber(timeoutOrFn)) _timeout = timeoutOrFn
  else if (isFunction(timeoutOrFn)) _getTimeout = timeoutOrFn
  return map(value => {
    return new Promise<any>(resolve => {
      setTimeout(() => resolve(value), _getTimeout())
    })
  })
}
