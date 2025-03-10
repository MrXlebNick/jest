'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.makeProjectConfig = exports.makeGlobalConfig = void 0;
/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const DEFAULT_GLOBAL_CONFIG = {
  bail: 0,
  changedFilesWithAncestor: false,
  changedSince: '',
  ci: false,
  collectCoverage: false,
  collectCoverageFrom: [],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  coverageReporters: [],
  coverageThreshold: {
    global: {}
  },
  detectLeaks: false,
  detectOpenHandles: false,
  errorOnDeprecated: false,
  expand: false,
  filter: undefined,
  findRelatedTests: false,
  forceExit: false,
  globalSetup: undefined,
  globalTeardown: undefined,
  json: false,
  lastCommit: false,
  listTests: false,
  logHeapUsage: false,
  maxConcurrency: 5,
  maxWorkers: 2,
  noSCM: undefined,
  noStackTrace: false,
  nonFlagArgs: [],
  notify: false,
  notifyMode: 'failure-change',
  onlyChanged: false,
  onlyFailures: false,
  outputFile: undefined,
  passWithNoTests: false,
  projects: [],
  replname: undefined,
  reporters: [],
  rootDir: '/test_root_dir/',
  runTestsByPath: false,
  seed: 1234,
  silent: false,
  skipFilter: false,
  snapshotFormat: {},
  testFailureExitCode: 1,
  testNamePattern: '',
  testPathPattern: '',
  testResultsProcessor: undefined,
  testSequencer: '@jest/test-sequencer',
  testTimeout: 5000,
  updateSnapshot: 'none',
  useStderr: false,
  verbose: false,
  watch: false,
  watchAll: false,
  watchPlugins: [],
  watchman: false
};
const DEFAULT_PROJECT_CONFIG = {
  automock: false,
  cache: false,
  cacheDirectory: '/test_cache_dir/',
  clearMocks: false,
  coveragePathIgnorePatterns: [],
  cwd: '/test_root_dir/',
  detectLeaks: false,
  detectOpenHandles: false,
  displayName: undefined,
  errorOnDeprecated: false,
  extensionsToTreatAsEsm: [],
  fakeTimers: {
    enableGlobally: false
  },
  filter: undefined,
  forceCoverageMatch: [],
  globalSetup: undefined,
  globalTeardown: undefined,
  globals: {},
  haste: {},
  id: 'test_name',
  injectGlobals: true,
  moduleDirectories: [],
  moduleFileExtensions: ['js'],
  moduleNameMapper: [],
  modulePathIgnorePatterns: [],
  modulePaths: [],
  prettierPath: 'prettier',
  resetMocks: false,
  resetModules: false,
  resolver: undefined,
  restoreMocks: false,
  rootDir: '/test_root_dir/',
  roots: [],
  runner: 'jest-runner',
  runtime: '/test_module_loader_path',
  sandboxInjectedGlobals: [],
  setupFiles: [],
  setupFilesAfterEnv: [],
  skipFilter: false,
  skipNodeResolution: false,
  slowTestThreshold: 5,
  snapshotFormat: {},
  snapshotResolver: undefined,
  snapshotSerializers: [],
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  testLocationInResults: false,
  testMatch: [],
  testPathIgnorePatterns: [],
  testRegex: ['\\.test\\.js$'],
  testRunner: 'jest-circus/runner',
  transform: [],
  transformIgnorePatterns: [],
  unmockedModulePathPatterns: undefined,
  watchPathIgnorePatterns: []
};
const makeGlobalConfig = (overrides = {}) => {
  const overridesKeys = new Set(Object.keys(overrides));
  Object.keys(DEFAULT_GLOBAL_CONFIG).forEach(key => overridesKeys.delete(key));
  if (overridesKeys.size > 0) {
    throw new Error(`
      Properties that are not part of GlobalConfig type were passed:
      ${JSON.stringify(Array.from(overridesKeys))}
    `);
  }
  return {
    ...DEFAULT_GLOBAL_CONFIG,
    ...overrides
  };
};
exports.makeGlobalConfig = makeGlobalConfig;
const makeProjectConfig = (overrides = {}) => {
  const overridesKeys = new Set(Object.keys(overrides));
  Object.keys(DEFAULT_PROJECT_CONFIG).forEach(key => overridesKeys.delete(key));
  if (overridesKeys.size > 0) {
    throw new Error(`
      Properties that are not part of ProjectConfig type were passed:
      ${JSON.stringify(Array.from(overridesKeys))}
    `);
  }
  return {
    ...DEFAULT_PROJECT_CONFIG,
    ...overrides
  };
};
exports.makeProjectConfig = makeProjectConfig;
