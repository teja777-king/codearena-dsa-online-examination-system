/**
 * Greedy Algorithms Implementation & Educational Metadata
 */

// 1. Activity Selection Problem
function activitySelection(activities) {
  // activities: [{ id, start, finish }]
  if (activities.length === 0) return [];
  const sorted = [...activities].sort((a, b) => a.finish - b.finish);
  const selected = [sorted[0]];
  let lastFinish = sorted[0].finish;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start >= lastFinish) {
      selected.push(sorted[i]);
      lastFinish = sorted[i].finish;
    }
  }
  return selected;
}

// 2. Fractional Knapsack
function fractionalKnapsack(items, capacity) {
  // items: [{ value, weight }]
  const sortedItems = [...items]
    .map((item) => ({ ...item, ratio: item.value / item.weight }))
    .sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0;
  let remainingCapacity = capacity;

  for (const item of sortedItems) {
    if (remainingCapacity <= 0) break;
    if (item.weight <= remainingCapacity) {
      totalValue += item.value;
      remainingCapacity -= item.weight;
    } else {
      totalValue += item.ratio * remainingCapacity;
      remainingCapacity = 0;
    }
  }

  return totalValue;
}

module.exports = {
  activitySelection,
  fractionalKnapsack,
  metadata: {
    activitySelection: {
      name: 'Activity Selection Problem',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      explanation: 'Sorts activities by earliest finish time and greedily picks the next compatible activity.',
    },
    fractionalKnapsack: {
      name: 'Fractional Knapsack',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      explanation: 'Sorts items by value-to-weight ratio and fills knapsack with highest density items first, taking fractions when needed.',
    },
  },
};
