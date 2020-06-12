/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path='../lang/JSError.ts'/>
/// <reference path='../lang/Type.ts'/>
/// <reference path='../util/Types.ts'/>
/// <reference path='../util/Jsons.ts'/>
/// <reference path='../util/Arrays.ts'/>

module JS {

    export namespace lang {

        @klass('JS.lang.AssertError')
        export class AssertError extends JSError { }

        export class Assert {

            /**
             * Fails a test with the given message.
             */
            public static fail(msg?: string) {
                throw new AssertError(msg)
            }

            public static failNotSameType(expected: any, actual: any, msg?: string) {
                this.fail((msg?msg+' ':'') + 'expected type:<' + expected + '> but was:<' + actual + '>')
            }

            public static failNotEqual(expected: any, actual: any, msg?: string) {
                this.fail((msg?msg+' ':'') + 'expected:<' + expected + '> but was:<' + actual + '>')
            }

            public static failEqual(expected: any, actual: any, msg?: string) {
                this.fail((msg?msg+' ':'') + '<' + expected + '> equals to <' + actual + '>')
            }

            public static _equal(expected: any, actual: any): boolean {
                if (expected === actual) return true
                if(Types.isArray(expected) && Types.isArray(actual) && Arrays.equal(expected,actual)) return true
                if(Types.isJsonObject(expected) && Types.isJsonObject(actual) && Jsons.equal(expected,actual)) return true
                return false
            }

            /**
             * Asserts that two objects are equal.
             * @throws AssertError if they are not
             */
            public static equal(expected: any, actual: any, msg?: string) {
                if (this._equal(expected,actual)) return
                this.failNotEqual(expected, actual, msg)
            }
            /**
             * Asserts that two objects are not equal. 
             * @throws AssertError if they are equal
             */
            public static notEqual(expected: any, actual: any, msg?: string) {
                if (!this._equal(expected,actual)) return
                this.failEqual(expected, actual, msg)
            }

            /**
             * Asserts that two objects refer to the same type. 
             * @throws AssertError if they are not same type
             */
            public static sameType(expected: any, actual: any, msg?: string) {
                let eType = Types.type(expected), aType = Types.type(actual);
                if (eType == aType) return
                this.failNotSameType(eType, aType, msg)
            }
            /**
             * Asserts that two objects do not refer to the same type. 
             * @throws AssertError if they are same type
             */
            public static notSameType(expected: any, actual: any, msg?: string) {
                if (Types.type(expected) != Types.type(actual)) return
                this.fail((msg?msg+' ':'') + 'expected not same type')
            }

            /**
             * Asserts that a condition is true. 
             * @throws AssertError if condition is false
             */
            public static true(condition: boolean, msg?: string) {
                if (!condition) this.fail((msg?msg+' ':'') + 'expected:<TRUE> but was:<FALSE>')
            }
            /**
             * Asserts that a condition is false.
             * @throws AssertError if condition is true
             */
            public static false(condition: boolean, msg?: string) {
                if (condition) this.fail((msg?msg+' ':'') + 'expected:<FALSE> but was:<TRUE>')
            }

            /**
             * Asserts that an object isn't null or undefined. 
             * @throws AssertError if object is null or undefined
             */
            public static defined(object: object, msg?: string) {
                this.true(Types.isDefined(object), msg)
            }
            /**
             * Asserts that an object is null or undefined. 
             * @throws AssertError if object is not null or undefined
             */
            public static notDefined(object: object, msg?: string) {
                this.true(!Types.isDefined(object), msg)
            }

            /**
             * Asserts that two arrays are equal. 
             * @throws AssertError if they are not equal
             */
            public static equalArray(expected: any[], actual: any[], msg?: string) {
                if (expected.length == actual.length) {
                    if (expected.every((item: object, index: number) => {
                        return item === actual[index];
                    })) return 
                }
                this.failNotEqual('['+expected.toString()+']', '['+actual.toString()+']', msg)
            }

            /**
             * Asserts that two Dates are equal. 
             * @throws AssertError if they are not equal
             */
            public static equalDate(expected: Date, actual: Date, msg?: string) {
                if (!expected && !actual) return
                if (expected.getTime() === actual.getTime()) return
                this.failNotEqual(expected, actual, msg)
            }

            /**
             * Asserts that a function has error. 
             * @throws AssertError if no error
             */
            public static error(cab: Fallback<any>, msg?: string) {
                let has = false;
                try { Functions.call(cab) } catch (e) { has = true }

                if (!has) this.fail((msg?msg+' ':'') + 'expected throw an error')
            }
            /**
             * Asserts that a function has error. 
             * @throws AssertError if not equal
             */
            public static equalError(error: Klass<Error>, cab: Fallback<any>, msg?: string) {
                let has = false;
                try { Functions.call(cab) } catch (e) { if (Types.ofKlass(e, error)) has = true }

                if (!has) this.fail((msg?msg+' ':'') + 'expected throw an error')
            }

        }

    }

}
import Assert = JS.lang.Assert;
import AssertError = JS.lang.AssertError; 