"use strict";

require.config({
    deps: ['runner'],
    // baseUrl: 'spec/',
    // urlArgs: "v=" + (new Date()).getTime(),
    paths: {
        runner                                      : './spec/runner',
        testConfig                                  : './config',

        jquery                                      : new RegExp(" Gecko/").test(navigator.userAgent) ? "../scripts/libs/zepto" : "../scripts/libs/jquery",
        lodash                                      : "../scripts/libs/lodash",
        backboneMeta                                : "../scripts/libs/backbone",
		backbone									: "../scripts/libs/backbone-extension",
        css                                         : "../scripts/libs/css",
        bootstrap                                   : "../frameworks/bootstrap/bootstrap",
        colorpicker                                 : "../frameworks/spectrum/spectrum",
        etch                                        : "../frameworks/etch/etch",
        lang                                        : "../locales/lang",
        handlebars                                  : '../scripts/libs/handlebars',
        parsley                                     : '../scripts/libs/parsley',
        parsley_zh                                  : '../locales/parsley/messages.zh_cn',
        html2canvas                                 : '../scripts/libs/html2canvas',
        templates                                   : '../scripts/app-templates',


        // build - rmap
        'libs'                                      : "../scripts/libs",
        'common'                                    : "../scripts/common",

        'website/layout'                            : '../modules/website/layout',
        'website/editor'                            : '../modules/website/editor',
        'website/list'                              : '../modules/website/list',

        'cloudslide/config'                         : '../modules/cloudslide/config',
        'cloudslide/deck'                           : '../modules/cloudslide/deck',
        'cloudslide/hotkey'                         : '../modules/cloudslide/hotkey',
        'cloudslide/etch_extension'                 : '../modules/cloudslide/etch_extension',
        'cloudslide/exporter'                       : '../modules/cloudslide/exporter',
        'cloudslide/exporter/json'                  : '../modules/cloudslide/exporter.json',
        'cloudslide/headbar'                        : '../modules/cloudslide/headbar',
        'cloudslide/importer'                       : '../modules/cloudslide/importer',
        'cloudslide/importer/json'                  : '../modules/cloudslide/importer.json',
        'cloudslide/splash'                         : '../modules/cloudslide/splash',
        'cloudslide/start_button'                   : '../modules/cloudslide/start_button',
        'cloudslide/presentation_generator'         : '../modules/cloudslide/presentation_generator',
        'cloudslide/slide_components'               : '../modules/cloudslide/slide_components',
        'cloudslide/slide_editor'                   : '../modules/cloudslide/slide_editor',
        'cloudslide/slide_snapshot'                 : '../modules/cloudslide/slide_snapshot',
        'cloudslide/startup'                        : '../modules/cloudslide/startup',
        'cloudslide/storage'                        : '../modules/cloudslide/storage',
        'cloudslide/themes'                         : '../modules/cloudslide/themes',
        'cloudslide/well_add_button'                : '../modules/cloudslide/well_add_button',
        'cloudslide/clipboard_actions'              : '../modules/cloudslide/clipboard_actions',
        'cloudslide/screen_help'                    : '../modules/cloudslide/screen_help',
        // end build - rmap
    },
    shim: {
        runner: ['testConfig'],
        jquery: {
            exports: '$'
        },
        bootstrap: {
            deps    : ['jquery'],
            exports : 'Bootstrap'
        },
        colorpicker: {
            deps    : ['jquery'],
            exports : 'Colorpicker'
        },
        parsley: {
            deps    : ['jquery'],
            exports : 'Parsley'
        },
        parsley_zh: {
            deps    : ['jquery'],
            exports : 'Parsley_zh'
        },
        backboneMeta: {
            deps    : ['lodash', 'jquery'],
            exports : 'BackboneMeta'
        },
		backbone: {
			deps	: ['backboneMeta'],
			exports : 'Backbone'
		},
        handlebars: {
            exports : 'Handlebars'
        },
        html2canvas: {
            exports : 'Html2Canvas'
        }
    }
});
