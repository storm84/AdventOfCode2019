class LinkedList {
  /** @type number */
  length;
  /** @type {LinkedListItem} */
  first;
  /** @type {LinkedListItem} */
  last;
  /** @type {boolean} */
  doesCycle;

  /**
   * @param {any[]} array
   * @param {boolean} doesCycle Whether the start and the end are connected (default: false)
   */
  constructor(array, doesCycle = false) {
    const items = array.map(x => new LinkedListItem(this, x));

    this.first = items[0];
    this.last = items[items.length - 1];
    this.length = array.length;

    items.reduce((a, b) => {
      a.next = b;
      b.prev = a;
      return b;
    });

    if (doesCycle) {
      this.first.prev = this.last;
      this.last.next = this.first;
    }

    this.doesCycle = doesCycle;
  }

  toItemArray() {
    const arr = [];

    for (let i = 0, item = this.first; i < this.length; i++, item = item.next) {
      arr.push(item);
    }

    return arr;
  }

  toArray() {
    return this.toItemArray().map(x => x.value);
  }

  assertValid() {
    const arr = this.toItemArray();
    if (arr[0] !== this.first) {
      throw new Error("Wrong first item");
    }

    if (arr[arr.length - 1] !== this.last) {
      throw new Error("Wrong last item");
    }

    if (arr.length !== this.length) {
      throw new Error("Wrong length");
    }

    if (this.doesCycle) {
      if (this.first.prev !== this.last) {
        throw new Error("Wrong first.prev (expected last)");
      }
      if (this.last.next !== this.first) {
        throw new Error("Wrong last.next (expected first)");
      }
    } else {
      if (this.first.prev !== undefined) {
        throw new Error("Wrong first.prev (expected undefined)");
      }
      if (this.last.next !== undefined) {
        throw new Error("Wrong last.next (expected undefined)");
      }
    }

    arr.reduce((a, b, i) => {
      if (a.next !== b) {
        throw new Error(`array[${i}].next !== array[${i + 1}]`);
      }
      if (a !== b.prev) {
        throw new Error(`array[${i}] !== array[${i + 1}].prev`);
      }

      return b;
    });
  }
}

class LinkedListItem {
  value;
  /** @type {LinkedList} */
  list;

  /**
   * @param {LinkedList} list
   * @param {*} value
   */
  constructor(list, value) {
    this.list = list;
    this.value = value;
  }

  /** @type {LinkedListItem|undefined} */
  prev;
  /** @type {LinkedListItem|undefined} */
  next;

  remove() {
    if (this.list.first === this) {
      this.list.first = this.next;
    }

    if (this.list.last === this) {
      this.list.last = this.prev;
    }

    if (this.prev) {
      this.prev.next = this.next;
    }

    if (this.next) {
      this.next.prev = this.prev;
    }

    this.list.length--;
  }

  /**
   * Return the item that was inserted
   * @param {*} value
   */
  insertBefore(value) {
    const item = new LinkedListItem(this.list, value);
    item.next = this;
    item.prev = this.prev;
    this.prev.next = item;
    this.prev = item;

    if (this.list.first === this) {
      this.list.first = item;
    }

    this.list.length++;
    return item;
  }

  /**
   * Return the item that was inserted
   * @param {*} value
   */
  insertAfter(value) {
    const item = new LinkedListItem(this.list, value);
    item.prev = this;
    item.next = this.next;
    this.next.prev = item;
    this.next = item;

    if (this.list.last === this) {
      this.list.last = item;
    }

    this.list.length++;
    return item;
  }

  /**
   * @param {number} steps
   */
  getNext(steps) {
    let item = this;
    for (let i = 0; i < steps && item; i++) {
      item = item.next;
    }

    return item;
  }

  /**
   * @param {number} steps
   */
  getPrev(steps) {
    let item = this;
    for (let i = 0; i < steps && item; i++) {
      item = item.prev;
    }

    return item;
  }
}

exports.LinkedList = LinkedList;
exports.LinkedListItem = LinkedListItem;
