export default class Queue {

  constructor(length) {
    this.store = [];
    this.length = length;
  }

  deserialize(serialized) {
    this.store = serialized.store;
    this.length = serialized.length;
    return this;
  }

  push(item) {
    this.store = [item].concat(this.store.slice(0, this.length - 1));
    return this;
  }

  peek(index) {
    if (index < this.store.length) {
      return this.store[index];
    }
    return undefined;
  }
  match(comparator) {
    return this.store.filter(comparator);
  }
}