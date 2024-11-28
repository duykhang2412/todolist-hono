module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/test'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    clearMocks: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts', '!src/**/index.ts'],
};
