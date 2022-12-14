'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.alignedAnsiStyleSerializer = void 0;
function _ansiRegex() {
  const data = _interopRequireDefault(require('ansi-regex'));
  _ansiRegex = function () {
    return data;
  };
  return data;
}
function _ansiStyles() {
  const data = _interopRequireDefault(require('ansi-styles'));
  _ansiStyles = function () {
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

const alignedAnsiStyleSerializer = {
  serialize(val) {
    // Return the string itself, not escaped nor enclosed in double quote marks.
    return val.replace((0, _ansiRegex().default)(), match => {
      switch (match) {
        case _ansiStyles().default.inverse.open:
          return '<i>';
        case _ansiStyles().default.inverse.close:
          return '</i>';
        case _ansiStyles().default.bold.open:
          return '<b>';
        case _ansiStyles().default.dim.open:
          return '<d>';
        case _ansiStyles().default.green.open:
          return '<g>';
        case _ansiStyles().default.red.open:
          return '<r>';
        case _ansiStyles().default.yellow.open:
          return '<y>';
        case _ansiStyles().default.bgYellow.open:
          return '<Y>';
        case _ansiStyles().default.bold.close:
        case _ansiStyles().default.dim.close:
        case _ansiStyles().default.green.close:
        case _ansiStyles().default.red.close:
        case _ansiStyles().default.yellow.close:
        case _ansiStyles().default.bgYellow.close:
          return '</>';
        default:
          return match;
        // unexpected escape sequence
      }
    });
  },

  test(val) {
    return typeof val === 'string';
  }
};
exports.alignedAnsiStyleSerializer = alignedAnsiStyleSerializer;
