import { PipeNode } from "./pipeNode.js"

export function callCloseNext(node: PipeNode, value: any) {
  let index = 0
  while (node) {
    node.closed = true
    try {
      const ctx: any = {
        get status() {
          return "close"
        },
        get value() {
          return value
        }
      }

      const _index = index
      node.factory(
        ctx,
        v => {
          if (index === _index && v !== undefined) value = v
        },
        () => {}
      )
    } catch (e) {
      console.error(e)
    } finally {
      node = node.next as any
    }
  }
  return value
}
