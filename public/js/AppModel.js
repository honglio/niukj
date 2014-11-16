define(["backbone",
    "models/Deck",
    "models/ComponentCommands",
    "./views/slide_components/ComponentFactory",
    "common/web/interactions/Clipboard",
    "common/web/undo_support/UndoHistoryFactory",
    "./views/storage/StorageInterface"
], function(Backbone, Deck, ComponentCommands, ComponentFactory,
    Clipboard, UndoHistoryFactory, StorageInterface) {


    function cleanHTMLTag(data) {
        if (data) {
            return data.replace(/<[^>]+>/g, '');
        }
    }

    return Backbone.Model.extend({
        initialize: function() {
            this._deck = new Deck();

            this.clipboard = new Clipboard();

            var storageInterface = new StorageInterface();

            var length = Backbone.history.location.href.length;

            var id;
            if (length > 34) {
                id = Backbone.history.location.href.substr(length - 29, 24);
            }

            var self = this;
            if (id == null) {
                this.addSlide(0);
            } else {
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
            exportData.activeSlide = this._deck.get('activeSlide').toJSON();
            this._deck.get('activeSlide').get('components').forEach(function(component, i) {
                var text = cleanHTMLTag(component.get('text'));
                component.set('text', text);
                exportData.activeSlide.components[i] = component.toJSON();
            });

            exportData.slides = this._deck.get('slides').toJSON();
            this._deck.get('slides').forEach(function(slide, i) {
                slide.get('components').forEach(function(component, j) {
                    if (component.get) {
                        var text = cleanHTMLTag(component.get('text'));
                        component.set('text', text);
                        exportData.slides[i].components[j] = component.toJSON();
                    }
                });
            });
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
                var cmd = new ComponentCommands.Add(slide, comp);
                this._undoHistory.pushdo(cmd);
            }
        }
    });
});
