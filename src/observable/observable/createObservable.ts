import { isFunction, isPlainObject } from "../../lib/check.js"
import { CLOSE_ERROR } from "../../pipe/constants.js"
import { createPipes } from "../../pipe/pipe.js"
import { PF } from "../../pipe/pipe.type.js"
import { Observable, ObservableConfig, SubscribeConfigs, SubscribeNext, SubscribeOperates, SubscriberTypes, UnSubscribe } from "./Observable.type.js"
import { SubscriberManager } from "./Subscribers.js"
import { CashEmitter, EmitTypes } from "./cashEmitter.js"

export function createObservable<T = any>(pfs: PF[], provider?: ((o: Observable<T>) => any) | null, config?: ObservableConfig): Observable<T> {
  const subscriberManager = new SubscriberManager()

  if (!isPlainObject(config)) config = {}
  const pipes = createPipes(pfs, {
    ...config,
    finalize(status, value) {
      const type = status === "success" ? "next" : status

      if (status === "error" && subscriberManager.getSize("error") === 0) throw value
      subscriberManager.call(type, value)
      if (status === "close") {
        subscriberManager.clear()
        emitter.clear()
        pendingResolveSize = 0
      }
    }
  })

  const { next, error, resolve, closed } = pipes
  const originMethods = { next, error, resolve } as const
  const emitter = new CashEmitter(originMethods)
  pipes.next = proxyMethod.bind(null, "next")
  pipes.error = proxyMethod.bind(null, "error")

  let pendingResolveSize = 0
  pipes.resolve = () => {
    pendingResolveSize++
    return originMethods.resolve().then(res => (pendingResolveSize--, res))
  }

  function proxyMethod(type: EmitTypes, value: any) {
    if (closed()) return console.error(CLOSE_ERROR), pipes
    if (subscriberManager.validSubscribeSize > 0 || pendingResolveSize > 0) return originMethods[type](value)
    emitter.add({ type, value })
    return pipes
  }

  function subscribe<T = any>(next: SubscribeNext<T>, config?: SubscribeConfigs): UnSubscribe
  function subscribe<T = any>(subscribeOperates: SubscribeOperates<T>, config?: SubscribeConfigs): UnSubscribe
  function subscribe(operate: any, config?: SubscribeConfigs): UnSubscribe {
    if (closed()) return console.error(CLOSE_ERROR), function unSubscribe() {}

    const subscribeOperates: Record<SubscriberTypes, any> = {} as any
    if (isFunction(operate)) subscribeOperates.next = operate
    else if (isPlainObject(operate)) {
      if (isFunction(operate.next)) subscribeOperates.next = operate.next
      if (isFunction(operate.error)) subscribeOperates.error = operate.error
      if (isFunction(operate.close)) subscribeOperates.close = operate.close
    } else {
      throw "无效的订阅操作"
    }

    const { once = false } = isPlainObject(config) ? config : {}
    const unSubscribe = () => {
      for (const _type in subscribeOperates) {
        const type = _type as SubscriberTypes
        subscriberManager.remove(type, subscribeOperates[type])
      }
    }

    let firstSubscribe = false
    for (const _type in subscribeOperates) {
      const type = _type as SubscriberTypes
      const fn = subscribeOperates[type]
      const subscriber = function (value: any) {
        try {
          fn(value)
        } catch (e) {
          console.error(e)
        }
        if (once) unSubscribe()
      }
      subscribeOperates[type] = subscriber

      const res = subscriberManager.add(type, subscriber)
      if (!firstSubscribe) firstSubscribe = res.firstSubscribe
    }

    emitter.emit()

    if (firstSubscribe) {
      if (!isFunction(provider)) return unSubscribe
      try {
        provider(pipes as any)
      } catch (e) {
        console.error(e)
      }
    }

    return unSubscribe
  }

  Object.defineProperties(pipes, {
    subscribe: {
      configurable: true,
      enumerable: true,
      writable: true,
      value: subscribe
    },
    __upipes_Observable__: {
      enumerable: true,
      get: () => true
    }
  })

  return pipes as any
}
