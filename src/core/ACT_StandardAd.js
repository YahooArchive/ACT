/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT, window */
ACT.define('StandardAd', [/*@<*/'Debug', /*>@*/ 'Lang', 'Event', 'Class', 'Environment', 'LayersList', 'Screen'], function (ACT) {
    'use strict';
    /* Shorthand */
    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Class = ACT.Class;
    var Env = ACT.Environment;
    var LayersList = ACT.LayersList;
    var Screen = ACT.Screen;

    /*@<*/
    var Debug = ACT.Debug;
    /*>@*/

    var EVENT_GLOBAL_CHECK_ACTION_CONDITION = 'standardAd:checkActionCondition';

    var actions = [{
        type: 'replayAd',
        argument: {
            timeout: {
                name: 'timeout',
                test: function (value) {
                    return Lang.isNumber(value) || value === undefined || value === null;
                }
            }
        },
        process: function (actionId) {
            /* check argumments */

            /* stop any counter running */
            Event.fire('adProduct:stopCounter');

            Event.fire('layerList:resetInlineFrame');

            /* layers close all open */
            Event.fire('layerList:stopAllLayers');

            /* start ad again */
            Event.fire('adProduct:playAd', {
                forceFirstPlay: true
            });

            /* this action remove itself */
            Event.fire('complete:action', actionId);
        }
    }, {
        type: 'stopProcesses',
        argument: {
            timeout: {
                name: 'timeout',
                test: function (value) {
                    return Lang.isNumber(value) || value === undefined || value === null;
                }
            }
        },
        process: function (actionId) {
            Event.fire('adProduct:stopCounter');
            Event.fire('complete:action', actionId);
        }
    }];

    /**
     * @attribute activeCounters
     * @private
     * @static
     * @type Array
     */
    var activeCounters = [];

    /**
     * @class StandardAd
     * @module StandardAd
     * @param {Object} config
     */
    function StandardAd(config) {
        this.init(config);
    }

    /**
     * Class' attribute list
     */
    StandardAd.ATTRS = {
        NAME: 'StandardAd',
        version: '1.1.0',

        /**
         * @attribute baseConfig
         */
        baseConfig: '',

        /**
         * @attribute trackingConfig
         */
        tracking: '',

        /**
         * @attribute format
         */
        format: '',

        /**
         * @attribute sDarlaAPI
         */
        sDarlaAPI: undefined,

        /**
         * @attribute sDarlaKey
         */
        sDarlaKey: undefined,

        /**
         * @attribute firstPlay
         */
        firstPlay: true,

        /**
         * @attribute adEnvToPlay
         */
        adEnvToPlay: undefined,

        /**
         * Current screen status
         * @attribute status
         */
        status: {},

        /**
         * @attribute states
         */
        states: [],

        /**
         * @attribute isCookieAvailable
         */
        isCookieAvailable: true

    };

    /**
     * Class prototypes
     */
    Lang.extend(StandardAd, Class, {
        /*@<*/
        activeCounters: activeCounters,
        /*>@*/

        initializer: function (config) {
            var root = this;

            if ('parent' in config) {
                Lang.mix(this, config.parent);
            }

            this.setAttrs(this.config);

            /* Check that registration is complete and carry on */
            this.addEventListeners(
                Event.on('localRegister:registerAd:complete', function (data) {
                    /*@<*/
                    Debug.log('[ ACT_StandardAd.js ] : localRegister:registerAd:complete', data);
                    /*>@*/

                    /* If returned cookie status is not equal to 0 then we have no cookie support */
                    if (data.status !== 0) {
                        /* if there is error doing something */
                        root.set('isCookieAvailable', false);
                    } else {
                        root.set('firstPlay', data.firstPlay);
                        root.set('states', data.states);
                    }

                    root.addEventListeners(
                        Event.on('adProduct:playAd', function (onData) {
                            root.onReady(onData.forceFirstPlay);
                        }),

                        Event.on('adProduct:stopCounter', function () {
                            root.stopCounter();
                        }),

                        Event.on('adProduct:getDarlaAPI', function () {
                            Event.fire('adProduct:getDarlaAPI:done', {
                                sDarlaAPI: root.get('sDarlaAPI')
                            });
                        })
                    );

                    /* initialize modules */
                    root.startScreen();
                    root.startLayers();
                    root.onReady(false);

                    /* register ad actions into queue, last part */
                    Event.fire('register:Actions', actions);
                })
            );

            root.initializeEvents();

            /* start ad */
            root.startAd();

            /*@<*/
            Debug.log('[ ACT_StandardAd.js ] "this":', this);
            /*>@*/
        },

        /**
         * @method initializeEvents
         */
        initializeEvents: function () {
            var root = this;
            root.addEventListeners(
                Event.on(EVENT_GLOBAL_CHECK_ACTION_CONDITION, function (eventData) {
                    eventData.callback(root.isExecutable(eventData.actionConfig));
                })
            );
        },

        /**
         * @method startAd
         */
        startAd: function () {
            var root = this;
            root.startEnv();
            /* start the ad by registering its into cookie and wait for response from cookie */
            Event.fire('localRegister:registerAd', {
                adId: root.get('adId')
            });
        },

        /**
         * @method setActionTimeout
         */
        setActionTimeout: function () {
            var actionTimeout = this.get('baseConfig').actionTimeout;
            if (actionTimeout !== undefined && Lang.isNumber(actionTimeout)) {
                Event.fire('setTimeout:action', { actionTimeout: actionTimeout });
            }
        },

        /**
         * @method startEnv
         */
        startEnv: function () {
            var ev = new Env({
                forceEnv: this.get('baseConfig').forceEnv
            });
            var env = ev.checkEnv();
            this.set('adEnvToPlay', env);
        },

        /**
         * Initialize Fresco screen instance
         *
         * @method startScreen
         */
        startScreen: function () {
            var attr = {
                sDarlaAPI: this.get('sDarlaAPI')
            };
            var screenM = new Screen(attr);
            /*@<*/
            Debug.log('[ ACT_StandardAd.js ] : startScreen');
            /*>@*/
            this.set('status', screenM.get('status'));
        },

        /**
         * @method startLayers
         */
        startLayers: function (layers) {
            var root = this;
            var layersConfig = this.get('format').layers || layers;
            var layersSet = new LayersList({
                layersConfig: layersConfig,
                sDarlaAPI: root.get('sDarlaAPI'),
                envToPlay: root.get('adEnvToPlay'),
                status: root.get('status')
            });

            this.set('layersRef', layersSet);
        },

        /**
         * Start rendering the ad after all pre-rent works have done
         *
         * @method onReady
         */
        onReady: function (forceFirstPlay) {
            var root = this;
            var actionsExecuted;
            var statePlay = (forceFirstPlay || root.get('firstPlay')) ? 'firstPlay' : 'cappedPlay';

            /*@<*/
            Debug.log('[ ACT_StandardAd.js ] statePlay : ', statePlay);
            /*>@*/

            if (!root.get('format').flow) {
                /*@<*/
                Debug.warn('[ ACT_StandardAd.js ] : adproduct, onReady method, error = flow is not set, nothing will be played');
                /*>@*/
                return;
            }

            root.setActionTimeout();

            /* execute flow actions */
            actionsExecuted = root.executeFlow(root.get('format').flow, statePlay);

            /* if no action is executed and we are in capped play, then re-check all actions with force first play */
            if (!actionsExecuted && statePlay === 'cappedPlay') {
                /*@<*/
                Debug.log('[ ACT_StandardAd.js ] re-do flow with force first play ');
                /*>@*/
                root.onReady(true);
            }
        },

        /**
         * @method executeFlow
         */
        executeFlow: function (flow, statePlay) {
            var root = this;
            /* flag to mark if any actions has been executed */
            var actionsExecuted = false;
            var i;
            for (i = 0; i < flow.length; i++) {
                actionsExecuted = root.executeFlowActions(flow[i], statePlay) || actionsExecuted;
            }
            return actionsExecuted;
        },

        /**
         * @method executeFlowActions
         */
        executeFlowActions: function (flowConfig, statePlay) {
            var root = this;

            if (flowConfig.eventType === statePlay) {
                /* Confirm that this flow is ok to execute */
                if (root.isExecutable(flowConfig)) {
                    /* if 'timeTo' is defined, then add all of the actions to counter, and delay execution appropriately */
                    if (Lang.objHasKey(flowConfig, 'timeTo') && flowConfig.timeTo !== '') {
                        root.addCounterTrigger(flowConfig);
                    } else {
                        /* if no 'timeTo' is defined, then proceed with standard execution - if allowed to play */
                        Event.fire('add:actions', flowConfig.actions);
                    }
                    /* some actions has been executed */
                    return true;
                }
            }

            /* no action can be executed */
            return false;
        },

        /**
         * Check the doIf conditional, also confirm that the environment we are served in is allowed to play out our action.
         * @method isExecutable
         */
        isExecutable: function (flowConfig) {
            var executable = true;
            var conditions;
            var conditionCheck;
            var key;

            if (Lang.isArray(flowConfig.env)) {
				executable = Lang.inArray(flowConfig.env, this.get('adEnvToPlay')) || false;
            }

            /* if there are no conditionals then it's ok to execute */
            if (Lang.isObject(flowConfig.doIf) && !Lang.isObjectEmpty(flowConfig.doIf) && executable === true) {
				/* if there is doIf then check all conditions inside it */
				conditions = flowConfig.doIf;
				conditionCheck = {
					state: Lang.bind(this, null, this.isStateMatch),
					cookie: Lang.bind(this, null, this.isCookieMatch),
					date: Lang.bind(this, null, this.isDateMatch)
				};
				/* run through all conditions and check them with relevance functions */
				for (key in conditions) {
					if (Lang.objHasKey(conditions, key) && Lang.objHasKey(conditionCheck, key)) {
						executable = conditionCheck[key](conditions[key]);
						/* stop checking when there is one condition not match */
						if (executable === false) {
							/* istanbul ignore else */
							break;
						}
					}
				}
			}

            return executable;
        },

        /**
         * Checking if given state is matched with saved state from cookie
         *
         * @method isStateMatch
         * @param {Object} stateCondition State to be checked, should be object with format {id: [state_id], value: [state_value]}
         * @return {Boolean} true if given state is match with saved state
         */
        isStateMatch: function (stateCondition) {
            var states = this.get('states');
            var stateID = stateCondition.id;
            var stateValue = stateCondition.value;
            var id;
            /*@<*/
            Debug.log('[ ACT_StandardAd.js ]: state from cookies: ', states);
            /*>@*/

            for (id in states) {
                /* istanbul ignore else */
                if (states.hasOwnProperty(id)) {
                    if (stateID !== id || stateValue !== states[id]) {
                        return false;
                    }
                }
            }

            return true;
        },

        /**
         * Checking if cookieCondition is matching with current cookie state given by cookie module
         * @method isCookieMatch
         */
        isCookieMatch: function (cookieCondition) {
            return cookieCondition === this.get('isCookieAvailable');
        },

        /**
         * Checking dateCondition config with current date
         *
         * @method isDateMatch
         * @param {Object} dateCondition Config object for date condition. The object can have 'from' and 'to' attribute to set the date range
         * @return {Boolean} true of current date is in the date range
         */
        isDateMatch: function (dateCondition) {
            var isMatch = true;
            var now = Date.now();
            var from;
            var to;

            /* doing nothing if dateCondition is not an object */
            if (!Lang.isObject(dateCondition)) {
                return true;
            }

            /* if condition has from attribute then current date must greater or equal from time */
            if (Lang.objHasKey(dateCondition, 'from')) {
                from = new Date(dateCondition.from);

                /*@<*/
                if (isNaN(from.getTime())) {
                    Debug.warn('[ ACT_StandardAd.js ] : wrong date format for "from". Please follow the format "July 13, 2015 00:00:00"');
                }
                /*>@*/

                isMatch = isMatch && ((now - from) / 1000) >= 0;
            }

            /* if condition has to attribute then current date must smaller or equal from time */
            if (Lang.objHasKey(dateCondition, 'to')) {
                to = new Date(dateCondition.to);

                /*@<*/
                /* istanbul ignore next */
                if (isNaN(to.getTime())) {
                    Debug.warn('[ ACT_StandardAd.js ] : wrong date format for "to". Please follow the format "July 13, 2015 00:00:00"');
                }
                /*>@*/

                isMatch = isMatch && ((to - now) / 1000) >= 0;
            }

            return isMatch;
        },

        /**
         * @method addCounterTrigger
         */
        addCounterTrigger: function (actionToAdd) {
            // TODO check for requestframe API //
            // TODo validate attrs
            var time = parseInt(actionToAdd.timeTo, 10) * 1000;
            var action = actionToAdd.actions;
            /* gets one actions */
			var counter = setInterval(
				/* istanbul ignore next */
				function () {
					window.clearInterval(counter);
					Event.fire('add:actions', action);
			}, time);
			activeCounters.push(counter);
			return activeCounters;
            // listen for a stopAllProcess event
            // check if there's a counter otherwise
        },

        /**
         * @method stopCounter
         */
        stopCounter: function () {
            /* run array and shot anything there */
            while (activeCounters.length > 0) {
                window.clearInterval(activeCounters.pop());
            }
        }
    });

    return StandardAd;
});
