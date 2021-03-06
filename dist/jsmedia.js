//# sourceURL=../dist/jsmedia.js
//JSDK 2.7.0 MIT
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var JS;
(function (JS) {
    let media;
    (function (media) {
        class AudioCache {
            constructor(init) {
                this._init = init;
                this._cache = new DataCache({
                    name: init.name
                });
            }
            _load(id, url) {
                let m = this;
                return Promises.create(function () {
                    Http.get({
                        url: url,
                        responseType: 'arraybuffer',
                        success: res => {
                            m.set(id, res.data).then(() => {
                                this.resolve();
                            });
                        }
                    }).catch(res => {
                        if (m._init.loaderror)
                            m._init.loaderror.call(m, res);
                    });
                });
            }
            load(imgs) {
                let ms = Types.isArray(imgs) ? imgs : [imgs], plans = [];
                ms.forEach(img => {
                    plans.push(Promises.newPlan(this._load, [img.id, img.url], this));
                });
                return Promises.order(plans);
            }
            get(id) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield this._cache.read(id);
                });
            }
            set(id, data) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield this._cache.write({
                        id: id,
                        data: data
                    });
                });
            }
            has(id) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield this._cache.hasKey(id);
                });
            }
            clear() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this._cache.clear();
                });
            }
            destroy() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this._cache.destroy();
                });
            }
        }
        media.AudioCache = AudioCache;
    })(media = JS.media || (JS.media = {}));
})(JS || (JS = {}));
var AudioCache = JS.media.AudioCache;
var JS;
(function (JS) {
    let media;
    (function (media) {
        let W = window, A = W.AudioContext || W['msAudioContext'], AC = new A();
        class AudioPro {
            constructor(init) {
                this._init = Jsons.union({
                    volume: 1,
                    loop: false
                }, init);
            }
            static play(id, cache) {
                new AudioPro().play(id, cache);
            }
            loop(is) {
                let m = this;
                if (is == void 0)
                    return m._init.loop;
                m._init.loop = is;
                m._node.loop = is;
                return m;
            }
            _play(a) {
                let m = this;
                m.stop();
                m._gain = AC.createGain();
                m._gain.gain.value = m._init.volume;
                m._node = AC.createBufferSource();
                m._node.buffer = a;
                let c = m._init;
                m._node.loop = c.loop;
                if (c.played)
                    m._node.onended = e => {
                        m._dispose();
                        c.played.call(m);
                    };
                m._node.connect(m._gain);
                if (c.handler) {
                    let node = c.handler.call(m, AC);
                    m._gain.connect(node);
                    node.connect(AC.destination);
                }
                else {
                    m._gain.connect(AC.destination);
                }
                if (c.playing)
                    c.playing.call(m);
                m._node.start();
            }
            play(a, cache) {
                if (typeof a == 'string') {
                    cache.get(a).then(buf => {
                        this.play(buf);
                    });
                }
                else {
                    if (a)
                        AC.decodeAudioData(a, (buffer) => {
                            this._play(buffer);
                        }, err => {
                            JSLogger.error('Decode audio buffer fail!');
                        });
                }
            }
            stop() {
                if (this._node)
                    this._node.stop();
            }
            volume(n) {
                let m = this;
                m._init.volume = n;
                if (m._gain)
                    m._gain.gain.value = n;
            }
            _dispose() {
                let m = this;
                m._gain.disconnect();
                m._node.disconnect();
            }
        }
        media.AudioPro = AudioPro;
    })(media = JS.media || (JS.media = {}));
})(JS || (JS = {}));
var AudioPro = JS.media.AudioPro;
var JS;
(function (JS) {
    let media;
    (function (media) {
        class VideoPlayer {
            constructor(c) {
                let T = this;
                T._c = Jsons.union({
                    controls: true,
                    autoplay: false,
                    loop: false,
                    muted: false,
                    preload: 'auto'
                }, c);
                T._src = T._c.src;
                let el = $1('#' + T._c.id);
                if (el) {
                    T._el = el;
                    Jsons.forEach(T._c, (v, k) => {
                        if (k != 'id' && k != 'ctor' && k != 'on')
                            T._el.attr(k, v);
                    });
                }
                else {
                    let ctr = (Types.isString(T._c.appendTo) ? $1(T._c.appendTo) : T._c.appendTo) || document.body, id = T._c.id || Random.uuid(4);
                    ctr.append(Strings.nodeHTML('video', {
                        id: id,
                        controls: T._c.controls,
                        loop: T._c.loop,
                        muted: T._c.muted,
                        preload: T._c.preload,
                        poster: T._c.poster,
                        width: T._c.width,
                        height: T._c.height,
                        src: T._c.src
                    }));
                    this._el = $1(`#${id}`);
                }
                if (T._c.on)
                    Jsons.forEach(T._c.on, (v, k) => { this.on(k, v); });
            }
            src(src) {
                let T = this;
                if (!src)
                    return T._src;
                T._src = src;
                T._el.src = src;
                T._el.load();
                return T;
            }
            currentTime(t) {
                return this._gs('currentTime', t);
            }
            defaultPlaybackRate(r) {
                return this._gs('defaultPlaybackRate', r);
            }
            playbackRate(r) {
                return this._gs('playbackRate', r);
            }
            defaultMuted(is) {
                return this._gs('defaultMuted', is);
            }
            muted(is) {
                return this._gs('muted', is);
            }
            duration() {
                return this._el.duration;
            }
            play() {
                return this._el.play();
            }
            paused() {
                return this._el.paused;
            }
            ended() {
                return this._el.ended;
            }
            error() {
                return this._el.error;
            }
            loop(is) {
                return this._gs('loop', is);
            }
            played() {
                return this._el.played;
            }
            volume(v) {
                return this._gs('volume', v);
            }
            pause() {
                this._el.pause();
                return this;
            }
            preload(s) {
                return this._gs('preload', s);
            }
            crossOrigin(s) {
                return this._gs('crossOrigin', s);
            }
            _gs(p, v) {
                if (v == void 0)
                    return this._el[p];
                this._el[p] = v;
                return this;
            }
            canPlayType(type) {
                return this._el.canPlayType(type);
            }
            on(e, fn) {
                this._el['on' + e] = fn;
            }
        }
        media.VideoPlayer = VideoPlayer;
    })(media = JS.media || (JS.media = {}));
})(JS || (JS = {}));
var VideoPlayer = JS.media.VideoPlayer;
