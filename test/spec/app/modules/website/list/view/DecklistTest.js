define([
    "website/list/view/Decklist",
    "website/list/collection/Deck",
    "templates"
], function(DecklistView, DeckCollection) {
    "use strict";

    describe('DeckListView', function() {
        var deckCollection = new DeckCollection([{
                _id: "111111"
            }, {
                _id: "222222"
            }]),
            decklistView = new DecklistView({
                collection: deckCollection,
                page: 1
            });
        it("should render as 2 deck item", function() {
            expect(decklistView.$('.thumbnail').length).to.equal(2);
        });
        it("should list paginator", function() {
            expect(decklistView.$('.pagination').find('li').length).to.equal(1);
        });
    });
});
