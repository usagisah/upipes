import { isFunction } from "../utils/check"
import { Pipe, PipeContextStatus, PipeFactory, PipeNextOptions } from "./pipe.type"

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

function createNext(node: PipeNode) {
  return function next(status: PipeContextStatus, value: any, options?: PipeNextOptions) {
    let { closed, next } = node
    if (closed) return console.error("管道流已经关闭, next 调用失败"), undefined

    const { skip, loop } = options ?? {}
    if (loop) {
      if (status === "close") return (node.closed = true), undefined

      let _node = node
      while (_node.prev) _node = _node.prev
      createNext(_node)("success", value)
    }

    try {
      if (!next) {
        if (status === "fail") throw value
        return
      }

      if (skip) return

      const pipeNext = createNext(next)
      try {
        next.pipe(
          {
            get status() {
              return status
            },
            get value() {
              return value
            }
          },
          pipeNext.bind(null, status === "close" ? "close" : "success")
        )
      } catch (e) {
        if (status !== "close") pipeNext("fail", e)
        else {
          console.error("pipe close 过程发现错误", e)
          pipeNext("close", null)
        }
      }
    } finally {
      if (status === "close") node.closed = true
    }
  }
}

export function definePipes(pipes: Pipe[]) {
  const node = createPipeNodes(pipes)

  let nodeClosed = node.closed

  function factory(value: any) {
    if (nodeClosed) {
      throw "the pipe has been closed"
    }
    return createNext(node)("success", value)
  }

  factory.close = (fn: any) => {
    if (nodeClosed) return
    nodeClosed = true
    createNext(node)("close", null)
    if (isFunction(fn)) {
      try {
        fn()
      } catch (e) {
        console.error("pipe close 执行出错:", e)
      }
    }
  }

  factory.closed = () => nodeClosed

  return factory as PipeFactory
}
