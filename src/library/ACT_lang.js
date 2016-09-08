/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
ACT.define('Lang', [/*@<*/'Debug'/*>@*/], function (ACT) {
    'use strict';

    /* Constant */
    var lastTime = 0;

    /*@<*/
    var debug = ACT.Debug;
    debug.log('[ ACT_Lang.js ]: loaded');
    /*>@*/

    /**
     * ACT Language Additions - A singleton that adds functionality / ease of use.
     * @class Lang
     * @module ACT
     * @optional debug
     *
     */
    function Lang() {
        /* Lang is a singleton */
        /* istanbul ignore if */
        if (Lang.prototype.singleton) {
            return Lang.prototype.singleton;
        }
        Lang.prototype.singleton = this;
    }

    /**
     * @attribute ATTRS
     * @type {{NAME: string, version: string}}
     * @initOnly
     */
    Lang.ATTRS = {
        NAME: 'Lang',
        version: '1.0.22'
    };

    Lang.prototype = {

        /**
         * Date.now() - Polyfill for now method for ie8
         * @method dateNow
         * @return timestamp millisecond
         * @public
         * @author Mozilla
         */
        dateNow: function () {
            return new Date().getTime();
        },

        /**
         * Bind - binds the function to a scope
         * @param {Object} obj the Scope object
         * @param {Object} args Arguments to pass in to the function
         * @param {Function} func Function to call in the scope
         * @method bind
         * @return to the bound function
         * @public
         * @static
         */
        bind: function (obj, args, func) {
            var bound;
            if (!Function.prototype.bind) {
                bound = function (e) {
                    if (args) {
                        func.apply(obj, [e, args]);
                    } else {
                        func.apply(obj, arguments);
                    }
                };
            } else {
                bound = func.bind(obj);
            }
            return bound;
        },

        /**
         * Mixing properties of 2 objects. Properties in 'from' will overide the same properies in 'to'.
         * The 'to' object will also be overrided after the mix
         *
         * @param  {Object} to   tagert object to be mixed in
         * @param  {Object} from The source object
         * @return {Object}      Mixed object.
         */
        mix: function (to, from) {
            var itor;
            for (itor in from) {
                /* istanbul ignore else */
                if (from.hasOwnProperty(itor)) {
                    to[itor] = from[itor];
                }
            }
            return to;
        },

        /**
         * Get length of an Object
         * @param {Object} obj
         * @method size
         * @return length
         * @public
         * @static
         */
        size: function (obj) {
            var size = 0;
            var key;
            for (key in obj) {
                /* istanbul ignore else */
                if (obj.hasOwnProperty(key)) {
                    size++;
                }
            }
            return size;
        },

        /**
         * Merge the two objects together recursively
         * @param {Object} target Element to merge into
         * @param {Object} from Element to merge properties out of
         * @method merge
         * @return to the newly merged element
         * @public
         * @static
         * Author : jQuery
         */
        merge: function (target, from) {
            var src;
            var copy;
            var clone;
            var copyIsArray = false;
            var name;

            for (name in from) {
                /* istanbul ignore else */
                if (from.hasOwnProperty(name)) {
                    src = target[name];
                    copy = from[name];

                    // Prevent never-ending loop
                    if (target[name] === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    copyIsArray = this.isArray(copy);

                    if (copy && !(this.isFunction(copy)) && (this.isObject(copy) || copyIsArray)) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && this.isArray(src) ? src : [];
                            copy = copy.concat(clone);
                            clone = [];
                        } else {
                            clone = src && this.isObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = this.merge(clone, copy);
                        /* istanbul ignore else */
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
            return target;
        },

        /**
         * Wrapper for setTimeout to help trigger the function with a context.
         * @param {Function} func Function to call
         * @param {Number} time Time in milliseconds after which to execute the function
         * @param {Object} scope The scope to trigger the function in.
         * @param {Object} args Arguments to apss to the function *deprecated for now*
         * @return {Number} the reference to the setTimeout so it can be cancelled
         * @method delay
         * @public
         * @static
         */
        delay: function (func, time, scope, args) {
            var bound = this.bind(scope, args, func);
            var timeout = setTimeout(bound, time);
            return timeout;
        },

        /**
         * Formats a cookie value for an object containing multiple values.
         * @param {Object} hash An object of key-value pairs to create a string for.
         * @return {String} A string suitable for use as a cookie value.
         * @method createHash
         * @public
         * @static
         */
        createHash: function (hash) {
            var text = [];
            var itor;
            var encode = encodeURIComponent;

            for (itor in hash) {
                /* istanbul ignore else */
                if (hash.hasOwnProperty(itor)) {
                    text.push(encode(itor) + '=' + encode(String(hash[itor])));
                }
            }
            return text.join('&');
        },

        /**
         * Parses a cookie hash string into an object.
         * @param {String} text The cookie hash string to parse (format: n1=v1&n2=v2).
         * @return {Object} An object containing entries for each cookie value.
         * @method parseHash
         * @public
         * @static
         * @author YUI3 - cookie.js
         */
        parseHash: function (text) {
            var hashParts;
            var hashPart = null;
            var hash = {};
            var decode = decodeURIComponent;
            var itor = 0;
            var len = 0;

            if (typeof text === 'string') {
                hashParts = text.split('&');
                len = hashParts.length;

                for (itor = 0; itor < len; itor++) {
                    hashPart = hashParts[itor].split('=');
                    hash[decode(hashPart[0])] = decode(hashPart[1]);
                }
            }
            return hash;
        },

        /**
         * Returns true if value is an Object or Function
         * @method isObject
         * @param {Object} value Element to be checked
         * @returns {boolean} Returns true in case it is an Object or a Function
         */
        isObject: function (value) {
            if (value === null) {
                return false;
            }
            return typeof value === 'object' || typeof value === 'function';
        },

        /**
         * Return true if object is null or has no property
         *
         * @param  {Object}  obj Target object to be checked again
         * @return {Boolean}     Return true if object is empty
         */
        isObjectEmpty: function (obj) {
            var key;
            /* null and undefined are "empty" */
            if (obj === null || obj === undefined) {
                return true;
            }

            /* Assume if it has a length property with a non-zero value that that property is correct. */
            if (obj.length > 0) {
                return false;
            }

            if (obj.length === 0) {
                return true;
            }

            /* Otherwise, does it have any properties of its own? */
            for (key in obj) {
                // if (hasOwnProperty.call(obj, key)) {
                /* istanbul ignore else */
                if (obj.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Returns true if value is a Function
         * @method isFunction
         * @param {Object} value Element to be checked
         * @returns {boolean} Returns true in case it is a Function
         */
        isFunction: function (value) {
            return typeof value === 'function';
        },

        /**
         * Returns true if Object has the key
         * @method objHasKey
         * @param {Object} obj Object to be checked
         * @param {String} key Key value to be checked against Object
         * @returns {boolean|*}
         */
        objHasKey: function (obj, key) {
            return this.isObject(obj) && obj.hasOwnProperty(key);
        },

        /**
         * Checks if element is an Array
         * @method isArray
         * @param {Object} value Element to be tested
         * @returns {boolean} Returns true if element is an array
         */
        isArray: function (value) {
            return Object.prototype.toString.call(value) === '[object Array]';
        },

        /**
         * Checks if element is a String
         * @method isString
         * @param {Object} value Element to be evaluated
         * @returns {boolean} Returns true if element is a String
         */
        isString: function (value) {
            return typeof value === 'string';
        },

        /**
         * Checks if element value is a Number
         * @method isNumber
         * @param {Object} value Element to be evaluated
         * @returns {boolean} Returns true if element value is a Number
         */
        isNumber: function (value) {
            if (value === undefined || value === null) {
                return false;
            }

            return !isNaN(value);
        },

        /**
         * Checks if element value and type is a Number
         * @method isStrictNumber
         * @param {Object} value Element to be evaluated
         * @returns {boolean} Returns true if element value and type is a Number
         */
        isStrictNumber: function (value) {
            return (typeof value === 'number') && (!isNaN(value));
        },

        /**
         * Clones Object
         * @method clone
         * @param {Object} obj Object to be cloned
         * @returns {*} Returns a cloned instance of the input Object
         */
        clone: function (obj) {
            var copy;
            var attr;
            /* istanbul ignore else */
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }
            copy = obj.constructor();

            for (attr in obj) {
                /* istanbul ignore else */
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = obj[attr];
                }
            }
            return copy;
        },

        /**
         *    Returns the index of the first item in the array that's equal (using a strict
         *    equality check) to the specified _value_, or `-1` if the value isn't found.
         *
         *    This method wraps the native `Array.indexOf()` method if available.
         *
         *    @method arrayIndexOf
         *    @param {Array} array Array to search.
         *    @param {*} value Value to search for.
         *    @param {Number} [from=0] The index at which to begin the search.
         *    @return {Number} Index of the item strictly equal to _value_, or `-1` if not found.
         **/
        arrayIndexOf: function (array, value, from) {
            var len;
            if (Array.prototype.indexOf) {
                return array.indexOf(value, from);
            }
			len = array.length;

			from = +from || 0;
			from = (from > 0 || -1) * Math.floor(Math.abs(from));

			if (from < 0) {
				from += len;

				if (from < 0) {
					from = 0;
				}
			}

			for (; from < len; ++from) {
				if (from in array && array[from] === value) {
					return from;
				}
			}

			return -1;
        },

        /**
         * Check if an element exists in an array
         * @param array Target Array
         * @param el Element to be checked
         * @return {boolean}
         */
        inArray: function (array, el) {
            return (this.arrayIndexOf(array, el, 0) !== -1);
        },

        /**
         *    Dedupes an array of strings, returning an array that's guaranteed to contain
         *    only one copy of a given string.
         *
         *    @method arrayDedupe
         *    @param {String[]|Number[]} array Array of strings or numbers to dedupe.
         *    @return {Array} Copy of _array_ containing no duplicate values.
         **/
        arrayDedupe: function (array) {
            var hash = {};
            var results = [];
            var i;
            var item;
            var len;

            for (i = 0, len = array.length; i < len; ++i) {
                item = array[i];

                if (!Object.prototype.hasOwnProperty.call(hash, item)) {
                    hash[item] = 1;
                    results.push(item);
                }
            }

            return results;
        },

        /**
        * Utility function to determine if string "A" contains string "B".
        * @param {String} haystack String to search in
        * @param {String} needle The string to search for
        * @method inString
        * @return {Boolean} true if found false otherwise
        * @public
        * @static
        */
        inString: function (haystack, needle) {
            return this.inArray(haystack, needle);
        },

        /**
         * Parses out a Number out of a string 3.0.2 return 3.0
         * @method numberific
         * @return {Float} Number out of a string
         * @param {String} string
         * @author Igor Zingerman ( igorz@yahoo-inc.com )
         * @private
         */
        numberific: function (string) {
            var m = string.match(/[0-9]+.?[0-9]*/);
            if (m && m[0]) {
                return parseFloat(m[0]);
            }
            return 0;
        },

        /**
         * Capitalise firt letter
         * @method capitaliseFirstLetter
         * @param {String} string, value to change
         * @return {String}
         **/
        capitaliseFirstLetter: function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

        /**
         * Check if the reference is a singleton and merge accordingly
         * @method mixin
         * @param {Object} receiver
         * @param {Object} supplier
         **/
        mixin: function (receiver, supplier) {
            if (supplier.prototype !== undefined) {
                this.merge(receiver, supplier.prototype);
            } else {
                this.merge(receiver, supplier.constructor.prototype);
            }
        },

        /**
         * Alternative solution of Object.create()
         * @method create
         * @param {Object} prototype, list of prototype methods
         * @return {Object} Create, fresh instance
         **/
        create: function (prototype) {
            function Create() {}
            Create.prototype = prototype;
            return new Create();
        },

        /**
         * Extend a class from another and define its prototype
         * @method extend
         * @param {Object} receiver
         * @param {Object} supplier
         * @param {Object} prototypes
         * @return {Object} receiver
         */
        extend: function (receiver, supplier, prototypes) {
            // Superclass and Attributes mix of suppliers
            var superclass = receiver.prototype;
            var attributes = {};
            var sup;

            // Check if there is several suppliers
            if (this.isArray(supplier)) {
                for (sup in supplier) {
                    /* istanbul ignore else */
                    if (supplier.hasOwnProperty(sup)) {
                        this.mixin(superclass, supplier[sup]);
                        this.merge(attributes, supplier[sup].ATTRS);
                    }
                }
            } else {
                this.mixin(superclass, supplier);
                this.merge(attributes, supplier.ATTRS);
            }

            // Create the receiver class based on mix suppliers and the new prototype methods
            receiver.prototype = this.create(this.merge(superclass, prototypes));
            receiver.prototype.constructor = receiver;

            // Create super class model and keep as original reference
            receiver.superclass = superclass;
            receiver.superclass.ATTRS = this.merge(attributes, receiver.ATTRS);

            return receiver;
        },

        /**
         * Looping through the object and execute func for each item.
         * If func return false then stop the loop immediately
         *
         * @method forEach
         * @param {Object} obj Object to be looped through
         * @param {Function} func Function to be executed for each item. Func will take 2 args, the index and the value of item respectively
         */
        forEach: function (obj, func) {
            var index;
            for (index in obj) {
                if (obj.hasOwnProperty(index)) {
                    if (func(index, obj[index]) === false) {
                        return;
                    }
                }
            }
        },

        /**
         * Polyfill for requestAnimationFrame
         * @method requestAnimFrame
         * @param {Function} callback
         * @return {Number} id
         * @author Darius Bacon
         */
        requestAnimFrame: function (callback) {
            var now = this.dateNow();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function () {
                callback(lastTime = nextTime);
            }, nextTime - now);
        },

        /**
         * Polyfill for cancelAnimationFrame
         * @method cancelAnimFrame
         * @param {Number} id
         */
        cancelAnimFrame: function (id) {
            window.clearTimeout(id);
        }
    };

    return new Lang();
});
