'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;
var _assert = require('assert');
var _jestUtil = require('jest-util');
var _ExpectationFailed = _interopRequireDefault(
  require('../ExpectationFailed')
);
var _assertionErrorMessage = _interopRequireDefault(
  require('../assertionErrorMessage')
);
var _expectationResultFactory = _interopRequireDefault(
  require('../expectationResultFactory')
);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// This file is a heavily modified fork of Jasmine. Original license:
/*
Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/* eslint-disable sort-keys, local/prefer-spread-eventually, local/prefer-rest-params-eventually, @typescript-eslint/no-empty-function */

class Spec {
  id;
  description;
  resultCallback;
  queueableFn;
  beforeAndAfterFns;
  userContext;
  onStart;
  getSpecName;
  queueRunnerFactory;
  throwOnExpectationFailure;
  initError;
  result;
  disabled;
  currentRun;
  markedTodo;
  markedPending;
  expand;
  static pendingSpecExceptionMessage;
  static isPendingSpecException(e) {
    return !!(
      e &&
      e.toString &&
      e.toString().indexOf(Spec.pendingSpecExceptionMessage) !== -1
    );
  }
  constructor(attrs) {
    this.resultCallback = attrs.resultCallback || function () {};
    this.id = attrs.id;
    this.description = (0, _jestUtil.convertDescriptorToString)(
      attrs.description
    );
    this.queueableFn = attrs.queueableFn;
    this.beforeAndAfterFns =
      attrs.beforeAndAfterFns ||
      function () {
        return {
          befores: [],
          afters: []
        };
      };
    this.userContext =
      attrs.userContext ||
      function () {
        return {};
      };
    this.onStart = attrs.onStart || function () {};
    this.getSpecName =
      attrs.getSpecName ||
      function () {
        return '';
      };
    this.queueRunnerFactory = attrs.queueRunnerFactory || function () {};
    this.throwOnExpectationFailure = !!attrs.throwOnExpectationFailure;
    this.initError = new Error();
    this.initError.name = '';

    // Without this line v8 stores references to all closures
    // in the stack in the Error object. This line stringifies the stack
    // property to allow garbage-collecting objects on the stack
    // https://crbug.com/v8/7142
    // eslint-disable-next-line no-self-assign
    this.initError.stack = this.initError.stack;
    this.queueableFn.initError = this.initError;

    // @ts-expect-error: misses some fields added later
    this.result = {
      id: this.id,
      description: this.description,
      fullName: this.getFullName(),
      failedExpectations: [],
      passedExpectations: [],
      pendingReason: '',
      testPath: attrs.getTestPath()
    };
  }
  addExpectationResult(passed, data, isError) {
    const expectationResult = (0, _expectationResultFactory.default)(
      data,
      this.initError
    );
    if (passed) {
      this.result.passedExpectations.push(expectationResult);
    } else {
      this.result.failedExpectations.push(expectationResult);
      if (this.throwOnExpectationFailure && !isError) {
        throw new _ExpectationFailed.default();
      }
    }
  }
  execute(onComplete, enabled) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.onStart(this);
    if (
      !this.isExecutable() ||
      this.markedPending ||
      this.markedTodo ||
      enabled === false
    ) {
      complete(enabled);
      return;
    }
    const fns = this.beforeAndAfterFns();
    const allFns = fns.befores.concat(this.queueableFn).concat(fns.afters);
    this.currentRun = this.queueRunnerFactory({
      queueableFns: allFns,
      onException() {
        // @ts-expect-error: wrong context
        self.onException.apply(self, arguments);
      },
      userContext: this.userContext(),
      setTimeout,
      clearTimeout,
      fail: () => {}
    });
    this.currentRun.then(() => complete(true));
    function complete(enabledAgain) {
      self.result.status = self.status(enabledAgain);
      self.resultCallback(self.result);
      if (onComplete) {
        onComplete();
      }
    }
  }
  cancel() {
    if (this.currentRun) {
      this.currentRun.cancel();
    }
  }
  onException(error) {
    if (Spec.isPendingSpecException(error)) {
      this.pend(extractCustomPendingMessage(error));
      return;
    }
    if (error instanceof _ExpectationFailed.default) {
      return;
    }
    this.addExpectationResult(
      false,
      {
        matcherName: '',
        passed: false,
        expected: '',
        actual: '',
        error: this.isAssertionError(error)
          ? (0, _assertionErrorMessage.default)(error, {
              expand: this.expand
            })
          : error
      },
      true
    );
  }
  disable() {
    this.disabled = true;
  }
  pend(message) {
    this.markedPending = true;
    if (message) {
      this.result.pendingReason = message;
    }
  }
  todo() {
    this.markedTodo = true;
  }
  getResult() {
    this.result.status = this.status();
    return this.result;
  }
  status(enabled) {
    if (this.disabled || enabled === false) {
      return 'disabled';
    }
    if (this.markedTodo) {
      return 'todo';
    }
    if (this.markedPending) {
      return 'pending';
    }
    if (this.result.failedExpectations.length > 0) {
      return 'failed';
    } else {
      return 'passed';
    }
  }
  isExecutable() {
    return !this.disabled;
  }
  getFullName() {
    return this.getSpecName(this);
  }
  isAssertionError(error) {
    return (
      error instanceof _assert.AssertionError ||
      (error && error.name === _assert.AssertionError.name)
    );
  }
}
exports.default = Spec;
Spec.pendingSpecExceptionMessage = '=> marked Pending';
const extractCustomPendingMessage = function (e) {
  const fullMessage = e.toString();
  const boilerplateStart = fullMessage.indexOf(
    Spec.pendingSpecExceptionMessage
  );
  const boilerplateEnd =
    boilerplateStart + Spec.pendingSpecExceptionMessage.length;
  return fullMessage.substr(boilerplateEnd);
};
