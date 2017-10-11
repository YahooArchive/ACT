/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT, console */
/* eslint spaced-comment: 0, no-unused-vars: 0, no-use-before-define: 0, no-console: 0, camelcase: 0, new-cap: 0, max-len: 0, no-shadow: 0, no-return-assign: 0, no-unused-expressions: 0 */
ACT.define('EnablerADTECH', ['Enabler'], function (ACT) {
    'use strict';
    var Enabler = window.Enabler;
    var studio = window.studio;
    /**
     * ACT EnablerADTECH
     *
     * Enabler Wrapper for AOL 1 ADTECH API.
     *
     * ```
     *     // Providing exposeADTECH `true` will create a reference in window.ADTECH = ACT.EnablerADTECH;
     *     var conf = {
     *         exposeADTECH: true
     *     };
     *     Enabler.setConfig( conf );
     * ```
     *
     * @module EnablerADTECH
     * @main EnablerADTECH
     * @class EnablerADTECH
     * @requires Enabler
     */
    var ADTECH = {
        /**
         * ADTECH wrapper for Enabler.exit. Opens a new window with the URL as identified by the given exit ID.
         * @method EnablerADTECH.click
         * @param {String} id The exit ID.
         * @param {String} opt_url The URL to navigate to.
         * @example
               EnablerADTECH.click('Twitter', 'http://twitter.com/twittername');
         */
        click: function (id, url) {
            Enabler.exit(id, url);
        },

        /**
         * ADTECH wrapper for Enabler.exit. Opens a new window with the URL as identified by the given exit ID.
         * @method EnablerADTECH.dynamicClick
         * @param {String} id The exit ID.
         * @param {String} opt_url The URL to navigate to.
         * @example
               EnablerADTECH.dynamicClick("Product page", "http://www.mysite.com/products?id=" + product_id );
         */
        dynamicClick: function (id, url) {
            Enabler.exit(id, url);
        },

        /**
         * ADTECH Wrapper for Enabler.counter. Tracks a counter event.
         * @method EnablerADTECH.counter
         * @param {String} eventId The string ID of the event to count.
         * @param {Boolean} opt_isCumulative Optional parameter that indicates whether or not the counter event should
         * be counted cumulatively. Defaults to true.
         * @example
              EnablerADTECH.event('Play Game');
         */
        event: function (eventId) {
            Enabler.counter(eventId);
        },

        /**
         * ADTECH wrapper for studio.video.Reporter.attach. Observes a video element for reporting
         * @method EnablerADTECH.registerVideoPlayer
         * @param {HTMLVideoElement} videoElement The video element to report on.
         * @param {String} videoReportingIdentifier The name the video should report as.
         * @example
             EnablerADTECH.registerVideoPlayer(myVideoElement, "Video 1");
         * for autoplay videos (the play event will always get tracked). This defaults to true.
         */
        registerVideoPlayer: function (videoElement, videoName) {
            var trackAutoPlay = true;
            var videoIdentifier = videoName || 'videoTracking';
            studio.video.Reporter.attach(videoIdentifier, videoElement, trackAutoPlay);
        },

        /**
         * ADTECH Wrapper for Event.ready and Enabler.callAfterInitialized.
         * @method EnablerADTECH.ready
         * @param {Function} callback The callback to invoke when the Enabler is initialized AND dom is ready
         * The 'ready' function is a modified version of the JQuery 'ready' functionality found at http://api.jquery.com/ready/
         * The code below is modified according to the JQuery MIT License https://github.com/jquery/jquery
         */
        ready: function (userFunction) {
            /* Call the user function once DOMReady has fired and Enabler ahs initialized */
            Enabler.Event.ready(function () {
                Enabler.callAfterInitialized(userFunction);
            });
        },

        /**
         * ADTECH Wrapper to Subscribe to events
         * @method EnablerADTECH.addEventListener
         * @param {String} event event string
         * @param {Object} callback method
         * @param {Object} element DOM element listening for event (optional)
         * @param {Object} scope event scope - default to this
         * @return {Object} obj.remove A simple wrapper to remove this event listener.
         * @public
         *
         * @example
              EnablerADTECH.addEventListener("click", function( eventData ) { ... do something ...}, byId("el"));
         *
         */
        addEventListener: Enabler.Event.on,

        /**
         * ADTECH Wrapper to remove event listeners from objects.
         * @param {String} event Event to remove
         * @param {Function} fn Function to remove from the object
         * @param {Object} element Element to remove the event from
         * @method EnablerADTECH.removeListener
         */
        removeEventListener: Enabler.Event.removeListener,

        /**
         * ADTECH Wrapper for Enabler.requestExpand.
         * Initiates the expand lifecycle. This begins by calling requestExpand(), waiting for EXPAND_START
         * event, animating your expand, then calling finishExpand() when the creative has fully expanded.
         * Please use event listeners to invoke the expanded state of the ad as the expand may be dispatched
         * by the environment independently of calling `studio.Enabler#requestExpand()`. Typical usage will
         * look like:
         *
         * @method EnablerADTECH.expand
         * @example
             EnablerADTECH.expand();
         */
        expand: function () {
            Enabler.requestExpand();
        },

        /**
         * ADTECH Wrapper for Enabler.requestCollapse
         * Initiates the collapse lifecycle. This begins by calling requestCollapse(), waiting for the
         * COLLAPSE_START event, animating your collapse, then calling finishCollapse() when the
         * creative has fully collapsed. Please use event listeners to invoke the collapsed state of
         * the ad as the collapse event may be dispatched by the environment independently of calling
         * studio.Enabler#requestCollapse().
         *
         * @method EnablerADTECH.contract
         * @example
             EnablerADTECH.contract();
         */
        contract: function () {
            Enabler.requestCollapse();
        },

        /**
         * ADTECh Wrapper for the reload functionality. This function has not been implemented yet.
         *  - Ideally, it would fire replay event to the parent container.
         * @method EnablerADTECH.reload
         */
        reload: function () {
            Enabler.enablerLogger('@EnablerADTECH.reload: Is not supported in this version of EnablerADTECH.');
        },

        /**
         * ADTECH Wrapper for Enabler.close. Closes floating and popup creative types. If it is an expanding creative,
         * close acts as a proxy to collapse.
         * @method EnablerADTECH.close
         * @example
             EnablerADTECH.close();
         */
        close: function () {
            Enabler.close();
        },

        /* See EnablerADTECH.expand() */
        show: function () {
            Enabler.requestExpand();
        },

        /* See EnablerADTECH.close() */
        hide: function () {
            Enabler.close();
        }
    };
    return ADTECH;
});

