/**
 * @module model.presentation
 */
define(["underscore",
    "backbone",
    "./SlideCollection",
    "./SlideCommands",
    "common/web/undo_support/UndoHistoryFactory",
    "./Slide",
], function (_, Backbone, SlideCollection, SlideCommands, UndoHistoryFactory, Slide) {
    "use strict";
    var slideConfig = window.config.slide;
    /**
        This represents a slide deck.  It has a title, a currently active
        slide, a collection of slides, the filename on "disk" and
        the overarching presentation background color.
        @class model.Deck
        */
    var undoHistory = UndoHistoryFactory.managedInstance('editor');
    return Backbone.Model.extend({

        initialize: function () {
            console.log("initialize");
            this.set('slides', new SlideCollection());
            var allSlides = this.get('slides');
            allSlides.on("add", this._slideAdded, this);
            allSlides.on("remove", this._slideRemoved, this);
            this.set('background', 'defaultbg');
            this.set('width', slideConfig.size.width);
            this.set('height', slideConfig.size.height);

            this.selected = undefined; // last selected slide
        },
        /**
         * Set an attribute of the Deck.
         *
         * @param {string} key
         * @param {*} value
         * @param {Object} [options]
         * @returns {*}
         */
        set: function(key, value, options) {
			console.log(value);
            if (key === 'activeSlide') {
                this._activeSlideChanging(value, options);
            }
            Backbone.Model.prototype.set.apply(this, arguments);
        },

        /*
         * Method to import an existing presentation into this deck.
         *
         * @method import
         * @param {Object} rawObj the "json" representation of a deck
         * @return the newly-set slides
         */

        "import": function (rawObj) {
            var allSlides = this.get('slides');
            var activeSlide = this.get('activeSlide');

            if (activeSlide !== undefined && activeSlide !== null) {
                activeSlide.unselectComponents();
            }

			allSlides.reset(rawObj.get('slides'));

			console.log(allSlides);

			allSlides.models.forEach(function(model) {
				this._registerWithSlide(model);
				if(model.get('active') === true) {
					activeSlide = model;
				}
			}, this);

            this.set('activeSlide', activeSlide);
            this.set('background', rawObj.get('background'));
            this.set('fileName', rawObj.get('fileName'));
			this.set('id', rawObj.id);
			// TODO : this.set('version', rawObj.version);
            undoHistory.clear();

            // TODO: go through and dispose of all old slides...?


        },

        /**
         * React on slide being added.
         *
         * @param {Slide} slide
         * @param {SlideCollection} collection
         * @param {{at: number}} [options]
         * @private
         */
        _slideAdded: function (slide, collection, options) {
            options = options || {};
            options.at = _.isNumber(options.at) ? options.at : collection.length;
            this.set('activeSlide', slide, options);
            this.trigger("slideAdded", slide, options);
            this._registerWithSlide(slide);
        },
        /**
         * React on slide being disposed.
         *
         * @param {Slide} slide
         * @private
         */
        _slideDisposed: function (slide) {
            slide.off(null, null, this);
        },
        /**
         * React on slide being removed.
         *
         * @param {Slide} slide
         * @param {SlideCollection} collection
         * @param {{index: number}} [options]
         * @private
         */
        _slideRemoved: function (slide, collection, options) {
            options = options || {};
			// resolve activeSlide before dispose the slide
			console.log(options);
            if (this.get('activeSlide') === slide) {
                if (options.index < collection.length) {
                    this.set('activeSlide', collection.at(options.index));
                } else if (options.index > 0) {
                    this.set('activeSlide', collection.at(options.index - 1));
                } else {
                    this.set('activeSlide', undefined);
                }
            }
            slide.dispose();
        },
        /**
         * React on slide being set to active.
         *
         * @param {Slide} slide
         * @param {boolean} value
         * @param {Object} [options]
         * @private
         */
        _slideActivate: function(slide, value, options) {
            if (value) {
                this.set('activeSlide', slide, options);
            }
        },

        /**
         * React on slide selection change.
         *
         * @param {Slide} slide
         * @param {boolean} value
         * @private
         */
        _selectionChanged: function(slide, value, options) {
			if (value) {
				this.selected = this.get('activeSlide');
			}
        },

        /**
         * Register callbacks on slide events.
         *
         * @param {Slide} slide
         * @private
         */
        _registerWithSlide: function(slide) {
            slide.on("change:active", this._slideActivate, this);
            slide.on("change:selected", this._selectionChanged, this);
            // slide.on("dispose", this._slideDisposed, this);
        },
        /**
         * Creates a new slide. The newly created slide is set as the active
         * slide in the deck.
         *
         * @param index If not taken, slide will be added at given index.
         * otherwise, it will be added as the last index in the deck.
         * if the index is unnessessery large, reduce the index to rational value.
         */
        create: function (index) {
            undoHistory.pushdo(new SlideCommands.Add(this, null, index));
        },

        add: function (slide, index) {
            undoHistory.pushdo(new SlideCommands.Add(this, slide, index));
        },

        /**
         * Callback for slide addition command.
         * @see SlideCommands.Add
         *
         * @param {Slide} slide
         * @param {Object} options
         * @private
         */
        _doAdd: function(slide, options) {
            var allSlides = this.get('slides');
            slide = slide || new Slide();
            options = options || {};

            var lastSelectedSlideIndex;
            if (!options.preserveIndexes && this.selected) {
                lastSelectedSlideIndex = allSlides.indexOf(this.selected);
            }

            // console.log(options.at);
            options.at = _.isNumber(options.at) ? options.at : (options.preserveIndexes ? slide.get('index') : lastSelectedSlideIndex + 1) || 0;
            // console.log(options.at);

            allSlides.add(slide, options);
        },
        /**
         * Removes the specified slide from the deck
         * @method remove
         * @param {model.Slide} [slide] the slide to remove.
         *
         */
        remove: function (slide) {
            undoHistory.pushdo(new SlideCommands.Remove(this, slide));
        },
        /**
         * Callback for slide removal command.
         * @see SlideCommands.Remove
         *
         * @param {Slide} slides
         * @param {Object} options
         * @private
         */
        _doRemove: function(slide, options) {
            var allSlides = this.get('slides');
            allSlides.remove(slide, options);
            console.log(slide);
            if(slide.dispose) {
                slide.dispose();
            }
        },
        /**
         * Move slide at a given index to a new index.
         *
         * @param {Slide} slides
         * @param {number} destination
         */
        moveSlide: function(sourceIndex, destIndex) {
            if (sourceIndex === destIndex) { return; }
            var slides = this.get('slides');
            var slide = slides.at(sourceIndex);
            undoHistory.pushdo(new SlideCommands.Move(this, slide, destIndex));
        },
        /**
         * React on change of an active slide.
         *
         * @param {Slide} newActive
         * @param {Object} [options]
         * @private
         */
        _activeSlideChanging: function(newActive, options) {
			console.log('_activeSlideChanging');
            var lastActive = this.get('activeSlide');
            if (newActive === lastActive) {
				console.log('newActive === lastActive');
                return;
            }
			if (this.selected) {
				console.log('this.selected');
				this.selected.set({
					active: false,
                    selected: false
				});
			}
            if (lastActive) {
				console.log('lastActive');
                lastActive.unselectComponents();
                lastActive.set({
                    active: false, // the active slide
                    selected: true // the last active slide
                }, options);
            }
            if (newActive) {
				console.log('newActive');
                newActive.set({
					active: true,
                    selected: false
                }, options);
            }
        },
    });
});
