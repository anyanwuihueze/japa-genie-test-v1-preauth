// Test the progress calculation logic
const testCases = [
  { docs: 0, expected: 0 },
  { docs: 1, expected: 14 },
  { docs: 3, expected: 42 },
  { docs: 5, expected: 71 },
  { docs: 7, expected: 100 }
];

console.log("=== Testing Progress Calculation ===");
testCases.forEach(({ docs, expected }) => {
  const progress = Math.round((docs / 7) * 100);
  const status = progress === expected ? "✅ PASS" : "❌ FAIL";
  console.log(`${status}: ${docs}/7 documents → ${progress}% (expected ${expected}%)`);
});
