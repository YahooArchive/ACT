/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * The 'ContentSwf' is a capability made to generate a 'EMBED' or 'OBJECT' tag.
 *
 * Example of 'SuperConf' use case:
 *
 *	{
 *		id: 'mpu_swf',
 *		type: 'content-swf',
 *		classNode: 'mpu_swf_class',
 *		env: ['flash'],
 *		css: {},
 *		swfConfig: {
 *			src: '',
 *			width: 300,
 *			height: 250,
 *			flashvars: {
 *				clickTAG: 'https://www.yahoo.com'
 *			}
 *		}
 *	}
 *
 * @module ContentSwf
 * @main ContentSwf
 * @class ContentSwf
 * @requires Dom, Lang, Event, Class, Capability, Flash, SWFBridge
 * @global
 */
ACT.define('ContentSwf', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang', 'Event', 'Class', 'Capability', 'Flash', 'SWFBridge'], function (ACT) {
	'use strict';

	/* Shorthand */
	var Dom = ACT.Dom;
	var Lang = ACT.Lang;
	var Class = ACT.Class;
	var Flash = ACT.Flash;
	var Event = ACT.Event;
	var Capability = ACT.Capability;
	var SWFBridge = ACT.SWFBridge;

	/* Constants */
	var EVENT_GLOBAL_SCREEN_STATUS = 'screen:status';
	var EVENT_GLOBAL_STOP_CONTENT = 'STOP_CONTENT';

	/*@<*/
	var Debug = ACT.Debug;
	Debug.log('ContentSwf Loaded');
	/*>@*/

	/**
	 * @constructor
	 */
	function ContentSwf(config) {
		this.init(config);
		// ContentSwf.superclass.constructor.apply(this, arguments);
	}

	ContentSwf.ATTRS = {

		/**
		 * @attribute NAME
		 * @type String
		 */
		NAME: 'contentSwf',

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
     * Generate the node embed or object tag with params
     *
     * @method renderNodeObjectOrEmbed
     * @private
     * @param {Object} config
     * @return {HTMLElement}
     */
	function renderNodeObjectOrEmbed(config) {
		var swfId;
		if (!config.swfConfig.hasOwnProperty('flashvars')) {
			config.swfConfig.flashvars = {};
		}

		swfId = config.id || 'swf' + Math.round((Math.random() * 1000000));
		config.swfConfig.id = config.swfConfig.flashvars.swfId = swfId;

		config.swfConfig.flashvars.callback = 'eventHandler';
		config.swfConfig.flashvars.callscope = 'ACT.SWFBridge["' + swfId + '"]';

		return Dom.nodeCreate(Flash.objectEmbed(config.swfConfig)).firstChild;
	}

	/* Public methods */
	Lang.extend(ContentSwf, [Capability, Class], {

		/**
		 * Function auto initiated when the class is instantiated
		 *
		 * @method initializer
		 * @public
		 * @param {Object} config
		 */
		initializer: function (config) {
			/* Store the  configObject */
			this.set('configObject', config);

			/* listeners for events */
			this.initializeListeners();
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
				/* Global Stop Content Event */
				Event.on(EVENT_GLOBAL_STOP_CONTENT, function () {
					var node = root.get('node');
					if (node) {
						SWFBridge.callSWF(node, 'stopContent');
					}
				}),

				/* Global Resize Event */
				Event.on(EVENT_GLOBAL_SCREEN_STATUS, function (status) {
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

			/* Remove the node from the DOM */
			if (node /* Dom.isDomElement(node) */ && node.parentNode) { // Embed does not work with 'isDomElement'
				node.parentNode.removeChild(node);
			}

			/* Unregistered context */
			SWFBridge.unregister(node.id);
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
			var node = renderNodeObjectOrEmbed(configObject);
			node = this.applyNodeConfig(node, configObject);
			return node;
		},

		/**
		 * Function generating the node 'EMBED' or 'OBJECT'
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
			/* Registered context */
			SWFBridge.register(this, node.id);

			return {
				node: node
			};
		},

		/**
		 * Function call by flash through the bridge
		 *
		 * @method eventHandler
		 * @public
		 */
		eventHandler: function (id, event) {
			/*@<*/
			Debug.log('Bridge: get node context, event: ', this.get('node'), event);
			/*>@*/

			if (event.hasOwnProperty('type')) {
				Event.fire(event.type, { id: id, scope: this });
			} else if (event.hasOwnProperty('actions')) {
				Event.fire('add:actions', event.actions);
			}
		}
	});

	return ContentSwf;
});
