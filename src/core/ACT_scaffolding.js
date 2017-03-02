/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/* eslint no-use-before-define: 0 */
/**
 * The 'Scaffolding' is a core module made to parse the object layer to html.
 * This module is used in 'layerStandard'.
 *
 * @module Scaffolding
 * @main Scaffolding
 * @class Scaffolding
 * @requires Lang, Class, Dom
 * @global
 */
ACT.define('Scaffolding', [/*@<*/'Debug', /*>@*/ 'Lang', 'Class', 'Dom'], function (ACT) {
    'use strict';

    /* Shorthand */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    var Class = ACT.Class;

    /**
     * List of capabilities instances rendered, organized by layerName
     e.g {
        mpu: [
            {capability1},
            {capability2}
        ],
        expand: [
            {capability1},
            {capability2}
        ]
     }
     */
    var capabilityInstances = {};

    /**
     * temporary list for capabily instance
     */
    var temporaryInstances = [];

    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_scaffolding.js ] Scaffolding Loaded');
    /*>@*/

    /**
     * @constructor
     */
    function Scaffolding(config) {
        this.init(config);
        // Scaffolding.superclass.constructor.apply(this, arguments);
    }

    Scaffolding.ATTRS = {
        /**
        * @attribute NAME
        * @type String
        */
        NAME: 'Scaffolding',

        /**
        * @attribute version
        * @type String
        */
        version: '1.1.0'
    };

    /* Private methods */

    /**
     * Check screen size rules from env in config-object capabilities against current screen sizes
     *
     * @method checkSizes
     * @private
     * @param {Object} screenRules, Rule to be checked again screen size
     * @param {Object} status, the status object with current screen size
     * @return {Boolean}
     */
    function checkSizes(screenRules, status) {
        var result = true;
        /**
         * Go through all the rules defined in config object
         * if any if those rule is not satify then the size is not satisfy
         */
        Lang.forEach(screenRules, function (property, value) {
            switch (property) {
                case 'min-width':
                    // screen width must bigger than defined width
                    result = result && parseInt(status.screenWidth, 10) >= parseInt(value, 10);
                    break;
                case 'min-height':
                    // screen height must bigger than defined height
                    result = result && parseInt(status.screenHeight, 10) >= parseInt(value, 10);
                    break;
                case 'max-width':
                    // screen width must smaller than defined width
                    result = result && parseInt(status.screenWidth, 10) <= parseInt(value, 10);
                    break;
                case 'max-height':
                    // screen height must smaller than defined height
                    result = result && parseInt(status.screenHeight, 10) <= parseInt(value, 10);
                    break;
                default:
                    break;
            }
        });

        return result;
    }

    /**
     * Check if target screen size is suitable with current size
     *
     * @method isRightEnv
     * @private
     * @param {String | Array} targetResolution
     * @return {Boolean}
     */
    function isRightResolution(targetEnv, status, currentEnv) {
        /* example input:

        'targetEnv': [{
            'backup':{
                min-height: '300',
                max-height: '600',
                max-width: '1200',
                min-width: '1000'
            }
        }]

        status: {
            orientation: 'p',
            screenHeight: '345',
            screenWidth: '1073'
        }

        currentEnv = backup

         */
        var result = true;
        var index;
        var envRules;

        for (index = 0; index < targetEnv.length; index++) {
            envRules = targetEnv[index];
            if (Lang.objHasKey(envRules, currentEnv) && Lang.isObject(envRules[currentEnv])) {
                result = result && checkSizes(envRules[currentEnv], status);
            }
        }

        return result;
    }

    /**
     * Check if target environment is suitable with current envt
     *
     * @method isRightEnv
     * @private
     * @param {Array} targetEnv
     * @param {String} current Enviroment
     * @return {Boolean}
     */
    function isRightEnv(targetEnv, currentEnv) {
        var result = false;
        var index;

        if (Lang.isArray(targetEnv)) {
            for (index in targetEnv) {
                if (targetEnv.hasOwnProperty(index)) {
                    if (Lang.isString(targetEnv[index]) && targetEnv[index] === currentEnv) {
                        result = true;
                        break;
                    } else if (Lang.isObject(targetEnv[index]) && currentEnv in targetEnv[index]) {
                        result = true;
                        break;
                    }
                }
            }
        }
        return result;
    }

    /**
     * Function to check given config object with environment and orientation and return if it is suitabe to be rendered
     *
     * @method isOkToRender
     * @private
     * @param {Object} refObj
     * @param {String} env
     * @param {String} status
     * @return {Boolean}
     */
    function isOkToRender(refObj, env, status) {
        refObj.env = refObj.env || env;

        if (!isRightEnv(refObj.env, env)) {
            return false;
        }

        if (!isRightResolution(refObj.env, status, env)) {
            return false;
        }

        if (refObj.orientation && refObj.orientation !== status) {
            return false;
        }

        return true;
    }

    /**
     * Function to normalize the capability namespace. Example 'content-container' to 'ContentContainer'
     *
     * @method makeCapabilyNameSpace
     * @private
     * @param {String} capabilityName, string to remove dash and capitalise it
     * @return {String}
     **/
    function makeCapabilyNameSpace(capabilityNameTo) {
        var capabilityNameSpace = '';
        var names = capabilityNameTo.split('-');
        var i;

        for (i = 0; i < names.length; i++) {
            capabilityNameSpace += Lang.capitaliseFirstLetter(names[i]);
        }

        return capabilityNameSpace;
    }

    /**
     * Function to append a children to a given node html
     *
     * @method renderChildren
     * @private
     * @param {Object} container holder container
     * @param {Array} childrenObj list of children config object
     * @param {String} env
     * @param {String} orientation
     * @return {Object} container with children have been rendered inside
     */
    function renderChildren(container, childrenObj, env, status) {
        var i;
        for (i = 0; i < childrenObj.length; i++) {
            container[childrenObj[i].id] = parseElement(childrenObj[i], env, status);
            if (container[childrenObj[i].id]) {
                container.appendChild(container[childrenObj[i].id]);
            }
        }
        return container;
    }

    /**
     * Function generated the child nodes content using capabilities
     *
     * @method parseElement
     * @private
     * recursive function to parse elements
     * @param {Object} refObj config object.
     * @param {String, Null, array} env for html element, i.e: html, flash, backup
     * @param {String} Orientation, render content capability against it
     **/
    function parseElement(refObj, env, status) {
        var capabilitySpaceName;
        var moduleInstance;
        var objFromNode;
        var container = '';

        if (!isOkToRender(refObj, env, status)) {
            return false;
        }
        capabilitySpaceName = makeCapabilyNameSpace(refObj.type);
        /*@<*/
        Debug.log('[ ACT_scaffolding.js ] Loading Capability: ', capabilitySpaceName);
        /*>@*/
        if (capabilitySpaceName in ACT) {
            moduleInstance = new ACT[capabilitySpaceName](refObj);
        } else {
            /* We need to throw a missing capability error here. */
            throw new Error('Missing capability: ' + capabilitySpaceName);
        }
        objFromNode = moduleInstance.getContent(env, status.orientation);

        if (objFromNode.node !== 'undefined') {
            container = objFromNode.node;
        }

        /* istanbul ignore next */
        if (Lang.isObject(objFromNode.content)) {
            refObj.content = Lang.merge(objFromNode.content, refObj.content);
        }

        if (Dom.isDomElement(container) && Lang.isObject(refObj.content)) {
            container = renderChildren(container, refObj.content, env, status);
        }

        temporaryInstances.push(moduleInstance);
        return container;
    }

    /* Public methods */

    Lang.extend(Scaffolding, Class, {

        /**
         * Function auto initiated when the class is instantiated
         *
         * @method initializer
         * @public
         * @param {Object} config
         */
        initializer: function () {
            var htmlNode = this.parseHtml();
            return htmlNode;
        },

        /**
         * Function parsing the layer object to html
         *
         * @method parseHtml
         * @public
         * @return {String} raw Html
         */
        parseHtml: function () {
            var rawHtml;
            // clean the temporary list so it can be used to store a new list
            temporaryInstances = [];

            // parseElement will add new capability instance into temp
            rawHtml = parseElement(
                this.get('refObj'),
                this.get('env'),
                this.get('status')
            );

            this.set('htmlParsed', rawHtml);

            // update capability instances list
            capabilityInstances[this.get('layerName')] = temporaryInstances;

            return {
                rawHtml: rawHtml,
                capabilityInstances: capabilityInstances[this.get('layerName')]
            };
        },

        /**
         * Function getter for the content html parsed
         *
         * @method getHtmlParsered
         * @public
         */
        getHtmlParsered: function () {
            if (this.get('htmlParsed')) {
                /*@<*/
                Debug.log('[ ACT_scaffolding.js ] html parsered : ', this.get('htmlParsed'));
                /*>@*/

                return {
                    rawHtml: this.get('htmlParsed'),
                    capabilityInstances: capabilityInstances[this.get('layerName')]
                };
            }
            /*@<*/
            Debug.log('[ ACT_scaffolding.js ] no html parsered');
            /*>@*/
            return this.parseHtml();
        }
    });

    return Scaffolding;
});
