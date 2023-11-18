import { isPlainObject } from "../lib/check.js"
import { Func } from "../lib/type.js"
import { callCloseNext } from "./closeNext.js"
import { CLOSE_ERROR } from "./constants.js"
import { PF, PipeConfigs, PipeContextStatus, Pipes } from "./pipe.type.js"
import { createPipeNext } from "./pipeNext.js"
import { createPipeNodes } from "./pipeNode.js"

export * from "./pipe.type.js"

export function createPipes<T = any>(pfs: PF[], configs?: PipeConfigs): Pipes {
  if (!Array.isArray(pfs)) throw "createPipes.params[0] 管道节点参数必须是一个数组"
  if (!isPlainObject(configs)) configs = {}
  const node = createPipeNodes(pfs)

  let pipeValue: T | undefined = undefined
  let pipeResolvePending: Func[] = []

  function done(value: any) {
    pipeValue = value
    for (const resolve of pipeResolvePending) resolve(value)
  }

  function close(v: any) {
    callCloseNext(node, v)
    done(undefined)
    return pipes
  }

  function callPipeNext(type: PipeContextStatus, value?: any) {
    if (node.closed) return console.error(CLOSE_ERROR)
    createPipeNext(node, { throwError: !!configs!.throwError, close, done, raw: { type, value } })(type, value)
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
