/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/* eslint no-useless-concat: 0 */
/**
 * The 'ContentHtml5' is a capability made to generate a 'DIV' or an 'IFRAME' tag use for htlm5 assets.
 *
 *
 * @module ContentHtml5
 * @main ContentHtml5
 * @class ContentHtml5
 * @requires Dom, lang, Event, Class, Capability
 * @global
 */
ACT.define('ContentHtml5', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang', 'Event', 'Class', 'Capability', 'Json'], function (ACT) {
    'use strict';

    /* Shorthand */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    var Class = ACT.Class;
    var Event = ACT.Event;
    var JSON = ACT.Json;
    var Capability = ACT.Capability;

    /* Event name */
    var EVENT_HTML5_BROADCAST = 'html5:broadcast';
    var EVENT_HTML5_CHANGE_STYLES = 'html5:changeStyles';
    var EVENT_GLOBAL_ACTION_COMPLETE = 'complete:action';
    var EVENT_GLOBAL_SCREEN_STATUS = 'screen:status';
    var EVENT_GLOBAL_STOP_CONTENT = 'STOP_CONTENT';
    var EVENT_ADD_ACTIONS = 'add:actions';
    var EVENT_ENABLER_ACTIONS = 'Enabler:actions';
    var ENABLER_DEFAULT_PATH = 'https://s.yimg.com/cv/actjs/1.0.15/min/';

    var contentActions = [{
        type: 'html5Broadcast',
        argument: {
            to: {
                name: 'to',
                test: function (value) {
                    return Lang.isString(value);
                }
            },
            name: {
                name: 'name',
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
        process: function (actionId, args) {
            Event.fire(EVENT_HTML5_BROADCAST, {
                containerId: args.to,
                name: args.name
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'changeHtml5FrameStyles',
        argument: {
            to: {
                name: 'to',
                test: function (value) {
                    return Lang.isString(value);
                }
            },
            css: {
                name: 'css',
                test: function (value) {
                    return Lang.isObject(value);
                }
            },
            timeout: {
              name: 'timeout',
              test: function (value) {
                return Lang.isNumber(value) || value === undefined || value === null;
              }
            }
        },
        process: function (actionId, args) {
            Event.fire(EVENT_HTML5_CHANGE_STYLES, {
                containerId: args.to,
                css: args.css,
                done: function () {
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }
            });
        }
    }];

    /**
     * Post Message Handler
     */
    var HANDLER_COLLECTION = [];

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_contentHtml5.js ] ContentHtml5 Loaded');
    /*>@*/

    Event.on('message', function (event) {
        var index;
        for (index = 0; index < HANDLER_COLLECTION.length; index ++) {
            HANDLER_COLLECTION[index].eventHandler(event);
        }
    }, window);

    /**
     * @constructor
     */
    function ContentHtml5(config) {
        this.init(config);
        // ContentHtml5.superclass.constructor.apply(this, arguments);
    }

    ContentHtml5.ATTRS = {
        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'ContentHtml5',

        /**
         * @attribute version
         * @type String
         */
        version: '1.0.22',

        /**
         * @attribute configObject
         * @type Object
         */
        configObject: {},

        /**
         * @attribute node
         * @type HTMLElement
         */
        node: null,

        /**
         * @attribute enablerActions
         */
        enablerActions: {},

        /**
         * List of keywords related labes for tracking
         * For e.g 'video1:start' : 'billboard_view_video1_start'
         * @attribute trackingLabels
         */
         trackingLabels: {},

         /**
         * Set to true if you want to track things that are not defined in tracking labels.
         * set to False by default.
         */
         trackMisc: false
    };

    /* Private methods */


    /**
     * Generate the node div tag with params
     *
     * @method renderDiv
     * @private
     * @param {Object} config
     * @return {HTMLElement}
     */
    function renderDiv(config) {
        var div = document.createElement('div');
        var script = document.createElement('script');

        div.setAttribute('id', config.id);
        script.type = 'text/javascript';
        script.src = config.html5Config.src;
        div.appendChild(script);

        return div;
    }

    /**
     * Generate the node iframe tag with params
     *
     * @method renderIframe
     * @private
     * @param {Object} config
     * @return {HTMLElement}
     */
    function renderIframe(config) {
        var load;
        var name;
        var iframe = document.createElement('iframe');

        iframe.setAttribute('id', config.id);
        iframe.setAttribute('marginwidth', 0);
        iframe.setAttribute('marginheight', 0);
        iframe.setAttribute('hspace', 0);
        iframe.setAttribute('vspace', 0);
        iframe.setAttribute('frameborder', 0);
        iframe.setAttribute('scrolling', 'no');

        if (config.html5Config.iframeUrlPath) {
            name = Lang.isObject(config.html5Config.iframevars) ? config.html5Config.iframevars : null;
            iframe.setAttribute('name', encodeURI(JSON.stringify(name)));
            iframe.setAttribute('src', config.html5Config.iframeUrlPath);
            return iframe;
        }

        load = function () {
            iframe.onload = null;
            setTimeout(function () {
                var iframeVars = config.html5Config.iframevars || {};
                var iframeContent = (iframe.contentWindow || iframe.contentDocument);
                var iframeDocument = (iframeContent.document) ? iframeContent.document : iframeContent;
                iframeVars.frameId = config.id;

                /* istanbul ignore else */
                if (config.trackingLabels) {
                    iframeVars.trackingLabels = config.trackingLabels;
                }

                iframeDocument.open();

                if (config.html5Config.enabler) {
                    iframeDocument.write('<scr' + 'ipt type="text/javascript" src="' +
                        ((config.html5Config.enablerPath) ? config.html5Config.enablerPath : ENABLER_DEFAULT_PATH) + 'ACT_Enabler.js"></scr' + 'ipt>');
                    iframeDocument.write('<scr' + 'ipt type="text/javascript"> Enabler.setConfig(' + JSON.stringify(iframeVars) + '); </scr' + 'ipt>');
                } else {
                    iframeDocument.write('<scr' + 'ipt type="text/javascript"> var ACT = ' + JSON.stringify(iframeVars) + '; </scr' + 'ipt>');
                }

                iframeDocument.write('<body>' + config.html5Config.src + '</body>');
                iframeDocument.close();
            }, 1);
        };

        iframe.onload = load;
        return iframe;
    }

    /**
     * @method genarateEventActions
     * @private
     * @param {Object} eventActions
     */
    function genarateEventActions(eventActions, callback) {
        var name;
        var action;

        /* istanbul ignore next */
        if (typeof eventActions !== 'object') {
            return;
        }

        for (name in eventActions) {
            if (eventActions.hasOwnProperty(name)) {
                action = eventActions[name];
                callback(action);
            }
        }
    }

    // TODO: See about moving this to Class
    /**
     * @method subscribeActionToEvent
     * @private
     * @param {Object} action
     */
    function subscribeActionToEvent(action) {
        Event.on(action.eventType, function () {
            Event.fire(EVENT_ADD_ACTIONS, action.actions);
        });
    }

    /* Public methods */

    Lang.extend(ContentHtml5, [Capability, Class], {
        /**
         * Function auto initiated when the class is instantiated
         * @method initializer
         * @public
         * @param {Object} config
         */
        initializer: function (config) {
            /* Set ID */
            this.set('nodeId', config.id);

            /* Store the  configObject */
            this.set('configObject', config);

            /* Subscribe listeners */
            this.initializeListeners();

            /* prepare enabler actions */
            this.initializeEnablerActions(config);

            /* Register actions */
            Event.fire('register:Actions', contentActions);

            if (config.hasOwnProperty('trackingLabels')) {
                this.set('trackingLabels', config.trackingLabels);
            }

            if (config.hasOwnProperty('trackMisc')) {
                this.set('trackMisc', config.trackMisc);
            }

            /* Register postmesage handler */
            HANDLER_COLLECTION.push(this);
        },

        /**
         * Function to initialize event listeners for this instance
         *
         * @method initializeListeners
         */
        initializeListeners: function () {
            var root = this;

            root.addEventListeners(
                Event.on(EVENT_HTML5_BROADCAST, function (eventData) {
                    /* istanbul ignore else */
                    if (root.get('nodeId') === eventData.containerId) {
                        root.broadcastToHtml5(eventData.name);
                    }
                }),
                Event.on(EVENT_HTML5_CHANGE_STYLES, function (eventData) {
                    /* istanbul ignore else */
                    if (root.get('nodeId') === eventData.containerId) {
                        root.changeStyles(eventData.css, eventData.done);
                    }
                }),
                Event.on(EVENT_GLOBAL_SCREEN_STATUS, function (status) {
                    /* istanbul ignore else */
                    if (root.get('configObject') && root.get('configObject').resize) {
                        root.resize(status, root.get('configObject'));
                    }
                }),
                // TODO: See if this event can be generalized in Class.
                Event.on(EVENT_GLOBAL_STOP_CONTENT, function () {
                    root.broadcastToHtml5('stop');
                })
            );
        },

        /**
         * @method wrapActionsList
         */
        wrapActionsList: function (actionList) {
            return function () {
                Event.fire(EVENT_ADD_ACTIONS, actionList);
            };
        },

        /**
         * prepare actions definition for enablers actions
         * @method initializeEnablerActions
         */
        initializeEnablerActions: function (config) {
            var actions;
            var eventConfig;
            var index;
            var eventAction;
            var trigger;
            var actionList;
            if (!Lang.isObject(config.html5Config) || !config.html5Config.enabler) {
                return;
            }

            // applying default enbler actions
            actions = {
                // handle track event
                track: Lang.bind(this, null, this.fireEnablerTracking)
            };

            // go through list of eventConfig to setup what actions should be done when receive an event from Enabler child
            eventConfig = config.eventConfig;
            if (Lang.isObject(eventConfig)) {
                for (index = 0; index < eventConfig.length; index ++) {
                    eventAction = eventConfig[index];
                    if (Lang.isObject(eventAction) && eventAction.hasOwnProperty('eventType') && eventAction.hasOwnProperty('actions')) {
                        trigger = eventAction.eventType;
                        actionList = eventAction.actions;
                        actions[trigger] = this.wrapActionsList(actionList);
                    }
                }
            }
            this.set('enablerActions', actions);
        },

        /**
         * Handle tracking event sent from Enabler
         * We will check if eventId is defined in trackingLabels list, then fire tracking event with related label
         * @method fireEnablerTracking
         * @param {Object} data Data sent by Enabler event action
         */
        fireEnablerTracking: function (data) {
            var trackingLabels = this.get('trackingLabels');
            var trackMisc = this.get('trackMisc');
            if (trackingLabels.hasOwnProperty(data.id)) {
                Event.fire(EVENT_ADD_ACTIONS, {
                    type: 'track',
                    label: trackingLabels[data.id]
                });
            } else if (trackMisc === true) {
                /* For the case where we want to track things that are not defined in the trackingLabels.
                This is used by ID's that defined some tracking labels but not all of them, and would like to fire
                misc tracks.
                */
                Event.fire(EVENT_ADD_ACTIONS, {
                    type: 'track',
                    label: data.id
                });
            }
        },

        /**
         * Broadcast to the html5 script
         * @method startHtml5
         */
        broadcastToHtml5: function (name) {
            var iframe = this.get('node');
            var config = this.get('configObject');
            var iframeContent;

            if (config.html5Config.hasOwnProperty('iframe') && config.html5Config.iframe && iframe) {
                iframeContent = (iframe.contentWindow || iframe.contentDocument);
                iframeContent.postMessage({ eventName: 'html5:message', message: name }, '*');
            } else {
                Event.fire('html5:message', { message: name });
            }
        },

        /**
         * Function called when the instance is destroyed
         * @method destructor
         * @public
         */
        destructor: function () {
            var node = this.get('node');

            /* Remove the node from the DOM */
            if (Dom.isDomElement(node) && node.parentNode) {
                node.parentNode.removeChild(node);
            }

            /* Unegister postmesage handler */
            HANDLER_COLLECTION.splice(HANDLER_COLLECTION.indexOf(this), 1);
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
            var node = (configObject.html5Config.iframe) ? renderIframe(configObject) : renderDiv(configObject);
            genarateEventActions(configObject.eventActions, subscribeActionToEvent);
            node = this.applyNodeConfig(node, configObject);
            // return node
            return node;
        },

        /**
         * Function generating the node 'IFRAME' or 'DIV'
         * @method getContent
         * @public
         * @param {String} env Environment for rendering content such as html/flash/backup
         * @param {String} orientation Orientation of current device such as landscape and portraits for mobile
         * @return {Object}
         */
        getContent: function (env, orientation) {
            var root = this;
            var node = root.renderContent(this.get('configObject'), env, orientation);
            this.set('node', node);

            // Listen to event send back by enabler
            if (this.get('configObject').html5Config.enabler === true) {
                this.addEventListeners(
                    Event.on(EVENT_ENABLER_ACTIONS, ACT.Lang.bind(root, null, root.enablerActionHandler))
                );
            }

            return {
                node: node
            };
        },

        /**
         * Function call by the iframe
         *
         * @method eventHandler
         * @public
         */
        eventHandler: function (event) {
            var iframe = this.get('node');
            var config = this.get('configObject');
            var data;
            var iframeContent;

            if (config.html5Config.hasOwnProperty('iframe') && config.html5Config.iframe && iframe) {
                iframeContent = (iframe.contentWindow || iframe.contentDocument);
                if (event.source === iframeContent) {
                    data = event.data;
                    if (data.hasOwnProperty('type')) {
                        Event.fire(data.type);
                    } else if (data.hasOwnProperty('actions')) {
                        Event.fire(EVENT_ADD_ACTIONS, data.actions);
                    } else if (data.hasOwnProperty('EnablerData')) {
                        // need to add container id here to mark this event from child iframe
                        data.EnablerData.frameId = config.id;
                        Event.fire(EVENT_ENABLER_ACTIONS, data.EnablerData);
                    }
                }
            }
        },

        /**
         * Handle event data send by Enabler
         *
         * @method enablerActionHandler
         * @param {Object} data
         */
        enablerActionHandler: function (data) {
            var actions;
            /*@<*/
            Debug.log('[ ACT_contentHtml5.js ] enablerActionHandler: receive event', data);
            /*>@*/

            /* Need to make sure the event is came from child iframe. */
            if (data.frameId !== this.get('configObject').id) {
                /*@<*/
                Debug.log('[ ACT_contentHtml5.js ] enablerActionHandler: event from different iframe, ignore it');
                /*>@*/
                return false;
            }

            actions = this.get('enablerActions');

            if (data.actionName === 'track') {
                actions.track(data);
            } else if (actions.hasOwnProperty(data.id)) {
                actions[data.id](data);
            }

            return true;
        },

        /**
         * @method changeStyles
         * @param {Object} styles New styles to be applied
         */
        changeStyles: function (styles, done) {
            var node = this.get('node');

            Dom.applyStyles(node, styles);

            if (Lang.isFunction(done)) {
                done();
            }
        }
    });

    return ContentHtml5;
});
