/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
ACT.define('Capability', [/*@<*/'Debug', /*>@*/ 'Dom', 'Lang'], function (ACT) {
    'use strict';

    /* Constants */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;

    /**
     * Capability object.
     * @module ACT
     * @class Capability
     */
    /* istanbul ignore next */
    function Capability() {
        // oop
    }

    /**
     * @attribute ATTRS
     * @type {{NAME: string, version: string}}
     * @initOnly
     */
    Capability.ATTRS = {
        NAME: 'Capability'
    };

    Capability.prototype = {

        constructor: Capability,

        /**
        * @method applyConfig
        */
        applyNodeConfig: function (node, configObject) {
            if (Lang.isString(configObject.id) && configObject.id !== '') {
                node.setAttribute('id', configObject.id);
            }

            if (Lang.isString(configObject.classNode) && configObject.classNode !== '') {
                node.className += ' ' + configObject.classNode;
            }

            if (!Lang.isObjectEmpty(configObject.css)) {
                Dom.applyStyles(node, configObject.css);
            }

            return node;
        },


        /**
         * @method resize
         */
        resize: function (status, config) {
            var node = this.get('node');
            var parent = node.parentNode;
            var width = node.offsetWidth;
            var height = node.offsetHeight;
            var ratio;
            var wRatio;
            var hRatio;

            // lets check resize config to get the new width value
            if (parent && config.resize.sizeFrom === 'parent') {
                width = parent.offsetWidth;
                height = parent.offsetHeight;
            } else if (status && config.resize.sizeFrom === 'root') {
                width = status.screenWidth;
                height = status.screenHeight;
            }

            // calculate newHeight if ratio is set
            if (config.resize.ratio) {
                ratio = config.resize.ratio;
                wRatio = parseInt(ratio.split(':')[0], 10);
                hRatio = parseInt(ratio.split(':')[1], 10);
                height = Math.round(width * hRatio / wRatio);
            }

            // apply new size for node
            Dom.applyStyles(node, {
                width: (typeof width === 'number' || width.indexOf('px') === -1) ? width + 'px' : width,
                height: (typeof height === 'number' || height.indexOf('px') === -1) ? height + 'px' : height
            });
        }
    };

    return Capability;
});
