class Node {
  constructor(
    public value: any,
    public next: Node | null = null,
    public prev: Node | null = null
  ) {}
}

export class LinkedList {
  head = new Node(null)
  tail = new Node(null)
  size = 0

  constructor() {
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  add(value: any): Node {
    const node = new Node(value, this.tail, this.tail.prev)
    this.tail.prev!.next = node
    this.tail.prev = node
    this.size++
    return node
  }

  remove(value: any): Node | null {
    let result = null
    let cur = this.head.next
    while (cur && cur.value !== null) {
      if (cur.value === value) {
        cur.prev!.next = cur.next
        cur.next!.prev = cur.prev
        result = cur
        this.size--
        break
      }
      cur = cur.next
    }
    return result
  }

  call(value: any) {
    let node = this.head.next
    while (node && node.value) {
      node.value(value)
      node = node.next
    }
    return this
  }

  clear() {
    this.head.next = this.tail
    this.tail.prev = this.head
    this.size = 0
  }
}
