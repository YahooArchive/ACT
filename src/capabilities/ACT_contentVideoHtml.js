/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * Capability for rendering html5 video content.
 * Features:
      - rendering video tag with video source insides
      - Broadcasting video progress and states
 *
 * Example for config object:
 *
 *     {
 *         type: 'content-video-html',
 *          id: 'video_id',
 *          env: ['html'],
 *          css: {
 *              width: '400px',
 *              height: '300px'
 *            },
 *          videoHtmlConfig:{
 *              controls: true | false, // enable/disable video native control - default is true - optional
 *              autoPlay: true | false, // enable/disable video auto play - default is false - optional
 *              videoMuted: true | false, // disable/enable video sound - default is false - optional
 *              posterImage: 'link_to_poster_image', // image to be show when video is loaded or before playing video - optional
 *              videoMP4: 'link_to_mp4_video',
 *              videoWebM: 'link_to_webm_video',
 *              videoOGG: 'link_to_ogg_video',
 *              videoOGV: 'link_to_ogv_video'
 *          },
 *          eventConfig: [{
 *              eventType: 'start' | '25percent' | '50percent' | '75percent' | 'complete' | 'pause' | 'pausePlay'  | 'soundon' | 'soundoff' | 'replay',
 *              actions: [{
 *                  // ...
 *              }]
 *          }]
 *      }
 *
 *      // Available actions for the actions queue:
 *      {
 *          type: 'video:start | video:stop | video:play | video:pause | video:soundOn | video:soundOff ',
 *          videoId: 'video_id' // id of target video
 *      }
 *
 * @module ContentVideoHtml
 * @main ContentVideoHtml
 * @class ContentVideoHtml
 * @requires dom, lang, event, Class, Capability
 * @global
 */
