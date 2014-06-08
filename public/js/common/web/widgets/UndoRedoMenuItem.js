define(function() {
	"use strict";

	function UndoRedoMenuItem(options) {
		this.$el = $('<li><a>' + options.title + '<span class="label pull-right">' + options.hotkey + '</span></a>' + '</li>');

		this.options = options;
		this.$el.click(this._perform.bind(this));

		this._sub = options.undoHistory.on("updated", this._listUpdated, this);
	}

	UndoRedoMenuItem.prototype = {
		render: function() {
			return this;
		},

		_listUpdated: function() {
			var label,
				name = this.options.undoHistory[this.options.action + 'Name']();
			if (name) {
				label = this.$el.find('.label');
				label.html(name);
				label.removeClass('hide');
			} else {
				label = this.$el.find('.label');
				label.addClass('hide');
			}
		},

		dispose: function() {
			this._sub.dispose();
		},

		_perform: function(e) {
			this.options.handler();
		}
	};

	return UndoRedoMenuItem;
});
