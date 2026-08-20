/**
 * Automated Test Runner for CodeArena DSA Algorithms & Exam System
 */

const { twoSum, maxSubArray, maxSlidingWindowSum } = require('../algorithms/arrayAlgorithms');
const { binarySearch, searchRotatedArray } = require('../algorithms/searchingAlgorithms');
const { mergeSort, quickSort, bubbleSort } = require('../algorithms/sortingAlgorithms');
const { SinglyLinkedList, reverseList, hasCycle } = require('../algorithms/linkedListAlgorithms');
const { isValidParentheses } = require('../algorithms/stackAlgorithms');
const { Graph, bfs, dfs, dijkstra } = require('../algorithms/graphAlgorithms');
const { longestCommonSubsequence, knapsack01 } = require('../algorithms/dynamicProgramming');
const { calculateGrade, isAnswerCorrect } = require('../services/evaluationService');
const { fisherYatesShuffle } = require('../services/randomizationService');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedTests++;
  }
}

console.log('\n======================================================');
console.log('🧪 CODEARENA DSA SYSTEM & ALGORITHM TEST SUITE');
console.log('======================================================\n');

// 1. Two Sum Test
console.log('▶ Testing Array Algorithms...');
const twoSumRes = twoSum([2, 7, 11, 15], 9);
assert(twoSumRes[0] === 0 && twoSumRes[1] === 1, 'Two Sum finds indices [0, 1] for target 9');
assert(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) === 6, "Kadane's Algorithm computes max subarray sum = 6");
assert(maxSlidingWindowSum([2, 1, 5, 1, 3, 2], 3) === 9, 'Sliding window max sum of size 3 = 9');

// 2. Searching Tests
console.log('\n▶ Testing Searching Algorithms...');
const sortedArr = [1, 3, 5, 7, 9, 11, 13, 15];
assert(binarySearch(sortedArr, 7) === 3, 'Binary Search finds existing element at index 3');
assert(binarySearch(sortedArr, 8) === -1, 'Binary Search returns -1 for non-existing element');
assert(searchRotatedArray([4, 5, 6, 7, 0, 1, 2], 0) === 4, 'Rotated Sorted Array Search finds element 0 at index 4');

// 3. Sorting Tests
console.log('\n▶ Testing Sorting Algorithms...');
const unsorted = [64, 34, 25, 12, 22, 11, 90];
const sortedExpected = [11, 12, 22, 25, 34, 64, 90];
assert(JSON.stringify(mergeSort(unsorted)) === JSON.stringify(sortedExpected), 'Merge Sort correctly sorts array');
assert(JSON.stringify(quickSort(unsorted)) === JSON.stringify(sortedExpected), 'Quick Sort correctly sorts array');
assert(JSON.stringify(bubbleSort(unsorted)) === JSON.stringify(sortedExpected), 'Bubble Sort correctly sorts array');

// 4. Linked List Tests
console.log('\n▶ Testing Linked List Algorithms...');
const list = SinglyLinkedList.fromArray([1, 2, 3, 4, 5]);
const reversedHead = reverseList(list.head);
const reversedVals = [];
let curr = reversedHead;
while (curr) {
  reversedVals.push(curr.val);
  curr = curr.next;
}
assert(JSON.stringify(reversedVals) === JSON.stringify([5, 4, 3, 2, 1]), 'Linked List Reverse transforms [1,2,3,4,5] to [5,4,3,2,1]');

// 5. Stack Tests
console.log('\n▶ Testing Stack & Parentheses...');
assert(isValidParentheses('()[]{}') === true, 'Balanced Parentheses accepts "()[]{}"');
assert(isValidParentheses('([)]') === false, 'Balanced Parentheses rejects "([)]"');

// 6. Graph Tests (BFS, DFS, Dijkstra)
console.log('\n▶ Testing Graph Algorithms (BFS, DFS, Dijkstra)...');
const graph = new Graph();
graph.addEdge('A', 'B', 4);
graph.addEdge('A', 'C', 2);
graph.addEdge('B', 'C', 1);
graph.addEdge('B', 'D', 5);
graph.addEdge('C', 'D', 8);
graph.addEdge('C', 'E', 10);
graph.addEdge('D', 'E', 2);

const bfsRes = bfs(graph, 'A');
assert(bfsRes[0] === 'A' && bfsRes.includes('B') && bfsRes.includes('C'), 'BFS traverses level-by-level starting from A');

const dfsRes = dfs(graph, 'A');
assert(dfsRes[0] === 'A' && dfsRes.length === 5, 'DFS visits all 5 connected vertices starting from A');

const dijkstraRes = dijkstra(graph, 'A');
assert(dijkstraRes.distances['A'] === 0, 'Dijkstra distance from A to A = 0');
assert(dijkstraRes.distances['B'] === 3, 'Dijkstra distance from A to B via C = 3 (A->C(2) + C->B(1))');
assert(dijkstraRes.distances['D'] === 8, 'Dijkstra distance from A to D via B = 8');

// 7. Dynamic Programming Tests (LCS, Knapsack)
console.log('\n▶ Testing Dynamic Programming (LCS, Knapsack)...');
assert(longestCommonSubsequence('abcde', 'ace') === 3, 'Longest Common Subsequence of "abcde" and "ace" = 3');
assert(longestCommonSubsequence('abc', 'def') === 0, 'LCS of non-overlapping strings = 0');

const knapWeights = [1, 2, 3];
const knapValues = [10, 15, 40];
const knapCap = 6;
assert(knapsack01(knapWeights, knapValues, knapCap) === 65, '0/1 Knapsack optimal value = 65 (10+15+40)');

// 8. Evaluation & Grade Tests
console.log('\n▶ Testing Exam Evaluation & Grading System...');
assert(calculateGrade(95) === 'A+', 'Grade for 95% = A+');
assert(calculateGrade(82) === 'A', 'Grade for 82% = A');
assert(calculateGrade(74) === 'B+', 'Grade for 74% = B+');
assert(calculateGrade(63) === 'B', 'Grade for 63% = B');
assert(calculateGrade(52) === 'C', 'Grade for 52% = C');
assert(calculateGrade(44) === 'D', 'Grade for 44% = D');
assert(calculateGrade(35) === 'F', 'Grade for 35% = F');

assert(isAnswerCorrect('mcq', 'A', 'A') === true, 'MCQ answer comparison matches "A" with "A"');
assert(isAnswerCorrect('mcq', 'A', 'B') === false, 'MCQ answer comparison rejects "A" against "B"');
assert(isAnswerCorrect('multiple_select', ['B', 'A'], ['A', 'B']) === true, 'Multiple Select matches regardless of order');

// 9. Randomization Tests
console.log('\n▶ Testing Fisher-Yates Randomization...');
const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const shuffled = fisherYatesShuffle(testArray);
assert(shuffled.length === testArray.length, 'Fisher-Yates preserves array length');
assert(testArray.every((x) => shuffled.includes(x)), 'Fisher-Yates preserves all original elements');

console.log('\n======================================================');
console.log(`📊 TEST RESULTS SUMMARY:`);
console.log(`   Total Tests: ${passedTests + failedTests}`);
console.log(`   Passed:      ${passedTests}`);
console.log(`   Failed:      ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL TESTS PASSED WITH 100% SUCCESS RATE!\n');
  process.exit(0);
}
