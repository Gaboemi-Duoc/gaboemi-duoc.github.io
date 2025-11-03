module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  testTimeout: 60000, // Increased timeout
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
  // Add this to handle ES6 classes properly
  transform: {},
};
