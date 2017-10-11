/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * The 'LayerStandard' is a core module made to generate a parent 'DIV' tag container with a specific position/configuration.
 * This module is used in 'Layerslist'.
 *
 * @module LayerStandard
 * @main LayerStandard
 * @class LayerStandard
 * @requires Dom, Event, Lang, Scaffolding, Class
 * @global
 */
ACT.define('LayerStandard', [/*@<*/'Debug', /*>@*/ 'Dom', 'Event', 'Lang', 'Scaffolding', 'Class'], function (ACT) {
    'use strict';

    /* Shorthand */
    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Dom = ACT.Dom;
    var Class = ACT.Class;

    /**
     * @constant TYPE
     */
    var TYPE = 'standard';

    /**
     * @constant DEFAULT_STYLE
     */
    var DEFAULT_STYLE = {
        overlay: {
            position: 'absolute',
            'z-index': '1000000'
        },
        inline: {
            position: 'relative'
        },
        anchor: {
            position: 'fixed',
            'z-index': '1000000'
        }
    };
    var CENTER_STYLES;

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_layerStandard.js ] Loaded');
    /*>@*/

    /**
     * @constructor
     */
    function LayerStandard(config) {
        this.init(config);
        // LayerStandard.superclass.constructor.apply(this, arguments);
    }

    /**
     * Private functions
     */

    /**
     * Creating Css object for centering content in horizontal coordinate
     *
     * @method centerHorizontal
     * @private
     * @param {Object} config Style config for calculation
     * @return {Object} CSS object for applying center in horizontal coordinate
     */
    function centerHorizontal(config) {
        var width = parseInt(config.width, 10) || 0;

        return {
            'margin-left': -(width / 2) + 'px',
            left: '50%'
        };
    }

    /**
     * Creating Css object for centering content in vertical coordinate
     *
     * @method centerVertical
     * @private
     * @param {Object} config Style config for calculation
     * @return {Object} CSS object for applying center in vertical coordinate
     */
    function centerVertical(config) {
        var height = parseInt(config.height, 10) || 0;
        return {
            'margin-top': -(height / 2) + 'px',
            top: '50%'
        };
    }

    /**
     * Creating Css object for centering content in both horizontal and vertical coordinates
     *
     * @method centerBoth
     * @private
     * @param {Object} config Style config for calculation
     * @return {Object} CSS object for applying center in both coordinates (horizonal and vertical)
     */
    function centerBoth(config) {
        var centerH = centerHorizontal(config);
        var centerV = centerVertical(config);

        return Lang.merge(centerH, centerV);
    }

    /**
     * Collection of different styles for centering content
     * @constant CENTER_STYLES
     */
    CENTER_STYLES = {
        both: centerBoth,
        horizontal: centerHorizontal,
        vertical: centerVertical
    };

    /**
     * @method alignHorizontal
     * @private
     * @param {Object} config Object for setting style
     * @return {Object} Object style
     */
    function alignHorizontal(config, style) {
        if (config.alignH !== undefined) {
            style[config.alignH] = parseInt(config.x, 10) + 'px';
        } else {
            style.left = parseInt(config.x, 10) + 'px';
        }
    }

    /**
     * @method alignVertical
     * @private
     * @param {Object} config Object for setting style
     * @return {Object} Object style
     */
    function alignVertical(config, style) {
        if (config.alignV !== undefined) {
            style[config.alignV] = parseInt(config.y, 10) + 'px';
        } else {
            style.top = parseInt(config.y, 10) + 'px';
        }
    }

    /**
     * @method applyStyles
     * @private
     * @param {Object} config Object for setting style
     * @return {Object} Object style
     */
    function applyStyles(config, x, y) {
        var style = Lang.clone(DEFAULT_STYLE[config.type]) || {};
        var styleForCentering;
        /*@<*/
        Debug.log('[ ACT_layerStandard.js ] LayerStandard: x and y ', x, y);
        /*>@*/

        // set general layer stylr
        if ((config.type === 'overlay') || (config.type === 'anchor')) {
            if (x !== config.x && y !== config.y) {
                style.left = parseInt(x, 10) + 'px';
                style.top = parseInt(y, 10) + 'px';
            } else {
                // set horizontal alignement
                alignHorizontal(config, style);

                // set vertical alignement
                alignVertical(config, style);
            }
        }

        // set style width and height
        style.width = config.width;
        style.height = config.height;

        // applying center style of it set in config object
        if (config.center && (config.center in CENTER_STYLES)) {
            styleForCentering = CENTER_STYLES[config.center](config);
            style = Lang.merge(style, styleForCentering);
        }

		// If CSS is passed in with the container definition, merge that in to overwrite
		// the default settings.
		if (config.css && Lang.isObject(config.css)) {
			style = Lang.merge(style, config.css);
		}

        return style;
    }

    /**
     * default attribute
     */
    LayerStandard.ATTRS = {
        NAME: 'LayerStandard',

        /**
         * Config Object for initializing layer instance
         * @attribute config
         * @type Object
         * @default null
         */
        config: null,

        /**
         * @attribute layerName
         * @type String
         */
        layerName: '',

        /**
         * @attribute container
         * @type HTMLElement
         * @default null
         */
        container: null,

        /**
         * Position to render layer, sShould be div id/class or body tag
         * @attribute base
         * @type String
         * @default body
         */
        base: 'body',

        /**
         * Attribute for keeping playing state of the layer
         * @attribute playing
         * @type Boolean
         * @default false
         */
        playing: false,

        /**
         * @attribute envToPlay
         * @type String
         * @default html
         */
        envToPlay: 'html',

        /**
         * @attribute currentDevice
         * @type String
         * @default desktop
         */
        currentDevice: 'desktop',

        /**
         * The alignV is used in anchor and overlay layers to define if posY should move the layer vertically from 'top' or 'bottom'. Default is 'top'
         * @attribute alignV
         * @public
         * @type String
         * @default top
         */
        alignV: 'top',

        /**
         * The alignH is used in anchor and overlay layers to define if posX should move the layer vertically from 'left' or 'right'. Default is 'left'
         * @attribute alignH
         * @public
         * @type String
         */
        alignH: 'left',

        /**
         * Only accept tl - tr - bl - br
         * @attribute coordinate
         * @type String
         * @default tl
         */
        coordinate: 'tl',

        /**
         * @attribute contentAppended
         * @type Boolean
         * @default false
         */
        contentAppended: false,

        /**
         * List of capability instances rendered inside this layer
         * @attribute capabilityInstances
         */
        capabilityInstances: [],

        /**
         * Flag to indicate if the layer should be tracked by dwelltime or not
         *
         * @attribute dwelltime
         * @default false
         */
        dwelltime: false,

        /**
         * reference to dwelltime tracking instances
         * @attribte dwelltimeInstance
         */
        dwelltimeInstance: null
    };

    /**
     * Public properties
     */
    Lang.extend(LayerStandard, Class, {

        /**
         * Function auto initiated when the class is instantiated
         *
         * @method initializer
         * @public
         * @param {Object} config
         */
        initializer: function (config) {
            var allowedToPlay = true;
            // need to keep a reference to original layer config
            this.set('config', config);
            this.set('width', config.width);
            this.set('height', config.height);

            if ('contentLayer' in config && config.contentLayer.env) {
                allowedToPlay = Lang.inArray(config.contentLayer.env, config.envToPlay);
            }

            /*@<*/
            Debug.log('[ ACT_layerStandard.js ] recieved config:', config);
            /*>@*/

            /* create container */
            if (allowedToPlay === true) {
                this.createContainer();
                /* initialize dwelltime */
                if (this.get('dwelltime')) {
                    this.initDwellTimeTracking();
                }
            }
        },

        /**
         * Method to return the type of the layer
         *
         * @method getType
         * @public
         * @return {String} type of the layer
         */
        getType: function () {
            return TYPE;
        },

        /**
         * Function to render layer container
         *
         * @method createContainer
         * @public
         * @return {Element} node container
         */
        createContainer: function () {
            var nodeId = 'ACT_' + this.get('layerName');
            // ES3: Removing .querySelector('div'); replacing with firstChild
            var container = Dom.nodeCreate('<div style="display:none;" id="' + nodeId + '"></div>').firstChild;
            var baseSelector = this.get('base');
            var base;

            this.set('container', container);
            /* search order: tag Name -> tag id -> class name (tag name first to make sure we get body tag)
            */
            base = document.getElementsByTagName(baseSelector)[0] || Dom.byId(baseSelector) || Dom.byClassName(baseSelector)[0];

            /*@<*/
            Debug.log('[ ACT_layerStandard.js ] : baseSelector is: ', baseSelector, base);
            /*>@*/

            if (base) {
                base.appendChild(container);
            }
        },

        /**
         * Add content directly or from config-object to layer container
         *
         * @method addContent
         * @public
         * @param {Element | String} [content] new content to add to layer container
         */
        addContent: function (content) {
            var root = this;
            var htmlParsered;
            var contentParsered;
            var myContentLayer = root.get('contentLayer');
            var allowedEnv = myContentLayer.env;
            var allowedToPlay = true;

            if (allowedEnv) {
                allowedToPlay = Lang.inArray(allowedEnv, root.get('envToPlay'));
            }

            if (allowedToPlay === true) {
                if (!content) {
                    // TODO: Sinon test fails if Scaffolding's shorthand version is used - Since this is the only place Scaffolding is
                    //     instatiated, I'm going to leave it as is.
                    /* call scafolding and add content */
                    htmlParsered = new ACT.Scaffolding({
                        refObj: root.get('contentLayer'), // .contentLayer,
                        env: root.get('envToPlay'),
                        status: 'status',
                        layerName: root.get('layerName')
                    });

                    contentParsered = htmlParsered.getHtmlParsered();
                    content = contentParsered.rawHtml;
                    root.set('capabilityInstances', contentParsered.capabilityInstances);
                }

                if (Dom.isDomElement(content)) {
                    root.get('container').appendChild(content);
                } else {
                    root.get('container').innerHTML += content;
                }

                root.set('contentAppended', true);
            }
        },

        /**
         * Function to play layer
         *
         * @method play
         * @public
         */
        play: function () {
            var root = this;

            // updating layer position first
            root.updateLayerPosition(function () {
                // re-applying style for layer container incase surrounding env changed
                var containerStyles = applyStyles(root.get('config'), root.get('x'), root.get('y'));

                /*@<*/
                Debug.info('[ ACT_layerStandard.js ] containerStyles : ', containerStyles);
                /*>@*/

                Dom.applyStyles(root.get('container'), containerStyles);

                if (!root.get('contentAppended')) {
                    root.addContent();
                }

                Dom.display(root.get('container'), 'block');

                root.set('playing', true);

                // send a message to any content about start it
                Event.fire('layer:played', {
                    layerName: root.get('layerName')
                });
                // checks if content is being added otherwise do so
            });
        },

        /**
         * Function to clean all capability instances belong to this layer
         *
         * @method cleanCapabilityInstance
         * @public
         */
        cleanCapabilityInstance: function () {
            // get all capability instances and destroy them
            var capabilityInstances = this.get('capabilityInstances');
            var instance;
            while (capabilityInstances.length > 0) {
                instance = capabilityInstances.pop();
                instance.destroy();
            }
        },

        /**
         * Function to stop layer
         *
         * @method stop
         * @public
         * @param {Boolean} forceToDestroy
         */
        stop: function (forceToDestroy) {
            var root = this;
            var container = root.get('container');

            /* send a message to any content about start it */
            if (forceToDestroy) {
                root.cleanCapabilityInstance();
                Dom.clear(container);
                root.set('contentAppended', false);
            } else {
                // Dom.display(container, 'none');
            }

            Dom.display(container, 'none');

            root.set('playing', false);

            Event.fire('layer:stopped', {
                layerName: root.get('layerName')
            });
        },

        /**
         * Function to update current layer position
         *
         * @method updateLayerPosition
         * @public
         * @param {Function} callback Function to be executed when the update finish
         */
        updateLayerPosition: function (callback) {
            var root = this;
            var config = root.get('config');
            var layerName = root.get('layerName');
            var coordinate = root.get('coordinate');

            var attrToUpdate = {
                x: config.x,
                y: config.y
            };

            // listen to event fired back by layerList with new attribute value
            var listener = Event.on('layersList:getLayerPosition:complete', function (e) {
                /*@<*/
                Debug.log('[ ACT_layerStandard.js ] LayersList: new position for ', e.layerName, e.newValue);
                /*>@*/
                // just to double check if this event is for this layer
                if (e.layerName === layerName) {
                    // stop listening to avoid messing event arround
                    listener.remove();
                    // update layer position with new value
                    root.setAttrs(e.newValue);
                    // execute next action
                    callback();
                }
            });

            // fire event to layerList asking for calculating layer position
            Event.fire('layersList:getLayerPosition', {
                layerName: layerName,
                attributes: attrToUpdate,
                coordinate: coordinate
            });
        },

        /**
         * Get current position of the layer
         *
         * @method currentLayerPosition
         * @public
         * @return {Array} Position X and Y. E.g [x, y]
         */
        currentLayerPosition: function () {
            return Dom.getElementPosition(this.get('container'));
        },

        /**
         * Setup dwelltime tracking for the layer
         * @method initDwellTimeTracking
         */
        initDwellTimeTracking: function () {
            var dwellTime = new ACT.DwellTime({
                targetElement: this.get('container'),
                targetName: this.get('layerName')
            });

            this.set('dwelltimeInstance', dwellTime);
        }
    });

    return LayerStandard;
});
