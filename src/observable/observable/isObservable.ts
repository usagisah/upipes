import { isPlainObject } from "../../lib/check.js"
import { Observable } from "./Observable.type.js"

export function isObservable<T = any>(value: unknown): value is Observable<T> {
  return isPlainObject(value) && value.__upipes_Observable__ === true
}
