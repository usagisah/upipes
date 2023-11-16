import { createObservable, map } from "../../index.js"
import { isNumber, isPlainObject, isString } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { Pipe } from "../../pipe/pipe.type.js"

type Config = {
  timeout?: number
  throwError?: string
  forceClose?: boolean
}

export function timeoutMap(fn: Func<[any]>, timeout?: number): Pipe
export function timeoutMap(fn: Func<[any]>, config?: Config): Pipe
export function timeoutMap(fn: Func<[any]>, timeoutOrConfig?: number | Config): Pipe {
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
    if (status === "fail") throw value
    if (status === "close") return next(value)

    const o = createObservable([map(fn)])
    o.then(next)
    o.catch(e => {
      o.close()
      console.error(e)
    })
    o.finalize(() => {
      clearTimeout(_t)
      _t = null
    })
    o.call(value)

    _t = setTimeout(() => {
      try {
        if (_throwError) throw _throwError
      } finally {
        if (_forceClose) next(null, { forceClose: true })
      }
    }, _timeout)
  }
}
