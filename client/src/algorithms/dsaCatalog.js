export const dsaCatalog = [
  {
    category: 'Arrays',
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Finds the contiguous subarray with the largest sum in O(n) linear time by dynamically deciding whether to start a new subarray or extend current sum.',
    code: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currentMax = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currentMax);
  }
  
  return maxSoFar;
}`,
    exampleInput: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
    exampleOutput: '6 (subarray: [4, -1, 2, 1])',
  },
  {
    category: 'Arrays',
    title: 'Two Sum (Hash Map)',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Finds indices of two numbers that add up to a specific target in a single pass using a hash map lookup.',
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    exampleInput: 'nums = [2, 7, 11, 15], target = 9',
    exampleOutput: '[0, 1]',
  },
  {
    category: 'Searching',
    title: 'Binary Search (Iterative)',
    difficulty: 'Easy',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    description: 'Divides a sorted array in half repeatedly, comparing target with mid to discard the irrelevant partition.',
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}`,
    exampleInput: 'arr = [1, 3, 5, 7, 9, 11], target = 7',
    exampleOutput: '3',
  },
  {
    category: 'Sorting',
    title: 'Merge Sort (Divide & Conquer)',
    difficulty: 'Medium',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'Guarantees O(n log n) worst-case time by recursively splitting array into halves and merging sorted subarrays stably.',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    exampleInput: 'arr = [38, 27, 43, 3, 9, 82, 10]',
    exampleOutput: '[3, 9, 10, 27, 38, 43, 82]',
  },
  {
    category: 'Sorting',
    title: 'Quick Sort (Partitioning)',
    difficulty: 'Medium',
    timeComplexity: 'O(n log n) avg',
    spaceComplexity: 'O(log n)',
    description: 'Selects a pivot element and partitions array into elements smaller and greater than pivot, sorting recursively.',
    code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
    exampleInput: 'arr = [10, 80, 30, 90, 40, 50, 70]',
    exampleOutput: '[10, 30, 40, 50, 70, 80, 90]',
  },
  {
    category: 'Linked Lists',
    title: 'Reverse Singly Linked List',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Reverses node pointers iteratively using three pointers (prev, curr, nextTemp) in a single linear pass.',
    code: `function reverseList(head) {
  let prev = null;
  let curr = head;
  
  while (curr !== null) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  
  return prev;
}`,
    exampleInput: '1 -> 2 -> 3 -> 4 -> 5 -> NULL',
    exampleOutput: '5 -> 4 -> 3 -> 2 -> 1 -> NULL',
  },
  {
    category: 'Stacks',
    title: 'Valid Parentheses Validator',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Pushes opening brackets to stack and verifies matching pairs upon encountering closing brackets using LIFO.',
    code: `function isValidParentheses(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (map[char]) {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
    exampleInput: 's = "()[]{}"',
    exampleOutput: 'true',
  },
  {
    category: 'Trees',
    title: 'Binary Search Tree (BST) Inorder Traversal',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    description: 'Visits left subtree, root, and right subtree. In a BST, inorder traversal produces strictly sorted ascending values.',
    code: `function inorderTraversal(root) {
  const result = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return result;
}`,
    exampleInput: 'BST with root=4, left=2, right=6',
    exampleOutput: '[2, 4, 6]',
  },
  {
    category: 'Graphs',
    title: "Dijkstra's Shortest Path Algorithm",
    difficulty: 'Medium',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    description: 'Computes shortest path distances from single source to all vertices in a weighted graph with non-negative weights.',
    code: `function dijkstra(graph, startVertex) {
  const distances = {};
  const unvisited = new Set();
  
  for (const vertex of graph.vertices) {
    distances[vertex] = vertex === startVertex ? 0 : Infinity;
    unvisited.add(vertex);
  }
  
  while (unvisited.size > 0) {
    let curr = null;
    let min = Infinity;
    for (const v of unvisited) {
      if (distances[v] < min) { min = distances[v]; curr = v; }
    }
    if (!curr || distances[curr] === Infinity) break;
    unvisited.delete(curr);
    
    for (const neighbor of graph.getNeighbors(curr)) {
      if (unvisited.has(neighbor.node)) {
        const alt = distances[curr] + neighbor.weight;
        if (alt < distances[neighbor.node]) distances[neighbor.node] = alt;
      }
    }
  }
  return distances;
}`,
    exampleInput: 'Graph with weighted edges from source A',
    exampleOutput: '{ A: 0, B: 3, C: 2, D: 8 }',
  },
  {
    category: 'Dynamic Programming',
    title: '0/1 Knapsack Problem',
    difficulty: 'Medium',
    timeComplexity: 'O(N * W)',
    spaceComplexity: 'O(N * W)',
    description: 'Determines maximum total value of items that can fit into a knapsack of capacity W by testing include/exclude states.',
    code: `function knapsack01(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}`,
    exampleInput: 'weights = [1, 2, 3], values = [10, 15, 40], capacity = 6',
    exampleOutput: '65',
  },
  {
    category: 'Dynamic Programming',
    title: 'Longest Common Subsequence (LCS)',
    difficulty: 'Medium',
    timeComplexity: 'O(M * N)',
    spaceComplexity: 'O(M * N)',
    description: 'Finds the length of the longest subsequence present in both strings in equal relative order.',
    code: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
    exampleInput: 'text1 = "abcde", text2 = "ace"',
    exampleOutput: '3 (Subsequence: "ace")',
  },
];
