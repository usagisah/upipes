import { isFunction, isNumber } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { Pipe, PipeContext } from "../../pipe/pipe.type.js"

export function retry(countOrCheck?: number | Func<[PipeContext], boolean>): Pipe {
  let _max = 0
  let _count = 0
  let _check: any = ({ status }: any) => status === "fail" && _count < _max
  if (isNumber(countOrCheck)) _max = countOrCheck
  else if (isFunction(countOrCheck)) _check = countOrCheck

  return (ctx, next) => {
    const { status, value } = ctx
    if (status === "close") return next()

    try {
      if (_check(ctx)) {
        _count++
        return next(null, { loop: true })
      }

      next(value)
      _count--
    } catch (e) {
      console.error(e)
      _count--
    } finally {
      if (_count < 0) _count = 0
    }
  }
}
