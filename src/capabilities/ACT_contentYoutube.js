/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * The 'ContentYoutube' is a capability made to generate a 'DIV' tag use as a container for the Youtube player.
 *
 * Available 'actions':
 * - youtubeStart
 * - youtubeStop
 * - youtubePlay
 * - youtubePause
 * - youtubeMute
 * - youtubeUnmute
 *
 * Available 'triggers':
 * - pause
 * - play
 * - complete
 * - error
 * - ready
 * - start
 * - 25percent
 * - 50percent
 * - 75percent
 *
 * Example of 'SuperConf' use case:
 *
 *      {
 *          id: 'youtube_player',
 *          type: 'content-youtube',
 *          classNode: 'youtube_class',
 *          env: ['html', 'flash'],
 *          css: {
 *              width:'352px',
 *              height:'198px'
 *          },
 *          youtubeConfig:{
 *              width: '100%',
 *              height: '100%',
 *              videoId: 'GQQMLE4FuIQ',
 *              suggestedQuality: 'default',
 *              playerVars: {
 *                  autoplay: 1,
 *                  controls: 1,
 *                  color: 'white',
 *                  disablekb: 1,
 *                  enablejsapi: 1,
 *                  fs: 1,
 *                  iv_load_policy: 3,
 *                  modestbranding: 0,
 *                  rel: 0,
 *                  showinfo: 0,
 *                  loop: 0
 *              }
 *          },
 *          eventActions: [{
 *              eventType: 'start',
 *              actions: [
 *                  {
 *                      type: 'track',
 *                      label: 'start'
 *                  }
 *              ]
 *          }]
 *      }
 *
 * @module ContentYoutube
 * @main ContentYoutube
 * @class ContentYoutube
 * @requires Dom, lang, Event, Class, Capability
 * @global
 */
