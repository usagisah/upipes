import { isPlainObject } from "../../lib/check"
import { Observable } from "./createObservable"

export function isObservable<T = any>(value: unknown): value is Observable<T> {
  return isPlainObject(value) && value.__upipes_Observable__ === true
}