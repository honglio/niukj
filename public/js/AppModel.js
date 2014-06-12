define(["backbone",
    "models/Deck",
    "./views/slide_components/ComponentFactory",
    "common/web/interactions/Clipboard",
    "common/web/undo_support/UndoHistoryFactory",
    "./views/storage/StorageInterface"
], function(Backbone, Deck, ComponentFactory,
    Clipboard, UndoHistoryFactory, StorageInterface) {
    "use strict";

    return Backbone.Model.extend({
        initialize: function() {
            this._deck = new Deck();

            this.clipboard = new Clipboard();

            var storageInterface = new StorageInterface();

            var length = Backbone.history.location.href.length;
            if(length > 34) {
                var id = Backbone.history.location.href.substr(length-29, 24);
            }

            var self = this;
            if(id == null) {
                this.addSlide(0);
            } else {
                console.log(id);
                storageInterface.load(id, function(deck) {
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
            var exportData = this._deck.toJSON();
            exportData.activeSlide = exportData.activeSlide.toJSON();
            // exportData.activeSlide.components.forEach(function (component, i) {
            //     exportData.activeSlide.components[i] = component.toJSON();
            // })
            exportData.slides = exportData.slides.toJSON();

            exportData.slides.forEach(function (slide, i) {
                slide.components.forEach(function (component, j) {
                    exportData.slides[i].components[j] = component.toJSON();
                });
            });
            console.log(exportData.picture);

            return exportData;
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
                var compFactory = new ComponentFactory();
                var comp = compFactory.instance.createModel(type);
                slide.add(comp);
            }
        }
    });
});