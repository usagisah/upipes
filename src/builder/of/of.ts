import { createObservable } from "../../observable/observable/createObservable.js"
import { PF } from "../../pipe/pipe.type.js"

export function of<T = any>(pipes: PF[], ...args: T[]) {
  return createObservable<T>(pipes, ob => {
    for (const arg of args) ob.next(arg)
    ob.close()
  })
}
