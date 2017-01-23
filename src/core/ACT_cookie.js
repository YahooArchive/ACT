/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/* eslint new-cap: 0 */
ACT.define('Cookie', [/*@<*/'Debug', /*>@*/ 'Json', 'Lang', 'Event'], function (ACT) {
    'use strict';

    /* ACT.js Shorthand */
    var JSON = ACT.Json;
    var Lang = ACT.Lang;
    var Event = ACT.Event;

    /**
     * default values
     */
    var DEFAULT_DOMAIN = 'yahoo.com';
    var DEFAULT_PATH = '/';
    var DEFAULT_EXPIRES = 172800000;
    var DEFAULT_COOKIE_NAME = 'CRZY';
    var DEFAULT_NAME = 'ACTCookie';
    var ENCODE = encodeURIComponent;
    var DECODE = decodeURIComponent;
    var DEFAULT_FREQ_CAP = 1;

    /* Private Variables */
    var yAPI = null;
    var safeFrameKey = null;
    var eventReadCookie = null;
    var eventReadCookieFailed = null;

    // constant value for eaiser references
    var COOKIE_TYPES = {
        STANDARD: 'standard',
        SAFEFRAME: 'safeFrame'
    };

    /* SecureDarla prefix -  to listen to SafeFrame Notifications - shorthand */
    var EVENT_DARLA_PREFIX = 'secureDarla:'; // this prefix to use for message coming from sDarla API

    /**
     * EVENTS
     */
    var EVENT_SDARLA_REGISTER = EVENT_DARLA_PREFIX + 'register';
    var EVENT_SDARLA_FAIL = EVENT_DARLA_PREFIX + 'failed';
    var EVENT_SDARLA_REGISTER_UPDATE = EVENT_DARLA_PREFIX + 'register-update';
    var EVENT_SDARLA_READ_COOKIE = EVENT_DARLA_PREFIX + 'read-cookie';
    var EVENT_SDARLA_WRITE_COOKIE = EVENT_DARLA_PREFIX + 'write-cookie';

    var EVENT_SAFEFRAME_NO_SUPPORT = 'sframe:nosupport';

    var EVENT_REGISTER_AD = 'localRegister:registerAd';
    var EVENT_REGISTER_AD_COMPLETE = 'localRegister:registerAd:complete';
    var EVENT_TRACK_STATE = 'localRegister:trackState';
    var EVENT_TRACK_STATE_COMPLETE = 'localRegister:trackState:complete';
    var EVENT_UPDATE_AD_EVENT = 'localRegister:updateAdEvent';
    var EVENT_UPDATE_AD_EVENT_COMPLETE = 'localRegister:updateAdEvent:complete';
    var EVENT_REGISTER_ACTIONS = 'register:Actions';
    var EVENT_COMPLETE_ACTIONS = 'complete:action';

    /* event which will get the value of given state */
    var EVENT_GET_STATE = 'localRegister:getState';
    var EVENT_GET_STATE_COMPLETE = 'localRegister:getState:complete';

    /* Cookie Specific Events */
    var EVENT_COOKIE_GETDATA_COMPLETE = 'Cookie:getData:complete';
    // var EVENT_COOKIE_SAVEDATA_COMPLETE = 'Cookie:saveData:complete';
    var EVENT_COOKIE_READY = 'Cookie:internal:ready';
    var EVENT_COOKIE_SAVED = 'Cookie:internal:saved';

    /* Cookie Status Codes */
    var COOKIE_STATUS_OK = 0; // Cookie is OK and ready - data returned.
    var COOKIE_STATUS_NO_COOKIE = -1; // No Cookies available - SafeFrame and Standard
    var COOKIE_STATUS_PENDING = 10;
    // var ERROR_SAFEFRAME_NO_COOKIE = 'NO_SF_COOKIE';
    var cookieActions;
    var standardCookie;
    var safeframeCookie;
    /*@<*/
    var debug = ACT.Debug;
    debug.log('[ ACT_cookie.js ]: loaded');
    /*>@*/


    /**
     * Actions to be registered
     */
    /* unit test: ignore as events stubbed */
    /* istanbul ignore next */
    cookieActions = [{
        type: 'trackState',
        argument: {
            stateId: {
                name: 'stateId',
                test: function (value) {
                    return (Lang.isString(value));
                }
            },
            state: {
                name: 'state',
                test: function (value) {
                    return (Lang.isString(value));
                }
            },
            timeout: {
                name: 'timeout',
                test: function (value) {
                    return Lang.isNumber(value) || value === undefined || value === null;
                }
            }
        },
        process: function (actionId, args) {
            var updateAdEventListener = Event.on(EVENT_TRACK_STATE_COMPLETE, function () {
                updateAdEventListener.remove();
                // finish queue action
                Event.fire(EVENT_COMPLETE_ACTIONS, actionId);
            });

            // fire action for update ad event
            Event.fire(EVENT_TRACK_STATE, {
                stateId: args.stateId,
                stateValue: args.state
            });
        }

    }, {
        type: 'updateAdEvent',
        argument: {
            eventName: {
                name: 'eventName',
                test: function (value) {
                    return (Lang.isString(value));
                }
            },
            timeout: {
                name: 'timeout',
                test: function (value) {
                    return Lang.isNumber(value) || value === undefined || value === null;
                }
            }
        },
        process: function (actionId, args) {
            var updateAdEventListener = Event.on(EVENT_UPDATE_AD_EVENT_COMPLETE, function () {
                updateAdEventListener.remove();
                Event.fire(EVENT_COMPLETE_ACTIONS, actionId);
            });

            Event.fire(EVENT_UPDATE_AD_EVENT, {
                eventName: args.eventName
            });
        }
    }];

    /**
     * Cookie Helper Utilities - STANDARD COOKIE
     * @private
     */
    standardCookie = {

        /**
         * The type of the current cookie functionality in use.
         * @attribute standardCookie.TYPE
         * @type {String}
         * @initOnly
         * @private
         */
        TYPE: COOKIE_TYPES.STANDARD,

        /**
         * Test to see if user has cookies enabled.
         * @param {String} domain The domain name of the cookie.
         * @method standardCookie.test
         * @return {Boolean} true is able to write cookies false otherwise.
         * @private
         */
        test: function () {
            /* istanbul ignore next */
            var cookieEnabled = !!(navigator.cookieEnabled);
            /* unit test: cannot test navigator obj */
            /* istanbul ignore next */
            if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled) {
                document.cookie = 'fpadtestcookie';
                cookieEnabled = (document.cookie.indexOf('fpadtestcookie') !== -1);
            }
            return cookieEnabled;
        },

        /**
         * Sets the cookie
         * @param {String} cookieName The name of the cookie.
         * @param {Object} cookieContent The value of the cookie - string OR simple Object. Currently only supports the following character set: [a-zA-Z0-9&=_]
         * @param {String} domain Domain under which to store the cookie. Defaults to yahoo.com
         * @param {Number} expires How long to stay alive. Defaults to 24 hours
         * @param {String} path Path under which to store the cookie. Defaults to /
         * @method standardCookie.set
         * @private
         */
        set: function (cookieName, cookieContent, domain, expires, path) {
            var date = new Date();
            var cookieContentHash = ENCODE(JSON.stringify(cookieContent));

            domain = domain || DEFAULT_DOMAIN;
            path = path || DEFAULT_PATH;
            expires = expires || DEFAULT_EXPIRES;

            date.setTime(date.getTime() + expires);
            document.cookie = cookieName + '=' + cookieContentHash + '; expires=' + date.toGMTString() + '; domain=' + domain + '; path=' + path;

            /**
             * Fire event in standard ad as well so we the same appoarch with Darla
             */
            Event.fire(EVENT_COOKIE_SAVED, {});
        },

        /**
         * Get the cookie
         * @param {String} cookieName The name of the cookie to get.
         * @return {Object} The cookie data in an object.
         * @method standardCookie.get
         * @private
         */
        get: function (c) {
            var localCookie = ' ' + document.cookie + ';';
            var cookieRegEx = new RegExp(' ' + c + '=(.*?);');
            var cookieValue = localCookie.match(cookieRegEx);
            var cookieValueReturned = 0;
            if (cookieValue) {
                cookieValue = DECODE(cookieValue[1]);
            }
            if (cookieValue) {
                cookieValueReturned = JSON.parse(cookieValue);
            }

            return cookieValueReturned;
        },

        /**
         * Remove the cookie - set it to expire.
         * @param {String} cookieName The name of the cookie
         * @param {String} domain The domain name of the cookie.
         * @method standardCookie.remove
         * @private
         */
        remove: function (cookieName, domain, path) {
            var currentDomain = domain || DEFAULT_DOMAIN;
            var currentPath = path || DEFAULT_PATH;
            standardCookie.set(cookieName, '', currentDomain, -345600000, currentPath);
            return true;
        }
    };

    /**
     * Cookie Helper Utilities - SafeFrame COOKIE
     * @private
     */
    safeframeCookie = {

        /**
         * The type of the current cookie functionality in use.
         * @attribute safeframeCookie.TYPE
         * @type {String}
         * @initOnly
         * @private
         */
        TYPE: COOKIE_TYPES.SAFEFRAME,

        /**
         * SafeFrame Cookie data
         * @type {Object}
         * @private
         */
        data: null,

        /**
         * A simple SafeFrame status variable. If true then we're waiting on SafeFrame cookie reply. If 'false' then we have SafeFrame cookie data
         * NULL otherwise
         * @type {Boolean}
         * @private
         */
        pending: null,

        /**
         * Test to see if user has cookies enabled.
         * @method safeframeCookie.test
         * @return {Boolean} true is able to write cookies false otherwise.
         * @private
         */
        test: function () {
            /* istanbul ignore else */
            if (yAPI && Lang.isFunction(yAPI.supports)) {
                return yAPI.supports('read-cookie') && yAPI.supports('write-cookie');
            }
            return false;
        },

        /**
         * Sets the SafeFrame cookie - For consistency, the parameters it takes are the same as the StandardCookie
         * However, the function only uses cookieName and cookieContent. 'domain', 'expires' and 'path" are simply ignored.
         * @param {String} cookieName The name of the cookie.
         * @param {Object} cookieContent The value of the cookie - string OR simple Object. Currently only supports the following character set: [a-zA-Z0-9&=_]
         * @param {String} domain Domain under which to store the cookie. Defaults to yahoo.com
         * @param {Number} expires How long to stay alive. Defaults to 24 hours
         * @param {String} path Path under which to store the cookie. Defaults to /
         * @method safeframeCookie.set
         * @private
         */
        set: function (cookieName, cookieContent) {
            var eventListener;
            /* unit test: will always return true */
            /* istanbul ignore else */
            if (safeframeCookie.test()) {
                // listen for return from Darla
                /* istanbul ignore next */
                eventListener = Event.on(EVENT_SDARLA_WRITE_COOKIE, function (data) {
                    eventListener.remove();
                    Event.fire(EVENT_COOKIE_SAVED, data);
                });

                /*@<*/
                debug.info('[ ACT_cookie.js ]: save darla cookie', cookieName, cookieContent);
                /*>@*/

                safeframeCookie.data = cookieContent;
                yAPI.cookie(cookieName, {
                    key: safeFrameKey,
                    value: JSON.stringify(cookieContent)
                });
            }
        },

        /**
         * Get the cookie
         * @param {String} cookieName The name of the cookie to get.
         * @return {Object} The cookie data in an object.
         * @method safeframeCookie.get
         * @private
         */
        get: function (cookieName) {
            /* unit test: will always return true */
            /* istanbul ignore else */
            if (safeframeCookie.test() === true) {
                // if reading Darla cookie is finish then return stored data
                // unit test: cannot test wait
                /* istanbul ignore if */
                if (safeframeCookie.pending === false) {
                    Event.fire(EVENT_COOKIE_READY, { status: COOKIE_STATUS_OK, data: safeframeCookie.data });
                } else if (safeframeCookie.pending === true) {
                    /* if still waiting for Darla then keeps waiting */
                    return COOKIE_STATUS_PENDING;
                } else {
                    /* if Darla cookie is not read yet then  read it and put in pending state */
                    safeframeCookie.getSFCookie(cookieName);
                    return COOKIE_STATUS_PENDING;
                }
            } else {
                safeframeCookie.data = null;
                Event.fire(EVENT_COOKIE_READY, { status: COOKIE_STATUS_NO_COOKIE, data: safeframeCookie.data });
            }
            /* Since we are no longer pending. We can return the cookie data right away. */
            return safeframeCookie.data;
        },

        /**
         * Initializing SafeFrame helper functions.
         * @method safeframeCookie.getSFCookie
         * @param {String} cookieName The name of the cookie to pick up from SafeFrame.
         * @private
         */
        getSFCookie: function (cookieName) {
            /* unit test: will always return true */
            /* istanbul ignore else */
            if (safeframeCookie.test()) {
                /*@<*/
                debug.info('[ ACT_cookie.js ]: Darla supports cookies, let read it');
                /*>@*/
                /* Call Darla read cookie function - in a set timeout to push it to the bottom of the execution stack */

                setTimeout(function () {
                    yAPI.cookie(cookieName, {
                        key: safeFrameKey
                    });
                }, 10);
                safeframeCookie.pending = true;
            } else {
                /*@<*/
                debug.info('[ ACT_cookie.js ]: Darla does not support cookies, return error status');
                /*>@*/
                safeframeCookie.pending = false;
                safeframeCookie.data = null;
                /* unit test: events have been stubbed */
                /* istanbul ignore next */
                Event.fire(EVENT_COOKIE_READY, { status: COOKIE_STATUS_NO_COOKIE, data: safeframeCookie.data });
            }
        },

        /**
         * Read the SafeFrame Cookie data into a local variable.
         * @method safeframeCookie.readSFCookie
         * @param {Object} data passed in from the SafeFrame API
         * @private
         */
        readSFCookie: function (data) {
            /* Only execute the code if we have a read-cookie command - so to ignore other 'failed' commands */
            if ('cmd' in data && data.cmd === 'read-cookie') {
                if ('info' in data && Lang.isObjectEmpty(data.info)) {
                    /* We have an empty info object, which implies we had an error occur. - fire off 'no cookie' */
                    Event.fire(EVENT_COOKIE_READY, { status: COOKIE_STATUS_NO_COOKIE, data: safeframeCookie.data });
                } else {
                    // Msg from DARLA: failed {'cmd':'read-cookie','info':{},'value':null,'reason':'no valid cookie name','key':{}}
                    if ('value' in data) {
                        safeframeCookie.data = JSON.parse(DECODE(data.value)) || {};
                    } else {
                        /* Even if we don't have a cookie set, we obviously are able to get it. Which means we can set it also.
                         * Initializing it to an empty object here is OK
                         */
                        safeframeCookie.data = {};
                    }
                    safeframeCookie.pending = false;

                    /* Fire off an 'internal' ready event. To notify whomever is interested that the data is ready for processing. */
                    Event.fire(EVENT_COOKIE_READY, { status: COOKIE_STATUS_OK, data: safeframeCookie.data });
                }
            }
        },

        /**
         * Remove the cookie - set it to expire.
         * @param {String} cookieName The name of the cookie
         * @param {String} domain The domain name of the cookie.
         * @method safeframeCookie.remove
         * @private
         */
        remove: function (cookieName) {
            // To remove the cookie, we set it's contents to an empty string
            safeframeCookie.set(cookieName, '');
            return true;
        }
    };

    /**
     * ACT Cookie functionality. Enables ads to set and get cookies.
     *
     *     var conf = {
     *         expires: 172800000,
     *         default_cookieName: 'CRZY',
     *         path: '/',
     *         domain: 'yahoo.com',
     *         name: 'cookieName'
     *         freq_cap : 1
     *     };
     *     var cookie = new cookie( conf, this);
     *
     * @class Cookie
     * @module Cookie
     * @requires json, lang, event, debug
     *
     */
    function cookie(conf, ref) {
        var cookieConf = conf || {};
        /*@<*/
        debug.log('[ ACT_cookie.js ]: Constructor - setting defaults.', conf);
        /*>@*/
        this.DEFAULT_EXPIRES = cookieConf.expires || DEFAULT_EXPIRES;
        this.DEFAULT_COOKIE_NAME = cookieConf.default_cookieName || DEFAULT_COOKIE_NAME;
        this.DEFAULT_PATH = cookieConf.path || DEFAULT_PATH;
        this.DEFAULT_DOMAIN = cookieConf.domain || DEFAULT_DOMAIN;
        this.COOKIE_NAME = cookieConf.name || DEFAULT_NAME;
        this.FREQ_CAP = cookieConf.freq_cap || DEFAULT_FREQ_CAP;

        if (ref) {
            this.ref = ref;
        }

        // initialize some events
        this.initializeEventListeners();

        /* istanbul ignore next */
        // register actions to action queues;
        Event.fire(EVENT_REGISTER_ACTIONS, cookieActions);

        return this;
    }

    /**
     * @attribute ATTRS
     * @type {{NAME: string, version: string}}
     * @initOnly
     */
    cookie.ATTRS = {
        NAME: 'Cookie',
        version: '1.0.41'
    };

    /**
     * Cookie Utilities
     */
    cookie.prototype = {
        /*@<*/
        /* expose stadard cookie and sf cookie for helping with testing only. They will be removed on production */
        exposedStandardCookie: standardCookie,
        exposedSafeframeCookie: safeframeCookie,
        /*>@*/

        /**
         * @method initializeEventListeners
         */
        initializeEventListeners: function () {
            var root = this;
            // all event listeners will be saved in an eventList so we can clear them when cookie instance is destroyed
            root.eventList = [
                /* listener to register Darla */
                Event.on(EVENT_SDARLA_REGISTER, this.register, null, this),
                Event.on(EVENT_SDARLA_REGISTER_UPDATE, this.register, null, this),

                /* listener to register Darla */
                Event.on(EVENT_SAFEFRAME_NO_SUPPORT, this.get, null, this),

                /* listener to register Ad */
                Event.on(EVENT_REGISTER_AD, function (data) {
                    root.registerAd(data.adId);
                }),

                /* listener for update trake state into cookie */
                /* istanbul ignore next */
                Event.on(EVENT_TRACK_STATE, function (data) {
                    root.saveState(data.stateId, data.stateValue);

                    // save data to cookie
                    Event.fire(EVENT_TRACK_STATE_COMPLETE);
                }),

                /* listener for update ad event into cookie */
                Event.on(EVENT_UPDATE_AD_EVENT, function (data) {
                    root.updateAdEvent(data.eventName);
                }),

                /* listener for request get state value*/
                Event.on(EVENT_GET_STATE, function (data) {
                    root.getState(data.stateId);
                })
            ];
        },

        /**
         * @method destroy
         */
        destroy: function () {
            var eventListener;
            /* Detach all created event listeners */
            while (this.eventList.length > 0) {
                eventListener = this.eventList.shift();
                if (Lang.isObject(eventListener) && Lang.isFunction(eventListener.remove)) {
                    eventListener.remove();
                }
            }

            if (!Lang.isObjectEmpty(eventReadCookie) && Lang.isFunction(eventReadCookie.remove)) {
                eventReadCookie.remove();
                eventReadCookie = null;
            }

            if (!Lang.isObjectEmpty(eventReadCookieFailed) && Lang.isFunction(eventReadCookieFailed.remove)) {
                eventReadCookieFailed.remove();
                eventReadCookieFailed = null;
            }
        },

        /**
         * Check if is possible to set|read cookie
         * @method test
         * @return {*|Boolean}
         */
        test: function () {
            return this.cookie.test();
        },

        /**
         * Function to register an Ad to the Cookie. <br/>
         * The method will get cookie value, then update ad information in the cookie value before saving it back to the Cookie. </br>
         * When the whole process is done, event 'localRegister:registerAdComplete' will be fired with firstPlay (true | false) is passed as event parameter. <br />
         *
         * @method registerAd
         * @param {String} adId ID of the ad which need to be registered to the cookie
         */
        registerAd: function () {
            var root = this;

            // wait for reading cookie data complete
            /* istanbul ignore next */
            var eventListener = Event.on(EVENT_COOKIE_GETDATA_COMPLETE, function (e) {
                var returnResult = {
                    status: COOKIE_STATUS_OK // default to ok we can use cookie
                };
                var cookieData = 0;
                var freqCap = root.FREQ_CAP;
                eventListener.remove();
                /*@<*/
                debug.info('[ ACT_cookie.js ]: EVENT_COOKIE_GETDATA_COMPLETE', e);
                /*>@*/

                /*
                 * Status returned is anything other than OK. Then we have a cookie problem.
                 * In this case, we should simply assume that cookies are not supported at all
                 * and play the ad in backup / fallback mode
                 */
                if (Lang.isObject(e) && (e.status === COOKIE_STATUS_OK)) {
                    // cookie data coming from event
                    cookieData = e.data || { play: -1 };

                    /*@<*/
                    debug.log('[ ACT_cookie.js ]: Ad cookie before run', cookieData);
                    /*>@*/

                    cookieData.play = parseInt(cookieData.play, 10) + 1;
                    returnResult.firstPlay = cookieData.play < freqCap;

                    cookieData.states = cookieData.states || {};
                    returnResult.states = cookieData.states;

                    /*@<*/
                    debug.info('[ ACT_cookie.js ]: register ad - saving new cookie value', cookieData);
                    /*>@*/
                    // save cookieData and wait for this process to be finished by passing callback function
                    root.set(cookieData, function () {
                        /*@<*/
                        debug.info('[ ACT_cookie.js ]: new cookie value is saved - fire event to finish registerAD', returnResult);
                        /*>@*/
                        Event.fire(EVENT_REGISTER_AD_COMPLETE, returnResult);
                    });
                } else {
                    // any other case (e.g e is not object or e.status is not ok)
                    // don't need to get cookie, just need to send status back
                    returnResult.status = e.status;
                    Event.fire(EVENT_REGISTER_AD_COMPLETE, returnResult);
                }
            });

            /*@<*/
            debug.info('[ ACT_cookie.js ]: start register ad by reading cookie;');
            /*>@*/
            /*
             * Since this.get - is an ASYNC call which deals appropriately with cookies in both modes
             * It's OK to simply call this.get() here.
             */
            this.get();
        },

        /**
         * Funtion to save a special state of the ad into cookie.
         *
         * @method saveState
         * @param {String} stateId
         * @param {String} stateValue
         */
        saveState: function (stateId, stateValue) {
            var root = this;
            /* istanbul ignore next */
            var eventSaveState = Event.on(EVENT_COOKIE_GETDATA_COMPLETE, function (e) {
                var cookieData = e.data;
                eventSaveState.remove();

                if (cookieData === 0) {
                    cookieData = {};
                }

                if (!Lang.isObject(cookieData.states)) {
                    cookieData.states = {};
                }

                cookieData.states[stateId] = stateValue;
                root.set(cookieData);
            });

            this.get();
        },

        /**
         * Read cookie data and return state value for the ad stored in this data
         * @method getState
         * @param {String} stateId
         */
        getState: function (stateId) {
            var eventSaveState = Event.on(EVENT_COOKIE_GETDATA_COMPLETE, function (e) {
                var result = {
                    status: e.status,
                    value: ''
                };
                var cookieData = e.data;
                eventSaveState.remove();

                if (Lang.isObject(cookieData) && Lang.isObject(cookieData.states)) {
                    result.value = cookieData.states[stateId];
                }

                Event.fire(EVENT_GET_STATE_COMPLETE, result);
            });
            this.get();
        },

        /**
         * Saving event for ad in cookie.
         * Searching for eventname in ad information in current cookie data.
         * If the eventname is not exist inside ad information then add it with value 0.
         * If the eventname is exist inside ad information then adding 1 to its value.
         * Finally saving the cookie
         *
         * @method updateAdEvent
         * @param {String} eventName name of the event to be save
         */
        updateAdEvent: function (eventName) {
            var root = this;

            /* istanbul ignore next */
            var eventSaveAdEvent = Event.on(EVENT_COOKIE_GETDATA_COMPLETE, function (e) {
                var unique = true;
                var cookieData = e.data;
                eventSaveAdEvent.remove();

                if (cookieData === 0) {
                    cookieData = {};
                }

                if (!Lang.isObject(cookieData.events)) {
                    cookieData.events = {};
                }

                if (cookieData.events[eventName] === undefined) {
                    cookieData.events[eventName] = 0;
                    unique = true;
                } else {
                    cookieData.events[eventName] += 1;
                    unique = false;
                }

                root.set(cookieData);

                Event.fire(EVENT_UPDATE_AD_EVENT_COMPLETE, {
                    unique: unique
                });
            });

            this.get();
        },

        /**
         * Register cookie with SafeFrame - once the framework determines that the ad is running in a SafeFrame
         * This function will be called when 'register' or 'register-update' events are fired from the SafeFrame API
         * Upon firing those events, this function will be called to attempt a cookie get.
         * This also resets the 'cookie' API to use from StandardCookie to SafeFrameCookie
         * @method register
         * @private
         * @param {Object} data sent from the SafeFrame API via the notify function.
         *
         */
        register: function (data) {
            /* Only execute this code if 'key' is sent in from SafeFrame API */
            /* unit test: elses ignored due to test/framework restrictions */
            /* istanbul ignore else */
            if ('key' in data) {
                /*@<*/
                debug.log('[ ACT_cookie.js ]: Darla is available, let use it');
                /*>@*/

                // update reference of key and yAPI

                /* Keep a local reference to the SD Key */
                safeFrameKey = data.key;

                /* Keep a local reference to the yAPI */
                yAPI = data.yAPI || null;

                this.cookie = safeframeCookie;

                /* We should only read Darla cookie once, so if we are on pending or finish then don't read Darla cookie*/
                /* istanbul ignore else */
                if (safeframeCookie.pending === null) {
                    /* listen to data returned form darla */
                    /* istanbul ignore else */
                    if (Lang.isObjectEmpty(eventReadCookie)) {
                        eventReadCookie = Event.on(EVENT_SDARLA_READ_COOKIE, this.cookie.readSFCookie, null, this);
                        eventReadCookieFailed = Event.on(EVENT_SDARLA_FAIL, this.cookie.readSFCookie, null, this);
                    }

                    /**
                     * The getSFCookie function will fire an 'internal' event which no one needs to listen to
                     * So calling it right away is fair game - also speeds things up a big.
                     * 'get' should be called with the DEFAULT_COOKIE_NAME
                     */
                    this.cookie.getSFCookie(this.DEFAULT_COOKIE_NAME);
                }
            }
        },

        /**
         * Simple helper function to read the cookie data
         * @method read
         * @return {Object} Set of data that was stored in the cookie.
         * @public
         */
        read: function () {
            var readCookie = this.cookie.get(this.DEFAULT_COOKIE_NAME);

            if (!readCookie) {
                return {};
            }
            return readCookie;
        },

        /**
         * Clean the cookie data by removing stale entries
         * @method clean
         * @public
         */
        clean: function () {
            // var cookie = this.cookie;
            var fullCookie = this.read();
            var date = new Date().getTime();
            var itor = null;
            var count = 0;
            // var path = this.DEFAULT_PATH;
            // var domain = this.DEFAULT_DOMAIN;
            // var default_cookieName = this.DEFAULT_COOKIE_NAME;

            if (typeof fullCookie === 'object') {
                for (itor in fullCookie) {
                    if (fullCookie[itor].expires <= date) {
                        delete fullCookie[itor];
                    } else {
                        count++;
                    }
                }
                /*@<*/
                debug.log('[ ACT_cookie.js ]: set cookie called inside clean function', count);
                /*>@*/
                if (count > 0) {
                    // cookie.set(default_cookieName, fullCookie, domain, path);
                } else {
                    // cookie.remove(default_cookieName, domain, path);
                }
            }
            return fullCookie;
        },

        /**
         * Remove the current cookie from the set. Deleting it completely.
         * @method remove
         * @public
         * @return {Boolean}
         */
        remove: function () {
            var fullCookie = this.read();
            var path = this.DEFAULT_PATH;
            var domain = this.DEFAULT_DOMAIN;
            var expires = this.DEFAULT_EXPIRES;
            var cookieName = this.COOKIE_NAME;
            var defaultCookieName = this.DEFAULT_COOKIE_NAME;

            if (typeof fullCookie === 'object' && cookieName in fullCookie) {
                fullCookie[cookieName] = null;
                delete fullCookie[cookieName];
            }

            /*@<*/
            debug.log('[ ACT_cookie.js ]: set cookie called inside remove function');
            /*>@*/
            this.cookie.set(defaultCookieName, fullCookie, domain, expires, path);
            return true;
        },

        /**
         * Set the cookie - get a cookie name (key) and the data (value)
         * @param {Object} cookieData data
         * @param {Function} callback A function to be called after cookie is saved
         * @method set
         * @public
         */
        set: function (cookieData, callback) {
            var domain = this.DEFAULT_DOMAIN;
            var expires = this.DEFAULT_EXPIRES;
            var path = this.DEFAULT_PATH;
            var defaultCookieName = this.DEFAULT_COOKIE_NAME;
            var cookieName = this.COOKIE_NAME;
            var fullCookie = this.clean(domain, path);
            var expire = new Date();
            var eventListener;

            expire = expire.getTime() + DEFAULT_EXPIRES;

            if (fullCookie.hasOwnProperty(cookieName)) {
                fullCookie[cookieName].data = cookieData;
            } else {
                fullCookie[cookieName] = {
                    expires: expire,
                    data: cookieData
                };
            }
            /* istanbul ignore next */
            eventListener = Event.on(EVENT_COOKIE_SAVED, function (data) {
                eventListener.remove();

                if (Lang.isFunction(callback)) {
                    callback(data);
                }
            });

            this.cookie.set(defaultCookieName, fullCookie, domain, expires, path);
            return true;
        },

        /**
         * Get Cookie Helper function - given a full cookie, pick out the cookie name required for the ad and fire off
         * a EVENT_COOKIE_GETDATA_COMPLETE event.
         * @method getHelper
         * @param {Object} fullCookie Containing all the cookie data received. - { 'status': COOKIE_STATUS_OK, 'data': safeframeCookie.data });
         * @private
         */
        getHelper: function (fullCookie) {
            var cookieName = this.COOKIE_NAME;
            var cookieData = 0;
            var status = fullCookie.status || COOKIE_STATUS_OK;
            var cookieDataPayload;

            if (Lang.isObject(fullCookie) && fullCookie.status === COOKIE_STATUS_OK) {
                fullCookie = fullCookie.data;
                if (Lang.isObject(fullCookie) && fullCookie.hasOwnProperty(cookieName)) {
                    /* then we're updating the cookie */
                    cookieData = fullCookie[cookieName].data;
                }
            }

            /* Remove the cookie ready event - since we've already fired it once to get here */
            if (this.cookie_ready_event) {
                this.cookie_ready_event.remove();
            }
            /* A little easier to augment this, and log it if need be. */
            cookieDataPayload = { status: status, data: cookieData };

            /*@<*/
            debug.log('[ ACT_cookie.js ]: cookieDataPayload sent off in getdata:complete:', cookieDataPayload);
            /*>@*/
            Event.fire(EVENT_COOKIE_GETDATA_COMPLETE, cookieDataPayload);
        },

        /**
         * Get the cookie
         * @return {Object} The cookie data in an object OR 0 if no cookie has been stored
         * @method get
         * @public
         */
        get: function () {
            var fullCookie = this.read();

            if (fullCookie === COOKIE_STATUS_PENDING) {
                /* Pending a cookie response - SafeFrame is still grabbing the cookies for us. */
                this.cookie_ready_event = Event.on(EVENT_COOKIE_READY, this.getHelper, null, this);
            } else {
                /*
                 * Since Status is no longer pending, we don't need to listen for an event and rather just go
                 * full out and call the helper directly
                 *
                 * getHelper expect {status: [cookie_status], data: [cookieData]}
                 */
                this.getHelper({
                    status: this.test() ? COOKIE_STATUS_OK : COOKIE_STATUS_NO_COOKIE,
                    data: fullCookie
                });
            }
        },

        /**
         * Expose cookie helper methods
         * @private
         */
        cookie: standardCookie
    };

    return cookie;
});