ACT.define('ContentVideoHtml', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang', 'Event', 'Class', 'Capability', 'VideoEvents'], function (ACT) {
    'use strict';

    /* Shorthand */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Class = ACT.Class;
    var Capability = ACT.Capability;
    /*@<*/
    var Debug = ACT.Debug;
    /*>@*/

    /* Constants */
    var ACCEPTED_VIDEO_TYPE = ['WebM', 'MP4', 'OGG', 'OGV'];
    var VIDEO_FORMAT = {
        webm: 'video/webm',
        mp4: 'video/mp4',
        ogg: 'video/ogg',
        ogv: 'video/ogg'
    };

    var EVENT_VIDEO_ACTION = 'video:action';

    var EVENT_VIDEO_STATE = 'video:state';
    var EVENT_VIDEO_START = 'video:start';
    var EVENT_VIDEO_STOP = 'video:stop';
    var EVENT_VIDEO_PLAY = 'video:play';
    var EVENT_VIDEO_SEEK = 'video:seek';
    var EVENT_VIDEO_PAUSE = 'video:pause';
    var EVENT_VIDEO_SOUNDON = 'video:soundOn';
    var EVENT_VIDEO_SOUNDOFF = 'video:soundOff';
    var EVENT_VIDEO_RESIZE = 'video:resize';
    var EVENT_VIDEO_FULLSCREEN = 'video:fullscreen';

    var EVENT_GLOBAL_SCREEN_STATUS = 'screen:status';
    var EVENT_GLOBAL_ACTION_COMPLETE = 'complete:action';
    var EVENT_GLOBAL_ACTION_REGISTER = 'register:Actions';
    var EVENT_GLOBAL_ACTION_ADD = 'add:actions';
    var EVENT_GLOBAL_CHECK_ACTION_CONDITION = 'standardAd:checkActionCondition';


    var DEFAULT_VIDEO_EVENT_ACTIONS = {
        clicked: '',
        start: '',
        replay: '',
        pause: '',
        resume: '',
        soundon: '',
        soundoff: '',
        '25percent': '',
        '50percent': '',
        '75percent': '',
        complete: ''
    };

    /**
     * List of event for video
     */
    /* istanbul ignore next */
    var videoEvents = [{
        // start video from beginning
        type: 'videoStart',
        argument: {
            videoId: {
                name: 'videoId',

                test: /* istanbul ignore next */ function (value) {
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
        process: function (actionId, args) {
            Event.fire(EVENT_VIDEO_START, {
                videoId: args.videoId
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        // play video from where it left
        type: 'videoPlay',
        argument: {
            videoId: {
                name: 'videoId',
                test: /* istanbul ignore next */ function (value) {
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
        process: function (actionId, args) {
            Event.fire(EVENT_VIDEO_PLAY, {
                videoId: args.videoId
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        // seek video to a particular percentage
        type: 'videoSeek',
        argument: {
            videoId: {
                name: 'videoId',
                test: /* istanbul ignore next */ function (value) {
                    var ele = Dom.byId(value);
                    return (ele !== null) && (ele.tagName.toLowerCase() === 'video');
                }
            },
            percentage: {
                name: 'percentage',
                test: /* istanbul ignore next */ function (value) {
                    var percen = parseInt(value, 10);
                    return Lang.isNumber(percen);
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
            Event.fire(EVENT_VIDEO_SEEK, {
                videoId: args.videoId,
                percentage: parseInt(args.percentage, 10)
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'videoStop',
        argument: {
            videoId: {
                name: 'videoId',
                test: /* istanbul ignore next */ function (value) {
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
        process: function (actionId, args) {
            Event.fire(EVENT_VIDEO_STOP, {
                videoId: args.videoId
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'videoPause',
        argument: {
            videoId: {
                name: 'videoId',
                test: /* istanbul ignore next */ function (value) {
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
                test: /* istanbul ignore next */ function (value) {
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
                test: /* istanbul ignore next */ function (value) {
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
        process: function (actionId, args) {
            Event.fire(EVENT_VIDEO_SOUNDOFF, {
                videoId: args.videoId
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'videoFullScreen',
        argument: {
            videoId: {
                name: 'videoId',
                test: /* istanbul ignore next */ function (value) {
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
        process: function (actionId, args) {
            Event.fire(EVENT_VIDEO_FULLSCREEN, {
                videoId: args.videoId
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }];

    /**
     * @class ContentVideoHtml
     * @constructor
     */
    function ContentVideoHtml(config) {
        this.init(config);
    }

    ContentVideoHtml.ATTRS = {

        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'ContentVideoHtml',

        /**
         * @attribute version
         * @type String
         */
        version: '1.0.41',

        /**
         * @attribute videoConfig
         */
        videoConfig: {},

        /**
         * @attribute configObject
         * @type Object
         */
        configObject: {},

        /**
         * @attribute videoPath
         */
        videoPath: {},

        /**
         * @attribute node
         * @type HTMLElement
         */
        node: null,

        /**
         * @attribute videoId
         * @type String
         */
        videoId: null,

        /**
         * Reference for Video Events
         * @attribute videoEventsRef
         * @type Object
         */
        videoEventsRef: null,

        /**
         * List custom EventType for video such as cuePoint.
         * @attribute customEventActions
         */
        customEventActions: {}

    };

    /* Private methods */

    /* ------------------- FUNCTIONS FOR RENDERING VIDEO NODE OBJECT - BEGIN ------------------------------------*/

    /**
     * Subscribe custom execution to the video event
     *
     * @method subscribeToVideoEvent
     * @private
     * @param {String} node Node to attach event
     * @param {Object} actionConfig Config for actions to be fired
     */

    function subscribeToVideoEvent(node, actionConfig) {
        // listent to video state event
        // using node id to check if this state is for this node
        // checking eventType of actionConfig to see if its the trigger event
        /* Store the event subscription into a variable and return it at the end of the function. */
        var subscribedEvent = Event.on(EVENT_VIDEO_STATE, function (eventData) {
            /*@<*/
            Debug.log('[ ACT_contentVideoHtml.js ] on ', EVENT_VIDEO_STATE, eventData);
            /*>@*/

            if (eventData.videoId === node.id && eventData.data === actionConfig.eventType) {
                Event.fire(EVENT_GLOBAL_CHECK_ACTION_CONDITION, {
                    actionConfig: actionConfig,
                    callback: function (isExecutable) {
                        if (isExecutable) {
                            /*@<*/
                            Debug.warn('[ ACT_contentVideoHtml.js ] executing : ', EVENT_GLOBAL_ACTION_ADD, actionConfig.actions);
                            /*>@*/
                            Event.fire(EVENT_GLOBAL_ACTION_ADD, actionConfig.actions);
                        } /*@<*/ else {
                            Debug.warn('[ ACT_contentVideoHtml.js ] Actions is not executable!', actionConfig);
                        }
                        /*>@*/
                    }
                });
            }
        });

        /*@<*/
        Debug.log('[ ACT_contentVideoHtml.js ] Attaching video event ' + actionConfig);
        /*>@*/
        return subscribedEvent;
    }

    /**
     * Attach action for an event
     *
     * @method attachVideoEventActions
     * @private
     * @param {String} node, node to attach events
     * @param {String} eventConfig, list of event
     * @param {Object} customEventActions List of custom video events allowd by the contentVideoInstance
     */
    function attachVideoEventActions(node, eventConfig, customEventActions) {
        var eventsList = [];
        var index;
        var actionConfig;
        if (!Lang.isArray(eventConfig)) {
            /*@<*/
            Debug.log('[ ACT_contentVideoHtml.js ] eventConfig is empty:', eventConfig);
            /*>@*/
            return eventsList;
        }

        // at least customEventActions must be empty object to avoid broken code
        customEventActions = customEventActions || {};

        // go throught all event config
        // if eventType is on the action list then subcribe actions on this eventType
        for (index = 0; index < eventConfig.length; index++) {
            actionConfig = eventConfig[index];
            /* istanbul ignore next */
            if (DEFAULT_VIDEO_EVENT_ACTIONS.hasOwnProperty(actionConfig.eventType) || customEventActions.hasOwnProperty(actionConfig.eventType)) {
                eventsList.push(subscribeToVideoEvent(node, actionConfig));
            }
        }
        /*@<*/
        Debug.log('[ ACT_contentVideoHtml.js ] subscribed to : ', eventsList);
        /*>@*/
        return eventsList;
    }

    /**
     * Function to applying video configuration to video node (e.g: autoplay, muted)
     *
     * @method applyVideoState
     * @param node
     * @param videoConfig
     * @return {*}
     * @private
     */
    function applyVideoState(node, videoConfig) {
        // showing native control
        node.controls = (videoConfig.controls !== false);
        // set auto play
        node.autoplay = (videoConfig.autoplay === true);
        // set sound option
        node.muted = (videoConfig.videoMuted === true);
        // set loop option
        node.loop = (videoConfig.loop === true);
        // set poster image
        if (typeof videoConfig.posterImage === 'string') {
            node.poster = videoConfig.posterImage;
        }

        return node;
    }

    /**
     * Return video source nodes
     * @param configVideo Video configuration
     * @return {string}
     * @private
     */
    function appendVideoSourcesToNode(configVideo) {
        var source = '';
        var videoPath = configVideo.videoPath;
        var index;
        var src;
        var type;
        for (index = 0; index < videoPath.length; index++) {
            src = videoPath[index].path;
            type = VIDEO_FORMAT[videoPath[index].type];
            source += '<source src="' + src + '" type="' + type + '" ></source>';
        }
        return source;
    }

    /**
     * Function generate list of available video path from given configVideo
     *
     * @method initializeVideoPath
     * @param {Object} configVideo
     * @return {Array} list of video path
     */
    function initializeVideoPath(configVideo) {
        var index;
        var type;
        var keyword;
        configVideo.videoPath = [];

        for (index = 0; index < ACCEPTED_VIDEO_TYPE.length; index++) {
            type = ACCEPTED_VIDEO_TYPE[index];
            keyword = 'video' + type;
            if (typeof configVideo[keyword] === 'string') {
                configVideo.videoPath.push({
                    type: type.toLowerCase(),
                    path: configVideo[keyword]
                });
            }
        }
    }

    /**
     * Set attributes to the node
     *
     * @method setAttributes
     * @private
     * @param {HTMLElement} node
     * @param {Object} attrs
     */
    function setAttributes(node, attrs) {
        var attr;
        for (attr in attrs) {
            /* istanbul ignore next */
            if (attrs.hasOwnProperty(attr)) {
                node.setAttribute(attr, attrs[attr]);
            }
        }
    }

    /* --------------------- FUNCTIONS FOR RENDERING VIDEO NODE OBJECT - END ----------------------------------*/

    /* Public methods */
    Lang.extend(ContentVideoHtml, [Capability, Class], {

        initializer: function (config) {
            // set videoId
            this.set('videoId', config.id);

            // save configObject reference
            this.set('configObject', config);

            // register action to actions-queue
            Event.fire(EVENT_GLOBAL_ACTION_REGISTER, videoEvents);

            // subscribes and save listeners
            this.initializeListeners();
        },

        /**
         * Function to initialize event listeners for this instance
         *
         * @method initializeListeners
         */
        initializeListeners: function () {
            var root = this;

            // create new event listener and push it inside event array
            root.addEventListeners(
                Event.on(EVENT_VIDEO_START, function (eventData) {
                    /* istanbul ignore else */
                    if (root.get('videoId') === eventData.videoId) {
                        root.start();
                    }
                }),
                Event.on(EVENT_VIDEO_STOP, function (eventData) {
                    /* istanbul ignore else */
                    if (root.get('videoId') === eventData.videoId) {
                        root.stop();
                    }
                }),
                Event.on(EVENT_VIDEO_PLAY, function (eventData) {
                    /* istanbul ignore else */
                    if (root.get('videoId') === eventData.videoId) {
                        root.play();
                    }
                }),
                Event.on(EVENT_VIDEO_SEEK, function (eventData) {
                    /* istanbul ignore else */
                    if (root.get('videoId') === eventData.videoId) {
                        root.seek(eventData.percentage);
                    }
                }),
                Event.on(EVENT_VIDEO_PAUSE, function (eventData) {
                    /* istanbul ignore else */
                    if (root.get('videoId') === eventData.videoId) {
                        root.pause();
                    }
                }),
                Event.on(EVENT_VIDEO_SOUNDON, function (eventData) {
                    /* istanbul ignore else */
                    if (root.get('videoId') === eventData.videoId) {
                        root.soundOn();
                    }
                }),
                Event.on(EVENT_VIDEO_SOUNDOFF, function (eventData) {
                    /* istanbul ignore else */
                    if (root.get('videoId') === eventData.videoId) {
                        root.soundOff();
                    }
                }),
                Event.on(EVENT_VIDEO_FULLSCREEN, function (eventData) {
                    /* istanbul ignore else */
                    if (root.get('videoId') === eventData.videoId) {
                        root.fullScreen();
                    }
                }),
                Event.on(EVENT_VIDEO_RESIZE, function (eventData) {
                    /* istanbul ignore else */
                    if (root.get('videoId') === eventData.videoId) {
                        root.resize(eventData.state);
                    }
                }),
                Event.on(EVENT_GLOBAL_SCREEN_STATUS, function (status) {
                    /* istanbul ignore else */
                    if (root.get('configObject') && root.get('configObject').resize) {
                        root.resize(status, root.get('configObject'));
                    }
                })
           );
        },

        /**
         * Function to be called when the instance is destroyed
         *
         * @method destructor
         */
        destructor: function () {
            var node = this.get('node');
            var videoEv = this.get('videoEventsRef');

            // remove video action & events
            if (Lang.isFunction(videoEv.destroy)) {
                videoEv.destroy();
            }

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
        renderContent: function (configObject) {
            var node;
            var video;
            var source;
            var meta;
            var eventsAdded;

            // initialize video path
            initializeVideoPath(configObject.videoHtmlConfig);

            // create video tag
            // review this
            meta = '<meta http-equiv="X-UA-Compatible" content="IE=Edge"/>';
            source = appendVideoSourcesToNode(configObject.videoHtmlConfig);
            video = '<video preload="auto" autoplay>' + meta + source + '</video>';

            node = Dom.nodeCreate(video).firstChild;

            // set tag attributes
            setAttributes(node, {
                id: configObject.id
            });

            // applying initial state for the video
            applyVideoState(node, configObject.videoHtmlConfig);

            // attach video event to actions
            eventsAdded = attachVideoEventActions(node, configObject.eventConfig, configObject.customEventActions);

            node = this.applyNodeConfig(node, configObject);

            /*@<*/
            /* Error listening, so we can log it in debug version. */
            Event.on('error', function (e) { Debug.log('[ ACT_contentVideoHtml.js ] Error in video:', e, node.error.code); }, node, this);
            Debug.log('[ ACT_contentVideoHtml.js ] Generated node/events:', node, eventsAdded, eventsAdded.length);
            /*>@*/

            /* We are now returning a more complex object from this function so that we can push over the newly added events. */
            return {
                node: node,
                events: eventsAdded
            };
        },

        /**
         * @method getContent
         * @param {String} env Environment for rendering content such as html/flash/backup
         * @param {String} orientation Orientation of current device such as landscape and portraits for mobile
         * @return {HTMLElement} node
         */
        getContent: function (env, orientation) {
            var renderedNode = this.renderContent(this.get('configObject'), env, orientation);
            var node = renderedNode.node;
            var index;

            /* all listeners must have a references in eventList array so we can detach them when need */
            for (index = 0; index < renderedNode.events.length; index++) {
                this.addEventListeners(renderedNode.events[index]);
            }

            // create video events
            this.createVideoEvents(node);
            // save reference to the node
            this.set('node', node);

            /*@<*/
            Debug.log('[ ACT_contentVideoHtml.js ] getContent node and events are: ', node, this.get('eventList').length);
            /*>@*/

            return {
                node: node
            };
        },

        /**
         * Function to send notification to other part of the system about changes of the video instance
         * @param videoID
         * @param progress
         */
        broadcastProgress: function (videoID, progress) {
            Event.fire(EVENT_VIDEO_STATE, {
                videoId: videoID,
                data: progress
            });
        },

        /**
         * Create video events for node
         * @param node
         */
        createVideoEvents: function (node) {
            var root = this;
            var videoID = this.get('videoId');
            var config = this.get('configObject');
            var videoConfig = config.videoHtmlConfig;
            var clicked = videoConfig.clicked || false;
            var localVideoEvents;
            var eventsConfig = {
                tracking: {
                    start: true,
                    25: true,
                    50: true,
                    75: true,
                    ended: true,
                    pause: true,
                    volumechange: true,
                    seeked: false,
                    clicked: clicked
                },
                cuePoints: {}
            };

            /*
            Passing customEvents into VideoEvents as cuePoints so it can be fired at exact time
            Also need to add custom event name into tracking so it can be listened
            e.g:
            If we have customEventActions['customEventName'] = 4 // trigger customEventName at the second 4th
            VideoEvent config will have:
                eventsConfig.tracking.customEventName = true;
            and
                eventsConfig.cuePoints[4] = 'customEventName';
            */
            var customEventActions = this.get('customEventActions');
            Lang.forEach(customEventActions, function (index, value) {
                eventsConfig.cuePoints[value] = index;
                eventsConfig.tracking[index] = true;
            });

            localVideoEvents = new ACT.VideoEvents(node, videoID, eventsConfig);
            this.set('videoEventsRef', localVideoEvents);

            root.addEventListeners(
                Event.on(EVENT_VIDEO_ACTION, function (data) {
                    root.onVideoEvents(videoID, data, root.broadcastProgress);
                })
           );
        },

        /**
         * Video Events listener
         * @param videoID
         * @param data
         * @param callback
         */
        onVideoEvents: function (videoID, data, callback) {
            var event;
            if (data.hasOwnProperty('videoId') && data.videoId === videoID && data.hasOwnProperty('eventLongName')) {
                event = data.eventLongName;
                if (Lang.isFunction(callback)) {
                    callback(videoID, event);
                }
            }
        },

        /* ----------------------FUNCTIONS FOR VIDEO ACTIONS - BEGIN---------------------------------*/

        /**
         * Play video from the very beginning
         * @method start
         */
        start: function () {
            this.play(0);
        },

        /**
         * Play video from start time position
         * If startTime is not set then the video will play from current position
         * @param startTime
         */
        play: function (startTime) {
            var node = this.get('node');
            if (Lang.isStrictNumber(startTime)) {
                node.currentTime = startTime;
            }
            node.play();
        },

        /**
         * Seeking video to a particular percentage
         *
         * @method seek
         * @param {Number} percentage
         */
        seek: function (percentage) {
            var node;
            var time;
            if (percentage < 0 || percentage > 100) {
                return;
            }
            node = this.get('node');
            time = (percentage * node.duration) / 100;
            node.currentTime = time;
        },

        /**
         * Stop the video and set current position to the beginning
         * @method stop
         */
        stop: function () {
            // pause the video then set the currentTime of video to 0
            this.pause(0);
        },

        /**
         * Pause the video at current positions.
         * If new time is set, then the current time of the video will be set to new time value
         *
         * @method pause
         * @param {Integer} [newTime]
         */
        pause: function (newTime) {
            var node = this.get('node');
            if (Lang.isStrictNumber(newTime)) {
                node.currentTime = newTime;
            }
            node.pause();
        },

        /**
         * Turn on the sound of the video
         * @method soundOn
         */
        soundOn: function () {
            var node = this.get('node');
            node.muted = false;
        },

        /**
         * Turn off the sound of the video
         * @method soundOff
         */
        soundOff: function () {
            var node = this.get('node');
            node.muted = true;
        },

        /**
         * Request Full Screen
         * @method fullScreen
         */
        fullScreen: function () {
            var node = this.get('node');
            var isFunction = Lang.isFunction;
            if (isFunction(node.requestFullscreen)) {
                node.requestFullscreen();
            } else if (isFunction(node.msRequestFullscreen)) {
                node.msRequestFullscreen();
            } else if (isFunction(node.mozRequestFullScreen)) {
                node.mozRequestFullScreen();
            } else if (isFunction(node.webkitRequestFullscreen)) {
                node.webkitRequestFullscreen();
            } else {
                // cannot fullscreen
            }
        }

        /* ---------------------FUNCTIONS FOR VIDEO ACTIONS - END----------------------------------*/

    });

    return ContentVideoHtml;
});
