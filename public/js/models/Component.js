define(["underscore", "./SpatialObject"], function(_, SpatialObject) {
    "use strict";
    var defaults = { x: config.slide.size.width / 4, y: config.slide.size.height / 4 };

    /**
     * Base class for all slide elements.
     *
     * @class Component
     * @augments SpatialObject
     */
    return SpatialObject.extend({
        /**
         * Initialize component model.
         * @returns {Object}
         */
        initialize: function() {
            SpatialObject.prototype.initialize.apply(this, arguments);
            _.defaults(this.attributes, defaults);
            if (this.attributes.scale === undefined) {
                this.attributes.scale = {};
            }
        },

        constructor: function() {
            SpatialObject.prototype.constructor.apply(this, arguments);
        }
    });
});
