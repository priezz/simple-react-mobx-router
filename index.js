'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobx = require('mobx');

var _routines = require('./routines');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(0, _mobx.useStrict)(true);

var Router =
// getCurrentViewByLevel =  (level = 1, props = {} ) => {
// 	const pathParts = this._currentRoute.path.split("/").filter(p => p).splice(0, level)
// 	if(pathParts.length < level) return null
// 	const path = pathParts.join("/")
// 	return this.getView(path, { ...this._currentRoute.props, ...props } )
// }
function Router() {
	var _this = this;

	var routesDefs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    defaultRoute = _ref.defaultRoute,
	    defaultFallback = _ref.defaultFallback;

	_classCallCheck(this, Router);

	this._views = {};
	this._history = [];

	this.getCurrentRoute = function (path) {
		// console.debug("Router/getCurrentRoute()", path, this._currentRoute.path, caller)
		var current = _this._currentRoute.path;
		if (!path) return current;
		if (current.indexOf(path) === -1) return null;
		return current.replace(path, "").split("/").filter(function (p) {
			return p;
		})[0];
	};

	this.getView = function (path) {
		var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var asComponent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		// TODO: Support parameterized paths: /some/:param/:other_param/path
		// console.log("getView()", path, props)
		if (!path) return null;
		var obj = (0, _routines.getDescendantProp)(_this._views, path, "/");
		// console.log("getView() obj", obj)
		if (!obj || !obj.__component) return null;
		var condition = obj.__condition;
		var check = typeof condition === 'function' ? condition() : true;
		// console.log("getView() check", typeof condition, check)
		// console.log("getView() props", { ...obj.__props, ...props })
		return check ? asComponent ? [obj.__component, _extends({}, obj.__props, props)] : _react2.default.createElement(obj.__component, _extends({}, obj.__props, props)) : _this.getView(obj.__fallback || _this._defaultFallback, { _doNotTrack: true }, asComponent);
	};

	this.getSubViews = function (path) {
		// console.log("getSubViews:", path)
		var routeDef = (0, _routines.getDescendantProp)(_this._views, path, "/");
		// console.log("getSubViews:", routeDef)
		// console.log("getSubViews: currentRoute", this._currentRoute)
		return Object.keys(routeDef).filter(function (key) {
			return key.indexOf('__') !== 0;
		}) // check these are not service fields
		.map(function (key) {
			return _this.getView(path + '/' + key, _extends({}, _this._currentRoute.props, routeDef[key].__props, { key: key }));
		});
	};

	this.getCurrentSubView = function (path) {
		var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var asComponent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		// console.log("getCurrentSubView()", path, props, this._currentRoute.path)
		var key = _this.getCurrentRoute(path, 'Router/getCurrentSubView');
		// console.log("getCurrentSubView() key", key)
		if (!key) return null;
		return _this.getView(path + '/' + key, _extends({}, _this._currentRoute.props, props), asComponent);
	};

	var _loop = function _loop(path) {
		var options = routesDefs[path];

		var _ref2 = options || {},
		    component = _ref2.component,
		    _ref2$props = _ref2.props,
		    props = _ref2$props === undefined ? {} : _ref2$props,
		    condition = _ref2.condition,
		    fallback = _ref2.fallback;

		if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') component = options;
		if (!component || component === null) component = function component() {
			return _this.getCurrentSubView(path);
		};

		(0, _routines.setDescendantProp)(_this._views, '/' + path, {
			__component: component,
			__props: props,
			__condition: condition,
			__fallback: fallback
		}, "/");
	};

	// const self = this
	// console.debug("Router/constructor()")

	for (var path in routesDefs) {
		_loop(path);
	}
	this._setDefaultRoute(defaultRoute || Object.keys(routesDefs)[0]);
	this._defaultFallback = defaultFallback;
	// console.log("Router/constructor()", this._views)
}

// @computed get getCurrentRoute(path) {
// getCurrentRoute = (path, caller) => {
;

exports.default = Router;