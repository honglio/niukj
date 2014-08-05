require.config({
  paths: {
    jquery: 'js/vendors/jquery',
    underscore: 'js/vendors/underscore',
    backbone: "js/vendors/backbone",
    bootstrap: 'js/vendors/bootstrap',
    css: "js/vendors/css",
    hbs: 'js/vendors/hbs',
    etch: "js/vendors/etch/etch",
    etch_extension: 'js/views/etch_extension',
    colorpicker: 'js/vendors/spectrum',
    CustomView: 'js/CustomView',
    config: 'js/config/config',
    Init: 'js/Init',
    AppView: 'js/AppView',
    AppModel: 'js/AppModel',

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
