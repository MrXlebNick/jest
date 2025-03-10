'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = treeProcessor;
/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
function treeProcessor(options) {
  const {nodeComplete, nodeStart, queueRunnerFactory, runnableIds, tree} =
    options;
  function isEnabled(node, parentEnabled) {
    return parentEnabled || runnableIds.indexOf(node.id) !== -1;
  }
  function getNodeHandler(node, parentEnabled) {
    const enabled = isEnabled(node, parentEnabled);
    return node.children
      ? getNodeWithChildrenHandler(node, enabled)
      : getNodeWithoutChildrenHandler(node, enabled);
  }
  function getNodeWithoutChildrenHandler(node, enabled) {
    return function fn(done = noop) {
      node.execute(done, enabled);
    };
  }
  function getNodeWithChildrenHandler(node, enabled) {
    return async function fn(done = noop) {
      nodeStart(node);
      await queueRunnerFactory({
        onException: error => node.onException(error),
        queueableFns: wrapChildren(node, enabled),
        userContext: node.sharedUserContext()
      });
      nodeComplete(node);
      done();
    };
  }
  function hasNoEnabledTest(node) {
    return (
      node.disabled ||
      node.markedPending ||
      (node.children?.every(hasNoEnabledTest) ?? false)
    );
  }
  function wrapChildren(node, enabled) {
    if (!node.children) {
      throw new Error('`node.children` is not defined.');
    }
    const children = node.children.map(child => ({
      fn: getNodeHandler(child, enabled)
    }));
    if (hasNoEnabledTest(node)) {
      return children;
    }
    return node.beforeAllFns.concat(children).concat(node.afterAllFns);
  }
  const treeHandler = getNodeHandler(tree, false);
  return treeHandler();
}
