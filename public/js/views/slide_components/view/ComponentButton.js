define(["CustomView"
], function(CustomView) {
	"use strict";
	return CustomView.extend({
		className: 'btn btn-primary btn-icon icon-left hidden-print',
		tagName: 'a',

		events: {
			click: '_clicked',
            destroyed: 'remove'
		},

		initialize: function() {
						console.log(this.options.componentType);
            this.$el.attr('data-compType', this.options.componentType);
		},

		_clicked: function() {
			this.model.addComponent(this.options.componentType);
		},

		render: function() {
			this.$el.html('<i class="' + this.options.icon + '"></i> <strong>' + this.options.name + '</strong>');
			return this;
		},
	});
});
