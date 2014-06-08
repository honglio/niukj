define(["CustomView"
], function(CustomView) {
	"use strict";
	return CustomView.extend({
		className: 'btn',
		tagName: 'a',

		events: {
			click: '_clicked',
            destroyed: 'remove'
		},

		initialize: function() {
            this.$el.attr('data-compType', this.options.componentType);
		},

		_clicked: function() {
			this.options.editorModel.addComponent(this.options.componentType);
		},

		render: function() {
			this.$el.html('<i class="' + this.options.icon + '"></i> <strong>' + this.options.name + '</strong>');
			return this;
		},

		constructor: function() {
			Backbone.View.prototype.constructor.apply(this, arguments);
		}
	});
});
