"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.objectsEqual = exports.setDescendantProp = exports.getDescendantProp = exports.getDescendantPropQuick = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* flow */


var _mobx = require("mobx");

var getDescendantPropQuick = exports.getDescendantPropQuick = function getDescendantPropQuick(obj, path) {
	return path.split(".").reduce(function (acc, part) {
		return acc && acc[part];
	}, obj);
};

var getDescendantProp = exports.getDescendantProp = function getDescendantProp(obj, path) {
	var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ".";
	return path.split(delimiter).filter(function (p) {
		return p;
	}).reduce(function (acc, part) {
		return acc && acc[part];
	}, obj);
};

var setDescendantProp = exports.setDescendantProp = function setDescendantProp(obj, path, value) {
	var delimiter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ".";

	var parts = path.split(delimiter).filter(function (p) {
		return p;
	});
	var prop = parts.pop();
	parts.reduce(function (acc, part) {
		if (!acc[part]) acc[part] = {};
		return acc[part];
	}, obj)[prop] = value;
};

var objectsEqual = exports.objectsEqual = function objectsEqual() {
	for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
		objects[_key] = arguments[_key];
	}

	var leftChain = void 0,
	    rightChain = void 0;

	var _compare2Objects = function _compare2Objects(x, y) {
		// remember that NaN === NaN returns false and isNaN(undefined) returns true
		if (isNaN(x) && isNaN(y) && typeof x === "number" && typeof y === "number") return true;
		// Compare primitives and functions.
		// Check if both arguments link to the same object.
		// Especially useful on the step where we compare prototypes
		if (x === y) return true;
		// Works in case when functions are created in constructor.
		// Comparing dates is a common scenario. Another built-ins?
		// We can even handle functions passed across iframes
		if (typeof x === "function" && typeof y === "function" || x instanceof Date && y instanceof Date || x instanceof RegExp && y instanceof RegExp || x instanceof String && y instanceof String || x instanceof Number && y instanceof Number) {
			return x.toString() === y.toString();
		}
		// At last checking prototypes as good as we can
		if (!(x instanceof Object && y instanceof Object)) return false;
		if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) return false;
		if (x.constructor !== y.constructor) return false;
		if (x.prototype !== y.prototype) return false;
		// Check for infinitive linking loops
		if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) return false;
		// Quick checking of one object being a subset of another.
		// todo: cache the structure of arguments[0] for performance
		for (var p in y) {
			if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) return false;else if (_typeof(y[p]) !== _typeof(x[p])) return false;
		}
		for (var _p in x) {
			if (y.hasOwnProperty(_p) !== x.hasOwnProperty(_p)) return false;else if (_typeof(y[_p]) !== _typeof(x[_p])) return false;
			switch (_typeof(x[_p])) {
				case "object":
				case "function":
					leftChain.push(x);
					rightChain.push(y);
					if (!_compare2Objects(x[_p], y[_p])) return false;
					leftChain.pop();
					rightChain.pop();
					break;
				default:
					if (x[_p] !== y[_p]) return false;
					break;
			}
		}
		return true;
	};

	if (objects.length < 1) return true;

	for (var i = 1, l = objects.length; i < l; i++) {
		leftChain = [];
		rightChain = [];
		if (!_compare2Objects(objects[0], objects[i])) return false;
	}
	return true;
};