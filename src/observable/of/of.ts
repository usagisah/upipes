import { PF } from "../../pipe/pipe.type.js"
import { lazyObservable } from "../createObservable/lazyObservable.js"

export function of<T = any>(pipes: PF[], ...args: T[]) {
  return lazyObservable<T>(pipes, ob => {
    for (const arg of args) ob.call(arg)
    ob.close()
  })
}
