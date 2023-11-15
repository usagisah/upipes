import { Pipe } from "../../pipe/pipe.type"
import { lazyObservable } from "../createObservable/lazyObservable"

export function of(pipes: Pipe[], ...args: any[]) {
  return lazyObservable(pipes, ob => {
    for (const arg of args) {
      ob.call(arg)
      ob.close()
    }
  })
}
