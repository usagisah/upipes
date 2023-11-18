import { isPlainObject } from "../lib/check.js"
import { PipeBuiltinContext, PipeContextStatus, PipeNextOptions } from "./pipe.type.js"
import { PipeNode } from "./pipeNode.js"

export function createPipeNext(node: PipeNode, ctx: PipeBuiltinContext) {
  return function next(status: PipeContextStatus, value: any, options?: PipeNextOptions) {
    const { closed, next } = node
    if (closed) {
      const msg = "管道流已经关闭, next 调用失败"
      if (ctx.throwError) throw msg
      return console.error(msg), undefined
    }

    if (!isPlainObject(options)) options = {}
    const { forceClose, skip, loop } = options

    if (forceClose) return ctx.close()
    if (skip) return ctx.done(status, value), undefined
    if (loop) {
      const { type, value } = ctx.raw
      let _node = node
      while (_node.prev) _node = _node.prev
      createPipeNext(_node, ctx)(type, value)
      return
    }
    if (!next) {
      const err = ctx.done(status, value)
      if (err === undefined) return
      if (status === "error") {
        if (ctx.throwError) throw err
        console.error(err)
      }
      return
    }

    const pipeNext = createPipeNext(next, ctx)
    const pipeContext = {
      get status() {
        return status
      },
      get value() {
        return value
      }
    }
    try {
      next.factory(pipeContext, pipeNext.bind(null, "success"), pipeNext.bind(null, "error"))
    } catch (e) {
      pipeNext("error", e)
    }
  }
}
