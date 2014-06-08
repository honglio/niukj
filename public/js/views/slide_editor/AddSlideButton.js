define(["CustomView"],
function(CustomView) {
    "use strict";
    return CustomView.extend({
        className: 'addBtn btn btn-warning',
        events: {
            click: '_addSlide',
            destroyed: 'remove'
        },

		initialize: function() {
			this.render();
		},

        render: function() {
            this.$el.html('<center><i class="icon-plus icon-white"></i></center>');
            return this;
        },

        _addSlide: function() {
            this._editorModel.addSlide(this._wellContextBox.slideIndex());
        },

        constructor: function AddSlideButton(editorModel, wellContextBox) {
            Backbone.View.prototype.constructor.call(this);
            this._editorModel = editorModel;
            this._wellContextBox = wellContextBox;
        }
    });
});
