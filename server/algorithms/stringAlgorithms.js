/**
 * String Algorithms Implementation & Educational Metadata
 */

// 1. Is Palindrome
function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}

// 2. Valid Anagram
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const char of s) {
    count[char] = (count[char] || 0) + 1;
  }
  for (const char of t) {
    if (!count[char]) return false;
    count[char]--;
  }
  return true;
}

// 3. Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let left = 0;
  const charMap = new Map();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (charMap.has(char) && charMap.get(char) >= left) {
      left = charMap.get(char) + 1;
    }
    charMap.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

module.exports = {
  isPalindrome,
  isAnagram,
  lengthOfLongestSubstring,
  metadata: {
    isPalindrome: {
      name: 'Valid Palindrome (Two Pointers)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Uses left and right pointers moving towards the center to check symmetry while ignoring non-alphanumeric characters.',
    },
    lengthOfLongestSubstring: {
      name: 'Longest Substring Without Repeating Characters (Sliding Window)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(min(n, m)) where m is charset size',
      explanation: 'Maintains a dynamic sliding window. When a repeated character is encountered within current window, moves the left pointer past previous occurrence.',
    },
  },
};
