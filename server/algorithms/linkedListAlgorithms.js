/**
 * Linked List Algorithms Implementation & Educational Metadata
 */

class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  insertAtHead(val) {
    const newNode = new ListNode(val, this.head);
    this.head = newNode;
    this.size++;
    return this.head;
  }

  insertAtTail(val) {
    const newNode = new ListNode(val);
    if (!this.head) {
      this.head = newNode;
    } else {
      let curr = this.head;
      while (curr.next) {
        curr = curr.next;
      }
      curr.next = newNode;
    }
    this.size++;
    return this.head;
  }

  deleteByValue(val) {
    if (!this.head) return null;
    if (this.head.val === val) {
      this.head = this.head.next;
      this.size--;
      return true;
    }
    let curr = this.head;
    while (curr.next && curr.next.val !== val) {
      curr = curr.next;
    }
    if (curr.next) {
      curr.next = curr.next.next;
      this.size--;
      return true;
    }
    return false;
  }

  toArray() {
    const result = [];
    let curr = this.head;
    while (curr) {
      result.push(curr.val);
      curr = curr.next;
    }
    return result;
  }

  static fromArray(arr) {
    const list = new SinglyLinkedList();
    for (let i = arr.length - 1; i >= 0; i--) {
      list.insertAtHead(arr[i]);
    }
    return list;
  }
}

// 1. Reverse Linked List (Iterative)
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}

// 2. Reverse Linked List (Recursive)
function reverseListRecursive(head) {
  if (!head || !head.next) return head;
  const p = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return p;
}

// 3. Find Middle Node (Tortoise and Hare)
function findMiddle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

// 4. Detect Cycle (Floyd's Cycle Detection)
function hasCycle(head) {
  if (!head) return false;
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

module.exports = {
  ListNode,
  SinglyLinkedList,
  reverseList,
  reverseListRecursive,
  findMiddle,
  hasCycle,
  metadata: {
    reverseList: {
      name: 'Reverse Linked List',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Iterates through the linked list, redirecting each node next pointer backwards to its predecessor using three pointers: prev, curr, nextTemp.',
    },
    findMiddle: {
      name: 'Find Middle Node (Two Pointers)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Uses a slow pointer moving 1 step and a fast pointer moving 2 steps. When the fast pointer hits the end, the slow pointer is at the exact middle.',
    },
    hasCycle: {
      name: "Detect Cycle (Floyd's Tortoise & Hare)",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Traverses list with two pointers at different speeds. If a cycle exists, the fast pointer will eventually lap and meet the slow pointer.',
    },
  },
};
