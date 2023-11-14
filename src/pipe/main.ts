/* 
泛型
隐式继承
一次性订阅
有默认值
多个订阅者
*/

export type PipeContextStatus = "success" | "fail" | "close"
export type PipeContext = {
  readonly status: PipeContextStatus
  readonly value: any
}
export type PipeFactory = (context: PipeContext, next: PipeNext) => any
export type PipeNextOptions = {
  skip?: boolean
  loop?: boolean
}
export type PipeNext = (value: any, options?: PipeNextOptions) => void

class PipeNode {
  closed = false
  prev: PipeNode | null = null
  next: PipeNode | null = null
  constructor(public factory: PipeFactory) {}
}

function createPipeNodes(pipeFactories: PipeFactory[]): PipeNode {
  const head = new PipeNode(() => null)
  let node = head
  for (const pipeFactory of pipeFactories) {
    const n = new PipeNode(pipeFactory)
    node.next = n
    n.prev = node
    node = n
  }
  return head
}

function createNext(node: PipeNode) {
  return function next(
    status: PipeContextStatus,
    value: any,
    options?: PipeNextOptions
  ) {
    const { skip, loop } = options ?? {}
    if (loop) {
      let _node = node
      while (_node.prev) _node = _node.prev
      createNext(_node)("success", value)
    }

    if (!node.next) {
      if (status === "fail") throw value
      return
    }

    if (node.closed) throw "the pipe has been closed"

    if (skip) return

    const pipeNext = createNext(node.next)
    try {
      node.next.factory(
        {
          get status() {
            return status
          },
          get value() {
            return value
          }
        },
        pipeNext.bind(null, "success")
      )
    } catch (e) {
      pipeNext("fail", e)
    }
  }
}

export function definePipes(pipeFactories: PipeFactory[]) {
  const node = createPipeNodes(pipeFactories)
  function factory(value: any) {
    return createNext(node)("success", value)
  }

  factory.close = () => {}

  factory.closed = () => node.closed

  return factory
}
