/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT, AdobeEdge */
/**
 * This capability will get the config for AdobeBride, rendering content and provide helper functions
 * Feature including:
 * - create AdobeBride composition
 * -
 *
 * @module ContentAdobeEdge
 * @main ContentAdobeEdge
 * @class ContentAdobeEdge
 * @requires dom, lang, event, Class, Capability
 * @global
 */
ACT.define('ContentAdobeEdge', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang', 'Event', 'Class', 'Capability'], function (ACT) {
    'use strict';

    /* Constants */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Class = ACT.Class;
    var Capability = ACT.Capability;

    var EVENT_GLOBAL_ACTION_COMPLETE = 'complete:action';
    var EVENT_GLOBAL_ACTION_REGISTER = 'register:Actions';
    var EVENT_GLOBAL_ACTION_ADD = 'add:actions';

    // this event should be fired from AdobeBridge composition
    var EVENT_ADOBE_EDGE_ACTION_TRIGGER = 'ContentAdobeEdge:actions';

    var EVENT_ACTION_REPLAY = 'ContentAdobeEdge:replay';

    /* Action list */
    var contentActions = [{
        type: 'replayAdobeEdgeComposition',
        argument: {
            instanceId: {
                name: 'instanceId',
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
        process: function (actionId, args) {
            Event.fire(EVENT_ACTION_REPLAY, args);
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }];

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_contentAdobeEdge.js ] : ContentAdobeEdge');
    /*>@*/

    /**
     * @class ContentAdobeEdge
     * @constructor
     */
    function ContentAdobeEdge(config) {
        this.init(config);
    }

    ContentAdobeEdge.ATTRS = {
        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'ContentAdobeEdge',

        /**
         * @attributes instanceId
         */
        instanceId: '',

        /**
         * @attribute eventActions
         */
        eventActions: {},

        /**
         * Reference to AdobeEdge composition rendered by the instance
         * @attribute composition
         */
        composition: null

    };

    /* Public methods */
    Lang.extend(ContentAdobeEdge, [Class, Capability], {

        initializer: function (config) {
            // save configObject reference
            this.set('configObject', config);
            this.set('instanceId', config.id);
            this.set('compositionId', config.adobeEdgeConfig.compositionId);

            // subscribes and save listeners
            this.initializeListeners();
            this.initializeEventTriggers();
            // register action to actions-queue
            Event.fire(EVENT_GLOBAL_ACTION_REGISTER, contentActions);
        },

        /**
         * Function to initialize event listeners for this instance
         *
         * @method initializeListeners
         */
        initializeListeners: function () {
            var root = this;
            root.addEventListeners(
                Event.on(EVENT_ACTION_REPLAY, function (eventData) {
                    if (eventData.instanceId === root.get('instanceId')) {
                        root.replay();
                    }
                }),

                Event.on(EVENT_ADOBE_EDGE_ACTION_TRIGGER, function (eventData) {
                    var eventActions;
                    if (eventData.compositionId === root.get('compositionId')) {
                        // add all actions into queue
                        eventActions = root.get('eventActions');
                        if (Lang.objHasKey(eventActions, eventData.eventType)) {
                            Event.fire(EVENT_GLOBAL_ACTION_ADD, root.get('eventActions')[eventData.eventType]);
                        }
                    }
                })
            );
        },

        /**
         * Function to map eventTriggers keyword with list of associate actions defined in config object
         *
         * @method initializeEventTriggers
         */
        initializeEventTriggers: function () {
            var index;
            var actionsConfig;
            var eventActions;
            var eventConfig = this.get('configObject').eventConfig;

            // append eventConfig
            if (Lang.isArray(eventConfig)) {
                eventActions = this.get('eventActions');
                for (index = 0; index < eventConfig.length; index ++) {
                    actionsConfig = eventConfig[index];
                    eventActions[actionsConfig.eventType] = actionsConfig.actions;
                }
                this.set('eventActions', eventActions);
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
            var node = Dom.nodeCreate('<div></div>').firstChild;
            node = this.applyNodeConfig(node, configObject);
            // return node
            return node;
        },
        /**
         * @method getContent
         * @param {String} env Environment for rendering content such as html/flash/backup
         * @param {String} orientation Orientation of current device such as landscape and portraits for mobile
         * @return {HTMLElement} node
         */
        getContent: function (env, orientation) {
            var node = this.renderContent(this.get('configObject'), env, orientation);
            // save reference to the node
            this.set('node', node);
            // create AdobeEdge composition
            this.createAdobeEdgeComposition();
            return {
                node: node
            };
        },

        /**
         * Function to be called when the instance is destroyed
         *
         * @method destructor
         */
        destructor: function () {
            var node = this.get('node');
            if (Dom.isDomElement(node) && node.parentNode) {
                // Event.purgeListeners(node);
                node.parentNode.removeChild(node);
            }
        },

        /**
         * Replay animation of AdobeEdge composition
         * @method replay
         */
        replay: function () {
            var composition = this.get('composition');
            /*@<*/
            Debug.log('[ ACT_contentAdobeEdge.js ] : replay is called. ');
            /*>@*/
            if (composition !== null) {
                composition.getStage().playAll();
            }
        },

        /**
         * function to create AdobeEdge composition
         *
         * @method createAdobeEdgeComposition
         */
        createAdobeEdgeComposition: function () {
            var root = this;
            var configObject = root.get('configObject');
            var compositionConfig = configObject.adobeEdgeConfig;
            var compositionLink = compositionConfig.compositionLink;
            var compositionId = compositionConfig.compositionId;
            var compositionOptions = compositionConfig.options;
            var compositionDomeBefore = compositionConfig.domBefore;
            var compositionDomeAfter = compositionConfig.domAfter;
            var holderId = configObject.id;
            var assetLoad;

            // compositionId must be one of the class in node holder
            this.get('node').classList.add(compositionId);

            assetLoad = setInterval(function () {
                var assetContainer = document.getElementById(holderId);
                if (assetContainer) {
                    AdobeEdge.loadComposition(compositionLink, compositionId, compositionOptions, compositionDomeBefore, compositionDomeAfter);
                    // listen when the composition has been initialized
                    // then save the reference to the composition for later use
                    AdobeEdge.bootstrapCallback(function (compId) {
                        if (compId === compositionId) {
                            root.set('composition', AdobeEdge.getComposition(compId));
                        }
                    });
                    clearInterval(assetLoad);
                }
            }, 100);
        }
    });

    return ContentAdobeEdge;
});
