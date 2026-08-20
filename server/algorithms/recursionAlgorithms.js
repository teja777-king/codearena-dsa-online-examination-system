/**
 * Recursion and Backtracking Algorithms Implementation & Educational Metadata
 */

// 1. Factorial
function factorial(n) {
  if (n < 0) return null;
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

// 2. Tower of Hanoi
function towerOfHanoi(n, fromRod = 'A', toRod = 'C', auxRod = 'B', moves = []) {
  if (n === 1) {
    moves.push({ disk: 1, from: fromRod, to: toRod });
    return moves;
  }
  towerOfHanoi(n - 1, fromRod, auxRod, toRod, moves);
  moves.push({ disk: n, from: fromRod, to: toRod });
  towerOfHanoi(n - 1, auxRod, toRod, fromRod, moves);
  return moves;
}

// 3. N-Queens Problem (Backtracking)
function solveNQueens(n) {
  const solutions = [];
  const board = Array.from({ length: n }, () => new Array(n).fill('.'));

  const isSafe = (row, col) => {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    return true;
  };

  const backtrack = (row) => {
    if (row === n) {
      solutions.push(board.map((r) => r.join('')));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 'Q';
        backtrack(row + 1);
        board[row][col] = '.'; // backtrack
      }
    }
  };

  backtrack(0);
  return solutions;
}

module.exports = {
  factorial,
  towerOfHanoi,
  solveNQueens,
  metadata: {
    towerOfHanoi: {
      name: 'Tower of Hanoi',
      timeComplexity: 'O(2ⁿ)',
      spaceComplexity: 'O(n) recursion stack',
      explanation: 'Solves the puzzle by recursively moving n-1 disks to auxiliary rod, moving largest disk to destination, then moving n-1 disks from aux to destination.',
    },
    solveNQueens: {
      name: 'N-Queens (Backtracking)',
      timeComplexity: 'O(N!)',
      spaceComplexity: 'O(N²)',
      explanation: 'Places queens row-by-row, verifying non-attacking constraints on columns and diagonals, and backtracks immediately when a conflict occurs.',
    },
  },
};
