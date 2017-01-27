/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * The 'ContentThirdParty' is a capability made to generate a 'DIV' or an 'IFRAME' tag use as a container for a third party element.
 *
 * Available 'actions':
 * - thirdpartyStart
 * - thirdpartyStop
 * - thirdpartyBroadcast
 *
 * Available 'triggers' for thirdparty tag:
 * - expandEvent
 * - contractEvent
 * - closeEvent
 * - openEvent
 *
 *
 * Example of 'SuperConf' use case:
 *
 *      {
 *          id: 'thirdparty_container',
 *          type: 'content-thirdparty',
 *          classNode: 'thirdparty_class',
 *          env: ['html','flash'],
 *          css: {
 *              width:'970px',
 *              height:'250px'
 *          },
 *          thirdPartyConfig:{
 *              id: 'thirparty-id',
 *              iframe: true
 *          },
 *          eventActions: [{
 *              eventType: 'expandEvent',
 *              actions: [
 *                  {
 *                      type: 'thirdpartyStart',
 *                      to: 'thirdparty_container'
 *                  },
 *                  {
 *                      type: 'thirdpartyBroadcast',
 *                      to: 'thirdparty_container',
 *                      name: 'expandedEvent'
 *                  }
 *              ]
 *          }, {
 *              eventType: 'contractEvent',
 *              actions: [
 *                  {
 *                      type: 'thirdpartyStop',
 *                      id: 'thirdparty_container'
 *                  },
 *                  {
 *                      type: 'thirdpartyBroadcast',
 *                      to: 'thirdparty_container',
 *                      name: 'contractedEvent'
 *                  }
 *              ]
 *          }]
 *      }
 *
 * @module ContentThirdParty
 * @main ContentThirdParty
 * @class ContentThirdParty
 * @requires UA, Dom, lang, Event, Class, Capability
 * @global
 */
