module.exports = {
  preset: 'ts-jest', // Use ts-jest for TypeScript
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use babel-jest for JS and TS files
  },
  testEnvironment: 'jsdom', // For React components
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'], // Recognize these extensions
  roots: ['<rootDir>/src'], // Test files are located in the src folder
  transformIgnorePatterns: ['node_modules/(?!(library-name)/)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Add any directories you want to ignore

};
