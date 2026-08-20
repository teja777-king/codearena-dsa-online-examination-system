/**
 * Dynamic Programming Algorithms Implementation & Educational Metadata
 */

// 1. Fibonacci (Memoized & Tabulated)
function fibonacciDP(n, memo = {}) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = fibonacciDP(n - 1, memo) + fibonacciDP(n - 2, memo);
  return memo[n];
}

function fibonacciTabulation(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// 2. 0/1 Knapsack Problem
function knapsack01(weights, values, capacity) {
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
}

// 3. Longest Common Subsequence (LCS)
function longestCommonSubsequence(text1, text2) {
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
}

// 4. Coin Change (Minimum Coins to make amount)
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// 5. Longest Increasing Subsequence (LIS)
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);
  let maxLen = 1;

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], 1 + dp[j]);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
  }
  return maxLen;
}

module.exports = {
  fibonacciDP,
  fibonacciTabulation,
  knapsack01,
  longestCommonSubsequence,
  coinChange,
  lengthOfLIS,
  metadata: {
    knapsack01: {
      name: '0/1 Knapsack Problem',
      timeComplexity: 'O(N * W)',
      spaceComplexity: 'O(N * W)',
      explanation: 'Optimal substructure & overlapping subproblems: for each item, decide whether to include it or exclude it based on remaining capacity.',
    },
    longestCommonSubsequence: {
      name: 'Longest Common Subsequence (LCS)',
      timeComplexity: 'O(M * N)',
      spaceComplexity: 'O(M * N)',
      explanation: 'Compares characters; if matching, adds 1 to LCS of prefixes; otherwise takes maximum of deleting a char from text1 or text2.',
    },
    coinChange: {
      name: 'Coin Change Problem',
      timeComplexity: 'O(amount * number of coins)',
      spaceComplexity: 'O(amount)',
      explanation: 'Tabulates minimum number of coins needed for every sub-amount from 1 up to target amount.',
    },
  },
};
