/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Jest } from '@jest/environment';
import type { JestExpect } from '@jest/expect';
import type { Global } from '@jest/types';
import type { ClassLike, FunctionLike, Mock as JestMock, Mocked as JestMocked, MockedClass as JestMockedClass, MockedFunction as JestMockedFunction, MockedObject as JestMockedObject, Spied as JestSpied, SpiedClass as JestSpiedClass, SpiedFunction as JestSpiedFunction, SpiedGetter as JestSpiedGetter, SpiedSetter as JestSpiedSetter, UnknownFunction } from 'jest-mock';
declare global {
    const beforeAll: Global.TestFrameworkGlobals['beforeAll'];
    const beforeEach: Global.TestFrameworkGlobals['beforeEach'];
    const afterEach: Global.TestFrameworkGlobals['afterEach'];
    const afterAll: Global.TestFrameworkGlobals['afterAll'];
    const describe: Global.TestFrameworkGlobals['describe'];
    const fdescribe: Global.TestFrameworkGlobals['fdescribe'];
    const xdescribe: Global.TestFrameworkGlobals['xdescribe'];
    const it: Global.TestFrameworkGlobals['it'];
    const fit: Global.TestFrameworkGlobals['fit'];
    const xit: Global.TestFrameworkGlobals['xit'];
    const test: Global.TestFrameworkGlobals['test'];
    const xtest: Global.TestFrameworkGlobals['xtest'];
    const expect: JestExpect;
    const jest: Jest;
    namespace jest {
        /**
         * Constructs the type of a mock function, e.g. the return type of `jest.fn()`.
         */
        type Mock<T extends FunctionLike = UnknownFunction> = JestMock<T>;
        /**
         * Wraps a class, function or object type with Jest mock type definitions.
         */
        type Mocked<T extends object> = JestMocked<T>;
        /**
         * Wraps a class type with Jest mock type definitions.
         */
        type MockedClass<T extends ClassLike> = JestMockedClass<T>;
        /**
         * Wraps a function type with Jest mock type definitions.
         */
        type MockedFunction<T extends FunctionLike> = JestMockedFunction<T>;
        /**
         * Wraps an object type with Jest mock type definitions.
         */
        type MockedObject<T extends object> = JestMockedObject<T>;
        /**
         * Constructs the type of a spied class or function.
         */
        type Spied<T extends ClassLike | FunctionLike> = JestSpied<T>;
        /**
         * Constructs the type of a spied class.
         */
        type SpiedClass<T extends ClassLike> = JestSpiedClass<T>;
        /**
         * Constructs the type of a spied function.
         */
        type SpiedFunction<T extends FunctionLike> = JestSpiedFunction<T>;
        /**
         * Constructs the type of a spied getter.
         */
        type SpiedGetter<T> = JestSpiedGetter<T>;
        /**
         * Constructs the type of a spied setter.
         */
        type SpiedSetter<T> = JestSpiedSetter<T>;
    }
}
