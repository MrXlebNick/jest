'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;
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

/* eslint-disable local/prefer-spread-eventually, local/prefer-rest-params-eventually */

class ReportDispatcher {
  addReporter;
  provideFallbackReporter;
  clearReporters;

  // @ts-expect-error: confused by loop in ctor
  jasmineDone;
  // @ts-expect-error: confused by loop in ctor
  jasmineStarted;
  // @ts-expect-error: confused by loop in ctor
  specDone;
  // @ts-expect-error: confused by loop in ctor
  specStarted;
  // @ts-expect-error: confused by loop in ctor
  suiteDone;
  // @ts-expect-error: confused by loop in ctor
  suiteStarted;
  constructor(methods) {
    const dispatchedMethods = methods || [];
    for (let i = 0; i < dispatchedMethods.length; i++) {
      const method = dispatchedMethods[i];
      this[method] = (function (m) {
        return function () {
          dispatch(m, arguments);
        };
      })(method);
    }
    let reporters = [];
    let fallbackReporter = null;
    this.addReporter = function (reporter) {
      reporters.push(reporter);
    };
    this.provideFallbackReporter = function (reporter) {
      fallbackReporter = reporter;
    };
    this.clearReporters = function () {
      reporters = [];
    };
    return this;
    function dispatch(method, args) {
      if (reporters.length === 0 && fallbackReporter !== null) {
        reporters.push(fallbackReporter);
      }
      for (let i = 0; i < reporters.length; i++) {
        const reporter = reporters[i];
        if (reporter[method]) {
          // @ts-expect-error: wrong context
          reporter[method].apply(reporter, args);
        }
      }
    }
  }
}
exports.default = ReportDispatcher;
