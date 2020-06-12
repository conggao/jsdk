//@ sourceURL=jsvp.js
/**
* JSDK 2.0.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
var JS;
(function (JS) {
    let model;
    (function (model) {
        class AppEvent extends CustomEvent {
            constructor(type, initDict) {
                super(type, initDict);
            }
        }
        model.AppEvent = AppEvent;
        class App {
            static init(settings) {
                this._sets = settings;
                this._sets.properties = this._sets.properties || {};
                this._logger = new Log(this.namespace(), settings.logLevel || LogLevel.INFO);
            }
            static namespace() {
                return this._sets.name + '/' + this.version();
            }
            static appName() {
                return this._sets.name;
            }
            static version() {
                return this._sets.version;
            }
            static logger() {
                return this._logger;
            }
            static properties(properties) {
                if (arguments.length == 0)
                    return this._sets.properties;
                this._sets.properties = Jsons.union(this._sets.properties, properties);
                return this;
            }
            static property(key, val) {
                if (arguments.length == 1)
                    return this.properties()[key];
                return this.properties({ key: val });
            }
            static fireEvent(e, arg) {
                LocalStore.remove(e + '.' + App.namespace());
                LocalStore.set(e + '.' + App.namespace(), arg);
            }
            static onEvent(e, handler, once) {
                this._bus.on(e, handler, once);
            }
            static offEvent(e) {
                this._bus.off(e);
            }
        }
        App._bus = new EventBus(App);
        model.App = App;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var App = JS.model.App;
var AppEvent = JS.model.AppEvent;
(function () {
    var oldSetItem = localStorage.setItem;
    localStorage.setItem = function (key, newValue) {
        var ev = document.createEvent('CustomEvent');
        ev.initCustomEvent('AppEvent', false, false, '');
        ev['key'] = key;
        ev['newValue'] = newValue;
        ev['url'] = Page.uri().toString();
        window.dispatchEvent(ev);
        oldSetItem.apply(this, arguments);
    };
    $(window).on('AppEvent storage', (evt) => {
        let e = evt.originalEvent, name = e.key;
        if (!name)
            return;
        let namespace = '.' + App.namespace();
        if (!name.endsWith(namespace))
            return;
        if (e.newValue == null)
            return;
        let ev = new AppEvent(name.slice(0, name.length - namespace.length));
        ev.url = e.url;
        App._bus.fire(ev, [StoreHelper.parse(e.newValue)]);
    });
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JS;
(function (JS) {
    let model;
    (function (model) {
        let Page = class Page {
            initialize() { }
            ;
            destroy() { }
            ;
            static fireEvent(e, args) {
                this._bus.fire(e, args);
            }
            static onEvent(e, handler) {
                this._bus.on(e, handler);
            }
            static offEvent(e) {
                this._bus.off(e);
            }
            static current(page) {
                if (arguments.length == 0)
                    return this._page;
                this._page = Components.get(page);
                this._bus.context(this._page);
                Bom.ready(() => {
                    this._page.render();
                });
            }
            static view(view) {
                return Components.get(view);
            }
            static uri() {
                return new URI(window.location.href);
            }
            static load(url) {
                let u = url ? url : location.href;
                this.fireEvent('loading', [u]);
                window.location.href = u;
                this.fireEvent('loaded', [u]);
            }
            static open(url, target = 'blank', specs) {
                let args = [url, target];
                if (specs) {
                    let spe = '';
                    Jsons.forEach(specs, (v, k) => {
                        spe += `${k}=${Types.isNumber(v) ? v : (v ? 'yes' : 'no')},`;
                    });
                    if (spe)
                        args.push(spe);
                }
                return window.open.apply(window, args);
            }
            static fullscreen(onoff) {
                if (onoff) {
                    this.fireEvent('fullscreening');
                    Bom.fullscreen();
                    this.fireEvent('fullscreened');
                }
                else {
                    this.fireEvent('normalscreening');
                    Bom.normalscreen();
                    this.fireEvent('normalscreened');
                }
            }
        };
        Page._bus = new EventBus();
        Page = __decorate([
            klass('JS.app.Page')
        ], Page);
        model.Page = Page;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var Page = JS.model.Page;
window.on('load', () => {
    Page.fireEvent('loaded', [window.location.href]);
});
window.on('beforeunload', () => {
    Page.fireEvent('unloading', [window.location.href]);
});
var JS;
(function (JS) {
    let model;
    (function (model_1) {
        var Service_1;
        let Service = Service_1 = class Service {
            initialize() { }
            ;
            destroy() {
                this._proxy = null;
            }
            proxy(proxy) {
                if (arguments.length == 0)
                    return this._proxy;
                this._proxy = proxy;
                return this;
            }
            call(api, params) {
                if (!this._proxy)
                    this._proxy = Class.newInstance(Service_1.DEFAULT_PROXY);
                return new Promise((resolve, reject) => {
                    return this._proxy.execute(api, params).then((result) => {
                        let model = Class.newInstance(api.dataKlass || Model), rds = result.data();
                        Types.ofKlass(model, Model) ? model.setData(rds) : model = rds;
                        resolve(model);
                    }).catch((res) => {
                        reject(res);
                    });
                });
            }
        };
        Service.DEFAULT_PROXY = JsonProxy;
        Service = Service_1 = __decorate([
            klass('JS.app.Service')
        ], Service);
        model_1.Service = Service;
    })(model = JS.model || (JS.model = {}));
})(JS || (JS = {}));
var Service = JS.model.Service;
