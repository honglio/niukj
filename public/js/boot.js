require.config({
  paths: {
    jquery: '/js/vendors/jquery',
    underscore: '/js/vendors/underscore',
    backbone: "/js/vendors/backbone",
    handlebars: '/js/vendors/handlebars',
    bootstrap: '/js/vendors/bootstrap',
    css: "/js/vendors/css",
    hbs: '/js/vendors/hbs',
    etch: "/js/vendors/etch/etch",
    etch_extension: 'views/etch_extension',
    CustomView: '/js/CustomView',
    config: 'config/config',

    // directory map
    models: 'models',
    templates: '/templates',
    common: 'common',
    styles: '/css',
  },

  shim: {
    'Bootstrap': ['jquery'],
    'Backbone': ['underscore', 'jquery'],
    'Init': ['backbone']
  }
});

require(['Init', 'config'], function(Init) {
  Init.initialize();
});
