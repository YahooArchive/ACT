/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
ACT.define('Tracking', [/*@<*/'Debug', /*>@*/ 'Util', 'Lang', 'Event', 'Class'], function (ACT) {
    'use strict';

    var Lang = ACT.Lang;
    var Util = ACT.Util;
    var Event = ACT.Event;
    var Class = ACT.Class;

    /**
     * event list
     */
    var TRACK_EVENT = 'tracking:track';
    var TRACK_EVENT_COMPLETE = 'tracking:track:complete';
    var REGISTER_REDIRECT_EVENT = 'tracking:registerRedirect';
    var REGISTER_REDIRECT_EVENT_COMPLETE = 'tracking:registerRedirect:complete';
    var EVENT_GET_ENVIRONMENT_RENDERED = 'env:envRendered';
    var EVENT_RETURNED_ENVIRONMENT_RENDERED = 'env:envRendered:Done';

    /**
     * Actions for tracking
     *
     */
    /* istanbul ignore next */
    var trackingActions = [{
        type: 'track',
        argument: {
            label: {
                name: 'label', // Layer name that fires event
                test: function (value) {
                    return Lang.isString(value);
                }
            },
            timeout: {
                name: 'timeout',
                test: function (value) {
                    return Lang.isNumber(value) || value === undefined || value === null;
                }
            }
        },
        process: function (actionId, values) {
            var eventCompleteListener = Event.on(TRACK_EVENT_COMPLETE, function () {
                eventCompleteListener.remove();
                Event.fire('complete:action', actionId);
            });

            Event.fire(TRACK_EVENT, { label: values.label });
        }
    }];

    var macrosWordsActions = {
        envRendered: {
            process: function (label, macro, callback) {
                var renderEvent = Event.on(EVENT_RETURNED_ENVIRONMENT_RENDERED, function (envRendered) {
                    renderEvent.remove();
                    callback(label.replace(new RegExp(macro, 'g'), envRendered));
                });
                Event.fire(EVENT_GET_ENVIRONMENT_RENDERED);
            }
        }
    };

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_tracking.js ] : loaded');
    /*>@*/

    /**
     * @method getMacrosFromString
     * @private
     */
    function getMacrosFromString(str) {
        var match = str.match(/::(.*?)::/g);
        return match;
    }

    /**
     * @method replaceMacros
     * @private
     */
    function replaceMacros(str, callback) {
        var rawMacros;
        var macro;
        var strWithoutInvalidMacros;
        if (str !== undefined && str !== null) {
            rawMacros = getMacrosFromString(str);
            if (Lang.isArray(rawMacros)) {
                macro = rawMacros[0].substr(2, rawMacros[0].length - 4);
                if (macrosWordsActions.hasOwnProperty(macro)) {
                    macrosWordsActions[macro].process(str, rawMacros[0], function (result) {
                        result = result.replace(rawMacros[0], '');
                        str = replaceMacros(result, callback);
                    });
                } else {
                    strWithoutInvalidMacros = str.replace(new RegExp(rawMacros[0], 'g'), '');
                    str = replaceMacros(strWithoutInvalidMacros, callback);
                }
            } else {
                callback(str);
            }
        } else {
            callback(str);
        }
    }

    /**
     * ACT Tracking functionality. Helps send tracking pixels.
     *
     * @class Tracking
     * @module Tracking
     * @requires Util
     * @requires Lang
     * @requires Debug
     * @example
     *     // Example of the config that can be passed in
     *     var config = {
     *         z1: '',
     *         rB: '',
     *         beap: [],
     *         adid: '',
     *         unique: 'u_',
     *         trackingFunctions: {
     *             overwrite: true / false,
     *             redirect: function() { .... }
     *             interaction: function() { ... }
     *         }
     *     };
     */
    function Tracking(config, ref) {
        this.init(config, ref);
    }

    /**
     * @attribute ATTRS
     * @type {{NAME: string, version: string}}
     * @initOnly
     */
    Tracking.ATTRS = {
        NAME: 'Tracking',
        version: '1.0.22'
    };

    Lang.extend(Tracking, Class, {
        init: function (config, ref) {
            var conf = config || null;

            /**
             * The configuration property for the Tracking instance
             * @property config
             * @type Object
             */
            this.config = {
                z1: '',
                rB: '',
                beap: [],
                adid: '',
                unique: 'u_'
            };

            /*@<*/
            Debug.log('[ ACT_tracking.js ] initialized with', config);
            /*>@*/

            if (conf !== null) {
                Lang.merge(this.config, conf);
                this.config.beap = this.config.z1.split('{beap_client_event}');
            } /*@<*/ else {
                Debug.log('[ ACT_tracking.js ]: conf was null. Make sure you have all the tracking defined');
            }
            /*>@*/

            if (ref) {
                ref.interaction_track = Lang.bind(this, null, this.interaction_track);
                ref.redirect_track = Lang.bind(this, null, this.redirect_track);
                ref.track = Lang.bind(this, null, this.track);
            }

            // initialize event listeners
            this.initializeEvents();

            // register action to the queue
            Event.fire('register:Actions', trackingActions);
        },

        /**
         * Function to initialize tracking events
         * @method initializeEvents
         * @private
         */
        initializeEvents: function () {
            var root = this;

            this.addEventListeners(
                /**
                 * Event for register redirect
                 */
                Event.on(REGISTER_REDIRECT_EVENT, function (data) {
                    var clickTAGName = data.clickTagName || 'clickTAG';
                    var redirectLink = root.redirect_track(clickTAGName, Util.hashString(clickTAGName), data.clickTag) || data.clickTag;
                    /*@<*/
                    Debug.log('[ ACT_tracking.js ]: ', REGISTER_REDIRECT_EVENT, ' called with: ', data, 'will redirect to:', redirectLink);
                    /*>@*/
                    Event.fire(REGISTER_REDIRECT_EVENT_COMPLETE, {
                        /*  there is a problem with marcos, so temporary put original click tag here just for testing */
                        // redirect_track is:         redirect_track: function (str, num, url)
                        // First parameter is a string name of the redirect - 'clickTagName'
                        // Second parameter is the numeric ID ( so we have to hash it here )
                        // Final param is the URL itself.
                        link: redirectLink
                    });
                }),

                /**
                 * Event for interaction tracking
                 */
                Event.on(TRACK_EVENT, function (eventData) {
                    /* eventData.label */
                    root.track(eventData.label, null, null, function (result) {
                        Event.fire(TRACK_EVENT_COMPLETE, { data: result });
                    });
                })
            );
        },

        /**
         * @method saveEventLabel
         */
        saveEventLabel: function (trackUnique, eventName, callback) {
            var labelPrefix;
            var localRegisterListener;
            if (trackUnique === true) {
                localRegisterListener = Event.on('localRegister:updateAdEvent:complete', function (eventData) {
                    localRegisterListener.remove();
                    labelPrefix = (eventData.unique) ? 'u_' : 'nu_';
                    callback(labelPrefix, eventName);
                });

                Event.fire('localRegister:updateAdEvent', {
                    eventName: eventName
                });
            } else {
                callback('', eventName);
            }
        },

        /**
         * Helper function to call overwriting or supporting tracking functions passed in via the configuration.
         * @method overwriteTracking
         * @param {Object} overwriteSet The set of overwrite parameters passed in
         * @param {String} type The type of the function we need - either redirect OR interaction
         * @param {Array} args The arguments that came into the function either to redirect OR to interaction
         */
        overwriteTracking: function (overwriteSet, type, args) {
            var callback = overwriteSet[type] || null;
            var overwrite = overwriteSet.overwrite || false;

            if (Lang.isFunction(callback)) {
                callback.apply(this, args);
            }
            return overwrite;
        },

        /**
         * Redirect Track String Generating function
         * @param {String} str StringID of the redirect track  'backup_image_noflash'
         * @param {Integer} num NumericID of the redirect track  '135'
         * @param {String} url URLString to redirect to http://sports.yahoo.com
         * @return {String} Redirect String
         * @method redirect_track
         * @public
         * @static
         */
        redirect_track: function (str, num, url) {
            var conf = this.config;
            var extraFunctions = conf.trackingFunctions || false;
            var redirect = '';
            var redirectString;

            if (extraFunctions && this.overwriteTracking(extraFunctions, 'redirect', arguments)) {
                return redirect;
            }

            redirectString = conf.rB.split('))/');

            if (!url || url.length < 5) {
                /*@<*/
                Debug.log('[ ACT_tracking.js ]: the redirect URL passed in is too short.', url);
                /*>@*/
                return redirect;
            }

            if (redirectString[0] && redirectString[1]) {
                redirect = redirectString[0] + '))&id=' + str + '&r=' + num + '/' + redirectString[1] + url;
            } /*@<*/ else {
                Debug.log('[ ACT_tracking.js ]: rB is not set correctly and redirectString does not contain the expected elements:', redirectString, conf.rB);
            }
            /*>@*/
            return redirect;
        },

        /**
         * Interaction tracking function
         * @param {String} str String ID
         * @method interaction_track
         * @public
         * @static
         */
        interaction_track: function (str) {
            var conf = this.config;
            var beap = conf.beap;
            var rand = Math.random();
            var trackString = (str || '');
            var num = Util.hashString(trackString);
            var src = '';
            var extraFunctions = conf.trackingFunctions || false;

            if (extraFunctions && this.overwriteTracking(extraFunctions, 'interaction', arguments)) {
                return true;
            }

            if (beap[0] && beap[1] && trackString.length > 4) {
                src = beap[0] + 'seq$' + num + ',label$' + trackString + ',type$click,time$' + rand + beap[1];
                Util.pixelTrack(src);
                return true;
            }
            /*@<*/
            Debug.log('[ ACT_tracking.js ]: beap[0] and beap[1] appear to be incorrectly set: ', beap);
            /*>@*/
            return false;
        },

        /**
         * @method track
         * @param str
         * @param num
         * @param url
         * @param callback
         * @public
         * @static
         */
        track: function (str, num, url, callback) {
            var root = this;
            replaceMacros(str, function (label) {
                root.saveEventLabel(root.config.trackUnique, label, function (unique, labelWithMacro) {
                    var result;
                    var trackingLabel;

                    if (labelWithMacro !== null) {
                        trackingLabel = unique + labelWithMacro;
                    } else {
                        trackingLabel = labelWithMacro;
                    }

                    if (url) {
                        result = root.redirect_track(trackingLabel, num, url);
                    } else {
                        result = root.interaction_track(trackingLabel);
                    }

                    callback(result);
                });
            });
        }
    });

    return Tracking;
});
