/**
 * Queue Algorithms Implementation & Educational Metadata
 */

class Queue {
  constructor() {
    this.items = [];
    this.headIndex = 0;
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const item = this.items[this.headIndex];
    this.headIndex++;
    // Optimize memory after threshold
    if (this.headIndex > 100 && this.headIndex > this.items.length / 2) {
      this.items = this.items.slice(this.headIndex);
      this.headIndex = 0;
    }
    return item;
  }

  front() {
    if (this.isEmpty()) return null;
    return this.items[this.headIndex];
  }

  isEmpty() {
    return this.headIndex >= this.items.length;
  }

  size() {
    return this.items.length - this.headIndex;
  }
}

// Circular Queue Implementation
class MyCircularQueue {
  constructor(k) {
    this.capacity = k;
    this.queue = new Array(k);
    this.head = -1;
    this.tail = -1;
    this.size = 0;
  }

  enQueue(value) {
    if (this.isFull()) return false;
    if (this.isEmpty()) this.head = 0;
    this.tail = (this.tail + 1) % this.capacity;
    this.queue[this.tail] = value;
    this.size++;
    return true;
  }

  deQueue() {
    if (this.isEmpty()) return false;
    if (this.head === this.tail) {
      this.head = -1;
      this.tail = -1;
    } else {
      this.head = (this.head + 1) % this.capacity;
    }
    this.size--;
    return true;
  }

  Front() {
    if (this.isEmpty()) return -1;
    return this.queue[this.head];
  }

  Rear() {
    if (this.isEmpty()) return -1;
    return this.queue[this.tail];
  }

  isEmpty() {
    return this.size === 0;
  }

  isFull() {
    return this.size === this.capacity;
  }
}

module.exports = {
  Queue,
  MyCircularQueue,
  metadata: {
    CircularQueue: {
      name: 'Circular Queue (Ring Buffer)',
      timeComplexity: 'EnQueue: O(1), DeQueue: O(1)',
      spaceComplexity: 'O(k)',
      explanation: 'Uses a fixed-size buffer with modulo arithmetic to reuse empty spaces created by dequeues, preventing memory fragmentation.',
    },
  },
};
