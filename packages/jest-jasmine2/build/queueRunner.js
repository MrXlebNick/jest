'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = queueRunner;
var _jestUtil = require('jest-util');
var _PCancelable = _interopRequireDefault(require('./PCancelable'));
var _pTimeout = _interopRequireDefault(require('./pTimeout'));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
var Symbol = globalThis['jest-symbol-do-not-touch'] || globalThis.Symbol;
var Symbol = globalThis['jest-symbol-do-not-touch'] || globalThis.Symbol;
var Promise =
  globalThis[Symbol.for('jest-native-promise')] || globalThis.Promise;
function queueRunner(options) {
  const token = new _PCancelable.default((onCancel, resolve) => {
    onCancel(resolve);
  });
  const mapper = ({fn, timeout, initError = new Error()}) => {
    let promise = new Promise(resolve => {
      const next = function (...args) {
        const err = args[0];
        if (err) {
          options.fail.apply(null, args);
        }
        resolve();
      };
      next.fail = function (...args) {
        options.fail.apply(null, args);
        resolve();
      };
      try {
        fn.call(options.userContext, next);
      } catch (e) {
        options.onException(e);
        resolve();
      }
    });
    promise = Promise.race([promise, token]);
    if (!timeout) {
      return promise;
    }
    const timeoutMs = timeout();
    return (0, _pTimeout.default)(
      promise,
      timeoutMs,
      options.clearTimeout,
      options.setTimeout,
      () => {
        initError.message = `Timeout - Async callback was not invoked within the ${(0,
        _jestUtil.formatTime)(
          timeoutMs
        )} timeout specified by jest.setTimeout.`;
        initError.stack = initError.message + initError.stack;
        options.onException(initError);
      }
    );
  };
  const result = options.queueableFns.reduce(
    (promise, fn) => promise.then(() => mapper(fn)),
    Promise.resolve()
  );
  return {
    cancel: token.cancel.bind(token),
    catch: result.catch.bind(result),
    then: result.then.bind(result)
  };
}