ACT.define('ContentThirdParty', [/*@<*/'Debug', /*>@*/ 'UA', 'Dom', 'Lang', 'Event', 'Class', 'Capability'], function (ACT) {
    'use strict';

    /* Shorthand */
    var UA = ACT.UA;
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    var Class = ACT.Class;
    var Event = ACT.Event;
    var Capability = ACT.Capability;

    var EVENT_THIRDPARTY_BROADCAST = 'thirdparty:broadcast';
    var EVENT_THIRDPARTY_START = 'thirdparty:start';
    var EVENT_THIRDPARTY_STOP = 'thirdparty:stop';

    var EVENT_GLOBAL_ACTION_COMPLETE = 'complete:action';
    var EVENT_GLOBAL_SCREEN_STATUS = 'screen:status';
    var EVENT_GLOBAL_STOP_CONTENT = 'STOP_CONTENT';

    var DEFAULT_CUSTOM_EVENT = {
        expandEvent: 'expandedEvent',
        contractEvent: 'contractedEvent',
        closeEvent: 'closedEvent',
        openEvent: 'openedEvent'
    };

    var contentActions = [{
        type: 'thirdpartyStart',
        argument: {
            to: {
                name: 'to',
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
            Event.fire(EVENT_THIRDPARTY_START, {
                containerId: args.to
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'thirdpartyStop',
        argument: {
            to: {
                name: 'to',
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
            Event.fire(EVENT_THIRDPARTY_STOP, {
                containerId: args.to
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'thirdpartyBroadcast',
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
            Event.fire(EVENT_THIRDPARTY_BROADCAST, {
                containerId: args.to,
                name: args.name
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }];

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('ContentThirdParty Loaded');
    /*>@*/

    /**
     * @constructor
     */
    function ContentThirdParty(config) {
        this.init(config);
        // ContentThirdParty.superclass.constructor.apply(this, arguments);
    }

    ContentThirdParty.ATTRS = {
        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'ContentThirdParty',

        /**
         * @attribute version
         * @type String
         */
        version: '1.1.0',

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
     * Generate the node div tag with params
     *
     * @method renderDiv
     * @private
     * @param {Object} config
     * @param {HTMLElement} thirdParty
     * @return {HTMLElement}
     */
    function renderDiv(config, thirdParty) {
        thirdParty.style.display = '';
        thirdParty.setAttribute('id', config.id);
        return thirdParty;
    }

    /**
     * Function to uncomment tags of string format
     * @method trimAndUncommentTags
     * @private
     * @param {String} tag
     * @retun {String} trimmed tag
     *
     */
    function trimAndUncommentTags(tag) {
        if (tag.substr(0, 4) === '<!--' && tag.substr(tag.length - 3, 3) === '-->') {
            tag = tag.substr(4);
            tag = tag.substring(0, tag.length - 3);
        }
        return tag;
    }

    /**
     * Generate the node iframe tag with params
     *
     * @method renderIframe
     * @private
     * @param {Object} config
     * @param {HTMLElement} thirdParty
     * @return {HTMLElement}
     */
    function renderIframe(config, thirdParty) {
        var iframe = document.createElement('iframe');
        var load;
        iframe.setAttribute('id', config.id);
        iframe.setAttribute('marginwidth', 0);
        iframe.setAttribute('marginheight', 0);
        iframe.setAttribute('hspace', 0);
        iframe.setAttribute('vspace', 0);
        iframe.setAttribute('frameborder', 0);
        iframe.setAttribute('scrolling', 'no');

        if (config.thirdPartyConfig.src !== undefined && config.thirdPartyConfig.src !== '') {
            iframe.setAttribute('src', config.thirdPartyConfig.src);
            return iframe;
        }

        load = function () {
            if (UA.ie === 8) {
                iframe.detachEvent('onload', load, false);
            } else {
                iframe.onload = null;
            }

            setTimeout(function () {
                var iframeContent = (iframe.contentWindow || iframe.contentDocument);
                var iframeDocument = (iframeContent.document) ? iframeContent.document : iframeContent;
                var code = (UA.ie === 8) ? thirdParty.childNodes[0].innerHTML : thirdParty.innerHTML;
                code = trimAndUncommentTags(code.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, ''));

                if (!UA.ie) {
                    iframeDocument.open();
                }
                iframeDocument.write('<body>' + code + '</body>');
                if (!UA.ie) {
                    iframeDocument.close();
                }
            }, 1);
        };

        if (UA.ie === 8) {
            iframe.attachEvent('onload', load, false);
        } else {
            iframe.onload = load;
        }

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

    /**
     * Create custom event cross browser
     * @param {String} eventName Event to trigger on
     * @param {Object} subscriber Dom element
     * @method create
     * @private
     */
    function create(eventName, subscriber) {
        var element = subscriber || document;

        /* istanbul ignore else */
        if (document.createEvent) {
            element[eventName] = document.createEvent('Event');
            element[eventName].initEvent('thirdparty:' + eventName, true, true);
        } else if (document.createEventObject) {
            element[eventName] = document.createEventObject();
            element[eventName].eventType = 'thirdparty:' + eventName;
        }
    }

    /**
     * Listen to event cross browser
     * @param {String} eventName
     * @param {String} callback
     * @method listen
     * @private
     */
    function listen(eventName, callback, subscriber) {
        var element = subscriber || document;

        /* istanbul ignore else */
        if (document.addEventListener) {
            element.addEventListener('thirdparty:' + eventName, callback, false);
        } else {
            element.documentElement.attachEvent('onpropertychange', function (e) {
                if (e.propertyName === ('thirdparty:' + eventName)) {
                    callback();
                }
            });
        }
    }

    /**
     * @method subscribeActionToCustomEvent
     * @private
     * @param {Object} action
     */
    function subscribeActionToCustomEvent(action) {
        if (DEFAULT_CUSTOM_EVENT.hasOwnProperty(action.eventType)) {
            create(DEFAULT_CUSTOM_EVENT[action.eventType], window);
            create(action.eventType, window);
            listen(action.eventType, function () {
                Event.fire('add:actions', action.actions);
            });
        }
    }

    /**
     * Dispatch event cross browser
     * @param {String} event
     * @method dispatch
     * @private
     */
    function dispatch(event, subscriber) {
        var element = subscriber || document;

        /* istanbul ignore else */
        if (document.dispatchEvent) {
            element.dispatchEvent(event);
        } else {
            element.documentElement[event.eventType]++;
        }
    }

    /* Public methods */
    Lang.extend(ContentThirdParty, [Capability, Class], {
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

            /* Register actions */
            Event.fire('register:Actions', contentActions);
        },

        /**
         * Function to initialize event listeners for this instance
         *
         * @method initializeListeners
         */
        initializeListeners: function () {
            var root = this;

            root.addEventListeners(
                Event.on(EVENT_THIRDPARTY_START, function (eventData) {
                    if (root.get('nodeId') === eventData.containerId) {
                        root.startThirdParty();
                    }
                }),
                Event.on(EVENT_THIRDPARTY_STOP, function (eventData) {
                    if (root.get('nodeId') === eventData.containerId) {
                        root.stopThirdParty();
                    }
                }),
                Event.on(EVENT_THIRDPARTY_BROADCAST, function (eventData) {
                    if (root.get('nodeId') === eventData.containerId) {
                        root.broadcastThirdParty(eventData.name);
                    }
                }),
                Event.on(EVENT_GLOBAL_SCREEN_STATUS, function (status) {
                    if (root.get('configObject') && root.get('configObject').resize) {
                        root.resize(status, root.get('configObject'));
                    }
                }),
                // TODO: Possibly add this to Class as well.
                Event.on(EVENT_GLOBAL_STOP_CONTENT, function () {
                    root.stopThirdParty();
                })
            );
        },

        /**
         * Start the third party
         * @method startThirdParty
         */
        startThirdParty: function () {
            var iframe = this.get('node');
            var config = this.get('configObject');
            var iframeContent;

            if (config.thirdPartyConfig.hasOwnProperty('iframe') && config.thirdPartyConfig.iframe && iframe) {
                iframeContent = (iframe.contentWindow || iframe.contentDocument);
                iframeContent.postMessage(
                    'YahooVideoStart',
                    '*'
                );
            }
        },

        /**
         * Stop the third party
         * @method stopThirdParty
         */
        stopThirdParty: function () {
            var iframe = this.get('node');
            var config = this.get('configObject');
            var iframeContent;

            if (config.thirdPartyConfig.hasOwnProperty('iframe') && config.thirdPartyConfig.iframe && iframe) {
                iframeContent = (iframe.contentWindow || iframe.contentDocument);
                iframeContent.postMessage(
                    'YahooVideoPause',
                    '*'
                );
            }
        },

        /**
         * Broadcast to third party
         * @method broadcastThirdParty
         */
        broadcastThirdParty: function (name) {
            if (typeof window[name] === 'object') {
                dispatch(window[name]);
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
            var thirdParty = document.getElementById(configObject.thirdPartyConfig.id);
            var node = (configObject.thirdPartyConfig.iframe) ? renderIframe(configObject, thirdParty) : renderDiv(configObject, thirdParty);

            genarateEventActions(configObject.eventActions, subscribeActionToCustomEvent);
            node = this.applyNodeConfig(node, configObject);
            return node;
        },
        /**
         * Function generating the node 'OBJECT'
         * @method getContent
         * @public
         * @param {String} env Environment for rendering content such as html/flash/backup
         * @param {String} orientation Orientation of current device such as landscape and portraits for mobile
         * @return {Object}
         */
        getContent: function (env, orientation) {
            var node = this.renderContent(this.get('configObject'), env, orientation);
            this.set('node', node);

            return {
                node: node
            };
        }
    });

    return ContentThirdParty;
});
