'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.run = run;
function _os() {
  const data = require('os');
  _os = function () {
    return data;
  };
  return data;
}
function path() {
  const data = _interopRequireWildcard(require('path'));
  path = function () {
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
function _chalk() {
  const data = _interopRequireDefault(require('chalk'));
  _chalk = function () {
    return data;
  };
  return data;
}
function _yargs() {
  const data = _interopRequireDefault(require('yargs'));
  _yargs = function () {
    return data;
  };
  return data;
}
function _console() {
  const data = require('@jest/console');
  _console = function () {
    return data;
  };
  return data;
}
function _transform() {
  const data = require('@jest/transform');
  _transform = function () {
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
function _jestRuntime() {
  const data = _interopRequireDefault(require('jest-runtime'));
  _jestRuntime = function () {
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
function _jestValidate() {
  const data = require('jest-validate');
  _jestValidate = function () {
    return data;
  };
  return data;
}
var args = _interopRequireWildcard(require('./args'));
var _version = require('./version');
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
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

async function run(cliArgv, cliInfo) {
  let argv;
  if (cliArgv) {
    argv = cliArgv;
  } else {
    argv = _yargs()
      .default.usage(args.usage)
      .help(false)
      .version(false)
      .options(args.options).argv;
    (0, _jestValidate().validateCLIOptions)(argv, {
      ...args.options,
      deprecationEntries: _jestConfig().deprecationEntries
    });
  }
  if (argv.help === true) {
    _yargs().default.showHelp();
    process.on('exit', () => (process.exitCode = 1));
    return;
  }
  if (argv.version == true) {
    console.log(`v${_version.VERSION}\n`);
    return;
  }
  if (!argv._.length) {
    console.log('Please provide a path to a script. (See --help for details)');
    process.on('exit', () => (process.exitCode = 1));
    return;
  }
  const root = (0, _jestUtil().tryRealpath)(process.cwd());
  const filePath = path().resolve(root, argv._[0].toString());
  if (argv.debug === true) {
    const info = cliInfo ? `, ${cliInfo.join(', ')}` : '';
    console.log(`Using Jest Runtime v${_version.VERSION}${info}`);
  }
  const options = await (0, _jestConfig().readConfig)(argv, root);
  const globalConfig = options.globalConfig;
  // Always disable automocking in scripts.
  const projectConfig = {
    ...options.projectConfig,
    automock: false
  };
  try {
    const hasteMap = await _jestRuntime().default.createContext(projectConfig, {
      maxWorkers: Math.max((0, _os().cpus)().length - 1, 1),
      watchman: globalConfig.watchman
    });
    const transformer = await (0, _transform().createScriptTransformer)(
      projectConfig
    );
    const Environment = await transformer.requireAndTranspileModule(
      projectConfig.testEnvironment
    );
    const customConsole = new (_console().CustomConsole)(
      process.stdout,
      process.stderr
    );
    const environment = new Environment(
      {
        globalConfig,
        projectConfig
      },
      {
        console: customConsole,
        docblockPragmas: {},
        testPath: filePath
      }
    );
    (0, _jestUtil().setGlobal)(environment.global, 'console', customConsole);
    (0, _jestUtil().setGlobal)(
      environment.global,
      'jestProjectConfig',
      projectConfig
    );
    (0, _jestUtil().setGlobal)(
      environment.global,
      'jestGlobalConfig',
      globalConfig
    );
    const runtime = new (_jestRuntime().default)(
      projectConfig,
      environment,
      hasteMap.resolver,
      transformer,
      new Map(),
      {
        changedFiles: undefined,
        collectCoverage: false,
        collectCoverageFrom: [],
        coverageProvider: 'v8',
        sourcesRelatedToTestsInChangedFiles: undefined
      },
      filePath,
      globalConfig
    );
    for (const path of projectConfig.setupFiles) {
      const esm = runtime.unstable_shouldLoadAsEsm(path);
      if (esm) {
        await runtime.unstable_importModule(path);
      } else {
        const setupFile = runtime.requireModule(path);
        if (typeof setupFile === 'function') {
          await setupFile();
        }
      }
    }
    const esm = runtime.unstable_shouldLoadAsEsm(filePath);
    if (esm) {
      await runtime.unstable_importModule(filePath);
    } else {
      runtime.requireModule(filePath);
    }
  } catch (e) {
    console.error(
      _chalk().default.red(util().types.isNativeError(e) ? e.stack : e)
    );
    process.on('exit', () => {
      process.exitCode = 1;
    });
  }
}
