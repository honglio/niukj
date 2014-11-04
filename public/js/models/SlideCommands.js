define(["./Slide"], function(Slide) {
    "use strict";

    /**
     * @class SlideCommands.Paste
     * @param {Deck} deck
     * @param {Slide} slide
     * @param {number} [index]
     * @constructor
     */
    var Add = function(deck, slide, index) {
        this.deck = deck;
        this.selected = this.deck.selected;
        this.activeSlide = this.deck.get('activeSlide');
        this.slide = slide || new Slide();
        this.index = index;
    };

    Add.prototype = {
        name: 'Add Slide',

        "do": function() {
            this.deck._doAdd(this.slide, {
                preserveIndexes: false,
                at: this.index
            });
        },

        undo: function() {
            this.deck._doRemove(this.slide);
        }
    };

    /**
     * @class SlideCommands.Remove
     */
    var Remove = function(deck, slide) {
        this.deck = deck;
        this.slide = slide;
    };

    Remove.prototype = {
        name: "Remove Slide",

        "do": function() {
            this.deck._doRemove(this.slide);
        },

        undo: function() {
            this.deck._doAdd(this.slide, {
                preserveIndexes: true
            });
        }
    };

    /**
     * @class SlideCommands.Move
     * @param startIndex
     * @param slide
     */
    var Move = function(deck, slide, destination) {
        this.deck = deck;
        this.slide = slide;
        this.destination = destination;
        this.selected = this.deck.selected;
        this.activeSlide = this.deck.get('activeSlide');
    };
    Move.prototype = {
        "do": function() {
            var slides = this.deck.get('slides');
            this.initSlidesOrder = slides.models.slice(0);

            slides.remove(this.slide, {
                silent: true
            });
            slides.add(this.slide, {
                silent: true,
                at: this.destination
            });
            slides.sortPosition();

            this.deck.trigger("slideMoved");
        },
        undo: function() {
            var slides = this.deck.get('slides');
            slides.models = this.initSlidesOrder;
            slides.sortPosition();

            this.deck.trigger("slideMoved");
        },
        name: "Move Slide"
    };

    return {
        Add: Add,
        Remove: Remove,
        Move: Move
    };
});
