/**
 * Graph Algorithms Implementation & Educational Metadata
 */

class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(source, destination, weight = 1, isDirected = false) {
    this.addVertex(source);
    this.addVertex(destination);
    this.adjacencyList.get(source).push({ node: destination, weight });
    if (!isDirected) {
      this.adjacencyList.get(destination).push({ node: source, weight });
    }
  }
}

// 1. Breadth-First Search (BFS)
function bfs(graph, startVertex) {
  const visited = new Set();
  const queue = [startVertex];
  const traversalOrder = [];

  visited.add(startVertex);

  while (queue.length > 0) {
    const current = queue.shift();
    traversalOrder.push(current);

    const neighbors = graph.adjacencyList.get(current) || [];
    for (const neighbor of neighbors) {
      const neighborNode = typeof neighbor === 'object' ? neighbor.node : neighbor;
      if (!visited.has(neighborNode)) {
        visited.add(neighborNode);
        queue.push(neighborNode);
      }
    }
  }

  return traversalOrder;
}

// 2. Depth-First Search (DFS)
function dfs(graph, startVertex) {
  const visited = new Set();
  const traversalOrder = [];

  const explore = (vertex) => {
    if (!vertex || visited.has(vertex)) return;
    visited.add(vertex);
    traversalOrder.push(vertex);

    const neighbors = graph.adjacencyList.get(vertex) || [];
    for (const neighbor of neighbors) {
      const neighborNode = typeof neighbor === 'object' ? neighbor.node : neighbor;
      if (!visited.has(neighborNode)) {
        explore(neighborNode);
      }
    }
  };

  explore(startVertex);
  return traversalOrder;
}

// 3. Dijkstra's Shortest Path Algorithm
function dijkstra(graph, startVertex) {
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  for (const vertex of graph.adjacencyList.keys()) {
    distances[vertex] = vertex === startVertex ? 0 : Infinity;
    previous[vertex] = null;
    unvisited.add(vertex);
  }

  while (unvisited.size > 0) {
    // Find node with minimum distance in unvisited set
    let current = null;
    let minDistance = Infinity;

    for (const vertex of unvisited) {
      if (distances[vertex] < minDistance) {
        minDistance = distances[vertex];
        current = vertex;
      }
    }

    if (current === null || distances[current] === Infinity) break;

    unvisited.delete(current);

    const neighbors = graph.adjacencyList.get(current) || [];
    for (const neighbor of neighbors) {
      if (unvisited.has(neighbor.node)) {
        const alt = distances[current] + neighbor.weight;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          previous[neighbor.node] = current;
        }
      }
    }
  }

  return { distances, previous };
}

// 4. Kruskal's Minimum Spanning Tree
class DisjointSet {
  constructor() {
    this.parent = {};
    this.rank = {};
  }

  makeSet(x) {
    this.parent[x] = x;
    this.rank[x] = 0;
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}

function kruskalMST(vertices, edges) {
  // edges: [{ u, v, weight }]
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const ds = new DisjointSet();
  vertices.forEach((v) => ds.makeSet(v));

  const mst = [];
  let totalWeight = 0;

  for (const edge of sortedEdges) {
    if (ds.union(edge.u, edge.v)) {
      mst.push(edge);
      totalWeight += edge.weight;
    }
  }

  return { mst, totalWeight };
}

// 5. Prim's Minimum Spanning Tree
function primMST(graph, startVertex) {
  const inMST = new Set([startVertex]);
  const mstEdges = [];
  let totalWeight = 0;
  const totalVertices = graph.adjacencyList.size;

  while (inMST.size < totalVertices) {
    let minEdge = null;
    let minWeight = Infinity;

    for (const u of inMST) {
      const neighbors = graph.adjacencyList.get(u) || [];
      for (const neighbor of neighbors) {
        if (!inMST.has(neighbor.node) && neighbor.weight < minWeight) {
          minWeight = neighbor.weight;
          minEdge = { u, v: neighbor.node, weight: neighbor.weight };
        }
      }
    }

    if (!minEdge) break;

    inMST.add(minEdge.v);
    mstEdges.push(minEdge);
    totalWeight += minEdge.weight;
  }

  return { mstEdges, totalWeight };
}

module.exports = {
  Graph,
  bfs,
  dfs,
  dijkstra,
  kruskalMST,
  primMST,
  DisjointSet,
  metadata: {
    bfs: {
      name: 'Breadth-First Search (BFS)',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      explanation: 'Level-by-level traversal using a FIFO queue. Finds shortest path in unweighted graphs.',
    },
    dfs: {
      name: 'Depth-First Search (DFS)',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      explanation: 'Explores as far as possible along each branch before backtracking using recursion/stack.',
    },
    dijkstra: {
      name: "Dijkstra's Algorithm",
      timeComplexity: 'O((V + E) log V) with Priority Queue / O(V²)',
      spaceComplexity: 'O(V)',
      explanation: 'Greedy single-source shortest path algorithm for non-negative weighted graphs.',
    },
    kruskal: {
      name: "Kruskal's MST Algorithm",
      timeComplexity: 'O(E log E)',
      spaceComplexity: 'O(V)',
      explanation: 'Sorts all edges and uses Disjoint Set Union (DSU) to avoid cycles while building the Minimum Spanning Tree.',
    },
  },
};
