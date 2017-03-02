/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
ACT.define('Class', [/*@<*/'Debug', /*>@*/ 'Lang'], function (ACT) {
    'use strict';

    var Lang = ACT.Lang;

    /*@<*/
    var debug = ACT.Debug;
    debug.log('[ ACT_class.js ]: loaded');
    /*>@*/

    /**
     * Class object.
     * @module ACT
     * @class Class
     */
    /* istanbul ignore next */
    function Class() {
        // this.ATTRS = JSON.parse(JSON.stringify(this.constructor.superclass.ATTRS));
        // this.setAttrs(config);
        // this.initializer(config);
    }

    /**
     * @attribute ATTRS
     * @type {{NAME: string, version: string}}
     * @initOnly
     */
    Class.ATTRS = {
        NAME: 'Class',
        version: '1.1.0',

        /**
         * An array to keep references to all events created in the runtime of this class.
         * All events registered in this array will be removed when the instance is removed
         * @attribute eventList
         * @type Array
         */
        eventList: []
    };

    Class.prototype = {

        constructor: Class,

        init: function (config) {
            if (this.constructor.superclass) {
                this.ATTRS = Lang.merge({}, this.constructor.superclass.ATTRS);
            } else {
                this.ATTRS = Lang.merge({}, Class.ATTRS);
            }

            this.setAttrs(config);
            this.initializer(config);
        },

        /**
         * @method initializer
         */
        initializer: function () {},

        /**
         * @method destructor
         */
        destructor: function () {},

        /**
         * @method get
         */
        get: function (name) {
            return this.ATTRS[name];
        },

        /**
         * @method set
         */
        set: function (name, value) {
            this.ATTRS[name] = value;
        },

        /**
         * @method destroy
         */
        destroy: function () {
            // Remove all registered events
            this.removeEventListeners();

               // calling overridable destructor function
            this.destructor();
        },

        /**
         * @method setAttrs
         */
        setAttrs: function (attributes) {
            var root = this;
            Lang.forEach(attributes, function (attrName, value) {
                root.set(attrName, value);
            });
        },

        /**
         * Using this funciton register all event listener created on the run time of the instance so they can be cleared when the instance is destroyed
         *
         * @method addEventListeners
         * @param {Objects} ...eventListeners List of event listeners to be removed when the instance is destroyed
         *
         * example:
         * @example
         *    this.addEventListeners(eventListener1, eventListener2, eventListener3) // single elemenents
         */
        addEventListeners: function () {
            var eventList = this.get('eventList');
            var index;
            // looping through arguments is better than using Array.prototype.push.apply because of Old IE browsers
            for (index = 0; index < arguments.length; index++) {
                eventList.push(arguments[index]);
            }
        },

        /**
         * Clean all event listeners registed
         * @method removeEventListners
         */
        removeEventListeners: function () {
            var eventList = this.get('eventList');
            var event;
            while (eventList.length > 0) {
                event = eventList.shift();
                if (Lang.isFunction(event.remove)) {
                    event.remove();
                }
            }
        }
    };

    return Class;
});
