module.exports =
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
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.dictionary = exports.render = undefined;

	var _smfDeepDiff = __webpack_require__(1);

	var _smfDeepDiff2 = _interopRequireDefault(_smfDeepDiff);

	var _chalk = __webpack_require__(2);

	var _chalk2 = _interopRequireDefault(_chalk);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// https://github.com/flitbit/diff#differences
	var STANDARD_CONSOLE = !console.group;

	var dictionary = {
	  E: {
	    color: '#2196F3',
	    text: 'CHANGED:',
	    colorFn: _chalk2.default.blue.bold
	  },
	  N: {
	    color: '#4CAF50',
	    text: 'ADDED:',
	    colorFn: _chalk2.default.green.bold
	  },
	  D: {
	    color: '#F44336',
	    text: 'DELETED:',
	    colorFn: _chalk2.default.red.bold
	  },
	  A: {
	    color: '#2196F3',
	    text: 'ARRAY:',
	    colorFn: _chalk2.default.blue.bold
	  }
	};

	function renderObject(o) {
	  return JSON.stringify(o);
	}

	function renderSingleDiff(diff) {
	  var kind = diff.kind,
	      path = diff.path,
	      lhs = diff.lhs,
	      rhs = diff.rhs,
	      index = diff.index,
	      item = diff.item;


	  switch (kind) {
	    case 'E':
	      return path.join('.') + ' ' + renderObject(lhs) + ' \u2192 ' + renderObject(rhs);
	    case 'N':
	      return path.join('.') + ' ' + renderObject(rhs);
	    case 'D':
	      return '' + path.join('.');
	    case 'A':
	      {
	        // Lazy instanceof check
	        var pathString = path.join('.') + '[' + index + ']';
	        if (item && item.hasOwnProperty('rhs')) {
	          var dictionaryItem = dictionary[item.kind];
	          var kindString = STANDARD_CONSOLE ? dictionaryItem.colorFn(item.kind) : item.kind;
	          if (item.hasOwnProperty('lhs')) {
	            return pathString + ' ' + kindString + ': ' + renderObject(item.lhs) + ' \u2192 ' + renderObject(item.rhs);
	          }
	          return pathString + ' ' + kindString + ': ' + renderObject(item.rhs);
	        }
	        return pathString + ' ' + item;
	      }
	    default:
	      return null;
	  }
	}

	function render(header, diff) {
	  if (STANDARD_CONSOLE) {
	    console.log('—— diff start ——');
	    console.log(header);
	  } else {
	    console.group(header);
	  }

	  if (diff) {
	    for (var i = 0; i < diff.length; i++) {
	      var elem = diff[i];
	      var output = renderSingleDiff(elem);

	      var kind = elem.kind;
	      var dictionaryItem = dictionary[kind];
	      if (STANDARD_CONSOLE) {
	        console.log(dictionaryItem.colorFn(dictionaryItem.text), output);
	      } else {
	        console.log('%c ' + dictionaryItem.text, 'color: ' + dictionary[kind].color + '; font-weight: bold', output);
	      }
	    }
	  } else {
	    console.log('—— no diff ——');
	  }

	  if (STANDARD_CONSOLE) {
	    console.log('—— diff end ——');
	  } else {
	    console.groupEnd();
	  }
	}

	function logger(_ref) {
	  var getState = _ref.getState;

	  return function (next) {
	    return function (action) {
	      var prevState = getState();
	      var returnValue = next(action);
	      var newState = getState();
	      var time = new Date();

	      var diff = (0, _smfDeepDiff2.default)(prevState, newState);
	      var header = 'diff @' + (' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + '.' + time.getMilliseconds()) + +(' ' + action.type);
	      render(header, diff);

	      return returnValue;
	    };
	  };
	}

	exports.default = logger;
	exports.render = render;
	exports.dictionary = dictionary;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("smf-deep-diff");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("chalk");

/***/ }
/******/ ]);