/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * The 'ContentContainer' is a capability made to generate a 'DIV' tag use as a container.
 *
 * Available 'actions':
 * - openURL
 * - showContainer
 * - hideContainer
 * - changeStyles
 *
 * Available 'triggers':
 * - click
 * - mouseenter
 * - mouseleave
 *
 * Example of 'SuperConf' use case:
 * ```
 *    {
 *        id: 'mpu_container',
 *        type: 'content-container',
 *        classNode: 'mpu_container_class',
 *        env: ['html','flash','backup'],
 *        css: {
 *            width:'350'
 *        },
 *        eventConfig: [{
 *            eventType: 'click',
 *            actions: [
 *                {
 *                    type: 'openURL',
 *                    URLpath: 'https://www.yahoo.com',
 *                    URLname: 'mpu_click_clicktag_open'
 *                }
 *            ],
 *            timeTo: 2
 *        }],
 *        content: []
 *    }
 * ```
 *
 * @module ContentContainer
 * @main ContentContainer
 * @class ContentContainer
 * @requires Dom, lang, event, Class, Capability
 * @global
 */
ACT.define('ContentContainer', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang', 'Event', 'Class', 'Capability', 'Animation'], function (ACT) {
    'use strict';

    /* Shorthand */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Animation = ACT.Animation;
    var Class = ACT.Class;
    var Capability = ACT.Capability;

    /* Constants */
    var EVENT_CONTAINER_SHOW = 'container:show';
    var EVENT_CONTAINER_HIDE = 'container:hide';
    var EVENT_CONTAINER_ANIMATE = 'container:animate';
    var EVENT_CONTAINER_OPEN_URL = 'container:openURL';
    var EVENT_CONTAINER_START_FADE_TO = 'container:startFadeTo';
    var EVENT_CONTAINER_STOP_FADE_TO = 'container:stopFadeTo';
    var EVENT_CONTAINER_CHANGE_STYLES = 'container:changeStyles';
    var EVENT_CONTAINER_STOP_COUNTER = 'container:stopCounter';
    var EVENT_GLOBAL_CHECK_ACTION_CONDITION = 'standardAd:checkActionCondition';
    var EVENT_GLOBAL_ACTION_COMPLETE = 'complete:action';
    var DEFAULT_ACTION_TRIGGERS = [
        'click',
        'mouseenter',
        'mouseleave'
    ];

    var activeCounters = [];

    /* Action List */
    var contentActions = [{
        type: 'openURL',
        argument: {
            URLpath: {
                name: 'URLpath',
                test: function (value) {
                    return Lang.isString(value);
                }
            },
            URLname: {
                name: 'URLname',
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
            Event.fire(EVENT_CONTAINER_OPEN_URL, {
                from: args.from,
                URLpath: args.URLpath,
                URLname: args.URLname,
                done: function () {
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }
            });
        }
    }, {
        type: 'containerShow',
        argument: {
            id: {
                name: 'id',
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
            Event.fire(EVENT_CONTAINER_SHOW, {
                containerId: args.id,
                done: function () {
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }
            });
        }
    }, {
        type: 'containerHide',
        argument: {
            id: {
                name: 'id',
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
            Event.fire(EVENT_CONTAINER_HIDE, {
                containerId: args.id,
                done: function () {
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }
            });
        }
    }, {
        type: 'containerChangeStyles',
        argument: {
            id: {
                name: 'id',
                test: function (value) {
                    return Lang.isString(value);
                }
            },
            styles: {
                name: 'styles',
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
            Event.fire(EVENT_CONTAINER_CHANGE_STYLES, {
                containerId: args.id,
                styles: args.styles,
                done: function () {
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }
            });
        }
    }, {
        type: 'containerStartFadeTo',
        argument: {
            id: {
                name: 'id',
                test: function (value) {
                    return Lang.isString(value);
                }
            },
            to: {
                name: 'to',
                test: function (value) {
                    return Lang.isString(value);
                }
            },
            delay: {
                name: 'delay',
                test: function (value) {
                    return Lang.isNumber(value);
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
            Event.fire(EVENT_CONTAINER_START_FADE_TO, {
                containerId: args.id,
                targetId: args.to,
                delay: parseInt(args.delay, 10)
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'containerStopFadeTo',
        argument: {
            id: {
                name: 'id',
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
            Event.fire(EVENT_CONTAINER_STOP_FADE_TO, {
                containerId: args.id
            });
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }, {
        type: 'containerAnimate',
        argument: {
            id: {
                name: 'id',
                test: function (value) {
                    return Lang.isString(value);
                }
            },
            from: {
                name: 'from',
                test: function (value) {
                    return Lang.isObject(value);
                }
            },
            to: {
                name: 'to',
                test: function (value) {
                    return Lang.isObject(value);
                }
            },
            duration: {
                name: 'duration',
                test: function (value) {
                    return Lang.isNumber(value);
                }
            },
            delay: {
                name: 'delay',
                test: function (value) {
                    return Lang.isNumber(value);
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
            Event.fire(EVENT_CONTAINER_ANIMATE, {
                containerId: args.id,
                from: args.from || {},
                to: args.to || {},
                duration: parseInt(args.duration, 10) || 1,
                delay: parseInt(args.delay, 10) || 0,
                done: function () {
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }
            });
        }
    }, {
        type: 'containerStopProcesses',
        argument: {
            timeout: {
              name: 'timeout',
              test: function (value) {
                return Lang.isNumber(value) || value === undefined || value === null;
              }
            }
        },
        process: function (actionId) {
            Event.fire(EVENT_CONTAINER_STOP_COUNTER);
            // this action remove itself
            Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
        }
    }];

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_contentContainer.js ] ContentContainer Loaded');
    /*>@*/

    /**
     * @class ContentContainer
     * @constructor
     */
    function ContentContainer(config) {
        this.init(config);
        // ContentContainer.superclass.constructor.apply(this, arguments);
    }

    ContentContainer.ATTRS = {
        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'ContentContainer',

        /**
         * @attribute version
         * @type String
         */
        version: '1.0.41'
    };

    /* Private methods */

    /**
     * @method openUrl
     * @private
     * @param {String} URLpath
     * @param {String} URLname
     * @param {Function} done Optional function executed once the logic is done
     */
    function openUrl(URLpath, URLname, done) {
        // Before open clickTag, the destination URL need to be wrapped inside a tracking link.
        // The event below is to get wrapped tracking link from tracking module before open the link
        var listener = Event.on('tracking:registerRedirect:complete', function (eventData) {
            if (eventData.link !== '') {
                window.open(eventData.link, '_blank');
                Event.fire('STOP_CONTENT');

                if (done) {
                    done(eventData.link);
                }
            }
            listener.remove();
        });

        Event.fire('tracking:registerRedirect', {
            clickTag: URLpath,
            clickTagName: URLname
        });
    }

    /**
     * Listener for openURL event
     * this listen cannot be put inside container instance because it will be fired everytime a new container is created
     */
    Event.on(EVENT_CONTAINER_OPEN_URL, function (args) {
        openUrl(args.URLpath, args.URLname, args.done);
    });

    /**
     * Add action on trigger of setInterval after delay
     *
     * @method addCounterTrigger
     * @private
     * @param {Object} actionToAdd
     */
    function addCounterTrigger(actionToAdd) {
        var time = parseInt(actionToAdd.timeTo, 10) * 1000;
        var action = actionToAdd.actions;
        // gets one actions
        var counter = setInterval(function () {
            window.clearInterval(counter);
            Event.fire('add:actions', action);
        }, time);

        activeCounters.push(counter);
    }

    /**
     * Subscribe trigger action to the container's listeners
     *
     * @method subscribeTriggerToContainerEvent
     * @private
     * @param {HTMLElement} node, node to attach event
     * @param {String} action, action to fire
     */
    function subscribeTriggerToContainerEvent(node, actionConfig) {
        Event.on(actionConfig.eventType, function (e) {
            Event.preventDefault(e);
            Event.fire(EVENT_GLOBAL_CHECK_ACTION_CONDITION, {
                actionConfig: actionConfig,
                callback: function (isExecutable) {
                    if (isExecutable) {
                        if (Lang.objHasKey(actionConfig, 'timeTo') && actionConfig.timeTo !== '') {
                            addCounterTrigger(actionConfig);
                        } else {
                            Event.fire('add:actions', actionConfig.actions);
                        }
                    } /*@<*/ else {
                        Debug.warn('[ ACT_contentContainer.js ] : Action is not executable : ', actionConfig);
                    }
                    /*>@*/
                }
            });
        }, node);
    }

    /**
     * Set the event configuration to the node
     *
     * @method setButtonConfig
     * @private
     * @param {HTMLElement} node, node to attach events
     * @param {String} eventConfig, Configuration object for node
     */
    function setButtonConfig(node, eventConfig) {
        var name;
        var action;
        if (typeof eventConfig !== 'object') {
            return;
        }
        node.style.cursor = 'pointer';
        for (name in eventConfig) {
            /* istanbul ignore else */
            if (eventConfig.hasOwnProperty(name)) {
                action = eventConfig[name];
                if (Lang.arrayIndexOf(DEFAULT_ACTION_TRIGGERS, action.eventType) !== -1) {
                    subscribeTriggerToContainerEvent(node, action);
                }
            }
        }
    }

    /* Public methods */
    Lang.extend(ContentContainer, [Capability, Class], {
        /**
         * Function auto initiated when the class is instantiated
         *
         * @method initializer
         * @param {Object} config
         */
        initializer: function (config) {
            // subscribes and save listeners
            this.initializeListeners();

            // save configObject reference
            this.set('configObject', config);

            // register action to actions-queue
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
                Event.on('screen:status', function (status) {
                    if (root.get('configObject') && root.get('configObject').resize) {
                        root.resize(status, root.get('configObject'));
                    }
                }),

                Event.on(EVENT_CONTAINER_SHOW, function (eventData) {
                    if (eventData.containerId === root.get('id')) {
                        root.showContainer(eventData.done);
                    }
                }),

                Event.on(EVENT_CONTAINER_HIDE, function (eventData) {
                    if (eventData.containerId === root.get('id')) {
                        root.hideContainer(eventData.done);
                    }
                }),

                Event.on(EVENT_CONTAINER_CHANGE_STYLES, function (eventData) {
                    if (eventData.containerId === root.get('id')) {
                        root.changeStyles(eventData.styles, eventData.done);
                    }
                }),

                Event.on(EVENT_CONTAINER_START_FADE_TO, function (eventData) {
                    if (eventData.containerId === root.get('id')) {
                        root.startFadeTo(eventData.targetId, eventData.delay);
                    }
                }),

                Event.on(EVENT_CONTAINER_STOP_FADE_TO, function (eventData) {
                    if (eventData.containerId === root.get('id')) {
                        root.stopFadeTo();
                    }
                }),

                Event.on(EVENT_CONTAINER_ANIMATE, function (eventData) {
                    if (eventData.containerId === root.get('id')) {
                        root.animateContainer(
                            eventData.from || {},
                            eventData.to || {},
                            eventData.duration,
                            eventData.delay || 0,
                            eventData.done
                        );
                    }
                }),

                Event.on(EVENT_CONTAINER_STOP_COUNTER, function () {
                    root.stopCounter();
                })
            );
        },

        /**
         * Function called when the instance is destroyed
         *
         * @method destructor
         */
        destructor: function () {
            var node = this.get('node');
            if (Dom.isDomElement(node) && node.parentNode) {
                // Event.purgeListeners(node);
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
            var node = document.createElement('div');
            node = this.applyNodeConfig(node, configObject);
            // set inner text
            if (configObject.containerConfig) {
                node.innerHTML = configObject.containerConfig.innerText || '';
            }

            // set click action to container if defined
            setButtonConfig(node, configObject.eventConfig);

            return node;
        },

        /**
         * Function generating the node 'DIV'
         *
         * @method getContent
         * @param {String} env Environment for rendering content such as html/flash/backup
         * @param {String} orientation Orientation of current device such as landscape and portraits for mobile
         * @return {HTMLElement} node
         */
        getContent: function (env, orientation) {
            var node = this.renderContent(this.get('configObject'), env, orientation);

            // save reference to the node
            this.set('node', node);
            return {
                node: node
            };
        },

        /*@<*/
        /**
         * for testing purpose only
         */
        openUrl: openUrl,
        /*>@*/

        /**
         * @method showContainer
         * @param {Function} done Optional function executed once the logic is done
         */
        showContainer: function (done) {
            this.get('node').style.display = 'block';
            if (done) {
                done();
            }
        },

        /**
         * @method hideContainer
         * @param {Function} done Optional function executed once the logic is done
         */
        hideContainer: function (done) {
            this.get('node').style.display = 'none';
            if (done) {
                done();
            }
        },

        /**
         * @method changeStyles
         * @param {Object} styles, information of the style to apply to node
         * @param {Function} done Optional function executed once the logic is done
         */
        changeStyles: function (styles, done) {
            var node = this.get('node');
            Dom.applyStyles(node, styles);
            if (done) {
                done();
            }
        },

        startFadeTo: function (to, delay) {
            var root = this;
            var target = Dom.byId(to);
            var node = this.get('node');

            this.FADE_EVENT = Event.on('mousemove', function () {
                if (root.fire) {
                    clearTimeout(root.fire);
                }

                if (delay && delay > 0) {
                    root.fire = setTimeout(function () {
                        clearTimeout(root.fire);
                        if (target.style.opacity === '1') {
                            Animation.anim(target, { opacity: '0' }, null, 500);
                        }
                    }, delay);
                }
                if (target.style.opacity === '0') {
                    Animation.anim(target, { opacity: '1' }, null, 500);
                }
            }, node);
        },

        stopFadeTo: function () {
            if (this.FADE_EVENT) {
                if (this.fire) {
                    clearTimeout(this.fire);
                }
                this.FADE_EVENT.remove();
            }
        },

        /**
         * @method animateContainer
         * @param {Object} from Initial styles of the container
         * @param {Object} to Final styles for the container
         * @param {Number} duration Second the animation happen
         * @param {Number} delay Delay time before the animation start
         * @param {Function} done Optional function executed once the logic is done
         */
        animateContainer: function (from, to, duration, delay, done) {
            Animation.anim(this.get('node'), from, to, duration, delay, null, done);
        },

        /**
         * @method stopCounter
         */
        stopCounter: function () {
            var i;
            // run array and shot anything there
            for (i = 0; i < activeCounters.length; i++) {
                window.clearInterval(activeCounters[i]);
            }
        }
    });

    return ContentContainer;
});
