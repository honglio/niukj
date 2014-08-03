define(["CustomView"],
function(CustomView) {
	"use strict";
    return CustomView.extend({
        className: 'btn btn-primary dropdown-toggle',
        tagName: 'a',
        id: 'themeProvider',
        events: {
            destroyed: 'remove'
        },
        attributes: {
            'data-toggle': "dropdown",
            'data-target': "#dropdown-menu"
        },

        render: function() {
            this.$el.html('<i class="icon-gear"></i><strong>背景</strong>');
            return this;
        }
    });
});
