module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/test'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1', // Thêm ánh xạ alias `src/` thành thư mục gốc `src`
    },
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    clearMocks: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts', '!src/**/index.ts'],
};
