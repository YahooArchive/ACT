/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/* global getFeed */

/**
 * The "IO" helper class to dynamically load files.
 *
 * @module IO
 * @main IO
 * @class IO
 * @requires Event, Lang, Dom, Class
 * @global
 */
ACT.define('IO', [/*@<*/'Debug', /*>@*/ 'Event', 'Lang', 'Class'], function (ACT) {
    'use strict';

    /* Shorthand */
    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Class = ACT.Class;

    /**
     * EVENTS
     */
    var EVENT_LOAD_DONE = 'IO:load:done';

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('IO Loaded');
    /*>@*/

    /**
     * @constructor
     */
    function IO(config) {
        this.init(config);
        // Screen.superclass.constructor.apply(this, arguments);
    }

    /**
     * default attribute
     */
    IO.ATTRS = {
        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'IO',
        /**
         * @attribute inputPath
         * @type String
         */
        inputPath: '',

        /**
         * @attribute version
         * @type String
         */
        version: '1.0.22'
    };

    /**
     * Public properties
     */
    Lang.extend(IO, Class, {
        /**
         * Method auto initiated when the class is instantiated
         *
         * @method initializer
         * @public
         * @param {Object} config
         */
        initializer: function (config) {
            this.load(config.dataFeed);
        },

        /**
         * Method load initiated when the class is instantiated
         *
         * @method load
         * @public
         * @param {String} path , Path to file to load
         */
        load: function (path) {
            var script = document.createElement('script');
            var head = document.getElementsByTagName('head')[0];

            if (script.readyState) {  // IE
                /* istanbul ignore next */
                script.onreadystatechange = function () {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        Event.fire(EVENT_LOAD_DONE, getFeed());
                    }
                };
            } else {  // Others
                script.onload = function () {
                    Event.fire(EVENT_LOAD_DONE, getFeed());
                };
            }

            script.type = 'text/javascript';
            script.src = path;
            head.appendChild(script);
        }
    });

    return IO;
});
