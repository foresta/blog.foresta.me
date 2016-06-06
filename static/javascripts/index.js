/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _RippleEffect = __webpack_require__(1);

	var _RippleEffect2 = _interopRequireDefault(_RippleEffect);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(2);

	var rippleBtns = document.querySelectorAll(".ripple");
	Array.from(rippleBtns).forEach(function (btn) {
	    new _RippleEffect2.default(btn);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 * Ripple Effect for material design
	 */

	var RippleEffect = function () {
	    function RippleEffect(btn) {
	        _classCallCheck(this, RippleEffect);

	        this.btn = btn;
	        this.setListener();
	    }

	    _createClass(RippleEffect, [{
	        key: 'effect',
	        value: function effect(x, y) {
	            var effectElm = document.createElement('div');
	            effectElm.classList.add('ripple-effect');
	            effectElm.style.top = y;
	            effectElm.style.left = x;
	            this.btn.insertBefore(effectElm, this.btn.firstChild);
	        }
	    }, {
	        key: 'setListener',
	        value: function setListener() {
	            var _this = this;

	            this.btn.addEventListener('mousedown', function (e) {
	                e.preventDefault();
	                var x = e.offsetX;
	                var y = e.offsetY;

	                _this.effect(x, y);
	            });

	            this.btn.addEventListener('touchstart', function (e) {
	                e.preventDefault();
	                var clientX = e.changedTouches[0].clientX;
	                var clientY = e.changedTouches[0].clientY;

	                console.log("touch started :(" + clientX + "," + clientY + ")");
	            });
	        }
	    }]);

	    return RippleEffect;
	}();

	exports.default = RippleEffect;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "/*\nhtml5doctor.com Reset Stylesheet\nv1.6.1\nLast Updated: 2010-09-17\nAuthor: Richard Clark - http://richclarkdesign.com \nTwitter: @rich_clark\n*/\nhtml, body, div, span, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\nabbr, address, cite, code,\ndel, dfn, em, img, ins, kbd, q, samp,\nsmall, strong, sub, sup, var,\nb, i,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, figcaption, figure,\nfooter, header, hgroup, menu, nav, section, summary,\ntime, mark, audio, video {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  outline: 0;\n  font-size: 100%;\n  vertical-align: baseline;\n  background: transparent; }\n\nbody {\n  line-height: 1; }\n\narticle, aside, details, figcaption, figure,\nfooter, header, hgroup, menu, nav, section {\n  display: block; }\n\nnav ul {\n  list-style: none; }\n\nul li {\n  list-style-type: none; }\n\nblockquote, q {\n  quotes: none; }\n\nblockquote:before, blockquote:after,\nq:before, q:after {\n  content: '';\n  content: none; }\n\na {\n  margin: 0;\n  padding: 0;\n  font-size: 100%;\n  vertical-align: baseline;\n  background: transparent; }\n\n/* change colours to suit your needs */\nins {\n  background-color: #ff9;\n  color: #000;\n  text-decoration: none; }\n\n/* change colours to suit your needs */\nmark {\n  background-color: #ff9;\n  color: #000;\n  font-style: italic;\n  font-weight: bold; }\n\ndel {\n  text-decoration: line-through; }\n\nabbr[title], dfn[title] {\n  border-bottom: 1px dotted;\n  cursor: help; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\n/* change border colour to suit your needs */\nhr {\n  display: block;\n  height: 1px;\n  border: 0;\n  border-top: 1px solid #cccccc;\n  margin: 1em 0;\n  padding: 0; }\n\ninput, select {\n  vertical-align: middle; }\n\n/* sidebar */\n/* \n * font\n */\n/* font size */\nhtml {\n  font-size: 62.5%; }\n\nbody {\n  font-size: 1.6rem; }\n\nh1 {\n  font-size: 3.0rem; }\n\nh2 {\n  font-size: 2.6rem; }\n\nh3 {\n  font-size: 2.4rem; }\n\nh4 {\n  font-size: 2.2rem; }\n\nh5 {\n  font-size: 2.0rem; }\n\nh6 {\n  font-size: 1.8rem; }\n\nbody {\n  font-family: \"Helvetica\", \"Arial\", \"sans-serif\";\n  font-weight: 400;\n  line-height: 1.4; }\n\nh1 {\n  font-weight: 400;\n  line-height: 1.35;\n  letter-spacing: -0.02em; }\n\nh2 {\n  font-weight: 400;\n  line-height: 48px; }\n\nh3 {\n  font-weight: 400;\n  line-height: 40px; }\n\nh4 {\n  font-weight: 400;\n  line-height: 32px; }\n\nh5 {\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0.02em; }\n\nh6 {\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0.04em; }\n\np {\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0; }\n\na {\n  color: #ff4081;\n  font-weight: 500; }\n\n/*\n *  common.scss\n */\nbody {\n  background-color: #f4f4f4;\n  color: #505050; }\n\n/*\n * size\n */\n@keyframes scale {\n  0% {\n    transform: scale(1, 1);\n    opacity: 0.7; }\n  85% {\n    transform: scale(100, 100);\n    opacity: 1; }\n  100% {\n    transform: scale(100, 100);\n    opacity: 0; } }\n\n.ripple {\n  position: relative;\n  overflow: hidden; }\n  .ripple .ripple-inner {\n    position: relative;\n    z-index: 1; }\n  .ripple .ripple-effect {\n    position: absolute;\n    width: 10px;\n    height: 10px;\n    background-color: #d4d4d4;\n    border-radius: 50%;\n    animation: scale 1.5s ease-out;\n    opacity: 0;\n    z-index: 0; }\n\n/*\n *  header\n */\n.content__header {\n  background-color: #20d2c9;\n  width: 100%;\n  color: #ffffff;\n  height: 300px; }\n  .content__header .header-inner {\n    margin-left: 240px;\n    padding: 30px;\n    position: relative; }\n    .content__header .header-inner .content__title {\n      position: relative;\n      top: 50%;\n      font-size: 3.4rem; }\n    .content__header .header-inner .content__meta {\n      margin-top: 10px; }\n\n/*\n *  sidebar\n */\n#sidebar {\n  width: 240px;\n  height: 100%;\n  z-order: 1;\n  background-color: #f4f4f4;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n  position: fixed;\n  top: 0;\n  left: 0; }\n  #sidebar .site-logo {\n    margin-top: 20px;\n    padding: 0 20px; }\n    #sidebar .site-logo img {\n      border-radius: 50%; }\n  #sidebar .site-header {\n    padding: 0 20px; }\n    #sidebar .site-header a {\n      text-decoration: none;\n      display: inline-block; }\n      #sidebar .site-header a:hover:after, #sidebar .site-header a:focus:after {\n        width: 100%;\n        transition: width 0.5s ease; }\n      #sidebar .site-header a:after {\n        display: block;\n        content: \"\";\n        height: 1px;\n        width: 0%;\n        background-color: #ff4081;\n        transition: width 0.5s ease; }\n  #sidebar .site-description {\n    font-size: 1.4rem;\n    padding: 0 20px; }\n  #sidebar ul {\n    text-align: left; }\n    #sidebar ul li a {\n      color: #505050;\n      display: block;\n      padding: 10px 20px;\n      text-decoration: none;\n      transition: background-color 0.3s linear; }\n      #sidebar ul li a:hover {\n        background-color: #e4e4e4;\n        transition: background-color 0.3s linear; }\n\n/*\n * components/main\n */\n.main {\n  margin-left: 240px;\n  margin-top: -150px;\n  padding: 8px; }\n  .main .page-content {\n    margin: 8px;\n    padding: 16px;\n    background-color: #ffffff;\n    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }\n\n.page-content {\n  color: #505050; }\n  .page-content h1 {\n    margin-top: 15px;\n    margin-bottom: 20px;\n    font-size: 3.5rem; }\n  .page-content h2 {\n    margin-top: 15px;\n    margin-bottom: 20px;\n    border-bottom: 2px solid #eee; }\n  .page-content h3 {\n    margin-top: 10px;\n    margin-bottom: 10px; }\n  .page-content h4, .page-content h5, .page-content h6 {\n    margin-top: 5px;\n    margin-bottom: 5px; }\n  .page-content li {\n    list-style-type: none;\n    position: relative;\n    padding-left: 20px; }\n    .page-content li:before {\n      content: \"\";\n      position: absolute;\n      left: 0;\n      top: 50%;\n      width: 8px;\n      height: 8px;\n      border-radius: 50%;\n      background-color: #20d2c9;\n      margin-top: -4px; }\n  .page-content a {\n    text-decoration: none;\n    display: inline-block; }\n    .page-content a:hover:after, .page-content a:focus:after {\n      width: 100%;\n      transition: width 0.5s ease; }\n    .page-content a:after {\n      display: block;\n      content: \"\";\n      height: 1px;\n      width: 0%;\n      background-color: #ff4081;\n      transition: width 0.5s ease; }\n\nfooter {\n  margin-left: 240px;\n  padding: 0 16px;\n  text-align: right; }\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);