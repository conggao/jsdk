/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../lang/System.ts"/>
/// <reference path="StoreHelper.ts"/>

module JS {

    export namespace store {


        /**
         * Session store helper.
         */
        export class SessionStore {

            static get<T extends StoreDataType>(key: string): T {
                let str = sessionStorage.getItem(key);
                if(!str) return undefined;

                return <T>StoreHelper.parse(str);
            };
            static set(key: string, value: StoreDataType): void {
                sessionStorage.setItem(key, StoreHelper.toString(value));
            };
            static remove(key: string): void {
                sessionStorage.removeItem(key);
            };
            static key(i: number): string {
                return sessionStorage.key(i);
            };
            static size(): number {
                return sessionStorage.length;
            };
            static clear() {
                sessionStorage.clear();
            };

        }

    }

}
import SessionStore = JS.store.SessionStore;
