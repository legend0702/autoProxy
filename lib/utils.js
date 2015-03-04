"use strict";

var utils = utils || {};
// if this use to compile,module will be assignment.
if (module) {
    module.exports = utils;
}

// trim
utils.rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
// toJson
utils.cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
// stringify
utils.escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

utils.class2type = {};

// emptyArray
utils.emptyArray = [];
// Array.slice
utils.core_slice = utils.emptyArray.slice
// Array.concat
utils.core_concat = utils.emptyArray.concat;
utils.core_push = utils.emptyArray.push;
utils.core_toString = utils.class2type.toString;
utils.core_hasOwn = utils.class2type.hasOwnProperty;

// Use a stripped-down indexOf as it's faster than native
// http://jsperf.com/thor-indexof-vs-for/5
utils.core_indexOf = function (list, elem) {
    var i = 0,
        len = list.length;
    for (; i < len; i++) {
        if (list[i] === elem) {
            return i;
        }
    }
    return -1;
};

//A emptyFunction property
utils.emptyFunction = function () {};

utils.noop = utils.emptyFunction;

utils.isUndefined = function (obj) {
    return obj === undefined;
};

utils.isNull = function (obj) {
    return obj === null;
};

utils.isUseful = function (obj) {
    return (!utils.isUndefined(obj) && !(utils.isNull(obj)));
};

utils.error = function (msg) {
    throw new Error(msg);
};

utils.type = function (obj) {
    if (utils.isNull(obj)) {
        return String(obj);
    }
    return typeof obj === "object" || typeof obj === "function" ? utils.class2type[utils.core_toString
        .call(obj)] || "object" : typeof obj;
};

// See test/unit/core.js for details concerning isFunction.
// Since version 1.3, DOM methods and functions like alert
// aren't supported. They return false on IE (#2968).
utils.isFunction = function (obj) {
    return utils.type(obj) === "function";
};

utils.isArray = Array.isArray || function (obj) {
    return utils.type(obj) === "array";
};

utils.isWindow = function (obj) {
    return obj != null && obj == obj.window;
};

utils.isNumeric = function (obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
};

// utils.isDate = util.isDate;

utils.isArrayLike = function (obj) {
    var length = obj.length, type = utils.type(obj);

    if (type === "function" || utils.isWindow(obj)) {
        return false;
    }

    if (obj.nodeType === 1 && length) {
        return true;
    }

    return type === "array" || length === 0 ||
        typeof length === "number" && length > 0 && ( length - 1 ) in obj;
};

utils.isPlainObject = function (obj) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor
    // property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if (!obj || utils.type(obj) !== "object" || obj.nodeType
        || utils.isWindow(obj)) {
        return false;
    }

    try {
        // Not own constructor property must be Object
        if (obj.constructor
            && !utils.core_hasOwn.call(obj, "constructor")
            && !utils.core_hasOwn.call(obj.constructor.prototype,
                "isPrototypeOf")) {
            return false;
        }
    } catch (e) {
        // IE8,9 Will throw exceptions on certain host objects #9897
        return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.

    var key;
    for (key in obj) {
    }

    return key === undefined || utils.core_hasOwn.call(obj, key);
};

utils.isEmptyObject = function (obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
};

utils.error = function (msg) {
    throw console.error(msg);
};

// Convert dashed to camelCase; used by the css and data modules
// Microsoft forgot to hump their vendor prefix (#9572)
utils.camelCase = function (string) {
    return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
};

// Otherwise use our own trimming functionality
utils.trim = function (text) {
    return text == null ? "" : (text + "").replace(utils.rtrim, "");
};

// results is for internal usage only
utils.makeArray = function (arr, results) {
    var ret = results || [];

    if (arr != null) {
        if (utils.isArrayLike(Object(arr))) {
            utils.merge(ret, typeof arr === "string" ? [ arr ] : arr);
        } else {
            utils.core_push.call(ret, arr);
        }
    }

    return ret;
};

// Use origin(obj) to makeArray
utils.toArray = function (obj) {
    if (utils.isArray(obj))
        return obj;
    return [obj];
};

