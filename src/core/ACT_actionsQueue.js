/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 * <br/>
 * Provide features:
 * - register action definition
 * - Add action to queue to be executed
 *
 * Action definition must be registered first like below example:
 *
 *     ACT.fire('register:Actions',
 *        {
 *            type: 'action_name', // must be unique name
 *            argument: {
 *                // list of argument accepted by this actions
 *                arg1: {
 *                    test: function(value) {
 *                        // function to check the value of arg1
 *                        // must return true or false
 *                        return true;
 *                    }
 *                },
 *                arg2: {
 *                    test: function(value) {
 *                        // function to check the value of arg2
 *                        // must return true or false
 *                        return true;
 *                    }
 *                }
 *             },
 *            proccess: function(data) {
 *                 //function to be executed when action is executed
 *                // data is an object with passed arguments, e.g:
 *                var arg1 = data.arg1;
 *                var arg2 = data.arg2;
 *            }
 *        }
 *     );
 *
 * After registered, action can be execute by adding it to actions queue:
 *
 *     ACT.fire('add:action',
 *        {
 *            type: 'unique_action_name',
 *            arg1: [value], // value for arg1 must satify arg1's test function in action definition
 *            arg2: [value], // value for arg2 must satify arg2's test function in action definition
 *         }
 *     );
 *
 * As the queue work in async order, complete:action event must be fired before the next action can be executed
 *
 *        ACT.fire('complete:action');
 *
 * @module actionsQueue
 * @main ActionsQueue
 * @class ActionsQueue
 * @requires event,lang
 * @global
 */
