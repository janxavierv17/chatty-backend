import type { Config } from "jest";
import { defaults } from "jest-config";

export default async (): Promise<Config> => ({
    preset: "ts-jest",
    verbose: true,
    moduleFileExtensions: [...defaults.moduleFileExtensions],
    testEnvironment: "node",
    coverageDirectory: "coverage",
    collectCoverage: true,
    testPathIgnorePatterns: ["/node_modules/"],
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    testMatch: ["<rootDir>/src/**/test/*.ts"],
    collectCoverageFrom: ["src/**/*.ts", "!src/**/test/*.ts?(x)", "!**/node_modules/**"],
    coverageThreshold: {
        global: {
            branches: 5,
            functions: 15,
            lines: 15,
            statements: 15
        }
    },
    coverageReporters: ["text-summary", "lcov"],
    setupFiles: ["<rootDir>/.jest/setEnvVars.ts"]
});
