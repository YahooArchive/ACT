/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT, window */
ACT.define('SecureDarla', [/*@<*/'Debug', /*>@*/ 'Lang', 'Event', 'Json'], function (ACT) {
	'use strict';

	/* shorthand */
	var Event = ACT.Event;
	var Lang = ACT.Lang;
	var JSON = ACT.Json;
	var Y = window.Y || null;
	var yAPI = (Y && Y.SandBox && Y.SandBox.vendor) ? Y.SandBox.vendor : null;

	/*@<*/
	var Debug = ACT.Debug;
	/*>@*/

	/**
	 * EVENTS CONSTANT
	 */
	var EVENT_DARLA_PREFIX = 'secureDarla:'; // this prefix to use for message coming from sDarla API
	// list of available messages come from Darla API
	var EVENT_DARLA_REGISTER = 'register';
	var EVENT_DARLA_REGISTER_UPDATE = 'register-update';
	var EVENT_DARLA_EXPANDED = 'expanded';
	var EVENT_DARLA_COLLAPSED = 'collapsed';
	var EVENT_DARLA_RESIZE_TO = 'resize-to';
	// var EVENT_DARLA_GEOM_UPDATE		= 'geom-update';
	// var EVENT_DARLA_FOCUSE_UPDATE	= 'focus-update';
	// var EVENT_DARLA_FAILED			= 'failed';
	// var EVENT_DARLA_LAYER_OPEN		= 'lyr';
	// var EVENT_DARLA_LAYER_CLOSE		= 'lyr-close';
	// var EVENT_DARLA_LAYER_MSG		= 'lyr-msg';
	// var EVENT_DARLA_READ_COOKIE		= 'read-cookie';
	// var EVENT_DARLA_WRITE_COOKIE		= 'write-cookie';

	var EVENT_DARLA_CHECK = 'sframe:darlaCheck';

	/**
	 * @event 'sframe:darlaCheck:complete' Fires this event once the getAPI function is ready to return data.
	 */
	var EVENT_DARLA_CHECK_COMPLETE = 'sframe:darlaCheck:complete';

	/* actions related message */
	var EVENT_REGISTER_ACTION = 'register:Actions';
	var EVENT_COMPLETE_ACTION = 'complete:action';

	var EVENT_ACTION_MSG = 'sframe:msg';
	var EVENT_ACTION_MSG_COMPLETE = 'sframe:msg:complete';
	var EVENT_ACTION_RESIZE_TO = 'sframe:resize-to';
	var EVENT_ACTION_RESIZE_TO_COMPLETE = 'sframe:resize-to:complete';
	var EVENT_ACTION_EXPAND = 'sframe:expand';
	var EVENT_ACTION_EXPAND_COMPLETE = 'sframe:expand:complete';
	var EVENT_ACTION_COLLAPSE = 'sframe:collapse';
	var EVENT_ACTION_COLLAPSE_COMPLETE = 'sframe:collapse:complete';
	var EVENT_NO_SAFEFRAME = 'sframe:nosupport';

	/**
	 * List action for SafeFrame
	 */
	var darlaActions = [{
		type: 'darlaMessage',
		argument: {
			msg: {
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
		process: function (actionId, values) {
			var eventMessage;
			if (yAPI) {
				eventMessage = Event.on(EVENT_ACTION_MSG_COMPLETE, function () {
					Event.fire(EVENT_COMPLETE_ACTION, actionId);
					eventMessage.remove();
				});
				Event.fire(EVENT_ACTION_MSG, values);
			} else {
				Event.fire(EVENT_COMPLETE_ACTION, actionId);
			}
		}
	}, {
		type: 'expandInlineFrame',
		argument: {
			top: {
				test: function (value) {
					return Lang.isNumber(value) && value >= 0;
				}
			},
			right: {
				test: function (value) {
					return Lang.isNumber(value) && value >= 0;
				}
			},
			bottom: {
				test: function (value) {
					return Lang.isNumber(value) && value >= 0;
				}
			},
			left: {
				test: function (value) {
					return Lang.isNumber(value) && value >= 0;
				}
			},
			push: {
				test: function (value) {
					return (typeof value === 'boolean');
				}
			},
			timeout: {
				name: 'timeout',
				test: function (value) {
					return Lang.isNumber(value) || value === undefined || value === null;
				}
			}
		},
		process: function (actionId, values) {
			var eventInlineExpanded;
			/* istanbul ignore else */
			if (yAPI) {
				eventInlineExpanded = Event.on(EVENT_ACTION_EXPAND_COMPLETE, function () {
					Event.fire(EVENT_COMPLETE_ACTION, actionId);
					eventInlineExpanded.remove();
				});
				Event.fire(EVENT_ACTION_EXPAND, values);
			} else {
				Event.fire(EVENT_COMPLETE_ACTION, actionId);
				return;
			}
		}
	}, {
		type: 'contractInlineFrame',
		argument: {
			timeout: {
				name: 'timeout',
				test: function (value) {
					return Lang.isNumber(value) || value === undefined || value === null;
				}
			}
		},
		process: function (actionId) {
			var eventInlineCollapsed;
			/* istanbul ignore else */
			if (yAPI) {
				eventInlineCollapsed = Event.on(EVENT_ACTION_COLLAPSE_COMPLETE, function () {
					Event.fire(EVENT_COMPLETE_ACTION, actionId);
					eventInlineCollapsed.remove();
				});
				Event.fire(EVENT_ACTION_COLLAPSE);
			} else {
				Event.fire(EVENT_COMPLETE_ACTION, actionId);
				return;
			}
		}
	}, {
		type: 'resizeInlineFrame',
		argument: {
			width: {
				name: 'width',
				test: function (value) {
					return Lang.isNumber(value) || value === undefined || value === null;
				}
			},
			height: {
				name: 'height',
				test: function (value) {
					return Lang.isNumber(value) || value === undefined || value === null;
				}
			},
			animationLength: {
				name: 'animationLength',
				test: function (value) {
					return Lang.isNumber(value) || value === undefined || value === null;
				}
			},
			timeout: {
				name: 'timeout',
				test: function (value) {
					return Lang.isNumber(value) || value === undefined || value === null;
				}
			}
		},
		process: function (actionId, values) {
			var eventInlineResized;
			/* istanbul ignore else */
			if (yAPI) {
				/* listener for darla resizeTo message */
				eventInlineResized = Event.on(EVENT_ACTION_RESIZE_TO_COMPLETE, function () {
					Event.fire(EVENT_COMPLETE_ACTION, actionId);
					eventInlineResized.remove();
				});
				Event.fire(EVENT_ACTION_RESIZE_TO, values);
			} else {
				Event.fire(EVENT_COMPLETE_ACTION, actionId);
				return;
			}
		}
	}];

	/*@<*/
	Debug.log('[ ACT_secureDarla.js ]: ', window.Y);
	Debug.info('[ ACT_secureDarla.js ]: Darla API ', yAPI);
	/*>@*/

	/**
	 * ACT Wrapper for SecureDarla communication layer and ad registration methods.
	 *
	 *	var config = {
	 *		name: 'name_of_ad',
	 *		type: 'type_of_ad',
	 *		format: 'format_of_ad',
	 *		width: 300,
	 *		height: 250
	 *	};
	 *	var ref = this; // optional
	 *	var SD = new ACT.SecureDarla(config, ref);
	 *
	 * @class SecureDarla
	 * @module SecureDarla
	 * @param {Object} config Object defining simple minimum data for the ad.
	 * @param {Object} ref Reference to the parent object that is instantiating secureDarla. Optional.
	 * @requires Lang
	 * @requires Event
	 * @requires Debug
	 */
	function secureDarla(config, ref) {
		Lang.merge(this.config, config.template);

		this.yAPI = yAPI;
		if (this.yAPI === null) {
			this.secureDarla = false;
		} else {
			this.secureDarla = true;
		}

		if (ref) {
			ref.isSafeFrame = Lang.bind(this, null, this.isSafeFrame);
		}
		/* register the ad, attach notify to SD if it exists. */
		this.register();
		return this;
	}

	/**
	 * @method compareCurrentSize
	 */
	function compareCurrentSize(currentWidth, currentHeight, width, height) {
		if (currentHeight === height && currentWidth === width) {
			return true;
		}
		return false;
	}

	/**
	 * Check if passing value is valid for Darla expand function
	 * @method isValidForExpand
	 * @param  {Number}  top
	 * @param  {Number}  right
	 * @param  {Number}  bottom
	 * @param  {Number}  left
	 * @return {Boolean} trus if they are all value, else return false
	 */
	function isValidForExpand(top, right, bottom, left) {
		return (top >= 0) && (right >= 0) && (bottom >= 0) && (left >= 0);
	}

	/**
	 * @attribute ATTRS
	 * @type {{NAME: string, version: string}}
	 * @initOnly
	 */
	secureDarla.ATTRS = {
		NAME: 'SecureDarla'
	};

	secureDarla.prototype = {
		/**
		 * Simple default config. Assume 300x250
		 *
		 *	config: {
		 *		name: 'act_base',
		 *		type: 'lrec',
		 *		format: 'lrec',
		 *		width: 300,
		 *		height: 250
		 *	}
		 *
		 * @property config
		 * @type {{width: number, height: number}}
		 * @initOnly
		 */
		config: {
			width: 300,
			height: 250
		},

		/**
		 * secureDarla is set to 'undefined' - easy way to check if it's in a safe frame or not
		 * @property secureDarla
		 * @type {Boolean}
		 * @initOnly
		 */
		secureDarla: undefined,

		/**
		 * Property to save the status of sDarla expanded
		 * @property isInlineExpanded
		 * @default false
		 */
		isInlineExpanded: false,

		/**
		 * Register the ad with SecureDarla. Bind the local instance of `notify` for SecureDarla communication.
		 * @method register
		 */
		register: function () {
			var conf = this.config;

			/*@<*/
			Debug.info('[ ACT_secureDarla.js ]: config width and height', conf.width, conf.height);
			/*>@*/

			if (this.isSafeFrame() === true) {
				this.yAPI.register(conf.width, conf.height, Lang.bind(this, null, this.notify));
				/* if Darla is available then register related event and actions */
				this.initializeEvents();
				Event.fire(EVENT_REGISTER_ACTION, darlaActions);
			} else {
				Event.fire(EVENT_NO_SAFEFRAME, {
					error: 'Not in SafeFrame'
				});
			}
			Event.on(EVENT_DARLA_CHECK, this.getAPI, null, this);
		},

		/**
		 * SafeFrame API / Key getter function
		 * @method getAPI
		 * @returns {Object} { key: Object, yAPI: Object} An object containing the key and a reference to the SafeFrame API
		 * @public
		 */
		getAPI: function () {
			var result = {
				key: null,
				yAPI: null
			};
			if (this.isSafeFrame()) {
				result = {
					key: this.key(),
					yAPI: yAPI
				};
			}
			Event.fire(EVENT_DARLA_CHECK_COMPLETE, result);
			return result;
		},

		/**
         * Initialize all events
		 * @method initializeEvents
		 * @private
		 */
		initializeEvents: function () {
			var root = this;

			Event.on(EVENT_ACTION_MSG, function (data) {
				root.msg(data);
			});

			Event.on(EVENT_ACTION_RESIZE_TO, function (data) {
				root.resizeTo(data);
			});

			Event.on(EVENT_ACTION_EXPAND, function (data) {
				root.expand(data);
			});

			Event.on(EVENT_ACTION_COLLAPSE, function () {
				root.collapse();
			});
		},

		/**
         * @param {Object} data Contains msg field with the message for safeFrame
		 * @method msg
		 */
		msg: function (data) {
			if (!data.msg || !Lang.isString(data.msg)) {
				/*@<*/
				Debug.warn('[ ACT_secureDarla.js ]: sFrame, darla message should be a string');
				/*>@*/
				return;
			}

			Event.fire(EVENT_ACTION_MSG_COMPLETE);
			yAPI.msg(data.msg);
		},

        /**
         * Resize SafeFrames
         * @method resizeTo
         * @param {Object} data Information for resize safeFrame including:
         * 	- width: new width for safeFrame
         * 	- height: new height for safeFrame
         * 	- animationLength: animation length
         */
		resizeTo: function (data) {
			var root = this;
			/* No longer necessary, since we don't do our own restrictions testing */
			var currentWidth = (window.innerWidth || document.documentElement.clientWidth) || yAPI.geom().self.w;
			var currentHeight = (window.innerHeight || document.documentElement.clientHeight) || yAPI.geom().self.h;

			var width = parseInt(data.width, 10) || 0;
			var height = parseInt(data.height, 10) || 0;
			var animationLength = parseInt(data.animationLength, 10) || 0;

			if (compareCurrentSize(currentWidth, currentHeight, width, height)) {
				/*@<*/
				Debug.warn('[ ACT_secureDarla.js ]: sFrame, resize method, error=nothing to resize, at least one of widthTo or heightTo values has to be greater than original ad frame size');
				/*>@*/
				// stop action immediately
				Event.fire(EVENT_ACTION_RESIZE_TO_COMPLETE);
				return;
			}

			if (this.darlaEventResizeTo !== null) {
				/* Call the 'resizeTo' function from darla API and wait for it's message */
				// var darlaEvent
				this.darlaEventResizeTo = Event.on(EVENT_DARLA_PREFIX + EVENT_DARLA_RESIZE_TO, function () {
					/*@<*/
					Debug.warn('[ ACT_secureDarla.js ]: Fire ', EVENT_ACTION_RESIZE_TO_COMPLETE);
					/*>@*/
					Event.fire(EVENT_ACTION_RESIZE_TO_COMPLETE);
					/*
					We no longer want to remove this event, instead the onResize event that comes from SafeFrame's API is caught and fired
					for the internal framework only once. This solves the stalled / multi-click issue.
					// darlaEvent.remove();
					*/
				});
			}

			yAPI.resizeTo({
				w: width,
				h: height,
				key: root.key(),
				animTime: animationLength
			});
		},

		/**
		 * Expand sframe holder to new size
		 * @method expand
		 * @param {Object} data Information for expanding safeFrame including: (please note that all number must be positive)
		 * 	- top (number): amount of pixel to expand to the top
		 * 	- right (number): amount of pixel to expand to the right
		 * 	- bottom (number): amount of pixel to expand to the bottom
		 * 	- left (number): amount of pixel to expand to the left
		 *  - push (boolean): using expand push or not (default to false)
		 */
		expand: function (data) {
			var root = this;
			var darlaEvent;
			var top;
			var right;
			var bottom;
			var left;
			var push;

			/*@<*/
			Debug.log('[ ACT_secureDarla.js ]: expand method, data: ', JSON.stringify(data));
			/*>@*/

			/* check if safeFrame is already expanded or not */
			if (root.isInlineExpanded) {
				/*@<*/
				Debug.warn('[ ACT_secureDarla.js ]: sFrame, expand method, error=inline expanded previously already');
				/*>@*/
				/* stop action immediately */
				Event.fire(EVENT_ACTION_EXPAND_COMPLETE);
				return;
			}

			top = parseInt(data.top, 10) || 0;
			right = parseInt(data.right, 10) || 0;
			bottom = parseInt(data.bottom, 10) || 0;
			left = parseInt(data.left, 10) || 0;
			push = data.push || false;

			/* check if data is ok or not */
			if (!isValidForExpand(top, right, bottom, left)) {
				/*@<*/
				Debug.warn('[ ACT_secureDarla.js ]: sFrame, expand method doenst allow any negative number');
				/*>@*/
				/* stop action immediately */
				Event.fire(EVENT_ACTION_EXPAND_COMPLETE);
				return;
			}

			/*@<*/
			Debug.log('[ ACT_secureDarla.js ]: expand method', data);
			/*>@*/

			/* Call darla expand function and wait for it to message back */
			darlaEvent = Event.on(EVENT_DARLA_PREFIX + EVENT_DARLA_EXPANDED, function () {
				root.isInlineExpanded = true;
				Event.fire(EVENT_ACTION_EXPAND_COMPLETE);
				darlaEvent.remove();
			});

			yAPI.expand({
				t: top,
				r: right,
				b: bottom,
				l: left,
				push: push
			});
		},

		/**
		 * Function to collapse safeFrame holder
		 * @method collapse
		 */
		collapse: function () {
			var root = this;
			var darlaEvent;

			/* check it is expanded */
			if (!root.isInlineExpanded) {
				/*@<*/
				Debug.warn('[ ACT_secureDarla.js ]: sFrame, collapse method, error=nothing to collapse, inline has to be expanded previously');
				/*>@*/

				// stop action immediately
				Event.fire(EVENT_ACTION_COLLAPSE_COMPLETE);
				return;
			}

			/* call darla collapse function and wait for its message */
			darlaEvent = Event.on(EVENT_DARLA_PREFIX + EVENT_DARLA_COLLAPSED, function () {
				/* turn off inlineExpand flag and fire complete action */
				root.isInlineExpanded = false;
				Event.fire(EVENT_ACTION_COLLAPSE_COMPLETE);
				darlaEvent.remove();
			});

			yAPI.collapse();
		},

		/**
		 * Simple wrapper to pick up the SD Key
		 * @method key
		 * @return {Object} SecureDARLA Key that is necessary for communication with restricted SD components
		 */
		key: function () {
			return this.config.sdKey;
		},

		/**
		 * A simple check to help ads figure out if they are in a SafeFrame or not.
		 * @method isSafeFrame
		 * @return {Boolean} true if in a SafeFrame false otherwise.
		 */
		isSafeFrame: function () {
			/* Technically, this.secureDarla will never be 'undefined', however if it is. We reply with FALSE */
			if (this.secureDarla === undefined) {
				return false;
			}
			return this.secureDarla;
		},

		/**
		 * Generic notify function - this is where all SD communications come into.
		 * @method notify
		 * @param {String} cmd Command coming from SecureDarla
		 * @param {Object} data Data coming in from SecureDarla
		 * @event secureDarla:[type of cmd]
		 */
		notify: function (cmd, data) {
			/*@<*/
			Debug.log('[ ACT_secureDarla.js ]: ', cmd, JSON.stringify(data));
			/*>@*/

			if (EVENT_DARLA_REGISTER === cmd || EVENT_DARLA_REGISTER_UPDATE === cmd) {
				this.config.sdKey = data.key;
			}

			/* augment the data object with the key and a reference to yAPI */
			if (Lang.isObject(data)) {
				data.yAPI = yAPI;
				/* If the 'key' is part of the payload send it, otherwise default to locally stored one. */
				data.key = data.key || this.key();
			}

			/* Fire the SecureDarla Event for whomever is interested in it can see */
			Event.fire(EVENT_DARLA_PREFIX + cmd, data);
		}
	};

	return secureDarla;
});
