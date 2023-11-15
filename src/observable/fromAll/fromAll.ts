import { isFunction, isPlainObject } from "../../lib/check"
import { Func } from "../../lib/type"
import { unWrapper } from "../../lib/unWrapper"
import { Pipe } from "../../pipe/pipe.type"
import { Observable } from "../createObservable/createObservable"
import { lazyObservable } from "../createObservable/lazyObservable"

type FromAllConfigs = {
  factory?: (options: { value: unknown; observable: Observable; done: Func; unWrapper: Func }) => any
}

export function fromAll<T = any>(pipes: Pipe[], values: any[], configs?: FromAllConfigs) {
  return lazyObservable<T>(pipes, async ob => {
    if (!Array.isArray(values)) ob.close()

    const { factory } = isPlainObject(configs) ? configs : ({} as any)
    const _f = isFunction(factory) ? factory : ({ unWrapper }: any) => unWrapper()

    const map = new Map<any, true>()
    const done = (v: any) => {
      if (ob.closed() || map.has(v)) return
      if (map.size === values.length) {
        ob.close()
        map.clear()
        return
      }
      map.set(v, true)
    }
    for (const value of values) {
      if (ob.closed()) return
      _f({ value, observable: ob, done: done.bind(null, value), unWrapper: unWrapper.bind(null, value, ob, done.bind(value)) })
    }
  })
}
