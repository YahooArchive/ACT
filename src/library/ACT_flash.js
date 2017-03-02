/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
ACT.define('Flash', [/*@<*/'Debug', /*>@*/'Dom', 'Lang', 'UA'], function (ACT) {
    'use strict';

    var dom = ACT.Dom;
    var lang = ACT.Lang;
    var UA = ACT.UA;

    /* Private Variables */
    var DEFAULT_PARAMS = {
        metadata: '',
        allowFullScreen: '',
        allowNetworking: '',
        allowScriptAccess: '',
        fullScreenAspectRatio: '',
        flashvars: '',
        base: '',
        bgcolor: '',
        loop: '',
        menu: '',
        play: '',
        quality: '',
        salign: '',
        align: '',
        scale: '',
        wmode: '',
        src: '',
        width: '',
        height: '',
        movie: ''
    };
    /*@<*/
    var debug = ACT.Debug;
    debug.log('[ ACT_flash.js ]: loaded');
    /*>@*/

    /**
     * Generate the set of parameters for the <object> or the <embed> tags
     * @private
     * @param {String} type Helpes determine which parameter types to return. Default OBJECT style.
     * @return {Array} params The set of parameters that are defined for this embed
     * @method params
     */
    function params(paramSet) {
        var ret = [];
        var itor;

        for (itor in paramSet) {
            if (paramSet.hasOwnProperty(itor) && DEFAULT_PARAMS.hasOwnProperty(itor)) {
                if (UA.ie > 0) {
                    ret.push('<param name=' + itor + ' value="' + paramSet[itor] + '">');
                } else {
                    ret.push(itor + '="' + paramSet[itor] + '"');
                }
            }
        }

        return ret.join(' ');
    }

    /**
     * Helper of objectEmbed embeds the SWF Object into a given div with the given variables, parameters and location.
     * @private
     * @param {Object} conf Array of embed instructions / parameters.
     * @return {Object} swf_el Reference to the embeded object
     * @method ad_embedObj
     */
    function generateTag(conf) {
        var obj = '';
        var div = dom.byId(conf.position) || null;
        var embedParams = params(conf);

        if (UA.ie > 0) {
            obj = '<object style="' + conf.style + '" type="' + conf.type + '" data="' + conf.src + '" alt="' + conf.alt + '" classid="' +
                conf.clsid + '" id="' + conf.id + '" width="' + conf.width + '" height="' + conf.height + '">' + embedParams + '</object>';
        } else {
            obj = '<embed style="' + conf.style + '" alt="' + conf.alt + '" name="' + conf.id + '_name" id="' + conf.id + '" ' + embedParams + '></embed>';
        }
        if (div !== null) {
            div.innerHTML = obj;
            return div.firstChild;
        }
        return obj;
    }

    /**
     * Flash Embed Library.
     * @module ACT
     * @class Flash
     * @requires dom, lang, UA
     */
    function Flash() {
        /* This is a singleton. */
        /* istanbul ignore if */
        if (Flash.prototype.singleton) {
            return Flash.prototype.singleton;
        }
        Flash.prototype.singleton = this;
    }

    /**
     * @attribute ATTRS
     * @type {{NAME: string, version: string}}
     * @initOnly
     */
    Flash.ATTRS = {
        NAME: 'Flash',
        version: '1.1.0'
    };

    Flash.prototype = {

        /**
         * Embed the SWF Object into a given div with the given variables, parameters and location.
         * @param {Object} conf Configuration object.
         * @method objectEmbed
         * @public
         * @static
         * @example
         * ```
         *    // Simple Example
         *    var conf = {
         *        src: "https://s.yimg.com/cv/ae/global/actjs/ACTPlayer1435242612.swf",
         *        position: "adive" // ID of the parent div - doc.byId(conf.position).innerHTML = html_code;
         *    };
         *    var node = ACT.Flash.objectEmbed(conf);
         * ```
         *
         * @example
         * ```
         *    // A more Advanced Example
         *    var conf = {
         *        src: "https://s.yimg.com/cv/ae/global/actjs/ACTPlayer1435242612.swf", // src of the swf
         *        width: 50,
         *        height:150,
         *        id: "mySWFId", // element ( swf element ) ID
         *        wmode: "opaque",
         *        menu: "true",
         *        flashvars: {
         *            "clickTAG": "http://www.yahoo.com",
         *            "callback": "someFunction",
         *            "random_var": "value"
         *        },
         *        allowScriptAccess: "always",
         *        position: "adive" // ID of the parent div - doc.byId(conf.position).innerHTML = html_code;
         *    };
         * ```
         */
        objectEmbed: function (conf) {
            var parameters = lang.merge({
                width: '100%',
                height: '100%',
                src: '',
                id: 'swf_' + (Math.random()),
                position: null,
                wmode: 'transparent',
                alt: '',
                quality: 'high',
                menu: 'false',
                play: 'true',
                flashvars: {},
                allowFullScreen: 'true',
                allowScriptAccess: 'always',
                type: 'application/x-shockwave-flash',
                pluginspage: 'http://www.adobe.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash',
                clsid: 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000',
                style: 'display:block'
            }, conf);

            var ie = UA.ie;

            /* istanbul ignore else */
            if (lang.isObject(parameters.flashvars)) {
                parameters.flashvars = lang.createHash(parameters.flashvars);
            }

            if (ie !== 0) {
                // IE "object" node
                parameters.movie = parameters.src;
            }

            return generateTag(parameters);
        },

        /**
         * Add class names to the documentElement signifying which flash version ( if any ) are available.
         * @method injectFlashVersion
         * @public
         * @static
         * @example
         * ```
         *     // flash-9 implies the user has flash 9 installed.
         *     // flash-gt# implies the user has flash greater than # version installed.
         *     // flash-0 implies no flash
         *     // jsenabled is always injected, implies javascript is enabled.
         *     document.documentElement.className === "jsenabled flash-9 flash-gt8 flash-gt7 flash-gt6 flash-gt5 flash-gt4"
         * ```
         */
        injectFlashVersion: function () {
            var flashVersion = UA.flash;
            var minFlashVersion = 4;
            var htmlClasses = ['jsenabled', 'flash-' + flashVersion];
            var docRef = UA.html;

            while ((flashVersion) > (minFlashVersion)) {
                flashVersion--;
                htmlClasses.push('flash-gt' + flashVersion);
            }
            /* istanbul ignore else */
            if (lang.isObject(docRef)) {
                docRef.className += htmlClasses.join(' ');
            }
        }
    };

    return new Flash();
});
