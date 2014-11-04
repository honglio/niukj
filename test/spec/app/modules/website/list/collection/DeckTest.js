define(["jquery",
    "website/list/model/Deck",
    "website/list/collection/Deck",
    "templates"
], function($, DeckView, DeckCollection) {
    "use strict";
    describe("DeckCollection", function() {
        var decks = new DeckCollection();
        describe("Collection's Interaction with REST API", function() {
            beforeEach(function() {
                this.ajax_stub = sinon.stub($, "ajax").yieldsTo("success", [{
                    _id: 111111,
                    fileName: "Mock Summary 1",
                    slides: "<p><b>BIG BOSS</b></p>"
                }, {
                    _id: 222222,
                    fileName: "Mock Summary 2",
                    slides: "<p><b>SMALL ASS</b></p>"
                }]);
            });
            afterEach(function() {
                this.ajax_stub.restore();
            });
            it("should load using the API", function() {
                decks.fetch();
                expect(decks.length).to.equal(2);
                expect(decks.at(0).get('fileName')).to.equal("Mock Summary 1");
                expect(decks.at(1).get('fileName')).to.equal("Mock Summary 2");
            });
        });
    });
});
