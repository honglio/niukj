define(["CustomView",
    "./SlideWell",
    "./OperatingTable",
    "css!styles/app/slide_editor/slideEditor.css"
], function(CustomView, SlideWell, OperatingTable) {

    return CustomView.extend({
        className: 'slideEditor row-fluid',

        initialize: function() {
            this._well = new SlideWell({
                model: this.model
            });
            this._opTable = new OperatingTable({
                model: this.model
            });
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
            CustomView.prototype.dispose.call(this);
        }
    });
});
