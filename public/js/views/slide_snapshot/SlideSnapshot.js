define(["underscore",
    "jquery",
    "CustomView",
    "./SlideDrawer",
    "./Slide2Image",
    "hbs!templates/SlideSnapshot",
    "css!styles/app/slide_snapshot/slideSnapshot.css"
], function(_, $, CustomView, SlideDrawer, Slide2Image, SlideSnapshotTemplate, css) {
    "use strict";

    return CustomView.extend({
        className: 'slideSnapshot',
        events: {
            select: '_selected',
            "click .remove-icon": '_removeClicked',
            "mousedown .remove-icon": '_removePressed'
        },

        initialize: function() {
            this.model.on("change:active", this._activeChanged, this);
            this.model.on("contentsChanged", this.render, this);
            this.model.on("change:background", this.render, this);
        },

        /**
         * Event: element selection is being changed by user.
         *
         * @param {jQuery.Event} e
         * @param {{selected: boolean, active: boolean}} [options] Whether or not element should be selected and active.
         * @private
         */
        _selected: function() {
            this.model.set('active', true);
        },

        isSelected: function() {
            return this.model.get('active');
        },

        /**
         * Event: user has clicked X button.
         *
         * @param {jQuery.Event} e
         * @private
         */
        _removeClicked: function(e) {
            e.stopPropagation();
            this.dispose(this.model);
        },

        /**
         * Event: user has pressed X button, but not released.
         *
         * @param {jQuery.Event} e
         * @private
         */
        _removePressed: function(e) {
            e.stopPropagation();
        },

        /**
         * Remove slide from the deck.
         *
         * @param {boolean} removeModel
         */
        dispose: function(removeModel) {
            if (removeModel) {
                this.options.deck.remove(this.model);
            }

            this._slideDrawer.dispose();

            this.model.off(null, null, this);
            this.options.deck.off(null, null, this);
            CustomView.prototype.remove.apply(this, arguments);
        },

        /**
         * React on slide model's "active" attribute change.
         *
         * @param {Slide} model
         * @param {boolean} value
         * @private
         */
        _activeChanged: function(model, value) {
            if (value) {
                this.$el.addClass('active');
            } else {
                this.$el.removeClass('active');
            }
        },

        _bgChanged: function() {
            var bg = this.model.get('background') || 'defaultbg';
            // this.$el.removeClass();
            // var classStr = 'slideSnapshot ' + bg;
            // this.$el.addClass(classStr);
            if (bg === 'grad-bg-pink') {
                this.$el.css('background-color', '#E53D5E');
            }
            if (bg === 'grad-bg-orange') {
                this.$el.css('background-color', '#EEA523');
            }
            if (bg === 'grad-bg-yellow') {
                this.$el.css('background-color', '#FBC850');
            }
            if (bg === 'grad-bg-grass') {
                this.$el.css('background-color', '#95CA58');
            }
            if (bg === 'grad-bg-green') {
                this.$el.css('background-color', '#23AD5E');
            }
            if (bg === 'grad-bg-sky') {
                this.$el.css('background-color', '#7394CC');
            }
            if (bg === 'grad-bg-lavender') {
                this.$el.css('background-color', '#7E6AAD');
            }
            if (bg === 'grad-bg-purple') {
                this.$el.css('background-color', '#8E336C');
            }
            if (bg === 'grad-bg-black') {
                this.$el.css('background-color', '#000');
            }
            if (bg === 'grad-bg-light') {
                this.$el.css('background-color', '#fff');
            }
            if (bg === 'defaultbg') {
                this.$el.css('background-color', '#ddd');
            }
        },

        _calculateLayout: function() {
            var width = this.$el.width();
            var height = width / 1.6;
            this.$el.css('height', height);
        },

        render: function() {

            if (this._slideDrawer) {
                this._slideDrawer.dispose();
            }

            this.$el.html(SlideSnapshotTemplate(this.model.attributes));

            this._bgChanged();

            if (this.isSelected() === true) {
                this.$el.addClass('active');
            }

            // draw snapshot
            var canvas = this.$el.find('canvas');
            var g2d = canvas[0].getContext("2d");
            var bg = this.$el.css('background-color');

            this._slideDrawer = new SlideDrawer(this.model, g2d, bg);
            this._slideDrawer.paint();

            // update picture
            if (this.isSelected() && this.model.get('index') === '0') {
                var img = this._toImage(this.$el.find('canvas')[0]);
                this.options.deck.set('picture', img.src);
            }

            return this;
        },

        _toImage: function(oCanvas) {
            return Slide2Image.saveAsPNG(oCanvas, true, 300, 250);
        }
    });
});
