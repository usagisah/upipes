import { Pipe } from "../../pipe/pipe.type"
import { lazyObservable } from "../createObservable/lazyObservable"

export function of<T = any>(pipes: Pipe[], ...args: T[]) {
  return lazyObservable<T>(pipes, ob => {
    for (const arg of args) {
      ob.call(arg)
      ob.close()
    }
  })
}
