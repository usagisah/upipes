import { isFunction, isPromise } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { Observable } from "../../observable/observable/Observable.type.js"
import { isObservable } from "../../observable/observable/isObservable.js"

export async function unWrapper(value: unknown, ob: Observable, done: Func) {
  if (Array.isArray(value)) {
    for (const v of value) ob.next(v)
    done()
  } else if (isPromise(value)) {
    ob.next(await value)
    done()
  } else if (isFunction(value)) {
    try {
      value = value()
      if (isPromise(value)) value = await value
      ob.next(value)
    } catch (e) {
      ob.error(e)
    } finally {
      done()
    }
  } else if (isObservable(value)) {
    value.subscribe({
      next: ob.next,
      error: ob.error,
      close: done
    })
  } else {
    ob.next(value)
    done()
  }
}
