module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/actions.js":
/*!************************!*\
  !*** ./src/actions.js ***!
  \************************/
/*! exports provided: COMPLETE_REQUESTED, COMPLETE_SUCCEEDED, COMPLETE_FAILED, START_REQUESTED, START_SUCCEEDED, START_FAILED, SEND_STATEMENT_REQUESTED, SEND_STATEMENT_SUCCEEDED, SEND_STATEMENT_FAILED, TERMINATE_REQUESTED, TERMINATE_SUCCEEDED, TERMINATE_FAILED, completed, sendStatement, start, terminate, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"COMPLETE_REQUESTED\", function() { return COMPLETE_REQUESTED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"COMPLETE_SUCCEEDED\", function() { return COMPLETE_SUCCEEDED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"COMPLETE_FAILED\", function() { return COMPLETE_FAILED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"START_REQUESTED\", function() { return START_REQUESTED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"START_SUCCEEDED\", function() { return START_SUCCEEDED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"START_FAILED\", function() { return START_FAILED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SEND_STATEMENT_REQUESTED\", function() { return SEND_STATEMENT_REQUESTED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SEND_STATEMENT_SUCCEEDED\", function() { return SEND_STATEMENT_SUCCEEDED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SEND_STATEMENT_FAILED\", function() { return SEND_STATEMENT_FAILED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TERMINATE_REQUESTED\", function() { return TERMINATE_REQUESTED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TERMINATE_SUCCEEDED\", function() { return TERMINATE_SUCCEEDED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TERMINATE_FAILED\", function() { return TERMINATE_FAILED; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"completed\", function() { return completed; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"sendStatement\", function() { return sendStatement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"start\", function() { return start; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"terminate\", function() { return terminate; });\n/* harmony import */ var _cmi5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cmi5 */ \"./src/cmi5.js\");\n\nvar COMPLETE_REQUESTED = \"CMI5_COMPLETE_REQUESTED\";\nvar COMPLETE_SUCCEEDED = \"CMI5_COMPLETE_SUCCEEDED\";\nvar COMPLETE_FAILED = \"CMI5_COMPLETE_FAILED\";\nvar START_REQUESTED = \"CMI5_START_REQUESTED\";\nvar START_SUCCEEDED = \"CMI5_START_SUCCEEDED\";\nvar START_FAILED = \"CMI5_START_FAILED\";\nvar SEND_STATEMENT_REQUESTED = \"CMI5_SEND_STATEMENT_REQUESTED\";\nvar SEND_STATEMENT_SUCCEEDED = \"CMI5_SEND_STATEMENT_SUCCEEDED\";\nvar SEND_STATEMENT_FAILED = \"CMI5_SEND_STATEMENT_FAILED\";\nvar TERMINATE_REQUESTED = \"CMI5_TERMINATE_REQUESTED\";\nvar TERMINATE_SUCCEEDED = \"CMI5_TERMINATE_SUCCEEDED\";\nvar TERMINATE_FAILED = \"CMI5_TERMINATE_FAILED\";\n/**\n * Mark the lesson as completed with a score (or no score if non assement), \n * and then (by default) terminate the cmi5 session.\n * \n * Generally safer to use the combined 'complete then terminate'\n * to more safely manage that the two events are published correctly in order.\n * \n * In CMI5 protocol, one of complete/pass/failed should be called once (and only once).\n * This single 'completed' function will send a result with a completion verb as follows:\n *   - COMPLETED (https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_completed)\n *       If no `score` is passed\n *   - PASSED (https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_passed)\n *       If a `score` is passed and `failed` is *not* passed or anything other then `true\n *   - FAILED (https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_failed)\n *       If a `score` is passed and `failed` is `true`\n * (COMPLETED, PASSED, FAILED)\n *\n * @params {Number} [score] - the score for PASSED or FAILED or leave undefined for non-assessment resources\n * @params {Boolean} [failed] - pass `true` *only* with a failing score\n * @params {Object} [extensions] - a XAPI extensions object to pass with result\n *     (https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#result)\n * @params {Boolean} terminate - if TRUE, terminates the cmi5 session after\n *      submitting 'completed'. Default is TRUE\n * @params {Boolean} verbose - if TRUE, logs more events to console. Default is FALSE\n */\n\nvar completed = function completed() {\n  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},\n      score = _ref.score,\n      failed = _ref.failed,\n      extensions = _ref.extensions,\n      _ref$terminate = _ref.terminate,\n      terminate = _ref$terminate === void 0 ? true : _ref$terminate,\n      _ref$verbose = _ref.verbose,\n      verbose = _ref$verbose === void 0 ? false : _ref$verbose;\n\n  return function (dispatch, getState) {\n    if (verbose) {\n      console.log('cmi5 sending COMPLETED and will follow with TERMINATE...');\n    }\n\n    var cmiStatus = _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getStatus(getState());\n\n    if (cmiStatus !== _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.STARTED && cmiStatus !== _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.COMPLETE_FAILED) {\n      console.error('complete called from invalid state (you need to call start action before complete and complete can be called only ONE time)', cmiStatus);\n      return;\n    }\n\n    var cmi = _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].instance;\n\n    if (!cmi) {\n      /**\n       * the cmi instance will be null if initialization failed with an error\n       * e.g. because this web-app was launched using a url\n       * that didn't have cmi5's expected query params:\n       * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch\n       */\n      console.error('complete called having no cmi instance (you need to call start action before complete)');\n      return;\n    }\n\n    dispatch({\n      type: COMPLETE_REQUESTED\n    });\n\n    var onCompleteCallback = function onCompleteCallback(err) {\n      if (err) {\n        console.error('completion call failed with error:', err);\n        dispatch({\n          type: COMPLETE_FAILED,\n          error: err.message\n        });\n      } else {\n        dispatch({\n          type: COMPLETE_SUCCEEDED\n        });\n      }\n\n      if (!terminate) {\n        if (verbose) {\n          console.log('after COMPLETED, skipping TERMINATE...');\n        }\n\n        return;\n      }\n\n      dispatch({\n        type: TERMINATE_REQUESTED\n      });\n      cmi.terminate(function (err) {\n        if (err) {\n          console.error('completion call failed with error:', err);\n          dispatch({\n            type: TERMINATE_FAILED,\n            error: err.message\n          });\n          return;\n        }\n\n        dispatch({\n          type: TERMINATE_SUCCEEDED\n        });\n      });\n    };\n\n    if (isNaN(Number(score))) {\n      /**\n       * if no score is passed, then we will complete with\n       * the COMPLETED verb (as opposed to PASSED or FAILED)\n       * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_completed\n       */\n      extensions = score;\n      cmi.completed(extensions, onCompleteCallback);\n      return;\n    }\n    /**\n     * A score was passed, so we will complete with\n     * the either verb PASSED\n     * (https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_passed)\n     * or FAILED\n     * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_failed)\n     */\n\n\n    failed = typeof failed === 'boolean' ? failed : false;\n\n    if (failed) {\n      cmi.failed(score, extensions, onCompleteCallback);\n    } else {\n      cmi.passed(score, extensions, onCompleteCallback);\n    }\n  };\n};\nvar sendStatement = function sendStatement() {\n  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},\n      verb = _ref2.verb;\n\n  return function (dispatch, getState) {\n    var cmiStatus = _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getStatus(getState());\n\n    if (cmiStatus !== _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.STARTED) {\n      console.error('Send statement called when status is not STARTED.', cmiStatus);\n    }\n\n    var cmi = _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].instance;\n\n    if (!cmi) {\n      /**\n       * the cmi instance will be null if initialization failed with an error\n       * e.g. because this web-app was launched using a url \n       * that didn't have cmi5's expected query params:\n       * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch\n       */\n      console.error('sendStatement called having no cmi instance (you need to call start action before sendStatement)');\n      return;\n    }\n\n    dispatch({\n      type: SEND_STATEMENT_REQUESTED\n    });\n    var st = cmi.prepareStatement(verb);\n    cmi.sendStatement(st, function (err) {\n      if (err) {\n        console.error('sendStatement call failed with error:', err);\n        dispatch({\n          type: SEND_STATEMENT_FAILED,\n          error: err.message\n        });\n        return;\n      }\n\n      dispatch({\n        type: SEND_STATEMENT_SUCCEEDED\n      });\n    });\n  };\n};\n/**\n * As early  as possible you must initialize cmi5 by calling the start action.\n * No completion or termination can be called unless start has completed successfully.\n * Under the covers of start, the full cmi5 launch sequence is executed:\n * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch\n */\n\nvar start = function start(url) {\n  return function (dispatch) {\n    dispatch({\n      type: START_REQUESTED\n    });\n    _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create(url).then(function (cmi) {\n      cmi.start(function (startErr) {\n        if (startErr) {\n          dispatch({\n            type: START_FAILED,\n            error: startErr.message\n          });\n          console.error(\"CMI error: \".concat(startErr));\n          return;\n        }\n\n        dispatch({\n          type: START_SUCCEEDED\n        });\n      });\n    })[\"catch\"](function (err) {\n      dispatch({\n        type: START_FAILED,\n        error: err.message\n      });\n    });\n  };\n};\n/**\n * In CMI5 protocol, a statement with verb TERMINATED \n * (https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#938-terminated) \n * should be called once (and only once) to end the session.\n */\n\nvar terminate = function terminate() {\n  return function (dispatch, getState) {\n    var cmiStatus = _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getStatus(getState());\n\n    if (cmiStatus !== _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.COMPLETED && cmiStatus !== _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.TERMINATE_FAILED) {\n      console.error('Terminate called when status is not COMPLETED. Generally safer to use \"completeAndTerminate\" action', cmiStatus);\n    }\n\n    var cmi = _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].instance;\n\n    if (!cmi) {\n      /**\n       * the cmi instance will be null if initialization failed with an error\n       * e.g. because this web-app was launched using a url \n       * that didn't have cmi5's expected query params:\n       * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch\n       */\n      console.error('complete called having no cmi instance (you need to call start action before complete)');\n      return;\n    }\n\n    dispatch({\n      type: TERMINATE_REQUESTED\n    });\n    cmi.terminate(function (err) {\n      if (err) {\n        console.error('completion call failed with error:', err);\n        dispatch({\n          type: TERMINATE_FAILED,\n          error: err.message\n        });\n        return;\n      }\n\n      dispatch({\n        type: TERMINATE_SUCCEEDED\n      });\n    });\n  };\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  COMPLETE_FAILED: COMPLETE_FAILED,\n  COMPLETE_REQUESTED: COMPLETE_REQUESTED,\n  COMPLETE_SUCCEEDED: COMPLETE_SUCCEEDED,\n  START_FAILED: START_FAILED,\n  START_REQUESTED: START_REQUESTED,\n  START_SUCCEEDED: START_SUCCEEDED,\n  TERMINATE_FAILED: TERMINATE_FAILED,\n  TERMINATE_REQUESTED: TERMINATE_REQUESTED,\n  TERMINATE_SUCCEEDED: TERMINATE_SUCCEEDED,\n  completed: completed,\n  sendStatement: sendStatement,\n  start: start,\n  terminate: terminate\n});\n\n//# sourceURL=webpack:///./src/actions.js?");

