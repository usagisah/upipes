import { isFunction, isNumber } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { Pipe, PipeContext } from "../../pipe/pipe.type.js"

export function retry(countOrCheck?: Func<[PipeContext], boolean>): Pipe {
  let _max = Infinity
  let _count = 0
  let _check: any = ({ status }: any) => status === "fail" && _count < _max
  if (isNumber(countOrCheck)) _max = countOrCheck
  else if (isFunction(countOrCheck)) _check = countOrCheck

  return (ctx, next) => {
    const { status, value } = ctx
    if (status === "close") return next()

    _count++
    try {
      _check(ctx) ? next(value) : next(null, { forceClose: true })
    } catch (e) {
      console.error(e)
      _count--
    }
  }
}
