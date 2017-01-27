/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
ACT.define('Dom', [/*@<*/'Debug', /*>@*/ 'Lang', 'UA'], function (ACT) {
    'use strict';

    var UA = ACT.UA;
    /*@<*/
    var Debug = ACT.Debug;
    Debug.log('[ ACT_dom.js ] : loaded');
    /*>@*/

    /**
     * ACT DOM Utilities and Helpers
     * @class Dom
     * @module ACT
     * @requires lang, UA
     * @static
     */
    function Dom() {
        /* Dom is a singleton */
        /* istanbul ignore if */
        if (Dom.prototype.singleton) {
            return Dom.prototype.singleton;
        }
        Dom.prototype.singleton = this;
    }

    /**
     * @attribute ATTRS
     * @type {{NAME: string, version: string}}
     * @initOnly
     */
    Dom.ATTRS = {
        NAME: 'Dom',
        version: '1.1.0'
    };

    Dom.prototype = {

        /**
         * Wrapper for document.getElementById
         * @param {String} obj ID of the element on the page
         * @return {Object}  Reference to the embeded object
         * @method byId
         * @public
         * @static
         */
        byId: function (obj) {
            return document.getElementById(obj);
        },

        /**
         * Determine viewport offset for an element
         * @param {String | Object} forElement Element id to get the offset info for
         * @method viewportOffset
         * @return {Object} set of two values, left and top wich are offset in pixels.
         * @public
         * @static
         */
        viewportOffset: function (forElement) {
            var element = (typeof forElement === 'string') ? this.byId(forElement) : forElement;
            var valueT = element.offsetTop || 0;
            var valueL = element.offsetLeft || 0;

            while (element !== document.body) {
                valueT += element.offsetTop || 0;
                valueL += element.offsetLeft || 0;
                element = element.offsetParent;
            }

            return {
                left: valueL,
                top: valueT
            };
        },

        /**
         * Helper function to dtermine if a given element has the given class name
         * @param {Object} element Element to test against
         * @param {String} className Classname to test for
         * @method hasClass
         * @return {Boolean} true if the classname exists false otherwise
         * @public
         * @static
         */
        hasClass: function (element, className) {
            var domRef = ACT.Dom;
            var SPACE = ' ';
            var current;
            if (domRef.isDomElement(element)) {
                current = element.className.toString().replace(/\s+/g, SPACE);
                return className && (SPACE + current + SPACE).indexOf(SPACE + className + SPACE) > -1;
            }
            return false;
        },

        /**
         * Wrapper function to get elements by Class Name
         * @param {String} className that the elements contain
         * @param {Object} refObj node or null to search the entire document
         * @return {Array} elements with the given class name - empty array if none
         * @method byClassName
         * @public
         * @static
         */
        byClassName: function (className, refObj) {
            var doc = refObj || document;
            var nodes = [];
            var domRef = ACT.Dom;
            var i;
            var elements;
            var len;
            /* istanbul ignore else */
            if (doc.getElementsByClassName) {
                nodes = doc.getElementsByClassName(className);
            } else if (doc && doc.getElementsByTagName) {
                elements = doc.getElementsByTagName('*');
                if (!elements) {
                    return [];
                }
                for (i = 0, len = elements.length; i < len; ++i) {
                    if (domRef.hasClass(elements[i], className)) {
                        nodes[nodes.length] = elements[i];
                    }
                }
            }
            return nodes;
        },

        /**
         * Adds a new class to a DOM element's classList
         * @param element
         * @param className
         * @returns {boolean}
         */
        addClass: function (element, className) {
            var finalArray = [];
            var domRef = ACT.Dom;
            if (element && className && (!domRef.hasClass(element, className))) {
                if (element.className) {
                    finalArray = element.className.split(' ');
                }
                finalArray.push(className);
                element.className = finalArray.join(' ');
                return true;
            }
            return false;
        },

        /**
         * Removes one existing class name from the element's class list
         * @param {Object} DOM element
         * @param {String} className
         * @returns {boolean} Success
         * @public
         */
        removeClass: function (element, className) {
            var classArray;
            var i;
            var finalArray = [];
            var domRef = ACT.Dom;
            if (domRef.hasClass(element, className)) {
                classArray = element.className.split(' ');
                for (i = 0; i < classArray.length; i++) {
                    if (classArray[i] !== className) {
                        finalArray.push(classArray[i]);
                    }
                }
                element.className = finalArray.join(' ');
                return true;
            }
            return false;
        },

        /**
         * Given HTML in text form returns a documentFragment reference
         * @param {String} html The HTML to convert to documentFragment
         * @return {Object} documentFragment Node reference.
         * @method nodeCreate
         * @public
         * @static
         */
        nodeCreate: function (html) {
            var dom = document.createElement('DIV');
            var ret = document.createDocumentFragment();
            var nodes;
            dom.innerHTML = html;
            nodes = dom.childNodes;
            while (nodes[0]) {
                ret.appendChild(nodes[0].parentNode.removeChild(nodes[0]));
            }
            return ret;
        },

        /**
         * Given an element and a selector (className) returns the first parentNode with that className
         * @param {String} selector ClassName of the parent we're looking for
         * @param {Object} element Element to start from
         * @return {Object} returns the object reference to the node or null if none found
         * @method getParent
         * @public
         * @static
         */
        getParent: function (selector, element) {
            var domRef = ACT.Dom;
            if (domRef.hasClass(element, selector)) {
                return element;
            }
			if (element.parentNode) {
				return domRef.getParent(selector, element.parentNode);
			}

            return null;
        },

        /**
         * Helper function to empty nodes innerHTML
         * @param {Object} element Element to empty
         * @method clear
         * @public
         * @static
         */
        clear: function (element) {
            var domRef = ACT.Dom;
            if (domRef.isDomElement(element)) {
                element.innerHTML = '';
            }
        },

        /**
         * Helper function to set the nodes visibility to hidden or visible
         * @param {Object} element Element to hide
         * @param {Boolean} true to set to visible false to hidden
         * @method visible
         * @public
         * @static
         */
        visible: function (element, show) {
            var domRef = ACT.Dom;
            /* istanbul ignore else */
            if (domRef.isDomElement(element)) {
                if (show) {
                    element.style.visibility = 'visible';
                } else {
                    element.style.visibility = 'hidden';
                }
            }
        },

        /**
         * Helper function to change the display style of a nodes to block
         * @param {Object} element Element to display
         * @param {String} "block", "inline", "none" or null to revert to default
         * @method display
         * @public
         * @static
         */
        display: function (element, show) {
            var domRef = ACT.Dom;
            /* istanbul ignore else */
            if (domRef.isDomElement(element)) {
                if (show) {
                    element.style.display = show;
                } else {
                    element.style.display = '';
                }
            }
        },

        /**
         * Allows to register CSS rules within the stylesheet
         * @param {Object} sheet - StyleSheet.sheet
         * @param {String} selector - CSS selector
         * @param {String} rules - CSS rules (don't forget to end all lines with ";" )
         * @param {Number} index
         * @method addCSSRule
         * @public
         * @static
         */
        addCSSRule: function (sheet, selector, rules, index) {
            // insertRule is not available in earlier IE versions
            if (sheet.insertRule) {
                sheet.insertRule(selector + '{' + rules + '}', index);
            } else {
                sheet.addRule(selector, rules, index);
            }
        },

        /**
         * Creates a new style tag and returns its stylesheet
         * @method createStylesheet
         * @return StyleSheet.sheet
         * @public
         * @static
         */
        createStylesheet: function () {
            var style;
            var head;
            var browser = UA.browser;

            // fix JUST for IE... no more comments...
            if (browser.name === 'MSIE' && browser.version >= 6 && browser.version <= 10) {
                style = document.createStyleSheet();
                return style;
            }
			style = document.createElement('style');
			head = document.getElementsByTagName('head')[0];
			// Webkit hack
			style.appendChild(document.createTextNode(''));
			head.appendChild(style);
			return style.sheet ? style.sheet : style.styleSheet;
        },

        /**
         * Calculates browser window size returning its width and height
         * @method getWindowSize
         * @returns {{width: (Number), height: (Number)}}
         * @public
         * @static
         */
        getWindowSize: function () {
            var w = window;
            var d = document;
            var e = d.documentElement;
            var g = d.getElementsByTagName('body')[0];
            var width;
            var height;
            var os = UA.os.name;

            width = w.innerWidth ? w.innerWidth : 0;
            height = w.innerHeight ? w.innerHeight : 0;

            /* istanbul ignore else */
            if (os !== 'ios') {
                width = e.clientWidth && e.clientWidth > width ? e.clientWidth : width;
                height = e.clientHeight && e.clientHeight > height ? e.clientHeight : height;
                /* istanbul ignore else */
                if (!width || !height) {
                    width = g.clientWidth && g.clientWidth > width ? g.clientWidth : width;
                    height = g.clientHeight && g.clientHeight > height ? g.clientHeight : height;
                }
            }

            return {
                width: width,
                height: height
            };
        },

        /**
         * Get current position of given dom elment
         * @method getElementPosition
         * @public
         * @param {DomElement} element Element to get position
         * @return {Array} Position X and Y. E.g [x, y]
         */
        getElementPosition: function (element) {
            var xPosition = 0;
            var yPosition = 0;

            while (element && element !== document.body) {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }

            return [xPosition, yPosition];
        },

        /**
         * Applies a set of styles to an element
         * @method applyStyles
         * @param {Object} el Element upon which to apply the styles defined
         * @param {Object} styles Object of styles to apply
         * @public
         * @static
         */
        applyStyles: function (el, styles) {
            var s;
            for (s in styles) {
                /* istanbul ignore else */
                if (styles.hasOwnProperty(s)) {
                    el.style[s] = styles[s];
                }
            }
        },

        /**
         * Set attributes to given node
         *
         * @method setAttributes
         * @private
         * @param {HTMLElement} node
         * @param {Object} attrs a key->value set where key is the attribute name and value is the value to be set.
         */
        setAttributes: function (node, attrs) {
            var attr;
            for (attr in attrs) {
                /* istanbul ignore else */
                if (attrs.hasOwnProperty(attr)) {
                    node.setAttribute(attr, attrs[attr]);
                }
            }
        },

        /**
         * Checks if parameter is a DOM element
         * @param {Object} o DOM element
         * @returns {boolean} true for DOM element
         */
        isDomElement: function (o) {
            return typeof HTMLElement === 'object' ? o instanceof HTMLElement : // DOM2
            o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string';
        },

        /**
         * Calculates the right proportion based on maximum width and height when
         * browser window is smaller than image.
         * @param {Number} width - image width
         * @param {Number} height - image height
         * @method getMinProportion
         * @return {Number} proportion value
         * @public
         * @static
         */
        getMinProportion: function (width, height) {
            var windowSize = this.getWindowSize();
            var widthProportion = width ? (windowSize.width / width) : 1;
            var heightProportion = height ? (windowSize.height / height) : 1;
            var finalProportion = 1;
            /* istanbul ignore else */
            if (widthProportion < 1 && widthProportion < heightProportion) {
                finalProportion = widthProportion;
            } else if (heightProportion < 1 && heightProportion < widthProportion) {
                finalProportion = heightProportion;
            }
            return finalProportion;
        },

        /**
         * Return the current url of the window
         * The main reason for this method is to help us with the testing
         *
         * @method getCurrentLocation
         */
        getCurrentLocation: function () {
            return window.location.href;
        }

    };

    return new Dom();
});
