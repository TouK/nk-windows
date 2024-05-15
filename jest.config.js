/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  preset: "ts-jest",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.svg": "<rootDir>/mocks/svgrMock.ts",
    "\\.css": "<rootDir>/mocks/cssMock.ts",
    "color-alpha": "<rootDir>/mocks/color-alpha.ts",
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.stories.*", "!src/**/*.d.ts"],
  coverageDirectory: "coverage/jest",
};
