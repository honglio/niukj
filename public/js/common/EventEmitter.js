/**
 * The eventEmitter pattern from nodeJS ported to the browser.
 */
define(function() {
    "use strict";

    function EventEmitter() {
        if (!(this instanceof EventEmitter)) {
            return new EventEmitter();
        }

        this._events = null;

        if (typeof process !== 'undefined' && typeof process.nextTick !== 'undefined') {
            this._deferer = function(cb, topic, args) {
                process.nextTick(function() {
                    cb(topic, args);
                });
            };
        } else {
            this._deferer = function(cb, topic, args) {
                setTimeout(function() {
                    cb(topic, args);
                }, 0);
            };
        }
    }

    EventEmitter.prototype = {

        /**
         * Return the cb Array of a given topic
         * @method _listeners
         * @param {String} [topic]: Name of event
         * @returns {Array} cb & context
         *
         */
        _listeners: function listeners(topic) {
            var events = this._events || (this._events = {});
            return events[topic] || (events[topic] = []);
        },

        /**
         * Run the callback when a matched event is called.
         * @method _emit
         * @param {String} [topic]: Name of event
         * @param {Array} [args]: the extra args Array.
         *
         */
        _emit: function(topic, args) {
            if (Array.isArray(topic) || topic instanceof Array) {
                topic = JSON.stringify(topic);
            }
            if (this._events === null || this._events === undefined) { return; }
            var subs = this._events[topic];
            if (subs === null || subs === undefined) { return; }

            var len = subs.length;
            while (len >= 0) {
                len -= 1;
                var sub = subs[len];
                if (sub && typeof sub.cb.apply !== 'undefined') {
                    sub.cb.apply(sub.context, args);
                }
            }
        },

		/**
         * splice the arguments array.
         * @method _splice
         * 
         * @param {Array} [args]: the arguments array.
		 * @param {Number} [start]: start index.
		 * @param {Number} [end]: end index.
		 * @returns {Array} the spliced array
         *
         */
        _splice: function(args, start, end) {
            args = Array.prototype.slice.call(args);
            return args.splice(start, end);
        },

        /**
         * Return the index of a cb of a topic
         * @method _indexOfSub
         * @param {Array} [arr]: The callback array of a topic 
         * @param {Function} [cb]: callback
         * @param {Object} [context]: context
         * @returns {Number} index
         *
         */
        _indexOfSub: function(arr, cb, context) {
            for (var i = 0; i < arr.length; i+=1) {
                if (arr[i].cb === cb && arr[i].context === context) {
                    return i;
                }
            }

            return -1;
        },

        /**
         * Publish an event on the given topic
         */
        emit: function(topic) {
            var args = arguments.length > 1 ? this._splice(arguments, 1, arguments.length) : [];
            this._emit(topic, args);
        },

        trigger: function() {
            this.emit.apply(this, arguments);
        },

        /**
         * Publish an event on the given topic on the next iteration 
         * through the event loop
         */
        emitDeferred: function(emit, topic) {
            var args = arguments.length > 1 ? this._splice(arguments, 1, arguments.length) : [];
            this._deferer(emit, topic, args);
        },

        /**
         * Register a callback for the given topic.
         * Optionally, a context may be provided.  The provided
         * context will be used for the this argument to callback.
         */
        on: function(topic, callback, context) {
            if (!callback) {
                throw "Undefined callback provided";
            }
            if (Array.isArray(topic) || topic instanceof Array) {
                topic = JSON.stringify(topic);
            }

            var subs = this._listeners(topic);
            var index = this._indexOfSub(subs, callback, context);
            if (index < 0) {
                subs.push({
                    cb: callback,
                    context: context
                });
                index = subs.length - 1;
            }

            var that = this;
            return {
                dispose: function() {
                    that.removeListener(topic, callback, context);
                }
            };
        },

        /**
         * Register a callback that will be removed after
         * its first notification
         */
        once: function(topic, callback, context) {
            var holder = {
                sub: null
            };
            holder.sub = this.on(topic, function() {
                holder.sub.dispose();
                if(callback && typeof callback.apply !== 'undefined') {
                    callback.apply(context, arguments);
                }
            });

            return holder.sub;
        },

        /**
         * remove a listener.  If the listener was registerd
         * with a context, a context must be provided for its removal.
         */
        removeListener: function(topic, callback, context) {
            var subs = this._listeners(topic);

            var index = this._indexOfSub(subs, callback, context);

            if (0 <= index) {
                subs.splice(index, 1);
            }

            if (subs.length === 0) {
                delete this._events[topic];
            }
        },

		off: function(topic, callback, context) {
			this.removeListener(topic, callback, context);
		},
		
		/**
         * get the number of listeners
         * @returns {Number} number
         */
        getNumListeners: function(topic) {

            var numListeners = 0;

            if (this._events && this._events[topic]) {
                numListeners = this._events[topic].length;
            }

            return numListeners;
        },
		
        removeAllListeners: function() {
            this._events = null;
        }
    };

    return EventEmitter;
});

//try {
//if (exports) {
//exports.EventBus = EventBus;
//}} catch (e) {}