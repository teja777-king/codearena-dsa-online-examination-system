/**
 * Sorting Algorithms Implementation & Educational Metadata
 */

// 1. Bubble Sort
function bubbleSort(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return a;
}

// 2. Selection Sort
function selectionSort(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
  }
  return a;
}

// 3. Insertion Sort
function insertionSort(arr) {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}

// 4. Merge Sort
function mergeSort(arr) {
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
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// 5. Quick Sort
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}

// 6. Heap Sort
function heapSort(arr) {
  const a = [...arr];
  const n = a.length;

  const heapify = (size, root) => {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size && a[left] > a[largest]) largest = left;
    if (right < size && a[right] > a[largest]) largest = right;

    if (largest !== root) {
      [a[root], a[largest]] = [a[largest], a[root]];
      heapify(size, largest);
    }
  };

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    heapify(i, 0);
  }

  return a;
}

module.exports = {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  metadata: {
    bubbleSort: {
      name: 'Bubble Sort',
      timeComplexity: 'O(n²) [Best: O(n)]',
      spaceComplexity: 'O(1)',
      explanation: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    },
    selectionSort: {
      name: 'Selection Sort',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      explanation: 'Divides input into sorted and unsorted regions, repeatedly selecting the smallest element from unsorted region and placing it at the end of sorted region.',
    },
    insertionSort: {
      name: 'Insertion Sort',
      timeComplexity: 'O(n²) [Best: O(n)]',
      spaceComplexity: 'O(1)',
      explanation: 'Builds the final sorted array one item at a time by taking current element and inserting it into its correct position in the sorted sub-array.',
    },
    mergeSort: {
      name: 'Merge Sort',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      explanation: 'A divide-and-conquer algorithm that recursively splits array into halves, sorts each half, and merges the sorted halves back together.',
    },
    quickSort: {
      name: 'Quick Sort',
      timeComplexity: 'O(n log n) [Worst: O(n²)]',
      spaceComplexity: 'O(log n)',
      explanation: 'Picks a pivot element, partitions the array such that elements smaller than pivot are on left and larger on right, and recursively sorts subarrays.',
    },
    heapSort: {
      name: 'Heap Sort',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      explanation: 'Builds a max heap from the array, then repeatedly swaps the root (max element) with the last unsorted element and heapifies the root.',
    },
  },
};