ACT.define('ActionsQueue', [/*@<*/'Debug', /*>@*/ 'Event', 'Lang', 'Class'], function (ACT) {
    'use strict';

    /* Shorthand */
    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Class = ACT.Class;
    /*@<*/
    var Debug = ACT.Debug;
    /*>@*/

    /**
     * @constructor
     * @param {Object} config ConfigObject to initialize ActionQueues
     */
    function ActionsQueue(config) {
        this.init(config);
    }

    ActionsQueue.ATTRS = {
        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'ActionsQueue',

        /**
         * @attribute version
         * @type String
         */
        version: '1.0.22',

        /**
         * List of actions have been registered
         * Only actions in this list is executable
         *
         * @attribute registeredActions
         * @type Object
         */
        registeredActions: {},

        /**
         * Queue for actions to be executed. This queue is processed with FIFO
         *
         * @attribute executeQueue
         * @type Array
         */
        executeQueue: [],

        /**
         * Flag for executing action. False means no action is executed at the moment and queue can run
         *
         * @attribute isRunning
         * @type Boolean
         * @default false
         */
        isRunning: false,

        /**
         * Current executing action
         *
         * @attribute currentAction
         * @type Object
         * default null
         */
        currentAction: null,

        /**
         * setTimeout function variable
         * @attribute timer
         * @type Object
         * default null
        */
        timer: null,

        /**
         * timeout (in seconds) for executing an action
         * @attribute actionTimeout
         * @type Number
         * default 1
         */
        actionTimeout: 0,

        /**
         * latest queue position Id
         * @attribute positionId
         * @type Number
         * default 0
        */
        positionId: 0

    };

    Lang.extend(ActionsQueue, Class, {

        initializer: function () {
              var root = this;

              /* istanbul ignore next */
            root.addEventListeners(
                /**
                 * @event register:Actions
                 * @param {Array | Object} List of actions' definition to be registered
                 */
                Event.on('register:Actions', function (eventData) {
                    root.registerActions(eventData);
                }),

                /**
                 * @event add:actions
                 * @param {Array | Object} List of actions to be execute
                 */
                Event.on('add:actions', function (eventData) {
                    root.addActions(eventData);
                }),

                /**
                 * @event complete:action
                 */
                Event.on('complete:action', function (queuePositionId) {
                    root.completeAction(queuePositionId);
                }),

                Event.on('setTimeout:action', function (eventData) {
                    root.setActionTimeout(eventData.actionTimeout);
                })
            );
        },

        /**
         * Register list of actions into ActionsQueue so it can be executable.
         *
         * @method registerActions
         * @param [Array | Object] actions List of actions' definition to be registered
         */
        registerActions: function (actions) {
            var registeredActions = this.get('registeredActions');
            var index;
            var action;
            /*@<*/
            Debug.log('[ ACT_actionsQueue.js ] ActionQueue:New register actions', actions);
            /*>@*/

            // run through all actions and add it to registeredActions list
            if (Lang.isArray(actions)) {
                for (index = 0; index < actions.length; index++) {
                    action = actions[index];
                    registeredActions[action.type] = action;
                }
                this.set('registeredActions', registeredActions);
            } else if (Lang.isObject(actions)) {
                registeredActions[actions.type] = actions;
                this.set('registeredActions', registeredActions);
            } else {
                return false;
            }

            return true;
        },

        /**
         * Adding list of actions (or single action ) into the queue.
         * If the input is Array then it's a list of action
         * If the input is Object then it's a single action
         *
         * @method addActions
         * @param {Array | Object} actions List of actions or an action
         * @return {Boolean} true if input is valid
         */
        addActions: function (actions) {
            var i;
            /*@<*/
            Debug.log('[ ACT_actionsQueue.js ] ActionQueue: add actions in for loop', actions);
            /*>@*/

            // if input is an array then go through every item and push it into the queue
            // if input is an object then push this to the queue as an actions
            // other than that, it's an invalid input then shoud do nothing
            if (Lang.isArray(actions)) {
                for (i = 0; i < actions.length; i++) {
                    this.enqueue(actions[i]);
                }
            } else if (Lang.isObject(actions)) {
                this.enqueue(actions);
            } else {
                return false;
            }

            // let's try to start the queue
            this.runQueue();

            return true;
        },

        /**
         * Checking if arguments come with the action are satisfied with action definition
         *
         * @method isActionArgumentsValid
         * @param {Object} action Action to be assessed
         * @return {Boolean} true if action is valid
         */
        isActionArgumentsValid: function (action) {
            var actionDefinition = this.get('registeredActions')[action.type];
            var result = true;
            var argDefinition;

            if (actionDefinition) {
                result = true;
                argDefinition = actionDefinition.argument;
                Lang.forEach(argDefinition, function (param, definition) {
                    if (Lang.isFunction(definition.test) && !definition.test(action[param])) {
                        /*@<*/
                        Debug.log('[ ACT_actionsQueue.js ] ActionQueue: Action ' + action.type + ' failed test for argument ' + definition + ' with param' + param);
                        /*>@*/
                        result = false;
                    }
                });
            } else {
                result = false;
            }

            return result;
        },

        /**
         * Function to execute given action
         *
         * @method executeAction
         * @param {Object} action Action to be executed
         */
        executeAction: function (queuePositionId, action) {
            var actionDefinition;
            if (this.isActionArgumentsValid(action)) {
                /*@<*/
                Debug.log('[ ACT_actionsQueue.js ] ActionQueue: execute action ', action);
                /*>@*/
                actionDefinition = this.get('registeredActions')[action.type];
                // call action's process function
                this.startTimeout(queuePositionId, action.type, action.timeout);
                this.currentAction = action;
                actionDefinition.process(queuePositionId, action);
                return true;
            }
            /*@<*/
            Debug.warn(' [ ACT_actionsQueue.js ] Cannot run action', action);
            /*>@*/
            this.completeAction(queuePositionId);
            return false;
        },

        /**
         * Checking if action is valid
         * action is valid if:
         *    is an object
         *    has type
         *    type is registered in registeredActions
         *
         * @method isValidAction
         * @param {Object} action Action to be verified
         */
        isValidAction: function (action) {
            // return Lang.isObject(action) && Lang.isString(action.type) && Lang.objHasKey(this.registeredActions, action.type);
            return Lang.isObject(action) && Lang.isString(action.type);
        },

        /**
         * Push item to the end of the queue
         * @method enqueue
         * @param {Object} action Action to be push into the queue
         */
        enqueue: function (action) {
            var executeQueue = this.get('executeQueue');
            var actionId;
            // check if action is valid then add it to the end of the queue
            if (this.isValidAction(action)) {
                actionId = this.get('positionId');
                executeQueue.push({ id: actionId, action: action });
                this.set('executeQueue', executeQueue);
                actionId++;
                this.set('positionId', actionId);
            }
        },

        /**
         * Removes the specified item (by queuePositionId) out of the queue
         * @method dequeue
         * @return {Object} First item on the actions queue
         */
        dequeue: function (queuePositionId) {
            // get item at position 0
            var queue = this.get('executeQueue');
            var i;

            for (i = 0; i < queue.length; i++) {
                if (queue[i].id === queuePositionId) {
                    queue.splice(i, 1);
                }
            }
            this.set('executeQueue', queue);
        },

        /**
         * Run the queue by getting the first item in the queue and execute this
         * To make sure the queue is running syncronym, a running flag will be checked before executing any action
         *
         * @method runQueue
         */
        runQueue: function () {
            // checking flag to make sure no other action is executed
            // dequeue to get new action for execution - need to check if there is action to be executed
            // turn on running flag
            // execute action
            var executeQueue = this.get('executeQueue');
            var action;
            /*@<*/
            Debug.log('[ ACT_actionsQueue.js ] ActionQueue: is running:', this.isRunning);
            /*>@*/

            if (!this.isRunning) {
                action = executeQueue[0] || null;
                /*@<*/
                Debug.log('[ ACT_actionsQueue.js ] ActionQueue: about to execute: ', action);
                /*>@*/
                if (action !== null) {
                    this.isRunning = true;
                    this.executeAction(action.id, action.action);
                } else {
                    this.currentAction = null;
                }
            }
        },

        /**
         * Notify to queue that the current executing action has finished and ready for the next one
         *
         * @method completeAction
         */
        completeAction: function (queuePositionId) {
            /*@<*/
            Debug.log('[ ACT_actionsQueue.js ] ActionQueue: Action completed - ' + this.get('executeQueue').length + ' actions left to do');
            /*>@*/
            // when action is complete then turn off running flag and try to runQueue again
            this.isRunning = false;
            this.dequeue(queuePositionId);
            clearTimeout(this.timer);
            this.runQueue();
        },


        /**
         * set the global timeout value
         *
         * @method setActionTimeout
         * @param {Number} timeoutValue global timeout value to apply to timer
         */
        setActionTimeout: function (timeoutValue) {
            this.set('actionTimeout', parseInt(timeoutValue, 10));
        },

        /**
         * start the timeout
         *
         * @method startTimeout
         * @param {String} actionType action Type using the timer
         * @param {Number} timeout timeout value to apply to timer
         */
        startTimeout: function (queuePositionId, actionType, timeout) {
            var root = this;
            var positionId = queuePositionId;
            var timer = root.get('timer');
            var setTimeoutVal;
            var time;

            timeout = parseInt(timeout, 10);

            if (timeout === 0) {
                setTimeoutVal = 0;
            } else {
                setTimeoutVal = timeout || this.get('actionTimeout');
            }

            time = parseInt(setTimeoutVal, 10) * 1000;

            if (timer > 0) {
                clearTimeout(timer);
                root.set('timer', timer);
            }

            if (time === 0) {
                return;
            }

            timer = setTimeout(function () {
                /* TODO: Switch this to a run-time error. */
                /*@<*/
                Debug.log('[ ACT_actionsQueue.js ] ActionQueue: Action ' + actionType + ' timed out at ' + setTimeoutVal + ' seconds');
                /*>@*/
                root.completeAction(positionId);
            }, time);
            this.set('timer', timer);
        },

        /**
         * Function to be called when the instance is destroyed
         *
         * @method destructor
         */
        destructor: function () {
            clearTimeout(this.get('timer'));
            this.set('executeQueue', []);
            this.set('registeredActions', {});
        }
    });

    return ActionsQueue;
});
