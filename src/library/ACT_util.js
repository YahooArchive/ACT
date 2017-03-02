/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* jshint unused: false */
/* eslint no-unused-vars: 0 */
/* global ACT, ad_takeover, ad_running */
ACT.define('Util', [], function (ACT) {
	'use strict';

	/* Private shorthand */
	var decode = decodeURIComponent;

	/**
	* ACT AD Utilities
	* @class Util
	* @module ACT
	* @static
	*/
	function Util() {
		/* Util is a singleton */
		if (Util.prototype.singleton) {
			return Util.prototype.singleton;
		}
		Util.prototype.singleton = this;
	}

	/**
	* @attribute ATTRS
	* @type {{NAME: string, version: string}}
	* @initOnly
	*/
	Util.ATTRS = {
		NAME: 'Util',
		version: '1.1.0'
	};

	Util.prototype = {

		/**
		* Wrapper function for ad_takeover call.
		* @param {Boolean} takeover True to set takeover or false to turn it off
		* @method toggleTakeover
		* @public
		* @static
		*/
		toggleTakeover: function (takeover) {
			if (window.ad_takeover) {
				ad_takeover(takeover);
			}
		},

		/**
		* Wrapper for the function ad_running to pause or play the Today module
		* @param {Boolean} running True to let the page know the ad is running, false otherwise
		* @method adRunning
		* @public
		* @static
		*/
		adRunning: function (running) {
			if (window.ad_running) {
				window.ad_running(running);
			}
		},

		/**
		* Object keeping references to function that need to be called on ad_action
		* @private
		* @type Object
		* @property adAction
		* @deprecated DEPRECATED
		*/
		adAction: {},

		/**
		* Registration function to callback when ad_action is called
		* @param {Object} conf params: callback:function, args:arguments, context: ad_context, ad: placement_name
		* @method registerAdAction
		* @public
		* @static
		* @deprecated DEPRECATED
		*/
		registerAdAction: function (conf) {
			if (conf.ad) {
				this.adAction[conf.ad] = conf;
			}
		},

		/**
		* Search for all the numbers in a string and return them.
		* @param {String} haystack String to search for numbers in
		* @method getInt
		* @return {Number} all the numbers in Number format or zero if none found
		* @public
		* @static
		*/
		getInt: function (haystack) {
			var number = haystack.match(/[0-9]+/gi);
			if (number !== null) {
				return parseInt(number.join(''), 10);
			}
			return 0;
		},

		/**
		* Calls the 1x1 pixel in javascript
		* @param {String} pixel source of the image to request
		* @method pixelTrack
		* @public
		* @static
		*/
		pixelTrack: function (pixel) {
			var adimg;
			if (pixel) {
				adimg = new Image();
				adimg.onload = function () {
					adimg = null;
				};
				adimg.src = pixel;
			}
		},

		/**
		* Given a date returns true if it's today false otherwise. Today or after today.
		* @param {String} date in the "2012/10/23" : YYYY/mm/dd format
		* @return {Boolean} true if the date is equal or greater than the passed in date. False otherwise
		* @method adDate
		* @public
		* @static
		*/
		adDate: function (rundate) {
			var adtime = new Date();
			var test = new Date(rundate);
			return test.getTime() < adtime.getTime();
		},

		/**
		* Given a string returns a numeric value (hash) of it
		* @param {String} string (any length) to hash
		* @return {Number} hash number of the string.
		* @method hashString
		* @public
		* @static
		* @author FRESCO EMEA Team
		*/
		hashString: function (stringify) {
			var hash = 0;
			var	i = 0;
			var chars;

			if (stringify.length === 0) {
				return hash;
			}

			for (i; i < stringify.length; i++) {
				chars = stringify.charCodeAt(i);
				hash = ((hash << 5) - hash) + chars;
				hash = hash & hash; // Convert to 32bit integer
			}

			if (hash < 0) {
				hash = -hash;
			}

			return hash;
		},

		/**
		* Given a variable name, returns value of a first matched variable from URL's query string if found
		* @param {String} name, variable name to be matched
		* @return {String} results, string value of first matched variable if found, "" otherwise
		* @method getQStrVal
		* @public
		* @static
		*/
		getQStrVal: function (name) {
			var tmpName = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
			var regex = new RegExp('[\\?&]' + tmpName + '=([^&#]*)');
			var results = regex.exec(location.search);
			return results === null ? '' : decode(results[1].replace(/\+/g, ' '));
		}
	};

	return new Util();
});
