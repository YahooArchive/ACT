/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * The 'ContentProgressBar' is a capability made to generate a progress bar and sync it with a targeted element.
 *
 * Example of 'SuperConf' use case:
 *
 *      {
 *          id: 'video_progressbar',
 *          type: 'content-progressbar',
 *          env: ['html', 'backup'],
 *          css: {
 *              width: '900px',
 *          },
 *          progressBarConfig: {
 *              value: 0, // initial value of progress bar
 *              sourceId: 'videoPlayer' // id of video element
 *          }
 *      }
 *
 * @module ContentProgressBar
 * @main ContentProgressBar
 * @class ContentProgressBar
 * @requires Dom, Lang, Event, Class, Capability
 * @global
 */
ACT.define('ContentProgressBar', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang', 'Event', 'Class', 'Capability'], function (ACT) {
    'use strict';

    /* Constants */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Class = ACT.Class;
    var Capability = ACT.Capability;

    /* CONSTANT VALUES */
    // millisecond between each times we try to detect the source DOM element
    var LEAP_DETECT_TIME = 100; // milliseconds
    // maximum times we allow to run the detect source DOM element
    var MAX_DETECT_TIMES = 600; // => similar to 1 minute

    /*@<*/
    var Debug = ACT.Debug;
    var debugLog = function (message) {
        Debug.log('[ ACT_contentProgressBar ]: ' + message);
    };
    debugLog('Loaded');
    /*>@*/

    /**
     * @constructor
     */
    function ContentProgressBar(config) {
        this.init(config);
    }

    ContentProgressBar.ATTRS = {

        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'ContentProgressBar',

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
        node: null,

        /**
         * Id if source Node
         * @attribute sourceId
         */
        sourceId: '',

        /**
         * Dom Node which is synced with the progressBar
         * @attribute sourceNode
         */
        sourceNode: null,

        /**
         * Type of Dom Node which is synced with the progressBar. Video or Audio
         * @attribute sourceType
         */
        sourceType: 'video',

        /**
         * number of times we have tried to detect source Dom element
         * @attribute detectTimes
         */
        detectTimes: 0,

        /**
         * flag to make sure this sync only happen once
         * @attribute isSyncTargetToNode
         */
        isSyncTargetToNode: false,

        /**
         * flag to make sure this sync only happen once
         * @attribute isSyncNodeToTarget
         */
        isSyncNodeToTarget: false
    };

    /* Private methods */

    /**
     * Render the node from given config object, environment and orientation state
     *
     * @method renderContent
     * @private
     * @param {Object} configObject
     * @param {String} env
     * @param {String} orientation
     * @return {HTMLElement} node
     */
    function renderContent(configObject) {
        var node;
        if (document.createElement('progress').max === undefined) {
            /*@<*/
            Debug.error('[ ACT_contentProgressBar.js ]: progress tag is not supported by this browser');
            /*>@*/
            return null;
        }

        node = Dom.nodeCreate('<progress max="100"></progress>').firstChild;
        node.id = configObject.id;

        // set class name
        if (Lang.isString(configObject.classNode)) {
            node.className += configObject.classNode;
        }

        // set tag attributes
        Dom.setAttributes(node, configObject.progressBarConfig);

        // set css styles
        Dom.applyStyles(node, configObject.css || {});

        /*@<*/
        debugLog('Generated node:', node);
        /*>@*/

        return node;
    }


    /* Public methods */
    Lang.extend(ContentProgressBar, [Capability, Class], {

        /**
         * Function auto initiated when the class is instantiated
         *
         * @method initializer
         * @public
         * @param {Object} config
         */
        initializer: function (config) {
            // save configObject reference
            this.set('configObject', config);

            /* istanbul ignore else */
            if (Lang.objHasKey(config, 'progressBarConfig') && Lang.objHasKey(config.progressBarConfig, 'sourceId')) {
                this.set('sourceId', config.progressBarConfig.sourceId);
            }

            // detec Dom element of source Node
            this.detectSource();
        },

        /**
         * detech source element and type from its ID
         * @method detectSource
         */
        detectSource: function () {
            var root = this;
            var nodeId = root.get('sourceId');
            var node;

            /* istanbul ignore else */
            if (nodeId) {
                node = ACT.Dom.byId(nodeId);
                /*@<*/
                debugLog('try to get target DomElement' + node);
                /*>@*/
                // if node is not available yet then we will try it again and again until it's available
                /* istanbul ignore if */
                if (!Dom.isDomElement(node)) {
                    if (root.get('detectTimes') < MAX_DETECT_TIMES) {
                        window.setTimeout(function () {
                            var counter = root.get('detectTimes');
                            root.set('detectTimes', counter++);
                            root.detectSource();
                        }, LEAP_DETECT_TIME);
                    }
                } else {
                    /*@<*/
                    debugLog('target node is available and ready');
                    /*>@*/
                    root.set('sourceNode', node);
                    root.set('sourceType', node.tagName.toLowerCase());
                    // sync progress of source node with value of progress bar
                    root.syncTargetToNode();
                }
            }
        },

        /**
         * Function called when the instance is destroyed
         *
         * @method destructor
         * @public
         */
        destructor: function () {
            var node = this.get('node');

            /* istanbul ignore else */
            if (Dom.isDomElement(node) && node.parentNode) {
                // Event.purgeListeners(node);
                node.parentNode.removeChild(node);
            }
        },

        /**
         * Function generating the node 'IMG'
         *
         * @method getContent
         * @public
         * @param {String} env Environment for rendering content such as html/flash/backup
         * @param {String} orientation Orientation of current device such as landscape and portraits for mobile
         * @return {HTMLElement} node
         */
        getContent: function (env, orientation) {
            var node = this.get('node');

            if (node === null) {
                node = renderContent(this.get('configObject'), env, orientation);
                this.set('node', node);
                // reflect changes in node into the target Element
                this.syncNodeToTarget();
            }

            return {
                node: node
            };
        },

        /**
         * Listen to changes from the target element and update progressBar accordingly
         *
         * @method syncWithTargetNode
         */
        syncTargetToNode: function () {
            var root = this;
            var targetNode;
            var targetType;
            /* istanbul ignore if */
            if (this.get('isSyncTargetToNode') === true) {
                return;
            }

            targetNode = this.get('sourceNode');
            targetType = this.get('sourceType');

            // currently we only support video
            /* istanbul ignore else */
            if (targetNode && targetType === 'video') {
                root.addEventListeners(
                    // listen to timeupdate event from target video then update progressbar accordingly
                    Event.on('timeupdate', function () {
                        var percentage = (targetNode.currentTime / targetNode.duration) * 100;
                        root.updateProgress(percentage);
                    }, targetNode, root)
                );
            }
            root.set('isSyncTargetToNode', true);
        },

        /**
         * Update target based on changes in progressBar
         *
         * @method syncWithTargetNode
         */
        syncNodeToTarget: function () {
            var root = this;
            /* istanbul ignore if */
            if (this.get('isSyncNodeToTarget') === true) {
                return;
            }

            root.addEventListeners(
                // listen to click on progress bar and update targetNode with new value
                Event.on('click', function (eventData) {
                    // get click position on progress bar
                    var percentage = root.getClickPosition(eventData);

                    // this detection must be inside event because highly chance that when click event is registered, the targetNode is not ready yet
                    var targetNode = root.get('sourceNode');
                    var targetType = root.get('sourceType');

                    // currently we only support video
                    /* istanbul ignore else */
                    if (targetNode && targetType === 'video') {
                        /*@<*/
                        debugLog('click on progressbar, update video currentTime to ' + percentage);
                        /*>@*/
                        targetNode.currentTime = (targetNode.duration * percentage) / 100;
                        root.updateProgress(percentage);
                    }
                }, root.get('node'), root)
            );

            root.set('isSyncNodeToTarget', true);
        },

        /**
         * Update current progress bar value
         * @method updateProgress
         * @attribte {String|Number} new value
         */
        updateProgress: function (newValue) {
            this.get('node').setAttribute('value', newValue);
        },

        /**
         * Get position of the click on progress bar and compare it with progress bar with to get the percentage
         * @method getClickPosition
         * @return {Number} percentage
         */
        getClickPosition: function (eventData) {
            var node = this.get('node');
            var nodeOffset = node.getBoundingClientRect();
            var percentage = 100 * (eventData.clientX - nodeOffset.left) / nodeOffset.width;
            return percentage;
        }
    });

    return ContentProgressBar;
});
