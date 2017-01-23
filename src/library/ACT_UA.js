/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT, ActiveXObject */
/* eslint vars-on-top: 0, new-cap: 0, no-use-before-define: 0 */
ACT.define('UA', [/*@<*/'Debug', /*>@*/ 'Lang'], function (ACT) {
    'use strict';
    var lang = ACT.Lang;
    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_UA.js ]: Loaded');
    /*>@*/

    /* Private Functions */

    /**
     * Detect current OS
     * @private
     * @return {{name: string, version: number}}
     */
    function detectOS(argUserAgent) {
        // Let's allow this special function to have more complexity than normal
        /* jshint maxcomplexity:false */
        var os = 'other';
        var ver = 0;
        var tmp;
        var userAgent = argUserAgent || navigator.userAgent.toString();

        if ((/windows|win32/i).test(userAgent) && !(/windows phone/i).test(userAgent)) {
            os = 'windows';
        } else if ((/macintosh|mac_powerpc/i).test(userAgent)) {
            os = 'macintosh';
        } else if ((/iphone|ipod|ipad/i).test(userAgent)) {
            os = 'ios';
            tmp = (/CPU OS ([0-9_]+)/i).exec(userAgent);
            if (tmp && tmp[1]) {
                ver = tmp[1].replace('_', '.');
            }
        } else if ((/windows phone/i).test(userAgent)) {
            os = 'Windows Phone';
            tmp = (/Windows Phone [OS]*\s*([0-9.]+)/).exec(userAgent);
            /* istanbul ignore else  */
            if (tmp && tmp[1]) {
                ver = tmp[1];
            }
        } else if ((/android/i).test(userAgent)) {
            os = 'android';
            tmp = (/Android\s*([0-9.]+)/).exec(userAgent);
            /* istanbul ignore else  */
            if (tmp && tmp[1]) {
                ver = tmp[1];
            }
        } else if ((/linux/i).test(userAgent)) {
            os = 'linux';
        } else if ((/webOS/i).test(userAgent)) {
            os = 'webOS';
        } else if ((/BlackBerry/i).test(userAgent)) {
            os = 'BlackBerry';
        } else if ((/Opera Mini/i).test(userAgent)) {
            os = 'Opera Mini';
        }

        return {
            name: os,
            version: parseInt(ver, 10)
        };
    }

    /**
     * Detect Mobiles
     * @private
     * @return {{Boolean}}
     */
    function checkMobile(userAgentAtt) {
        var userAgent = userAgentAtt || navigator.userAgent.toLowerCase();
        var ismobile = (/iphone|ipod|mobile|phone|blackberry|opera|mini|windows\sce|palm|iemobile/i.test(userAgent)) && !(/ipad/i.test(userAgent));

        return ismobile;
    }

    /**
     * Detect Tablets
     * @private
     * @return {{Boolean}}
     */
    function checkTablet(userAgentAtt) {
        var userAgent = userAgentAtt || navigator.userAgent.toLowerCase();
        var istablet = (/android|playbook|tablet|kindle|silk/i.test(userAgent)) && !(/mobile/i.test(userAgent)) || (/ipad/i.test(userAgent));

        return istablet;
    }

    /**
     * Detect if current browser supports Flash, and if so, returns the version which is installed
     * @private
     * @return {number}
     */
    function detectFlash() {
        var description = '0';
        var error = false;
        var oActiveX = null;
        /* istanbul ignore if  */
        if (navigator.plugins && typeof navigator.plugins['Shockwave Flash'] === 'object') {
            description = navigator.plugins['Shockwave Flash'].description;
            if (typeof(description) !== undefined) {
                description = (description.replace(/^.*\s+(\S+\s+\S+$)/, '$1')).replace(' ', '.');
            }
            /* istanbul ignore if */
        } else if (window.ActiveXObject) {
            try {
                oActiveX = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.7');
            } catch (a) {
                try {
                    oActiveX = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
                    oActiveX.AllowScriptAccess = 'always';
                } catch (b) {
                    try {
                        oActiveX = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    } catch (c) {
                        error = true;
                    }
                }
            }
            if (oActiveX !== null && typeof oActiveX === 'object') {
                description = oActiveX.GetVariable('$version');
                if (typeof description !== undefined) {
                    description = description.replace(/^\S+\s+(.*)$/, '$1').replace(/,/g, '.');
                }
            } else {
                error = true;
            }

            if (error) {
                return 0;
            }
        }
        return parseInt(description.split('.')[0], 10);
    }

    /**
     * Identifies the browser in use.
     * In case the browser is being used, returns the browser version, it returns 0 otherwise.
     * @private
     * @param {String} str navigator.userAgent.toString()
     * @param {String} regex Regex used to identify a specific browser version
     * @return {number} Browser version or 0
     */
    function checkBrowser(str, regex) {
        var version = 0;
        var m;

        /* istanbul ignore else  */
        if (lang.isString(str)) {
            m = str.match(regex);
            /* istanbul ignore else  */
            if (m && (m[1] || m[2])) {
                version = lang.numberific(m[1] || m[2]);
            }
        }
        return version;
    }

    /**
     * Detects if Canvas is supported by browser
     * @private
     * @return {boolean}
     */
    function detectCanvas() {
        var element = document.createElement('canvas');
        var test = !!(element.getContext && element.getContext('2d'));
        return test;
    }

    /**
     * Detects if Drag and Drop is supported by browser
     * @private
     * @return {boolean}
     */
    function detectDragDrop() {
        var div = document.createElement('div');
        var test = ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
        return test;
    }

    /**
     * Detects if canvas and text on canvas is supported by browser
     * @private
     * @return {boolean}
     */
    function detectCanvasText() {
        var element = document.createElement('canvas');
        var test = !!(canvas && typeof element.getContext('2d').fillText === 'function');

        return test;
    }

    /**
     * Detects if playing audio is supported by browser
     * @private
     * @return {boolean}
     */
    function detectAudio() {
        var element = document.createElement('audio');
        var test = false;
        var ogg = false;
        var mp3 = false;
        var wav = false;
        var err;

        /* istanbul ignore if */
        try {
            if ('canPlayType' in element) {
                ogg = element.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '');
                mp3 = element.canPlayType('audio/mpeg;').replace(/^no$/, '');
                wav = element.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '');
                if (ogg !== '' || mp3 !== '' || wav !== '') {
                    test = true;
                }
            }
            return test;
        } catch (e) {
            err = e;
            /*@<*/
            Debug.log('[ ACT_UA.js ]: canPlayType function call failing, error: ' + err);
            /*>@*/
            return false;
        }
    }

    /**
     * Detects if native video playing is supported by browser
     * @private
     * @return {boolean}
     */
    function detectVideo() {
        var element = document.createElement('video');
        var test = false;
        var ogg = false;
        var h264 = false;
        var h264B = false;
        var h264C = false;
        var webm = false;
        var err;
        /* istanbul ignore if */
        try {
            if ('canPlayType' in element) {
                ogg = element.canPlayType('video/ogg; codecs=theora"').replace(/^no$/, '');
                h264 = element.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');
                h264B = element.canPlayType('video/mp4; codecs="mp4v.20.8"').replace(/^no$/, '');
                h264C = element.canPlayType('video/mp4; codecs="mp4a.40.2"').replace(/^no$/, '');
                webm = element.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '');

                if (ogg !== '' || h264 !== '' || h264B !== '' || h264C !== '' || webm !== '') {
                    test = true;
                }
            }
            return test;
        } catch (e) {
            err = e;
            /*@<*/
            Debug.log('[ ACT_UA.js ]: canPlayType function call failing, error: ' + err);
            /*>@*/
            return false;
        }
    }

    var userAgent = navigator.userAgent.toString();
    var IE = checkBrowser(userAgent, /MSIE ([^;]*)|Trident.*; rv:([0-9.]+)/);
    var edge = checkBrowser(userAgent, /Edge\/([0-9.]+)/);
    var firefox = checkBrowser(userAgent, /Firefox\/([0-9.]+)/);
    var safari = checkBrowser(userAgent, /Version\/([0-9.]+)\s?Safari/);
    var chrome = checkBrowser(userAgent, /Chrome\/([0-9.]+)/);
    var webkit = checkBrowser(userAgent, /AppleWebKit\/([0-9.]+)/);
    var OS = detectOS(userAgent);
    var flash = detectFlash();
    var isMobile = checkMobile();
    var isTablet = checkTablet();

    /* HTML5 Tests */
    var dragDrop = detectDragDrop();
    var video = detectVideo();
    var audio = detectAudio();
    var canvas = detectCanvas();
    var canvasText = detectCanvasText();
    var isHtml5Supported = (video && audio && canvas && canvasText);
    var currentBrowser = detectBrowser();

    /**
     * Detects browser
     * @private
     * @return {{name: string, version: number}}
     */
    function detectBrowser() {
        var browser = {
            name: 'other',
            version: 0
        };
        if (IE) {
            browser.name = 'MSIE';
            browser.version = IE;
        } else if (edge) {
            browser.name = 'Edge';
            browser.version = edge;
        } else if (firefox) {
            browser.name = 'FireFox';
            browser.version = firefox;
        } else if (safari) {
            browser.name = 'Safari';
            browser.version = safari;
        } else if (chrome) {
            browser.name = 'Chrome';
            browser.version = chrome;
        } else if (webkit) {
            browser.name = 'WebKit';
            browser.version = webkit;
        }
        return browser;
    }

    /**
     * User Agent Detection - UA
     *
     *     var env = ACT.UA;
     *     env.browser;
     *     env.os;
     *     env.flash;
     *     env.isHtml5Supported;
     *     env.html;
     *
     * @class UA
     * @module ACT
     * @requires lang
     */
    var UA = {
        ATTRS: {
            NAME: 'UA',
            version: '1.0.41'
        },

        /**
         * Helper reference to document.documentElement
         * @method doc
         * @public
         * @static
         */
        html: document.documentElement,

        /* Available Exposed Functions */

        /**
         * Identifies the browser in use. In case the browser is being used, returns the browser version, it returns 0 otherwise.
         * @method checkBrowser
         * @param {String} str navigator.userAgent.toString()
         * @param {String} regex Regex used to identify a specific browser version
         * @return {number} Browser version or 0*
         */
        checkBrowser: checkBrowser,

        /**
         * Detect current OS
         * @public
         * @param {String} userAgent navigator.userAgent.toString()
         * @return {{name: string, version: number}}
         */
        detectOS: detectOS,

        /**
         * Test to figure out which OS is in use
         * @method os
         * @return {String} OS in use.
         * @public
         * @static
         */
        os: OS,

        /**
         * Return the current browser
         * @method browser
         * @return {{name: string, version: number}}.
         * @public
         * @static
         */
        browser: currentBrowser,

        /**
         * Test to see if the browser in use is Internet Explorer
         * @method isIE
         * @return {Number} version of the IE browser in use.
         * @public
         * @static
         */
        ie: IE,

        /**
         * Test to see if the browser in use is FireFox
         * @method isFireFox
         * @return {Number} version of the FireFox browser in use.
         * @public
         * @static
         */
        firefox: firefox,

        /**
         * Test to see if the browser in use is Safari
         * @method isSafari
         * @return {Number} version of the Safari browser in use.
         * @public
         * @static
         */
        safari: safari,

        /**
         * Test to see if the browser in use is Chrome
         * @method isChrome
         * @return {Number} major version of the Chrome browser in use.
         * @public
         * @static
         */
        chrome: chrome,

        /**
         * Test to see if the browser is WebKit compatible
         * @method isWebKit
         * @return {Number} WebKit version
         * @public
         * @static
         */
        webkit: webkit,

        /**
         * Determine the flash version the user has
         * @method isFlash
         * @return {Number} version of Flash on the users computer or 0 if no flash.
         * @public
         * @static
         */
        flash: flash,

        /* HTML5 Tests */
        /**
         * Checks if the current browser supports the drag and drop feature
         * @method dragDropSupport
         * @private
         * @type Function
         */
        dragDrop: dragDrop,

        /**
         * Check HTML5 text canvas element supports
         * @method canvasTextSupport
         * @private
         * @type Function
         */
        canvasText: canvasText,

        /**
         * Checks HTML5 canvas supports
         * @method canvasSupport
         * @private
         * @type Function
         */
        canvas: canvas,

        /**
         * Checks HTML5 audio support
         * @method audioSupport
         * @private
         * @type Function
         */
        audio: audio,

        /**
         * Checks HTML5 video support
         * @method videoSupport
         * @private
         * @type Function
         */
        video: video,

        /**
         * Checks HTML5 support
         * @method isHtml5Supported
         * @public
         * @static
         * @return {boolean} true if have HTML5, false if not
         */
        isHtml5Supported: isHtml5Supported,

        /**
         * Check for mobiles
         * @method checkMobile
         */
        checkMobile: checkMobile,

        /**
         * Check for tablet
         * @method checkTablet
         */
        checkTablet: checkTablet,

        /**
         * Is a Mobile
         * @method isMobile
         */
        isMobile: isMobile,

        /**
         * Is a Tablet
         * @method isTablet
         */
        isTablet: isTablet
    };

    return UA;
});
