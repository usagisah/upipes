import { LinkedList } from "./LinkedList.js"
import { SubscriberTypes } from "./Observable.type.js"

export class SubscriberManager {
  next = new LinkedList()
  error = new LinkedList()
  close = new LinkedList()
  validSubscribeSize = 0

  getSize(type: SubscriberTypes) {
    return this[type].size
  }
  clear() {
    ;[this.next, this.error, this.close].forEach(v => v.clear())
  }
  call(type: SubscriberTypes, value: any) {
    return this[type].call(value)
  }
  remove(type: SubscriberTypes, value: any) {
    if (type !== "close") this.validSubscribeSize--
    return this[type].remove(value)
  }
  add(type: SubscriberTypes, value: any) {
    const size = this.validSubscribeSize
    if (type !== "close") this.validSubscribeSize++
    
    return { firstSubscribe: size === 0, node: this[type].add(value) }
  }
}
