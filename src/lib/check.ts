export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === "function"
}

export function isString(value: unknown): value is string {
  return typeof value === "string"
}

export function isPlainObject<T extends Record<string, any>>(value: unknown): value is T {
  return Object.prototype.toString.call(value) === "[object Object]"
}

export function isNumber(value: unknown): value is number {
  return !Number.isNaN(value) && typeof value === "number"
}

export function isPromise<T = any>(value: unknown): value is Promise<T> {
  return Object.prototype.toString.call(value) === "[object Promise]"
}
