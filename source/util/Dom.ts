/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
/// <reference path="../net/Http.ts"/>
/// <reference path="EventBus.ts"/>
/**
 * Add methods for Dom object
 */
interface HTMLElement {

    box(): { x: number, y: number, w: number, h: number };

    attr(key: string): string;
    attr(key: string, val: string): this;

    on(type: string, listener: (this: HTMLElement, e: Event) => boolean | void, useCapture?: boolean): this;
    on(type: string, listener: (this: HTMLElement, e: Event) => boolean | void, options?: {
        capture?: boolean,
        once?: boolean,
        passive?: boolean
    }): this;
    off(type?: string, listener?: (this: HTMLElement, e: Event) => boolean | void): this;

    find(selector: string): HTMLElement;
    findAll(selector: string): NodeListOf<HTMLElement>;

    /**
     * Returns the computed style of this element.
     * @param pseudo 
     */
    computedStyle(pseudo?: string): CSSStyleDeclaration;
}
/**
 * Add methods for document object
 */
interface Document {
    on(type: string, listener: (this: Document, e: Event) => boolean | void, useCapture?: boolean): this;
    on(type: string, listener: (this: Document, e: Event) => boolean | void, options?: {
        capture?: boolean,
        once?: boolean,
        passive?: boolean
    }): this;
    off(type?: string, listener?: (this: Document, e: Event) => boolean | void): this;
}
/**
 * Add methods for window object
 */
interface Window {
    on(type: string, listener: (this: Window, e: Event) => boolean | void, useCapture?: boolean): this;
    on(type: string, listener: (this: Window, e: Event) => boolean | void, options?: {
        capture?: boolean,
        once?: boolean,
        passive?: boolean
    }): this;
    off(type?: string, listener?: (this: Window, e: Event) => boolean | void): this;
}

if (self['HTMLElement']) //当前不在worker线程中
    (function () {
        const D = document,
            HP = HTMLElement.prototype,
            oa = HP.append,
            op = HP.prepend,
            _ad = function (this: HTMLElement, html: string) {
                if (!html) return;
                let div = D.createElement('div'),
                    nodes = null,
                    fg = D.createDocumentFragment();
                div.innerHTML = html;
                nodes = div.childNodes;
                for (let i = 0, len = nodes.length; i < len; i++) {
                    fg.appendChild(nodes[i].cloneNode(true));
                }
                this.appendChild(fg);
                nodes = null;
                fg = null;
            },
            _pd = function (this: HTMLElement, html: string) {
                if (!html) return;
                let div = D.createElement('div'),
                    nodes = null,
                    fg = D.createDocumentFragment();
                div.innerHTML = html;
                nodes = div.childNodes;
                for (let i = 0, len = nodes.length; i < len; i++) {
                    fg.appendChild(nodes[i].cloneNode(true));
                }
                this.insertBefore(fg, this.firstChild);
                nodes = null;
                fg = null;
            };

        /**
         * 原生方法只能添加text；改造后的方法能够添加html
         */
        HP.append = function (...nodes: (Node | string)[]) {
            nodes.forEach(n => {
                typeof n == 'string' ? _ad.call(this, n) : oa.call(this, n.cloneNode(true))
            })
        }
        HP.prepend = function (...nodes: (Node | string)[]) {
            nodes.forEach(n => {
                typeof n == 'string' ? _pd.call(this, n) : op.call(this, n)
            })
        }

        HP.box = function () {
            let box = this.getBoundingClientRect();
            return {
                x: box.x + System.display().docScrollX,
                y: box.x + System.display().docScrollY,
                w: box.width,
                h: box.height
            }
        }

        HP.attr = function (key: string, val?: string) {
            if (arguments.length == 1) return this.getAttribute(key);
            this.setAttribute(key, val);
            return this
        }

        //event functions
        let _on = function (this: EventTarget, type: string, fn: Function, opts?: boolean | {
            capture?: boolean,
            once?: boolean,
            passive?: boolean
        }) {
            if (!this['_bus']) this['_bus'] = new EventBus(this);

            let bus = <EventBus>this['_bus'], cb = e => {
                bus.fire(e)
            }, once = (opts && opts['once']) ? true : false;
            bus.on(type, <any>fn, once);

            //所有主流浏览器，除了IE8及更早IE版本
            if (this.addEventListener) this.addEventListener(type, cb, opts)
        }
        HP.on = function (type: string, fn: Function, opts?: boolean | {
            capture?: boolean,
            once?: boolean,
            passive?: boolean
        }) {
            let types = type.split(' ');
            types.forEach(t => {
                _on.call(this, t, fn, opts)
            })
            return this
        }
        let _rm = function (this: EventTarget, type, fn?: Function) {
            if (!fn) return;
            //所有主流浏览器，除了IE8及更早IE版本
            if (this.removeEventListener) {
                this.removeEventListener(type, <any>fn, true);
                this.removeEventListener(type, <any>fn, false)
            }
        },
            _rms = function (this: EventTarget, type, fns: Function[]) {
                if (fns) fns.forEach(f => { _rm.call(this, type, f) })
            },
            _off = function (this: EventTarget, type: string, fn) {
                let bus = <EventBus>this['_bus'];
                if (bus) {
                    let oFn = fn ? bus.original(type, fn['euid']) : undefined;
                    bus.off(type, oFn);
                    _rm.call(this, type, oFn);
                } else {
                    _rm.call(this, type, fn);
                }
            }
        HP.off = function (type?: string, fn?: Function) {
            if (!type) {
                let bus = <EventBus>this['_bus'];
                if (bus) {
                    let types = bus.types();
                    for (let i = 0, len = types.length; i < len; i++) {
                        let ty = types[i];
                        _rms.call(this, ty, bus.original(ty));
                    }
                    bus.off();
                }
            } else {
                let types = type.split(' ');
                types.forEach(t => {
                    _off.call(this, t, fn)
                })
            }
            return this
        }

        HP.find = HP.querySelector;
        HP.findAll = HP.querySelectorAll;

        HP.computedStyle = function (p?: string) {
            return document.defaultView.getComputedStyle(this, p || null)
        }

        let DP = Document.prototype;
        DP.on = <any>HP.addEventListener;
        DP.off = <any>HP.removeEventListener;

        let WP = Window.prototype;
        WP.on = <any>HP.addEventListener;
        WP.off = <any>HP.removeEventListener;
    })()

