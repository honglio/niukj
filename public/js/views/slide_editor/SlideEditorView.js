define(["CustomView",
    "./SlideWell",
    "./OperatingTable"
], function(CustomView, SlideWell, OperatingTable) {
    "use strict";
    return CustomView.extend({
        className: 'slideEditor row-fluid',

        events: {
            destroyed: 'remove'
        },

        initialize: function() {
            this._well = new SlideWell({model: this.model});
            this._opTable = new OperatingTable({model: this.model});
        },

        render: function() {
            // Warning: must append in order!
            this.$el.append(this._well.render().$el);
            this.$el.append(this._opTable.render().$el);
            return this;
        },

        dispose: function() {
            this._well.dispose();
            this._opTable.dispose();
            Backbone.View.prototype.dispose.call(this);
        }
    });
});
