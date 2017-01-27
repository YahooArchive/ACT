/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/**
 * This module is helping tracking dwelltime for seletect dome element.
 * Following IAB definition, dwelltime for desktop will be tracked as describe below
 * - Start counting when mouse in target element
 * - Stop counting when mouse leave target element
 * - If mouse leave and come back within 2 seconds, continues counting
 * - If mouse leave for more than 2 seconds, stop counting and send tracking label
 * - If mouse leave after 10 minutes, the track will count as 10 minutes
 * - Maximum counting time is 10 minutes
 *
 * ```
 *     // This example will start track dwelltime for ACT_mpu element
 *     var target = document.getElementById('ACT_mpu');
 *     var mpuDwellTimeTracker = new ACT.DwellTime({
 *           'targetElement': target,
 *           'targetName': 'mpu'
 *        // some other custom config
 *     });
 *
 *     // To stop tracking dwelltime
 *     mpuDwellTimeTracker.destroy();
 * ```
 *
 * @module DwellTime
 * @main DwellTime
 * @class DwellTime
 * @requires Lang, Class, Dom, Event
 * @global
 */

/* global ACT */
ACT.define('DwellTime', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang', 'Class', 'Event'], function (ACT) {
    'use strict';

    /* Shortcuts */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    var Class = ACT.Class;
    var Event = ACT.Event;

    /* Constants */
    var EVENT_MOUSE_ENTER = 'mouseenter';
    var EVENT_MOUSE_LEAVE = 'mouseleave';
    var TRACK_EVENT = 'tracking:track';

    var MAX_DWELL_TIME = 600;
    var MIN_DWELL_TIME = 1;
    var BUFFER_TIME = 2000;

    var TRACKING_CONVENTION = '[__NAME__]_view_dwell_[__TIME__]';

    /*@<*/
    var Debug = ACT.Debug;
    var debugLog = function (message) {
        Debug.log('[ ACT_DwellTime.js ] : ' + message);
    };
    debugLog('loaded');
    /*>@*/

    /**
     * @method DwellTime
     * @contructor
     * @param {Object} config Configuration for dwell time tracking
     * @public
     */
    function DwellTime(config) {
        this.init(config);
    }

    /**
     * @attribute ATTRS
     * @initOnly
     */
    DwellTime.ATTRS = {
        NAME: 'DwellTime',
        version: '1.1.0',

        /**
         * @attribute targetElement
         */
        targetElement: null,

        /**
         * This name will be used in tracking label.
         * e.g if targetName = 'mpu', tracking label will be mpu_view_dwell_10
         * @attribute targetName
         */
        targetName: '',

        /**
         * @attribute begin
         * @type Number
         */
        begin: 0,

        /**
         * @attribute start
         * @type Number
         */
        start: 0,

        /**
         * @attribute stop
         * @type Number
         */
        stop: 0,

        /**
         * @attribute fire
         * @type Number
         */
        fire: 0

    };

    /**
     * List of public function for DwellTime instance
     */
    Lang.extend(DwellTime, Class, {

        /**
         * @method initializer
         */
        initializer: function () {
            var root = this;
            var name = root.get('targetName');
            var target = root.get('targetElement');

            if (!Dom.isDomElement(target) && name !== '') {
                /*@<*/
                debugLog('targetElement must be a DOMElement or targetName should be define');
                /*>@*/
                return;
            }

            /* Set begin in case the user is interacting with the Ad and the mouse is already in when the page load */
            root.set('begin', Lang.dateNow());

            root.addEventListeners(
                Event.on(EVENT_MOUSE_ENTER, root.startCounting, target, root),
                Event.on(EVENT_MOUSE_LEAVE, root.stopCounting, target, root)
            );
        },

        /**
         * Start counting dwelltime for target element if it's not started.
         * If dwelltime counting is already started and it's still in buffer time then clear out the buffer time
         *
         * @method startCounting
         */
        startCounting: function () {
            var root = this;
            var fire = root.get('fire');
            var start = root.get('start');

            /* Set start if doesn't exist yet */
            root.set('start', start || Lang.dateNow());

            if (fire) {
                /*@<*/
                debugLog('clearout 2 second buffer when enter');
                /*>@*/
                clearTimeout(fire);
            }

            /* Re-assign fire to instance */
            root.set('fire', fire);
        },

        /**
         * Stop counting dwelltime for target element
         *
         * @method stopCounting
         */
        stopCounting: function () {
            var root = this;
            var time;
            var label;
            var fire = root.get('fire');
            var name = root.get('targetName');
            var stop = Math.round((Lang.dateNow() - (root.get('start') || root.get('begin'))) / 1000);

            if (fire) {
                /*@<*/
                debugLog('clearout 2 second buffer when leave');
                /*>@*/
                clearTimeout(fire);
            }

            fire = setTimeout(function () {
                if (stop > MIN_DWELL_TIME) {
                    root.removeEventListeners();

                    time = stop > MAX_DWELL_TIME ? MAX_DWELL_TIME : stop;

                    label = TRACKING_CONVENTION
                        .replace('[__NAME__]', name)
                        .replace('[__TIME__]', time);

                    /*@<*/
                    debugLog('sending tracking label ' + label);
                    /*>@*/

                    Event.fire(TRACK_EVENT, {
                        label: label
                    });
                }

                clearTimeout(fire);
            }, BUFFER_TIME);

            /* Re-assign fire to instance */
            root.set('fire', fire);
        }

    });

    return DwellTime;
});
