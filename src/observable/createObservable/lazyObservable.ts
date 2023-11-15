import { Func } from "../../lib/type"
import { Pipe } from "../../pipe/pipe.type"
import { Observable, createObservable } from "./createObservable"

export function lazyObservable<T = any>(pipes: Pipe[], subscriber: Func<[Observable<T>], any>): Observable<T> {
  const ob: any = createObservable<T>(pipes)
  const recover = proxyMethods(ob, (type, ...args) => {
    const values = recover()
    ob[type](...args)

    for (const v of values) ob.call(v)
    try {
      subscriber(ob)
    } catch (e) {
      console.error(e)
    }
  })
  return ob
}

function proxyMethods(o: Observable<any>, proxySubscribe: Func<[string, ...any[]]>) {
  const values: any[] = []
  const origins = {
    call: o.call,
    then: o.then,
    catch: o.catch,
    finalize: o.finalize
  }

  o.call = (value: any) => (values.push(value), undefined)
  o.then = function then(...args: any[]): any {
    return proxySubscribe("then", ...args)
  }
  o.catch = function catchError(...args: any[]): any {
    return proxySubscribe("catch", ...args)
  }
  o.finalize = function finalize(...args: any[]): any {
    return proxySubscribe("finalize", ...args)
  }

  return function recover() {
    o.call = origins.call
    o.then = origins.then
    o.catch = origins.catch
    o.finalize = origins.finalize
    const _v = [...values]
    values.length = 0
    return _v
  }
}
