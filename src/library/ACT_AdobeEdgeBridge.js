/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT, AdobeEdge*/
ACT.define('AdobeEdgeBridge', [/*@<*/'Debug', /*>@*/ 'Event', 'Lang'], function (ACT) {
	'use strict';

	/* Shorthand */
	var Lang = ACT.Lang;
	var Event = ACT.Event;

	/*@<*/
	var Debug = ACT.Debug;
	Debug.log('AdobeEdgeBridge: loaded');
	/*>@*/

	/* Public */
	function AdobeEdgeBridge() {
		/* AdobeEdgeBridge is a singleton */
		/* istanbul ignore if */
		if (AdobeEdgeBridge.prototype.singleton) {
			return AdobeEdgeBridge.prototype.singleton;
		}
		AdobeEdgeBridge.prototype.singleton = this;
	}

	/**
	 * @attribute ATTRS
	 * @initOnly
	 */
	AdobeEdgeBridge.ATTRS = {

		/**
		 * @attribute NAME
		 * @type String
		 */
		NAME: 'AdobeEdgeBridge',

		/**
		 * @attribute version
		 * @type String
		 */
		version: '1.0.41'

	};

	function fireEvent(compositionId, eventType, trackableName, special) {
		Event.fire('ContentAdobeEdge:actions', {
			compositionId: compositionId,
			eventType: eventType,
			action_name: trackableName,
			special: special
		});
	}

	function getComposition(compId) {
		var composition = null;
		/* istanbul ignore else */
		if (AdobeEdge && AdobeEdge.hasOwnProperty('getComposition')) {
			composition = AdobeEdge.getComposition(compId);
		}
		return composition;
	}

	/* Ignoring this function since it heavily relies on AdobeEdge and it's functionality.
		AdobeEdge doesn't play nice with Phantom, and to properly test I would need to fake most of the
		elements used inside this function, which would make testing it moot.
	*/
	/* istanbul ignore next */
	function traverseSymbols(composition, callback) {
		var symbols;
		var itor;
		var len;
		if (composition && composition.hasOwnProperty('getSymbols')) {
			symbols = composition.getSymbols();
			if (Lang.isArray(symbols)) {
				len = symbols.length;
				for (itor = 0; itor < len; itor++) {
					if (Lang.isFunction(symbols[itor][callback])) {
						symbols[itor][callback](0);
					}
				}
			}
		}
	}

	AdobeEdgeBridge.prototype = {

		constructor: AdobeEdgeBridge,

		/**
		 * This is the function that you call to send and call redirect tracks. It sends, calls and catalogues the interaction
		 * tracks for AutoEvent and yFPAD to read when creating the footprint. This complies with adinterax redirect tracking.
		 * This also uses the "cap" flashvar to decide on "how" to call the redirect. This fixes the pop up blocking issues in
		 * internet explorer.
		 * @example
		 * 	ACT.AdobeEdgeBridge.trackR(compId, "clickTAG", "gereral");
		 *
		 * @method trackR
		 * @public
		 * @param {String} compId This is the name of the composition.
		 * @required
		 * @param {String} action_name This is the name of the common label that will be output in the post execution stats.
		 * @required
		 * @param {Object} action This is the "action" or short name of the redirect
		 * @required
		 * @param {String} special This is used when you need to pass in a "special" param to the url such as, "&zipcode=94587"
		 **/
		trackR: fireEvent,

		/**
		 * This is the function that you call to send interaction tracks. It sends and catalogues the interaction
		 * tracks for AutoEvent and yFPAD to read when creating the footprint.
		 *
		 * @example
		 * 	ACT.AdobeEdgeBridge.trackR(compId, "action_name", "action");
		 *
		 * @method N
		 * @public
		 * @param {Object} compId This is the name of the composition.
		 * @required
		 * @param {String} action_name This is the name of the action.
		 * @required
		 * @param {String} action This is the name of the track.
		 * @required
		 *
		 **/
		trackN: fireEvent,

		getComposition: getComposition,

		stopComposition: function (compId) {
			var composition = getComposition(compId);
			traverseSymbols(composition, 'stop');
		},

		replayComposition: function (compId) {
			var composition = getComposition(compId);
			traverseSymbols(composition, 'play');
		}

		/* Unused */
		/*
		register: function (context, compId) { },
		unregister: function (compId) { }
		*/
	};

	return new AdobeEdgeBridge();
});
