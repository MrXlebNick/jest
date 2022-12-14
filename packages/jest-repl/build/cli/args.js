'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.usage = exports.options = void 0;
/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const usage = 'Usage: $0 [--config=<pathToConfigFile>]';
exports.usage = usage;
const runtimeCLIOptions = {
  cache: {
    default: true,
    description:
      'Whether to use the preprocessor cache. Disable ' +
      'the cache using --no-cache.',
    type: 'boolean'
  },
  config: {
    alias: 'c',
    description: 'The path to a Jest config file.',
    type: 'string'
  },
  debug: {
    description: 'Print debugging info about your jest config.',
    type: 'boolean'
  },
  watchman: {
    default: true,
    description:
      'Whether to use watchman for file crawling. Disable using ' +
      '--no-watchman.',
    type: 'boolean'
  }
};
const options = {
  ...runtimeCLIOptions,
  replname: {
    alias: 'r',
    description:
      'The "name" of the file given to transformers to be ' +
      'transformed. For example, "repl.ts" if using a TypeScript transformer.',
    type: 'string'
  }
};
exports.options = options;
