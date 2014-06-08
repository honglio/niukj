define(function() {
	"use strict";

	function ArrayIterator(val) {
		this._val = val;
		this._crsr = 0;
	}

	ArrayIterator.prototype = {
		next: function() {
			return this._val[this._crsr += 1];
		},

		hasNext: function() {
			return this._crsr < this._val.length - 1;
		}
	};

	function ObjectIterator(val) {
		this._object = val;
		this._iter = new ArrayIterator(Object.keys(val));
	}

	ObjectIterator.prototype = {
		next: function() {
			return this._object[this._iter.next()];
		},

		hasNext: function() {
			return this._iter.hasNext();
		}
	};

    function IteratorFactory(val) {
        if (Array.isArray(val) || val instanceof Array) {
            return new ArrayIterator(val);
        } else if (typeof val === "object") {
            return new ObjectIterator(val);
        } else {
            return;
        }
    }

	return IteratorFactory;
});
