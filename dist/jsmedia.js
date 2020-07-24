//@ sourceURL=jsmedia.js
/**
* JSDK 2.3.0 
* https://github.com/fengboyue/jsdk/
* (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
* MIT license
*/
var JS;
(function (JS) {
    let media;
    (function (media) {
        let W = window, A = W.AudioContext || W['msAudioContext'], AC = new A();
        class Sound {
            constructor(cfg) {
                this._bus = new EventBus(this);
                this._d = false;
                let m = this;
                m._cfg = Jsons.union({
                    volume: 1,
                    loop: false
                }, cfg);
                if (m._cfg.on)
                    Jsons.forEach(m._cfg.on, (v, k) => { m._bus.on(k, v); });
            }
            _check() {
                if (this._d)
                    throw new StateError('The object was destroyed!');
            }
            load(url) {
                let m = this;
                m._check();
                return new Promise((resolve, reject) => {
                    Ajax.get({
                        url: url,
                        type: 'arraybuffer',
                        onSending: req => {
                            if (m._cfg.on && m._cfg.on.loading)
                                m._bus.fire('loading', [req]);
                        },
                        onCompleted: res => {
                            AC.decodeAudioData(res.data, (buffer) => {
                                m._src = url;
                                m._buffer = buffer;
                                resolve(m);
                            }, err => {
                                if (m._cfg.on && m._cfg.on.decode_error)
                                    m._bus.fire('decode_error', [err]);
                                reject(err);
                            });
                        },
                        onError: res => {
                            if (m._cfg.on && m._cfg.on.load_error)
                                m._bus.fire('load_error', [res]);
                            reject(res);
                        }
                    });
                });
            }
            on(type, fn, once) {
                this._bus.on(type, fn, once);
                return this;
            }
            off(type, fn) {
                this._bus.off(type, fn);
                return this;
            }
            loop(is) {
                let m = this;
                if (is == void 0)
                    return m._cfg.loop;
                m._cfg.loop = is;
                return m;
            }
            src() {
                return this._src;
            }
            play(delay, offset, duration) {
                let m = this;
                m._check();
                m.stop();
                m._gain = AC.createGain();
                m._gain.gain.value = m._cfg.volume;
                m._node = AC.createBufferSource();
                m._node.buffer = m._buffer;
                let c = m._cfg;
                m._node.loop = c.loop;
                if (c.on && c.on.ended)
                    m._node.onended = e => {
                        m._bus.fire('ended');
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
                if (c.on && c.on.playing)
                    m._bus.fire('playing', [AC, m._gain.gain]);
                m._node.start(delay || 0, offset || 0, duration);
            }
            stop() {
                this._check();
                if (this._node)
                    this._node.stop();
            }
            volume(n) {
                this._check();
                this._cfg.volume = n;
                if (this._gain)
                    this._gain.gain.value = n;
            }
            destroy() {
                let m = this;
                m._d = true;
                m._cfg = null;
                m._src = null;
                m._buffer = null;
                m._gain.disconnect();
                m._node.disconnect();
                m._bus.destroy();
            }
        }
        media.Sound = Sound;
    })(media = JS.media || (JS.media = {}));
})(JS || (JS = {}));
var Sound = JS.media.Sound;
var JS;
(function (JS) {
    let media;
    (function (media) {
        class Video {
            constructor(c) {
                let m = this;
                m._c = Jsons.union({
                    controls: true,
                    autoplay: false,
                    loop: false,
                    muted: false,
                    preload: 'auto'
                }, c);
                m._src = m._c.src;
                let el = $1('#' + m._c.id);
                if (el) {
                    m._el = el;
                    Jsons.forEach(m._c, (v, k) => {
                        if (k != 'id' && k != 'ctor' && k != 'on')
                            m._el.attr(k, v);
                    });
                }
                else {
                    let ctr = (Types.isString(m._c.appendTo) ? $1(m._c.appendTo) : m._c.appendTo) || document.body, id = m._c.id || Random.uuid(4);
                    ctr.append(Strings.nodeHTML('video', {
                        id: id,
                        controls: m._c.controls,
                        loop: m._c.loop,
                        muted: m._c.muted,
                        preload: m._c.preload,
                        poster: m._c.poster,
                        width: m._c.width,
                        height: m._c.height,
                        src: m._c.src
                    }));
                    this._el = $1(`#${id}`);
                }
                if (m._c.on)
                    Jsons.forEach(m._c.on, (v, k) => { this.on(k, v); });
            }
            src(src) {
                let m = this;
                if (!src)
                    return m._src;
                m._src = src;
                m._el.src = src;
                m._el.load();
                return m;
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
        media.Video = Video;
    })(media = JS.media || (JS.media = {}));
})(JS || (JS = {}));
var Video = JS.media.Video;