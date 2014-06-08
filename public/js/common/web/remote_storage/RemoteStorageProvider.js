define(["website/list/model/Deck",
    "website/list/collection/Deck"
], function(DeckModel, DeckCollection) {
    "use strict";

    function RemoteStorageProvider() {
        this.name = "Remote Storage";
        this.id = "remotestorage";
        this.deckColect = new DeckCollection();
    }

    RemoteStorageProvider.prototype = {
        ls: function(cb) {
            this.deckColect.fetch({
                success: function(collection) {
                    console.log(collection);
                    cb(collection);
                },
                error: function() {
                    alert('An error occurred while fetch decks');
                }
            });
            return this;
        },

        rm: function() {
            // TODO: add this func to deleteDeck
            this.deck.removeItem();
            return this;
        },

        getContents: function(deckId, cb) {
            try {
                console.log(this.deckColect);
                this.deck = this.deckColect.findWhere({
                    _id: deckId
                });
                console.log(this.deck);
                if (!this.deck) {
                    console.log('deck is null');
                    this.deck = new DeckModel();
                    cb(this.deck);
                } else {
                    console.log('deck is not null');
					this.deck.fetch({
						success: function(deck){
							cb(deck);
						}
					});
				}
                console.log(this.deck);
            } catch (e) {
                cb(null, e);
            }

            return this;
        },

        setContents: function(fname, data, cb) {
            console.log(data);
            console.log(fname);
            console.log(this.deck);
            if (data.id) {
                this.deck.set('_id', data.id);
            } else {
                this.deck.set('_id', data._id);
            }
            this.deck.set('fileName', fname);
            this.deck.set('slides', data.slides);
            this.deck.set('activeSlide', data.activeSlide);
            this.deck.set('background', data.background);
            this.deck.set('picture', data.picture);
            this.deck.set('width', data.width);
            this.deck.set('height', data.height);
            this.deck.save({
                success: function() {
                    cb();
                },
                error: function(err) {
                    cb(err);
                }
            });

            return this;
        }

    };

    return RemoteStorageProvider;
});
