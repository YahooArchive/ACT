/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
ACT.define('CustomData', [/*@<*/'Debug', /*>@*/ 'Lang'], function (ACT) {
    'use strict';

    /* Shorthand */
    var Lang = ACT.Lang;

    /*@<*/
    var debug = ACT.Debug;
    /*>@*/


    /**
     * default configuration objec sections and API
    */
    var MAIN_SUPER_CONF_SECTIONS = ['forceEnv', 'darlaLayer', 'flow', 'layers'];
    var LAYER_API_PUBLIC = ['width', 'height', 'type', 'width', 'height', 'x', 'y', 'alignH', 'base', 'alignH', 'alignV', 'cor'];
    var ILLEGAL_ATTRIBUTES = ['id', 'type', 'layerName', 'content'];

   /**
    *
    * Transforms a string with dot dotation ('myObject.subObject') into an object and maps that reference in a given object
    * @method locate
    * @param {Object} obj - Object to map string against to.
    * @param {String} path - String with dot notation to be used as reference to map data in the obj
    * @return {String || Object || Array}} Returns object value related with the reference
    * @private
    *
    */
    function locate(obj, path) {
        var arrayPattern = /(.+)\[(\d+)\]/;
        var i;
        var match;
        path = path.split('.');

        for (i = 0; i < path.length; i++) {
            match = arrayPattern.exec(path[i]);
            if (match) {
                if (!obj[match[1]]) {
                    return false;
                }
                obj = obj[match[1]][parseInt(match[2], 10)];
            } else {
                if (obj) {
                    obj = obj[path[i]];
                }
            }
        }
        return obj;
    }

    /**
    *
    * findEvents Finds events actions in configuration object and replaces their attributes.
    * @method findEvents
    * @param {String} data.id - Event id to look for.
    * @param {Object} data.partialObjectRef - Partial area of the configuration object that belongs to this events.
    * @param {String} data.groupToChange - Event action attribute to change data or create.
    * @param {String} data.attrToChange - Value to change.
    * @param {String} data.extraLevelToChange - Extra Value to change
    * @param {String || Array} data.newValue - New value to add or change to matched event action
    * @return {Object} Partial of superConfiguration object with updated event action from newData object
    * @private
    *
    */
    function findEvents(data) {
        // id, currentObject, GroupToChange, KeyWordToChange, newValue
        var events = data.partialObjectRef;
        var i;
        var j;
        // check if it is an array
        if (!Lang.isArray(events)) {
            /*@<*/
            debug.log('[ ACT_customData.js ]: ERROR: target does not have events');
            /*>@*/
            return events;
        }

        if (!data.GroupToChange || Lang.inArray(ILLEGAL_ATTRIBUTES, data.GroupToChange)) {
            /*@<*/
            debug.log('[ ACT_customData.js ] ERROR: shorcuts cannot change the following illegal attributes: ' + ILLEGAL_ATTRIBUTES.join());
            /*>@*/
            return events;
        }

        // run events
        for (i = 0; i < events.length; i++) {
            for (j = 0; j < events[i].actions.length; j++) {
                // check for the id
                if (events[i].actions[j].id === data.id) {
                    events[i].actions[j][data.GroupToChange] = data.newValue;
                    return events;
                }
            }
        }
        return events;
    }

    /**
    *
    * findNode recursively finds nodes in configuration object by id and replaces their attributes.
    * @method findNode
    * @param {String} data.id - Node id to look for.
    * @param {Object} data.partialObjectRef - Partial area of the configuration object that belongs to this node.
    * @param {String} data.GroupToChange - Node attribute to change data or create.
    * @param {String} data.attrToChange - Value to change
    * @param {String || Array} data.newValue - New value to add or change to matched event action
    * @return {Object} Partial of superConfiguration object with updated node attribute.
    * @private
    *
    */
    function findNode(data) {
        var currentValue;
        var i;
        // look Id in the first level of the object
        if (data.id === data.partialObjectRef.id) {
            // group does not exist, so it needs to create it, i.e: layers.mpu.container_1_1.css.height where container does not have css yet
            if (data.attrToChange && !Lang.inArray(ILLEGAL_ATTRIBUTES, data.attrToChange) && !data.partialObjectRef[data.GroupToChange] && data.GroupToChange !== 'events') {
                data.partialObjectRef[data.GroupToChange] = {};
                data.partialObjectRef[data.GroupToChange][data.attrToChange] = data.newValue;
            } else if (data.attrToChange && !Lang.inArray(ILLEGAL_ATTRIBUTES, data.attrToChange) && data.partialObjectRef[data.GroupToChange] && data.GroupToChange !== 'events') {
                // group does exist already, so it needs to extend current value by adding new value, i.e: layers.mpu.container_1_1.css.height where container has css already.
                currentValue = data.partialObjectRef[data.GroupToChange];
                currentValue[data.attrToChange] = data.newValue;
                data.partialObjectRef[data.GroupToChange] = currentValue;
            } else if (data.GroupToChange === 'events' && data.attrToChange && data.partialObjectRef.eventConfig) {
                // Looking to change events
                // change events
                data.partialObjectRef.eventConfig = findEvents({
                    id: data.attrToChange,
                    partialObjectRef: data.partialObjectRef.eventConfig,
                    attrToChange: data.GroupToChange,
                    GroupToChange: data.extraLevelToChange,
                    newValue: data.newValue
                });
            } else if (!Lang.inArray(ILLEGAL_ATTRIBUTES, data.GroupToChange)) {
                // change first level object
                data.partialObjectRef[data.GroupToChange] = data.newValue;
            }
        } else {
            // go a deeper level into capabilities content attributes.
            /* istanbul ignore else */
            if (Lang.objHasKey(data.partialObjectRef, 'content')) {
                for (i = 0; i < data.partialObjectRef.content.length; i++) {
                    data.partialObjectRef.content[i] = findNode({
                        id: data.id,
                        partialObjectRef: data.partialObjectRef.content[i],
                        GroupToChange: data.GroupToChange,
                        attrToChange: data.attrToChange,
                        newValue: data.newValue,
                        extraLevelToChange: data.extraLevelToChange
                    });
                }
            }
        }
        return data.partialObjectRef;
    }

   /**
    *
    * overWriteEnv Change enviroment attributes
    * Some examples:
    *
    * @example
    *       "forceEnv.forcedHTML5List.Chrome" : "*" // Forced Chrome to play in any other
    *       // overwrite all the object
    *       "forceEnv.forcedHTML5List" :{
    *           "Manolo": "31",
    *           "Chrome": "31"
    *       }

    * @method overWriteEnv
    * @param {Object} data.listToForce List to force
    * @param {Object} data.groupAttrib Group of attribute
    * @return {Object} data.newData Value to assign to the object
    * @return {Object} data.config Original configuration object
    * @private
    *
    */
    function overWriteEnv(data) {
        var envObject = data.config;

        // if value is a object to merge
        if (data.groupAttrib === undefined) {
            envObject[data.listToForce] = Lang.merge(envObject[data.listToForce], data.newData);
        } else {
            // it is a single reference
            envObject[data.listToForce][data.groupAttrib] = data.newData;
        }

        return envObject;
    }

    function mapLayer(pos, newData, keyWords, superConf) {
        var layer;
        // run all the superConfig layers
        for (layer in superConf.format.layers) {
            // TODO this can be removed to use shortcuts without layer name
            // second word is a layer name && 3rd word is a layer Public attribute && there are only 4 words max && attribute to change is not illegal
            if (layer === superConf.format.layers[keyWords[1]].layerName && Lang.inArray(LAYER_API_PUBLIC, keyWords[2]) && keyWords.length === 3 && !Lang.inArray(ILLEGAL_ATTRIBUTES, keyWords[2])) {
                // var layerName
                // change layer attributes
                superConf.format.layers[keyWords[1]][keyWords[2]] = newData[pos];
            } else {
                // layer content
                if (!Lang.inArray(LAYER_API_PUBLIC, keyWords[2]) && keyWords.length > 3) {
                    superConf.format.layers[keyWords[1]].contentLayer = findNode({
                        id: keyWords[2],
                        partialObjectRef: superConf.format.layers[keyWords[1]].contentLayer,
                        GroupToChange: keyWords[3],
                        attrToChange: keyWords[4],
                        extraLevelToChange: keyWords[5],
                        newValue: newData[pos]
                    });
                }
            }
        }

        return superConf;
    }

    function setInput(dataObject, dataValue, dataId, inputData) {
        var data = dataValue.substr(dataId.length + 1);
        // look for shortcut in data
        var finalInput = locate(inputData, data);

        if (finalInput === undefined) {
            return dataObject;
        }

        // have callback/
        if (dataObject.callback) {
            finalInput = dataObject.callback(finalInput);
        }

        return finalInput;
    }

    /**
     * ACT CustomData Utilities and Helpers
     * @class CustomData
     * @module ACT
     * @requires lang, util
     * @static
     */
    function CustomData() {
        /*@<*/
        debug.log('[ACT_CustomData.js]: instantiated');
        /*>@*/
        /* istanbul ignore if */
        if (CustomData.prototype.singleton) {
            return CustomData.prototype.singleton;
        }
        CustomData.prototype.singleton = this;
    }

    /**
    * @attribute ATTRS
    * @type {{NAME: string, version: string}}
    * @initOnly
    */
    CustomData.ATTRS = {
        NAME: 'CustomData',
        version: '1.0.41'
    };

    CustomData.prototype = {

        /**
        *
        * map Change superConfig attributes from base object
        * Some examples:
         * @example
        *       "layers.mpu.width" : "500px" // Change width attribute of mpu layer.
        *       "layers.mpu.container_1_1.css.height" : "500px" // Change css attribute height of a content capability with id 'container_1_1'.
        *       "layers.mpu.mpu_flash.swfConfig.flashvars" : { "clickTAG": "test"} // Adding a flashVars object into swf object.
        *
        * @method mapCustomData
        * @param {Object} newData Custom data object
        * @param {Object} superConf Super Configuration object
        * @return {Object} superConfiguration object with updated attributes from newData object.
        *
        */
        map: function (newData, superConf) {
            var i;
            var keyWords;
            var superConfArea;
            var tempSuperConf;
            for (i in newData) {
                /* istanbul ignore if */
                if (!newData.hasOwnProperty(i)) {
                    continue;
                }

                keyWords = i.split('.'); // key words from shorcuts: layers.mpu.width
                superConfArea = keyWords[0]; // Main super configuration area to be changed
                tempSuperConf = superConf;

                // check for one of the main sections of super configuration
                /*@<*/
                if (!Lang.inArray(MAIN_SUPER_CONF_SECTIONS, superConfArea)) {
                    debug.log('[ ACT_CustomData.js ] ERROR: shortcut must start with one of this references: "darlaLayer", "flow" or "layers"');
                }
                /*>@*/

                switch (superConfArea) {
                    case 'layers':
                        tempSuperConf = mapLayer(i, newData, keyWords, tempSuperConf);
                    break;

                    case 'flow':
                        tempSuperConf.format[superConfArea] = findEvents({
                            id: keyWords[1],
                            partialObjectRef: tempSuperConf.format[superConfArea],
                            GroupToChange: keyWords[2],
                            attrToChange: keyWords[4],
                            extraLevelToChange: keyWords[5],
                            newValue: newData[i]

                        });
                    break;

                    case 'darlaLayer':
                        tempSuperConf.format[superConfArea].holder[keyWords[1]] = newData[i];
                    break;

                    case 'forceEnv':
                        tempSuperConf.baseConfig.forceEnv = overWriteEnv({
                            listToForce: keyWords[1],
                            groupAttrib: keyWords[2],
                            newData: newData[i],
                            config: tempSuperConf.baseConfig.forceEnv
                        });
                    break;
                    default:
                    break;
                }
            }
            return tempSuperConf;
        },

       /**
        *
        * inputOntoCustomDataJSON Maps shortcuts in custom Data object against input data object for JSON inputs
        * @method inputOntoCustomDataJSON
        * @param {String} dataID - Id reference to the input data.
        * @param {Object} customData - Custom data object with all the shortcuts.
        * @param {Function} customData.callback - Callback for extra manipulation of custom data
        * @param {Object} inputData - Input data from external file.
        * @return {Object} Custom data object with merged data from custom Data.
        *
        */
        inputOntoCustomDataJSON: function (dataID, customData, inputData) {
            var i;
            var customDataValue;
            // run custom data object for shortcuts
            for (i in customData) {
                /* istanbul ignore else  */
                if (customData.hasOwnProperty(i)) {
                    customDataValue = customData[i].value ? customData[i].value : customData[i];
                    if (Lang.inArray(customDataValue, dataID)) {
                        customData[i] = setInput(customData[i], customDataValue, dataID, inputData);
                    } else if (customData[i].value) {
                        // if it's a object but it is not looking for data from the inputData
                        customData[i] = customData[i].value;
                    }
                }
            }
            return customData;
        }
    };

    return new CustomData();
});
