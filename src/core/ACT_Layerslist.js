/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * The 'LayersList' is a core module made to manage the layers functionalities.
 * This module is used in 'StandardAd'.
 *
 * @module LayersList
 * @main LayersList
 * @class LayersList
 * @requires Lang, Dom, Event, Class, LayerStandard
 * @global
 */
ACT.define('LayersList', [/*@<*/'Debug', /*>@*/ 'Lang', 'Dom', 'Event', 'Class', 'LayerStandard'], function (ACT) {
    'use strict';

    /* Shorthand */
    var Event = ACT.Event;
    var Lang = ACT.Lang;
    var Class = ACT.Class;
    var LayerStandard = ACT.LayerStandard;
    /**
     * Default render position for layers
     * @constant DEFAULT_BASE
     * @private
     */
    var DEFAULT_BASE = 'act-ad';

    /**
     * Actions for LayersList module
     *
     * @array actions
     * @private
     */
    var actions = [{
        type: 'playLayer',
        argument: {
            to: {
                name: 'to'
            },
            timeout: {
                name: 'timeout',
                test: function (value) {
                    return Lang.isNumber(value) || value === undefined || value === null;
                }
            }
        },

        process: function (actionId, values) {
            /* istanbul ignore next */
            var to = values.to;
            Event.fire('layersList:open', {
                layerToOpen: to,
                actionId: actionId
            });
        }
    }, {
        type: 'stopLayer',
        argument: {
            to: {
                name: 'to'
            },
            destroy: {
                name: 'destroy'
            },
            timeout: {
                name: 'timeout',
                test: function (value) {
                    return Lang.isNumber(value) || value === undefined || value === null;
                }
            }
        },
        process: function (actionId, values) {
            var attrs;
            /* istanbul ignore next */
            values.destroy = (values.destroy === 'true' || values.destroy === true);
            attrs = {
                layerToStop: values.to,
                destroy: values.destroy,
                actionId: actionId
            };
            Event.fire('layersList:stop', attrs);
        }
    }];
    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_Layerslist.js ]: Loaded');
    /*>@*/

    /**
     * @constructor
     */
    function LayersList(config) {
        this.init(config);
    }

    LayersList.ATTRS = {
        NAME: 'LayersList',
        version: '1.0.22',
        envToPlay: undefined,
        layersList: [],
        layersConfig: {},
        layersMap: {},
        isDarlaLayerPlaying: false
    };

    Lang.extend(LayersList, Class, {

        initializer: function (config) {
            var root = this;
            root.set('layersConfig', config.layersConfig);
            root.createLayers();
            root.initializeEvents();
            Event.fire('register:Actions', actions);
        },

        /**
         * Method to start off listeners
         *
         * @method initListeners
         * @public
        */

        initializeEvents: function () {
            var root = this;
            root.addEventListeners(
                Event.on('layersList:open', function (to) {
                    if (root.get('isDarlaLayerPlaying')) {
                        Event.fire('complete:action', to.actionId);
                        return;
                    }

                    if (root.isLayerPlaying(to.layerToOpen)) {
                        Event.fire('complete:action', to.actionId);
                        return;
                    }

                    root.playLayer(to.layerToOpen, to.actionId);
                }),

                Event.on('layersList:stop', function (attrs) {
                    if (!root.isLayerPlaying(attrs.layerToStop)) {
                        Event.fire('complete:action', attrs.actionId);
                        return;
                    }
                    root.stopLayer(attrs);
                }),

                Event.on('layersList:playAllLayers', function () {
                    root.playAllLayers();
                }),

                Event.on('layersList:stopAllLayers', function () {
                    root.stopAllLayers();
                }),

                Event.on('layersList:existLayer', function (e) {
                    var layerExists = root.checkLayerExists(e.layerName);
                    Event.fire('layersList:existLayerResult', layerExists);
                }),

                Event.on('layersList:resetInlineFrame', function () {
                    var action = {
                        type: 'contractInlineFrame'
                    };
                    Event.fire('add:actions', action);
                }),

                Event.on('layersList:getLayerPosition', function (e) {
                    root.getLayerPosition(e.layerName, e.coordinate, e.attributes);
                })
            );
        },

        /**
         * Function to check type of layer
         *
         * @method whatTypeOfLayer
         * @param {Object} layerConfig Config Object for layer
         * @return {String} 'normal' or 'frame' (frame is darla-layer)
         * @public
         */
        whatTypeOfLayer: function (layerConfig) {
            if (layerConfig.base === DEFAULT_BASE) {
                return 'normal';
            }
            return this.get('sDarlaAPI') && layerConfig.frame ? 'frame' : 'normal';
        },

        /**
         * Function to create layer objects based on theirs configObject
         * New layer objects will be pushed in layersList attributes
         *
         * @method createLayers
         * @param [Object] layersConfig
         * @public
         */
        createLayers: function (layersConfig) {
            var root = this;
            var copyLayersConfig = layersConfig || root.get('layersConfig');
            var layer;
            var allowedToPlay;

            for (layer in copyLayersConfig) {
				if (copyLayersConfig.hasOwnProperty(layer)) {
					allowedToPlay = true;
					if (copyLayersConfig[layer].contentLayer.env) {
						allowedToPlay = Lang.inArray(copyLayersConfig[layer].contentLayer.env, this.get('envToPlay'));
					}

					if (allowedToPlay === true) {
						if (root.whatTypeOfLayer(copyLayersConfig[layer]) === 'normal') {
							this.makeNormalLayer(copyLayersConfig[layer]);
						} else {
							this.makeSdarlaLayer(copyLayersConfig[layer]);
						}
					}
				}
			}
		},

        /**
         * Function to create new LayerStandard from config object
         *
         * @method makeNormalLayer
         * @param {Object} layerConfig Config Object for new layer
         * @public
         */
        makeNormalLayer: function (layerConfig) {
            var layersList = this.get('layersList');
            var layersMap = this.get('layersMap');
            var normalLayer;

            // should put env and status into layerConfig
            layerConfig.envToPlay = this.get('envToPlay');
            layerConfig.status = this.get('status');
            normalLayer = new LayerStandard(layerConfig);
            layersList.push(normalLayer);
            this.set('layersList', layersList);
            layersMap[layerConfig.layerName] = normalLayer;
            this.set('layersMap', layersMap);
        },

        /**
         * Function to create new LayerSdarla from config object
         *
         * @method makeSdarlaLayer
         * @param {Object} layerConfig Config object for new layer
         * @public
         */
        makeSdarlaLayer: function (layerConfig) {
            var layersList = this.get('layersList');
            var layersMap = this.get('layersMap');
            var sDarlaLayer = new ACT.LayerSdarla({
                config: layerConfig,
                envToPlay: this.get('envToPlay'),
                status: this.get('status')
            });

            layersList.push(sDarlaLayer);
            this.set('layersList', layersList);
            layersMap[layerConfig.layerName] = sDarlaLayer;
            this.set('layersMap', layersMap);
        },

        /**
         * Return the required layer from the layersList array, otherwise return false if not found
         *
         * @method getLayer
         * @param {String} layerName
         * @return {Object} layer from layersList array
         * @public
         */
        getLayer: function (layerName) {
            var i;
            var savedLayer;
            var allLayers = this.get('layersList');

            for (i = 0; i < allLayers.length; i++) {
                savedLayer = allLayers[i];
                if (savedLayer.get('layerName') === layerName) {
                    return savedLayer;
                }
            }

            return false;
        },

        /**
         * Function to check if the layer exists in the config
         *
         * @method checkLayerExists
         * @param {String} layerName name of the layer
         * @public
         */
        checkLayerExists: function (layerName) {
            var layerExists = false;
            var layer = this.getLayer(layerName);
            /* istanbul ignore else */
            if (layer) {
                layerExists = true;
            }
            return layerExists;
        },

        /**
         * Function to play all declared layers
         * @method playAllLayers
         * @public
         */
        playAllLayers: function () {
            var root = this;
            var actionsSet = [];
            var action;
            var allLayers = root.get('layersList');
            var i;

            for (i = 0; i < allLayers.length; i++) {
                action = {
                    type: 'playLayer',
                    to: allLayers[i].get('layerName'),
                    animate: false
                };
                actionsSet.push(action);
            }

            Event.fire('add:actions', actionsSet);
        },

        /**
         * Play a layer
         *
         * @method playLayer
         * @param {String} layerName Name of the layer to be played
         * @param {Number} actionId ID of the action sent by actionsQueue to play layer
         * @public
         */
        playLayer: function (layerName, actionId) {
            var layer = this.getLayer(layerName);
            /* istanbul ignore else */
            if (layer) {
                this.playLayerAction(layer, actionId);
                layer.play();
            } else {
				/* Since the layer can't play - because it's not real, we want to fire a complete action to unclog the queue */
				Event.fire('complete:action', actionId);
            }
        },

        /**
         * Defining action to be executed when layer is played
         *
         * @method playLayerAction
         * @param {LayerStandard || LayerSdarla} layerObject Layer instance
         * @param {Number} actionId Id of the playLayer action in the queue
         * @public
         */
        playLayerAction: function (savedlayer, actionId) {
            var root = this;
            var eventPlay = Event.on('layer:played', function (e) {
                /* istanbul ignore else */
                if (savedlayer.get('layerName') === e.layerName) {
                    eventPlay.remove();

                    if (savedlayer.getType() === 'darla') {
                        root.set('isDarlaLayerPlaying', true);
                    }

                    /* istanbul ignore else */
                    if (savedlayer.get('config').onResize) {
                        root.onResize(savedlayer);
                    }

                    if (Lang.isStrictNumber(actionId)) {
                        Event.fire('complete:action', actionId);
                    }
                }
            });
        },

        /**
         * Method to stop all the layers by creating a new close action per layers and add them into queue
         *
         * @method stopAllLayers
         * @public
         */
        stopAllLayers: function () {
            var root = this;
            var allLayers = root.get('layersList');
            var actionsSet = [];
            var i;
            var action;
            for (i = 0; i < allLayers.length; i++) {
                action = {
                    type: 'stopLayer',
                    to: allLayers[i].get('layerName'),
                    animate: false
                };
                actionsSet.push(action);
            }
            Event.fire('add:actions', actionsSet);
        },

        /**
         * Stop a layer
         *
         * @method stopLayer
         * @param {Object} attrs Object containing action data of the layer to be stopped
         * @public
         */
        stopLayer: function (attrs) {
            var layer = this.getLayer(attrs.layerToStop);
            if (layer) {
                this.stopLayerAction(layer, attrs.actionId);
                layer.stop(attrs.destroy);
            }
        },

        /**
         * @method stopLayerAction
         * @param {LayerStandard || LayerSdarla) savedLayer Layer to be stopped
         * @param {Number} actionId Id of the stopLayer action in the queue
         * @public
         */
        stopLayerAction: function (savedlayer, actionId) {
            var root = this;
            var eventPlay = Event.on('layer:stopped', function (e) {
                if (savedlayer.get('layerName') === e.layerName) {
                    /* istanbul ignore next */
                    if (savedlayer.getType() === 'darla') {
                        root.set('isDarlaLayerPlaying', false);
                    }
                    if (Lang.isStrictNumber(actionId)) {
                        Event.fire('complete:action', actionId);
                    }
                    eventPlay.remove();
                }
            });
        },

        /**
         * method to check if a layer is playing
         *
         * @method isLayerPlaying
         * @param {String} layerName
         * @return {Boolean} true if layer is playing
         * @public
         */
        isLayerPlaying: function (layerName) {
            var layer = this.getLayer(layerName);
            if (layer) {
                return layer.get('playing');
            }
            return false;
        },

        /**
         * @method applyingCoordinate
         * @param {String} targetAttr coordinate to get from
         * @param {NUmber} layerPosition inline layer position
         * @param {Object} requestLayer inline layer object
         * @param {Object} targetLayer overlay layer object
         * @param {String} coordinate to use to stick layer to
         * @public
         */
        applyingCoordinate: function (targetAttr, layerPosition, requestLayer, targetLayer, coordinate) {
            var newValue = 0;
            var requestLayerWidth;
            var targetLayerWidth;
            var requestLayerHeight;
            var targetLayerHeight;
            if (targetAttr === 'x') {
                newValue = layerPosition[0];
                requestLayerWidth = parseInt(requestLayer.get('width'), 10);
                targetLayerWidth = parseInt(targetLayer.get('width'), 10);

                if (coordinate.split('')[1] === 'r') {
                    /*@<*/
                    Debug.log('[ ACT_Layerslist.js ]: x right calculate', layerPosition[0], requestLayerWidth, targetLayerWidth);
                    /*>@*/
                    newValue = targetLayerWidth - requestLayerWidth + layerPosition[0];
                /* istanbul ignore else */
                } else if (coordinate.split('')[1] === 'l') {
                    /*@<*/
                    Debug.log('[ ACT_Layerslist.js ]: x left calculate', layerPosition[0]);
                    /*>@*/
                    newValue = layerPosition[0];
                }

            /* istanbul ignore else */
            } else if (targetAttr === 'y') {
                newValue = layerPosition[1];
                requestLayerHeight = parseInt(requestLayer.get('height'), 10);
                targetLayerHeight = parseInt(targetLayer.get('height'), 10);

                // bottom
                if (coordinate.split('')[0] === 'b') {
                    /*@<*/
                    Debug.log('[ ACT_Layerslist.js ]: y bottom calculate', layerPosition[1], requestLayerHeight, targetLayerHeight);
                    /*>@*/
                    newValue = targetLayerHeight - requestLayerHeight + layerPosition[1];

                // top
                /* istanbul ignore else */
                } else if (coordinate.split('')[0] === 't') {
                    /*@<*/
                    Debug.log('[ ACT_Layerslist.js ]: y top calculate', layerPosition[1]);
                    /*>@*/
                    newValue = layerPosition[1];
                }
            }

            return newValue;
        },

        /**
         * @method calculateLayerAttributeValue
         * @param {String} layerName Name of layer which need to calculate the position
         * @param {String} attrValue to be tested
         * @param {String} Coordinate for calculating (tl, tr, bl, br)
         * @public
         */
        calculateLayerAttributeValue: function (layerName, attrValue, coordinate) {
            var newValue = attrValue;
            var targetLayerName = attrValue.split(':')[1];
            var targetAttr = attrValue.split(':')[2];
            var targetLayer = this.get('layersMap')[targetLayerName];
            var requestLayer = this.get('layersMap')[layerName];
            var layerPosition = targetLayer.currentLayerPosition();

            if (this.get('sDarlaAPI')) {
                layerPosition = [
                    parseInt(this.get('sDarlaAPI').geom().self.l, 10) + 1,
                    parseInt(this.get('sDarlaAPI').geom().self.t, 10) + 1
                ];
            }

            newValue = this.applyingCoordinate(targetAttr, layerPosition, requestLayer, targetLayer, coordinate);
            return newValue;
        },

        /**
         * Function to calculate position for a layer based on other layer position
         *
         * @method getLayerPosition
         * @param {String} layerName Name of layer which need to calculate the position
         * @param {String} coordinate Coordinate for calculating (tl, tr, bl, br)
         * @param {Object} attributes List of attribute need to be calculated
         * @public
         */
        getLayerPosition: function (layerName, coordinate, attributes) {
            var root = this;
            var result = {};
            var attrName;
            var attrValue;

            for (attrName in attributes) {
                /* istanbul ignore else */
                if (attributes.hasOwnProperty(attrName)) {
                    attrValue = attributes[attrName];

                    if (attrValue.toString().indexOf('get:') > -1) {
                        attrValue = root.calculateLayerAttributeValue(layerName, attrValue, coordinate);
                    }

                    result[attrName] = attrValue;
                }
            }

            Event.fire('layersList:getLayerPosition:complete', {
                layerName: layerName,
                newValue: result
            });
        },

        /**
         * Function to stop or replay layer on resize.
         *
         * @method onResize
         * @param {String} savelayer
         * @public
         */
        onResize: function (savedlayer) {
            var root = this;
            var statusRegistration = Event.on('screen:status', function () {
                var layerName = savedlayer.get('layerName');
                var onResizeAction;
                var action = [{
                    type: 'stopLayer',
                    from: layerName,
                    to: layerName,
                    destroy: 'true',
                    animate: false
                }, {
                    type: 'playLayer',
                    from: layerName,
                    to: layerName,
                    animate: false
                }];
                statusRegistration.remove();
                /* istanbul ignore else */
                if (root.isLayerPlaying(layerName)) {
                    onResizeAction = savedlayer.get('config').onResize === 'refresh' ? action : [action[0]];
                    Event.fire('add:actions', onResizeAction);
                }
            });
        },

        /**
         * Destructor function
         *
         * @method destructor
         * @public
         */
        destructor: function () {
        }
    });

    return LayersList;
});
