import { isFunction } from "../lib/check.js"
import { PF } from "./pipe.type.js"

export class PipeNode {
  closed = false
  prev: PipeNode | null = null
  next: PipeNode | null = null
  constructor(public factory: PF) {}
}

export function createPipeNodes(pipes: PF[]): PipeNode {
  const head = new PipeNode(() => {})
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
