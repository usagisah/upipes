import { Func } from "../lib/type.js"
import { callCloseNext } from "./closeNext.js"
import { PF, PipeContextStatus, Pipes } from "./pipe.type.js"
import { createPipeNext } from "./pipeNext.js"
import { createPipeNodes } from "./pipeNode.js"

export * from "./pipe.type.js"

export function createPipes<T = any>(pfs: PF[]): Pipes {
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
    if (node.closed) return console.error("the pipe has been closed")
    createPipeNext(node, { close, done, raw: { type, value } })(type, value)
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
    }
  }

  return pipes
}
