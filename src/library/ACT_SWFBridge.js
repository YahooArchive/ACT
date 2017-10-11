/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
ACT.define('SWFBridge', [/*@<*/'Debug', /*>@*/ 'Lang'], function (ACT) {
	'use strict';

	var Lang = ACT.Lang;

	/*@<*/
	var Debug = ACT.Debug;
	Debug.log('SWFBridge: loaded');
	/*>@*/

	/* Public */
	function SWFBridge() {
		/* SWFBridge is a singleton */
		if (SWFBridge.prototype.singleton) {
			return SWFBridge.prototype.singleton;
		}
		SWFBridge.prototype.singleton = this;
	}

	/**
	* @attribute ATTRS
	* @initOnly
	*/
	SWFBridge.ATTRS = {

        /**
         * @attribute NAME
         * @type String
         */
		NAME: 'SWFBridge'
	};

	SWFBridge.prototype = {

		constructor: SWFBridge,

		swfAction: function (label, number) {
			/*@<*/
			Debug.log('SWFBridge: label, number: ', label, number);
			/*>@*/
		},

		callSWF: function (node, method) {
			var slice;
			var args;
			if (method in node && Lang.isFunction(node[method])) {
				slice = Array.prototype.slice;
				args = arguments.length > 2 ? slice.call(arguments, 2) : [];
				node[method].apply(node, args);
				/*@<*/
				Debug.log('SWFBridge: calling swf function : ' + method);
				/*>@*/
			}
		},

		register: function (context, id) {
			var self = this;

			this[id] = {
				swfAction: function (method) {
					if (method && method in context && Lang.isFunction(context[method])) {
						context[method].apply(context, [id, arguments[2]]);
					} else {
						self.swfAction.apply(self, [id, arguments]);
					}
				}
			};
		},

		unregister: function (id) {
			if (id in this) {
				delete this[id];
			}
		}
	};

	return new SWFBridge();
});
