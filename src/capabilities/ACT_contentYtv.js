/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * The 'ContentYtv' is a capability made to generate a 'DIV' tag use as a container for the YTV player.
 *
 * Available 'actions':
 * - ytvStart
 * - ytvStop
 * - ytvPlay
 * - ytvPause
 * - ytvMute
 * - ytvUnmute
 *
 * Available 'triggers':
 * - start
 * - replay
 * - pause
 * - play
 * - soundon
 * - soundoff
 * - complete
 * - fullscreen
 * - error
 *
 * Example of 'SuperConf' use case:
 *
 *      {
 *          id: 'ytv_player',
 *          type: 'content-ytv',
 *          classNode: 'ytv_class',
 *          env: ['html','flash','backup'],
 *          css: {
 *              width:'355px',
 *              height:'198px'
 *          },
 *          ytvConfig:{
 *              pageSpaceId: '1180049988',
 *              comscoreC4: 'IT Screen',
 *              playlist: {
 *                  'mediaItems': [
 *                      {id: 'fafc4b2f-5d71-3ef1-9cd6-7962e007c481'},
 *                      {id: '671a92af-5903-33ce-a81f-9aac62f52f5f'}
 *                  ]
 *              },
 *              YVAP: {
 *                  accountId: '389',
 *                  playContext: 'default' // defaultprerollemea, default, noads
 *              },
 *              site:'frontpage',
 *              region: 'IT', // GB, FR, IT, DE, ES, AE, ar
 *              lang: 'it-IT', // en-GB, fr-FR, it-IT, de-DE, es-ES, en-AE, ar
 *              autoplay: true,
 *              mute: true,
 *              continuousPlay:true,
 *              loop: false
 *          },
 *          eventActions: [{
 *              eventType: 'start',
 *              actions: [
 *                  {
 *                      type: 'track',
 *                      label: 'ytv_player_start'
 *                  }
 *              ]
 *          }]
 *      }
 *
 * @module ContentYtv
 * @main ContentYtv
 * @class ContentYtv
 * @requires Dom, lang, Event, Class, Capability
 * @global
 */
