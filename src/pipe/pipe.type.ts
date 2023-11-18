import { Func } from "../lib/type.js"

export type PipeContextStatus = "success" | "error" | "close"
export type PipeContext = {
  readonly status: PipeContextStatus
  readonly value: any
}

// 优先级，从上到下
export type PipeNextOptions = {
  forceClose?: boolean
  skip?: boolean
  loop?: boolean
}
export type PipeBuiltinContext<T = any> = { throwError: boolean; close: any; done: Func<[any], void>; raw: { type: PipeContextStatus; value: T } }
export type PipeNext = (value?: any, options?: PipeNextOptions) => void

export type PipeFactory = (context: PipeContext, next: PipeNext) => any
export type PF = PipeFactory

export type PipeConfigs = {
  throwError?: boolean
}

export interface Pipes<T = any> {
  next: (value?: T) => Pipes<T>
  error: (error?: any) => Pipes<T>
  close: (value?: T) => Pipes<T>
  closed: () => boolean
  value: () => T
  resolve: () => Promise<T>
  readonly __upipes_pipes__: boolean
}
