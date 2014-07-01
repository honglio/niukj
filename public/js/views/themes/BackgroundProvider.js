define(["./AvailableBackgrounds",
		"common/web/widgets/Dropdown",
		"hbs!templates/BackgroundChooser"
], function(Backgrounds, View, BackgroundChooser) {
	"use strict";
	function BackgroundProvider(editorModel) {
		this._view = new View(Backgrounds, BackgroundChooser);
		this._editorModel = editorModel;

		this._view.on("over", this._previewBackground, this);
		this._view.on("out", this._restoreBackground, this);
		this._view.on("selected", this._setBackground, this);
		// Bind to selection events fired from view
	}

	BackgroundProvider.prototype = {
		view: function() {
			return this._view;
		},

		_previewBackground: function(e) {
			var $slideContainer = $('.slideContainer');
			var target = (e.srcElement) ? e.srcElement : e.currentTarget;
			var className = target.dataset['class'] ? target.dataset['class'] : target.className;
			this._swapBg($slideContainer, className);
		},

		_setBackground: function(e) {
			var target = (e.srcElement) ? e.srcElement : e.currentTarget;
			var className = target.dataset['class'] ? target.dataset['class'] : target.className;
			this._editorModel.activeSlide().set('background', className || 'defaultbg');
		},

		_restoreBackground: function(e) {
			var bg = this._editorModel.activeSlide().get('background');
			var $slideContainer = $('.slideContainer');
			this._swapBg($slideContainer, bg || 'defaultbg');
		},

		_swapBg: function($el, newBg) {
			$el.removeClass($el.data('background'));
			$el.addClass(newBg);
			$el.data('background', newBg);
		},

		dispose: function() {
			this._view.dispose();
		}
	};

	return BackgroundProvider;
});
