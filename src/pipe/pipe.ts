import { isFunction, isPlainObject } from "../lib/check.js"
import { Func } from "../lib/type.js"
import { callCloseNext } from "./closeNext.js"
import { CLOSE_ERROR } from "./constants.js"
import { PF, PipeConfig, PipeConfigFinalize, PipeContextStatus, Pipes } from "./pipe.type.js"
import { createPipeNext } from "./pipeNext.js"
import { createPipeNodes } from "./pipeNode.js"

export * from "./pipe.type.js"

export function createPipes<T = any>(pfs: PF<T>[]): Pipes
export function createPipes<T = any>(pfs: PF<T>[], finalize: PipeConfigFinalize): Pipes
export function createPipes<T = any>(pfs: PF<T>[], config: PipeConfig): Pipes
export function createPipes<T = any>(pfs: PF<T>[], option?: any): Pipes {
  if (!Array.isArray(pfs)) throw "createPipes.params[0] 管道节点参数必须是一个数组"

  let config: PipeConfig = option
  if (isFunction(option)) config = { finalize: option }
  else if (!isPlainObject(option)) config = {}

  const node = createPipeNodes(pfs)

  let pipeValue: T | undefined = undefined
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
