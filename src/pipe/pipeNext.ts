import { PipeBuiltinContext, PipeContextStatus, PipeNextOptions } from "./pipe.type.js"
import { PipeNode } from "./pipeNode.js"

export function createPipeNext(node: PipeNode, ctx: PipeBuiltinContext) {
  return function next(status: PipeContextStatus, value: any, options?: PipeNextOptions) {
    const { closed, next } = node

    if (closed) return console.error("管道流已经关闭, next 调用失败"), undefined

    const { skip, loop, forceClose } = options ?? {}
    if (forceClose) return ctx.close()
    if (skip) return
    if (loop) {
      const { type, value } = ctx.raw
      let _node = node
      while (_node.prev) _node = _node.prev
      createPipeNext(_node, ctx)(type, value)
      return
    }
    if (!next) {
      if (status === "error") console.error(value)
      return ctx.done(value)
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
      next.factory(pipeContext, pipeNext.bind(null, "success"))
    } catch (e) {
      pipeNext("error", e)
    }
  }
}