ACT.define('Enabler', [/*@<*/'Debug', /*>@*/ 'Environment', 'Event', 'Lang', 'VideoEvents', 'Json', 'Tracking', 'Util', 'Dom', 'UA'], function (ACT) {
    'use strict';
    /**
     * ACT Enabler
     *
     * Enabler takes a configuration object to initialize. Of-course it'll run in default mode if no config is provided.
     * Below, is a basic example of such a configuration Object.
     *
     * @example
     * ```
     *     var conf = {
     *         tracking: {
     *             trackUnique: true
     *         },
     *         exitUrls: {
     *             clickTAG: 'https://www.yahoo.com/?clickTAG=true',
     *             clickTAG1: 'https://www.yahoo.com/?clickTAG=true',
     *             clickTAG2: 'https://www.yahoo.com/?clickTAG=true'
     *         },
     *         trackingLabels: {
     *             video1:25 : 'billboard_view_video1_25percent',
     *             video1:50 : 'billboard_view_video1_50percent',
     *             video1:75 : 'billboard_view_video1_75percent'
     *         },
     *         enablerInteractionTracking : false,
     *         enablerTarget: 'http://cdn.path.here.com/ACT_Enabler.js',
     *         eventPropagation: true || 'tracking' || 'redirect',
     *         htmlRoot : 'http://cdn.path.here.com/'
     *     };
     *     Enabler.setConfig( conf );
     * ```
     *
     * @module Enabler
     * @main Enabler
     * @class Enabler
     * @requires Dom
     * @requires Event
     * @requires Lang
     * @requires UA
     * @requires VideoEvents
     * @requires Json
     * @requires Tracking
     * @requires Util
     * @requires ActionsQueue
     * @param conf
     */

    /* Shorthand */
    var Event = ACT.Event;
    var Lang = ACT.Lang;
    var VideoEvents = ACT.VideoEvents;
    var Json = ACT.Json;
    var Tracking = ACT.Tracking;
    var Util = ACT.Util;
    var Dom = ACT.Dom;
    var UA = ACT.UA;

    /* Private Variables */
    var studio;
    var config = {
        enableConsole: false,
        frameId: '',
        actTracking: {},
        trackingLabels: {},
        enablerInteractionTracking: false,
        eventPropagation: false,
        callbacks: [],
        countersList: {},
        eventQueue: {},
        exitUrls: {},
        htmlRoot: '',
        initialized: false,
        pageLoaded: false,
        timerCollection: {},
        videoTracking: {},
        videoListener: null,
        visible: false,
        exposeADTECH: false,
        currentEnv: 'generic',
        expand: {
            containerState: '',
            useCustomClose: false,
            expandingPixelOffsets: {},
            floatingPixelDimensions: {},
            isMultiDirectional: false,
            startExpanded: false,
            expandDirection: 'tl',
            fsExpandWidth: 0,
            fsExpandHeight: 0
        }
    };

    /* event name variable*/
    var EVENTS_NAME = {
        FROM_PARENT: 'html5:message',
        TO_PARENT: 'Enabler:actions'
    };

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_Enabler.js ]: loaded');
    /*>@*/

    /**
     * Listen to parent frame post message and convert it to event
     */
    Event.on('message', function (arg) {
        var eventData = arg.data;
        /* istanbul ignore else */
        if (eventData.hasOwnProperty('eventName') && eventData.hasOwnProperty('message')) {
            // update Event from parent name
            EVENTS_NAME.FROM_PARENT = eventData.eventName;
            // Convert this to actual event so we can align iframe and non-iframe method
            Event.fire(EVENTS_NAME.FROM_PARENT, {
                message: eventData.message
            });
        }
    }, window);

    /**
     * @method containValue
     * @private
     */
    function containValue(obj, value) {
        var key;
        for (key in obj) {
            if (Lang.isObject(obj[key])) {
                return containValue(obj[key], value);
            } else if (obj[key] === value) {
                return true;
            }
        }
        return false;
    }

    /**
     * Send data to parent of this iframe
     * @method sendToParent
     * @private
     */
    function sendToParent(data) {
        /* istanbul ignore next */
        var Y = window.Y || null;
        /* istanbul ignore next */
        var yAPI = (Y && Y.SandBox && Y.SandBox.vendor) ? Y.SandBox.vendor : null;
        /*
            window.parent -> parent window
            window.top -> top most window
            window -> current window

             If we window === window.parent then we do not need to post a message to our parent window - because we are that parent .
         */
        /* istanbul ignore if */
        if (yAPI === null && window === window.parent) {
            Event.fire(EVENTS_NAME.TO_PARENT, data);
        } else {
            // lets try to use ACTjs from parent directly first
            // if it doesn't work the will fall back to postMessage
            try {
                window.parent.ACT.Event.fire(EVENTS_NAME.TO_PARENT, data);
            } catch (e) {
                /*@<*/
                Debug.info(' [ ACT_Enabler.js ] sendToParent: ACTjs from parent is not available, try postMessage now', e);
                /*>@*/
                parent.postMessage({
                    EnablerData: data
                }, '*');
            }
        }
    }

    /**
     * Helper method to compose urls with queries
     * @method getFullUrl
     * @param {String} url
     * @param {String} params
     * @private
     */
    function getFullUrl(url, params) {
        var fullUrl = Lang.isString(url) && url.length > 0 ? url : '';
        var append = params;
        var connector = '?';
        var lastIndex = fullUrl.length - 1;
        if (lastIndex > 0) {
            if (fullUrl.indexOf('?') === lastIndex) {
                connector = '';
            } else if (fullUrl.indexOf('?') > -1) {
                connector = '&';
            }
        }
        if (Lang.isArray(append)) {
            append = append.join('&');
        } else if (Lang.isObject(append)) {
            append = Lang.createHash(append);
        }
        // By the end, you should have a string.
        if (Lang.isString(append) && append.length > 0) {
            if (append.indexOf('?') === 0) {
                append = append.slice(1, append.length);
            }
            fullUrl += connector + append;
        }
        return fullUrl;
    }

    /**
     * Notifies of issues / missing things inside Enabler. For Internal Use Only.
     * @method enablerLogger
     * @param {Mixed} A mixed message to display to the user
     * @private
     */
    function enablerLogger() {
        if (config.enableConsole && window.console && window.console.info) {
            console.info(arguments);
        }
    }

    /**
     * @method fireEvent
     * @param {String} id The id given from the user's calls. E.g: Enabler.exit("Something"); "Something" is this id
     * @param {String} eventType Comes from studio.events.StudioEvent Object - this should exist.
     * @param {String} actionName More of the generic event/action ('track', 'redirect', etc)
     * @param {String} url If you have a redirect, you can pass in the URL to redirect to.
     * @param {Mix} special Extra parameter. For URL can have the queries, for others, can be an object with the desired key: value pairs.
     * @private
     */
    function fireEvent(id, eventType, actionName, url, special) {
        /* get the label for tracking if the label does not exist then use 'id' as label */
        var label = id;
        var fullUrl;
        var link;
        var dataToSend;
        /*
            trackingLabels are passed into the Enabler via config.
            config.trackingLabels = {
                "video1:25" : "billboard_view_video1_25percent",
                ...
            }
        */
        if (config.trackingLabels.hasOwnProperty(label)) {
            label = config.trackingLabels[label];
        }

        /* Put together the data object to pass around. */
        dataToSend = {
                        frameId: config.frameId,
                        id: id,
                        eventType: eventType,
                        actionName: actionName,
                        url: url,
                        special: special
                    };
        /*
            Open URL has to be done inside iframe due to Safari policy
            Other tracking can be sent to parent frame so we can do unique and non-unique
        */
        if (actionName === 'redirect') {
            // Tracking is fired when there is a tracking config info
            /* istanbul ignore else */
            if (config.hasOwnProperty('actTracking') && Lang.isFunction(config.actTracking.track)) {
                /* redirect_track is:         redirect_track: function(str, num, url) */
                fullUrl = getFullUrl(url, special);
                link = config.actTracking.track(label, Util.hashString(label), fullUrl, function (link) {
                    /*@<*/
                    Debug.log('[ ACT_Enabler.js ]: Generated Redirect : ', link);
                    /*>@*/
                    enablerLogger('[ ACT_Enabler.js ]: Generated Redirect Link: ', link);
                    window.open(link, '_blank');
                });
            } else {
                /* If the actTracking is not defined, and a redirect is fired we fail silently. */
                enablerLogger('[ ACT_Enabler.js ] : Attempted but did not redirect to: "' + getFullUrl(url, special) + '" identified by: "' + id + '"');
            }
            propagateEvent(actionName, dataToSend);
        } else if (actionName === 'track' && config.hasOwnProperty('enablerInteractionTracking') && config.enablerInteractionTracking === true) {
            /* If we want enabler to fire off all the interaction tracks by itself */
            /* istanbul ignore else */
            if (config.hasOwnProperty('actTracking') && Lang.isFunction(config.actTracking.track)) {
                /*@<*/
                Debug.log('[ ACT_Enabler.js ]: Generated Interaction Track : ', label);
                /*>@*/
                config.actTracking.track(label, null, null, function (result) {
                    enablerLogger('[ ACT_Enabler.js ]: track fire result: ', result);
                });
            } else {
                enablerLogger('[ ACT_Enabler.js ]: Attempted but did not fire an Interaction Track : ' + label);
            }
            propagateEvent(actionName, dataToSend);
        } else {
            enablerLogger('[ ACT_Enabler.js ]: Sending data to parent : ', dataToSend);
            // send data to parent to do something
            sendToParent(dataToSend);
        }
    }

    /**
     * Propagate Event - figure out if our user wants all or only some events to propagate to the parent frame.
     * @method propagateEvent
     * @param {String} actionName - either 'redirect' or 'track'
     * @param {Object} dataToSend Data object that we send over to the parent.
     * @private
     */
    function propagateEvent(actionName, dataToSend) {
        var eventPropagation = config.eventPropagation || false;

        if (eventPropagation === actionName || eventPropagation === true) {
            sendToParent(dataToSend);
        }
    }

    /**
     * Adding new url and it's key into the exitUrls list
     * @method setExit
     * @param {String} id Exit Url id
     * @param [String] opt_url New URL to be added
     * @private
     */
    function setExit(id, opt_url) {
        // only add if opt_url avaibler
        if (Lang.isString(opt_url)) {
            config.exitUrls[id] = opt_url;
        }

        return opt_url;
    }

    /**
     * @method setCounter
     * @private
     */
    function setCounter(id, cumulative) {
        /* istanbul ignore else */
        if (!config.countersList[id]) {
            config.countersList[id] = {
                count: 0,
                cumulative: !!cumulative
            };
        }
        /* istanbul ignore else */
        if (config.countersList[id].cumulative) {
            config.countersList[id].count += 1;
        }
    }

    /**
     * @method getCounter
     * @private
     */
    function getCounter(id) {
        var count = 0;
        /* istanbul ignore else */
        if (config.countersList[id]) {
            count = config.countersList[id].count;
        }
        return count;
    }

    /**
     * @method calculateValue
     * @private
     */
    function calculateValue(value, integer1, integer2) {
        (value & integer1) === integer1 && (studio.common.Environment.Value |= integer1, studio.common.Environment.Value &= ~integer2);
    }

    /**
     * @method mapValue
     * @private
     */
    function mapValue(value) {
        calculateValue(value, 2, 1);
        calculateValue(value, 1, 2);
        calculateValue(value, 4, 8);
        calculateValue(value, 8, 4);
        calculateValue(value, 128, 64);
        calculateValue(value, 64, 128);
    }

    /**
     * @method runCallbacks
     * @private
     * Runs through the registered callbacks and executes them one by one. In reverse order. ( FILO )
     * Before executing a callback, sets it's reference to null in our queue.
     * On Error: logs the failed attempt - runtime error message, callback iterator and the callback function itself.
     */
    function runCallbacks() {
        var callbacks = config.callbacks || [];
        var callbackFun = null;
        var itor;

        for (itor = callbacks.length - 1; itor >= 0; itor--) {
            callbackFun = null;
            if (Lang.isFunction(callbacks[itor]) === true) {
                callbackFun = callbacks[itor];
                callbacks[itor] = null;
                try {
                    callbackFun();
                } catch (err) {
                    enablerLogger('[ ACT_Enabler.js ] Error while running a callback: ', err.message, itor, callbackFun);
                }
            }
        }
    }

    function Enabler(conf) {
        var enablerConfigData = {};
        var enablerTarget;
        var eventQueue;
        var script;
        var head;
        var item;
        var ev;

        /* istanbul ignore else */
        if (window.Enabler) {
            enablerConfigData = window.Enabler.getConfigObject();
            /*@<*/
            Debug.log('[ ACT_Enabler.js ]: Found a version of Enabler on page. Data set is:', enablerConfigData);
            /*>@*/
            this.setConfig(enablerConfigData);
            /* reassign all the event listeners */
            eventQueue = enablerConfigData.eventQueue;
            if (Lang.isObject(eventQueue)) {
                for (item in eventQueue) {
                   if (eventQueue.hasOwnProperty(item)) {
                       item = eventQueue[item];
                       window.Enabler.removeEventListener(item.type);
                       this.addEventListener(item.type, item.callback, item.opt_capture, item.opt_handlerScope);
                   }
                }
            }
        }

        /* istanbul ignore else */
        if (window.name) {
            try {
                enablerConfigData = (Lang.isString(window.name) && Json.parse(decodeURI(window.name))) || enablerConfigData;
                /*@<*/
                Debug.log('[ ACT_Enabler.js ]: Found Enabler data in window.name. Data set is:', enablerConfigData);
                /*>@*/
                this.setConfig(enablerConfigData);
            } catch (err) {
                /*@<*/
                Debug.log('[ ACT_Enabler.js ]: no data passed via window.name ' + err);
                /*>@*/
            }
        }

        /* reload enabler if config specify a target */
        enablerTarget = enablerConfigData.enablerTarget;
        if (enablerTarget && Lang.isString(enablerTarget) && Lang.isSameOrigin(enablerTarget)) {
            head = document.head || document.getElementsByTagName('head')[0];
            script = document.createElement('script');
            enablerConfigData.enablerTarget = '';
            /*@<*/
            Debug.log('[ ACT_Enabler.js ]: Load a targeted version of Enabler on page. Data set is:', enablerConfigData);
            /*>@*/
            window.name = window.name && this.setConfig(enablerConfigData);
            script.setAttribute('src', Lang.urlSanitize(enablerTarget));
            head.appendChild(script);
            return this;
        }

        /* Grab extra definitions / make request for extra definitions from "main page/frame" */
        config.initialized = true;

        /* Initialize environment for Enabler. */
        ev = new ACT.Environment({});
        config.currentEnv = ev.checkEnv();

        /* In case someone queued up callbacks, we are now officially initialized Run them all. */
        runCallbacks();
        /* This should probably wait to be fired - since Enabler is laoded at the top of the page. */
        this.dispatchEvent(studio.events.StudioEvent.INIT);
        Event.ready(Lang.bind(this, null, this.dispatchPageLoaded));
        Event.on(EVENTS_NAME.FROM_PARENT, Lang.bind(this, null, this.parentMessageHandle));
    }

    /**
     * @attribute ATTRS
     * @initOnly
     */
    Enabler.ATTRS = {
        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'Enabler'
    };

    Enabler.prototype = {

        constructor: Enabler,

        /* Exposing some utility modules: */
        Event: Event,
        Lang: Lang,
        Util: Util,
        Dom: Dom,
        Json: Json,
        UA: UA,

        /*@<*/
        /* Helper method for development test */
        getEventQueue: function () {
            return config.eventQueue;
        },

        getTimerCollection: function () {
            return config.timerCollection;
        },

        getFullUrl: function (url, params) {
            return getFullUrl(url, params);
        },

        config: config,
        /*>@*/

        /**
         * Handle message from parent frame
         *
         * @method parentMessageHandle
         * @param {Object} data Data sent from parent
         */
        parentMessageHandle: function (data) {
            var message = data.message;
            var studioEvents = studio.events.StudioEvent;
            /* istanbul ignore else */
            if (studioEvents.hasOwnProperty(message)) {
                this.dispatchEvent(studioEvents[message], null);
            }
        },

        /**
         * Returns the full config object if no parameter passed in, an element from config object or null if requested element doesn't exist.
         * @method getConfigObject
         * @param {String} opt_element
         * @returns {Object}
         */
        getConfigObject: function (opt_element) {
            if (opt_element && Lang.isString(opt_element) && config.hasOwnProperty(opt_element)) {
                return config[opt_element];
            } else if (typeof opt_element === 'undefined') {
                return config;
            }
            return null;
        },

        /**
         * Returns the config object values
         * @method getConfig
         * @param {String} opt_element
         * @returns {string} The stringified config object
         */
        getConfig: function (opt_element) {
            var res = this.getConfigObject(opt_element);
            return Json.stringify(res);
        },

        /**
         * You can set new values to config using setConfig.
         * Just use the same config structure.
         * @method setConfig
         * @param encoded
         * @returns {string} The stringified resulting config object
         */
        setConfig: function (encoded, opt_element) {
            var newConfig = encoded;
            /* istanbul ignore else */
            if (Lang.isString(encoded)) {
                newConfig = Json.parse(encoded);
            }
            /* istanbul ignore else */
            if (opt_element && Lang.isString(opt_element) && config.hasOwnProperty(opt_element)) {
                newConfig = {};
                newConfig[opt_element] = encoded;
            }

            config = Lang.merge(config, newConfig);

            // create tracking if new config has tracking config
            if (config.hasOwnProperty('tracking') && Lang.isObject(config.tracking)) {
                config.tracking.trackUnique = false; /* because Cookie is not availale in iFrame */
                config.actTracking = new Tracking(config.tracking);
            }

            if (config.exposeADTECH === true) {
                window.ADTECH = ACT.EnablerADTECH;
            }

            return this.getConfig(opt_element);
        },

        /**
         * Adds an event listener to the event target. The same handler can only be added once per the type.
         * Even if you add the same handler multiple times using the same type then it will only be called once
         * When the event is dispatched.
         * @method addEventListener
         * @param {String} type The type of the event to listen for.
         * @param {Function} fn event callback
         * @param {boolean} opt_capture In DOM-compliant browsers, this determines whether the listener is fired
         * during the capture or bubble phase of the event.
         * @param {Object} opt_handlerScope Object in whose scope to call the listener
         */
        addEventListener: function (type, fn, opt_capture, opt_handlerScope) {
            var attr = type.replace(/(.)([A-Z])/g, '$1_$2').toUpperCase();
            if (studio.events.StudioEvent.hasOwnProperty(attr)) {
                if (config.eventQueue[type]) {
                    this.removeEventListener(type);
                }
                Event.on(type, fn, opt_handlerScope, this);
                config.eventQueue[type] = {
                    type: type,
                    callback: fn,
                    opt_capture: opt_capture,
                    opt_handlerScope: opt_handlerScope
                };
            } /*@<*/ else {
                Debug.log('[ ACT_Enabler.js ]: the ', type, ' is not supported.');
            }
            /*>@*/
        },

        /**
         * Wrapper for Event remove listener (gets values from EVENT QUEUE)
         * @method removeEventListener
         * @param {String} event_type the id used in config.eventQueue
         */
        removeEventListener: function (event_type) {
            var event;
            /* istanbul ignore else */
            if (config.eventQueue[event_type]) {
                event = config.eventQueue[event_type];
                Event.removeListener(event.type, event.callback, event.opt_handlerScope);
                delete config.eventQueue[event_type];
            }
        },

        /**
         * Wrapper for Event.fire
         * @method dispatchEvent
         * @param {String} event
         * @param {Object} data
         */
        dispatchEvent: function (event, data) {
            /* istanbul ignore else */
            if (Lang.isString(event)) {
                Event.fire(event, data);
            }
        },

        /**
         * Opens a new window with the URL as identified by the given exit ID.
         * @method exit
         * @param {String} id The exit ID.
         * @param {String} opt_url The URL to navigate to.
         */
        exit: function (id, opt_url) {
            var url;
            setExit(id, opt_url);
            url = config.exitUrls[id];
            /*@<*/
            /* istanbul ignore if */
            if (!Lang.isString(url)) {
                Debug.log('[ ACT_Enabler.js ]: URL ID of ' + id + ' was not found. Make sure to define it.');
            }
            /*>@*/

            fireEvent(id, studio.events.StudioEvent.EXIT, 'redirect', url, null);
        },

        /**
         * Opens a new window with the URL as identified by the given exit ID. This differs from normal exit() as the
         * URL value will always override the value modified in Studio or elsewhere.
         * @method exitOverride
         * @param {String} id The exit ID.
         * @param {String} url The URL to navigate to regardless of what has been set before.
         */
        exitOverride: function (id, url) {
            /* istanbul ignore else */
            if (Lang.isString(url) && url.indexOf('http') >= 0) {
                setExit(id, url);
                fireEvent(id, studio.events.StudioEvent.EXIT, 'redirect', url, null);
            }
        },

        /**
         * Opens a new window with the URL as identified by the given exit ID with an optional queryString appended.
         * @method exitQueryString
         * @param {String} id The exit ID.
         * @param {String} opt_queryString Desired query string value(s) to append to the end of the exit URL.
         */
        exitQueryString: function (id, opt_queryString) {
            var url = config.exitUrls[id];
            /* istanbul ignore else */
            if (Lang.isString(opt_queryString) && url.indexOf('http') >= 0) {
                fireEvent(id, studio.events.StudioEvent.EXIT, 'redirect', url, opt_queryString);
            }
        },

        /**
         * Tracks a counter event.
         * @method counter
         * @param {String} eventId The string ID of the event to count.
         * @param {Boolean} opt_isCumulative Optional parameter that indicates whether or not the counter event should
         * be counted cumulatively. Defaults to true.
         */
        counter: function (eventId, opt_isCumulative) {
            // cumulative is true, unless explicitly set to false (undefined, empty etc is considered true)
            var cumulative = opt_isCumulative || true;
            setCounter(eventId, cumulative);
            // counter number is passed in as special string
            fireEvent(eventId, studio.events.StudioEvent.INTERACTION, 'track', null, getCounter(eventId));
        },

        /**
         * Starts an event timer
         * @method startTimer
         * @param {String} timerId The string ID of the timer to start
         */
        startTimer: function (timerId) {
            this.stopTimer(timerId);

            config.timerCollection[timerId] = {
                time: 0,
                timer: setInterval(function () {
                    config.timerCollection[timerId].time++;
                }, 1000)
            };
        },

        /**
         * Stops an event timer
         * @method stopTimer
         * @param {String} timerId The string ID of the timer to stop
         */
        stopTimer: function (timerId) {
            if (config.timerCollection[timerId]) {
                clearInterval(config.timerCollection[timerId].timer);
                delete config.timerCollection[timerId];
            }
        },


        /*******************************************************************************************************************/
        /* getFilename and getUrl function definitions */

        // deprecated
        // getFilename : function(filename){
        // return this.getUrl(filename);
        // },

        /**
         * Gets the runtime URL given the original compile-time filename.
         * @method getUrl
         * @param {String} filepath The oritinal full path of the asset
         * @returns {String} The URL to be used at runtime when served through Studio and DART.
         */
        getUrl: function (filepath) {
            var url;
            if (!config.htmlRoot) {
                // did not set htmlRoot yet ! - see if we can grab it.
                url = Dom.getCurrentLocation();
                config.htmlRoot = url.split('/')
                                    .slice(0, -1)
                                    .join('/')
                                    .concat('/');
            }
            if (config.htmlRoot[config.htmlRoot.length - 1] !== '/') {
                config.htmlRoot = config.htmlRoot.concat('/');
            }
            if (filepath === undefined || filepath.length === 0) {
                return config.htmlRoot;
            }
            /* Mind your slashes - check that htmlRoot is set with a trailing slash. */
            return config.htmlRoot + filepath;
        },

        /* ACT Enabler only */
        /**
         * Force setting htmlRoot value that is returned from getURL. getURL will use window.location.href
         * otherwise.
         * @method setUrl
         * @param {String} htmlRoot The HTML path URL value
         */
        setUrl: function (htmlRoot) {
            config.htmlRoot = htmlRoot;
        },

        /******************************************************************************************************************/
        /* PageLoaded Functions */

        /**
         * Dispatches the PAGE LOADED event and sets the config parameter
         * @method dispatchPageLoaded
         */
        dispatchPageLoaded: function () {
            config.pageLoaded = true;
            this.dispatchEvent(studio.events.StudioEvent.PAGE_LOADED, null);
        },

        /**
         * Returns whether the parent page has loaded. The iframe is notified when the page has loaded and dispatches
         * the StudioEvent.PAGE_LOADED event.
         * @method isPageLoaded
         * @returns {boolean} Whether the parent page has loaded or not.
         */
        isPageLoaded: function () {
            return config.pageLoaded;
        },

        /**
         * Returns whether the Enabler is initialized.
         * @method isInitialized
         * @returns {boolean} Whether the Enabler is initialized.
         */
        isInitialized: function () {
            return config.initialized;
        },

        /**
         * Calls the callback when the enabler is initialized or after
         * @method callAfterInitialized
         * @param {Function} callback The callback to invoke when the Enabler is initialized or if it has already
         * initialized, call immediately.
         */
        callAfterInitialized: function (callback) {
            /* config.callbacks is a private variable to keep track of all the callbacks */
            config.callbacks.push(callback);
            if (this.isInitialized() === true) {
                runCallbacks();
            }
        },

        /******************************************************************************************************************/
        /* Expand, close, collapse */
        // These methods trigger all actions set in the config object for this specific event

        /**
         * Closes floating and popup creative types. If it is an expanding creative, close acts
         * as a proxy to collapse.
         * @method close
         */
        close: function () {
            // Event.fire('close');
            config.expand.containerState = studio.sdk.ContainerState.COLLAPSING;
            fireEvent('close', studio.events.StudioEvent.COLLAPSE_START, 'close', '', config.expand);
            Event.fire(studio.events.StudioEvent.COLLAPSE_START, config.expand);
        },

        /**
         * Sets useCustomClose. This is primarily of use in mobile environments using MRAID. When this flag
         * is set, it means that the creative will provide its own close button, so MRAID doesn't have to
         * provide one.
         * @method setUseCustomClose
         * @param {Boolean} useCustomClose Value of the flag.
         */
        setUseCustomClose: function (useCustomClose) {
            config.expand.useCustomClose = !!useCustomClose;
            return config.expand.useCustomClose;
        },

        /**
         * Returns the current state of the container.
         * @method getContainerState
         * @returns {String} The container state from studio.sdk.ContainerState
         */
        getContainerState: function () {
            if (!containValue(studio.sdk.ContainerState, config.expand.containerState)) {
                config.expand.containerState = studio.sdk.ContainerState.COLLAPSED;
            }
            return config.expand.containerState;
        },

        /**
         * Returns the expand direction.
         * @method getExpandDirection
         * @returns {String} The direction to expand in from studio.common.mde.Direction
         */
        getExpandDirection: function () {
            return studio.common.mde.Direction();
        },

        /**
         * Records a manual closing of a floating, pop-up, expanding, in-page with pop-up, or in-page with floating ad.
         * @method reportManualClose
         */
        reportManualClose: function () {
            fireEvent('reportManualClose', studio.events.StudioEvent.COLLAPSE, 'collapse', '', config.expand);
        },

        /**
         * Sets the pixel offsets for the collapsed portion of the ad. This does not affect the local testing
         * environment but when the ad is live the collapsed portion will be shown at 0x0. This method works
         * by setting the marginLeft and marginTop of the body element which is set to relative positioning.
         * @method setExpandingPixelOffsets
         * @param {Number} left The left offset to the collapsed portion of the ad.
         * @param {Number} top The top offset to the collapsed portion of the ad.
         * @param {Number} opt_expandWidth The expanded width of this asset.
         * @param {Number} opt_expandedHeight The expanded height of this asset.
         */
        setExpandingPixelOffsets: function (left, top, opt_expandWidth, opt_expandedHeight) {
            config.expand.expandingPixelOffsets = {
                left: Lang.isStrictNumber(left) ? left : 0,
                top: Lang.isStrictNumber(top) ? top : 0,
                expandedWidth: Lang.isStrictNumber(opt_expandWidth) ? opt_expandWidth : 0,
                expandedHeight: Lang.isStrictNumber(opt_expandedHeight) ? opt_expandedHeight : 0
            };
            return config.expand.expandingPixelOffsets;
        },

        /**
         * Prepopulates the width and height of a floating or peeldown creative.
         * @method setFloatingPixelDimensions
         * @param {Number} width The width of this asset.
         * @param {Number} height The height of this asset.
         */
        setFloatingPixelDimensions: function (width, height) {
            config.expand.floatingPixelDimensions = {
                width: Lang.isStrictNumber(width) ? width : 0,
                height: Lang.isStrictNumber(height) ? height : 0
            };
            return config.expand.floatingPixelDimensions;
        },

        /**
         * Sets the isMultiDirectional flag.
         * @method setIsMultiDirectional
         * @param {Boolean} isMultiDirectional Whether the ad is configured as multidirectional.
         */
        setIsMultiDirectional: function (isMultiDirectional) {
            config.expand.isMultiDirectional = !!isMultiDirectional;
            return config.expand.isMultiDirectional;
        },

        /**
         * Sets the startExpanded flag, which controls whether the asset starts in the expanded state or not.
         * If true, then when the initial requestExpand call will not be tracked or logged and will not
         * trigger an expansion timer.
         * @method setStartExpanded
         * @param {Boolean} startExpanded Value of the flag.
         */
        setStartExpanded: function (startExpanded) {
            config.expand.startExpanded = !!startExpanded;
            return config.expand.startExpanded;
        },

        /**
         * Expanding flow:
         *     1. Register event listeners.
         *     2. When you want to expand call Enabler.requestExpand().
         *     3. When the environment is ready to expand the studio.events.StudioEvent.EXPAND_START is dispatched.
         *     4. The Ad optionally performs an animated expansion.
         *     5. Ad then calls Enabler.finishExpand() to complete expansion. This makes sure pushdowns are syncronized.
         *
         * Initiates the expand lifecycle. This begins by calling requestExpand(), waiting for EXPAND_START
         * event, animating your expand, then calling finishExpand() when the creative has fully expanded.
         * Please use event listeners to invoke the expanded state of the ad as the expand may be dispatched
         * by the environment independently of calling `studio.Enabler#requestExpand()`. Typical usage will
         * look like:
         *
         * @method requestExpand
         * @example
         *         Enabler.addEventListener(
         *             studio.events.StudioEvent.EXPAND_START,
         *             function(event) {
         *                 // For multi directional expands, direction to expand in can be obtained by
         *                 // calling Enabler.getExpandingDirection() (or from event.direction).
         *                 // Do expand action then...
         *                 Enabler.finishExpand();
         *             });
         *         Enabler.requestExpand();
         */
        requestExpand: function () {
            // Event.fire('requestExpand');
            this.setStartExpanded(true);
            config.expand.containerState = studio.sdk.ContainerState.EXPANDING;
            fireEvent('requestExpand', studio.events.StudioEvent.EXPAND_START, 'expand', '', config.expand);
            // Event.fire(studio.events.StudioEvent.EXPAND_START, config.expand); -- remove as it should be fired from framework
        },

        /**
         * Finalizes the expand call via the rendering code.
         * @method finishExpand
         */
        finishExpand: function () {
            // Event.fire('finishExpand');

            this.setStartExpanded(false);
            config.expand.containerState = studio.sdk.ContainerState.EXPANDED;
            fireEvent('finishExpand', studio.events.StudioEvent.EXPAND_FINISH, 'expand', '', config.expand);
            // Event.fire(studio.events.StudioEvent.EXPAND_FINISH, config.expand);
        },

        /**
         * Collapsing flow:
         *    1. Register event listeners.
         *    2. When you want to collapse call Enabler.requestCollapse().
         *    3. When the environment is ready to collapse the studio.events.StudioEvent.COLLAPSE_START is dispatched.
         *        This can get dispatched independently of Enabler.requestCollapse() as sometimes the environment provides a close button outside of the creative.
         *    4. The Ad optionally performs an animated collapse.
         *    5. Ad then calls Enabler.finishCollapse() to complete collapse and close div.
         *
         * Initiates the collapse lifecycle. This begins by calling requestCollapse(), waiting for the
         * COLLAPSE_START event, animating your collapse, then calling finishCollapse() when the
         * creative has fully collapsed. Please use event listeners to invoke the collapsed state of
         * the ad as the collapse event may be dispatched by the environment independently of calling
         * studio.Enabler#requestCollapse().
         *
         * @method requestCollapse
         * @example
         *
         *        Enabler.addEventListener(
         *            studio.events.StudioEvent.COLLAPSE_START,
         *            function () {
         *                // Do collapse action then...
         *                Enabler.finishCollapse();
         *            });
         *        Enabler.requestCollapse();
         */
        requestCollapse: function () {
            // Event.fire('requestCollapse');
            config.expand.containerState = studio.sdk.ContainerState.COLLAPSING;
            fireEvent('requestCollapse', studio.events.StudioEvent.COLLAPSE_START, 'collapse', '', config.expand);
            // Event.fire(studio.events.StudioEvent.COLLAPSE_START, config.expand);
        },

        /**
         * Clips the container or the html asset from the expanded dimensions to the collapsed dimensions.
         * Please use event listeners to invoke the collapsed state of the ad as the collapse event may
         * be dispatched by the environment independently of calling studio.Enabler#requestCollapse().
         * @method finishCollapse
         * @example
         *         Enabler.addEventListener(
         *             studio.events.StudioEvent.COLLAPSE_START,
         *             function () {
         *                 // collapse action
         *                 Enabler.finishCollapse();
         *             });
         *         Enabler.requestCollapse();
         */
        finishCollapse: function () {
            // Event.fire('finishCollapse');
            config.expand.containerState = studio.sdk.ContainerState.COLLAPSED;
            fireEvent('finishCollapse', studio.events.StudioEvent.COLLAPSE_FINISH, 'collapse', '', config.expand);
            // Event.fire(studio.events.StudioEvent.COLLAPSE_FINISH, config.expand);
        },

        /**
         * Requests fullscreen collapse. Please listen for the studio.event.StudioEvent.FULLSCREEN_COLLAPSE_START
         * event to start collapse.
         * @method requestFullscreenCollapse
         */
        requestFullscreenCollapse: function () {
            config.expand.containerState = studio.sdk.ContainerState.FS_COLLAPSING;
            fireEvent('requestFullscreenCollapse', studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START, 'collapse', '', config.expand);
            // Event.fire(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START, config.expand);
        },

        /**
         * Requests fullscreen expand. If width and height are provided, expands to a rectangle of that width
         * and height centered in the middle of the display (or browser window, if the browser is not
         * fullscreen). Otherwise expands to the full size of the browser window/display. Note that on
         * mobile devices the browser window typically takes up the entire display.
         * @method requestFullscreenExpand
         * @param {Number} opt_width Width we would like to expand to in pixels
         * @param {Number} opt_height Height we would like to expand to in pixels
         */
        requestFullscreenExpand: function (opt_width, opt_height) {
            this.setStartExpanded(true);
            config.expand.containerState = studio.sdk.ContainerState.FS_EXPANDING;
            config.expand.fsExpandWidth = Lang.isStrictNumber(opt_width) ? opt_width : config.expand.fsExpandWidth;
            config.expand.fsExpandHeight = Lang.isStrictNumber(opt_height) ? opt_height : config.expand.fsExpandHeight;
            fireEvent('requestFullscreenExpand', studio.events.StudioEvent.FULLSCREEN_EXPAND_START, 'expand', '', config.expand);
            // Event.fire(studio.events.StudioEvent.FULLSCREEN_EXPAND_START, config.expand);
        },

        /**
         * Finishes fullscreen collapse.
         * @method finishFullscreenCollapse
         */
        finishFullscreenCollapse: function () {
            config.expand.containerState = studio.sdk.ContainerState.COLLAPSED;
            fireEvent('finishFullscreenCollapse', studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH, 'collapse', '', config.expand);
            // Event.fire(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH, config.expand);
        },

        /**
         * Finishes fullscreen expand.
         * @method finishFullscreenExpand
         */
        finishFullscreenExpand: function () {
            this.setStartExpanded(false);
            config.expand.containerState = studio.sdk.ContainerState.FS_EXPANDED;
            fireEvent('finishFullscreenExpand', studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH, 'expand', '', config.expand);
            // Event.fire(studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH, config.expand);
        },

        /**
         * Returns whether the ad is visible. The Enabler dispatches the StudioEvent.VISIBLE event.
         * @method isVisible
         * @returns {boolean}
         */
        isVisible: function () {
            this.dispatchEvent(studio.events.StudioEvent.VISIBLE, null);
            return true;
        },

        /**
         * Retrieves a creative parameter that the user can pass via queryString URL. This is also used internally to access ad configuration data.
         * @method getParameter
         * @param {String} name Name of the variable to get from the URL
         * @returns {String}
         */
        getParameter: function (name) {
            if (name) {
                return Util.getQStrVal(name);
            }
            return '';
        },

        /**
         * Retrieves a creative parameter as an integer.
         * @method getParameterAsInteger
         * @param {String} name Name of the variable to get from the URL
         * @returns {Integer}
         */
        getParameterAsInteger: function (name) {
            var numeric;
            if (name) {
                numeric = Util.getQStrVal(name);
                return parseInt(numeric, 10) || 0;
            }
            return 0;
        },

        /**
         * Retrieves a creative parameter as a nullable string.
         * @method getParameter
         * @param {String} name Name of the variable to get from the URL
         * @returns {String}
         */
        getParameterAsNullableString: function (name) {
            if (name) {
                return Util.getQStrVal(name);
            }
            return 0;
        },

        /**
         * Get studio object
         * @method getStudio
         * @returns {Object}
         */
        getStudio: function () {
            var obj = null;
            /* istanbul ignore else */
            if (Lang.isObject(studio)) {
                obj = studio;
            }
            return obj;
        },

        /**
         * Returns the instance of the enabler singleton.
         * @method getInstance
         * @returns {Object}
         */
        getInstance: function () {
            return this;
        },

        /**
         * Closes the companion asset for floating, reminder, and pop-up creative types.
         * @method closeCompanion
         */
        closeCompanion: function () {
            fireEvent('closeCompanion');
        },

        /**
         * Triggers the display of the companion asset for floating, reminder, and pop-up advert types.
         * @method displayCompanion
         */
        displayCompanion: function () {
            fireEvent('displayCompanion');
        },

        /*
        ****************************************************************************************************************
        */
        // These methods are not implemented due to their specific use in Goo... environment.

        /**
         * Adds a new handler for an otherwise unknown message.
         * @method addMessageHandler
         * @param {String} messageName The name of the message, which cannot match an exported method on studio.Enabler.
         * @param {Function} handler The handler function
         */
        addMessageHandler: function (messageName, handler) {
            enablerLogger('@addMessageHandler: Is not supported in this version of Enabler.');
        },

        /**
         * Removes a new handler for an otherwise unknown message.
         * @method removeMessageHandler
         * @param {String} messageName The name of the message, which cannot match an exported method on studio.Enabler.
         */
        removeMessageHandler: function (messageName) {
            enablerLogger('@removeMessageHandler: Is not supported in this version of Enabler.');
        },

        /**
         * Returns an object representing the orientation of the device.
         * @method getOrientation
         * @returns {Object} An object representing the orientation of the device.
         */
        getOrientation: function () {
            enablerLogger('@getOrientation: Is not supported in this version of Enabler.');
            return {};
        },

        /**
         * Returns the user's bandwidth according to DART bandwidth codes.
         * @method getUserBandwidth
         * @returns {Number} An integer representing the user's bandwidth. Bandwidth values are:
         *  1. Unknown = 0
         *  2. Dialup = 1
         *  3. DSL = 2
         *  4. Cable = 3
         *  5. Broadband = 4
         *  6. T1 = 5
         */
        getUserBandwidth: function () {
            enablerLogger('@getUserBandwidth: Is not supported in this version of Enabler.');
            return 0;
        },

        /**
         * Returns the two-letter string representation of the user's country.
         * @method getUserCountry
         * @returns {String} Two-letter string representation of the user's country.
         */
        getUserCountry: function () {
            enablerLogger('@getUserCountry: Is not supported in this version of Enabler.');
            return '';
        },

        /**
         * Returns the DART representation of the user's Nielsen Designated Market Area.
         * @method getUserDMACode
         * @returns {Number} A DART representation of the user's Nielson Designated Market Area.
         */
        getUserDMACode: function () {
            enablerLogger('@getUserDMACode: Is not supported in this version of Enabler.');
            return 0;
        },

        /**
         * Returns the two-letter string representation of the user's state or province.
         * @method getUserState
         * @returns {String} Two-letter string representation of the user's state or province.
         */
        getUserState: function () {
            enablerLogger('@getUserState: Is not supported in this version of Enabler.');
            return '';
        },

        /**
         * Returns the user's zip code (for users in the United States, U.S. territories, and Canada).
         * @method getUserZipCode
         * @returns {String} The user's zip code as supplied by the ad server.
         */
        getUserZipCode: function () {
            enablerLogger('@getUserZipCode: Is not supported in this version of Enabler.');
            return '';
        },

        /**
         * Checks if a user has interacted with the document.
         * @method hasUserInteracted
         * @returns {Boolean} Whether the user has interacted with the document.
         */
        hasUserInteracted: function () {
            enablerLogger('@hasUserInteracted: Is not supported in this version of Enabler.');
            return false;
        },

        /**
         * Invoke a function in the parent container. This could be the top frame if served via a adj (script) tag, the serving iframe if served via and adi (iframe) tag.
         * @method invokeExternalJsFunction
         * @param {String} functionName The function name to invoke.
         */
        invokeExternalJsFunction: function (functionName) {
            enablerLogger('@invokeExternalJsFunction: Is not supported in this version of Enabler.');
        },

        /**
         * Invoke a function on the mraid api. This is different from invokeExternalJsFunction as you are given the results of the function in a callback.
         * @method invokeMraidMethod
         * @param {String} methodName The method name to invoke on the mraid object. You can also use dot accessors to access subobjects if they are ever introduced. For instance, 'package.method', would call window.mraid.package.method().
         * @param {Array} opt_args The arguments to invoke the method with.
         * @param {Function} opt_callback A callback that gets invoked with the results of the function call.
         */
        invokeMraidMethod: function (methodName, opt_args, opt_callback) {
            enablerLogger('@invokeMraidMethod: Is not supported in this version of Enabler.');
        },

        /**
         * Returns whether the ad is serving in the live environment or not.
         * @method isServingInLiveEnvironment
         * @returns {Boolean} Whether the ad is serving in the live environment or not.
         */
        isServingInLiveEnvironment: function () {
            enablerLogger('@isServingInLiveEnvironment: Is not supported in this version of Enabler.');
            return false;
        },

        /**
         * Initiates a query for the maximum allowable fullscreen dimensions. A studio.event.StudioEvent.FULLSCREEN_DIMENSIONS event will be dispatched with the maximum allowed width and height as properties.
         * Some publishers may pad the fullscreen window for a lightbox-like experience. Because of this the maximum allowable dimensions may not take up the entire browser window or screen.
         * @method queryFullscreenDimensions
         */
        queryFullscreenDimensions: function () {
            enablerLogger('@queryFullscreenDimensions: Is not supported in this version of Enabler.');
        },

        /**
         * Initiates a query to find out whether mock fullscreen expansion mode is supported. Please listen for the studio.event.StudioEvent.FULLSCREEN_SUPPORT event. This event will contain the support status.
         * @method queryFullscreenSupport
         */
        queryFullscreenSupport: function () {
            enablerLogger('@queryFullscreenSupport: Is not supported in this version of Enabler.');
        },

        /**
         * Provide a method that allows the creative to define a chargeable event.
         * @method registerChargeableEventName
         * @param {String} eventName String name for which a counter or timer event will be will be will be triggered in the creative execution.
         */
        registerChargeableEventName: function (eventName) {
            enablerLogger('@registerChargeableEventName: Is not supported in this version of Enabler.');
        },

        /**
         * Counts instances of the string parameter, aggregated as Custom Variable Count 1 in reports. The string must meet the following criteria:
         *  * The string cannot exceed 100 characters
         *  * The string must only contain Latin characters (0-9, Aa-Zz)
         *  * The String must NOT contain any personally identifiable information such as name, email address, phone number, health info, financial info, etc.
         * Additionally, all question marks (?) and anything after the first question mark in a string will be truncated.
         * @method reportCustomVariableCount1
         * @param {String} customString Value to record against custom variable count 1.
         */
        reportCustomVariableCount1: function (customString) {
            enablerLogger('@reportCustomVariableCount1: Is not supported in this version of Enabler.');
        },

        /**
         * Counts instances of the string parameter, aggregated as Custom Variable Count 2 in reports. The string must meet the following criteria:
         *  * The string cannot exceed 100 characters
         *  * The string must only contain Latin characters (0-9, Aa-Zz)
         *  * The String must NOT contain any personally identifiable information such as name, email address, phone number, health info, financial info, etc.
         * Additionally, all question marks (?) and anything after the first question mark in a string will be truncated.
         * @method reportCustomVariableCount2
         * @param {String} customString Value to record against custom variable count 2.
         */
        reportCustomVariableCount2: function (customString) {
            enablerLogger('@reportCustomVariableCount2: Is not supported in this version of Enabler.');
        },

        /**
         * Set the dynamic content development values.
         * @method setDevDynamicContent
         * @param {Object} value The Dynamic Content development values.
         */
        setDevDynamicContent: function (value) {
            enablerLogger('@setDevDynamicContent: Is not supported in this version of Enabler.');
        },

        /**
         * Adds a Hint to this creative.
         * @method setHint
         * @param {String} name The name of the hint we want to add.
         * @param {String} value The value of the hint we want to add.
         */
        setHint: function (name, value) {
            enablerLogger('@setHint: Is not supported in this version of Enabler.');
        },

        /**
         * Get the dynamic creative profile id.
         * @method getProfileId
         * @returns {Number} Returns the dynamic creative profile id.
         */
        getProfileId: function () {
            enablerLogger('@getProfileId: Is not supported in this version of Enabler.');
            return 0;
        },

        /**
         * Set the dynamic creative profile id.
         * @method setProfileId
         * @param {Number} value Profile id.
         */
        setProfileId: function (value) {
            enablerLogger('@setProfileId: Is not supported in this version of Enabler.');
        },

        /**
         * Returns the DART ad ID.
         * @method getDartAdId
         * @returns {Number} Integer value of the ID number (generated by DART) that identifies the ad.
         */
        getDartAdId: function () {
            enablerLogger('@getDartAdId: Is not supported in this version of Enabler.');
            return 0;
        },

        /**
         * Returns the DART asset ID.
         * @method getDartAssetId
         * @returns {String} The ID (generated by DART) that identifies the creative.
         */
        getDartAssetId: function () {
            enablerLogger('@getDartAssetId: Is not supported in this version of Enabler.');
            return '';
        },

        /**
         * Returns the DART creative ID.
         * @method getDartCreativeId
         * @returns {Number} The ID number (generated by DART) that identifies the creative.
         */
        getDartCreativeId: function () {
            enablerLogger('@getDartCreativeId: Is not supported in this version of Enabler.');
            return 0;
        },

        /**
         * Returns the DART page ID.
         * @method getDartPageId
         * @returns {Number} The ID number (generated by DART) that identifies the zone where the creative is served.
         */
        getDartPageId: function () {
            enablerLogger('@getDartPageId: Is not supported in this version of Enabler.');
            return 0;
        },

        /**
         * Returns the DART rendering ID.
         * @method getDartRenderingId
         * @returns {String} The ID (generated by DART) that identifies the rendering version of the creative.
         */
        getDartRenderingId: function () {
            enablerLogger('@getDartRenderingId: Is not supported in this version of Enabler.');
            return '';
        },

        /**
         * Returns the DART site ID.
         * @method getDartSiteId
         * @returns {Number} Integer value of the ID number that identifies the site where the creative is served, as defined in DART.
         */
        getDartSiteId: function () {
            enablerLogger('@getDartSiteId: Is not supported in this version of Enabler.');
            return 0;
        },

        /**
         * Returns the DART site name.
         * @method getDartSiteName
         * @returns {String} The name of the site where the creative is served, as defined in DART.
         */
        getDartSiteName: function () {
            enablerLogger('@getDartSiteName: Is not supported in this version of Enabler.');
            return '';
        },

        /**
         * Notifies of issues / missing things inside Enabler. For Internal Use Only.
         * @method enablerLogger
         * @param {Mixed} A mixed message to display to the user
         */
        enablerLogger: enablerLogger,

        /**
         * Loads an additional script file
         * @method loadScript
         * @param {String} scriptUrl The url of the script to load
         * @param {Function} opt_loadedCallback The callback to invoke when the script is loaded
         */
        loadScript: function (scriptUrl, opt_loadedCallback) {
            var script = document.createElement('script');

            /* istanbul ignore else */
            if (Lang.isFunction(opt_loadedCallback)) {
                script.onload = script.onreadystatechange = function () {
                    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                        opt_loadedCallback();
                        script.onload = script.onreadystatechange = null;
                    }
                };
            }
            script.src = scriptUrl;
            script.type = 'text/javascript';
            document.body.appendChild(script);

            return script;
        },

        /**
         * Loads an additional module
         * @method loadModule
         * @param {studio.module.ModuleId} moduleType The name of the module to load.
         * @param {Function} opt_loadedCallback The callback to invoke when the module is loaded
         */
        loadModule: function (moduleName, opt_loadedCallback) {
            var studioObj = this.getStudio();
            var module = {};
            /* istanbul ignore else */
            if (Lang.isObject(studioObj) && Lang.isObject(studioObj.module) && Lang.isObject(studioObj.module.ModuleId)) {
                if (moduleName === 'enabler') {
                    module = Enabler;
                } else if (moduleName === 'video') {
                    module = studioObj.video;
                }
                if (opt_loadedCallback) {
                    opt_loadedCallback(module);
                }
                return module;
            }
            /*@<*/
            Debug.error('[ ACT_Enabler.js ]: Error loading module from Enabler', moduleName);
            /*>@*/
            return null;
        }
    };

    studio = {
        events: {
            StudioEvent: {
                ABOUT_TO_EXPAND: 'aboutToExpand',
                COLLAPSE: 'collapse',
                COLLAPSE_FINISH: 'collapseFinish',
                COLLAPSE_START: 'collapseStart',
                EXIT: 'exit',
                EXPAND_FINISH: 'expandFinish',
                EXPAND_START: 'expandStart',
                FULLSCREEN_COLLAPSE_FINISH: 'fullscreenCollapseFinish',
                FULLSCREEN_COLLAPSE_START: 'fullscreenCollapseStart',
                FULLSCREEN_DIMENSIONS: 'fullscreenDimensions',
                FULLSCREEN_EXPAND_FINISH: 'fullscreenExpandFinish',
                FULLSCREEN_EXPAND_START: 'fullscreenExpandStart',
                FULLSCREEN_SUPPORT: 'fullscreenSupport',
                HIDDEN: 'hidden',
                INIT: 'init',
                INTERACTION: 'interaction',
                ORIENTATION: 'orientation',
                PAGE_LOADED: 'pageLoaded',
                VISIBILITY_CHANGE: 'visibilityChange',
                VISIBLE: 'visible'
                    /**
                     * Adds a dynamic property to the event.
                     * @param {String} key The key to add.
                     * @param {*} value The value of the property.
                     * @returns Returns this event for convenience.
                     */
                    // addProperty: function (key, value) {
                    //    return this;
                    // }
            }
        },

        common: {
            mde: {
                directionsList: ['tl', 'tr', 'bl', 'br'],

                Direction: function () {
                    var direction = this.directionsList[0];
                    var index;
                    var next;
                    /* istanbul ignore else */
                    if (config) {
                        index = this.getDirectionIndex(config.expand.expandDirection);
                        direction = config.expand.expandDirection;
                        if (config.expand.isMultiDirectional) {
                            next = this.directionsList[(index + 1) % 4];
                            config.expand.expandDirection = next;
                        }
                    }
                    return direction;
                },

                getDirectionIndex: function (dir) {
                    var ind = 0;
                    var i;
                    for (i = 0; i < this.directionsList.length; i++) {
                        if (this.directionsList[i] === dir) {
                            ind = i;
                        }
                    }
                    return ind;
                }
            },
            Environment: {
                Type: {
                    LIVE: 1,
                    LOCAL: 2,
                    BROWSER: 4,
                    IN_APP: 8,
                    LAYOUTS_PREVIEW: 16,
                    CREATIVE_TOOLSET: 32,
                    RENDERING_STUDIO: 64,
                    RENDERING_TEST: 128
                },

                Value: 6,

                addType: function (type) {
                    this.Value = this.Value |= type;
                    mapValue(type);
                },

                setType: function (type) {
                    this.Value = type | 6;
                    mapValue(this.Value);
                },

                hasType: function (type) {
                    return (this.Value & type) === type;
                },

                getValue: function () {
                    return this.Value;
                }
            }
        },

        hint: {
            ExpansionMode: {
                LIGHTBOX: 'lightbox',
                NORMAL: 'normal'
            },
            ExpansionTrigger: {
                ON_CLICK: 'onClick',
                ON_HOVER: 'onHover'
            },
            Hint: {
                EXPANSION_MODE: 'expansionMode',
                EXPANSION_TRIGGER: 'expansionTrigger'
            }
        },

        module: {
            ModuleId: {
                CONFIGURABLE: 'configurable',
                CONFIGURABLE_FILLER: 'configurablefiller',
                DCM_ENABLER: 'dcmenabler',
                ENABLER: 'enabler',
                FILLER: 'layoutsfiller',
                GDN: 'gdn',
                LAYOUTS: 'layouts',
                RAD_VIDEO: 'rad_ui_video',
                VIDEO: 'video'
            }
        },

        sdk: {
            ContainerState: {
                COLLAPSED: 'collapsed',
                COLLAPSING: 'collapsing',
                EXPANDED: 'expanded',
                EXPANDING: 'expanding',
                FS_COLLAPSING: 'fs_collapsing',
                FS_EXPANDED: 'fs_expanded',
                FS_EXPANDING: 'fs_expanding'
            },
            ExitFlag: {
                LOG_ONLY: 1,
                NONE: 0
            },
            MraidMethod: {
                CREATE_CALENDAR_EVENT: 'createCalendarEvent',
                GET_CURRENT_POSITION: 'getCurrentPosition',
                GET_DEFAULT_POSITION: 'getDefaultPosition',
                GET_MAX_SIZE: 'getMaxSize',
                GET_SCREEN_SIZE: 'getScreenSize',
                PLAY_VIDEO: 'playVideo',
                STORE_PICTURE: 'storePicture',
                SUPPORTS: 'supports'
            }
        },

        video: {
            Reporter: {

                /*@<*/
                getVideoTracking: function () {
                    return config.videoTracking;
                },
                /*>@*/

                /**
                 * Observes a video element for reporting
                 * @method attach
                 * @param {String} videoReportingIdentifier The name the video should report as.
                 * @param {HTMLVideoElement} videoElement The video element to report on.
                 * @param {Boolean|Object} opt_trackAsAutoPlay Used to indicate whether to track the initial play as a "video interaction" OR a set of which elements to track.
                 * @example
                     // Track AutoPlay - start / 50 / end
                     studio.video.Reporter.attach("video_id", videoNode, true);

                     // Track Everything ( start / 25 / 50/ 75 / ended / pause / volume / seeked / replay )
                    studio.video.Reporter.attach("video_id", videoNode, false);

                    // Track Optional ( start / ended )
                    var vidTrackConf = {
                        start: true,
                        25: false,
                        50: false,
                        75: false,
                        ended: true,
                        pause: false,
                        volumechange: false,
                        seeked: false
                    };
                    studio.video.Reporter.attach('video_id', videoNode, vidTrackConf);

                 * for autoplay videos (the play event will always get tracked). This defaults to true.
                 */
                attach: function (videoReportingIdentifier, videoElement, opt_trackAsAutoPlay) {
                    var conf = {};
                    var videoTrack;
                    if (opt_trackAsAutoPlay === true) {
                        /*
                         we have autoPlay so we track start/50/end
                         */
                        conf = {
                            tracking: {
                                start: true,
                                25: false,
                                50: true,
                                75: false,
                                ended: true,
                                pause: false,
                                volumechange: false,
                                seeked: false
                            }
                        };
                    } else if (Lang.isObject(opt_trackAsAutoPlay)) {
                        conf = {
                            tracking: opt_trackAsAutoPlay
                        };
                    }

                    /* create a videoListener if it does not exist */
                    if (config.videoListener === null) {
                        /* istanbul ignore else */
                        config.videoListener = Event.on('video:action', function (data) {
                            var eventType;
                            var generatedLabel;
                            // only fire the tracking if data.videoId is in our video tracking list
                            /* istanbul ignore else */
                            if (config.videoTracking.hasOwnProperty(data.videoId)) {
                                eventType = data.eventType;
                                generatedLabel = data.videoId + ':' + eventType;
                                /*@<*/
                                Debug.log('[ ACT_Enabler.js ]: video tracking with ID: ', generatedLabel);
                                /*>@*/
                                window.Enabler.counter(generatedLabel);
                            }
                        });
                    }

                    videoTrack = new VideoEvents(videoElement, videoReportingIdentifier, conf);

                    /* istanbul ignore else */
                    if (!config.videoTracking.hasOwnProperty(videoReportingIdentifier)) {
                        config.videoTracking[videoReportingIdentifier] = [];
                    }
                    config.videoTracking[videoReportingIdentifier].push(videoTrack);

                    return videoTrack;
                },

                /**
                 * Stops a video reporting identifier from reporting.
                 * @method detach
                 * @param videoReportingIdentifier
                 */
                detach: function (videoReportingIdentifier) {
                    var tracking;
                    var itor;
                    /* istanbul ignore else */
                    if (config.videoTracking.hasOwnProperty(videoReportingIdentifier)) {
                        tracking = config.videoTracking[videoReportingIdentifier];
                        for (itor = 0; itor < tracking.length; itor++) {
                            tracking[itor].destroy();
                            tracking[itor] = null;
                        }
                        delete config.videoTracking[videoReportingIdentifier];
                    }
                }
            }
        }
    };

    /* Startup Enabler */
    window.Enabler = new Enabler();
    window.studio = window.Enabler.getStudio();

    return window.Enabler;
});

