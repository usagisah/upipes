import { isNumber } from "../../lib/check.js"
import { Pipe } from "../../pipe/pipe.type.js"
import { map } from "../map/map.js"

export function delay(timeout: number): Pipe {
  return map(value => {
    return new Promise<any>(resolve => {
      setTimeout(() => resolve(value), isNumber(timeout) ? timeout : 0)
    })
  })
}
