/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.2.0
 * @author Frank.Feng
 */
/// <reference path="Constants.ts"/>

module JS {

    export namespace input {

        let D = document;

        export class KeyEventInit {
            target?: HTMLElement = null;
            /** A Boolean indicating whether the event bubbles. The default is false. */
            bubbles?: boolean = false;
            /** A Boolean indicating whether the event can be cancelled. The default is false. */
            cancelable?: boolean = false;
            /** Optional and defaulting to document.defaultView, of type WindowProxy, that is the Window associated with the event. */
            view?: WindowProxy = null;
            /** Optional and defaulting to false, that indicates if the ctrl key was simultaneously pressed. */
            ctrlKey?: boolean = false;
            /** Optional and defaulting to false, that indicates if the alt key was simultaneously pressed. */
            altKey?: boolean = false;
            /** Optional and defaulting to false, that indicates if the shift key was simultaneously pressed. */
            shiftKey?: boolean = false;
            /** Optional and defaulting to false, that indicates if the meta key was simultaneously pressed. */
            metaKey?: boolean = false;
            /** Whatever data the event was initialized with. */
            detail?:any;
        }

        export class MouseEventInit {
            target?: HTMLElement = null;
            /** A Boolean indicating whether the event bubbles. The default is false. */
            bubbles?: boolean = false;
            /** A Boolean indicating whether the event can be cancelled. The default is false. */
            cancelable?: boolean = false;
            /** Optional and defaulting to doc.defaultView, of type WindowProxy, that is the Window associated with the event. */
            view?: WindowProxy = null;

            /** Optional and defaulting to 0, that is the horizontal position of the mouse event on the user's screen. */
            screenX?: number = 0;
            /** Optional and defaulting to 0, that is the vertical position of the mouse event on the user's screen. */
            screenY?: number = 0;
            /** Optional and defaulting to 0, that is the horizontal position of the mouse event on the client window. */
            clientX?: number = 0;
            /** Optional and defaulting to 0, that is the vertical position of the mouse event on the client window. */
            clientY?: number = 0;
            /** Optional and defaulting to false, that indicates if the ctrl key was simultaneously pressed. */
            ctrlKey?: boolean = false;
            /** Optional and defaulting to false, that indicates if the alt key was simultaneously pressed. */
            altKey?: boolean = false;
            /** Optional and defaulting to false, that indicates if the shift key was simultaneously pressed. */
            shiftKey?: boolean = false;
            /** Optional and defaulting to false, that indicates if the meta key was simultaneously pressed. */
            metaKey?: boolean = false;
            /** Optional and defaulting to 0, that describes which mouse button is pressed during event. */
            button?: MouseButton = 0;
            /** 
             * Optional and defaulting to 0, that describes which buttons are pressed when the event is launched. 
             * 0: No button pressed
             * 1: Main button pressed (usually the left button)
             * 2: Secondary button pressed (usually the right button)
             * 4: Auxiliary button pressed (usually the middle button)
             */
            buttons?: 0 | 1 | 2 | 4 = 0;
            /** Optional and defaulting to null, of type EventTarget, that is the element just left (in case of a mouseenter or mouseover) or is entering (in case of a mouseout or mouseleave). */
            relatedTarget?: EventTarget = null;
        }

        /**
         * A UI events Mocker.
         */
        export class UIMocker {

            public static newKeyEvent(type: KeyboardEvents|string, keyCode: number, args?: KeyEventInit): KeyboardEvent {
                let a: KeyEventInit = Jsons.union(new KeyEventInit(), args),
                    doc = a.target?(<HTMLElement>a.target).ownerDocument:document;
                a.view = a.view || doc.defaultView;

                let eo = new KeyboardEvent(type, a);
                Object.defineProperty(eo, 'keyCode', {
                    value: keyCode,
                    writable: true
                });
                if(a.target) Object.defineProperty(eo, 'target', {
                    value: a.target,
                    writable: true
                });
                return eo
                //old api:
                // eo = D.createEvent('KeyboardEvent');
                // let mList = '';
                // if(a.ctrlKey) mList+=' Control';
                // if(a.altKey) mList+=' Alt';
                // if(a.shiftKey) mList+=' Shift';
                // if(a.metaKey) mList+=' Meta';
                // eo['initKeyboardEvent'](type, a.bubbles, a.cancelable, a.view, a.code, a.key, a.location, mList, a.repeat);
            }
            /**
             * Fires a keyboard event.<br>
             * Note: not support keypress event because special keys has not this event.
             */
            public static fireKeyEvent(type: KeyboardEvents, keyCode: number, args?: KeyEventInit) {
                let n = (args && args.target) || window;
                n.dispatchEvent(this.newKeyEvent(type, keyCode, args))
            }

            public static newMouseEvent(type: MouseEvents|string, args?: MouseEventInit): MouseEvent {
                let m: MouseEventInit = Jsons.union(new MouseEventInit(), args),
                doc = m.target?(<HTMLElement>m.target).ownerDocument:document,
                et: MouseEvent = doc.createEvent('MouseEvents');
                m.view = m.view || doc.defaultView;
                /**
                 * Provides the current (or next, depending on the event) click count.
                 * For click or dblclick events, detail is the current click count.
                 * For mousedown or mouseup events, detail is 1 plus the current click count.
                 * For all other events, detail is always zero.
                 */
                let detail: number = type == 'click' || type == 'mousedown' || type == 'mouseup' ? 1 : (type == 'dblclick' ? 2 : 0);
                et.initMouseEvent(type, m.bubbles, m.cancelable, m.view, detail, m.screenX, m.screenY, m.clientX, m.clientY, m.ctrlKey, m.altKey, m.shiftKey, m.metaKey, m.button, m.relatedTarget);
                return et
            }
            /**
             * Fires a mouse event.
             */
            public static fireMouseEvent(type: MouseEvents, args?: MouseEventInit) {
                let n = (args && args.target) || window;
                n.dispatchEvent(this.newMouseEvent(type, args));
            }
        }

    }
}
import UIMocker = JS.input.UIMocker;