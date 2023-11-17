export type EmitTypes = "next" | "error"

type PendingEmit = { type: EmitTypes; value: any }

export class CashEmitter {
  pending: PendingEmit[] = []

  constructor(public originMethods: Record<EmitTypes, any>) {}

  add(p: PendingEmit) {
    this.pending.push(p)
  }

  emit() {
    const params = [...this.pending]
    this.clear()
    for (const { type, value } of params) this.originMethods[type](value)
  }

  clear() {
    this.pending = []
  }
}