utils.inArray = function (elem, arr, i) {
    var len;

    if (arr) {
        if (utils.core_indexOf) {
            return utils.core_indexOf.call(arr, elem, i);
        }

        len = arr.length;
        i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

        for (; i < len; i++) {
            // Skip accessing in sparse arrays
            if (i in arr && arr[i] === elem) {
                return i;
            }
        }
    }

    return -1;
};

utils.merge = function (first, second) {
    var len = +second.length,
        j = 0,
        i = first.length;
    for (; j < len; j++) {
        first[ i++ ] = second[ j ];
    }
    first.length = i;
    return first;
};

utils.grep = function (elems, callback, inv) {
    var retVal, ret = [], i = 0, length = elems.length;
    inv = !!inv;

    // Go through the array, only saving the items
    // that pass the validator function
    for (; i < length; i++) {
        retVal = !!callback(elems[i], i);
        if (inv !== retVal) {
            ret.push(elems[i]);
        }
    }
    return ret;
};

// arg is for internal usage only
utils.map = function (elems, callback, arg) {
    var value, i = 0, length = elems.length, isArray = utils.isArrayLike(elems), ret = [];

    // Go through the array, translating each of the items to their
    if (isArray) {
        for (; i < length; i++) {
            value = callback(elems[i], i, arg);

            if (value != null) {
                ret[ret.length] = value;
            }
        }

        // Go through every key on the object,
    } else {
        for (i in elems) {
            value = callback(elems[i], i, arg);

            if (value != null) {
                ret[ret.length] = value;
            }
        }
    }

    // Flatten any nested arrays
    return utils.core_concat.apply([], ret);
};

// Simple for(var i = 0;i<elems.length;i++){cb(elems[i])};
utils.foreach = function (elems, callback) {
    for (var i = 0, e = elems.length; i < e; i++) {
        callback(i, elems[i])
    }
    ;
};

// args is for internal usage ONLY
utils.each = function (obj, callback, args) {
    var value, i = 0, length = obj.length, isArray = utils.isArrayLike(obj);

    if (args) {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.apply(obj[i], args);

                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.apply(obj[i], args);

                if (value === false) {
                    break;
                }
            }
        }

        // A special, fast, case for the most common use of each
    } else {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.call(obj[i], i, obj[i]);

                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.call(obj[i], i, obj[i]);

                if (value === false) {
                    break;
                }
            }
        }
    }
    return obj;
};

// Plur callback will be called with obj(param)
utils.chain = function (obj, callbacks) {
    var isArr = utils.isArrayLike(obj), cbs = utils.toArray(callbacks);
    utils.each(obj, function (i, elem) {
        var ele = elem
        if (!isArr) {
            ele = this;
        }
        utils.foreach(cbs, function (k, cb) {
            cb(ele, i);
        });
    });
};

utils.each("Boolean Number String Function Array Date RegExp Object Error"
    .split(" "), function (i, name) {
    utils.class2type["[object " + name + "]"] = name.toLowerCase();
});

utils.extend = function () {
    var src, copyIsArray, copy, name, options, clone, target = arguments[0]
        || {}, i = 1, length = arguments.length, deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;
        // skip the boolean and the target
        target = arguments[1] || {};
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !utils.isFunction(target)) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if (length === i) {
        target = this;
        --i;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep
                    && copy
                    && (utils.isPlainObject(copy) || (copyIsArray = utils
                        .isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && utils.isArray(src) ? src : [];

                    } else {
                        clone = src && utils.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = utils.extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    // Return the modified object
    return target;
};

utils.extend(utils, {
    /**
     * Extend default option from new option
     */
    def: function (defOptions, options) {
        // copy the defOptions,so so it will not modify the origin :)
        var def = defOptions ? utils.extend({}, defOptions) : {};
        if (options) {
            return utils.extend(def, options)
        }
        return def;
    },
    /*
     *  Create hashCode by string
     */
    hashCode: function (str) {
        var h = 0, off = 0;
        for (var i = 0, e = str.length; i < e; i++) {
            var temp = str.charCodeAt(off++);
            h = 31 * h + temp;
            if (h > 0x7fffffff || h < 0x80000000) {
                h = h & 0xffffffff;
            }
        }
        h ^= (h >>> 20) ^ (h >>> 12);
        return h ^ (h >>> 7) ^ (h >>> 4);
    }
});