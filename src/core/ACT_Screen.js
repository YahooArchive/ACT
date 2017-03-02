/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * The 'Screen' is a core module made to detect the screen size/event/orientation.
 * This module is used in 'StandardAd'.
 *
 * @module Screen
 * @main Screen
 * @class Screen
 * @requires Event, Lang, Dom, Class
 * @global
 */
ACT.define('Screen', [/*@<*/'Debug', /*>@*/ 'Event', 'Lang', 'Dom', 'Class', 'UA'], function (ACT) {
	'use strict';

	/* Shorthand */
	var Lang = ACT.Lang;
	var Event = ACT.Event;
	var Dom = ACT.Dom;
	var UA = ACT.UA;
	var Class = ACT.Class;

	/*@<*/
	var Debug = ACT.Debug;
	Debug.log('Screen Loaded');
	/*>@*/

	/**
	 * Function returns the window width in non-safeframe environment
	 *
	 * @method getStandardWindowWidth
	 * @private
	 * @return {Integer} windowWidth
	 */
	function getStandardWindowWidth() {
		var dimensions = Dom.getWindowSize();
		return dimensions.width;
	}

	/**
	 * Function returns the window height in non-safeframe environment
	 *
	 * @method getStandardWindowHeight
	 * @private
	 * @return {Integer} windowHeight
	 */
	function getStandardWindowHeight() {
		var dimensions = Dom.getWindowSize();
		return dimensions.height;
	}

	/**
	 * Function returns the window orientation in non-safeframe environment, P or L
	 *
	 * @method getStandardWindowOrientation
	 * @private
	 * @return {String} Orientation
	 */
	function getStandardWindowOrientation() {
        var hasOrientation = (UA.isMobile || UA.isTablet);
        var width = getStandardWindowWidth();
        var height = getStandardWindowHeight();
        var orientation = 'P';
        if (hasOrientation && width > height) {
            orientation = 'L';
        }
		/* istanbul ignore next */
		return orientation;
	}

	/**
	 * Function returns the window orientation inside safeframe, P or L
	 *
	 * @method getSafeFrameWindowOrientation
	 * @private
	 * @param {Integer} sFrameW Safeframe width
	 * @param {Integer} sFrameH Safeframe height
	 * @return {String} Orientation
	 */
	function getSafeFrameWindowOrientation(sFrameW, sFrameH) {
		if (sFrameW < sFrameH) {
			return 'P';
		}
		return 'L';
	}

	/**
	 * @constructor
	 */
	function Screen(config) {
		this.init(config);
		// Screen.superclass.constructor.apply(this, arguments);
	}

	/**
	 * default attribute
	 */
	Screen.ATTRS = {

		/**
		 * @attribute NAME
		 * @type String
		 */
		NAME: 'Screen',

		/**
		 * @attribute version
		 * @type String
		 */
		version: '1.1.0',

		/**
		 * @attribute sDarlaAPI
		 * @type undefined
		 */
		sDarlaAPI: undefined,

		/**
		 * @attribute status
		 * @type Object
		 */
		status: {
			screenWidth: 0,
			screenHeight: 0,
			orientation: 'P'
		}
	};

	/**
	 * Public properties
	 */
	Lang.extend(Screen, Class, {

		/**
		 * Function auto initiated when the class is instantiated
		 *
		 * @method initializer
		 * @public
		 * @param {Object} config
		 */
		initializer: function () {
			var root = this;
			root.addEventListeners(
				Event.on('screen:getStatus', function () {
					Event.fire('screen:getStatus:Done', root.getStatus());
				})
			);
			root.setStatus();
		},

		/**
		 * Return the screen status attribute
		 *
		 * @method getStatus
		 * @public
		 * @return {Object} status attribute
		 */
		getStatus: function () {
			this.setStatus();
			return this.get('status');
		},

		/**
		 * Set the screen status depending on environment
		 *
		 * @method setStatus
		 * @public
		 */
		setStatus: function () {
			var root = this;
			var listener = Event.on('sframe:darlaCheck:complete', function (data) {
				listener.remove();
				if (data.yAPI !== null) {
					/*@<*/
					Debug.log('Screen: Darla is available, listen to geom-update');
					/*>@*/
					root.set('sDarlaAPI', data.yAPI);
					root.setStatusSF();
					root.startListenScreenSF();
				} else {
					/*@<*/
					Debug.log('Screen: Darla is not available, listen to window size');
					/*>@*/
					root.setStatusStandard();
					root.startListenScreenStandard();
				}
			});
			Event.fire('sframe:darlaCheck');
		},

		/**
		 * Set the screen status in a non-safeframe environment
		 *
		 * @method setStatusStandard
		 * @public
		 */
		setStatusStandard: function () {
			var status = {
				screenWidth: getStandardWindowWidth(),
				screenHeight: getStandardWindowHeight(),
				orientation: getStandardWindowOrientation()
			};
			this.set('status', status);
		},

		/**
		 * Set the screen status in a safeframe environment
		 *
		 * @method setStatusSF
		 * @public
		 */
		setStatusSF: function () {
			var screenWidth = this.get('sDarlaAPI').geom().win.w;
			var screenHeight = this.get('sDarlaAPI').geom().win.h;
			var status = {
				screenWidth: screenWidth,
				screenHeight: screenHeight,
				orientation: getSafeFrameWindowOrientation(screenWidth, screenHeight)
			};
			this.set('status', status);
		},

		/**
		 * Start listening to the onresize event in standard environment
		 *
		 * @method startListenScreenStandard
		 * @public
		 */
		startListenScreenStandard: function () {
			var root = this;
			var resizeId;
			/* istanbul ignore next */
			root.addEventListeners(
				Event.on('resize', function () {
					if (getStandardWindowWidth() !== root.get('status').screenWidth || getStandardWindowHeight() !== root.get('status').screeHeight) {
						if (resizeId) {
							clearTimeout(resizeId);
						}
						resizeId = setTimeout(function () {
							Event.fire('screen:status', root.get('status'));
						}, 500);
						root.setStatusStandard();
					}
				}, window)
			);
		},

		/**
		 * Start listening to the onresize event in safeframe environment
		 *
		 * @method startListenScreenSF
		 * @public
		 */
		startListenScreenSF: function () {
			var root = this;
			root.addEventListeners(
				Event.on('secureDarla:geom-update', function () {
					var geo = root.get('sDarlaAPI').geom();
					var geoWidth = parseInt(geo.win.w, 10);
					var geoHeight = parseInt(geo.win.h, 10);
					var screenWidth = parseInt(root.get('status').screenWidth, 10);
					var screenHeight = parseInt(root.get('status').screenHeight, 10);

					if (screenWidth !== geoWidth || screenHeight !== geoHeight) {
						// update screen status first, then fire event with new screen status
						root.setStatusSF();
						Event.fire('screen:status', root.get('status'));
					}
				})
			);
		}
	});

	return Screen;
});
