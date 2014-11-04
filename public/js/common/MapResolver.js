/**
 * @fileOverview Utilties to resolve key strings to values
 * in a map.
 */
define(function() {
    "use strict";
    var MapResolver = {
        /**
         * @param {object | array} [map] The map on which to resolve
         * @param {string | number | array} [key] The key used to retrieve from
         *  the map.  If the key is an array, each element in the
         *  array is used to descend deeper into the map.
         */
        getItem: function(map, key) {
            var keyType = typeof key;
            if (keyType === 'string' || keyType === 'number') {
                return map[key];
            }

            //if (keyType === 'object' && !(keyType instanceof Array))
            //throw 'Object keys currently not supported';

            var subMap = map;
            for (var i = 0; i < key.length; i += 1) {
                var subKey = key[i];
                subMap = subMap[subKey];
                if (subMap === null || subMap === undefined) {
                    return null;
                }
            }

            // really the subEntry at this point
            return subMap;
        },

        setItem: function(map, key, value) {
            var keyType = typeof key;
            if (keyType === 'string' || keyType === 'number') {
                map[key] = value;
                return map[key];
            }

            var subMap = map;
            for (var i = 0; i < key.length - 1; i += 1) {
                var subKey = key[i];
                var temp = subMap[subKey];
                if (temp === null || temp === undefined) {
                    temp = {};
                    subMap[subKey] = temp;
                }

                subMap = temp;
            }

            var finalKey = key[key.length - 1];
            subMap[finalKey] = value;
        }
    };

    return MapResolver;
});