/* Extra Space to define and document Enabler configuration params */

/**
 * Enabler Config Object contains all of the configuration options for this `Enabler` instance.
 * This object is supplied by the implementer when using ACT Enabler.
 * Properties have default values if they are not supplied by the implementer.
 *
 * ```
 *     var conf = {
 *         enableConsole: false,
 *         frameId: '',
 *         actTracking: {},
 *         trackingLabels: {},
 *         enablerInteractionTracking: false,
 *         eventPropagation: false,
 *         callbacks: [],
 *         countersList: {},
 *         eventQueue: {},
 *         exitUrls: {},
 *         htmlRoot: '',
 *         initialized: false,
 *         pageLoaded: false,
 *         timerCollection: {},
 *         videoTracking: {},
 *         videoListener: null,
 *         exposeADTECH: false,
 *         currentEnv: 'generic',
 *         visible: false,
 *         expand: {
 *             containerState: '',
 *             useCustomClose: false,
 *             expandingPixelOffsets: {},
 *             floatingPixelDimensions: {},
 *             isMultiDirectional: false,
 *             startExpanded: false,
 *             expandDirection: 'tl',
 *             fsExpandWidth: 0,
 *             fsExpandHeight: 0
 *         }
 *     };
 * ```
 *
 * @class EnablerConfig
 * @static
 */

 /**
  * enableConsole Pass through true to enable consoles from Enabler, false otherwise.
  * @property {Boolean} enableConsole
  * @default false
  */


 /**
  * exposeADTECH Enabler replacement for AOL 1's ADTECH Library - Wraps Enabler calls in ADTECH function API
  * @property {Boolean} exposeADTECH
  * @default false
  */

