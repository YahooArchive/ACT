/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/* eslint no-use-before-define: 0 */
/**
 * The new ACT.js global namespace object. If the `ACT` object is already defined, the existing ACT object will only be overwritten
 * IF the new one being loaded has a greater version than the existing one. Usage example is as follows:
 *
 *         ACT.define('name_of_module', [ 'required', 'sub', 'modules'], function (ACT) {
 *             // ACT is the global reference to the ACT instance with all the required modules loaded.
 *         });
 *
 * @module ACT
 * @main ACT
 * @class ACT
 * @global
 */
(function (ACT_CURRENT) {
    'use strict';

    /* Define private variables */
    var modules = {};
    var queue = {};
    var execQueue = [];
    var configs = {};
    var configQueue = {};
    var actObj;
    var waitForModules = {};

    /* Define Private functions */

    function checkExtraModules() {
        var tmpSet = {};
        var count = 0;
        var itor;
        for (itor in waitForModules) {
            if (waitForModules.hasOwnProperty(itor)) {
                if (!(itor in modules)) {
                    tmpSet[itor] = 1;
                    count++;
                }
            }
        }
        waitForModules = tmpSet;
        return count === 0;
    }

    /**
     * Traverse the queue of modules, if all the requirements have been met load it in.
     * @method checkQueue
     * @private
     */
    function checkQueue() {
        var key;
        var obj;

        for (key in queue) {
            /* istanbul ignore else */
            if (queue.hasOwnProperty(key)) {
                obj = queue[key];
                includeModules(key, obj.requires, obj.factory);
            }
        }
    }

    /**
     * Given that we have no more modules to load, run through the queue of functions that need to execute and execute them
     * @method runQueue
     * @private
     */
    function runQueue() {
        var count = countProperties(queue);
        var temp;
        var itor;

        if (count === 0) {
            for (itor = execQueue.length - 1; itor >= 0; itor--) {
                if (execQueue[itor] === null) {
                    continue;
                }
                temp = execQueue[itor];
                execQueue[itor] = null;
                temp();
            }
        }
    }

    /**
     * Given an object '{}' return the number of properties ( elements ) it contains.
     * @private
     * @method countProperties
     * @param {Object} obj Object to return the count from
     * @return {Number} count Number of properties contained in the object provided.
     */
    function countProperties(obj) {
        var count = 0;
        var prop;

        /* In case the object passed in is not of type 'object' return 0 as the count */
        if (typeof obj !== 'object') {
            return count;
        }

        for (prop in obj) {
            /* istanbul ignore else */
            if (obj.hasOwnProperty(prop)) {
                count++;
            }
        }
        return count;
    }

    /**
     * Include module being loaded in. Make sure to only load the new version.
     * @private
     * @method includeModules
     * @param {String} name Name of the module being loaded in
     * @param {Array} requires Array of the modules that this one has dependencies on.
     * @param {Function} factory Function that executes to load in this modules.
     */
    function includeModules(name, requires, factory) {
        var obj;
        if (checkDependencies(requires)) {
            /* Execute the factory, sending ACT as the parameter. */
            obj = factory(ACT);

            /* Check that this module has not been included already AND confirm that the version of the new module
             is bigger than the already loaded one - if one already exists.
             */
            if (!modules[name] || ('factory' in modules[name] && 'ATTRS' in modules[name].factory)) {
                include(modules, name, requires, obj);
                ACT[name] = obj;
            }
            /* Remove the module from the queue */
            delete queue[name];
            /* Once the module is included, cycle through the queue and load in any modules that are depending on this one. */
            checkQueue();
            ACT.ready();
        } else {
            /* Since we do not yet have all the required dependencies loaded, put this one into the queue */
            include(queue, name, requires, factory);
        }
    }

    /**
     * Check that the dependencies for a given module have been loaded in.
     * @private
     * @method checkDependencies
     * @param {Array} requires Array of the required dependencies for this module to function
     * @return {Boolean} true if all dependencies have been met, false otherwise.
     */
    function checkDependencies(requires) {
        var itor = 0;
        for (itor; itor < requires.length; itor++) {
            if (!modules[requires[itor]]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Include the defined module - either into the queue or the defined module set.
     * @private
     * @method include
     * @param {Object} group Set to add the new factory / module
     * @param {String} name The name of the  module
     * @param {Array} requires Array of dependencies
     * @param {Function} factory The function to execute once all the requirements have been met.
     */
    function include(group, name, requires, factory) {
        group[name] = group[name] || {};
        group[name].requires = requires;
        group[name].factory = factory;
    }

    actObj = {
        /*@<*/
        /* Expose these internal elements for Debug purposes */
        queue: queue,
        execQueue: execQueue,
        modules: modules,
        configQueue: configQueue,
        configs: configs,
        store: [],
        waitForModules: waitForModules,
        /*>@*/

        adQueue: [],

        /**
         * @attribute ATTRS
         * @type {{NAME: string, version: number}}
         */
        ATTRS: {
            NAME: 'ACT'
        },

        /**
         * Define a new module to be used with ACT
         * @public
         * @method define
         * @param {String} name Module name
         * @param {Array} requires Module dependencies
         * @param {Object} factory Factory method
         */
        define: function (name, requires, factory) {
            /*@<*/
            this.store.push({ name: name, requires: requires, factory: factory });
            /*>@*/
            includeModules(name, requires, factory);
        },

        /**
         * Checks if all modules and dependencies were loaded
         * @public
         * @method ready
         * @param {Object} obj
         * @return {boolean}
         */
        ready: function (obj, extras) {
            var temp;
            var count = countProperties(queue);
            var configCount = countProperties(configQueue);

            while (ACT.adQueue.length > 0) {
                temp = temp = ACT.adQueue.shift();
                execQueue.push(temp);
            }

            if (obj) {
                execQueue.push(obj);
            }

            if (extras) {
                this.addRequired(extras);
            }

            if (count === 0 && configCount === 0 && checkExtraModules() !== false) {
                /* We're ready, so run through the queue, and return true. */
                runQueue();
                return true;
            }
            /* The obj is already pushed into the queue. So return false. */
            return false;
        },

        addRequired: function (requiredSet) {
            var itor;
            if (typeof requiredSet === 'string') {
                waitForModules[requiredSet] = 1;
            } else {
                for (itor = 0; itor < requiredSet.length; itor++) {
                    waitForModules[requiredSet[itor]] = 1;
                }
            }
        },

        /**
         * Add a required module to the set of required modules
         * @public
         * @method addRequired
         * @param {String} String name of the modules
         * @return {boolean} true if already included, false otherwise.
         */
        requireConfig: function (str) {
            if (str in configs || str in configQueue) {
                delete configQueue[str];
                return true;
            }
            configQueue[str] = true;
            return false;
        },

        /**
         * Return the configuration ( superConf ) by name.
         * @public
         * @method getConfig
         * @param {String} name Name of the configuration object to return.
         * @return {Object} Configuration object, empty if not found.
         */
        getConfig: function (name) {
            var ret = {};
            /* If the config has been loaded, return it based on it's name. Empty object otherwise */
            /* istanbul ignore next */
            if (name in configs) {
                ret = configs[name];
            }
            return ret;
        },

        /**
         * Set the configuration object as it's loaded.
         * @public
         * @method setConfig
         * @param {String} name Name of the configuration object that is being loaded in
         * @param {Object} obj Object defining the configuration that is being loaded.
         */
        setConfig: function (name, obj) {
            /* If something has requested this config before it loaded, it's waiting in the config queue.
             Remove it once loaded.
             */
            if (name in configQueue) {
                delete configQueue[name];
            }
            /* Put the new config into the configs object for later user. */
            configs[name] = obj;
            /* Received a config. Lets see if there are things waiting for it to load in. */
            this.ready();
        }
    };

    /**
     NOTE: SafeFrames forces us to define the config before we include the library, like this:

     Traditional approach:
     <script language='javascript' src='library/files.js'></script>
     <script>
     var ad = ACT.base({});
     </script>

     Because of the load sequence is async in some browsers due to SafeFrames, having the config queue up
     guarantees that we execute the ad after the full library loaded, and the traditional approach changes to:

     <script>

     if (!window.ACT) {
                var ACT = {
                    adQueue:[];
                };
            }
     function MASTAD() {
                var ad = ACT.base({});
            }
     ACT.adQueue.push( MASTAD );

     </script>
     <script language='javascript' src='library/files.js'></script>
     */
    if (ACT_CURRENT && ACT_CURRENT.hasOwnProperty('version') && ACT_CURRENT.version < actObj.version) {
        actObj = ACT_CURRENT;
    } else {
        if (ACT_CURRENT.adQueue) {
            actObj.adQueue = ACT_CURRENT.adQueue;
        }
    }

    window.ACT = actObj;
}(window.ACT || {}));
