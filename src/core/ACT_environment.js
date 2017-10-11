/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/**
 * Force browsers to play specific environments based on their capabilities,
 * currently environment supported are flash, html, backup.
 * <br/>
 * __Default__ playing order is: HTML5 => Backup
 * In order to play flash, it must be force it
 * <br/>
 *
 * Steps to follow in order to force an environment:
 * <br/>
 * Add browser to be forced into configuration-object:
 *
 *     forceEnv = {
 *         forcedBackupList: {
 *             FireFox: "*",
 *         },
 *         forcedFlashList: {
 *             Safari: "*"
 *         },
 *             forcedHTML5List: {
 *         },
 *         forcedMobileList: {
 *         },
 *         forcedTabletList: {
 *         }
 *     };
 *
 * Add environment into capabilities env array, to associate them.
 *
 * Browser can be chosen by using the following options:
 *
 * All the browser versions:
 *
 *     // <browser-name>: '*'
 *     Firefox: '*'
 *
 * Specific browser version:
 *
 *     // <browser-name>: '<browser-version>'
 *     Firefox: '30'
 *
 * Greate than a version:
 *
 *      // <browser-name>: '>=<browser-version>'
 *      Firefox: '>=30'
 *
 * Lower than a version:
 *
 *     // <browser-name>: '<=<browser-version>'
 *     Firefox: '<=30'
 *
 * List of browser versions:
 *
 *     // <browser-name>: '<browser-version0>,<browser-version1>,<browser-version2>'
 *     Firefox: '30,31,33'
 *
 * @module environment
 * @main Environment
 * @class Environment
 * @requires Event,Lang, Class, UA
 * @global
 */

