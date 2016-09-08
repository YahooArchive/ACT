/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
ACT.define('Event', [/*@<*/'Debug', /*>@*/ 'Lang'], function (ACT) {
    'use strict';

    var lang = ACT.Lang;
    /*@<*/
    var debug = ACT.Debug;
    /*>@*/

    /**
     * Pair of events and HTML tags used for testing event support for current browser.
     * @readonly
     * @type {{select: string, change: string, submit: string, reset: string, error: string, load: string, abort: string}}
     */
    var TAGNAMES = {
        select: 'input',
        change: 'input',
        submit: 'form',
        reset: 'form',
        error: 'img',
        load: 'img',
        abort: 'img'
    };

    /**
     * Object containing all events being listened
     * @private
     * @type {{}}
     */
    var listeners = {};

    /**
     * Simple integer to keep generate a 'random index' for added events.
     * @private
     * @type {Number}
     */
    var eventIndex = 0;

    /**
     * Event Utilities / Helpers
     * @class Event
     * @module ACT
     * @requires lang
     */
    function Event() {
        /* istanbul ignore if */
        if (Event.prototype.singleton) {
            return Event.prototype.singleton;
        }
        Event.prototype.singleton = this;
    }

    /**
     * @attribute ATTRS
     * @type {{NAME: string, version: string}}
     * @initOnly
     */
    Event.ATTRS = {
        NAME: 'event',
        version: '1.0.22'
    };


    /**
     * Checks event string against events supported by current browser.
     * Used to decide if it's custom event or not.
     * @param eventName event string
     * @param element element to test
     * @returns {boolean} is a native browser event
     * @private
     */
    function isEventSupported(eventName, element) {
        var isSupported;
        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;
        isSupported = (eventName in element);

        if (!isSupported) {
            /* istanbul ignore else */
            if (!element.setAttribute) {
                element = document.createElement('div');
            }

            /* istanbul ignore else */
            if (element.setAttribute && element.removeAttribute) {
                element.setAttribute(eventName, '');
                isSupported = typeof element[eventName] === 'function';

                /* istanbul ignore else */
                if (typeof element[eventName] !== 'undefined') {
                    element[eventName] = undefined;
                }
                element.removeAttribute(eventName);
            }
        }
        element = null;
        return isSupported;
    }

    /**
     * Wrapper to add event listeners to objects.
     * @param {String} event Event to trigger on
     * @param {Function} fn Function to call when the event is fired
     * @param {Object} element Element to attach the event to
     * @param {Object} scope Scope Object to trigger the function with
     * @method addListener
     * @private
     * @static
     */
    function addListener(evnt, fn, element, scope) {
        var bound = fn;

        if (scope) {
            bound = lang.bind(scope, [], fn);
        }

        if (element && isEventSupported(evnt, element)) {
            if (window.addEventListener) {
                element.addEventListener(evnt, bound, 0);
            } else if (window.attachEvent) {
                element.attachEvent('on' + evnt, bound);
            }
        } else {
            element = null;
        }

        return {
            element: element,
            fn: fn,
            scope: scope,
            event: evnt,
            bound: bound
        };
    }

    Event.prototype = {

        // exposing for debug and test
        /*@<*/
        debugListeners: listeners,
        debugEventIndex: function () {
            return eventIndex;
        },
        debugIsEventSupported: isEventSupported,
        debugAddListener: addListener,
        debugGetListeners: function () {
            return listeners;
        },
        debugSetListeners: function (key, value) {
            listeners[key] = value;
            return listeners;
        },
        /*>@*/

        /**
         * Subscribe to listen to event
         * @method on
         * @param {String} event event string
         * @param {Object} fn callback method
         * @param {Object} element DOM element listening for event (optional)
         * @param {Object} scope event scope - default to this
         * @return {Object} obj.remove A simple wrapper to remove this event listener.
         * @public
         *
         * @example
         *	var Event = ACT.Event;
         *	var Dom = ACT.Dom;
         *	// custom event
         *	Event.on( "customEventString", function( eventData ) { ...do something based on this event...}, null, this);
         *	// 'vanilla' event
         *	Event.on("click", function( eventData ) { Event.preventDefault(eventData); ... do something ...}, Dom.byId("some_node_id"), this);
         *
         */
        on: function (evnt, fn, element, scope) {
            var root = this;
            var list;
            var index = eventIndex;
            eventIndex++;

            /*@<*/
            debug.log('[ ACT_event.js ] Attach ON for: ', evnt);
            /*>@*/

            // Create the topic's object if not yet created
            if (!lang.objHasKey(listeners, evnt)) {
                listeners[evnt] = {};
            }

            list = addListener(evnt, fn, element, scope);
            listeners[evnt][index] = list;

            // Provide handle back for removal of topic
            return {
                remove: function () {
                    /* if the event is removed already then ignore it */
                    if (!listeners[evnt][index]) {
                        return;
                    }

                    if (listeners[evnt][index].element) {
                        /* NOTE: The call to removeListener deletes the listeners[event][index] automagically. Hence
                        	the delete is in the else. This is done in case someone calls removeListener directly.
                        */
                        root.removeListener(evnt, fn, element);
                    } else {
                        delete listeners[evnt][index];
                    }
                }
            };
        },

        /**
         * Wrapper to add event listeners to CSS.
         * @param {String} event Event to trigger on
         * @param {Function} fn Function to call when the event is fired
         * @param {Object} element Element to attach the event to
         * @param {Object} scope Scope Object to trigger the function with
         * @method addCSSListener
         * @public
         * @static
         */
        addCSSListener: function (evnt, fn, element, scope) {
            this.on(evnt.toLowerCase(), fn, element, scope);
            this.on('webkit' + evnt, fn, element, scope);
            this.on('moz' + evnt, fn, element, scope);
            this.on('ms' + evnt, fn, element, scope);
            this.on('o' + evnt, fn, element, scope);
        },

        /**
         * Helper Function to remove event listeners from objects.
         * @param {String} event Event to remove
         * @param {Function} fn Function to remove from the object
         * @param {Object} element Element to remove the event from
         * @method removeListenerHelper
         * @private
         * @static
         */
        removeListenerHelper: function (evnt, fn, element) {
            if (window.removeEventListener) {
                element.removeEventListener(evnt, fn, 0);
                /* istanbul ignore else */
            } else if (window.detachEvent) {
                element.detachEvent('on' + evnt, fn);
            }
        },

        /**
         * Wrapper to remove event listeners from objects.
         * @param {String} event Event to remove
         * @param {Function} fn Function to remove from the object
         * @param {Object} element Element to remove the event from
         * @method removeListener
         * @public
         * @static
         */
        removeListener: function (evnt, fn, element) {
            var list = listeners[evnt] || {};
            var key;
            var el;
            for (key in list) {
                if (list.hasOwnProperty(key)) {
					el = list[key];
					if (el && el.element === element && (el.fn === fn || el.bound === fn)) {
						this.removeListenerHelper(evnt, el.bound, element);
						delete listeners[evnt][key];
					}
				}
            }
        },


		/**
		 * The 'ready' function is a modified version of the JQuery 'ready' functionality found at http://api.jquery.com/ready/
		 * The code below is modified according to the JQuery MIT License https://github.com/jquery/jquery
		 */
        ready: (function () {
            var document = window.document;
            var readyBound = false;
            var callbackQueue = [];
            var ready;
            var registerOrRunCallback = function (callback) {
                /* istanbul ignore else */
                if (typeof callback === 'function') {
                    callbackQueue.push(callback);
                }
            };
            var domReadyCallback = function () {
                while (callbackQueue.length) {
                    (callbackQueue.shift())();
                }
                registerOrRunCallback = function (callback) {
                    callback();
                };
            };
            var domReady = function () {
                /* istanbul ignore else */
                if (!ready.isReady) {
                    /* istanbul ignore else */
                    if (!document.body) {
                        return setTimeout(domReady, 1);
                    }
                    ready.isReady = true;
                    domReadyCallback();
                }
                return 0;
            };
            var DOMContentLoaded = function () {
                if (document.addEventListener) {
                    document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
                } else {
                    document.detachEvent('onreadystatechange', DOMContentLoaded);
                }
                domReady();
            };

            var doScrollCheck = function () {
                /* istanbul ignore else */
                if (ready.isReady) {
                    return;
                }
                try {
                    document.documentElement.doScroll('left');
                } catch (error) {
                    setTimeout(doScrollCheck, 1);
                    return;
                }
                domReady();
            };
            var bindReady = function () {
                var toplevel = false;
                /* istanbul ignore else */
                if (readyBound) {
                    return;
                }
                readyBound = true;

                /* istanbul ignore else */
                if (document.readyState === 'complete') {
                    domReady();
                }

                if (document.addEventListener) {
                    document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
                    window.addEventListener('load', DOMContentLoaded, false);
                    /* istanbul ignore else */
                } else if (document.attachEvent) {
                    document.attachEvent('onreadystatechange', DOMContentLoaded);
                    window.attachEvent('onload', DOMContentLoaded);
                    try {
                        toplevel = window.frameElement === null;
                    } catch (e) {
                        /*@<*/
                        debug.log('[ ACT_event.js ] Error in try catch for window.frameElement', e);
                        /*>@*/
                    }
                    /* istanbul ignore else */
                    if (document.documentElement.doScroll && toplevel) {
                        doScrollCheck();
                    }
                }
            };
            ready = function (callback) {
                registerOrRunCallback(callback);
                bindReady();
            };
            ready.isReady = false;
            return ready;
        }()),

        /**
         * Removes all listeners from the given element.
         * @param {Object} object to have purged
         * @method purgeListeners
         * @public
         * @static
         */
        purgeListeners: function (element) {
            var evnt;
            var key;
            var el;

            for (evnt in listeners) {
                if (listeners.hasOwnProperty(evnt) && listeners[evnt] && lang.isObject(listeners[evnt])) {
                    for (key in listeners[evnt]) {
                        if (listeners[evnt].hasOwnProperty(key)) {
							el = listeners[evnt][key];
							if (el.element === element) {
								this.removeListenerHelper(evnt, el.bound, element);
								delete listeners[evnt][key];
							}
						}
                    }
                }
            }
        },

        /**
         * Publish event for listeners to execute
         * @method fire
         * @param {String} event Name of the event that is being fired
         * @param {Object} info Meta data that is being fired with the event
         * @public
         *
         * @example
         *	// Now anyone can subscribe to the custom event.
         *	var Event = ACT.Event;
         *	var Dom = ACT.Dom;
         *	// Example of listener
         *	function listenForCustomEvent( event ) {
         *		if( event.hasOwnProperty("node")){
         *         	if(event.node.id === "node1"){
         *         		// got this event from node1
         *         	} else if( event.node.id === "node2" ){
         *         		// got this event from node2
         *      	}
         *		} else if ( event.hasOwnProperty("meta") ){
         *      	// heard first event.
         *		}
         *	}
         *	Event.on( "customEventString", listenForCustomEvent, null, this);
         *
         *	Event.fire( "customEventString", { meta:"data" });
         *	// Event.fire example with the same event fired for two different elements.
         *	Event.fire( "customEventString", { "node": Dom.byId("node1"); });
         *	Event.fire( "customEventString", { "node": Dom.byId("node2"); });
         *
         */
        fire: function (evnt, info) {
            var params = info || {};
            var scope;
            var index;
            var item;

            // If the topic doesn't exist, or there's no listeners in queue, just leave
            /* istanbul ignore else */
            if (!lang.objHasKey(listeners, evnt)) {
                return;
            }

            // Cycle through topics queue, fire!
            for (index in listeners[evnt]) {
                /* istanbul ignore else */
                if (listeners[evnt].hasOwnProperty(index)) {
                    item = listeners[evnt][index];
                    // if it doesn't have a specific scope, just run through all events of the same type.
                    scope = params.scope ? params.scope : item.scope;
                    /* istanbul ignore else */
                    if (scope === item.scope && lang.isFunction(item.fn)) {
                        if (scope) {
                            item.fn.call(scope, info);
                        } else {
                            item.fn(info);
                        }
                    }
                }
            }
        },

        /**
         * Wrapper to prevent default behaviour on an event
         * @param {Object} event Event that was triggered
         * @method preventDefault
         * @public
         * @static
         */
        preventDefault: function (evnt) {
            if (evnt.preventDefault) {
                evnt.preventDefault();
            } else {
                evnt.returnValue = false;
            }
        },

        /**
         * constructor
         * @public
         */
        constructor: Event
    };

    return new Event();
});
