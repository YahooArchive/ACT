/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
ACT.define('Animation', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang'], function (ACT) {
    'use strict';

    /* Constants */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    /**
     * Post-fix for css style attributes
     */
    var POSTFIX = {
        top: 'px',
        bottom: 'px',
        left: 'px',
        right: 'px',
        width: 'px',
        height: 'px',
        marginTop: 'px',
        marginBottom: 'px',
        marginLeft: 'px',
        marginRight: 'px',
        paddingTop: 'px',
        paddingBottom: 'px',
        paddingLeft: 'px',
        paddingRight: 'px',
        preset: ''
    };
    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('Animation: loaded');
    /*>@*/

    /**
     * @constructor
     */
    function Animation() {
        /* istanbul ignore if */
        if (Animation.prototype.singleton) {
            return Animation.prototype.singleton;
        }
        Animation.prototype.singleton = this;
    }

    Animation.ATTRS = {

        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'Animation',

        /**
         * @attribute version
         * @type String
         */
        version: '1.1.0'
    };

    /**
     * Core of the animation, containing setInterval loop
     * @param {Object} opts
     * @private
     */
    function animate(opts) {
        var requestID;
        var start = Lang.dateNow();
        var timeUpdate = function () {
            var delta;
            var timePassed = Lang.dateNow() - start;
            var progress = timePassed / opts.duration;

            requestID = Lang.requestAnimFrame(timeUpdate);

            if (progress > 1) {
                progress = 1;
            }

            delta = opts.delta(progress);
            opts.step(delta);

            if (progress === 1) {
                Lang.cancelAnimFrame(requestID);
                opts.onComplete();
            }
        };

        requestID = Lang.requestAnimFrame(timeUpdate);
    }

    /**
     * Isolated context to execute an animation for only one css style attribute
     * @param {HTMLElement} element
     * @param {Sring} attr
     * @param {Number} from
     * @param {Number} to
     * @param {Number} duration
     * @param {Number} delay
     * @param {Function} callback
     * @param {Number} length
     * @param {Number} loop
     * @private
     */
     function attribute(element, attr, from, to, duration, onStart, onComplete, length, loop) {
        var type = POSTFIX.hasOwnProperty(attr) ? POSTFIX[attr] : POSTFIX.preset;

        from = parseInt(from, 10) || 0;
        to = parseInt(to, 10) || 0;

        if (Lang.isFunction(onStart)) {
            onStart();
        }

        animate({
            duration: duration || 1000,
            delta: function (p) {
                /**
                 * Check this tutorial to implement animation type
                 * http://javascript.info/tutorial/animation
                 */
                return p;
            },
            step: function (delta) {
                var result = (to - from) * delta + from;
                element.style[attr] = result + type;
            },
            onComplete: function (res) {
                if (Lang.isFunction(onComplete)) {
                    if (length === loop) {
                        onComplete(res);
                    }
                }
            }
        });
    }

    Animation.prototype = {

        constructor: Animation,

        /**
         * Filter method for the core animation, able to receive a group animation
         * @param {HTMLElement} element can be a string
         * @param {Object} from or to
         * @param {Object} to
         * @param {Object} duration
         * @param {Object} delay
         * @param {Function} onStart callback executed when the group of anim starts
         * @param {Function} onComplete callback executed when the group of anim complete
         * @method anim
         * @public
         */
        /* jshint maxparams: 7 */
        anim: function (element, from, to, duration, delay, onStart, onComplete) {
            var timeout;
            var t;

            // Get the node if the param is the id as string
            if (Lang.isString(element)) {
                element = Dom.byId(element);
            }

            // To become From and From the original style values if the third args is no set
            if (!Lang.isObject(to) || !to) {
                to = from;
                from = {};

                for (t in to) {
                    if (to.hasOwnProperty(t)) {
                        from[t] = element.style[t];
                    }
                }
            }

            // Loop through style attributes for a group of anim
            if (Lang.isObject(from)) {
                // Check if there is a delay
                timeout = setTimeout(function () {
                    var loop = 1;
                    var length = Lang.size(from);
                    var f;
                    for (f in from) {
                        if (from.hasOwnProperty(f)) {
                            attribute(element, f, from[f], to[f], duration, onStart, onComplete, length, loop);
                            loop++;
                        }
                    }
                    clearTimeout(timeout);
                }, delay || 0);
            }
        }
    };

    return new Animation();
});
