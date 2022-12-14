'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
Object.defineProperty(exports, 'repl', {
  enumerable: true,
  get: function () {
    return _cli.run;
  }
});
Object.defineProperty(exports, 'runtime', {
  enumerable: true,
  get: function () {
    return _runtimeCli.run;
  }
});
var _cli = require('./cli');
var _runtimeCli = require('./cli/runtime-cli');
