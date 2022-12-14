'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;
var _testResult = require('@jest/test-result');
var _jestMessageUtil = require('jest-message-util');
var Symbol = globalThis['jest-symbol-do-not-touch'] || globalThis.Symbol;
var Symbol = globalThis['jest-symbol-do-not-touch'] || globalThis.Symbol;
var jestNow = globalThis[Symbol.for('jest-native-now')] || globalThis.Date.now;
var Symbol = globalThis['jest-symbol-do-not-touch'] || globalThis.Symbol;
var Promise =
  globalThis[Symbol.for('jest-native-promise')] || globalThis.Promise;
class Jasmine2Reporter {
  _testResults;
  _globalConfig;
  _config;
  _currentSuites;
  _resolve;
  _resultsPromise;
  _startTimes;
  _testPath;
  constructor(globalConfig, config, testPath) {
    this._globalConfig = globalConfig;
    this._config = config;
    this._testPath = testPath;
    this._testResults = [];
    this._currentSuites = [];
    this._resolve = null;
    this._resultsPromise = new Promise(resolve => (this._resolve = resolve));
    this._startTimes = new Map();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  jasmineStarted(_runDetails) {}
  specStarted(spec) {
    this._startTimes.set(spec.id, jestNow());
  }
  specDone(result) {
    this._testResults.push(
      this._extractSpecResults(result, this._currentSuites.slice(0))
    );
  }
  suiteStarted(suite) {
    this._currentSuites.push(suite.description);
  }
  suiteDone(_result) {
    this._currentSuites.pop();
  }
  jasmineDone(_runDetails) {
    let numFailingTests = 0;
    let numPassingTests = 0;
    let numPendingTests = 0;
    let numTodoTests = 0;
    const testResults = this._testResults;
    testResults.forEach(testResult => {
      if (testResult.status === 'failed') {
        numFailingTests++;
      } else if (testResult.status === 'pending') {
        numPendingTests++;
      } else if (testResult.status === 'todo') {
        numTodoTests++;
      } else {
        numPassingTests++;
      }
    });
    const testResult = {
      ...(0, _testResult.createEmptyTestResult)(),
      console: null,
      failureMessage: (0, _jestMessageUtil.formatResultsErrors)(
        testResults,
        this._config,
        this._globalConfig,
        this._testPath
      ),
      numFailingTests,
      numPassingTests,
      numPendingTests,
      numTodoTests,
      snapshot: {
        added: 0,
        fileDeleted: false,
        matched: 0,
        unchecked: 0,
        unmatched: 0,
        updated: 0
      },
      testFilePath: this._testPath,
      testResults
    };
    this._resolve(testResult);
  }
  getResults() {
    return this._resultsPromise;
  }
  _addMissingMessageToStack(stack, message) {
    // Some errors (e.g. Angular injection error) don't prepend error.message
    // to stack, instead the first line of the stack is just plain 'Error'
    const ERROR_REGEX = /^Error:?\s*\n/;
    if (stack && message && !stack.includes(message)) {
      return message + stack.replace(ERROR_REGEX, '\n');
    }
    return stack;
  }
  _extractSpecResults(specResult, ancestorTitles) {
    const status =
      specResult.status === 'disabled' ? 'pending' : specResult.status;
    const start = this._startTimes.get(specResult.id);
    const duration =
      start && !['pending', 'skipped'].includes(status)
        ? jestNow() - start
        : null;
    const location = specResult.__callsite
      ? {
          column: specResult.__callsite.getColumnNumber(),
          line: specResult.__callsite.getLineNumber()
        }
      : null;
    const results = {
      ancestorTitles,
      duration,
      failureDetails: [],
      failureMessages: [],
      fullName: specResult.fullName,
      location,
      numPassingAsserts: 0,
      // Jasmine2 only returns an array of failed asserts.
      status,
      title: specResult.description
    };
    specResult.failedExpectations.forEach(failed => {
      const message =
        !failed.matcherName && typeof failed.stack === 'string'
          ? this._addMissingMessageToStack(failed.stack, failed.message)
          : failed.message || '';
      results.failureMessages.push(message);
      results.failureDetails.push(failed);
    });
    return results;
  }
}
exports.default = Jasmine2Reporter;