/* global ACT */
ACT.define('Environment', [/*@<*/'Debug', /*>@*/ 'Lang', 'Event', 'Class', 'UA'], function (ACT) {
    'use strict';

    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Class = ACT.Class;
    var UA = ACT.UA;

    var ALLBROWSERS = 'allBrowsers';

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_environment.js ]: loaded');
    /*>@*/

    /**
     * @class Environment
     * @param {Object} config
     */
    function Environment(config) {
        this.init(config);
    }

    /**
     * Class' attribute list
     */
    Environment.ATTRS = {
        NAME: 'Environment',
        forceEnv: {},
        forcedFlash: {},
        forcedHTML5: {},
        forcedBackup: {},
        forcedMobile: {},
        forcedTablet: {},
        currentEnvPlaying: ''
    };

    /**
     * Force browser by list of browser versions,
     * @method forceByBrowserVersion
     * @param {String} listBrowsers List of browser versions to be forced browser to it
     * @private
     */
    function forceByBrowserVersion(listBrowsers) {
        var arrayBrowsers = listBrowsers.split(',');
        var currentBrowser = parseInt(UA.browser.version, 10);
        var itor;

        for (itor = 0; itor < arrayBrowsers.length; itor++) {
            if (parseInt(arrayBrowsers[itor], 10) === currentBrowser) {
                // found the browser version, dont need to go further with the loop
                return true;
            }
        }
        return false;
    }

    function testCases(attr) {
        /* A list of tokens in an array, guarantees proper traversal in order.
           This way, we never match '<' before '<=' */
        var tokens = ['*', '<=', '>=', '<', '>'];
        var currentBrowserVersion = parseInt(UA.browser.version, 10);
        var itor;
        var userSelectedBrowserVersion;
        var myToken;
        for (itor = 0; itor < tokens.length; itor++) {
            myToken = tokens[itor];
            if (attr.indexOf(myToken) === 0) {
                userSelectedBrowserVersion = parseInt(attr.replace(myToken, ''), 10);
                /* It's possible to use 'eval' here and skip the switch statement.
                    I'm not a big fan of using eval though, so switch it is.
                    Example of using eval :
                    if( myToken === '*') {
                        return true
                    } else {
                        return eval ( currentBrowserVersion + myToken  + userSelectedBrowserVersion );
                    }
                */
                switch (myToken) {
                    case '*':
                        return true;
                    case '<=':
                        return currentBrowserVersion <= userSelectedBrowserVersion;
                    case '>=':
                        return currentBrowserVersion >= userSelectedBrowserVersion;
                    case '<':
                        return currentBrowserVersion < userSelectedBrowserVersion;
                    case '>':
                        return currentBrowserVersion > userSelectedBrowserVersion;
                    default:
                        continue;
                }
            }
        }
        /* A single digit string 'var digit = '5'; digit.split(',') === ['5']; */
        return forceByBrowserVersion(attr);
    }

    /**
     * Private function which is used to check the current browser against forcedHTML5List,
     * forcedFlashList and forcedBackupList lists. And returns true/false whether or not the current browser should be
     * forced to play a specific build type i.e. Flash/HTML or the backup.
     * @method forceBrowser
     * @param {Object} forcedObj This is the object (list of browser) which is passed in to check whether
     * or not the current browser is on the list of browsers passed in. If it is the it returns true or false.
     * In the initializer this function is used 3 times when forcedHTML5List, forcedFlashList and forcedBackupList are passed in as forcedObj.
     * @private
     * @type Function
     */
    function forceBrowser(forcedObj) {
        var allBrowsersShortHand = ALLBROWSERS.toLowerCase();
        var currentBrowserName = UA.browser.name.toLowerCase();
        var itor;

        for (itor in forcedObj) {
            /* istanbul ignore else */
            if (forcedObj.hasOwnProperty(itor)) {
                /* force all the browsers */
                if (itor.toLowerCase() === allBrowsersShortHand) {
                    return true;
                }
                /* if it's not current browser, jump to the next case */
                if (itor.toLowerCase() !== currentBrowserName) {
                    continue;
                }
                /* istanbul ignore else */
                if (testCases(forcedObj[itor]) === true) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Class prototypes
     */
    Lang.extend(Environment, Class, {

        initializer: function (/* config */) {
            var root = this;
            root.forceEnv();
            root.addEventListeners(
                Event.on('env:envRendered', function () {
                    /*@<*/
                    Debug.log('[ ACT_environment.js ] env:envRendered: ', root.get('currentEnvPlaying'));
                    /*>@*/
                    Event.fire('env:envRendered:Done', root.get('currentEnvPlaying'));
                })
            );
        },

        /*@<*/
        // LINT: Adding this, so lint doesn't complain that this function is never used.
        forceByBrowserVersion: forceByBrowserVersion,
        /*>@*/

        forceEnv: function (newUA) {
            /* Set of forced environments */
            var forceSet = ['forcedFlash', 'forcedHTML5', 'forcedBackup', 'forcedMobile', 'forcedTablet'];
            var itor;
            var key;
            var forceEnv;
            UA = newUA || UA;
            for (itor = 0; itor < forceSet.length; itor++) {
                key = forceSet[itor];

                forceEnv = this.get('forceEnv') || {};
                this.set(key, forceBrowser(forceEnv[key + 'List']));
            }
        },

        /**
         * Checks what env can be played by checking forced browsers agains current browser capabilities
         * @method checkEnv
         * @return {String} returns tablet, mobile, html, flash or backup
         *
         */
        checkEnv: function () {
            var isHtml5Supported = UA.isHtml5Supported;
            var currentEnv = 'backup';
            var environmentToPlay = -1;
            var itor;
            var envName;
            var envPlayable;
            var environments = [
                ['Mobile', !!UA.isMobile && isHtml5Supported],
                ['Tablet', !!UA.isTablet && isHtml5Supported],
                ['HTML5', isHtml5Supported],
                ['Flash', !!UA.flash],
                ['Backup', true]
            ];

            for (itor = 0; itor < environments.length; itor++) {
                envName = environments[itor][0];
                envPlayable = environments[itor][1];
                if (this.get('forced' + envName)) {
                    if (envPlayable) {
                        environmentToPlay = itor;
                    } else {
                        /* Tried to force an environment that the user can not support - fall down to backup */
                        environmentToPlay = 4;
                    }
                }
                /* If nothing is forced, we want to default to playing the first playable environment in the set. */
                if (environmentToPlay === -1 && envPlayable) {
                    environmentToPlay = itor;
                }
            }
            /* Funny logic:
                    to lower case 'Mobile' => 'mobile'
                    to remove digits 'HTML5' => 'html'
            */
            currentEnv = environments[environmentToPlay][0].toLowerCase().replace(/\d+/, '');
            this.set('currentEnvPlaying', currentEnv);
            return currentEnv;
        },

        /**
         * Destructor function. Goes through the events that were attached and removes them.
         * @method destructor
         * @public
         */
        destructor: function () {
            /*@<*/
            Debug.log(' [ACT_environment.js] : Destroying env instance');
            /*>@*/
        }
    });

    return Environment;
});