module JS {

    export namespace util {

        let D: Document,
            _head = () => { return D.querySelector('head') },
            _uncached = (url: string) => {
                return `${url}${url.indexOf('?') < 0 ? '?' : '&'}_=${new Date().getTime()}`
            }
        if (self['HTMLElement']) D = document;//当前不在worker线程中    

        /**
         * Dom Helper
         */
        export class Dom {

            /**
             * Returns the first element that is a descendant of node that matches selectors.
             */
            public static $1(selector: string | HTMLElement): HTMLElement {
                return typeof selector == 'string' ? D.querySelector(selector) : selector
            }

            /**
             * Returns all element descendants of node that match selectors.
             */
            public static $L(selector: string): NodeListOf<HTMLElement> {
                return D.querySelectorAll(selector)
            }

            /**
             * Replace old node in DOM tree with new tag name.
             */
            public static rename(node: Element, newTagName: string) {
                let newNode = D.createElement(newTagName), aNames: string[] = node['getAttributeNames']();
                if (aNames) aNames.forEach(name => {
                    newNode.setAttribute(name, node.getAttribute(name))
                });
                (<any>newNode).append.apply(newNode, node.childNodes);
                node.parentNode.replaceChild(newNode, node);
            }

            /**
             * Apply css style code in current page.
             */
            public static applyStyle(code: string, id?: string) {
                if (!code) return;
                (<any>this.$1('head')).append(`<style${id ? ' id="' + id + '"' : ''}>${code}</style>`);
            }

