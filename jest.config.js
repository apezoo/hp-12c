/**
 * Jest Configuration for HP-12C Test Suite
 */

module.exports = {
    // Test environment
    testEnvironment: 'node',
    
    // Test file patterns
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    
    // Coverage configuration
    collectCoverageFrom: [
        'js/**/*.js',
        '!js/keyboard.js',      // Exclude browser-specific keyboard handler
        '!js/key-info.js',      // Exclude browser-specific UI
    ],
    
    coverageDirectory: 'coverage',
    
    coverageThreshold: {
        global: {
            statements: 85,
            branches: 80,
            functions: 85,
            lines: 85
        }
    },
    
    // Verbose output
    verbose: true,
    
    // Test timeout (for Newton-Raphson solvers)
    testTimeout: 10000,
    
    // Coverage reporters
    coverageReporters: [
        'text',
        'text-summary',
        'html',
        'lcov'
    ],
    
    // Clear mocks between tests
    clearMocks: true,
    
    // Collect coverage by default when running coverage command
    collectCoverage: false
};
