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

            this.$el.append(new BackgroundProvider(this.model).view().render().$el);

            return this;
        }
    });
});