            /**
             * Insert and apply a new HTML fragment in current page.
             */
            public static applyHtml(html: string | HTMLDocument, appendTo?: string | HTMLElement, ignore?: { script?: boolean, css?: boolean } | boolean): Promise<string> {
                if (!html) return Promise.reject(null);
                return Promises.create<string>(function () {
                    let doc: HTMLDocument = typeof html == 'string' ? new DOMParser().parseFromString(html, 'text/html') : html,
                        url = doc.URL,
                        el = Dom.$1(appendTo || D.body);
                    (<any>el).append.apply(el, doc.body.childNodes);

                    let ignoreCss = ignore === true || (ignore && ignore.css) ? true : false;
                    if (!ignoreCss) {
                        //加载内嵌样式
                        let cssFiles = doc.querySelectorAll('link[rel=stylesheet]');
                        if (cssFiles) {
                            for (let i = 0, len = cssFiles.length; i < len; i++) {
                                let css = cssFiles[i], href = css.getAttribute('href');
                                if (href) Dom.loadCSS(href, false)
                            }
                        }
                    }
                    let ignoreScript = ignore === true || (ignore && ignore.script) ? true : false;
                    if (!ignoreScript) {
                        //加载并执行内嵌JS
                        let scs = doc.getElementsByTagName('script'), syncs = [], back = () => {
                            syncs = null;
                            scs = null;
                            if (typeof html == 'string') doc = null;
                            this.resolve(url)
                        };
                        if (scs && scs.length > 0) {
                            for (let i = 0, len = scs.length; i < len; i++) {
                                let sc = scs[i];
                                sc.src ? (sc.async ? Dom.loadJS(sc.src, true) : syncs.push(Dom.loadJS(sc.src, false))) : eval(sc.text)
                            }
                            Promises.order(syncs).then(() => {
                                back()
                            }).catch((u) => {
                                JSLogger.error('Load inner script fail: ' + u + '\n; parent html:' + url);
                                back()
                            })
                        } else {
                            back()
                        }
                    } else {
                        if (typeof html == 'string') doc = null;
                        this.resolve(url)
                    }
                })
            }

            public static loadCSS(url: string, async: boolean = false, uncached?: boolean) {
                if (!url) return Promise.reject(null);
                return Promises.create<string>(function () {
                    let k = D.createElement('link'), back = () => {
                        k.onload = k.onerror = k['onreadystatechange'] = null;
                        k = null;
                        this.resolve(url);
                    };
                    k.type = 'text/css';
                    k.rel = 'stylesheet';
                    k.charset = 'utf-8';
                    if (!async) {
                        k['onreadystatechange'] = () => {//兼容IE
                            if (k['readyState'] == 'loaded' || k['readyState'] == 'complete') back()
                        }
                        k.onload = k.onerror = back
                    }
                    k.href = uncached ? _uncached(url) : url;
                    _head().appendChild(k);
                    if (async) back();
                })
            }
            public static loadJS(url: string, async: boolean = false, uncached?: boolean) {
                if (!url) return Promise.reject(null);
                return Promises.create<string>(function () {
                    let s = D.createElement('script'), back = () => {
                        s.onload = s.onerror = s['onreadystatechange'] = null;
                        s = null;
                        this.resolve(url);
                    };
                    s.type = 'text/javascript';
                    s.async = async;
                    if (!async) {
                        s['onreadystatechange'] = () => {//兼容IE
                            if (s['readyState'] == 'loaded' || s['readyState'] == 'complete') back()
                        }
                        s.onload = s.onerror = back
                    }
                    s.src = uncached ? _uncached(url) : url;
                    _head().appendChild(s);
                    if (async) back();
                })
            }

            public static loadHTML(
                url: string, async?: boolean,
                opts?: {
                    appendTo?: string | HTMLElement,
                    ignore?: { script?: boolean, css?: boolean } | boolean,
                    prehandle?: (doc: HTMLDocument) => HTMLDocument
                }
            ): Promise<string> {
                if (!url) return Promise.reject(null);
                return Promises.create<string>(function () {
                    Http.get({
                        responseType: 'html',
                        url: url,
                        cache: false,
                        async: async
                    }).then((res) => {
                        let appendTo = opts && opts.appendTo,
                            ignore = opts && opts.ignore,
                            prehandle = opts && opts.prehandle;
                        Dom.applyHtml(prehandle ? prehandle(res.data) : res.data, appendTo, ignore).then(() => {
                            this.resolve(url)
                        })
                    })
                })
            }

        }
    }
}

import Dom = JS.util.Dom;
const $1 = Dom.$1;
const $L = Dom.$L;