ACT.define('ContentYoutube', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang', 'Event', 'Class', 'Capability'], function (ACT) {
    'use strict';

    /* Shorthand */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Class = ACT.Class;
    var Capability = ACT.Capability;

    /**
     * Constant values
     */
    var QUEUE = [];
    var READY = false;
    var EXIST = false;
    var EVENT_YOUTUBE_START = 'youtube:start';
    var EVENT_YOUTUBE_STOP = 'youtube:stop';
    var EVENT_YOUTUBE_PLAY = 'youtube:play';
    var EVENT_YOUTUBE_PAUSE = 'youtube:pause';
    var EVENT_YOUTUBE_SOUNDON = 'youtube:soundOn';
    var EVENT_YOUTUBE_SOUNDOFF = 'youtube:soundOff';
    var EVENT_GLOBAL_ACTION_COMPLETE = 'complete:action';
    var EVENT_GLOBAL_STOP_CONTENT = 'STOP_CONTENT';
    var DEFAULT_CONFIG = {
        width: '100%',
        height: '100%',
        videoId: 'GQQMLE4FuIQ',
        suggestedQuality: 'default',
        playerVars: {
            autoplay: 1,
            controls: 1,
            color: 'white',
            disablekb: 1,
            enablejsapi: 1,
            fs: 1,
            iv_load_policy: 3,
            modestbranding: 0,
            rel: 0,
            showinfo: 0,
            loop: 0
        }
    };

    var DEFAULT_YOUTUBE_EVENT_ACTIONS = {
        pause: 'pause',
        play: 'play',
        complete: 'complete',
        error: 'error',
        ready: 'ready',
        start: 'start',
        '25percent': '25percent',
        '50percent': '50percent',
        '75percent': '75percent'
    };

    var contentActions = [{
        type: 'youtubeStart',
        argument: {
            to: {
                name: 'to',
                test: function (to) {
                    return Lang.isString(to);
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
            Event.fire(EVENT_YOUTUBE_START, {
                to: args.to
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'youtubeStop',
        argument: {
            to: {
                name: 'to',
                test: function (to) {
                    return Lang.isString(to);
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
            Event.fire(EVENT_YOUTUBE_STOP, {
                to: args.to
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'youtubePlay',
        argument: {
            to: {
                name: 'to',
                test: function (to) {
                    return Lang.isString(to);
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
            Event.fire(EVENT_YOUTUBE_PLAY, {
                to: args.to
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'youtubePause',
        argument: {
            to: {
                name: 'to',
                test: function (to) {
                    return Lang.isString(to);
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
            Event.fire(EVENT_YOUTUBE_PAUSE, {
                to: args.to
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'youtubeUnmute',
        argument: {
            to: {
                name: 'to',
                test: function (to) {
                    return Lang.isString(to);
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
            Event.fire(EVENT_YOUTUBE_SOUNDON, {
                to: args.to
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'youtubeMute',
        argument: {
            to: {
                name: 'to',
                test: function (to) {
                    return Lang.isString(to);
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
            Event.fire(EVENT_YOUTUBE_SOUNDOFF, {
                to: args.to
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }];

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_contentYoutube.js ] ContentYoutube Loaded');
    /*>@*/

    window.onYouTubeIframeAPIReady = function () {
        var key;
        READY = true;

        for (key in QUEUE) {
            if (QUEUE.hasOwnProperty(key) && Lang.isFunction(QUEUE[key])) {
                QUEUE[key]();
            }
        }

        QUEUE.length = 0;
    };

    /**
     * @constructor
     */
    function ContentYoutube(config) {
        this.init(config);
        // ContentYoutube.superclass.constructor.apply(this, arguments);
    }

    ContentYoutube.ATTRS = {

        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'ContentYoutube',

        /**
         * @attribute version
         * @type String
         */
        version: '1.0.22',

        /**
         * @attribute configObject
         * @type Object
         */
        configObject: {},

        /**
         * @attribute node
         * @type HTMLElement
         */
        node: null,

        /**
         * @attrbite store
         * @type array
         */
        store: []
    };

    /* Private methods */
    /**
     * Create youtube instance and enclose logic
     *
     * @method renderYoutube
     * @private
     * @param {Object} config
     * @param {Array} store
     * @param {Object} node
     * @return {Function}
     */
    function renderYoutube(config, store, node) {
        var youtubeConfig = Lang.merge(DEFAULT_CONFIG, (Lang.isObject(config.youtubeConfig)) ? config.youtubeConfig : {});

        return /* istanbul ignore next */ function () {
            // Default state
            var states = {
                start: false,
                '25percent': false,
                '50percent': false,
                '75percent': false
            };
            var player;
            var time;
            var duration;
            var fireStore = function (name) {
                if (Lang.isFunction(store[name])) {
                    store[name]();
                }
            };

			function checkAndTrackQuartile(state) {
				states[state] = true;
				fireStore(state);
			}

            // Fake time update
            function timeUpdate() {
                config.requestID = Lang.requestAnimFrame(timeUpdate);

                if (!player || !Lang.isFunction(player.getCurrentTime) || !Lang.isFunction(player.getDuration)) {
                    return;
                }

                time = player.getCurrentTime();
                duration = player.getDuration();

                switch (Math.floor(time)) {
                    case Math.floor(duration * 0.25):
                        if (!states['25percent']) {
                            checkAndTrackQuartile('25percent');
                        }
                        break;
                    case Math.floor(duration * 0.50):
                        if (!states['50percent']) {
                            checkAndTrackQuartile('50percent');
                        }
                        break;
                    case Math.floor(duration * 0.75):
                        if (!states['75percent']) {
                            checkAndTrackQuartile('75percent');
                        }
                        break;
                    default:
                        break;
                }
            }

            function playAction() {
                fireStore('play');
                if (!states.start) {
                    checkAndTrackQuartile('start');
                }
                config.requestID = Lang.requestAnimFrame(timeUpdate);
            }

            function pauseAction() {
                Lang.cancelAnimFrame(config.requestID);
                fireStore('pause');
            }

            function completeAction() {
                states.start = false;
                states['25percent'] = false;
                states['50percent'] = false;
                states['75percent'] = false;

                Lang.cancelAnimFrame(config.requestID);
                fireStore('complete');
            }

            // Dispatcher for listeners
            youtubeConfig.events = {
                onReady: function () {
                    fireStore('ready');
                },
                onError: function () {
                    fireStore('error');
                },
                onStateChange: function (event) {
                    switch (event.data) {
                        case 0: completeAction(); break;
                        case 1: playAction(); break;
                        case 2: pauseAction(); break;
                        default:
                            break;
                    }
                }
            };
            // Player instance
            player = new window.YT.Player(node, youtubeConfig);

            config.player = player;
        };
    }
    /**
     * Generate the node youtube
     *
     * @method renderNodeYoutube
     * @private
     * @param {Object} config
     * @return {HTMLElement}
     */
    function renderNodeYoutube(config, store) {
        // Parent node for actjs control
        var node = Dom.nodeCreate('<div id="' + config.id + '"></div>').firstChild;
        var render;
        var head;
        var script;
        // Youtube node for youtube control
        var youtubeNode = Dom.nodeCreate('<div></div>').firstChild;

        // Youtube node can be ready for youtube before scaffolding occurs
        node.appendChild(youtubeNode);

        // Render youtube node and enclose logic
        render = renderYoutube(config, store, youtubeNode);

        // Append the youtube library only once
        if (!EXIST) {
            head = document.head || document.getElementsByTagName('head')[0];
            script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.type = 'text/javascript';
            head.appendChild(script);

            EXIST = true;
        }

        if (!READY) {
            QUEUE.push(render);
        } else {
            render();
        }

        return node;
    }

    /**
     * Attach action for to a local store
     * @method attachAction
     * @private
     * @param {Object} event
     * @param {Array} store
     */
    function attachAction(event, store) {
        store[DEFAULT_YOUTUBE_EVENT_ACTIONS[event.eventType]] = function () {
            Event.fire('add:actions', event.actions);
        };
    }

    /**
     * Loop all video events and subscribe them
     * @method subscribeActionsToVideoEvents
     * @private
     * @param {Object} config
     * @param {Array} store
     * @return {Array} store
     */
    function subscribeActionsToVideoEvents(config, store) {
        var events = config.eventActions;
        var name;

        if (!Lang.isObject(events)) {
            return store;
        }

        for (name in events) {
            if (events.hasOwnProperty(name) && DEFAULT_YOUTUBE_EVENT_ACTIONS.hasOwnProperty(events[name].eventType)) {
                attachAction(events[name], store);
            }
        }

        return store;
    }

    /* Public methods */
    Lang.extend(ContentYoutube, [Capability, Class], {
        /*@<*/
        /**
         * Testing purpose only
         */
        subscribeActionsToVideoEvents: subscribeActionsToVideoEvents,
        /*>@*/

        /**
         * Function auto initiated when the class is instantiated
         *
         * @method initializer
         * @public
         * @param {Object} config
         */
        initializer: function (config) {
            // Save config object
            this.set('configObject', config);

            // Register all events
            Event.fire('register:Actions', contentActions);

            // Create listeners actions
            this.initializeListeners();
        },

        /**
         * Function to initialize event listeners for this instance
         *
         * @method initializeListeners
         */
        initializeListeners: function () {
            var root = this;

            root.addEventListeners(
                Event.on(EVENT_YOUTUBE_START, function (eventData) {
                    if (root.get('id') === eventData.to) {
                        root.start();
                    }
                }),
                Event.on(EVENT_YOUTUBE_STOP, function (eventData) {
                    if (root.get('id') === eventData.to) {
                        root.stop();
                    }
                }),
                Event.on(EVENT_YOUTUBE_PLAY, function (eventData) {
                    if (root.get('id') === eventData.to) {
                        root.play();
                    }
                }),
                Event.on(EVENT_YOUTUBE_PAUSE, function (eventData) {
                    if (root.get('id') === eventData.to) {
                        root.pause();
                    }
                }),
                Event.on(EVENT_YOUTUBE_SOUNDON, function (eventData) {
                    if (root.get('id') === eventData.to) {
                        root.soundOn();
                    }
                }),
                Event.on(EVENT_YOUTUBE_SOUNDOFF, function (eventData) {
                    if (root.get('id') === eventData.to) {
                        root.soundOff();
                    }
                }),
                Event.on(EVENT_GLOBAL_STOP_CONTENT, function () {
                    root.stop();
                })
            );
        },

        /**
         * Function called when the instance is destroyed
         *
         * @method destructor
         * @public
         */
        destructor: function () {
            var node = this.get('node');
            var store = this.get('store');
            var player = this.get('configObject').player;
            var requestID = this.get('configObject').requestID;

            Lang.cancelAnimFrame(requestID);

            /* Destroy youtube player */
            if (player) {
                /* istanbul ignore next */ try {
                    player.destroy();
                } catch (error) {
                    /*@<*/
                    Debug.log('YOUTUBE Player error: ', error);
                    /*>@*/
                }
            }

            /* Remove the node from the DOM */
            if (node && node.parentNode) {
                node.parentNode.removeChild(node);
            }

            /* Empty store */
            store.length = 0;
        },

        /**
         * Render the node from given config object, environment and orientation state
         *
         * @method renderContent
         * @param {Object} configObject
         * @param {String} env
         * @param {String} orientation
         * @return {HTMLElement} node
         */
        renderContent: function (configObject) {
            var store = subscribeActionsToVideoEvents(configObject, this.get('store'));
            var node = renderNodeYoutube(configObject, store);
            node = this.applyNodeConfig(node, configObject);
            return node;
        },

        /**
         * Function generating the youtube node
         *
         * @method getContent
         * @public
         * @param {String} env Environment for rendering content such as html/flash/backup
         * @param {String} orientation Orientation of current device such as landscape and portraits for mobile
         * @return {HTMLElement} node
         */
        getContent: function (env, orientation) {
            var node = this.renderContent(this.get('configObject'), env, orientation);

            this.set('node', node);

            return {
                node: node
            };
        },

        /**
         * Start the video
         * @method start
         */
        start: function () {
            var player = this.get('configObject').player;

            if (player) {
                /* istanbul ignore next */ try {
                    player.seekTo(0);
                    player.playVideo();
                } catch (error) {
                    /*@<*/
                    Debug.log('YOUTUBE Player error: ', error);
                    /*>@*/
                }
            }
        },

        /**
         * Stop the video
         * @method stop
         */
        stop: function () {
            var player = this.get('configObject').player;

            if (player) {
                /* istanbul ignore next */ try {
                    player.seekTo(0);
                    player.stopVideo();
                } catch (error) {
                    /*@<*/
                    Debug.log('YOUTUBE Player error: ', error);
                    /*>@*/
                }
            }
        },

        /**
         * Play the video
         * @method play
         */
        play: function () {
            var player = this.get('configObject').player;

            if (player) {
                /* istanbul ignore next */ try {
                    player.playVideo();
                } catch (error) {
                    /*@<*/
                    Debug.log('YOUTUBE Player error: ', error);
                    /*>@*/
                }
            }
        },

        /**
         * Pause the video
         * @method pause
         */
        pause: function () {
            var player = this.get('configObject').player;

            if (player) {
                /* istanbul ignore next */ try {
                    player.pauseVideo();
                } catch (error) {
                    /*@<*/
                    Debug.log('YOUTUBE Player error: ', error);
                    /*>@*/
                }
            }
        },

        /**
         * Turn on the sound of the video
         * @method soundOn
         */
        soundOn: function () {
            var player = this.get('configObject').player;

            if (player) {
                /* istanbul ignore next */ try {
                    player.unMute();
                } catch (error) {
                    /*@<*/
                    Debug.log('YOUTUBE Player error: ', error);
                    /*>@*/
                }
            }
        },

        /**
         * Turn off the sound of the video
         * @method soundOff
         */
        soundOff: function () {
            var player = this.get('configObject').player;

            if (player) {
                /* istanbul ignore next */ try {
                    player.mute();
                } catch (error) {
                    /*@<*/
                    Debug.log('YOUTUBE Player error: ', error);
                    /*>@*/
                }
            }
        }
    });

    return ContentYoutube;
});
