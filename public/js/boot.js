require.config({
  paths: {
    jquery: '/js/vendors/jquery',
    underscore: '/js/vendors/underscore',
    backbone: "/js/vendors/backbone",
    bootstrap: '/js/vendors/bootstrap',
    css: "/js/vendors/css",
    hbs: '/js/vendors/hbs',
    etch: "/js/vendors/etch/etch",
    etch_extension: 'views/etch_extension',
    colorpicker: '/js/vendors/spectrum',
    CustomView: '/js/CustomView',
    config: 'config/config',

    // directory map
    models: 'models',
    templates: '/templates',
    common: 'common',
    styles: '/css',
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
