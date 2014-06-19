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
            "mouseenter .remove-icon": '_removeSelected',
            "mouseleave .remove-icon": '_removeUnselected',
            "click .remove-icon": '_removeClicked',
            "mousedown .remove-icon": '_removePressed',
            destroyed: 'remove'
        },

        initialize: function() {
            // TODO: single slide background
			// this.model.on("change:background", this._bgChanged, this);
            // this.model.on("dispose", this.dispose, this);

			this.options.deck.on("change:background", this._bgChanged, this);

			// this._calculateLayout = this._calculateLayout.bind(this);
   //          var lazyLayout = _.debounce(this._calculateLayout, 300);
   //          $(window).resize(lazyLayout);

            this.updatePicture = this.updatePicture.bind(this);
            this._repaint = this._repaint.bind(this);

            this.model.on("change:active", this._activeChanged, this);
            // this.model.on("change:active", this.repaint, this);
            // this.model.on("change:active", this.updatePicture, this);

            this.model.on("contentsChanged", this._repaint, this);
            this.model.on("contentsChanged", this.updatePicture, this);

            this.options.deck.on("change:background", this._repaint, this);
            this.options.deck.on("change:background", this.updatePicture, this);
        },

        /**
         * Event: element selection is being changed by user.
         *
         * @param {jQuery.Event} e
         * @param {{selected: boolean, active: boolean}} [options] Whether or not element should be selected and active.
         * @private
         */
        _selected: function(e, options) {
			if (options.active) {
				this.model.set('active', true, options);
			}
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
            this.remove(true);
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

        _removeSelected: function(e) {

        },

        _removeUnselected: function(e) {

        },
        /**
         * Remove slide from the presentation.
         *
         * @param {boolean} removeModel
         */
        remove: function(removeModel) {
            this._slideDrawer.dispose();
            this.$el.data('jsView', null);
            this.model.off(null, null, this);
            this.options.deck.off(null, null, this);
            Backbone.View.prototype.remove.apply(this, arguments);

            if (removeModel) {
                this.options.deck.remove(this.model);
            }
        },

        /**
         * React on slide model's "active" attribute change.
         *
         * @param {Slide} model
         * @param {boolean} value
         * @private
         */
        _activeChanged: function(model, value) {
			console.log('_activeChanged');
            if (value) {
				console.log('addClass');
                this.$el.addClass('active');
            }
            else {
				console.log('removeClass');
                this.$el.removeClass('active');
            }
        },

        _bgChanged: function() {
            console.log('BGGGG');
            var bg = this.options.deck.get('background') || 'defaultbg';
            this.$el.removeClass();
            var classStr = 'slideSnapshot ' + bg;
            console.log(this.model.get('active'));
            if (this.model.get('active')) {
                classStr += ' active';
            }
            console.log(classStr);

            this.$el.addClass(classStr);
            // this.$el.css('background-image', bg.styles[1]);
        },

        _calculateLayout: function() {
            var width = this.$el.width();
            var height = width / 1.6;
            // console.log('width:' + width);
            // console.log('height:' + height);
            this.$el.css('height', height);
        },

        // repaint: function() {
        //     var self = this;
        //     if(this.isSelected()) {
        //         this.$el.find('canvas')[0].remove();
        //         window.html2canvas($('.slideContainer'), {
        //             onrendered: function(canvas) {
        //                 self.$el.prepend(canvas);
        //             }
        //         });
        //     }
        // },

        render: function() {

            if (this._slideDrawer) {
                this._slideDrawer.dispose();
            }

            this.$el.html(SlideSnapshotTemplate(this.model.attributes));

            this._bgChanged();

            if (this.model.get('active')) {
                this.$el.addClass('active');
            }

            var canvas = this.$el.find('canvas');
            var g2d = canvas[0].getContext("2d");

            this._slideDrawer = new SlideDrawer(this.model, g2d);

            var self = this;
            setTimeout(function() {
                // var bgImg = self.$el.css('background-image');
                // bgImg = bgImg.slice(4, -1);
                self._repaint();
            }, 10);

            return this;
        },

        _repaint: function() {
            var bgImg = this.$el.css('background-color');
            this._slideDrawer.repaint(bgImg);
        },

        updatePicture: function() {
            if(this.isSelected() && this.model.get('index') == "0") {
                console.log('updatePicture');
                var img = this._toImage(this.$el.find('canvas')[0]);
                this.options.deck.set('picture', img.src);
            }
        },

        _toImage: function(oCanvas) {
            return Slide2Image.saveAsPNG(oCanvas, true, 300, 250);
        }
    });
});
