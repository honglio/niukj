define(["CustomView", "../themes/BackgroundProvider"],
function(CustomView, BackgroundProvider) {
	"use strict";
    return CustomView.extend({
        className: 'themeProviders',
        events: {
            destroyed: 'remove'
        },

        render: function() {
            this.$el.empty();

            this.$el.append(new BackgroundProvider(this._editorModel).view().render().$el);

            return this;
        },

        constructor: function ThemeProviderView(editorModel) {
            this._editorModel = editorModel;
            Backbone.View.prototype.constructor.call(this, editorModel);
        }
    });
});
