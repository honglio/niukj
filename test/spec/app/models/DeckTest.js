define(["jquery",
    "models/Deck",
    "models/Slide",
], function($, Deck, Slide) {


    describe('Deck', function() {
        // var slideWell = new SlideWell();

        var deck = new Deck(),
            slide = new Slide();

        describe("module load", function() {
            it("has load method", function() {
                expect(deck).to.be.a("object");
                expect(Deck).to.be.a("function");
                expect(deck.set).to.be.a("function");
            });
        });

        describe("initialize", function() {
            it("deck", function() {
                expect(deck.get("slides").models).to.deep.equal([]);
                expect(deck.get('activeSlide')).to.deep.equal(undefined);
                expect(deck.selected).to.deep.equal(undefined);
            });
        });

        describe("create function", function() {
            it("Creates new slide.", function() {
                var activeChanged = false;
                deck.on("change:activeSlide", function() {
                    activeChanged = true;
                });

                deck.create(0);

                expect(deck.get('slides').length).to.deep.equal(1);

                expect(activeChanged).to.deep.equal(true);

                expect(deck.get('slides').at(0)).to.be.instanceof(Slide);
                expect(deck.get('slides').at(0).get('index')).to.deep.equal(0);
                expect(deck.get('slides').at(0).get('active')).to.deep.equal(true);
                expect(deck.get('slides').at(0).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(1)).to.deep.equal(undefined);

                expect(deck.get('activeSlide').get('index')).to.deep.equal(0);
                expect(deck.get('activeSlide').get('active')).to.deep.equal(true);
                expect(deck.get('activeSlide').get('selected')).to.deep.equal(false);

                // no last selected deck currently exist
                expect(deck.selected).to.deep.equal(undefined);
            });

            it("Creates new slide on exist index, other slide's indexes should plus 1, include selected slide", function() {
                deck.create(0);

                expect(deck.get('slides').length).to.deep.equal(2);

                expect(deck.get('activeSlide').get('index')).to.deep.equal(0);
                expect(deck.get('activeSlide').get('active')).to.deep.equal(true);
                expect(deck.get('activeSlide').get('selected')).to.deep.equal(false);

                expect(deck.selected.get('index')).to.deep.equal(1);
                expect(deck.selected.get('active')).to.deep.equal(false);
                expect(deck.selected.get('selected')).to.deep.equal(true);
            });

            it("Creates new slide on very large index.", function() {
                deck.create(5);

                expect(deck.get('slides').length).to.deep.equal(3);

                expect(deck.get('slides').at(5)).to.deep.equal(undefined);

                expect(deck.get('slides').at(1).get('index')).to.deep.equal(1);
                expect(deck.get('slides').at(1).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(1).get('selected')).to.deep.equal(false);

                expect(deck.get('activeSlide').get('index')).to.deep.equal(2);
                expect(deck.get('activeSlide').get('active')).to.deep.equal(true);
                expect(deck.get('activeSlide').get('selected')).to.deep.equal(false);

                expect(deck.selected.get('index')).to.deep.equal(0);
                expect(deck.selected.get('active')).to.deep.equal(false);
                expect(deck.selected.get('selected')).to.deep.equal(true);
            });

            it("Creates new slide on exist index, other slide's index plus 1, include selected slide", function() {
                deck.create(2);

                expect(deck.get('slides').length).to.deep.equal(4);

                expect(deck.get('slides').at(0).get('index')).to.deep.equal(0);
                expect(deck.get('slides').at(0).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(0).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(1).get('index')).to.deep.equal(1);
                expect(deck.get('slides').at(1).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(1).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(2).get('index')).to.deep.equal(2);
                expect(deck.get('slides').at(2).get('active')).to.deep.equal(true);
                expect(deck.get('slides').at(2).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(3).get('index')).to.deep.equal(3);
                expect(deck.get('slides').at(3).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(3).get('selected')).to.deep.equal(true);

                expect(deck.get('activeSlide').get('index')).to.deep.equal(2);
                expect(deck.get('activeSlide').get('active')).to.deep.equal(true);
                expect(deck.get('activeSlide').get('selected')).to.deep.equal(false);

                expect(deck.selected.get('index')).to.deep.equal(3);
                expect(deck.selected.get('active')).to.deep.equal(false);
                expect(deck.selected.get('selected')).to.deep.equal(true);
            });
        });

        describe("add function", function() {
            it("add a exist index, other slide's index plus 1, include selected slide", function() {
                deck.add(slide, 0);
                expect(deck.get('slides').length).to.deep.equal(5);
                expect(deck.get('slides').at(0)).to.deep.equal(slide);
                expect(deck.get('slides').at(0).get('active')).to.deep.equal(true);
                expect(deck.get('slides').at(0).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(1).get('index')).to.deep.equal(1);
                expect(deck.get('slides').at(1).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(1).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(2).get('index')).to.deep.equal(2);
                expect(deck.get('slides').at(2).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(2).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(3).get('index')).to.deep.equal(3);
                expect(deck.get('slides').at(3).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(3).get('selected')).to.deep.equal(true);
                expect(deck.get('slides').at(4).get('index')).to.deep.equal(4);
                expect(deck.get('slides').at(4).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(4).get('selected')).to.deep.equal(false);

                expect(deck.get('activeSlide')).to.deep.equal(slide);
                expect(deck.get('activeSlide').get('index')).to.deep.equal(0);
                expect(deck.get('activeSlide').get('active')).to.deep.equal(true);
                expect(deck.get('activeSlide').get('selected')).to.deep.equal(false);

                expect(deck.selected.get('index')).to.deep.equal(3);
                expect(deck.selected.get('active')).to.deep.equal(false);
                expect(deck.selected.get('selected')).to.deep.equal(true);
            });

            it("add the same slide twice will fail", function() {
                deck.add(slide, 0);
                deck.add(slide, 1);
                deck.add(slide, 2);

                expect(deck.get('slides').length).to.deep.equal(5);
                expect(deck.get('slides').at(0)).to.deep.equal(slide);
                expect(deck.get('slides').at(0).get('active')).to.deep.equal(true);
                expect(deck.get('slides').at(0).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(1).get('index')).to.deep.equal(1);
                expect(deck.get('slides').at(1).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(1).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(2).get('index')).to.deep.equal(2);
                expect(deck.get('slides').at(2).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(2).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(3).get('index')).to.deep.equal(3);
                expect(deck.get('slides').at(3).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(3).get('selected')).to.deep.equal(true);
                expect(deck.get('slides').at(4).get('index')).to.deep.equal(4);
                expect(deck.get('slides').at(4).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(4).get('selected')).to.deep.equal(false);

                expect(deck.get('activeSlide')).to.deep.equal(slide);
                expect(deck.get('activeSlide').get('index')).to.deep.equal(0);
                expect(deck.get('activeSlide').get('active')).to.deep.equal(true);
                expect(deck.get('activeSlide').get('selected')).to.deep.equal(false);

                expect(deck.selected.get('index')).to.deep.equal(3);
                expect(deck.selected.get('active')).to.deep.equal(false);
                expect(deck.selected.get('selected')).to.deep.equal(true);
            });
        });

        describe("remove function", function() {
            it("Remove given slide, other slide's index minus 1, \
                        if the removed slide is the activeSlide, it should change to the prior next slide, \
                        the selected slide should be the last active Slide, in this \
                        case, the removed slide ", function() {
                deck.remove(slide);

                expect(deck.get('slides').length).to.deep.equal(4);

                expect(deck.get('slides').at(0).get('index')).to.deep.equal(0);
                expect(deck.get('slides').at(0).get('active')).to.deep.equal(true);
                expect(deck.get('slides').at(0).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(1).get('index')).to.deep.equal(1);
                expect(deck.get('slides').at(1).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(1).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(2).get('index')).to.deep.equal(2);
                expect(deck.get('slides').at(2).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(2).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(3).get('index')).to.deep.equal(3);
                expect(deck.get('slides').at(3).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(3).get('selected')).to.deep.equal(false);

                expect(deck.get('activeSlide').get('index')).to.deep.equal(0);
                expect(deck.get('activeSlide').get('active')).to.deep.equal(true);
                expect(deck.get('activeSlide').get('selected')).to.deep.equal(false);

                expect(deck.selected.get('index')).to.deep.equal(0);
                expect(deck.selected.get('active')).to.deep.equal(false);
                expect(deck.selected.get('selected')).to.deep.equal(false);
            });
            it("Do nothing when remove a unexisted slide", function() {
                deck.remove(slide);

                expect(deck.get('slides').models.length).to.deep.equal(4);
            });
        });

        describe("moveSlides function", function() {
            it("add a slide for switch.", function() {
                deck.add(slide, 1);

                expect(deck.get('slides').models.length).to.deep.equal(5);

                expect(deck.get('slides').at(0).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(0).get('selected')).to.deep.equal(true);
                expect(deck.get('slides').at(1)).to.deep.equal(slide);
                expect(deck.get('slides').at(1).get('active')).to.deep.equal(true);
                expect(deck.get('slides').at(1).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(2).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(2).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(3).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(3).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(4).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(4).get('selected')).to.deep.equal(false);

                expect(deck.get('activeSlide')).to.deep.equal(slide);
                expect(deck.get('activeSlide').get('index')).to.deep.equal(1);
                expect(deck.get('activeSlide').get('active')).to.deep.equal(true);
                expect(deck.get('activeSlide').get('selected')).to.deep.equal(false);

                expect(deck.selected.get('index')).to.deep.equal(0);
                expect(deck.selected.get('active')).to.deep.equal(false);
                expect(deck.selected.get('selected')).to.deep.equal(true);
            });
            it("switch two indexes, not affect last selected slide", function() {
                deck.moveSlide(1, 3);

                expect(deck.get('slides').models.length).to.deep.equal(5);

                expect(deck.get('slides').at(0).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(0).get('selected')).to.deep.equal(true);
                expect(deck.get('slides').at(1).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(1).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(2).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(2).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(3)).to.deep.equal(slide);
                expect(deck.get('slides').at(3).get('active')).to.deep.equal(true);
                expect(deck.get('slides').at(3).get('selected')).to.deep.equal(false);
                expect(deck.get('slides').at(4).get('active')).to.deep.equal(false);
                expect(deck.get('slides').at(4).get('selected')).to.deep.equal(false);

                expect(deck.get('activeSlide')).to.deep.equal(slide);
                expect(deck.get('activeSlide').get('index')).to.deep.equal(3);
                expect(deck.get('activeSlide').get('active')).to.deep.equal(true);
                expect(deck.get('activeSlide').get('selected')).to.deep.equal(false);

                expect(deck.selected.get('index')).to.deep.equal(0);
                expect(deck.selected.get('active')).to.deep.equal(false);
                expect(deck.selected.get('selected')).to.deep.equal(true);
            });
        });
    });
});
