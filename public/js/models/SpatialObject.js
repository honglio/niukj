define(["backbone",
        "common/Math2"
], function(Backbone, Math2) {
    "use strict";
    return Backbone.Model.extend({
        initialize: function() {
        },

        setInt: function(name, value) {
            if (typeof value === "string") {
                try {
                    value = parseInt(value, 10);
                } catch (e) {
                    return;
                }
            }
            this.set(name, Math.round(value));
        },

        setFloat: function(name, value, dec) {
            if (typeof value === "string") {
                try {
                    value = parseFloat(value);
                } catch (e) {
                    return;
                }
            }

            value = Math2.round(value, dec || 2);
            this.set(name, value);
        },

        constructor: function SpatialObject() {
            Backbone.Model.prototype.constructor.apply(this, arguments);
        }
    });
});
