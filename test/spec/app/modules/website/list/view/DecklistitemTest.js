define([
    "website/list/view/Decklistitem",
    "website/list/model/Deck",
    "website/list/collection/Deck",
    "templates",
], function(DeckListItemView, DeckModel, DeckCollection) {
    "use strict";

    describe('Decklistitem', function() {
		var decks = new DeckCollection([{_id: "111111"}, {_id: "222222"}, {_id: "333333"}]);
		var itemView = new DeckListItemView({model: decks.at(1)});

		it("should render as a LI item", function() {
            expect(itemView.el.nodeName).to.equal("LI");
        });
		it("decks  Deck  id should be default", function() {
			expect(decks.at(1).get('_id')).is.deep.equal('222222');
        });
		describe("Deck delete successful", function() {
			beforeEach(function() {
                this.del_stub = sinon.stub(itemView, "_deleteDeck");
				this.del_stub({
					success:function(){
						itemView.render();
						itemView.$("#trashBtn").click();
					}
				});
				this.del_stub.yieldTo("success");
			});
            afterEach(function() {
                this.del_stub.restore();
            });
			it("Deck should be Delete success when click trashBtn", function() {
				expect(this.del_stub).to.be.calledOnce;
				expect(decks.length).is.equal(2);
				expect(decks.at(1).get('_id')).is.deep.equal('333333');
            });
        });
	});
});
