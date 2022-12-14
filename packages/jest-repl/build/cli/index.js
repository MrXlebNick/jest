#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.run = run;
function _yargs() {
  const data = _interopRequireDefault(require('yargs'));
  _yargs = function () {
    return data;
  };
  return data;
}
function _jestConfig() {
  const data = require('jest-config');
  _jestConfig = function () {
    return data;
  };
  return data;
}
function _jestValidate() {
  const data = require('jest-validate');
  _jestValidate = function () {
    return data;
  };
  return data;
}
var args = _interopRequireWildcard(require('./args'));
var _runtimeCli = require('./runtime-cli');
var _version = require('./version');
function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj};
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
const REPL_SCRIPT = require.resolve('./repl');
function run() {
  const argv = _yargs().default.usage(args.usage).options(args.options).argv;
  (0, _jestValidate().validateCLIOptions)(argv, {
    ...args.options,
    deprecationEntries: _jestConfig().deprecationEntries
  });
  argv._ = [REPL_SCRIPT];
  return (0, _runtimeCli.run)(argv, [`Jest REPL v${_version.VERSION}`]);
}
