/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * @module ContentVideoFlash
 * @main ContentVideoFlash
 * @class ContentVideoFlash
 * @requires Event, Lang, Class, Capability, SWFBridge, ContentSwf
 * @global
 */
ACT.define('ContentVideoFlash', [/*@<*/'Debug', /*>@*/ 'Event', 'Lang', 'Class', 'Capability', 'SWFBridge', 'ContentSwf'], function (ACT) {
    'use strict';

    /* Constants */
    var Event = ACT.Event;
    var Lang = ACT.Lang;
    var Class = ACT.Class;
    var Capability = ACT.Capability;
    var SWFBridge = ACT.SWFBridge;
    var ContentSwf;

    /**
     * Constant values
     */
    var EVENT_VIDEO_START = 'video:start';
    var EVENT_VIDEO_STOP = 'video:stop';
    var EVENT_VIDEO_PLAY = 'video:play';
    var EVENT_VIDEO_PAUSE = 'video:pause';
    var EVENT_VIDEO_SOUNDON = 'video:soundOn';
    var EVENT_VIDEO_SOUNDOFF = 'video:soundOff';
    var EVENT_GLOBAL_ACTION_COMPLETE = 'complete:action';
    // var EVENT_GLOBAL_STOP_CONTENT = 'STOP_CONTENT';

    var videoEvents = [{
        type: 'videoStart',
        argument: {
            videoId: {
                name: 'videoId',
                test: function (vid) {
                    return Lang.isString(vid);
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
            Event.fire(EVENT_VIDEO_START, {
                videoId: args.videoId
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'videoStop',
        argument: {
            videoId: {
                name: 'videoId',
                test: function (vid) {
                    return Lang.isString(vid);
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
            Event.fire(EVENT_VIDEO_STOP, {
                videoId: args.videoId
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'videoPlay',
        argument: {
            videoId: {
                name: 'videoId',
                test: function (vid) {
                    return Lang.isString(vid);
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
            Event.fire(EVENT_VIDEO_PLAY, {
                videoId: args.videoId
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'videoPause',
        argument: {
            videoId: {
                name: 'videoId',
                test: function (vid) {
                    return Lang.isString(vid);
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
            Event.fire(EVENT_VIDEO_PAUSE, {
                videoId: args.videoId
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'videoSoundOn',
        argument: {
            videoId: {
                name: 'videoId',
                test: function (vid) {
                    return Lang.isString(vid);
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
            Event.fire(EVENT_VIDEO_SOUNDON, {
                videoId: args.videoId
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'videoSoundOff',
        argument: {
            videoId: {
                name: 'videoId',
                test: function (vid) {
                    return Lang.isString(vid);
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
            Event.fire(EVENT_VIDEO_SOUNDOFF, {
                videoId: args.videoId
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }];

    var DEFAULT_VIDEO_FLASH_VARS = {
        videoPath: '',
        autoplay: '',
        videoMuted: '',
        width: '',
        height: '',
        x: '',
        y: '',
        controls: ''
    };

    var DEFAULT_VIDEO_EVENT_ACTIONS = {
        start: '',
        stop: '',
        replay: '',
        pause: '',
        play: '',
        soundon: '',
        soundoff: '',
        '25percent': '',
        '50percent': '',
        '75percent': '',
        complete: ''
    };

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('ContentVideoFlash: loaded');
    /*>@*/

    /**
     *
     * @class ContentVideoFlash
     * @extends Base
     * @constructor
     */
	function ContentVideoFlash(config) {
        this.init(config);
    }

    ContentVideoFlash.ATTRS = {
        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'ContentVideoFlash',

        /**
         * @attribute version
         * @type String
         */
        version: '1.1.0',

        /**
         * @attribute configObject
         * @type Object
         */
        configObject: {},

        /**
         * @attribute videoId
         * @type String
         */
        videoId: null,

        /**
         * @attribute node
         * @type HTMLElement
         */
        node: null
    };

	// TODO: See if attachAction can be factored into Class as it's used everywhere.
    /**
     * Attach action for an event
     * @method attachAction
     * @private
     * @param {Object} event, object event that will be attached
     */
    function attachAction(event) {
        Event.on('videoflash:' + event.eventType, function () {
            Event.fire('add:actions', event.actions);
        });
        /*@<*/
        Debug.log('ContentVideoFlash: Attaching video event ' + event.eventType);
        /*>@*/
    }

	// TODO: See if subscribeVideoEvents can be generalized to be used by all capabilities via Class.
    /**
     * Loop all video events and subscribe them
     * @method subscribeVideoEvents
     * @private
     * @param {Object} config, global information of the video-flash context
     */
    function subscribeVideoEvents(config) {
        var events = config.hasOwnProperty('eventActions') ? config.eventActions : {};
        var name;
        for (name in events) {
            /* istanbul ignore else */
            if (events.hasOwnProperty(name) && DEFAULT_VIDEO_EVENT_ACTIONS.hasOwnProperty(events[name].eventType)) {
                attachAction(events[name]);
            }
        }
    }

    /**
     * Create a flashVars object
     * @method flashVars
     * @private
     * @param {Object} config, global information of the video-flash context
     * @param {Object} videoFlashConfig, information of the video-flash context
     */
    function flashVars(videoFlashConfig) {
        var flashVarsSet = {};
        var name;
        var value;
        for (name in videoFlashConfig) {
            /* istanbul ignore else */
            if (videoFlashConfig.hasOwnProperty(name) && DEFAULT_VIDEO_FLASH_VARS.hasOwnProperty(name)) {
                value = videoFlashConfig[name];
                flashVarsSet[name] = value;
            }
        }
        return flashVarsSet;
    }

    /**
     * Create a node
     * @method getContent
     * @private
     * @param {String} env Environment for rendering content such as html/flash/backup
     * @param {String} orientation Orientation of current device such as landscape and portraits for mobile
     */
    function getContent(config, env, orientation) {
        var vConfig = config.hasOwnProperty('videoFlashConfig') ? config.videoFlashConfig : {};
        var fvars = flashVars(vConfig, config);
        var width = vConfig.hasOwnProperty('width') ? vConfig.width : '100%';
        var height = vConfig.hasOwnProperty('height') ? vConfig.height : '100%';
        var node;
        subscribeVideoEvents(config);
        ContentSwf = new ACT.ContentSwf({
            id: config.id + '_swf',
            swfConfig: {
                width: width,
                height: height,
                src: 'https://s.yimg.com/cv/ae/global/actjs/ACTPlayer1439433292.swf',
                flashvars: fvars
            }
        });
        node = ContentSwf.getContent(env, orientation).node;
        return node;
    }

    /* Public methods */
    Lang.extend(ContentVideoFlash, [Capability, Class], {

        /**
         * Override method from class Class, auto initiate method
         * @method initializer
         * @param {object} config configObject which is passed to initiate the instance
         */
        initializer: function (config) {
            // set videoId
            this.set('videoId', config.id);

            // attach config
            this.set('configObject', config);

            // register all events
            Event.fire('register:Actions', videoEvents);

            // attach events
            this.initializeListeners();
        },

        /**
         * Function to initialize event listeners for this instance
         * @method initializeListeners
         */
        initializeListeners: function () {
            var root = this;
            root.addEventListeners(
                Event.on(EVENT_VIDEO_START, function (eventData) {
                    if (root.get('videoId') === eventData.videoId) {
                        root.start();
                    }
                }),
                Event.on(EVENT_VIDEO_STOP, function (eventData) {
                    if (root.get('videoId') === eventData.videoId) {
                        root.stop();
                    }
                }),
                Event.on(EVENT_VIDEO_PLAY, function (eventData) {
                    if (root.get('videoId') === eventData.videoId) {
                        root.play();
                    }
                }),
                Event.on(EVENT_VIDEO_PAUSE, function (eventData) {
                    if (root.get('videoId') === eventData.videoId) {
                        root.pause();
                    }
                }),
                Event.on(EVENT_VIDEO_SOUNDON, function (eventData) {
                    if (root.get('videoId') === eventData.videoId) {
                        root.soundOn();
                    }
                }),
                Event.on(EVENT_VIDEO_SOUNDOFF, function (eventData) {
                    if (root.get('videoId') === eventData.videoId) {
                        root.soundOff();
                    }
                })
            );
        },

        /**
         * Function to be called when the instance is destroyed
         * @method destructor
         */
        destructor: function () {
            var node = this.get('node');

            /* Remove the node from the DOM */
            /* istanbul ignore else */
            if (node && node.parentNode) { // Embed does not work with HTMLElement
                node.parentNode.removeChild(node);
            }

            ContentSwf.destroy();

            /* Unregistered context */
            SWFBridge.unregister(node.id);
        },

        /**
         * @method getContent
         * @param {String} env Environment for rendering content such as html/flash/backup
         * @param {String} orientation Orientation of current device such as landscape and portraits for mobile
         * @return {Object}
         */
        getContent: function (env, orientation) {
            var config = this.get('configObject');
            var node = getContent(config, env, orientation);

            this.set('node', node);

            SWFBridge.register(this, node.id);

            return {
                node: node
            };
        },

        /**
         * Start the video
         * @method start
         */
        start: function () {
            var node = this.get('node');
            SWFBridge.callSWF(node, 'startVideo');
        },

        /**
         * Stop the video
         * @method stop
         */
        stop: function () {
            var node = this.get('node');
            SWFBridge.callSWF(node, 'stopVideo');
        },

        /**
         * Play the video
         * @method play
         */
        play: function () {
            var node = this.get('node');
            SWFBridge.callSWF(node, 'videoResume');
        },

        /**
         * Pause the video
         * @method pause
         */
        pause: function () {
            var node = this.get('node');
            SWFBridge.callSWF(node, 'videoPause');
        },

        /**
         * Turn on the sound of the video
         * @method soundOn
         */
        soundOn: function () {
            var node = this.get('node');
            SWFBridge.callSWF(node, 'videoUnmute');
        },

        /**
         * Turn off the sound of the video
         * @method soundOff
         */
        soundOff: function () {
            var node = this.get('node');
            SWFBridge.callSWF(node, 'videoMute');
        },

        /**
         * @method eventHandler
         */
        eventHandler: function (id, event) {
            if (event.hasOwnProperty('type')) {
                Event.fire(event.type, {
                    id: id
                });
                /* istanbul ignore else */
            } else if (event.hasOwnProperty('actions')) {
                Event.fire('add:actions', event.actions);
            }
        }
    });

    return ContentVideoFlash;
});
