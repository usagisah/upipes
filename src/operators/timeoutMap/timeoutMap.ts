import { isNumber, isPlainObject, isString } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { createObservable } from "../../observable/observable/createObservable.js"
import { PF } from "../../pipe/pipe.type.js"
import { map } from "../map/map.js"

type Config = {
  timeout?: number
  throwError?: string
  forceClose?: boolean
}

export function timeoutMap(fn: Func<[any]>): PF
export function timeoutMap(fn: Func<[any]>, timeout: number): PF
export function timeoutMap(fn: Func<[any]>, config: Config): PF
export function timeoutMap(fn: Func<[any]>, timeoutOrConfig?: number | Config): PF {
  let _timeout = 10000
  let _throwError: string | null = null
  let _forceClose = false

  if (isNumber(timeoutOrConfig)) _timeout = timeoutOrConfig
  else if (isPlainObject(timeoutOrConfig)) {
    if (isNumber(timeoutOrConfig.timeout)) _timeout = timeoutOrConfig.timeout
    if (isString(timeoutOrConfig.throwError)) _throwError = timeoutOrConfig.throwError
    _forceClose = !!timeoutOrConfig.forceClose
  }

  let _t: any = null
  return ({ status, value }, next) => {
    if (status === "error") throw value
    if (status === "close") return

    const o = createObservable([map(fn)])
    o.subscribe({
      next,
      error: e => {
        o.close()
        console.error(e)
      },
      close: () => {
        clearTimeout(_t)
        _t = null
      }
    })
    o.next(value)

    _t = setTimeout(() => {
      try {
        if (_throwError) throw _throwError
      } finally {
        if (_forceClose) next(null, { forceClose: true })
      }
    }, _timeout)
  }
}
