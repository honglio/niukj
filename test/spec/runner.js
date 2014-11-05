require([
    "jquery",
    // **************** Load specs ******************
    "spec/app/scripts/common/collections/MultiMapTest",
    "spec/app/scripts/common/collections/LinkedListTest",

    "spec/app/scripts/common/FileUtilsTest",
    "spec/app/scripts/common/IteratorTest",
    "spec/app/scripts/common/MapResolverTest",
    "spec/app/scripts/common/Math2Test",
    "spec/app/scripts/common/QueueTest",

    // "spec/app/scripts/common/web/interactions/SortableTest",
    "spec/app/scripts/common/web/undo_support/UndoHistoryTest",

    "spec/app/modules/cloudslide/deck/DeckTest",
    "spec/app/modules/cloudslide/deck/SlideTest",
    // "spec/app/modules/cloudslide/slide_editor/view/SlideWellTest",

    "spec/app/modules/website/list/view/DecklistTest",
    "spec/app/modules/website/list/view/DeckdetailTest",
    "spec/app/modules/website/list/view/DecklistitemTest",
    "spec/app/modules/website/list/model/DeckTest",
    "spec/app/modules/website/list/collection/DeckTest",
    "spec/app/modules/website/layout/view/HomeTest",

    // ***********************************************
], function($) {

    $(function() {
        mocha.run();
    });

});