ACT.define('ContentYtv', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang', 'Event', 'Class', 'Capability'], function (ACT) {
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
    var SOUND = false;
    var PLAYER = null;
    var PLAYLIST = [];
    var PLAYERAPI = {};
    var STARTED = false;

    var EVENT_YTV_START = 'ytv:start';
    var EVENT_YTV_STOP = 'ytv:stop';
    var EVENT_YTV_PLAY = 'ytv:play';
    var EVENT_YTV_PAUSE = 'ytv:pause';
    var EVENT_YTV_SOUNDON = 'ytv:soundOn';
    var EVENT_YTV_SOUNDOFF = 'ytv:soundOff';

    var EVENT_GLOBAL_ACTION_COMPLETE = 'complete:action';
    var EVENT_GLOBAL_STOP_CONTENT = 'STOP_CONTENT';

    var DEFAULT_YTV_EVENT_ACTIONS = {
        start: 'PLAYBACK_START',
        replay: 'PLAYLIST_POSITION_CHANGE',
        pause: 'PLAYBACK_PAUSE',
        play: 'PLAYBACK_RESUMED',
        soundon: 'PLAYER_MUTE_CHANGE',
        soundoff: 'PLAYER_MUTE_CHANGE',
        complete: 'PLAYBACK_COMPLETE',
        fullscreen: 'PLAYER_FULLSCREEN_CHANGE',
        error: 'PLAYER_ERROR'
    };

    var DEFAULT_CONFIG = {
        pageSpaceId: '2023392312',
        comscoreC4: 'UK Screen',
        region: 'GB',
        lang: 'en-GB',
        site: 'frontpage',
        continuousPlay: true,
        autoplay: true,
        html5: true,
        mute: true,
        loop: true
    };

    var DEFAULT_YTV_EVENT_CALLBACK = {
        replay: function (actions) {
            return function () {
                if (PLAYER && PLAYLIST[PLAYER.playlist.getCurrentItemId()] === true) {
                    Event.fire('add:actions', actions);
                }
            };
        },
        soundoff: function (actions) {
            return function (event) {
                if (event === true && SOUND === false) {
                    SOUND = true;
                    Event.fire('add:actions', actions);
                }
            };
        },
        soundon: function (actions) {
            return function (event) {
                if (event === false && SOUND === true) {
                    SOUND = false;
                    Event.fire('add:actions', actions);
                }
            };
        },
        fullscreen: function (actions) {
            return function (event) {
                if (event === true) {
                    Event.fire('add:actions', actions);
                }
            };
        },
        start: function (actions) {
            return function () {
                if (STARTED !== true) {
                    STARTED = true;
                    Event.fire('add:actions', actions);
                }
            };
        },
        complete: function (actions) {
            return function () {
                STARTED = false;
                Event.fire('add:actions', actions);
            };
        },
        defaults: function (actions) {
            return function () {
                Event.fire('add:actions', actions);
            };
        }
    };

    var contentActions = [{
        type: 'ytvStart',
        argument: {
            id: {
                name: 'id',
                test: function (id) {
                    return Lang.isString(id);
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
            Event.fire(EVENT_YTV_START, {
                id: args.id
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'ytvStop',
        argument: {
            id: {
                name: 'id',
                test: function (id) {
                    return Lang.isString(id);
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
            Event.fire(EVENT_YTV_STOP, {
                id: args.id
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'ytvPlay',
        argument: {
            id: {
                name: 'id',
                test: function (id) {
                    return Lang.isString(id);
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
            Event.fire(EVENT_YTV_PLAY, {
                id: args.id
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'ytvPause',
        argument: {
            id: {
                name: 'id',
                test: function (id) {
                    return Lang.isString(id);
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
            Event.fire(EVENT_YTV_PAUSE, {
                id: args.id
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'ytvUnmute',
        argument: {
            id: {
                name: 'id',
                test: function (id) {
                    return Lang.isString(id);
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
            Event.fire(EVENT_YTV_SOUNDON, {
                id: args.id
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'ytvMute',
        argument: {
            id: {
                name: 'id',
                test: function (id) {
                    return Lang.isString(id);
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
            Event.fire(EVENT_YTV_SOUNDOFF, {
                id: args.id
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }];

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('ContentYtv Loaded');
    /*>@*/

    /**
     * @constructor
     */
    function ContentYtv(config) {
        this.init(config);
        // ContentYtv.superclass.constructor.apply(this, arguments);
    }

    ContentYtv.ATTRS = {

        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'ContentYtv',

        /**
         * @attribute version
         * @type String
         */
        version: '1.0.41',

        /**
         * @attribute configObject
         * @type Object
         */
        configObject: {},

        /**
         * @attribute node
         * @type HTMLElement
         */
        node: null

    };

    /* Private methods */

    /**
     * Attach action for an event
     * @method attachAction
     * @private
     * @param {Object} event, object event that will be attached
     */
    function attachAction(event) {
        var callback = DEFAULT_YTV_EVENT_CALLBACK.hasOwnProperty(event.eventType) ? DEFAULT_YTV_EVENT_CALLBACK[event.eventType] : DEFAULT_YTV_EVENT_CALLBACK.defaults;

        /*@<*/
        Debug.log('ContentYtv: Attach ytv event ' + DEFAULT_YTV_EVENT_ACTIONS[event.eventType]);
        /*>@*/

        /*@<*/
        if (PLAYER) {
        /*>@*/
            /* istanbul ignore next */ PLAYER.on(PLAYERAPI[DEFAULT_YTV_EVENT_ACTIONS[event.eventType]], callback(event.actions));
        /*@<*/
        } else {
            callback(event.actions)();
        }
        /*>@*/
    }

    /**
     * Loop all video events and subscribe them
     * @method subscribeVideoEvents
     * @private
     * @param {Object} config
     */
    function subscribeVideoEvents(config) {
        var events = config.hasOwnProperty('eventActions') ? config.eventActions : {};
        var name;
        for (name in events) {
            if (events.hasOwnProperty(name) && DEFAULT_YTV_EVENT_ACTIONS.hasOwnProperty(events[name].eventType)) {
                attachAction(events[name]);
            }
        }
    }

    /**
     * Generate the node ytv
     *
     * @method renderNodeYtv
     * @private
     * @param {Object} config
     * @return {HTMLElement}
     */
    function renderNodeYtv(config) {
        var lang;
        var src;
        var node;
        var script;

        config.ytvConfig = Lang.merge(DEFAULT_CONFIG, config.ytvConfig);

        lang = '&lang=' + ((config.ytvConfig.lang) ? config.ytvConfig.lang : 'en-GB');
        src = 'https://yep.video.yahoo.com/js/3/videoplayer-min.js?r=nextgen-desktop' + lang;
        node = Dom.nodeCreate('<div id="' + config.id + '"></div>').firstChild;

        /*@<*/
        src = 'https://yep.video.yahoo.com/js/3/videoplayer-debug.js?r=nextgen-desktop' + lang;
        /*>@*/

        script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        script.onload = /* istanbul ignore next */ function () {
            var YAHOO = window.YAHOO;

            PLAYERAPI = YAHOO.VideoPlatform.API_Events;
            PLAYER = new YAHOO.VideoPlatform.VideoPlayer(config.ytvConfig);
            PLAYER.render(node);

            PLAYER.on('playbackComplete', function (event) {
                PLAYLIST[event] = true;
            });

            SOUND = PLAYER.controls.getMute();
            subscribeVideoEvents(config);
        };

        node.appendChild(script);

        return node;
    }


    /* Public methods */
    Lang.extend(ContentYtv, [Capability, Class], {
        /*@<*/
        /**
         * Testing purpose only
         */
        subscribeVideoEvents: subscribeVideoEvents,
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
                Event.on(EVENT_YTV_START, function (eventData) {
                    if (root.get('id') === eventData.id) {
                        root.start();
                    }
                }),
                Event.on(EVENT_YTV_STOP, function (eventData) {
                    if (root.get('id') === eventData.id) {
                        root.stop();
                    }
                }),
                Event.on(EVENT_YTV_PLAY, function (eventData) {
                    if (root.get('id') === eventData.id) {
                        root.play();
                    }
                }),
                Event.on(EVENT_YTV_PAUSE, function (eventData) {
                    if (root.get('id') === eventData.id) {
                        root.pause();
                    }
                }),
                Event.on(EVENT_YTV_SOUNDON, function (eventData) {
                    if (root.get('id') === eventData.id) {
                        root.soundOn();
                    }
                }),
                Event.on(EVENT_YTV_SOUNDOFF, function (eventData) {
                    if (root.get('id') === eventData.id) {
                        root.soundOff();
                    }
                }),
                Event.on(EVENT_GLOBAL_STOP_CONTENT, function () {
                    root.pause();
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

            /* Remove the node from the DOM */
            if (node && node.parentNode) {
                node.parentNode.removeChild(node);
            }
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
        renderContent: function (configObject, env) {
            var node = renderNodeYtv(configObject, env);
            node = this.applyNodeConfig(node, configObject);

            return node;
        },

        /**
         * Function generating the ytv node
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
            var node = this.get('node');

            if (node && PLAYER) {
                /* istanbul ignore next */ try {
                    PLAYER.controls.play(0);
                } catch (error) {
                    /*@<*/
                    Debug.log('YTV Player error: ', error);
                    /*>@*/
                }
            }
        },

        /**
         * Stop the video
         * @method stop
         */
        stop: function () {
            var node = this.get('node');

            if (node && PLAYER) {
                /* istanbul ignore next */ try {
                    PLAYER.controls.seek(0);
                    PLAYER.controls.pause();
                } catch (error) {
                    /*@<*/
                    Debug.log('YTV Player error: ', error);
                    /*>@*/
                }
            }
        },

        /**
         * Play the video
         * @method play
         */
        play: function () {
            var node = this.get('node');

            if (node && PLAYER) {
                /* istanbul ignore next */ try {
                    PLAYER.controls.play();
                } catch (error) {
                    /*@<*/
                    Debug.log('YTV Player error: ', error);
                    /*>@*/
                }
            }
        },

        /**
         * Pause the video
         * @method pause
         */
        pause: function () {
            var node = this.get('node');

            if (node && PLAYER) {
                /* istanbul ignore next */ try {
                    PLAYER.controls.pause();
                } catch (error) {
                    /*@<*/
                    Debug.log('YTV Player error: ', error);
                    /*>@*/
                }
            }
        },

        /**
         * Turn on the sound of the video
         * @method soundOn
         */
        soundOn: function () {
            var node = this.get('node');

            if (node && PLAYER) {
                /* istanbul ignore next */ try {
                    PLAYER.controls.setMute(false);
                } catch (error) {
                    /*@<*/
                    Debug.log('YTV Player error: ', error);
                    /*>@*/
                }
            }
        },

        /**
         * Turn off the sound of the video
         * @method soundOff
         */
        soundOff: function () {
            var node = this.get('node');

            if (node && PLAYER) {
                /* istanbul ignore next */ try {
                    PLAYER.controls.setMute(true);
                } catch (error) {
                    /*@<*/
                    Debug.log('YTV Player error: ', error);
                    /*>@*/
                }
            }
        }
    });

    return ContentYtv;
});
