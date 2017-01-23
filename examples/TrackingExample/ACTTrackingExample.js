/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

function ACTTrackingExample (config){
	this.init(config);
}

(function () {
    'use strict';

	/* Useful helper functions */
	/**
	* Given a string returns a numeric value (hash) of it
	* @param {String} string (any length) to hash
	* @return {Number} hash number of the string.
	* @method hashString
	* @public
	* @static
	* @author FRESCO EMEA Team
	*/
	function hashString (stringify) {
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
	}
    
	/**
	* Calls the 1x1 pixel in javascript
	* @param {String} pixel source of the image to request
	* @method pixelTrack
	* @public
	* @static
	*/
	function pixelTrack(pixel) {
		var adimg;
		if (pixel) {
			adimg = new Image();
			adimg.onload = function () {
				adimg = null;
			};
			adimg.src = pixel;
		}
	}
	
   /**
	 * Bind - binds the function to a scope
	 * @param {Object} obj the Scope object
	 * @param {Function} func Function to call in the scope
	 * @method bind
	 * @return to the bound function
	 * @public
	 * @static
	 */
	function act_bind(obj, func) {
		var bound;
		if (!Function.prototype.bind) {
			bound = function () {
				func.apply(obj, arguments);
			};
		} else {
			bound = func.bind(obj);
		}
		return bound;
	}
	
	/* Prototype extension of the ACTTrackingExample */

	ACTTrackingExample.prototype.init = function(config) {
		var defaultConfig = {
			redirectMacro: 'https://www.example.com/?redirect=true',
			interactionMacro: 'https://www.example.com/?interaction=true'
		};
		for (var itor in defaultConfig) {
			if (defaultConfig.hasOwnProperty(itor) && !config[itor]){
				config[itor] = defaultConfig[itor];
			}
		}
		this.config = config;
	}

	/* Simple helper methods that return links to the instantiated redirect and interaction functions defined here */
	ACTTrackingExample.prototype.getRedirect = function() {
		return act_bind(this, this.redirect_track);
	};
	
	ACTTrackingExample.prototype.getInteraction = function() {
		return act_bind(this, this.interaction_track);
	};

	/**
	 * Redirect Track String Generating function
	 * @param {String} trackingString StringID of the redirect track  'backup_image_noflash'
	 * @param {Integer} trackingID Numeric id of the redirect track  '135'
	 * @param {String} redirectURL URLString to redirect to http://sports.yahoo.com
	 * @return {String} Redirect String
	 * @method redirect_track
	 * @public
	 * @static
	 * @example
	 *     // Simple Example, no over write function provided:
	 *     var tracking = new ACT.Tracking();
	 *     var redirect = tracking.redirect_track(null, null, 'http://www.yahoo.com');
	 *     ACT.Dom.byId('exampleATag').href = redirect;
	 *
	 *     // Complex example with over write function:
	 *     var config = {
	 *         trackingFunctions: {
	 *             overwrite: true,
	 *             redirect: function(trackingString, trackingID, redirectURL) {
	 *                      var final_url = 'http://example.tracking.service.com/?name='+trackingString+'&id='+trackingID+'&url='+encodeURIComponent(redirectURL);
	 *                     return final_url;
	 *              },
	 *             interaction: function(trackingString) { ... }
	 *         }
	 *     };
	 *     var tracking = new ACT.tracking(config);
	 *       var redirect = tracking.redirect_track("yahooCTR", 456, 'http://www.yahoo.com');
	 */
	ACTTrackingExample.prototype.redirect_track = function (trackingString, trackingID, redirectURL) {
		var finalURLArr = [ 
							this.config.redirectMacro,
							'random='+Math.random(),
							'trackingID='+trackingID,
							'trackingString='+trackingString,
							'redirectURL='+encodeURIComponent(redirectURL)
							];
		var finalURL = finalURLArr.join('&');
		return finalURL;
	};

	/**
	 * Interaction tracking function
	 * @param {String} trackingString String ID of the interaction to be tracked
	 * @method interaction_track
	 * @return {Object} an object containing the results of this function call. Specifically:
	 *     {
	 *          overwriteFired: {Boolean}, // Did the overwrite function get fired
	 *          trackingString: {String}, // The tracking string submitted to the function
	 *          trackingID: {Int}, // ACT.js generated unique ID ( generated from supplied tracking string )
	 *          result: {Mixed} // Result of calling the provided interaction tracking function.
	 *     }
	 * @public
	 * @static
	 */
	ACTTrackingExample.prototype.interaction_track = function (trackingString) {
		var rand = Math.random();
		var src = [];
		var trackString = trackingString || '';
		var outcome = {
			overwriteFired: false,
			trackingString: trackString,
			trackingID: hashString(trackString),
			result: null
		};

		src.push(this.config.interactionMacro);
		src.push('trackingID=' + outcome.trackingID);
		src.push('trackingString=' + trackString);
		src.push('random=' + rand);
		outcome.result = src.join('&');
		/* Call the helper function to request the pixel we've generated */
		pixelTrack(outcome.result);
		return outcome;
	};
	
	/* Enabler Init Handler example of starting up the tracking overwrites */
	function enablerInitHandler(){
		/* Picks up the Enabler configuration set that was passed in from parent frame */
		 var enablerTracking = Enabler.getConfigObject('tracking');
		 /* Instantiate a new ACTTrackingExample with the configuration that was passed in */
		 var premiumTracking = new ACTTrackingExample(enablerTracking);

		/* Amend the configuration with overwrite, redirect and interaction functions
			bound to our new instance of ACTTrackingExample 
		*/
		enablerTracking.trackingFunctions = {
			overwrite: true,
			redirect: premiumTracking.getRedirect(),
			interaction: premiumTracking.getInteraction()
		};

		/* Update the Enabler config / setup with the overwrites */
		Enabler.setConfig(enablerTracking, 'tracking');
	}

	/**
	 * In the case we are using this functionality inside a window with Enabler and want to
	 * overwrite Enabler configuration. We use this if/else to call the enablerInitHandler.
	 * Otherwise, we rely on the 'main' ad footprint to use things correctly.
	 **/
	if (window.Enabler && Enabler.isInitialized()) {
		/* Initialize the tracking overwrite in Enabler */
		enablerInitHandler();
	} else if (window.Enabler) {
		Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
	}
})();
