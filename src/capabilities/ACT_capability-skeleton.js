/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * @module CapabilitySkeleton
 * @main CapabilitySkeleton
 * @class CapabilitySkeleton
 * @requires dom, lang, event, Class, Capability
 * @global
 */
ACT.define('CapabilitySkeleton', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang', 'Event', 'Class', 'Capability'], function (ACT) {
    'use strict';

    /* Constants */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Class = ACT.Class;
    var Capability = ACT.Capability;

    /**
     * This is a custom event name call by the queue
     * when the related action has been fired
     */
    var EVENT_SKELETON_CHANGE_STYLES = 'skeleton:changeStyles';

    /**
     * This is a custom global event name call by the
     * capability when the code has been processed
     */
    var EVENT_GLOBAL_ACTION_COMPLETE = 'complete:action';

    /* Action list */
    var contentActions = [{
        type: 'skeletonChangeStyles',
        argument: {
            id: {
                name: 'id',
                test: function (value) {
                    /**
                     * This test is passed by the queue in order to
                     * check the input data
                     */
                    return Lang.isString(value);
                }
            },
            styles: {
                name: 'styles',
                test: function (value) {
                    /**
                     * This test is passed by the queue in order to
                     * check the input data
                     */
                    return Lang.isObject(value);
                }
            },
            timeout: {
                name: 'timeout',
                test: function (value) {
                    /**
                     * This test is passed by the queue in order to
                     * check the input data
                     */
                    return Lang.isNumber(value) || value === undefined || value === null;
                }
            }
        },
        process: function (actionId, args) {
            Event.fire(EVENT_SKELETON_CHANGE_STYLES, {
                containerId: args.id,
                styles: args.styles,
                done: function () {
                    /**
                     * This is a callback executed at the end of the
                     * process to inform the queue that the next
                     * action is ready to go
                     */
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }
            });
        }
    }];

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('CapabilitySkeleton');
    /*>@*/

    /**
     * @class CapabilitySkeleton
     * @constructor
     */
    function CapabilitySkeleton(config) {
        this.init(config);
    }

    CapabilitySkeleton.ATTRS = {
        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'CapabilitySkeleton',

        /**
         * @attribute version
         * @type String
         */
        version: '1.1.0'

    };

    /* Public methods */
    Lang.extend(CapabilitySkeleton, [Class, Capability], {
        initializer: function (config) {
            // subscribes and save listeners
            this.initializeListeners();

            // save configObject reference
            this.set('configObject', config);

            // register action to actions-queue
            Event.fire('register:Actions', contentActions);
        },

        /**
         * Function to initialize event listeners for this instance
         *
         * @method initializeListeners
         */
        initializeListeners: function () {
            var root = this;
            /**
             * All the listeners are declared and stored here
             * in order to be unsuscribe is the node is
             * destroyed.
             */
            root.addEventListeners(

                /**
                 * This is a custom global event name call by the
                 * queue when the Ad has to be stop
                 */
                Event.on('STOP_CONTENT', function (/* eventData */) {
                    // call all methods playing (animation, play, etc...)
                }),

                /**
                 * This is a custom global event name call by the
                 * queue when the Ad has to be resize accordingly
                 * to the screen if the resize has been set in
                 * the config object
                 */
                Event.on('screen:status', function (status) {
                    if (root.get('configObject') && root.get('configObject').resize) {
                        root.resize(status, root.get('configObject'));
                    }
                }),

                /**
                 * Event trigger by the queue in order to execute
                 * the logic inside the capability
                 */
                Event.on(EVENT_SKELETON_CHANGE_STYLES, function (eventData) {
                    if (eventData.containerId === root.get('id')) {
                        root.changeStyles(eventData.styles, eventData.done);
                    }
                })
            );
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
        renderContent: function (configObject /* , env, orientation */) {
            var node = Dom.nodeCreate('div');
            node.setAttribute('id', configObject.id);
            node = this.applyNodeConfig(node, configObject);
            // set inner text
            if (configObject.containerConfig) {
                node.innerHTML = configObject.containerConfig.innerText || '';
            }
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
                Event.purgeListeners(node);
                node.parentNode.removeChild(node);
            }
        },

        /**
         * @method changeStyles
         * @param {Object} styles, information of the style to apply to node
         * @param {Function} done Optional function executed once the logic is done
         */
        changeStyles: function (styles, done) {
            var node = this.get('node');
            Dom.applyStyles(node, styles);
            if (done) {
                done();
            }
        }
    });

    return CapabilitySkeleton;
});
