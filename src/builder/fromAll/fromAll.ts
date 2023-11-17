import { isFunction, isPlainObject } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { Observable } from "../../observable/observable/Observable.type.js"
import { createObservable } from "../../observable/observable/createObservable.js"
import { PF } from "../../pipe/pipe.type.js"
import { unWrapper } from "./unWrapper.js"

type FromAllConfigs = {
  factory?: (options: { value: any; observable: Observable; done: Func; unWrapper: Func<[], void> }) => any
}

export function fromAll<T = any>(pipes: PF[], values: any[], configs?: FromAllConfigs) {
  return createObservable<T>(pipes, async ob => {
    if (!Array.isArray(values)) throw "fromAll.params[1] 要发射的参数必须是数组"

    const { factory } = isPlainObject(configs) ? configs : ({} as any)
    const _f = isFunction(factory) ? factory : ({ unWrapper }: any) => unWrapper()

    const map = new Map<any, true>()
    const done = (v: any) => {
      if (ob.closed()) return map.clear()
      if (map.has(v)) return
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
