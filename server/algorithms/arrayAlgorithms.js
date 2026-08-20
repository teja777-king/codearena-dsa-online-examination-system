/**
 * Array Algorithms Implementation & Educational Metadata
 */

// 1. Two Sum
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// 2. Maximum Subarray (Kadane's Algorithm)
function maxSubArray(nums) {
  if (!nums || nums.length === 0) return 0;
  let maxSoFar = nums[0];
  let currentMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currentMax);
  }
  return maxSoFar;
}

// 3. Prefix Sum Array
function prefixSum(nums) {
  const prefix = new Array(nums.length);
  prefix[0] = nums[0];
  for (let i = 1; i < nums.length; i++) {
    prefix[i] = prefix[i - 1] + nums[i];
  }
  return prefix;
}

// 4. Sliding Window (Max Sum Subarray of Size K)
function maxSlidingWindowSum(nums, k) {
  if (nums.length < k || k <= 0) return 0;
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  let maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}

// 5. Rotate Array by K positions to the right
function rotateArray(nums, k) {
  k = k % nums.length;
  const reverse = (arr, start, end) => {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  };
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
  return nums;
}

module.exports = {
  twoSum,
  maxSubArray,
  prefixSum,
  maxSlidingWindowSum,
  rotateArray,
  metadata: {
    twoSum: {
      name: 'Two Sum (Hash Map)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: 'Uses a hash map to store previously seen numbers and checks if the complement (target - current) exists in O(1) time.',
      exampleInput: 'nums = [2, 7, 11, 15], target = 9',
      exampleOutput: '[0, 1]',
    },
    maxSubArray: {
      name: "Maximum Subarray (Kadane's Algorithm)",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Finds the contiguous subarray with the largest sum by greedily deciding whether to start a new subarray at current element or extend existing subarray.',
      exampleInput: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
      exampleOutput: '6 (subarray [4, -1, 2, 1])',
    },
    prefixSum: {
      name: 'Prefix Sum Array',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: 'Precomputes cumulative sums allowing range sum queries from index L to R in O(1) time using prefix[R] - prefix[L - 1].',
      exampleInput: 'nums = [1, 2, 3, 4, 5]',
      exampleOutput: '[1, 3, 6, 10, 15]',
    },
    maxSlidingWindowSum: {
      name: 'Sliding Window (Max Sum of Size K)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Maintains a sliding window of length K, sliding across array by adding next element and subtracting outgoing element in O(1) per step.',
      exampleInput: 'nums = [2, 1, 5, 1, 3, 2], k = 3',
      exampleOutput: '9 (subarray [5, 1, 3])',
    },
  },
};
