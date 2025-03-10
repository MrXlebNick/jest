/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type {AggregatedResult} from '@jest/test-result';

declare function PhabricatorProcessor(
  results: AggregatedResult,
): AggregatedResult;
export default PhabricatorProcessor;

export {};
