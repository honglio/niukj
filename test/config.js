require.config({
    deps: ['runner'],
    // baseUrl: 'spec/',
    // urlArgs: 'v=' + (new Date()).getTime(),
    paths: {
        runner                                      : './spec/runner',
        testConfig                                  : './config',

        // vendor file
        // new RegExp(' Gecko/').test(navigator.userAgent) ? '../js/vendors/zepto' : '../js/vendors/jquery',
        jquery                                      : '../js/vendors/jquery',
        underscore                                  : '../js/vendors/underscore',
        backbone                                    : '../js/vendors/backbone',
        bootstrap                                   : '../js/vendors/bootstrap',
        css                                         : '../js/vendors/css',
        hbs                                         : '../js/vendors/hbs',
        etch                                        : '../js/vendors/etch/etch',
        etch_extension                              : '../js/views/etch_extension',
        colorpicker                                 : '../js/vendors/spectrum',

        // custom file
        CustomView                                  : '../js/CustomView',

        // directory map
        templates                                   : '../templates',
        models                                      : '../js/models',
        common                                      : '../js/common',
        views                                       : '../js/views',
        styles                                      : '../css'
    },
    shim: {
        runner: ['testConfig'],
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
