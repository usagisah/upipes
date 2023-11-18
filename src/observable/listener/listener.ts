import { isFunction, isPromise } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { createPipes } from "../../pipe/pipe.js"
import { PF, Pipes } from "../../pipe/pipe.type.js"

export type ProxyListener<T> = T & {
  readonly pipes: Pipes
  readonly __upipes_Listener__: boolean
}

const nextValue = (v1: unknown, v2: unknown) => (v1 === undefined ? v2 : v1)
export function listenerCallback(fn: Func): PF {
  return async (ctx, next) => {
    const { status, value } = ctx
    if (status === "error") throw value
    if (status === "close") return
    const res = fn(value)
    isPromise(res) ? res.then(res => nextValue(res, value)) : next(nextValue(res, value))
  }
}

export function createListener<T extends readonly any[] = any[], R = any, P = any>(pfs: PF<P>[], fn?: (...args: T) => R): [(...args: T) => Promise<R>, Pipes<P>] {
  const _pfs = [...pfs]
  if (isFunction(fn)) _pfs.push(listenerCallback(fn))
  const pipes = createPipes(_pfs)

  async function proxyMethod() {
    try {
      const res = pipes.resolve()
      pipes.next(arguments.length === 1 ? arguments[0] : arguments)
      return res
    } catch (e) {
      pipes.error(e)
    }
  }
  Object.defineProperties(proxyMethod, {
    pipes: {
      get: () => pipes,
      enumerable: true
    },
    __upipes_Listener__: {
      get: () => true,
      enumerable: true
    }
  })
  return [proxyMethod as any, pipes]
}
