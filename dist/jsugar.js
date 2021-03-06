//# sourceURL=../dist/jsugar.js
//JSDK 2.7.0 MIT
var Reflect;
(function (Reflect) {
    var A = Array, U8A = Uint8Array, TE = TypeError, OP = Object.prototype, MP = Map.prototype, WMP = WeakMap.prototype, SP = Set.prototype, $o = "object", $f = "function", $u = "undefined", TO = function (v, s) { return typeof v === s; };
    (function (factory) {
        var TO = function (v, s) { return typeof v === s; }, root = typeof global === $o ? global :
            TO(self, $o) ? self :
                TO(this, $o) ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (TO(root.Reflect, $u)) {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (!TO(target[key], $f)) {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = OP.hasOwnProperty, supportsSymbol = TO(Symbol, $f), toPrimitiveSymbol = supportsSymbol && !TO(Symbol.toPrimitive, $u) ? Symbol.toPrimitive : "@@toPrimitive", iteratorSymbol = supportsSymbol && !TO(Symbol.iterator, $u) ? Symbol.iterator : "@@iterator", supportsCreate = TO(Object.create, $f), supportsProto = { __proto__: [] } instanceof A, downLevel = !supportsCreate && !supportsProto, HashMap = {
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (m, k) { return hasOwn.call(m, k); }
                : function (m, k) { return k in m; },
            get: downLevel
                ? function (m, k) { return hasOwn.call(m, k) ? m[k] : undefined; }
                : function (m, k) { return m[k]; }
        }, FProto = Object.getPrototypeOf(Function), usePolyfill = typeof process === $o && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true", _Map = !usePolyfill && TO(Map, $f) && TO(MP.entries, $f) ? Map : CreateMapPolyfill(), _Set = !usePolyfill && TO(Set, $f) && TO(SP.entries, $f) ? Set : CreateSetPolyfill(), _WeakMap = !usePolyfill && TO(WeakMap, $f) ? WeakMap : CreateWeakMapPolyfill(), Metadata = new _WeakMap();
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TE();
                if (!IsObject(target))
                    throw new TE();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TE();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TE();
                if (!IsConstructor(target))
                    throw new TE();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TE();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TE();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TE();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i], decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TE();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TE();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P), parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set(), keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i], hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a], hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [], metadataMap = GetOrCreateMetadataMap(O, P, false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys(), iterator = GetIterator(keysObj), k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        function Type(x) {
            if (x === null)
                return 1;
            switch (typeof x) {
                case $u: return 0;
                case "boolean": return 2;
                case "string": return 3;
                case "symbol": return 4;
                case "number": return 5;
                case $o: return x === null ? 1 : 6;
                default: return 6;
            }
        }
        function IsUndefined(x) {
            return x === undefined;
        }
        function IsNull(x) {
            return x === null;
        }
        function IsSymbol(x) {
            return TO(x, "symbol");
        }
        function IsObject(x) {
            return TO(x, $o) ? x !== null : TO(x, $f);
        }
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0: return input;
                case 1: return input;
                case 2: return input;
                case 3: return input;
                case 4: return input;
                case 5: return input;
            }
            var hint = PreferredType === 3 ? "string" : PreferredType === 5 ? "number" : "default", exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TE();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = Object.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = Object.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = Object.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = Object.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TE();
        }
        function ToBoolean(argument) {
            return !!argument;
        }
        function ToString(argument) {
            return "" + argument;
        }
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        function IsArray(argument) {
            return A.isArray
                ? A.isArray(argument)
                : argument instanceof O
                    ? argument instanceof A
                    : OP.toString.call(argument) === "[object Array]";
        }
        function IsCallable(argument) {
            return TO(argument, $f);
        }
        function IsConstructor(argument) {
            return TO(argument, $f);
        }
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3: return true;
                case 4: return true;
                default: return false;
            }
        }
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TE();
            return func;
        }
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TE();
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TE();
            return iterator;
        }
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof Object !== $f || Object === FProto)
                return proto;
            if (proto !== FProto)
                return proto;
            var prototype = Object.prototype;
            var pProto = prototype && Object.getPrototypeOf(prototype);
            if (pProto == null || pProto === OP)
                return proto;
            var ctor = pProto.constructor;
            if (!TO(ctor, $f))
                return proto;
            if (ctor === O)
                return proto;
            return ctor;
        }
        function CreateMapPolyfill() {
            var cacheSentinel = {}, arraySentinel = [], MapIterator = (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                var P = MapIterator.prototype;
                P["@@iterator"] = function () { return this; };
                P[iteratorSymbol] = function () { return this; };
                P.next = function () {
                    var T = this, index = T._index;
                    if (index >= 0 && index < T._keys.length) {
                        var result = T._selector(T._keys[index], T._values[index]);
                        if (index + 1 >= T._keys.length) {
                            T._index = -1;
                            T._keys = arraySentinel;
                            T._values = arraySentinel;
                        }
                        else {
                            T._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                P.throw = function (e) {
                    var T = this;
                    if (T._index >= 0) {
                        T._index = -1;
                        T._keys = arraySentinel;
                        T._values = arraySentinel;
                    }
                    throw e;
                };
                P.return = function (v) {
                    var T = this;
                    if (T._index >= 0) {
                        T._index = -1;
                        T._keys = arraySentinel;
                        T._values = arraySentinel;
                    }
                    return { value: v, done: true };
                };
                return MapIterator;
            }());
            return (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(MP, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                MP.has = function (k) { return this._find(k, false) >= 0; };
                MP.get = function (k) {
                    var index = this._find(k, false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                MP.set = function (k, v) {
                    var index = this._find(k, true);
                    this._values[index] = v;
                    return this;
                };
                MP.delete = function (k) {
                    var T = this, index = T._find(k, false);
                    if (index >= 0) {
                        var size = T._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            T._keys[i - 1] = T._keys[i];
                            T._values[i - 1] = T._values[i];
                        }
                        T._keys.length--;
                        T._values.length--;
                        if (k === T._cacheKey) {
                            T._cacheKey = cacheSentinel;
                            T._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                MP.clear = function () {
                    var T = this;
                    T._keys.length = 0;
                    T._values.length = 0;
                    T._cacheKey = cacheSentinel;
                    T._cacheIndex = -2;
                };
                MP.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                MP.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                MP.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                MP["@@iterator"] = function () { return this.entries(); };
                MP[iteratorSymbol] = function () { return this.entries(); };
                MP._find = function (k, insert) {
                    var T = this;
                    if (T._cacheKey !== k) {
                        T._cacheIndex = T._keys.indexOf(T._cacheKey = k);
                    }
                    if (T._cacheIndex < 0 && insert) {
                        T._cacheIndex = T._keys.length;
                        T._keys.push(k);
                        T._values.push(undefined);
                    }
                    return T._cacheIndex;
                };
                return Map;
            }());
            function getKey(k, _) {
                return k;
            }
            function getValue(_, v) {
                return v;
            }
            function getEntry(k, v) {
                return [k, v];
            }
        }
        function CreateSetPolyfill() {
            return (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(SP, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                SP.has = function (v) { return this._map.has(v); };
                SP.add = function (v) { return this._map.set(v, v), this; };
                SP.delete = function (v) { return this._map.delete(v); };
                SP.clear = function () { this._map.clear(); };
                SP.keys = function () { return this._map.keys(); };
                SP.values = function () { return this._map.values(); };
                SP.entries = function () { return this._map.entries(); };
                SP["@@iterator"] = function () { return this.keys(); };
                SP[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WMP.has = function (t) {
                    var table = GetOrCreateWeakMapTable(t, false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WMP.get = function (t) {
                    var table = GetOrCreateWeakMapTable(t, false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WMP.set = function (t, v) {
                    var table = GetOrCreateWeakMapTable(t, true);
                    table[this._key] = v;
                    return this;
                };
                WMP.delete = function (t) {
                    var table = GetOrCreateWeakMapTable(t, false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WMP.clear = function () {
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(t, create) {
                if (!hasOwn.call(t, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(t, rootKey, { value: HashMap.create() });
                }
                return t[rootKey];
            }
            function FillRandomBytes(b, size) {
                for (var i = 0; i < size; ++i)
                    b[i] = Math.random() * 0xff | 0;
                return b;
            }
            function GenRandomBytes(s) {
                if (typeof U8A === $f) {
                    if (typeof crypto !== $u)
                        return crypto.getRandomValues(new U8A(s));
                    if (typeof msCrypto !== $u)
                        return msCrypto.getRandomValues(new U8A(s));
                    return FillRandomBytes(new U8A(s), s);
                }
                return FillRandomBytes(new A(s), s);
            }
            function CreateUUID() {
                var d = GenRandomBytes(UUID_SIZE);
                d[6] = d[6] & 0x4f | 0x40;
                d[8] = d[8] & 0xbf | 0x80;
                var r = "";
                for (var f = 0; f < UUID_SIZE; ++f) {
                    var b = d[f];
                    if (f === 4 || f === 6 || f === 8)
                        r += "-";
                    if (b < 16)
                        r += "0";
                    r += b.toString(16).toLowerCase();
                }
                return r;
            }
        }
        function MakeDictionary(b) {
            b.__ = undefined;
            delete b.__;
            return b;
        }
    });
})(Reflect || (Reflect = {}));
var JS;
(function (JS) {
    let sugar;
    (function (sugar) {
        let T = Types, R = Reflect;
        let AnnotationTarget;
        (function (AnnotationTarget) {
            AnnotationTarget[AnnotationTarget["ANY"] = 1] = "ANY";
            AnnotationTarget[AnnotationTarget["CLASS"] = 2] = "CLASS";
            AnnotationTarget[AnnotationTarget["FIELD"] = 4] = "FIELD";
            AnnotationTarget[AnnotationTarget["METHOD"] = 8] = "METHOD";
            AnnotationTarget[AnnotationTarget["PARAMETER"] = 16] = "PARAMETER";
        })(AnnotationTarget = sugar.AnnotationTarget || (sugar.AnnotationTarget = {}));
        class Annotation extends Function {
        }
        sugar.Annotation = Annotation;
        class Annotations {
            static getPropertyType(obj, propertyKey) {
                return R.getMetadata('design:type', obj, propertyKey);
            }
            static getValue(anno, obj, propertyKey) {
                return R.getMetadata(anno.name, obj, propertyKey);
            }
            static setValue(annoName, metaValue, obj, propertyKey) {
                R.defineMetadata(typeof annoName == 'string' ? annoName : annoName.name, metaValue, obj, propertyKey);
            }
            static hasAnnotation(anno, obj, propertyKey) {
                return R.hasMetadata(anno.name, obj, propertyKey);
            }
            static getAnnotations(obj) {
                return R.getMetadataKeys(obj);
            }
            static define(definition, params) {
                let args = Arrays.newArray(params), isStr = T.isString(definition), annoName = isStr ? definition : definition.name, handler = isStr ? null : definition.handler, target = (isStr ? AnnotationTarget.ANY : definition.target) || AnnotationTarget.ANY, fn = function (anno, values, obj, key, d) {
                    if (0 == (target & AnnotationTarget.ANY)) {
                        if (T.equalKlass(obj)) {
                            if (0 == (target & AnnotationTarget.CLASS))
                                return _wrongTarget(anno, obj.name);
                        }
                        else if (key) {
                            if (T.isFunction(obj[key])) {
                                if (0 == (target & AnnotationTarget.METHOD))
                                    return _wrongTarget(anno, obj.constructor.name, key, 'method');
                            }
                            else {
                                if (0 == (target & AnnotationTarget.FIELD))
                                    return _wrongTarget(anno, obj.constructor.name, key, 'field');
                            }
                        }
                    }
                    Annotations.setValue(anno, values, obj, key);
                    if (handler)
                        handler.apply(null, [anno, values, obj, key, d]);
                };
                if (T.equalKlass(args[0])) {
                    let obj = args[0];
                    let detor = function (tar) {
                        fn.call(null, annoName, undefined, tar);
                    };
                    return R.decorate([detor], obj);
                }
                else if (args.length == 3 && args[0]['constructor']) {
                    let obj = args[0], key = args[1], desc = args[2];
                    let detor = function (tar, k) {
                        fn.call(null, annoName, undefined, tar, k, desc);
                    };
                    return R.decorate([detor], obj, key);
                }
                let values = args;
                return function (tar, key, d) {
                    fn.call(null, annoName, values, tar, key, d);
                };
            }
        }
        sugar.Annotations = Annotations;
        var _wrongTarget = function (anno, klass, key, type) {
            JSLogger.error(key ?
                `A [${anno}] annotation should not be marked on the '${key}' ${type} of ${klass}.`
                :
                    `A [${anno}] annotation should not be marked on the '${klass}' class.`);
        };
    })(sugar = JS.sugar || (JS.sugar = {}));
})(JS || (JS = {}));
var AnnotationTarget = JS.sugar.AnnotationTarget;
var Annotation = JS.sugar.Annotation;
var Annotations = JS.sugar.Annotations;
var JS;
(function (JS) {
    let sugar;
    (function (sugar) {
        let Y = Types, J = Jsons;
        function klass(fullName) {
            return sugar.Annotations.define({
                name: 'klass',
                handler: (anno, values, obj) => {
                    Class.reflect(obj, values[0]);
                },
                target: sugar.AnnotationTarget.CLASS
            }, [fullName]);
        }
        sugar.klass = klass;
        class Method {
            constructor(clazz, name, isStatic, fn, paramTypes, returnType) {
                this.isStatic = false;
                this.annotations = [];
                this.parameterAnnotations = [];
                this.ownerClass = clazz;
                this.name = name;
                this.paramTypes = paramTypes;
                this.returnType = returnType;
                this.fn = fn;
                this.isStatic = isStatic;
            }
            invoke(obj, ...args) {
                let fn = this.isStatic ? this.ownerClass.getKlass() : this.fn, context = this.isStatic ? this.ownerClass.getKlass() : obj;
                return Reflect.apply(fn, context, args);
            }
        }
        sugar.Method = Method;
        class Field {
            constructor(clazz, name, isStatic, type) {
                this.isStatic = false;
                this.annotations = [];
                this.ownerClass = clazz;
                this.name = name;
                this.type = type;
                this.isStatic = isStatic;
            }
            set(value, obj) {
                let target = this.isStatic ? this.ownerClass.getKlass() : obj;
                target[this.name] = value;
            }
            get(obj) {
                let target = this.isStatic ? this.ownerClass.getKlass() : obj;
                return target[this.name];
            }
        }
        sugar.Field = Field;
        class Class {
            constructor(name, klass) {
                this._methods = {};
                this._fields = {};
                this.name = name;
                klass.class = this;
                this._klass = klass;
                this.shortName = this._klass.name;
                this._superklass = Class.getSuperklass(this._klass);
                this._init();
            }
            static getSuperklass(klass) {
                if (Object === klass)
                    return null;
                let sup = Object.getPrototypeOf(klass);
                return Object.getPrototypeOf(Object) === sup ? Object : sup;
            }
            static _reflectable(obj, className) {
                obj.className = className;
                if (!obj.getClass) {
                    obj.getClass = function () {
                        return Class.forName(this.className);
                    };
                }
            }
            static byName(name) {
                if (!name)
                    return null;
                var p = name.split('.'), len = p.length, p0 = p[0], b = window[p0] || eval(p0);
                if (!b)
                    throw new TypeError('Can\'t found class:' + name);
                for (var i = 1; i < len; i++) {
                    var pi = p[i];
                    if (!pi)
                        break;
                    b[pi] = b[pi] || {};
                    b = b[pi];
                }
                return b;
            }
            static newInstance(ctor, ...args) {
                let tar = Y.isString(ctor) ? Class.byName(ctor) : ctor;
                if (!tar)
                    throw new NotFoundError(`The class<${ctor}> is not found!`);
                return Reflect.construct(tar, J.clone(args));
            }
            static aliasInstance(alias, ...args) {
                let cls = Class.forName(alias, true);
                if (!cls)
                    throw new NotFoundError(`The class<${alias}> is not found!`);
                return cls.newInstance.apply(cls, args);
            }
            static aop(klass, method, advisor) {
                let isStatic = klass.hasOwnProperty(method), m = isStatic ? klass[method] : klass.prototype[method];
                if (!Y.isFunction(m))
                    return;
                let obj = isStatic ? klass : klass.prototype;
                if (!obj.hasOwnProperty('__' + method))
                    obj['__' + method] = m;
                Object.defineProperty(obj, method, {
                    value: m.aop(advisor),
                    writable: true
                });
            }
            static cancelAop(klass, method) {
                let isStatic = klass.hasOwnProperty(method), m = isStatic ? klass[method] : klass.prototype[method];
                if (!Y.isFunction(m))
                    return;
                let obj = isStatic ? klass : klass.prototype;
                obj[method] = obj['__' + method];
            }
            aop(method, advisor) {
                let m = this.method(method);
                if (!m)
                    return;
                let pro = m.isStatic ? this._klass : this._klass.prototype;
                pro[method] = m.fn.aop(advisor);
            }
            _cancelAop(m) {
                let pro = m.isStatic ? this._klass : this._klass.prototype;
                pro[m.name] = m.fn;
            }
            cancelAop(method) {
                let ms = method ? [this.method(method)] : this.methods();
                ms.forEach(m => {
                    this._cancelAop(m);
                });
            }
            equals(cls) {
                if (!cls)
                    return false;
                return cls instanceof Class ? this.getKlass() === cls.getKlass() : this.getKlass() === cls;
            }
            subclassOf(cls) {
                let klass = (cls.constructor && cls.constructor === Class) ? cls.getKlass() : cls;
                return Y.subklassOf(this.getKlass(), klass);
            }
            newInstance(...args) {
                let obj = Reflect.construct(this._klass, Arrays.newArray(arguments));
                Class._reflectable(obj, this.name);
                return obj;
            }
            getSuperclass() {
                if (this === Object.class)
                    return null;
                return this._superklass ? this._superklass.class : Object.class;
            }
            getKlass() {
                return this._klass.prototype.constructor;
            }
            _parseStaticMembers(ctor) {
                let mKeys = ctor === Object ? ['class'] : Reflect.ownKeys(ctor);
                for (let i = 0, len = mKeys.length; i < len; i++) {
                    const key = mKeys[i].toString();
                    if (!this._isValidStatic(key))
                        continue;
                    const obj = ctor[key];
                    if (Y.isFunction(obj)) {
                        this._methods[key] = new Method(this, key, true, obj, null, null);
                    }
                    else {
                        this._fields[key] = new Field(this, key, true, Y.type(obj));
                    }
                }
            }
            _parseInstanceMembers(proto) {
                let protoKeys = proto === Object.prototype ? ['toString'] : Reflect.ownKeys(proto);
                for (let i = 0, len = protoKeys.length; i < len; i++) {
                    const key = protoKeys[i].toString();
                    if (!this._isValidInstance(key))
                        continue;
                    const obj = this._forceProto(proto, key);
                    if (Y.isFunction(obj)) {
                        this._methods[key] = new Method(this, key, false, obj, null, null);
                    }
                    else {
                        this._fields[key] = new Field(this, key, false, Y.type(obj));
                    }
                }
            }
            _forceProto(proto, key) {
                let rst;
                try {
                    rst = proto[key];
                }
                catch (e) {
                    if (this._klass === File) {
                        if (key == 'lastModified')
                            return 0;
                        if (key == 'lastModifiedDate')
                            return new Date();
                    }
                    try {
                        let obj = this.newInstance();
                        return obj[key];
                    }
                    catch (e1) {
                        return '';
                    }
                }
                return rst;
            }
            _isValidStatic(mName) {
                return ['prototype', 'name', 'length'].findIndex(v => {
                    return v == mName;
                }) < 0;
            }
            _isValidInstance(mName) {
                return !mName.startsWith('__') && mName != 'constructor';
            }
            _init() {
                this._parseStaticMembers(this._klass);
                this._parseInstanceMembers(this._klass.prototype);
            }
            _toArray(json) {
                let arr = [];
                J.forEach(json, v => {
                    arr[arr.length] = v;
                });
                return arr;
            }
            method(name) {
                return this.methodsMap()[name];
            }
            methodsMap() {
                return this._methods;
            }
            methods() {
                return this._toArray(this.methodsMap());
            }
            field(name, instance) {
                return this.fieldsMap(instance)[name];
            }
            _instanceFields(instance) {
                let fs = {}, keys = Reflect.ownKeys(instance);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i].toString();
                    if (this._isValidInstance(key)) {
                        const obj = instance[key];
                        if (!Y.isFunction(obj))
                            fs[key] = new Field(this, key, false, Y.type(obj));
                    }
                }
                this._fields = J.union(fs, this._fields);
            }
            fieldsMap(instance, anno) {
                if (instance)
                    this._instanceFields(instance);
                let fs = {};
                if (anno && instance) {
                    J.forEach(this._fields, (field, key) => {
                        if (sugar.Annotations.hasAnnotation(anno, instance, key))
                            fs[key] = field;
                    });
                }
                else {
                    fs = this._fields;
                }
                return fs;
            }
            fields(instance, anno) {
                return this._toArray(this.fieldsMap(instance, anno));
            }
            static forName(name, isAlias) {
                if (!name)
                    return null;
                let isStr = Y.isString(name);
                if (!isStr && name.class)
                    return name.class;
                let classname = isStr ? name : name.name;
                return isAlias ? this._ALIAS_MAP[classname] : this._MAP[classname];
            }
            static all() {
                return this._MAP;
            }
            static reflect(klass, className, alias) {
                let name = className || klass.name, cls = this.forName(name);
                if (cls)
                    return;
                if (klass !== Object) {
                    var $P = klass.prototype;
                    $P.className = name;
                    $P.getClass = function () { return Class.forName(name); };
                }
                let cs = new Class(name, klass);
                this._MAP[name] = cs;
                if (alias)
                    this._ALIAS_MAP[alias] = cs;
            }
            static classesOf(ns) {
                if (!ns)
                    return null;
                if (ns.endsWith('.*'))
                    ns = ns.slice(0, ns.length - 2);
                let a = [];
                J.forEach(this._MAP, (cls, name) => {
                    if (name.startsWith(ns))
                        a.push(cls);
                });
                return a;
            }
        }
        Class._MAP = {};
        Class._ALIAS_MAP = {};
        sugar.Class = Class;
    })(sugar = JS.sugar || (JS.sugar = {}));
})(JS || (JS = {}));
var Method = JS.sugar.Method;
var Field = JS.sugar.Field;
var Class = JS.sugar.Class;
var klass = JS.sugar.klass;
Class.reflect(Object);
var JS;
(function (JS) {
    let sugar;
    (function (sugar) {
        let T = Types;
        function deprecated(info) {
            return sugar.Annotations.define({
                name: 'deprecated',
                handler: (anno, values, obj, propertyKey) => {
                    let info = values ? (values[0] || '') : '', text = null;
                    if (T.equalKlass(obj)) {
                        text = `The [${obj.name}] class`;
                    }
                    else {
                        let klass = obj.constructor;
                        text = `The [${propertyKey}] ${T.isFunction(obj[propertyKey]) ? 'method' : 'field'} of ${klass.name}`;
                    }
                    JSLogger.warn(text + ' has been deprecated. ' + info);
                }
            }, arguments);
        }
        sugar.deprecated = deprecated;
        var _aop = function (args, fn, anno) {
            return sugar.Annotations.define({
                name: anno,
                handler: (anno, values, obj, methodName) => {
                    let adv = {};
                    if (T.isFunction(values[0])) {
                        adv[anno] = values[0];
                    }
                    else {
                        adv = values[0];
                        if (!adv)
                            return;
                    }
                    sugar.Class.aop(obj.constructor, methodName, adv);
                },
                target: sugar.AnnotationTarget.METHOD
            }, args);
        };
        function before(fn) {
            return _aop(arguments, fn, 'before');
        }
        sugar.before = before;
        function after(fn) {
            return _aop(arguments, fn, 'after');
        }
        sugar.after = after;
        function around(fn) {
            return _aop(arguments, fn, 'around');
        }
        sugar.around = around;
        function throws(fn) {
            return _aop(arguments, fn, 'throws');
        }
        sugar.throws = throws;
    })(sugar = JS.sugar || (JS.sugar = {}));
})(JS || (JS = {}));
(function () {
    let $F = Function.prototype;
    $F.aop = function (advisor, that) {
        let old = this, fn = function () {
            let args = Arrays.newArray(arguments), ctx = that || this, rst = undefined;
            if (advisor.before)
                advisor.before.apply(ctx, args);
            try {
                rst = advisor.around ? advisor.around.apply(ctx, [old].concat(args)) : old.apply(ctx, args);
            }
            catch (e) {
                if (advisor.throws)
                    advisor.throws.apply(ctx, [e]);
            }
            if (advisor.after)
                advisor.after.apply(ctx, [rst]);
            return rst;
        };
        return fn;
    };
    $F.mixin = function (kls, methodNames) {
        if (!kls)
            return;
        let kp = kls.prototype, tp = this.prototype, ms = Reflect.ownKeys(kp);
        for (let i = 0, len = ms.length; i < len; i++) {
            let m = ms[i];
            if ('constructor' != m && !tp[m]) {
                if (methodNames) {
                    if (methodNames.findIndex(v => { return v == m; }) > -1)
                        tp[m] = kp[m];
                }
                else {
                    tp[m] = kp[m];
                }
            }
        }
    };
})();
var __decorate = function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    if (key && r && typeof target[key] == 'function')
        delete r.value;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var deprecated = JS.sugar.deprecated;
var before = JS.sugar.before;
var after = JS.sugar.after;
var around = JS.sugar.around;
var throws = JS.sugar.throws;
