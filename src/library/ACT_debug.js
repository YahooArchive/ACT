/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* eslint no-console: 0 */
/* global ACT, console */
ACT.define('Debug', [], function () {
    'use strict';

    var hasConsole = window.console || false;
    /**
     * ACT Debug Module, essentially a wrapper for console: log, warn, error and info.
     *
     *	var debug = ACT.Debug;
     *	debug.log("Log message here");
     *
     * @class Debug
     * @constructor
     * @module ACT
     * @static
     */
    function Debug() {
        /* This is a singleton. */
        /* istanbul ignore if */
        if (Debug.prototype.singleton) {
            return Debug.prototype.singleton;
        }
        Debug.prototype.singleton = this;
    }

    /**
     * @attribute ATTRS
     * @type {{NAME: string, version: string}}
     * @initOnly
     */
    Debug.ATTRS = {
        NAME: 'Debug',
        version: '1.1.0'
    };

    Debug.prototype = {

        /**
         * Simple wrapper for console.log
         * @method log
         * @public
         */
        log: function () {
            /* istanbul ignore else */
            if (hasConsole) {
                // Replicate the use of console.log as though it was "natively" called.
                // apply try catch for IE8 and below
                try {
                    console.log.apply(console, arguments);
                } catch (e) {
                    console.log(arguments);
                }
            }
        },

        /**
         * Simple wrapper for console.error
         * @method error
         * @public
         */
        error: function () {
            /* istanbul ignore else */
            if (hasConsole) {
                // Replicate the use of console.log as though it was "natively" called.
                // apply try catch for IE8 and below
                try {
                    console.error.apply(console, arguments);
                } catch (e) {
                    console.error(arguments);
                }
            }
        },

        /**
         * Simple wrapper for console.warn
         * @method warn
         * @public
         */
        warn: function () {
            /* istanbul ignore else */
            if (hasConsole) {
                // Replicate the use of console.log as though it was "natively" called.
                // apply try catch for IE8 and below
                try {
                    console.warn.apply(console, arguments);
                } catch (e) {
                    console.warn(arguments);
                }
            }
        },

        /**
         * Simple wrapper for console.info
         * @method info
         * @public
         */
        info: function () {
            /* istanbul ignore else */
            if (hasConsole) {
                // Replicate the use of console.log as though it was "natively" called.
                // apply try catch for IE8 and below
                try {
                    console.info.apply(console, arguments);
                } catch (e) {
                    console.info(arguments);
                }
            }
        }

    };

    return new Debug();
});