/**
 * htmlRoot URI Of the HTML Root Assets.
 * @property {String} htmlRoot
 * @default Empty String
 */

/**
 * tracking if set to an object that defines the tracking for this ad will setup a tracking system within Enabler.
 * @property {Object} tracking
 * @default Empty Object
 **/

/**
 * eventPropagation Set to true will propagate both `redirect` and `track` requests from within the ad. Set to
 * `track` will only propagate the tracking redirects.
 * `redirect` will only propage when a redirect will get called
 * @property {Mixed} eventPropagation
 * @default false
 **/

/**
 * enablerTarget CDN Location of the Enabler to load and use in the ad.
 * @property {String} enablerTarget
 * @default null
 */

/**
 * exitUrls List of exit URLs.
 * @example
 * ```
 *     exitUrls: {
 *         clickTAG: 'http://www.example.com/siteOne',
 *         clickTAG1: 'http://www.example.com/siteTwo',
 *         clickTAG2: 'http://www.example.com/siteThree',
 *     }
 * ```
 * @property {Object} exitUrls
 * @default Empty Object
 */

/**
 * enablerInteractionTracking Given this config param, once set to `true` will execute interaction tracks within Enabler.
 * @property {Boolean} enablerInteractionTracking
 * @default false
 */

/**
 * trackingLabels provided this set, a label will be applied to simple key / value replacement
 * @example
 * ```
 *     trackingLabels: {
 *         video1:25 : 'billboard_view_video1_25percent',
 *         video1:50 : 'billboard_view_video1_50percent',
 *         video1:75 : 'billboard_view_video1_75percent'
 *     }
 * ```
 *
 * @property {Object} trackingLabels
 * @default Empty Object
 **/

/* Private Definitions */

/**
 * currentEnv Keeps the current environment that this ad was rendered in.
 * @property {String} currentEnv
 * default 'generic'
 * @private
 */

/**
 * countersList List of counters that have been started.
 * @property {Object} countersList
 * @default Empty Object
 * @private
 */

 /**
 * callbacks Queue of callbacks to execute after initialized is called.
 * @property {Array} callbacks
 * @default Empty Array
 * @private
 */

/**
 * initialized Internal flag that signifies that Enabler has been initialized or not
 * @property {Boolean} initialized
 * @default false
 * @private
 */

/**
 * timerCollection Collection of timers used inside this Enabler instance.
 * @property {Object} timerCollection
 * @default Empty Object
 * @private
 */

/**
 * pageLoaded Internal flag that signifies that the Page `(on)load` event has fired
 * @property {Boolean} pageLoaded
 * @default false
 * @private
 */

/**
 * videoListener Internal flag that keeps track of video listeners applied to videos.
 * @property {OBject} videoListener
 * @default null
 * @private
 */

/**
 * videoTracking Internal set of video tracking references.
 * @property {OBject} videoTracking
 * @default null
 * @private
 */
