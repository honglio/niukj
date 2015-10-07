define(["underscore",
    "jquery",
    "CustomView",
    "./SlideDrawer",
    "./Slide2Image",
    "hbs!templates/SlideSnapshot",
    "css!styles/app/slide_snapshot/slideSnapshot.css"
], function(_, $, CustomView, SlideDrawer, Slide2Image, SlideSnapshotTemplate, css) {


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
            this.model.on("change:theme", this.render, this);
            this.model.on("saveBtnClicked", this.genCoverPic, this);
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

            if (bg.indexOf('img:') === -1) {
                switch (bg) {
                    case 'grad-bg-pink':
                        this.$el.css('background-color', '#E53D5E');
                        break;
                    case 'grad-bg-orange':
                        this.$el.css('background-color', '#EEA523');
                        break;
                    case 'grad-bg-yellow':
                        this.$el.css('background-color', '#FBC850');
                        break;
                    case 'grad-bg-grass':
                        this.$el.css('background-color', '#95CA58');
                        break;
                    case 'grad-bg-green':
                        this.$el.css('background-color', '#23AD5E');
                        break;
                    case 'grad-bg-sky':
                        this.$el.css('background-color', '#7394CC');
                        break;
                    case 'grad-bg-lavender':
                        this.$el.css('background-color', '#7E6AAD');
                        break;
                    case 'grad-bg-purple':
                        this.$el.css('background-color', '#8E336C');
                        break;
                    case 'grad-bg-black':
                        this.$el.css('background-color', '#000');
                        break;
                    case 'grad-bg-light':
                        this.$el.css('background-color', '#fff');
                        break;
                    case 'defaultbg':
                        this.$el.css('background-color', '#ddd');
                        break;
                }
            } else {
                this.imgbg = true;
            }
        },

        _calculateLayout: function() {
            var width = this.$el.width();
            var height = width / 1.6;
            this.$el.css('height', height);
        },

        render: function() {
            // console.log(this);
            if (this._slideDrawer) {
                this._slideDrawer.dispose();
            }

            this.$el.html(SlideSnapshotTemplate(this.model.attributes));

            this._bgChanged();

            if (this.isSelected()) {
                this.$el.addClass('active');
            }

            // draw snapshot
            var canvas = this.$el.find('canvas');
            var g2d = canvas[0].getContext("2d");
            var bg = this.imgbg ? this.model.get('background') : this.$el.css('background-color');
            var theme = this.model.get('theme') || '';

            this._slideDrawer = new SlideDrawer(this.model, g2d, bg, theme);
            this._slideDrawer.paint();

            return this;
        },

        // update slide cover picture
        genCoverPic: function() {
            // Only generate when focus on the first slide
            // if (this.isSelected() && this.model.get('index') === '0') {
            var self = this;
            var canvas = this.$el.find('canvas')[0];
            var id = this.options.deck.id || _.random(0, 100000);
            this._toImage(canvas, id, function(img) {
                self.options.deck.set('picture', img);
            });

        },

        _toImage: function(oCanvas, deckId, cb) {
            // true: save img to db. false: save img to aliyun-oss
            return Slide2Image.saveAsPNG(oCanvas, false, 300, 195, deckId, cb);
        }
    });
});
