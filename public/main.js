require.config({
    paths: {
        // vendor file
        jquery: 'js/vendors/jquery.min',
        underscore: 'js/vendors/underscore',
        backbone: "js/vendors/backbone",
        bootstrap: 'js/vendors/bootstrap.min',
        css: "js/vendors/css",
        hbs: 'js/vendors/hbs',
        etch: "js/vendors/etch/etch",
        colorpicker: 'js/vendors/spectrum',

        // custom file
        CustomView: 'js/CustomView',
        config: 'js/config/config',
        Init: 'js/Init',
        AppView: 'js/AppView',
        AppModel: 'js/AppModel',
        etch_extension: 'js/views/etch_extension',

        // directory map
        models: 'js/models',
        templates: 'templates',
        common: 'js/common',
        styles: 'css',
        views: 'js/views'
    },

    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'Bootstrap'
        },
        colorpicker: {
            deps: ['jquery'],
            exports: 'Colorpicker'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        Init: {
            deps: ['backbone'],
            exports: 'Init'
        }
    }
});

require(['Init'], function(Init) {
    Init.initialize();
});
