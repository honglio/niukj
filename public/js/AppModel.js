define(["backbone",
    "cloudslide/deck/Deck",
    "cloudslide/slide_components/ComponentFactory",
    "common/web/interactions/Clipboard",
    "common/web/undo_support/UndoHistoryFactory",
    "storage/StorageInterface"
], function(Backbone, Deck, ComponentFactory,
    Clipboard, UndoHistoryFactory, StorageInterface) {
    "use strict";

    return Backbone.Model.extend({
        initialize: function() {
            this._deck = new Deck(); // TODO: or storageInterface.load(id)

            this.clipboard = new Clipboard();

            var storageInterface = new StorageInterface();

            var self = this;

            // TODO: get the id from Backbone.history.location.href
            // or window.location.href
            console.log(Backbone.history.location.href);
            // Backbone.history.location.search
            var id = Backbone.history.location.href;

            if(id == null) {
                appModel.addSlide(0);
            } else {
                storageInterface.load(id, function(deck, err) {
                    if(err) {
                        console.log(err.stack);
                        return;
                    }
                    if (deck) {
                        self.importPresentation(deck);
                    }
                });
            }

            this._undoHistory = UndoHistoryFactory.managedInstance('editor');
        },

        importPresentation: function(rawObj) {
            this._deck.import(rawObj);
        },

        exportPresentation: function(filename) {
            if (filename) {
                this._deck.set('fileName', filename);
            }
            return this._deck.toJSON(false, true);
        },

        fileName: function(fname) {
            if (fname === null || fname === undefined) {
				return this._deck.get('fileName');
            } else {
                this._deck.set('fileName', fname);
			}
        },

        deck: function() {
            return this._deck;
        },

        slides: function() {
            return this._deck.get('slides');
        },

        addSlide: function(index) {
            this._deck.create(index);
        },

        activeSlide: function() {
            return this._deck.get('activeSlide');
        },

        activeSlideIndex: function() {
            return this._deck.get('slides').indexOf(this._deck.get('activeSlide'));
        },

        addComponent: function(type) {
            var slide = this._deck.get('activeSlide');
            if (slide) {
                var comp = ComponentFactory.instance.createModel(type);
                slide.add(comp);
            }
        }
    });
});
