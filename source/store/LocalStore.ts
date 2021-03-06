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

        let L = localStorage;
        /**
         * Local store helper.
         */
        export class LocalStore {

            static get<T extends StoreDataType>(key: string): T {
                let str = L.getItem(key);
                if(!str) return undefined;

                return <T>StoreHelper.parse(str);
            };
            static set(key: string, value: StoreDataType): void {
                L.setItem(key, StoreHelper.toString(value));
            };
            static remove(key: string): void {
                L.removeItem(key);
            };
            static key(i: number): string {
                return L.key(i);
            };
            static size(): number {
                return L.length;
            };
            static clear() {
                L.clear();
            };

        }

    }

}
import LocalStore = JS.store.LocalStore;
