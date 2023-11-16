import { Pipe, PipeContext, PipeNext } from "../index.js"

export function nextValue(_value?: any): Pipe {
  return ({ value }, next) => {
    next(_value ?? value)
  }
}

export function passValue({ status, value }: PipeContext, next: PipeNext) {
  if (status === "fail") throw value
  if (status === "close") return next(value)
  next(value)
}

export function passError(value: any): Pipe {
  return ({ status }, next) => {
    if (status !== "close") throw value
    next(value)
  }
}

export function silentConsoleError(fn: any = () => null) {
  const origin = console.error
  console.error = fn
  return function restore() {
    console.error = origin
  }
}