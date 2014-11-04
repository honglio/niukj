define(["website/list/model/Deck",
    "templates"
], function(DeckModel) {
    "use strict";

    describe('DeckModel', function() {
        var deckModel = new DeckModel();
        describe('Initialization', function() {
            it('should default the id to null', function() {
                expect(deckModel.get('_id')).to.equal(null);
            });
            it('urlRoot assignment', function() {
                expect(deckModel.urlRoot).to.equal("/decks");
            });
        });

        describe('validator', function() {
            it('validator should work', function() {
                expect(deckModel.validators.fileName('John').isValid).to.equal(true);
            });
            it('validateItem message', function() {
                expect(deckModel.validateItem('fileName').message).to.equal('You must enter a file name');
            });
            it('validateAll message', function() {
                expect(deckModel.validateAll().messages.fileName).to.equal('You must enter a file name');
            });
        });
    });
});
