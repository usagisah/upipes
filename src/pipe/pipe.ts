import { isFunction, isPlainObject } from "../lib/check.js"
import { Func } from "../lib/type.js"
import { callCloseNext } from "./closeNext.js"
import { CLOSE_ERROR } from "./constants.js"
import { PF, PipeConfig, PipeConfigFinalize, PipeContextStatus, Pipes } from "./pipe.type.js"
import { createPipeNext } from "./pipeNext.js"
import { createPipeNodes } from "./pipeNode.js"

export * from "./pipe.type.js"

export function createPipes<R = any>(pfs: never[], option?: PipeConfigFinalize | PipeConfig): Pipes<R, R>
export function createPipes<A = any, R = A>(pfs: [PF<A, R>], option?: PipeConfigFinalize | PipeConfig): Pipes<A, R>
export function createPipes<A = any, B = A, R = B>(pfs: [PF<A, B>, PF<B, R>], option?: PipeConfigFinalize | PipeConfig): Pipes<A, R>
export function createPipes<A = any, B = A, C = B, R = C>(pfs: [PF<A, B>, PF<B, C>, PF<C, R>], option?: PipeConfigFinalize | PipeConfig): Pipes<A, R>
export function createPipes<A = any, B = A, C = B, D = C, R = D>(pfs: [PF<A, B>, PF<B, C>, PF<C, D>, PF<D, R>], option?: PipeConfigFinalize | PipeConfig): Pipes<A, R>
export function createPipes<A = any, B = A, C = B, D = C, E = D, R = E>(pfs: [PF<A, B>, PF<B, C>, PF<C, D>, PF<D, E>, PF<E, R>], option?: PipeConfigFinalize | PipeConfig): Pipes<A, R>
export function createPipes<A = any, B = A, C = B, D = C, E = D, F = E, R = F>(pfs: [PF<A, B>, PF<B, C>, PF<C, D>, PF<D, E>, PF<E, F>, PF<F, R>], option?: PipeConfigFinalize | PipeConfig): Pipes<A, R>
export function createPipes<A = any, B = A, C = B, D = C, E = D, F = E, G = F, R = G>(pfs: [PF<A, B>, PF<B, C>, PF<C, D>, PF<D, E>, PF<E, F>, PF<F, G>, PF<G, R>], option?: PipeConfigFinalize | PipeConfig): Pipes<A, R>
export function createPipes<A = any, B = A, C = B, D = C, E = D, F = E, G = F, H = G, R = H>(pfs: [PF<A, B>, PF<B, C>, PF<C, D>, PF<D, E>, PF<E, F>, PF<F, G>, PF<G, H>, PF<H, R>], option?: PipeConfigFinalize | PipeConfig): Pipes<A, R>
export function createPipes<A = any, B = A, C = B, D = C, E = D, F = E, G = F, H = G, I = H, R = I>(pfs: [PF<A, B>, PF<B, C>, PF<C, D>, PF<D, E>, PF<E, F>, PF<F, G>, PF<G, H>, PF<H, I>, PF<I, R>], option?: PipeConfigFinalize | PipeConfig): Pipes<A, R>
export function createPipes<A = any, B = A, C = B, D = C, E = D, F = E, G = F, H = G, I = H, J = I, R = J>(pfs: [PF<A, B>, PF<B, C>, PF<C, D>, PF<D, E>, PF<E, F>, PF<F, G>, PF<G, H>, PF<H, I>, PF<I, J>, PF<J, R>], option?: PipeConfigFinalize | PipeConfig): Pipes<A, R>
export function createPipes(pfs: PF<any, any>[], option?: PipeConfigFinalize | PipeConfig): Pipes<any, any>
export function createPipes(pfs: any[], option?: any): any {
  if (!Array.isArray(pfs)) throw "createPipes.params[0] 管道节点参数必须是一个数组"

  let config: PipeConfig = option
  if (isFunction(option)) config = { finalize: option }
  else if (!isPlainObject(option)) config = {}

  const node = createPipeNodes(pfs)

  let pipeValue: any
  let pipeResolvePending: Func[] = []

  const done: PipeConfigFinalize = (status, value) => {
    const _value = status === "close" ? undefined : value
    pipeValue = _value
    for (const resolve of pipeResolvePending) resolve(_value)
    try {
      if (isFunction(config.finalize)) config.finalize(status, value)
      else if (status === "error") throw value
    } catch (e) {
      return e
    }
  }

  const close = (v: any) => {
    v = callCloseNext(node, v)
    done("close", v)
    return pipes
  }

  const callPipeNext = (type: PipeContextStatus, value?: any) => {
    if (node.closed) return console.error(CLOSE_ERROR)
    createPipeNext(node, { throwError: !!config.throwError, close, done, raw: { type, value } })(type, value)
  }

  const pipes: Pipes = {
    next: v => {
      callPipeNext("success", v)
      return pipes
    },
    error: e => {
      callPipeNext("error", e)
      return pipes
    },
    close,
    closed: () => node.closed,
    resolve: () => {
      return new Promise<unknown>(resolve => {
        if (node.closed) return resolve(undefined)
        pipeResolvePending.push(resolve)
      })
    },
    value() {
      return pipeValue
    },
    get __upipes_pipes__() {
      return true
    }
  }

  return pipes
}
