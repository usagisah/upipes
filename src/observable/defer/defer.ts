import { Pipe } from "../../pipe/pipe.type";
import { isNumber } from "../../lib/check";
import { lazyObservable } from "../createObservable/lazyObservable";

export function defer<T = any>(pipes: Pipe[], timeout = 0, value?: T) {
  return lazyObservable<T | undefined>(pipes, ob => {
    setTimeout(() => {
      ob.call(value)
      ob.close()
    }, isNumber(timeout) ? timeout : 0)
  })
}