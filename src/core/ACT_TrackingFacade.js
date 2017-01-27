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
     * ACT Generic Tracking functionality. This tracking file is a facade for tracking. It can either be completely overwritten, given that the
     * overwritten version supplies similar functionality, or used with a a configuration section that defines appropriate overwrites. By default,
     * this file will attempt to fire the tracking overwrite functions if they exist or simply return the tracking parameter set via the tracking complete event.
     * for interaction tracking. In which case you should listen for ```tracking:track:complete``` event, that will provide the outcome of the tracking event that was fired.
     * The contents of the data payload will be:
     * @example
     *     // Interaction Track :
     *     returns: {Object} {
     *             overwriteFired: false, // Did overwrite function get fired true if yes, false otherwise
     *             trackingString: trackingString, // Tracking String provided
     *             trackingID: trackingID, // Tracking ID provided or generated
     *          result: {Mixed} // Result of calling the provided interaction tracking function.
     *     };
     *
     *     // Redirect Track:
     *     returns: {String} The generated redirect string for the provided URL.
     *
     * @example
     *     // Example of the config that can be passed in
     *     var config = {
     *         adid: '',
     *         unique: 'u_',
     *         trackingFunctions: {
     *             overwrite: true / false,
     *             redirect: function(trackingString, trackingID, redirectURL) { .... }
     *             interaction: function(trackingString) { ... }
     *         }
     *     };
     * @class Tracking
     * @module Tracking
     * @requires Util
     * @requires Lang
     * @requires Debug
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
        version: '1.1.0'
    };

    Lang.extend(Tracking, Class, {
        init: function (config, ref) {
            var conf = config || null;

            /**
             * The configuration property for the Tracking instance
             * @property config
             * @type Object
             */
            this.config = {};

            /*@<*/
            Debug.log('[ ACT_tracking.js ] initialized with', config);
            /*>@*/

            if (conf !== null) {
                Lang.merge(this.config, conf);
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
                overwrite = callback.apply(this, args);
            }
            return overwrite;
        },

        /**
         * Redirect Track String Generating function
         * @param {String} trackingString StringID of the redirect track  'backup_image_noflash'
         * @param {Integer} trackingID Numeric id of the redirect track  '135'
         * @param {String} redirectURL URLString to redirect to http://sports.yahoo.com
         * @return {String} Redirect String
         * @method redirect_track
         * @public
         * @static
         * @example
         *     // Simple Example, no over write function provided:
         *     var tracking = new ACT.Tracking();
         *     var redirect = tracking.redirect_track(null, null, 'http://www.yahoo.com');
         *     ACT.Dom.byId('exampleATag').href = redirect;
         *
         *     // Complex example with over write function:
         *     var config = {
         *         trackingFunctions: {
         *             overwrite: true,
         *             redirect: function(trackingString, trackingID, redirectURL) {
         *                      var final_url = 'http://example.tracking.service.com/?name='+trackingString+'&id='+trackingID+'&url='+encodeURIComponent(redirectURL);
         *                     return final_url;
         *              },
         *             interaction: function(trackingString) { ... }
         *         }
         *     };
         *     var tracking = new ACT.tracking(config);
         *       var redirect = tracking.redirect_track("yahooCTR", 456, 'http://www.yahoo.com');
         */
        redirect_track: function (trackingString, trackingID, redirectURL) {
            var extraFunctions = this.config.trackingFunctions || false;
            redirectURL = redirectURL || '';

            if (Lang.isObject(this.config.trackingFunctions) === true && this.config.trackingFunctions.overwrite === true) {
                redirectURL = this.overwriteTracking(extraFunctions, 'redirect', arguments);
            }

            return redirectURL;
        },

        /**
         * Interaction tracking function
         * @param {String} trackingString String ID of the interaction to be tracked
         * @method interaction_track
         * @return {Object} an object containing the results of this function call. Specifically:
         *     {
         *          overwriteFired: {Boolean}, // Did the overwrite function get fired
         *          trackingString: {String}, // The tracking string submitted to the function
         *          trackingID: {Int}, // ACT.js generated unique ID ( generated from supplied tracking string )
         *          result: {Mixed} // Result of calling the provided interaction tracking function.
         *     }
         * @public
         * @static
         */
        interaction_track: function (trackingString) {
            var extraFunctions = this.config.trackingFunctions || false;
            var trackString = trackingString || '';
            var outcome = {
                overwriteFired: false,
                trackingString: trackString,
                trackingID: Util.hashString(trackString),
                result: null
            };

            if (Lang.isObject(this.config.trackingFunctions) === true && this.config.trackingFunctions.overwrite === true) {
                outcome.result = this.overwriteTracking(extraFunctions, 'interaction', arguments);
                outcome.overwriteFired = true;
            }

            return outcome;
        },

        /**
         * @method track
         * @param trackingString
         * @param trackingID
         * @param redirectURL
         * @param callback
         * @public
         * @static
         */
        track: function (trackingString, trackingID, redirectURL, callback) {
            var root = this;
            replaceMacros(trackingString, function (label) {
                root.saveEventLabel(root.config.trackUnique, label, function (unique, labelWithMacro) {
                    var result;
                    var trackingLabel;

                    if (labelWithMacro !== null) {
                        trackingLabel = unique + labelWithMacro;
                    } else {
                        trackingLabel = labelWithMacro;
                    }

                    if (redirectURL) {
                        result = root.redirect_track(trackingLabel, trackingID, redirectURL);
                    } else {
                        result = root.interaction_track(trackingLabel);
                    }

                    return callback(result);
                });
            });
        }
    });

    return Tracking;
});
