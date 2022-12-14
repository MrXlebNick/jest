'use strict';

function path() {
  const data = _interopRequireWildcard(require('path'));
  path = function () {
    return data;
  };
  return data;
}
function repl() {
  const data = _interopRequireWildcard(require('repl'));
  repl = function () {
    return data;
  };
  return data;
}
function util() {
  const data = _interopRequireWildcard(require('util'));
  util = function () {
    return data;
  };
  return data;
}
function _vm() {
  const data = require('vm');
  _vm = function () {
    return data;
  };
  return data;
}
function _jestUtil() {
  const data = require('jest-util');
  _jestUtil = function () {
    return data;
  };
  return data;
}
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
/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// TODO: support async as well
let transformer;
let transformerConfig;
const evalCommand = (cmd, _context, _filename, callback) => {
  let result;
  try {
    if (transformer != null) {
      const transformResult = transformer.process(
        cmd,
        jestGlobalConfig.replname ?? 'jest.js',
        {
          cacheFS: new Map(),
          config: jestProjectConfig,
          configString: JSON.stringify(jestProjectConfig),
          instrument: false,
          supportsDynamicImport: false,
          supportsExportNamespaceFrom: false,
          supportsStaticESM: false,
          supportsTopLevelAwait: false,
          transformerConfig
        }
      );
      cmd =
        typeof transformResult === 'string'
          ? transformResult
          : transformResult.code;
    }
    result = (0, _vm().runInThisContext)(cmd);
  } catch (e) {
    return callback(isRecoverableError(e) ? new (repl().Recoverable)(e) : e);
  }
  return callback(null, result);
};
const isRecoverableError = error => {
  if (!util().types.isNativeError(error)) {
    return false;
  }
  if (error.name === 'SyntaxError') {
    return [
      'Unterminated template',
      'Missing } in template expression',
      'Unexpected end of input',
      'missing ) after argument list',
      'Unexpected token'
    ].some(exception => error.message.includes(exception));
  }
  return false;
};
if (jestProjectConfig.transform) {
  let transformerPath = null;
  for (let i = 0; i < jestProjectConfig.transform.length; i++) {
    if (new RegExp(jestProjectConfig.transform[i][0]).test('foobar.js')) {
      transformerPath = jestProjectConfig.transform[i][1];
      transformerConfig = jestProjectConfig.transform[i][2];
      break;
    }
  }
  if (transformerPath != null) {
    const transformerOrFactory = (0, _jestUtil().interopRequireDefault)(
      require(transformerPath)
    ).default;
    if (typeof transformerOrFactory.createTransformer === 'function') {
      transformer = transformerOrFactory.createTransformer(transformerConfig);
    } else {
      transformer = transformerOrFactory;
    }
    if (typeof transformer?.process !== 'function') {
      throw new TypeError(
        'Jest: a transformer must export a `process` function.'
      );
    }
  }
}
const replInstance = repl().start({
  eval: evalCommand,
  prompt: '\u203A ',
  useGlobal: true
});
replInstance.context.require = moduleName => {
  if (/(\/|\\|\.)/.test(moduleName)) {
    moduleName = path().resolve(process.cwd(), moduleName);
  }
  return require(moduleName);
};
