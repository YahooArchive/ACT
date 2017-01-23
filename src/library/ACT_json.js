/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 *
 * Most of the code in this file uses Public Domain code from https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
 *
 */

/* global ACT */
/* eslint consistent-return: 0, no-nested-ternary: 0, default-case: 0, no-useless-escape: 0 */
ACT.define('Json', [/*@<*/'Debug'/*>@*/], function (ACT) {
    'use strict';

    /**
    * JSON encode functionality.
    *
    * @type Mixed
    * @private
    * @final
    * @static
    */
    var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var gap;
    var indent;
    var meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' };
    var rep;
    var jsonParse;
    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_Json.js ]: loaded');
    /*>@*/

    /**
    * @method quote
    * @param {String} string
    * @private
    */
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    /**
    * @private
    * @method str
    * @param {String} key
    * @param {Object} holder
    */
    function str(key, holder) {
        // Let's allow this special function to have more complexity than normal
        /* jshint maxcomplexity:false */
        var i;
        var k;
        var v;
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

        if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) { return 'null'; }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' : gap ?
                        '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                        '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        /* istanbul ignore else */
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            /* istanbul ignore else */
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ?
                    '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                    '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    /**
    * @private
    * @method stringify
    * @param {Object} value
    * @param {String} replacer
    * @param {String} space
    */
    function stringify(value, replacer, space) {
        var i;
        if (window.JSON && JSON && JSON.stringify) {
            /*@<*/
            Debug.log('[ ACT_json.js ]: using the native strigify function.');
            /*>@*/
            return JSON.stringify(value);
        }

        gap = '';
        indent = '';
        if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }
        } else if (typeof space === 'string') {
            indent = space;
        }
        rep = replacer;
        return str('', { '': value });
    }

    jsonParse = (function () {
        var at; // The index of the current character
        var ch; // The current character
        var text;
        var escapee = {
                '"': '"',
                '\\': '\\',
                '/': '/',
                b: '\b',
                f: '\f',
                n: '\n',
                r: '\r',
                t: '\t'
            };
        var error = function (m) {
            var thrownError = {
                    name: 'SyntaxError',
                    message: m,
                    at: at,
                    text: text
                };
                // Call error when something is wrong.
                throw thrownError;
            };

        var next = function (c) {
                // If a c parameter is provided, verify that it matches the current character.
                if (c && c !== ch) {
                    error("Expected '" + c + "' instead of '" + ch + "'");
                }

                if (!text) {
                    return '';
                }

                // Get the next character. When there are no more characters,
                // return the empty string.
                ch = text.charAt(at);
                at += 1;
                return ch;
            };

            var number = function () {
                // Let's allow this special function to have more complexity than normal
                /* jshint maxcomplexity:false */

                // Parse a number value.
                var num;
                var string = '';

                if (ch === '-') {
                    string = '-';
                    next('-');
                }
                while (ch >= '0' && ch <= '9') {
                    string += ch;
                    next();
                }
                if (ch === '.') {
                    string += '.';
                    while (next() && ch >= '0' && ch <= '9') {
                        string += ch;
                    }
                }
                if (ch === 'e' || ch === 'E') {
                    string += ch;
                    next();
                    /* istanbul ignore else */
                    if (ch === '-' || ch === '+') {
                        string += ch;
                        next();
                    }
                    while (ch >= '0' && ch <= '9') {
                        string += ch;
                        next();
                    }
                }
                num = +string;
                if (!isFinite(num)) {
                    error('Bad number');
                } else {
                    return num;
                }
            };

            var string = function () {
                // Parse a string value.
                var hex;
                var i;
                var strn = '';
                var uffff;

                // When parsing for string values, we must look for " and \ characters.
                /* istanbul ignore else */
                if (ch === '"') {
                    while (next()) {
                        if (ch === '"') {
                            next();
                            return strn;
                        }
                        if (ch === '\\') {
                            next();
                            /* istanbul ignore else */
                            if (ch === 'u') {
                                uffff = 0;
                                // Let's allow this special function to have more complexity than normal
                                /* jshint maxdepth:6 */
                                for (i = 0; i < 4; i += 1) {
                                    hex = parseInt(next(), 16);
                                    if (!isFinite(hex)) {
                                        break;
                                    }
                                    uffff = uffff * 16 + hex;
                                }
                                strn += String.fromCharCode(uffff);
                            } else if (typeof escapee[ch] === 'string') {
                                strn += escapee[ch];
                            } else {
                                break;
                            }
                        } else {
                            strn += ch;
                        }
                    }
                }
                error('Bad string');
            };

           var white = function () {
                // Skip whitespace.
                while (ch && ch <= ' ') {
                    next();
                }
            };

           var word = function () {
                // true, false, or null.
                switch (ch) {
                    case 't':
                        next('t');
                        next('r');
                        next('u');
                        next('e');
                        return true;
                    case 'f':
                        next('f');
                        next('a');
                        next('l');
                        next('s');
                        next('e');
                        return false;
                    case 'n':
                        next('n');
                        next('u');
                        next('l');
                        next('l');
                        return null;
                }
                error("Unexpected '" + ch + "'");
            };

            var value; // Place holder for the value function.

            var array = function () {
                // Parse an array value.
                var arr = [];

                /* istanbul ignore else */
                if (ch === '[') {
                    next('[');
                    white();
                    if (ch === ']') {
                        next(']');
                        return arr; // empty array
                    }
                    while (ch) {
                        arr.push(value());
                        white();
                        if (ch === ']') {
                            next(']');
                            return arr;
                        }
                        next(',');
                        white();
                    }
                }
                error('Bad array');
            };

            var object = function () {
                // Parse an object value.
                var key;
                var obj = {};

                /* istanbul ignore else */
                if (ch === '{') {
                    next('{');
                    white();
                    if (ch === '}') {
                        next('}');
                        return obj; // empty object
                    }
                    while (ch) {
                        key = string();
                        white();
                        next(':');
                        if (Object.hasOwnProperty.call(obj, key)) {
                            error('Duplicate key "' + key + '"');
                        }
                        obj[key] = value();
                        white();
                        if (ch === '}') {
                            next('}');
                            return obj;
                        }
                        next(',');
                        white();
                    }
                }
                error('Bad object');
            };

        value = function () {
            // Parse a JSON value. It could be an object, an array, a string, a number,
            // or a word.
            white();
            switch (ch) {
                case '{':
                    return object();
                case '[':
                    return array();
                case '"':
                    return string();
                case '-':
                    return number();
                default:
                    return ch >= '0' && ch <= '9' ? number() : word();
            }
        };

        // Return the jsonParse function. It will have access to all of the above functions and variables.
        return function (source) {
            var result;
            if (window.JSON && JSON && JSON.parse) {
                /*@<*/
                Debug.log('[ ACT_json.js ]: using the native parse function.');
                /*>@*/
                return JSON.parse(source);
            }
            text = source;
            at = 0;
            ch = ' ';
            result = value();
            white();
            if (ch) {
                error('Syntax error');
            }

            return result;
        };
    }());

    /**
    * JSON functionality for the ACT Framework. Most of the code in this file uses Public Domain code from https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
    * @class Json
    * @module ACT
    */
    function ACTjson() {
        /* This is a singleton. */
        /* istanbul ignore if */
        if (ACTjson.prototype.singleton) {
            return ACTjson.prototype.singleton;
        }
        ACTjson.prototype.singleton = this;
    }

    /**
    * @attribute ATTRS
    * @type {{NAME: string, version: string}}
    * @initOnly
    */
    ACTjson.ATTRS = {
        NAME: 'JSON',
        version: '1.0.41'
    };

    ACTjson.prototype = {
        /**
        * @method stringify
        * @return {String} object in JSON String Notation
        * @param {Mixed} object Given a mixed object/element
        */
        stringify: stringify,

        /**
        * @method parse
        * @return {Object} object
        * @param {String} string Given a string parses it into a proper JavaScript structure
        */
        parse: jsonParse
    };

    return new ACTjson();
});
