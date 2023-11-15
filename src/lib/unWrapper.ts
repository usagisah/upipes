import { Observable } from "../observable/createObservable/createObservable.js"
import { isObservable } from "../observable/createObservable/isObservable.js"
import { isFunction, isPromise } from "./check.js"
import { Func } from "./type.js"

export async function unWrapper(value: unknown, ob: Observable, done: Func) {
  if (Array.isArray(value)) {
    for (const v of value) ob.call(v)
    done()
  } else if (isPromise(value)) {
    ob.call(await value)
    done()
  } else if (isFunction(value)) {
    try {
      value = value()
      if (isPromise(value)) value = await value
      ob.call(value)
    } catch (e) {
      try {
        ob.call(e, "fail")
      } catch (e) {
        console.error(e)
      }
    } finally {
      done()
    }
  } else if (isObservable(value)) {
    value.then(ob.call)
    value.finalize(done)
  } else {
    ob.call(value)
    done()
  }
}
