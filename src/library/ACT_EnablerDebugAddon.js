/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT, console */
/* eslint no-console:0 */
'use strict';

function enablerCommunicationLogger(eventData) {
	if (window.console && window.console.info) {
		console.info('[ ACT_Enabler.js ] Sent out the following communication : ', eventData);
	}
}

function enablerCommunicationListener() {
	if (window.ACT && window.ACT.Event) {
		ACT.Event.on('Enabler:actions', enablerCommunicationLogger);
	}
}

if (window.ACT && window.ACT.Event) {
	enablerCommunicationListener(null);
} else {
	if (!!(window.addEventListener)) {
		window.addEventListener('DOMContentLoaded', enablerCommunicationListener);
	} else {
		window.attachEvent('onload', enablerCommunicationListener);
	}
}
