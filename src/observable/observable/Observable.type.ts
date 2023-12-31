import { Func } from "../../lib/type.js"
import { PipeConfig, Pipes } from "../../pipe/pipe.type.js"

export type SubscribeConfigs = {
  once?: boolean
}
export type UnSubscribe = Func<[], void>
export type SubscribeNext<T> = Func<[T], any>
export type SubscribeError = Func<[any], any>
export type SubscribeClose<T> = Func<[T], any>
export type SubscribeOperates<T> = {
  next?: SubscribeNext<T>
  error?: SubscribeError
  close?: SubscribeClose<T>
}
export type SubscriberTypes = "next" | "error" | "close"

export interface Observable<T = any> extends Pipes<T> {
  subscribe: {
    <T = any>(next: Func<[T], any>, config?: SubscribeConfigs | undefined): UnSubscribe
    <T = any>(subscribeOperates: SubscribeOperates<T>, config?: SubscribeConfigs | undefined): UnSubscribe
  }
  next: (value?: T) => Observable<T>
  error: (error?: any) => Observable<T>
  close: (value?: T) => Observable<T>
  readonly __upipes_Observable__: boolean
}

export interface ObservableConfig extends PipeConfig {}
