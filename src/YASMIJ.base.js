/*
 * @project YASMIJ.js, 'Yet another simplex method implementation in Javascript'
 * @author Larry Battle
 * @license MIT License <http://www.opensource.org/licenses/mit-license>
 */
// Removes spaces before and after a string.
// Singleton to everything
var _YASMIJ;
String.prototype.trim = String.prototype.trim || function () {
    return (this || '').replace(/^\s+|\s+$/g, '');
};

if (!JSON) {
    return 'JSON is required. Please update your browser or JS engine.';
}

module.exports = _YASMIJ || (function() {
    var YASMIJ = {};
    // Holds the constants
    YASMIJ.CONST = {
    	STANDARD_MAX : 'standardMax',
    	STANDARD_MIN : 'standardMin',
    	NONSTANDARD_MIN : 'nonstandardMin',
    	NONSTANDARD_MAX : 'nonstandardMax'
    };
    /**
     * Returns an unique array.
     * @param {Array} arr - array of primitive types(booleans, numbers, strings).
     * @return Array
     */
    YASMIJ.getUniqueArray = function (arr) {
    	var result = [],
    	hash = {};
    	if (typeof arr !== 'object' || !arr.length) {
    		return result;
    	}
    	for (var i = 0, len = arr.length; i < len; i++) {
    		if (!hash[arr[i]]) {
    			result.push(arr[i]);
    			hash[arr[i]] = 1;
    		}
    	}
    	return result;
    };
    /**
     * Returns the elements of an array as the keys for a hash object.
     * @param {Array} arr -
     * @return {Object}
     */
    YASMIJ.convertArrayValuesToHashMap = function (arr) {
    	if (!arr || typeof arr !== 'object') {
    		return {};
    	}
    	var obj = {};
    	for (var i = 0, len = arr.length; i < len; i++) {
    		obj[arr[i]] = 1;
    	}
    	return obj;
    };
    /**
     * Returns a sorted array, where the elements in a subset are sorted and grouped towards the end of the array.
     * @param {Array} arr - the main array that contains elements from `subset`
     * @param {Array} subset - an array whose elements are contained within `arr`
     * @return {Array}
     * @example
    YASMIJ.sortArrayWithSubsetAtEnd(['a','1','b','2'],['1','2']); // returns ['a', 'b', '1', '2']
     */
    YASMIJ.sortArrayWithSubsetAtEnd = function (arr, subset) {
    	if (!arr || typeof arr !== 'object' || !subset || typeof subset !== 'object') {
    		return [];
    	}
    	var list = [];
    	var hash = YASMIJ.convertArrayValuesToHashMap(subset);
    	for (var i = 0, len = arr.length; i < len; i++) {
    		if (!hash[arr[i]]) {
    			list.push(arr[i]);
    		}
    	}
    	return list.sort().concat(subset.sort());
    };

    /**
     * Checks to see if two objects are identical.
     * @param {Object} obj1 -
     * @param {Object} obj2 -
     * @return {Boolean}
     */
    YASMIJ.areObjectsSame = function (obj1, obj2) {
    	var a,
    	b;
    	if (obj1 === obj2) {
    		return true;
    	}
    	if (!(obj1 instanceof obj2.constructor)) {
    		return false;
    	}
    	for (var prop in obj1) {
    		if (!obj1.hasOwnProperty(prop)) {
    			continue;
    		}
    		a = obj1[prop];
    		b = obj2[prop];
    		if (typeof a === 'object') {
    			if (typeof a !== typeof b) {
    				return false;
    			}
    			if (!YASMIJ.areObjectsSame(a, b)) {
    				return false;
    			}
    		} else {
    			if (a.toString() !== b.toString()) {
    				return false;
    			}
    		}
    	}
    	return true;
    };
    /**
     * Sovles a Linear Programming Problem, LPP
     * @param {Object} input - description of the LPP
     * @return {YASMIJ.Output}
     */
    YASMIJ.solve = function (input) {
    	return YASMIJ.Simplex.solve(input);
    };
    _YASMIJ = YASMIJ; // set singleton
    return YASMIJ;
})();
