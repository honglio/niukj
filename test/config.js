require.config({
    // baseUrl: 'spec/',
    // urlArgs: 'v=' + (new Date()).getTime(),
    paths: {
        // vendor file
        // new RegExp(' Gecko/').test(navigator.userAgent) ? '../js/vendors/zepto' : '../js/vendors/jquery',
        jquery                                      : '../public/js/vendors/jquery',
        underscore                                  : '../public/js/vendors/underscore',
        backbone                                    : '../public/js/vendors/backbone',
        bootstrap                                   : '../public/js/vendors/bootstrap',
        css                                         : '../public/js/vendors/css',
        hbs                                         : '../public/js/vendors/hbs',
        etch                                        : '../public/js/vendors/etch/etch',
        etch_extension                              : '../public/js/views/etch_extension',
        colorpicker                                 : '../public/js/vendors/spectrum',

        // custom file
        CustomView                                  : '../public/js/CustomView',

        // directory map
        templates                                   : '../public/templates',
        models                                      : '../public/js/models',
        common                                      : '../public/js/common',
        views                                       : '../public/js/views',
        styles                                      : '../public/css'
    },
    shim: {
        bootstrap: {
            deps    : ['jquery'],
            exports : 'Bootstrap'
        },
        colorpicker: {
            deps    : ['jquery'],
            exports : 'Colorpicker'
        },
		backbone: {
			deps	: ['underscore', 'jquery'],
			exports : 'Backbone'
		}
    }
});

require([
    "jquery",
    "spec/app/common/collections/MultiMapTest",
    "spec/app/common/collections/LinkedListTest",
    "spec/app/common/FileUtilsTest",
    "spec/app/common/IteratorTest",
    "spec/app/common/MapResolverTest",
    "spec/app/common/Math2Test",
    "spec/app/common/QueueTest",

    // "spec/app/common/web/interactions/SortableTest",

    // "spec/app/models/DeckTest",
    // "spec/app/models/SlideTest",
    // "spec/app/models/SlideWellTest", should write as functional test
], function($) {
    $(function() {
        mocha.run();
    });
});
