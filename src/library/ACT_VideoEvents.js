/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
ACT.define('VideoEvents', [/*@<*/'Debug', /*>@*/ 'Event', 'Lang', 'Dom', 'UA'], function (ACT) {
    'use strict';
    /**
     * Video Event - A library that fires off events based on video progress / actions taken in an HTML Video Tag.
     * @class VideoEvents
     * @module ACT
     * @requires event, lang, dom
     */

    /* Shorthand */
    var Event = ACT.Event;
    var Lang = ACT.Lang;
    var Dom = ACT.Dom;
    var UA = ACT.UA;
    var VIDEO_START_THRESHOLD = 0.05;
    var SOUND_STATE = {
        ON: 'On',
        OFF: 'Off'
    };

    /* Fired Events Set */
    var EVENT_VIDEO_STATE = {
        /* The "play" event never gets fired out. It gets replaced with "start" / "resume" / "replay" instead */
        /* "play": 'video:play', */

        /**
         * Fired when video starts playing
         * @event 'video:start'
         */
        start: 'video:start',

        /**
         * Fired when video stops playing
         * @event 'video:stop'
         */
        stop: 'video:stop',

        /**
         * Fired when video playing is resumed ( from pause state )
         * @event 'video:resume'
         */
        resume: 'video:resume',

        /**
         * Fired when video is replayed.
         * @event 'video:replay'
         */
        replay: 'video:replay',

        /**
         * Fired when video is paused
         * @event 'video:pause'
         */
        pause: 'video:pause',

        /**
         * Fired when video sound is turned on
         * @event 'video:soundOn'
         */
        soundOn: 'video:soundOn',

        /**
         * Fired when video sound is turned off ( mute )
         * @event 'video:soundOff'
         */
        soundOff: 'video:soundOff',

        /**
         * Fired when video is being seeked/scrubbed by the user.
         * @event 'video:seeked'
         */
        seeked: 'video:seeked',

        /**
         * Fired when video has played 25%
         * @event 'video:25percent'
         */
        25: 'video:25percent',

        /**
         * Fired when video has played 50%
         * @event 'video:50percent'
         */
        50: 'video:50percent',

        /**
         * Fired when video has played 75%
         * @event 'video:75percent'
         */
        75: 'video:75percent',

        /**
         * Fired when video has finished playing
         * @event 'video:complete'
         */
        ended: 'video:complete',

        /**
         * Fired when video has being clicked
         * @event 'video:clicked'
         */
        clicked: 'video:clicked'
    };

    var DEFAULT_CONFIG = {
        resumeThreshold: VIDEO_START_THRESHOLD,
        tracking: {},
        cuePoints: {}
    };

    var itor;
    /* control bar height for each browser */
    var ctrlHeight = { Safari: 24, FireFox: 28, Chrome: 35, Edge: 0, MSIE: 0, WebKit: 35 };
    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_VideoEvents.js ]: loaded');
    /*>@*/

    /* Fill in the DEFAULT_CONFIG with allowed events. */
    for (itor in EVENT_VIDEO_STATE) {
        /* istanbul ignore else */
        if (EVENT_VIDEO_STATE.hasOwnProperty(itor)) {
            DEFAULT_CONFIG.tracking[itor] = (itor !== 'clicked');
        }
    }

    /**
     * Get if screen has been clicked or not
     * @param node
     * @param offset
     * @return {boolean}
     * @private
     */
    function screenClick(node, offset) {
        var browser = UA.browser;
        var agent = browser.name || '';
        var clicked = true;
        var controls;
        var height;
        var screen;
        /* istanbul ignore else */
        if (node.controls) {
            controls = ctrlHeight[agent] || 0;
            height = node.offsetHeight || 0;
            screen = (height - controls);
            clicked = (offset.hasOwnProperty('x') && offset.hasOwnProperty('y')) ? (offset.y < screen) : false;
        }
        return clicked;
    }

    /**
     * @method VideoEvent
     * @param videoNode {Object} DOM Node of the video to track OR ID of the video node
     * @param videoID {String} Identifier of the video for tracking.
     * @param config {Object} Optional configuration for tracking.
     * @public
     *
     * @example
     *  // This example will track start, 25percent, 50percent, 75percent, complete, pause.
     *  // Will NOTE track: volume change ( sound on / sound off ) and seek.
     *  var config = {
     *      resumeThreshold: 0.05,
     *      tracking : {
     *          start : true,
     *          25: true,
     *          50: true,
     *          75: true,
     *          ended: true,
     *          pause: true,
     *          volumechange: false,
     *          seeked: false,
     *          clicked: false
     *      }
     *  }
     *  var videoNode = Dom.ById("videoNodeId");
     *  var videoEvents = new ACT.VideoEvents( videoNode, "video1", config);
     *
     *  // Now to attach to these events.
     *  var Event = ACT.Event;
     *  Event.on( 'video:action', function( event_data ){ event.event == 'video:<type>'; "..do something with data ..."; }, null, this );
     *
     */
    function VideoEvent(videoNode, videoID, config) {
        /* Internal flags - keeping track of what cuePoint has been fired so far. */
        var cuePointFired = {};
        this.videoNode = videoNode;
        this.videoID = videoID;
        this.firstPlay = true;
        this.videoEnded = false;
        this.config = {};

        Lang.merge(this.config, DEFAULT_CONFIG);
        Lang.merge(this.config, config || {});

        VIDEO_START_THRESHOLD = this.config.resumeThreshold;

        /* Internal flags - keeping track of what percentage has been fired so far. */
        this.progressParts = {
             1: false,
            25: false,
            50: false,
            75: false,
            ended: false
        };

        Lang.forEach(this.config.cuePoints, function (cuePoint) {
            cuePointFired[cuePoint] = false;
        });
        this.cuePointFired = cuePointFired;

        this.progress = {};

        /* istanbul ignore else */
        if (this.validateVideoNode() === true) {
            this.initializeVideoTracking();
        } /*@<*/ else {
            Debug.log('[ ACT_VideoEvents.js ]: The DOM Node provided is not of type "video"');
        }
        /*>@*/
    }

    /**
     * @attribute ATTRS
     * @initOnly
     */
    VideoEvent.ATTRS = {
        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'VideoEvent',

        /**
         * @attribute version
         * @type String
         */
        version: '1.0.22'
    };

    VideoEvent.prototype = {

        /**
         * Function that broadcasts the events to the world. Checks that we want to broadcast the event.
         *
         * @method broadcast
         * @private
         */
        broadcast: function (eventName, data) {
            var config = this.config;
            var tracking = config.tracking;
            var eventVideoState;

            /*@<*/
            Debug.log('[ ACT_VideoEvents.js ]: broadcast video events ', eventName, data);
            /*>@*/

            /* istanbul ignore else */
            if (tracking.hasOwnProperty(eventName) && tracking[eventName] === true) {
                data = data || {};
                /*
                 Instead of firing a specific event "video:25percent" or "video:complete"
                 It's a little better to fire a standard event type "video:action"
                 that has a payload of eventType - which is the event type being picked off ( "ended" or "25" "pause" )
                 and also has "event" which is the video event that is fired "video:25percent", "video:complete" etc.
                 EVENT_VIDEO_STATE[eventName]
                 */
                eventVideoState = Lang.objHasKey(EVENT_VIDEO_STATE, eventName) ? EVENT_VIDEO_STATE[eventName] : 'video:' + eventName;
                Event.fire(
                    'video:action', {
                        videoId: this.videoID,
                        videoNode: this.videoNode,
                        data: data,
                        eventType: eventName,
                        eventLongName: eventVideoState.replace('video:', ''),
                        event: eventVideoState
                    }
                );
            }
        },

        /**
         * Function that confirms that the node that was passed in is in fact a VIDEO node.
         *
         * @method validateVideoNode
         * @private
         */
        validateVideoNode: function () {
            var videoNode = this.videoNode;

            /* check that we have a proper video node */
            if (Lang.isString(videoNode)) {
                videoNode = Dom.byId(videoNode);
                this.videoNode = videoNode;
            }

            /* istanbul ignore else */
            if (videoNode && 'nodeName' in videoNode && videoNode.nodeName.toLowerCase() === 'video') {
                return true;
            }
            return false;
        },

        /**
         * Function that initialized the events that will fire for the video node.
         *
         * @method initializeVideoTracking
         * @private
         */
        initializeVideoTracking: function () {
            var videoNode = this.videoNode;

            /*
                a flag for current video volumn which will be used for volumn change tracking
            */
            this.soundState = (videoNode.muted !== true && videoNode.volume > 0) ? SOUND_STATE.ON : SOUND_STATE.OFF;

            this.events = {
                play: Event.on('play', this.onPlay, videoNode, this),
                pause: Event.on('pause', this.onPause, videoNode, this),
                volumechange: Event.on('volumechange', this.onVolumeChange, videoNode, this),
                timeupdate: Event.on('timeupdate', this.onTimeUpdate, videoNode, this),
                ended: Event.on('ended', this.onEnded, videoNode, this),
                seeked: Event.on('seeked', this.onSeeked, videoNode, this),
                clicked: Event.on('click', this.onClicked, videoNode, this)
            };
        },

        /**
         * Function to calculate video percentage
         *
         * @method calculateVideoPercentage
         * @private
         */
        calculateVideoPercentage: function () {
            var videoNode = this.videoNode;
            var videolength = videoNode.duration;
            var val1;
            var val25;
            var val50;
            var val75;
            var progress;

            /* istanbul ignore else */
            if (Lang.isObjectEmpty(this.progress)) {
                /* calculate the value of duration percentage */
                val1 = Math.floor(videolength * 0.01);
                val25 = Math.floor(videolength * 0.25);
                val50 = Math.floor(videolength * 0.50);
                val75 = Math.floor(videolength * 0.75);
                progress = {};
                /*
                    Confirm that we have proper numbers for the track points.
                    Fix for some IE's that do not always return a number for node.duration.
                */
                if (!isNaN(val1) && !isNaN(val25) && !isNaN(val50) && !isNaN(val75)) {
                    progress[val1] = Lang.bind(this, val25, this.on1Percent);
                    progress[val25] = Lang.bind(this, val25, this.on25Percent);
                    progress[val50] = Lang.bind(this, val50, this.on50Percent);
                    progress[val75] = Lang.bind(this, val75, this.on75Percent);

                    this.progress = progress;

                    /*@<*/
                    Debug.log('[ ACT_VideoEvents.js ]: set the progress tracks:', this.progress, val1, val25, val50, val75);
                    /*>@*/
                }
            }
        },

        /**
         * Function to fire a seeked event
         *
         * @method onSeeked
         * @param {Object} event data
         * @private
         */
        onSeeked: function () {
            this.broadcast('seeked');
        },

        /**
         * Function to fire a pause event. Only fires the pause if we're 5% ~ 95% of video play time.
         * NOTE: The 5%/95% is based on the VIDEO_START_THRESHOLD which can be redefined to be more or less than the 5% used as default.
         *
         * @method onPause
         * @param {Object} event data
         * @private
         */
        onPause: function () {
            var videoNode = this.videoNode;
            var videoDuration = videoNode.duration;
            var currentTime = videoNode.currentTime;
            var nintyFivePercent = (videoDuration * (1 - VIDEO_START_THRESHOLD));
            var pauseOrComplete = (currentTime >= nintyFivePercent);

            /*
             IF currentTime is over 95% then we have a "video complete"
             ELSE we have a "pause"
             */
            /* istanbul ignore else */
            if (!pauseOrComplete) {
                this.broadcast('pause');
            }
        },

        /**
         * Function to fire a onTimeUpdate event
         *
         * @method onTimeUpdate
         * @param {Object} event data
         * @private
         */
        onTimeUpdate: function () {
            var self = this;
            var videoNode = this.videoNode;
            var currentTime = Math.floor(videoNode.currentTime);
            /* Calculate the video length and attach tracking events to 25/50/75 */
            this.calculateVideoPercentage();

            /*@<*/
            Debug.log('[ ACT_VideoEvents.js ]: onTimeUpdate : ', currentTime);
            /*>@*/

            /* if currentTime is in progressAction list then fire off the track */
            /* Every progress track knows it's own state. */
            if (currentTime in this.progress) {
                this.progress[currentTime]();
            }

            /*
            if currentTime is in cuePoints list then fire event related to it
            We will go through all defined CuePoints and with each cuePoints we will
            - if cuePoint time is equal currentTime and its flag is off then we broadcast cuePoint event and turn flag on
            - All other cuePoints differ than currentTime will have its flag turned off
            */
            Lang.forEach(this.config.cuePoints, function (cuePoint, eventName) {
                if (Math.floor(cuePoint) === currentTime) {
                    if (self.cuePointFired[cuePoint] === false) {
                        self.cuePointFired[currentTime] = true;
                        self.broadcast(eventName);
                    }
                } else {
                    self.cuePointFired[cuePoint] = false;
                }
            });
        },

        /**
         * Function to be called when the sound of the video has been changed
         *
         * @method onVolumeChange
         * @param {Object} event data
         * @private
         */
        onVolumeChange: function () {
            var videoNode = this.videoNode;
            /*
                Sound is only considered on if the video is not muted and volumn is more than 0
                Otherwise sound is off.
            */
            var soundState = (videoNode.muted !== true && videoNode.volume > 0) ? SOUND_STATE.ON : SOUND_STATE.OFF;

            /*
                only fire event of soundState has been changed
            */
            if (soundState !== this.soundState) {
                this.soundState = soundState;
                this.broadcast('sound' + soundState);
            } else {
                /*@<*/
                Debug.log('[ ACT_VideoEvents.js ] onVolumeChange: sound state is not changed, no event is fired');
                /*>@*/
            }
        },

        /**
         * Function to be called when we have reached our quartile milestones.
         *
         * @method progressTrack
         * @param time video time.
         * @private
         */
        progressTrack: function (time) {
            /* istanbul ignore else */
            if (this.progressParts.hasOwnProperty(time) && this.progressParts[time] === false) {
                /*@<*/
                Debug.log('[ ACT_VideoEvents.js ]: firing progressTrack @ ', time);
                /*>@*/

                this.broadcast(time);
                this.progressParts[time] = true;
            }
        },

        /**
         * Function to be called when 'play' is fired. Fires off a "start", "resume" or "replay"
         * Depending on the following logic:
         *      IF firstPlay then we have a "start"
         *      ELSE IF currentTime is between 5% and 95% then we have a "resume"
         *      ELSE IF videoEnded then we have a "replay"
         * @method onPlay
         * @param {Object} event data
         * @private
         */
        onPlay: function () {
            var videoNode = this.videoNode;
            var videoDuration = videoNode.duration;
            var currentTime = videoNode.currentTime;

            var fivePercent = (videoDuration * VIDEO_START_THRESHOLD);
            var nintyFivePercent = (videoDuration * (1 - VIDEO_START_THRESHOLD));

            /*
             IF firstPlay then "start"
             ELSE IF currentTime between the 5% and 95% then "resume"
             ELSE IF videoEnded then we have a "replay"
             */
            if (this.firstPlay === true) {
                this.firstPlay = false;
                this.broadcast('start');
            } else if (currentTime >= fivePercent && currentTime <= nintyFivePercent) {
                this.broadcast('resume');
            } else if (this.videoEnded === true) {
                this.videoEnded = false;
                this.broadcast('start');
                this.broadcast('replay');
            }
        },

        /**
         * Function to be called when the video is playing at 1 percent - and we missed our onPlay / start track
         *
         * @method on1Percent
         * @private
         */
        on1Percent: function () {
            if (this.firstPlay === true) {
                this.firstPlay = false;
                this.broadcast('start');
            }
        },

        /**
         * Function to be called when the video is playing at 25 percent
         *
         * @method on25Percent
         * @private
         */
        on25Percent: function () {
            this.progressTrack('25');
        },

        /**
         * Function to be called when the video is playing at 50 percent
         *
         * @method on50Percent
         * @private
         */
        on50Percent: function () {
            this.progressTrack('50');
        },

        /**
         * Function to be called when the video is playing at 75 percent
         *
         * @method on75Percent
         * @private
         */
        on75Percent: function () {
            this.progressTrack('75');
        },

        /**
         * Function to be called when the video is complete.
         *
         * @method onEnded
         * @param {Object} event data
         * @private
         */
        onEnded: function () {
            /* Since the video ended, we can reset all the progressParts */
            if (this.videoEnded === false) {
                this.videoEnded = true;
            }
            this.resetParts();
            this.progressTrack('ended');
        },

        /**
         * Function to be called when the video is clicked.
         *
         * @method onClicked
         * @param {Object} event data
         * @private
         */
        onClicked: function (event) {
            var videoNode = this.videoNode;
            var config = this.config;
            var prevent = config.preventOnClick || true;
            var off = {};
            var offHelper;
            var clicked;
            if (event.offsetX && event.offsetY) {
                off = { x: event.offsetX, y: event.offsetY };
            } else {
                offHelper = Dom.viewportOffset(videoNode.id);
                off = (offHelper.top && offHelper.left) ? { x: offHelper.left, y: offHelper.top } : { x: 0, y: 0 };
            }
            clicked = screenClick(videoNode, off);
            if (clicked && !this.firstPlay) {
                if (prevent) {
                    Event.preventDefault(event);
                }
                this.broadcast('clicked');
            }
        },

        /**
         * Function to be called when the video flags need to be reset. Called after onEnded event
         *
         * @method resetParts
         * @private
         */
        resetParts: function () {
            var parts = this.progressParts;
            var item;
            for (item in parts) {
                /* istanbul ignore else */
                if (this.progressParts.hasOwnProperty(item)) {
                    this.progressParts[item] = false;
                }
            }
        },

        /**
         * Function to be called when we need to disconnect tracking from the video.
         *
         * @method destroy
         * @public
         */
        destroy: function () {
            var events = this.events;
            var item;
            for (item in events) {
                /* istanbul ignore else */
                if (events.hasOwnProperty(item)) {
                    events[item].remove();
                }
            }
        }
    };

    return VideoEvent;
});
