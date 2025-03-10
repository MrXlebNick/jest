'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = setupJestGlobals;
var _expect = require('@jest/expect');
var _jestSnapshot = require('jest-snapshot');
/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Get suppressed errors form  jest-matchers that weren't throw during
// test execution and add them to the test result, potentially failing
// a passing test.
const addSuppressedErrors = result => {
  const {suppressedErrors} = _expect.jestExpect.getState();
  _expect.jestExpect.setState({
    suppressedErrors: []
  });
  if (suppressedErrors.length) {
    result.status = 'failed';
    result.failedExpectations = suppressedErrors.map(error => ({
      actual: '',
      // passing error for custom test reporters
      error,
      expected: '',
      matcherName: '',
      message: error.message,
      passed: false,
      stack: error.stack
    }));
  }
};
const addAssertionErrors = result => {
  const assertionErrors = _expect.jestExpect.extractExpectedAssertionsErrors();
  if (assertionErrors.length) {
    const jasmineErrors = assertionErrors.map(({actual, error, expected}) => ({
      actual,
      expected,
      message: error.stack,
      passed: false
    }));
    result.status = 'failed';
    result.failedExpectations = result.failedExpectations.concat(jasmineErrors);
  }
};
const patchJasmine = () => {
  // @ts-expect-error: jasmine doesn't exist on globalThis
  globalThis.jasmine.Spec = (realSpec => {
    class Spec extends realSpec {
      constructor(attr) {
        const resultCallback = attr.resultCallback;
        attr.resultCallback = function (result) {
          addSuppressedErrors(result);
          addAssertionErrors(result);
          resultCallback.call(attr, result);
        };
        const onStart = attr.onStart;
        attr.onStart = context => {
          _expect.jestExpect.setState({
            currentTestName: context.getFullName()
          });
          onStart && onStart.call(attr, context);
        };
        super(attr);
      }
    }
    return Spec;
    // @ts-expect-error: jasmine doesn't exist on globalThis
  })(globalThis.jasmine.Spec);
};
async function setupJestGlobals({
  config,
  globalConfig,
  localRequire,
  testPath
}) {
  // Jest tests snapshotSerializers in order preceding built-in serializers.
  // Therefore, add in reverse because the last added is the first tested.
  config.snapshotSerializers
    .concat()
    .reverse()
    .forEach(path => {
      (0, _jestSnapshot.addSerializer)(localRequire(path));
    });
  patchJasmine();
  const {expand, updateSnapshot} = globalConfig;
  const {prettierPath, rootDir, snapshotFormat} = config;
  const snapshotResolver = await (0, _jestSnapshot.buildSnapshotResolver)(
    config,
    localRequire
  );
  const snapshotPath = snapshotResolver.resolveSnapshotPath(testPath);
  const snapshotState = new _jestSnapshot.SnapshotState(snapshotPath, {
    expand,
    prettierPath,
    rootDir,
    snapshotFormat,
    updateSnapshot
  });
  _expect.jestExpect.setState({
    snapshotState,
    testPath
  });
  // Return it back to the outer scope (test runner outside the VM).
  return snapshotState;
}
