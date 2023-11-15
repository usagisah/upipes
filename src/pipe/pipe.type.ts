export type PipeContextStatus = "success" | "fail" | "close"
export type PipeContext = {
  readonly status: PipeContextStatus
  readonly value: any
}

export type PipeNextOptions = {
  skip?: boolean
  loop?: boolean
  forceClose?: boolean
}
export type PipeNext = (value?: any, options?: PipeNextOptions) => void

export type Pipe = (context: PipeContext, next: PipeNext) => any

export interface PipeFactory {
  (value?: any, type?: "fail"): void
  closed: () => boolean
  close: (fn?: () => any) => void
}
