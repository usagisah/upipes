import { definePipes } from "../../pipe/pipe"
import { Pipe, PipeContextStatus } from "../../pipe/pipe.type"
import { isFunction, isPlainObject } from "../../lib/check"
import { Func } from "../../lib/type"

const emptyFunc = () => null

export type Observable<T = any> = {
  call: (value?: T, type?: "fail") => void
  close: (fn?: (() => any) | undefined) => void
  closed: () => boolean
  then: (fn: Func<[T], void>, config?: SubscribeConfigs) => Func
  catch: (fn: Func<[any], void>, config?: SubscribeConfigs) => Func
  finalize: (fn: Func<[void], void>) => Func
  getValue: () => T
  resolveValue: () => Promise<T>
  __upipes_Observable__: true
}

export type SubscribeConfigs = {
  once?: boolean
}

export function createObservable<T>(pipes?: Pipe[]): Observable<T> {
  const subscriber: Record<PipeContextStatus, LinkedList> = {
    success: new LinkedList(),
    fail: new LinkedList(),
    close: new LinkedList()
  }

  let lastValue: any = undefined
  const pf = definePipes([
    ...(Array.isArray(pipes) ? pipes : []),
    function subPipe({ status, value }) {
      const list = subscriber[status]
      if (list.size === 0 && status === "fail") throw value
      list.call(value)
      lastValue = value
    }
  ])

  const call = (...args: any[]) => pf(...args)

  function subscribe(type: PipeContextStatus, fn: Func, config?: SubscribeConfigs): Func {
    if (!isFunction(fn)) return () => emptyFunc
    const { once = false } = isPlainObject(config) ? config : {}
    const unSubscribe = () => {
      subscriber[type].remove(node)
    }
    const _fn = once
      ? function (value: any) {
          try {
            fn(value)
          } finally {
            unSubscribe()
          }
        }
      : fn
    const node = subscriber[type].append(_fn)
    return unSubscribe
  }

  return {
    call,
    close: pf.close,
    closed: pf.closed,
    then: function then(fn: Func<[T], void>, config?: SubscribeConfigs): Func {
      return subscribe("success", fn, config)
    },
    catch: function catchError(fn: Func<[any], void>, config?: SubscribeConfigs): Func {
      return subscribe("fail", fn, config)
    },
    finalize: function finalize(fn: Func<[void], void>): Func {
      return subscribe("close", fn)
    },
    getValue: () => lastValue,
    resolveValue: async () => lastValue,
    __upipes_Observable__: true
  }
}

class Node {
  next: null | Node = null
  constructor(public value: any) {}
}

class LinkedList {
  head = new Node(null)
  size = 0

  append(value: any): Node {
    const node = new Node(value)
    let cur = this.head
    while (cur) {
      if (!cur.next) {
        cur.next = node
        this.size++
        break
      }
      cur = cur.next
    }
    return node
  }

  remove(node: Node): Node | null {
    let cur: null | Node = this.head
    while (cur) {
      if (cur.next === node) {
        cur.next = cur.next.next
        this.size--
        return node
      }
      cur = cur.next
    }
    return null
  }

  call(value: any) {
    let node = this.head.next
    while (node) {
      node.value(value)
      node = node.next
    }
  }
}
