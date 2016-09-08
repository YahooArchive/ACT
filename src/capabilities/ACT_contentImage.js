/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * The 'ContentImage' is a capability made to generate a 'IMG' tag.
 *
 * Example of 'SuperConf' use case:
 *
 *      {
 *          id: 'mpu_image',
 *          type: 'content-image',
 *          classNode: 'mpu_image_class',
 *          env: ['html','flash','backup'],
 *          css: {
 *              width: 300,
 *              height: 250
 *          },
 *          imageConfig: {
 *              src: '',
 *              alt: '',
 *              title: ''
 *          }
 *      }
 *
 * @module ContentImage
 * @main ContentImage
 * @class ContentImage
 * @requires Dom, Lang, Event, Class, Capability
 * @global
 */
ACT.define('ContentImage', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang', 'Event', 'Class', 'Capability'], function (ACT) {
    'use strict';

    /* Constants */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Class = ACT.Class;
    var Capability = ACT.Capability;

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('ContentImage Loaded');
    /*>@*/

    /**
     * @constructor
     */
    function ContentImage(config) {
        this.init(config);
        // ContentImage.superclass.constructor.apply(this, arguments);
    }

    ContentImage.ATTRS = {

        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'ContentImage',

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
        node: null

    };

    /* Private methods */

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
            /* istanbul ignore else */
            if (attrs.hasOwnProperty(attr)) {
                node.setAttribute(attr, attrs[attr]);
            }
        }
    }

    /* Public methods */
    Lang.extend(ContentImage, [Capability, Class], {

        /**
         * Function auto initiated when the class is instantiated
         *
         * @method initializer
         * @public
         * @param {Object} config
         */
        initializer: function (config) {
            // subscribes and save listeners
            this.initializeListeners();
            // save configObject reference
            this.set('configObject', config);
        },

        /**
         * Function to initialize event listeners for this instance
         *
         * @method initializeListeners
         * @public
         */
        initializeListeners: function () {
            var root = this;
            root.addEventListeners(
                Event.on('screen:status', function (status) {
                    if (root.get('configObject') && root.get('configObject').resize) {
                        root.resize(status, root.get('configObject'));
                    }
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

            if (Dom.isDomElement(node) && node.parentNode) {
                // Event.purgeListeners(node);
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
            var node = Dom.nodeCreate('<img style="display:none" />').firstChild;

            node.onload = function () {
                this.style.display = '';
            };

            // set tag attributes
            setAttributes(node, {
                id: configObject.id,
                src: configObject.imageConfig.src,
                alt: configObject.imageConfig.alt,
                title: configObject.imageConfig.title
            });

            node = this.applyNodeConfig(node, configObject);

            /*@<*/
            Debug.log('ContentImage: Generated node:', node);
            /*>@*/

            return node;
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
            var node = this.renderContent(this.get('configObject'), env, orientation);

            // save reference to the node
            this.set('node', node);

            return {
                node: node
            };
        }
    });

    return ContentImage;
});
