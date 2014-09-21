define(["underscore",
        "backbone",
        "jquery",
        "css!styles/app/widgets/widgets.css"
], function(_, Backbone, $) {
	"use strict";
	function Dropdown(model, template) {
		this.$el = $('<ul class="dropdown-menu" role="menu">');
		this._template = template;

		var self = this;
		this.$el.on("destroy", function() {
			self.dispose();
		});

		this._model = model;
		if (model.on) {
			model.on("change", this._render, this);
		}

		this._over = this._over.bind(this);
		this._selected = this._selected.bind(this);
		this._out = this._out.bind(this);

		this.$el.on("mouseover", 'li > a', this._over);
		this.$el.on("click", 'li > a', this._selected);
		this.$el.on("mouseout", this._out);
	}

	Dropdown.prototype = {
		render: function() {
			var data;
			if (this._model.attributes) {
				data = this._model.attributes;
			} else {
				data = this._model;
			}

			this.$el.html(this._template(data));

			return this;
		},

		_over: function(e) {
			this.trigger("over", e);
		},

		_out: function(e) {
			this.trigger("out", e);
		},

		_selected: function(e) {
			this.trigger("selected", e);
		},

		dispose: function() {
			if (this._model.off) {
				this._model.off(null, null, this);
			}
			this.off();
		}
	};

	_.extend(Dropdown.prototype, Backbone.Events);

	return Dropdown;
});
