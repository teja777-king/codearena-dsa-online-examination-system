/**
 * Tree Algorithms Implementation & Educational Metadata
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(val) {
    const newNode = new TreeNode(val);
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    let curr = this.root;
    while (true) {
      if (val === curr.val) return this;
      if (val < curr.val) {
        if (!curr.left) {
          curr.left = newNode;
          return this;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = newNode;
          return this;
        }
        curr = curr.right;
      }
    }
  }

  search(val) {
    let curr = this.root;
    while (curr) {
      if (val === curr.val) return curr;
      if (val < curr.val) curr = curr.left;
      else curr = curr.right;
    }
    return null;
  }

  delete(val) {
    const deleteNode = (root, key) => {
      if (!root) return null;
      if (key < root.val) {
        root.left = deleteNode(root.left, key);
      } else if (key > root.val) {
        root.right = deleteNode(root.right, key);
      } else {
        // Node found
        if (!root.left) return root.right;
        if (!root.right) return root.left;
        // Node with two children: get inorder successor (min in right subtree)
        let minNode = root.right;
        while (minNode.left) minNode = minNode.left;
        root.val = minNode.val;
        root.right = deleteNode(root.right, minNode.val);
      }
      return root;
    };
    this.root = deleteNode(this.root, val);
    return this;
  }
}

// 1. Inorder Traversal (Left -> Root -> Right)
function inorderTraversal(root) {
  const result = [];
  const traverse = (node) => {
    if (!node) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  };
  traverse(root);
  return result;
}

// 2. Preorder Traversal (Root -> Left -> Right)
function preorderTraversal(root) {
  const result = [];
  const traverse = (node) => {
    if (!node) return;
    result.push(node.val);
    traverse(node.left);
    traverse(node.right);
  };
  traverse(root);
  return result;
}

// 3. Postorder Traversal (Left -> Right -> Root)
function postorderTraversal(root) {
  const result = [];
  const traverse = (node) => {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
    result.push(node.val);
  };
  traverse(root);
  return result;
}

// 4. Level Order Traversal (BFS)
function levelOrderTraversal(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}

// 5. Maximum Depth of Binary Tree
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

module.exports = {
  TreeNode,
  BinarySearchTree,
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
  levelOrderTraversal,
  maxDepth,
  metadata: {
    inorderTraversal: {
      name: 'Inorder Traversal (BST Yields Sorted Order)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h) where h = tree height',
      explanation: 'Traverses left subtree, visits node, traverses right subtree. For a BST, this produces nodes in strictly ascending numerical order.',
    },
    levelOrderTraversal: {
      name: 'Level Order Traversal (BFS)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(w) where w = max tree width',
      explanation: 'Uses a FIFO queue to visit all nodes at depth d before moving on to nodes at depth d+1.',
    },
    bstSearch: {
      name: 'BST Search',
      timeComplexity: 'O(h) -> O(log n) balanced, O(n) skewed',
      spaceComplexity: 'O(1) iterative',
      explanation: 'Explores left subtree if search key is smaller than root, or right subtree if key is greater.',
    },
  },
};
