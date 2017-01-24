/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
ACT.define('Base', [/*@<*/'Debug', /*>@*/ 'Event', 'Cookie', 'Lang', 'Tracking', 'SecureDarla', 'StandardAd', 'ActionsQueue', 'CustomData', 'IO', 'Environment', 'UA', 'Util'], function (ACT) {
    'use strict';

    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Cookie = ACT.Cookie;
    var Tracking = ACT.Tracking;
    var SecureDarla = ACT.SecureDarla;
    var CustomData = ACT.CustomData;
    var ActionsQueue = ACT.ActionsQueue;
    var UA = ACT.UA;
    var IO = ACT.IO;
    var Util = ACT.Util;

    /*@<*/
    var debug = ACT.Debug;
    /*>@*/

    /**
    * Base - starts up the basic ad framework
    *
    *     var conf = {
    *         conf: {
    *             tracking: {
    *                 rd:'',
    *                 z1:'',
    *                 rB:'',
    *                 beap:[],
    *                 id: ''
    *             },
    *             template: {
    *                 name: 'name_of_ad',
    *                 type: 'type_of_ad',
    *                 format: 'format_of_ad',
    *                 width: 300,
    *                 height: 250
    *             },
    *             inputData:{
    *                type:'JSON',
    *                id: 'myYT',
    *                dataFeed: 'json_feed.js'
    *            },
    *            customData:{
    *                 "layers.mpu.width" : '500px'
    *             }
    *         },
    *         superConf: 'mazda-ad-20150401',
    *         extend:{
    *             init: function () { ... },
    *             ad_init: function () { ... },
    *             happy: function () { ... }
    *         }
    *     }
    *
    * @class Base
    * @module Base
    * @requires event, cookie, lang, tracking, securedarla, standardad, actionsqueue
    * @param config {Object} -
    *   conf: Basic configuration overwrites/definitions ( tracking, cookie, etc )
    *   superConf: A name of the super conf that we need to load in
    *   inputData: Inject dynamic data and use it in shortcuts to override configuration object.
    *   customData: Shortcuts to overwrite super configuration attributes
    *   extend : Set of functions to execute - init, ad_init etc.
    *
    */
    function Base(config) {
        var conf = config.conf || {};
        var extend = config.extend || {};
        var root = this;
        // super conf is a string name of the super config we need to check against.
        var superConf = config.superConf || null;
        /*@<*/
        debug.log('[ ACT_base.js ]: instantiated with config', config);
        /*>@*/

        Lang.merge(this, extend);
        Lang.merge(this.config, conf);

        /* Store reference for future use and loading */
        this.config.superConf = superConf;

        if (superConf !== null) {
            ACT.requireConfig(config.superConf);
            this.config.standardAd = true;
        } else {
            this.config.standardAd = false;
        }

        ACT.ready(function () {
            root.start();
        });
    }

    /**
    * @attribute ATTRS
    * @type {{NAME: string, version: string}}
    * @initOnly
    */
    Base.ATTRS = {
        NAME: 'Base',
        version: '1.0.41'
    };

    Base.prototype = {

        /**
        * Basic Config - will be removed here and config will be defined as empty obj.
        * @property config
        * @type Object
        */
        config: { },

        /**
        * Start up the Standard Ad if the superConf is supplied.
        * @method register
        * @private
        * @static
        */
        register: function () {
            var conf = this.config;
            var root = this;
            var comingData;
            var IOLoad;
            var superConfMerged;

            if (this.config.standardAd === true) {
                // if the custom Data
                if (conf.customData && !Lang.isObjectEmpty(conf.customData)) {
                    // if there any comming input
                    if (conf.inputData) {
                        /*@<*/
                        debug.log('[ ACT_base.js ] comingData', comingData);
                        /*>@*/
                        // loaded event
                        IOLoad = Event.on('IO:load:done', function (data) {
                            var customDataWithComing;
                            var onEventSuperConfMerged;
                            IOLoad.remove();
                            /* istanbul ignore else */
                            if (conf.inputData.type === 'JSON') {
                                customDataWithComing = CustomData.inputOntoCustomDataJSON(conf.inputData.id, conf.customData, data.response);
                            }
                            onEventSuperConfMerged = CustomData.map(customDataWithComing, ACT.getConfig(conf.superConf));
                            root.config = Lang.merge(conf, onEventSuperConfMerged);
                            root.loadStandardAd();
                        });
                        // load input
                        comingData = new IO(conf.inputData);
                    } else {
                        superConfMerged = CustomData.map(conf.customData, ACT.getConfig(conf.superConf));
                        root.config = Lang.merge(conf, superConfMerged);
                        root.loadStandardAd();
                    }
                } else {
                    root.config = Lang.merge(conf, ACT.getConfig(conf.superConf));
                    root.loadStandardAd();
                }
            } else {
                /* We can pull provided pixels here. */
                root.trackPixel(conf.pixels);
            }
        },

        /**
        * A wrapper for StandardAd initialization. This is here to optimize the 'register' function.
        * @method loadStandardAd
        * @private
        * @static
        */
        loadStandardAd: function () {
            var root = this;
            var standard;
            var config = root.config;
            var forceEnv = {};
            var ev;
            /*@<*/
            debug.log('[ ACT_base.js ] Loading Standard Ad with the following Config Object : ', root.config);
            /*>@*/
            standard = new ACT.StandardAd({ config: config, parent: root });
            root.config.standardAdRef = standard;

            /* Technically 'forceEnv' is always defined, because Environment requires it to be and errors without it. */
            /* istanbul ignore else */
            if (config.hasOwnProperty('baseConfig') && config.baseConfig.hasOwnProperty('forceEnv')) {
                forceEnv = config.baseConfig.forceEnv;
            }

            ev = new ACT.Environment({
                forceEnv: forceEnv
            });

            this.currentEnv = ev.checkEnv();
            this.trackPixel(config.pixels);
        },

        /**
        * Starts up the ad, instantiating all the necessary key players for an ad to work
        * @method start
        * @public
        * @static
        */
        start: function () {
            var conf = this.config;

            this.loadListeners();

            /* istanbul ignore next */
            this.actionsQueue = new ActionsQueue({});
            this.cookie = new Cookie(conf.cookie || null, this);
            this.tracking = new Tracking(conf.tracking || null, this);
            this.secureDarla = new SecureDarla(this.config, this);

            /*@<*/
            debug.info('[ ACT_base.js ] SecureDarla INITIALIZE PASSED - NOW START AD STANDARD');
            /*>@*/

            this.init();
        },

        /**
         * A function to fire pixels
         * @param pixels
         */
        trackPixel: function (pixels) {
            var env;
            var traverse = pixels;
            var itor;
            var len;
            if (this.hasOwnProperty('currentEnv')) {
                env = this.currentEnv;
            } else {
                /* istanbul ignore else */
                if (UA.isHtml5Supported === true) {
                    env = 'html';
                } else {
                    env = 'backup';
                }
            }

            /*@<*/
            debug.info('[ ACT_base.js ] Ready to fire pixels from env: ', env);
            /*>@*/

            if (Lang.isObject(pixels)) {
                /* Traverse pixels */
                traverse = pixels.hasOwnProperty(env) ? pixels[env] : pixels;
            }

            if (Lang.isArray(traverse)) {
                for (itor = 0, len = traverse.length; itor < len; itor++) {
                    /*@<*/
                    debug.info('[ ACT_base.js ]: Firing pixel : ', traverse[itor]);
                    /*>@*/
                    Util.pixelTrack(traverse[itor]);
                }
            } /* istanbul ignore else */ else if (Lang.isString(traverse) && traverse.length > 3) {
                Util.pixelTrack(traverse);
            }
        },

        /**
        * A method that places the 'ad_init' function `onload`
        * @method loadListeners
        * @public
        * @static
        */
        loadListeners: function () {
            /* Once 'domready' event is fully available, see about moving these from load to domready. */
            this.adInitEvent = Event.on('load', this.ad_init, window, this);
            this.registerEvent = Event.on('load', this.register, window, this);
        },

        /**
         * An empty function to be overwritten via 'extend'
         * @method init
         * @public
         */
        init: function () {
            /* overwritable */
        },

        /**
         * An empty function to be overwritten via 'extend'
         * @method ad_init
         * @public
         */
        ad_init: function () {
            /* overwritable */
        }
    };

    function startupBase(config) {
        return new Base(config);
    }

    startupBase.ATTRS = Base.ATTRS;

    return startupBase;
});
