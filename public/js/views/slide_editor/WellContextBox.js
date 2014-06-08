define(["CustomView",
    "AddSlideButton",
    "css!styles/slide_editor/wellContextBox.css"
], function(CustomView, AddSlideButton, css) {
    "use strict";

    return Backbone.View.extend({
        className: 'wellContextBox',

        events: {
            destroyed: 'remove'
        },

        initialize: function() {
            this._slideIndex = 0;

            // this._currentPos = -1;
        },

        // reposition: function(newPos) {
        //  if (newPos.y == this._currentPos.y) return;
        //  this.$el.css('top', (newPos.y + 5));
        //  this.$el.css('left', (newPos.x + 95));

        //  this._currentPos = newPos;
        // },

        slideIndex: function(i) {
            if (i == null) {
                return this._slideIndex;
            } else {
                this._slideIndex = i;
            }
        },

        render: function() {
			this.$el.html(new AddSlideButton(this._editorModel, this));
        },

        constructor: function WellContextBox(editorModel) {
            this._editorModel = editorModel;
            Backbone.View.prototype.constructor.call(this);
        }
    });
});
