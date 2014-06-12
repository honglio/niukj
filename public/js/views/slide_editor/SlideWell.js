define(["jquery", "underscore",
    "CustomView",
    "../slide_snapshot/SlideSnapshot",
    "./WellContextBox",
    "common/web/interactions/Sortable",
    "css!styles/app/slide_editor/slideWell.css"
], function($, _, CustomView, SlideSnapshot, WellContextBox, Sortable, css) {
    "use strict";

    return CustomView.extend({
        className: 'slideWell hidden-phone',

        events: {
            mousedown: '_focus',
            destroyed: 'remove'
        },

        initialize: function() {
            this._deck = this.model.deck();
            this._deck.on("slideAdded", this._slideAdded, this);
            // this._deck.on("slideMoved", this._slideMoved, this);
			this._deck.get('slides').on("reset", this._slidesReset, this);

            // update ContextBox'slide index when slide change or reset;
			this._deck.get('slides').on("reset", this.setSlideIndex, this);
			this._deck.get('slides').on("change", this.setSlideIndex, this);

            this._contextBox = new WellContextBox({model: this.model});
            this._contextBox.render();
            this.$slides = $('<div class="scrollbar">');
            this.$slides.on('click', '.slideSnapshot', this._clicked);

            this._sortable = new Sortable({
                container: this.$slides,
                selector: '> .slideSnapshot',
                scrollParent: this.$el[0]
            });

            this._sortable.on("sortstop", this._sortStopped, this);

            this._clipboard = this.model.clipboard;

            // size setting
			// this._calculateLayout = this._calculateLayout.bind(this);
   //          var lazyLayout = _.debounce(this._calculateLayout, 300);
   //          $(window).resize(lazyLayout);
        },

        __matrixToArray: function(matrix) {
            if (matrix) {
                return matrix.substr(7, matrix.length - 8).split(', ');
            }
        },

        _calculateLayout: function() {
            var scale = this.__matrixToArray($('.slideContainer').css(window.browserPrefix + 'transform'));
            var height = config.slide.size.height;
            if (scale) {
                height *= scale[3];
            }
            this.$el.css('height', height);
        },
        /**
         * Event: mouse down.
         *
         * @param {jQuery.Event} e
         * @private
         */
        _focus: function() {
			console.log('_focus');
            this.model.set('scope', 'slideWell');
        },


		__isFocused: function() {
			return this.model.get('scope') === 'slideWell';
		},

		/**
		 * Event: user has clicked one of the slide snapshots.
		 *
		 * Clicking a slide forces that one to become the active
		 * slide.
		 *
		 * @param {jQuery.Event} e
		 * @private
		 */
		_clicked: function() {
			console.log('_clicked');
			$( this ).trigger("select", { active: true });
		},

        /**
         * React on Cut shortcut, the next item will set active
         * @private
         */
        _cut: function() {
            if (this.__isFocused()) {
                var slide = this._deck.get('activeSlide');
                this._deck.remove(slide);
                this._clipboard.item = slide.clone();
                slide.dispose();
            }
        },

        /**
         * React on Delete shortcut, the next item will set active
         * @private
         */
        _delete: function() {
            if (this.__isFocused()) {
                var slide = this._deck.get('activeSlide');
                this._deck.remove(slide);
                slide.dispose();
            }
        },

        /**
         * React on Copy shortcut.
         * @private
         */
        _copy: function() {
            if (this.__isFocused()) {
                var slide = this._deck.get('activeSlide');
                this._clipboard.item = slide;
            }
        },

        /**
         * React on Paste shortcut, add the item before the active item.
         * @private
         */
        _paste: function() {
            var item = this._clipboard.item;
            if (item && item.type === 'slide') {
				var slide = this._deck.get('activeSlide');
                this._deck.add(item.clone(), slide.get('index'));
            }
        },

        _sortStopped: function(startIndex, endIndex) {
            this._deck.moveSlide(startIndex, endIndex);
        },

		setSlideIndex: function(){
			console.log('setSlideIndex');
			console.log(this._deck.get('slides').models.length);
			this._contextBox.slideIndex(this._deck.get('slides').models.length);
		},

        /**
         * Refresh slide snapshots on slides reset.
         *
         * @param {Slide[]} newSlides
         * @private
         */
        _slidesReset: function(newSlides) {
			console.log('_slidesReset');
			console.log(newSlides);
            var i = 0;
            var opts = {at: 0};
            newSlides.forEach(function(slide) {
                opts.at = i;
                this._slideAdded(slide, opts);
                i += 1;
            }, this);
        },

        /**
         * Create a slide snapshot for the new slide.
         *
         * @param {Slide} slide
         * @param {{at: number}} [options]
         * @private
         */
        _slideAdded: function(slide, options) {
			options = options || {};
			console.log(options);
            var index = options.at;
			console.log(index);
            // Append it in the correct position in the well
            var snapshot = new SlideSnapshot({model: slide, deck: this._deck});
            this.$slides.append(snapshot.render().$el);
        },
        /**
         * Move slide snapshot to a new position.
         *
         * @param {Slide} slide
         * @param {number} destination
         * @private
         */
        _slideMoved: function(slide, destination) {
            if (this._initiatedMove) {return;}
            // How expensive is this for very large decks?
            this.$slides.empty();
            this._slidesReset(this._deck.get('slides').models);
        },
        /**
         * Render slide well.
         * @returns {*}
         */
        render: function() {
            this.$slides.empty();
            this.$el.html(this.$slides);

            this._deck.get('slides').forEach(function(slide) {
                console.log(this._deck);
                var snapshot = new SlideSnapshot({model: slide, deck: this._deck});
                this.$slides.append(snapshot.render().$el);
            }, this);

            this.$el.append(this._contextBox.$el);

            this._calculateLayout();

            return this;
        },

        /**
         * Dispose slide well.
         */
        dispose: function() {
            this._contextBox.dispose();
            this._sortable.dispose();
			// TODO: snapshot view dispose.
			Backbone.View.prototype.dispose.call(this);
        }
    });
});