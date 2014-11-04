define(["jquery",
"cloudslide/deck/Deck",
"cloudslide/deck/Slide",
"cloudslide/slide_editor/view/SlideWell",
"website/editor/utils/ServiceRegistry",
"cloudslide/startup/EditorModel",
"cloudslide/slide_editor/main",
"cloudslide/well_add_button/main",
], function($, Deck, Slide, SlideWell, ServiceRegistry, EditorModel, slideEditor, wellAddButton) {
"use strict";

describe('SlideWell', function() {
        var registry = new ServiceRegistry(),
            editorModel = new EditorModel(registry),
            slideWell = new SlideWell(editorModel);

        wellAddButton.initialize(registry);
        slideEditor.initialize(registry);

        describe("initialize", function() {
            it("registry object", function() {
                expect(registry.getBest('cloudslide.EditMode')).to.be.instanceof(Object);
            });
            it("editorModel object", function() {
                expect(editorModel._deck).to.be.instanceof(Deck);
            });
            it("slideWell object", function() {
                expect(slideWell._deck).to.be.instanceof(Deck);
            });
        });

        describe("set function", function() {
            it("Set an attribute of the Deck.", function() {

            });
        });

        describe("create function", function() {
            it("Creates a new slide.", function() {

            });
        });

        describe("add function", function() {
                it("add a new slide to a exist index, the index \
                    of exist slide will reset ", function () {

                });

            it("add the slide which already exist does't success", function() {


            });
        });

    describe("remove function", function() {
            it("Removes the specified slide from the deck, the index \
                of other slide will auto rest ", function () {

            });
    });

describe("moveSlides function", function() {
    it("Move slide at a given index to a new index.", function() {

    });
});

describe("_slideActivated function", function() {
    it("the newly created slide will be set selected and active", function() {

    });
    it("the active slide will also be set selected", function() {

    });
});

describe("selectSlides function", function() {
    it("Selects given slides. the selected slide will also be set active", function() {

    });
});

describe("unselectSlides function", function() {
    it("Unselect all slides, but activeSlide and selected slide will remain the same", function() {

    });
});

describe("_selectionChanged function", function() {
    it("set selected element, but not change 'slides'", function() {

    });
});

describe("slides event", function() {
    it("React on remove event.", function() {

    });
    it("React on add event.", function() {

    });
    it("React on reset event.", function() {

    });
});

});
});
