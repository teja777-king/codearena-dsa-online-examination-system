/**
 * Stack Algorithms Implementation & Educational Metadata
 */

class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}

// 1. Balanced Parentheses Validator
function isValidParentheses(s) {
  const stack = [];
  const map = {
    ')': '(',
    '}': '{',
    ']': '[',
  };

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (map[char]) {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}

// 2. Next Greater Element
function nextGreaterElement(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // stores indices

  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}

// 3. Min Stack with O(1) getMin
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  push(val) {
    this.stack.push(val);
    if (this.minStack.length === 0 || val <= this.getMin()) {
      this.minStack.push(val);
    }
  }

  pop() {
    if (this.stack.length === 0) return null;
    const val = this.stack.pop();
    if (val === this.getMin()) {
      this.minStack.pop();
    }
    return val;
  }

  top() {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }

  getMin() {
    return this.minStack.length > 0 ? this.minStack[this.minStack.length - 1] : null;
  }
}

module.exports = {
  Stack,
  MinStack,
  isValidParentheses,
  nextGreaterElement,
  metadata: {
    isValidParentheses: {
      name: 'Valid Parentheses Check',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: 'Pushes opening brackets to stack; for every closing bracket, pops from stack and verifies matching pair. Ensures LIFO property.',
    },
    nextGreaterElement: {
      name: 'Next Greater Element (Monotonic Stack)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: 'Maintains a monotonic decreasing stack of indices. When a larger element is found, it resolves previously unresolved smaller elements.',
    },
  },
};
