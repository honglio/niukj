define(["backbone",
    "common/Math2"
], function(Backbone, Math2) {

    return Backbone.Model.extend({
        initialize: function() {
            Backbone.Model.prototype.initialize.apply(this, arguments);
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

        dispose: function() {
            Backbone.Model.prototype.destroy.apply(this, arguments);
        },

        constructor: function TextBox() {
            Backbone.Model.prototype.constructor.apply(this, arguments);
        }
    });
});
