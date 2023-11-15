import { isFunction } from "../lib/check.js"
import { Pipe, PipeContextStatus, PipeFactory, PipeNextOptions } from "./pipe.type.js"

export * from "./pipe.type.js"

class PipeNode {
  closed = false
  prev: PipeNode | null = null
  next: PipeNode | null = null
  constructor(public pipe: Pipe) {}
}

function createPipeNodes(pipes: Pipe[]): PipeNode {
  const head = new PipeNode(() => null)
  let node = head
  for (const pipe of pipes) {
    if (!isFunction(pipe)) {
      console.error(`传递的 pipes 选项不是一个合法函数，已经自动跳过该项`, pipe)
      continue
    }
    const n = new PipeNode(pipe)
    node.next = n
    n.prev = node
    node = n
  }
  return head
}

type Context = { close: any }

function createNext(node: PipeNode, ctx: Context) {
  return function next(status: PipeContextStatus, value: any, options?: PipeNextOptions) {
    let { closed, next } = node
    if (closed) return console.error("管道流已经关闭, next 调用失败"), undefined

    const { skip, loop, forceClose } = options ?? {}
    if (status !== "close" && forceClose) return ctx.close()

    if (loop) {
      if (status === "close") return (node.closed = true), undefined

      let _node = node
      while (_node.prev) _node = _node.prev
      createNext(_node, ctx)("success", value)
    }

    try {
      if (skip) return

      if (!next) {
        if (status === "fail") throw value
        return
      }

      const pipeNext = createNext(next, ctx)
      const pipeContext = {
        get status() {
          return status
        },
        get value() {
          return value
        }
      }
      try {
        next.pipe(pipeContext, pipeNext.bind(null, status === "close" ? status : "success"))
      } catch (e) {
        if (status !== "close") pipeNext("fail", e)
        else console.error(e), pipeNext!("close", undefined)
      }
    } finally {
      if (status === "close") node.closed = true
    }
  }
}

export function definePipes(pipes: Pipe[]) {
  const node = createPipeNodes(pipes)

  let nodeClosed = node.closed

  function factory(value: any, type: string) {
    if (nodeClosed) throw new Error("the pipe has been closed")
    return createNext(node, { close })(type === "fail" ? type : "success", value)
  }

  function close(fn: any) {
    if (nodeClosed) return
    nodeClosed = true
    createNext(node, { close })("close", undefined)
    if (isFunction(fn)) {
      try {
        fn()
      } catch (e) {
        console.error(e)
      }
    }
  }
  factory.close = close
  factory.closed = () => nodeClosed

  return factory as PipeFactory
}
