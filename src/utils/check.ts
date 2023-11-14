export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === "function"
}

export function isString(value: unknown): value is string {
  return typeof value === "string"
}

export function isPlainObject<T extends Record<string, any>>(value: unknown): value is T {
  return Object.prototype.toString.call(value) === "[object Object]"
}
