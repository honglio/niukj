require.config({
  paths: {
    jquery: '/js/vendors/jquery',
    underscore: '/js/vendors/underscore',
    backbone: "/js/vendors/backbone",
    handlebars: '/js/vendors/handlebars',
    css: "/js/vendors/css",
    hbs: '/js/vendors/hbs',
    etch: "/js/vendors/etch/etch",
    CustomView: '/js/CustomView',
    config: 'config/config',

    // directory map
    models: 'models',
    templates: '/templates',
    common: 'common',
    styles: '/css',

    'deck': 'models/deck',
    'hotkey': 'views/hotkey',
    'etch_extension': 'views/etch_extension',
    'headbar': 'views/headbar',
    'start_btn': 'views/start_btn',
    'ppt_gen': 'views/ppt_gen',
    'slide_components': 'views/slide_components',
    'slide_editor': 'views/slide_editor',
    'slide_snapshot': 'views/slide_snapshot',
    'storage': 'views/storage',
    'themes': 'views/themes',
    'slide_create_btn': 'views/slide_create_btn',
    'clipboard': 'views/clipboard',
    'tour': 'views/tour'
  },

  shim: {
    'Backbone': ['underscore', 'jquery'],
    'SocialNet': ['backbone']
  }
});

require(['Init', 'config'], function(Init) {
  Init.initialize();
});
