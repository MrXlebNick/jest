'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isJestJasmineRun = isJestJasmineRun;
exports.onNodeVersions = onNodeVersions;
exports.skipSuiteOnJasmine = skipSuiteOnJasmine;
exports.skipSuiteOnJestCircus = skipSuiteOnJestCircus;
function _semver() {
  const data = _interopRequireDefault(require('semver'));
  _semver = function () {
    return data;
  };
  return data;
}
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function isJestJasmineRun() {
  return process.env.JEST_JASMINE === '1';
}
function skipSuiteOnJasmine() {
  if (isJestJasmineRun()) {
    test.only('does not work on Jasmine', () => {
      console.warn('[SKIP] Does not work on Jasmine');
    });
  }
}
function skipSuiteOnJestCircus() {
  if (!isJestJasmineRun()) {
    test.only('does not work on jest-circus', () => {
      console.warn('[SKIP] Does not work on jest-circus');
    });
  }
}
function onNodeVersions(versionRange, testBody) {
  const description = `on node ${versionRange}`;
  if (_semver().default.satisfies(process.versions.node, versionRange)) {
    describe(description, () => {
      testBody();
    });
  } else {
    describe.skip(description, () => {
      testBody();
    });
  }
}
