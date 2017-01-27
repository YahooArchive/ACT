/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * The 'ContentCarousel' is a capability made to render its contents into a carousel slideshow with actions available to move the slides
 *
 * Available 'actions':
 * - carouselNextSlide
 * - carouselPreviousSlide
 * - carouselJumpToSlide
 *
 * Available 'triggers':
 * - carouselAnimationStart
 * - carouselAnimationComplete
 * - carouselAnimationPanel[X]Play
 *
 * Example of 'SuperConf' use case:
 *
 *     {
 *         id: 'carousel_one',
 *         type: 'content-carousel',
 *         classNode: 'mpu_container_class',
 *         env: ['html','flash','backup'],
 *         css: {
 *           width: 300
 *         },
 *         ContentCarouselConfig: {
 *            transitionTime: 500,
 *            currentSlideId: 2
 *          },
 *         eventConfig: [],
 *         content: []
 *      }
 *
 * @module ContentCarousel
 * @main ContentCarousel
 * @class ContentCarousel
 * @requires Dom, Lang, Event, Class, Animation, Capability
 * @global
 */
ACT.define('ContentCarousel', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang', 'Event', 'Class', 'Animation', 'Capability'], function (ACT) {
    'use strict';

    /* Constants */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Animation = ACT.Animation;
    var Class = ACT.Class;
    var Capability = ACT.Capability;

    var PRESET_CLASS = {
        CAROUSEL_CONTAINER: 'carousel-container',
        RELATIVE_CONTAINER: 'carousel-relative-container',
        HOLDER_CONTAINER: 'carousel-holder-container'
    };
    var PRESET_CSS = {
        ROOT_CONTAINER: {
            overflow: 'hidden'
        },
        RELATIVE_CONTAINER: {
            position: 'relative'
        },
        HOLDER_CONTAINER: {
            position: 'absolute',
            cursor: 'pointer'
        }
    };
    var PRESET_DIRECTION = {
        LEFT: -1,
        RIGHT: 1
    };
    var EVENT_GLOBAL_ACTION_ADD = 'add:actions';
    var EVENT_GLOBAL_ACTION_COMPLETE = 'complete:action';
    var EVENT_GLOBAL_CHECK_ACTION_CONDITION = 'standardAd:checkActionCondition';
    var EVENT_CAROUSEL_SLIDE_TRANSITION = 'carousel:slideTransition';
    var EVENT_CAROUSEL_JUMP_TO_SLIDE = 'carousel:jumpToSlide';
    var EVENT_CAROUSEL_ANIMATION_STATE = 'carousel:animationState';
    var DEFAULT_CAROUSEL_PANEL_VIEW_EVENT_PREFIX = 'carouselAnimationPanel';
    var DEFAULT_CAROUSEL_ANIMATION_EVENTS = {
        carouselAnimationStart: '',
        carouselAnimationComplete: ''
    };

    /* istanbul ignore next */
    var contentActions = [{
        type: 'carouselNextSlide',
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
            Event.fire(EVENT_CAROUSEL_SLIDE_TRANSITION, {
                to: args.to,
                direction: 'LEFT',
                done: function () {
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }
            });
        }
    }, {
        type: 'carouselPreviousSlide',
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
            Event.fire(EVENT_CAROUSEL_SLIDE_TRANSITION, {
                to: args.to,
                direction: 'RIGHT',
                done: function () {
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }
            });
        }
    }, {
        type: 'carouselJumpToSlide',
        argument: {
            to: {
                name: 'to',
                test: function (value) {
                    return Lang.isString(value);
                }
            },
            slidePositionId: {
                name: 'slidePositionId',
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
            Event.fire(EVENT_CAROUSEL_JUMP_TO_SLIDE, {
                to: args.to,
                slidePositionId: args.slidePositionId,
                done: function () {
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }
            });
        }
    }];

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('ContentCarousel loaded');
    /*>@*/

    /**
     * @class ContentCarousel
     * @constructor
     */
    function ContentCarousel(config) {
        this.init(config);
    }

    ContentCarousel.ATTRS = {
        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'ContentCarousel',

        /**
         * @attribute version
         * @type String
         */
        version: '1.1.0',

        /**
         * @attribute node
         * @type HTMLElement
         */
        node: null,

        /**
         * @attribute relativeContainer
         * @type HTMLElement
         */
        relativeContainer: null,

        /**
         * @attribute holderContainer
         * @type HTMLElement
         */
        holderContainer: null,

        /**
         * Transition time in milliseconds
         * @attribute transitionTime
         * @type Number
         * @default 1000
         */
        transitionTime: 1000,

        /**
         * ID of the current showing slide
         * @attribute currentSlideId
         * @type Number
         * @default 0
         */
        currentSlideId: 0,

        /**
         * @attribute slideContentList
         * @type Array
         */
        slideContentList: []
    };

    /**
     * Subscribe trigger action to the carousels listeners
     *
     * @method subscribeTriggerToCarouselEvent
     * @private
     * @param {String} action, action to fire
     */
    function subscribeTriggerToCarouselEvent(actionConfig) {
        Event.on(EVENT_CAROUSEL_ANIMATION_STATE, function (eventData) {
            if (eventData.data === actionConfig.eventType) {
                Event.fire(EVENT_GLOBAL_CHECK_ACTION_CONDITION, {
                    actionConfig: actionConfig,
                    callback: function (isExecutable) {
                        if (isExecutable) {
                            Event.fire(EVENT_GLOBAL_ACTION_ADD, actionConfig.actions);
                        } /*@<*/ else {
                            Debug.warn('Actions is not executable!', actionConfig);
                        }
                        /*>@*/
                    }
                });
            }
        });
        /*@<*/
        Debug.log('ContentCarousel: Attaching carousel event ' + actionConfig);
        /*>@*/
    }

    /**
     * Attach action for an event
     *
     * @method attachCarouselEventActions
     * @private
     * @param {String} node, node to attach events
     * @param {String} eventConfig, list of event
     */
    function attachCarouselEventActions(eventConfig) {
        var index;
        var actionConfig;
        if (!Lang.isArray(eventConfig)) {
            return;
        }

        for (index = 0; index < eventConfig.length; index++) {
            actionConfig = eventConfig[index];
            /* istanbul ignore next */
            if (DEFAULT_CAROUSEL_ANIMATION_EVENTS.hasOwnProperty(actionConfig.eventType)) {
                subscribeTriggerToCarouselEvent(actionConfig);
            } else if (actionConfig.eventType.substring(0, 22) === DEFAULT_CAROUSEL_PANEL_VIEW_EVENT_PREFIX) {
                subscribeTriggerToCarouselEvent(actionConfig);
            }
        }
    }

    /* Public methods */
    Lang.extend(ContentCarousel, [Class, Capability], {
        /**
         * Function auto initiated when the class is instantiated
         * @method initializer
         * @param {Object} config
         */
        initializer: function (config) {
            this.initializeListeners();
            this.set('configObject', config);
            if (Lang.isNumber(config.ContentCarouselConfig.transitionTime)) {
                this.set('transitionTime', parseInt(config.ContentCarouselConfig.transitionTime, 10));
            }

            if (Lang.isNumber(config.ContentCarouselConfig.currentSlideId)) {
                this.set('currentSlideId', parseInt(config.ContentCarouselConfig.currentSlideId, 10));
            }

            attachCarouselEventActions(config.eventConfig);
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
                Event.on(EVENT_CAROUSEL_SLIDE_TRANSITION, function (eventData) {
                    if (eventData.to === root.get('configObject').id) {
                        if (eventData.direction === 'LEFT') {
                            root.slideLeft(eventData.done);
                        }
                        if (eventData.direction === 'RIGHT') {
                            root.slideRight(eventData.done);
                        }
                    }
                }),

                Event.on(EVENT_CAROUSEL_JUMP_TO_SLIDE, function (eventData) {
                    if (eventData.to === root.get('configObject').id) {
                        root.jumpToSlide(parseInt(eventData.slidePositionId, 10), eventData.done);
                    }
                })
            );
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
            Dom.applyStyles(node, PRESET_CSS.ROOT_CONTAINER);
            return node;
        },

        /**
         * Function to return the generated node for ACT Scaffolding
         * @method getContent
         * @param {String} env Environment for rendering content such as html/flash/backup
         * @param {String} orientation Orientation of current device such as landscape and portraits for mobile
         * @return {HTMLElement} node
         */
        getContent: function (env, orientation) {
            var node = this.renderContent(this.get('configObject'), env, orientation);
            this.set('node', node);
            this.createRelativeContainer();
            this.createHolderContainer();
            return {
                node: node
            };
        },

        /**
         * Function to create a relative container to ensure carousel position is correct on page
         * @method createRelativeContainer
         */
        createRelativeContainer: function () {
            var relativeNode = document.createElement('div');

            if (Lang.isString(PRESET_CLASS.RELATIVE_CONTAINER) && PRESET_CLASS.RELATIVE_CONTAINER !== '') {
                relativeNode.className += ' ' + PRESET_CLASS.RELATIVE_CONTAINER;
            }

            Dom.applyStyles(relativeNode, PRESET_CSS.RELATIVE_CONTAINER);
            this.set('relativeContainer', relativeNode);
            this.get('node').appendChild(relativeNode);
        },

        /**
         * Function to create the Carousels main container and append content
         * @method createHolderContainer
         */
        createHolderContainer: function () {
            var root = this;
            var carouselContainer = this.get('node');
            var holderNode = document.createElement('div');
            var totalHolderWidth = 0;

            if (Lang.isString(PRESET_CLASS.HOLDER_CONTAINER) && PRESET_CLASS.HOLDER_CONTAINER !== '') {
                holderNode.className += ' ' + PRESET_CLASS.HOLDER_CONTAINER;
            }

            Dom.applyStyles(holderNode, PRESET_CSS.HOLDER_CONTAINER);
            this.set('holderContainer', holderNode);
            this.get('relativeContainer').appendChild(holderNode);
            carouselContainer.appendChild = function (content) {
                root.appendChildNode(content);
                totalHolderWidth += parseInt(content.style.width, 10);
                Dom.applyStyles(holderNode, {
                    width: totalHolderWidth + 'px'
                });
            };
        },

        /**
         * Function to append new node content into Carousel
         *
         * @method appendChildNode
         * @param {Node} content child Node to be appened
         */
        appendChildNode: function (content) {
            this.get('holderContainer').appendChild(content);
            this.addSlideContent(content);
        },

        /**
         * Function to add new slide content to the slideContentList
         * If new item is not a Node object, we will not add it to the list
         *
         * @method addSlideContent
         * @param {Node} node to be add
         */
        addSlideContent: function (newItem) {
            var items = this.get('slideContentList');
            items.push(newItem);
            this.preparePosition();
        },

        /**
         * Function to get next ID base on direction
         *
         * @method getNextSlideId
         * @param {Number} direction of the next slide. Direction = 1 to move right, -1 to move left
         * @return {Number} Id of the next slide
         */
        getNextSlideId: function (direction) {
            var nextID;
            direction = direction > 0 ? PRESET_DIRECTION.RIGHT : PRESET_DIRECTION.LEFT;
            nextID = this.get('currentSlideId') + direction;

            if (nextID < 0) {
                nextID = this.get('slideContentList').length - 1;
            } else if (nextID >= this.get('slideContentList').length) {
                nextID = 0;
            }
            return nextID;
        },

        /**
         * Function to jump to a new slide without animation
         *
         * @method jumpToSlide
         * @param {Number} slidePositionId
         * @param {Function} done
         */
        jumpToSlide: function (slidePositionId, done) {
            this.set('currentSlideId', slidePositionId);
            this.preparePosition(PRESET_DIRECTION.LEFT);

            /* istanbul ignore else */
            if (done) {
                done();
            }
        },

        /**
         * Prepare slides for next possible transition
         *
         * @method preparePosition
         * @param {Number} direction direction to follow
         */
        preparePosition: function (direction) {
            var items = this.get('slideContentList');
            var previousId = this.getNextSlideId(-1);
            var nextId = this.getNextSlideId(1);
            var holderWidth = ACT.Lang.numberific(this.get('configObject').css.width);
            var index;

            for (index = 0; index < items.length; index++) {
                if (index === this.get('currentSlideId')) {
                    Dom.applyStyles(items[index], {
                        position: 'absolute',
                        left: '0px',
                        display: 'block'
                    });
                } else if ((index === previousId) && (direction === PRESET_DIRECTION.RIGHT)) {
                    Dom.applyStyles(items[index], {
                        left: '-' + (holderWidth) + 'px',
                        display: 'block',
                        position: 'absolute'
                    });
                } else if ((index === nextId) && (direction === PRESET_DIRECTION.LEFT)) {
                    Dom.applyStyles(items[index], {
                        left: (holderWidth) + 'px',
                        display: 'block',
                        position: 'absolute'
                    });
                } else {
                    Dom.applyStyles(items[index], {
                        display: 'none'
                    });
                }
            }
        },

        /**
         * sliding to the left behaviour
         *
         * @method slideLeft
         * @param {Function} done
         */
        slideLeft: function (done) {
            this.slideAnimation(PRESET_DIRECTION.LEFT);
            /* istanbul ignore else */
            if (done) {
                done();
            }
        },

        /**
         * sliding to the right behaviour
         *
         * @method slideRight
         * @param {Function} done
         */
        slideRight: function (done) {
            this.slideAnimation(PRESET_DIRECTION.RIGHT);
            /* istanbul ignore else */
            if (done) {
                done();
            }
        },

        /**
         * Animation for sliding behaviour
         *
         * @method slideAnimation
         * @param {1 | -1} direction 1 if sliding to the right and -1 if sliding to the left
         * @param {Function} callback
         */
        slideAnimation: function (direction) {
            var root = this;
            var holderContainer;
            var items;
            var currentSlide;
            var movingDistance;
            var transitionTime;
            var transition;

            if (root.get('slideContentList').length < 2) {
                return;
            }

            holderContainer = root.get('holderContainer');
            items = root.get('slideContentList');
            currentSlide = items[root.get('currentSlideId')];
            movingDistance = direction * (holderContainer.clientWidth / items.length);
            transitionTime = root.get('transitionTime');
            transition = {
                left: movingDistance
            };
            root.preparePosition(direction);


            Animation.anim(holderContainer, transition, null, transitionTime, 0,
                function () {
                    Event.fire(EVENT_CAROUSEL_ANIMATION_STATE, {
                        data: 'carouselAnimationStart'
                    });

                    Event.fire(EVENT_CAROUSEL_ANIMATION_STATE, {
                        data: 'carouselAnimationPanel' + root.get('currentSlideId') + 'Play'
                    });

                    root.set('currentSlideId', root.getNextSlideId(-1 * direction));
                },

                function () {
                    Dom.applyStyles(holderContainer, {
                        left: '0px'
                    });
                    Dom.applyStyles(currentSlide, {
                        display: 'none'
                    });
                    Dom.applyStyles(items[root.get('currentSlideId')], {
                        display: 'block',
                        left: '0px'
                    });

                    Event.fire(EVENT_CAROUSEL_ANIMATION_STATE, {
                        data: 'carouselAnimationComplete'
                    });
                });
        },

        /**
         * Function to be called when the instance is destroyed
         *
         * @method destructor
         */
        destructor: function () {
            var node = this.get('node');
            var nodeDom;
            if (Dom.isDomElement(node) && node.id !== undefined) {
                nodeDom = Dom.byId(node.id);
                nodeDom.parentNode.removeChild(nodeDom);
            }
        }
    });

    return ContentCarousel;
});