/***/ }),

/***/ "./src/cmi5.js":
/*!*********************!*\
  !*** ./src/cmi5.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar _url = null;\nvar _cmi = null;\n\nfunction sleep(ms) {\n  return new Promise(function (resolve) {\n    return setTimeout(resolve, ms);\n  });\n}\n/**\n * Singleton wrapper for a cmi service.\n */\n\n\nvar Cmi5 =\n/*#__PURE__*/\nfunction () {\n  function Cmi5() {\n    _classCallCheck(this, Cmi5);\n  }\n\n  _createClass(Cmi5, null, [{\n    key: \"getStatus\",\n    value: function getStatus(state) {\n      return state ? state[Cmi5.STATUS_PROP] || Cmi5.STATUS.NONE : Cmi5.STATUS.NONE;\n    }\n  }, {\n    key: \"setStatus\",\n    value: function setStatus(state) {\n      var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Cmi5.STATUS.NONE;\n      state = state || {};\n      return _objectSpread({}, state, _defineProperty({}, Cmi5.STATUS_PROP, status));\n    }\n  }, {\n    key: \"_tryCreateWithTimeout\",\n    value: function _tryCreateWithTimeout() {\n      var timeoutMs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20000;\n      var retryIntervalMs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;\n      var timerMs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;\n      return new Promise(function (resolve, reject) {\n        if (typeof window !== 'undefined' && typeof window.Cmi5 === 'function') {\n          _cmi = new window.Cmi5(Cmi5.url);\n          return resolve(_cmi);\n        }\n\n        if (timerMs >= timeoutMs) {\n          return reject(\"Cmi5 timeout: failed to create a Cmi5 instance in \".concat(timeoutMs, \" (constructor not loaded on window)\"));\n        }\n\n        sleep(retryIntervalMs).then(function (_) {\n          return Cmi5._tryCreateWithTimeout(timeoutMs, retryIntervalMs, timerMs + retryIntervalMs);\n        }).then(function (cmi) {\n          return resolve(cmi);\n        })[\"catch\"](function (err) {\n          return reject(err);\n        });\n      });\n    }\n  }, {\n    key: \"create\",\n    value: function create(url) {\n      _url = url || Cmi5.url;\n      var timeoutMs = 5000;\n      var retryIntervalMs = 250;\n      return this._tryCreateWithTimeout(timeoutMs, retryIntervalMs, 0);\n    }\n  }, {\n    key: \"STATUS\",\n    get: function get() {\n      return {\n        NONE: 0,\n        START_IN_PROGRESS: 1,\n        STARTED: 2,\n        START_FAILED: 3,\n        COMPLETE_IN_PROGRESS: 4,\n        COMPLETED: 5,\n        COMPLETE_FAILED: 6,\n        TERMINATE_IN_PROGRESS: 6,\n        TERMINATED: 7,\n        TERMINATE_FAILED: 8\n      };\n    }\n  }, {\n    key: \"STATUS_PROP\",\n    get: function get() {\n      return \"cmi5_status\";\n    }\n  }, {\n    key: \"url\",\n    get: function get() {\n      return _url || typeof window !== 'undefined' ? window.location.href : null;\n    },\n    set: function set(value) {\n      _url = value;\n    }\n  }, {\n    key: \"instance\",\n    get: function get() {\n      if (_cmi) {\n        return _cmi;\n      }\n\n      try {\n        return Cmi5.create();\n      } catch (err) {\n        console.error(err);\n        return null;\n      }\n    }\n  }]);\n\n  return Cmi5;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Cmi5);\n\n//# sourceURL=webpack:///./src/cmi5.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: actions, Cmi5, reducers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions */ \"./src/actions.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"actions\", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* harmony import */ var _cmi5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cmi5 */ \"./src/cmi5.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Cmi5\", function() { return _cmi5__WEBPACK_IMPORTED_MODULE_1__[\"default\"]; });\n\n/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reducers */ \"./src/reducers.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"reducers\", function() { return _reducers__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\n\n\n\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/reducers.js":
/*!*************************!*\
  !*** ./src/reducers.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _cmi5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cmi5 */ \"./src/cmi5.js\");\n/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions */ \"./src/actions.js\");\n\n\nvar initialState = _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setStatus({}, _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.NONE);\n\nvar reducer = function reducer() {\n  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;\n  var action = arguments.length > 1 ? arguments[1] : undefined;\n\n  if (!action) {\n    return state;\n  }\n\n  switch (action.type) {\n    case _actions__WEBPACK_IMPORTED_MODULE_1__[\"START_REQUESTED\"]:\n      return _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setStatus(state, _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.START_IN_PROGRESS);\n\n    case _actions__WEBPACK_IMPORTED_MODULE_1__[\"START_SUCCEEDED\"]:\n      return _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setStatus(state, _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.STARTED);\n\n    case _actions__WEBPACK_IMPORTED_MODULE_1__[\"START_FAILED\"]:\n      return _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setStatus(state, _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.START_FAILED);\n\n    case _actions__WEBPACK_IMPORTED_MODULE_1__[\"COMPLETE_REQUESTED\"]:\n      return _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setStatus(state, _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.COMPLETE_IN_PROGRESS);\n\n    case _actions__WEBPACK_IMPORTED_MODULE_1__[\"COMPLETE_SUCCEEDED\"]:\n      return _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setStatus(state, _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.COMPLETED);\n\n    case _actions__WEBPACK_IMPORTED_MODULE_1__[\"COMPLETE_FAILED\"]:\n      return _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setStatus(state, _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.COMPLETE_FAILED);\n\n    case _actions__WEBPACK_IMPORTED_MODULE_1__[\"TERMINATE_REQUESTED\"]:\n      return _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setStatus(state, _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.TERMINATE_IN_PROGRESS);\n\n    case _actions__WEBPACK_IMPORTED_MODULE_1__[\"TERMINATE_SUCCEEDED\"]:\n      return _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setStatus(state, _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.TERMINATED);\n\n    case _actions__WEBPACK_IMPORTED_MODULE_1__[\"TERMINATE_FAILED\"]:\n      return _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setStatus(state, _cmi5__WEBPACK_IMPORTED_MODULE_0__[\"default\"].STATUS.TERMINATE_FAILED);\n\n    default:\n      return state;\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (reducer);\n\n//# sourceURL=webpack:///./src/reducers.js?");

/***/ })

/******/ });