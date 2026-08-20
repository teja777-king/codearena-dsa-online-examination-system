/**
 * Searching Algorithms Implementation & Educational Metadata
 */

// 1. Linear Search
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// 2. Binary Search (Iterative)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

// 3. Binary Search (Recursive)
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  const mid = Math.floor(left + (right - left) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  }
  return binarySearchRecursive(arr, target, left, mid - 1);
}

// 4. Search in Rotated Sorted Array
function searchRotatedArray(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;

    // Check if left half is sorted
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}

module.exports = {
  linearSearch,
  binarySearch,
  binarySearchRecursive,
  searchRotatedArray,
  metadata: {
    linearSearch: {
      name: 'Linear Search',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
      exampleInput: 'arr = [4, 2, 7, 1, 9], target = 7',
      exampleOutput: '2',
    },
    binarySearch: {
      name: 'Binary Search (Iterative)',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      explanation: 'Repeatedly divides the sorted search interval in half. Compares target with middle element and discards the irrelevant half.',
      exampleInput: 'arr = [1, 3, 5, 7, 9, 11], target = 7',
      exampleOutput: '3',
    },
    searchRotatedArray: {
      name: 'Search in Rotated Sorted Array',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      explanation: 'Leverages binary search by identifying whether the left or right sub-array is strictly sorted, then checks if target lies within that range.',
      exampleInput: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0',
      exampleOutput: '4',
    },
  },
};
