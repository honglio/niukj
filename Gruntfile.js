'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'handlebars'

module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'public',
        server: 'server',
        release: 'built',
        test: 'test',
        hbs: ['<%= yeoman.app %>/templates/**/*.hbs', '<%= yeoman.app %>/js/common/web/widgets/templates/*.hbs'],
        jsClient: '<%= yeoman.app %>/js/**/*.js',
        jsServer: ['<%= yeoman.server %>/models/**/*.js', '<%= yeoman.server %>/controllers/**/*.js'],
        jade: '<%= yeoman.server %>/views/**/*.jade',
        css: '{.tmp,<%= yeoman.app %>}/css/**/*.css'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,

        clean: {
            release: ['.tmp', '<%= yeoman.release %>/*'],
            dev: '.tmp'
        },
        jsbeautifier: {
            fix: {
                src: [
                    '<%= yeoman.jsServer %>',
                    '<%= yeoman.jsClient %>',
                    '!<%= yeoman.app %>/js/vendors/**/*.js',
                    'test/spec/**/*.js',
                    'lib/**/*.js',
                    'config/**/*.js',
                    '*.js'
                ],
                options: {
                    html: {
                        braceStyle: "collapse",
                        indentChar: " ",
                        indentScripts: "keep",
                        indentSize: 4,
                        maxPreserveNewlines: 10,
                        preserveNewlines: true,
                        unformatted: ["a", "sub", "sup", "b", "i", "u"],
                        wrapLineLength: 0
                    },
                    css: {
                        indentChar: " ",
                        indentSize: 4
                    },
                    js: {
                        braceStyle: "collapse",
                        breakChainedMethods: false,
                        e4x: false,
                        evalCode: false,
                        indentChar: " ",
                        indentLevel: 0,
                        indentSize: 4,
                        indentWithTabs: false,
                        jslintHappy: false,
                        keepArrayIndentation: false,
                        keepFunctionIndentation: false,
                        maxPreserveNewlines: 10,
                        preserveNewlines: true,
                        spaceBeforeConditional: true,
                        spaceInParen: false,
                        unescapeStrings: false,
                        wrapLineLength: 0
                    },
                    mode: 'VERIFY_AND_WRITE'
                }
            },
            test: {
                src: [
                    '<%= yeoman.jsServer %>',
                    '<%= yeoman.jsClient %>',
                    '!<%= yeoman.app %>/js/vendors/**/*.js',
                    'test/spec/**/*.js',
                    'lib/**/*.js',
                    'config/**/*.js',
                    '*.js'
                ],
                options: {
                    html: {
                        braceStyle: "collapse",
                        indentChar: " ",
                        indentScripts: "keep",
                        indentSize: 4,
                        maxPreserveNewlines: 10,
                        preserveNewlines: true,
                        unformatted: ["a", "sub", "sup", "b", "i", "u"],
                        wrapLineLength: 0
                    },
                    css: {
                        indentChar: " ",
                        indentSize: 4
                    },
                    js: {
                        braceStyle: "collapse",
                        breakChainedMethods: false,
                        e4x: false,
                        evalCode: false,
                        indentChar: " ",
                        indentLevel: 0,
                        indentSize: 4,
                        indentWithTabs: false,
                        jslintHappy: false,
                        keepArrayIndentation: false,
                        keepFunctionIndentation: false,
                        maxPreserveNewlines: 10,
                        preserveNewlines: true,
                        spaceBeforeConditional: true,
                        spaceInParen: false,
                        unescapeStrings: false,
                        wrapLineLength: 0
                    },
                    mode: 'VERIFY_ONLY'
                }
            }
        },
        jshint: {
            server: {
                options: {
                    jshintrc: 'server.jshintrc'
                },
                files: {
                    src: [
                        '<%= yeoman.jsServer %>'
                    ]
                }
            },
            client: {
                options: {
                    jshintrc: 'client.jshintrc'
                },
                files: {
                    src: [
                        '<%= yeoman.jsClient %>',
                        '!<%= yeoman.app %>/js/vendors/**/*.js'
                    ]
                }
            },
            shared: {
                options: {
                    jshintrc: 'shared.jshintrc'
                },
                files: {
                    src: [
                        'test/spec/**/*.js',
                        'lib/**/*.js',
                        'config/**/*.js',
                        '*.js'
                    ]
                }
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            strict: {
                options: {
                    import: 2
                },
                src: ['<%= yeoman.css %>']
            },
            lax: {
                options: {
                    import: false
                },
                src: ['<%= yeoman.css %>']
            }
        },
        mocha: {
            // index: ['test/index.html'],
            all: {
                options: {
                    log: true,
                    run: false,
                    reporter: 'Spec', // or Nyan
                    urls: ['http://localhost:3000/index.html']
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    // Define our base URL - all module paths are relative to this
                    // base directory.
                    baseUrl: "./",

                    // Define our build directory. All files in the appDir will be
                    // COPIED OVER into the build directory as part of the
                    // concatentation and optimization process. You should use this
                    // so you don't override your raw source files.
                    dir: "./built",

                    // The directory that contains the application (the <root> directory).
                    // All the files sitting under this directory will be copied from here
                    // to the dir argument.
                    appDir: "./public",

                    // Load the RequireJS config() definition from the main.js file.
                    // Otherwise, we'd have to redefine all of our paths again here.
                    mainConfigFile: "./public/main.js",

                    // Turn off UglifyJS so that we can view the compiled source
                    // files (in order to make sure that we know that the compile
                    // is working properly - for debugging only.)
                    optimize: "none",
                    optimizeCss: "standard",
                    // inlining ftw
                    inlineText: true,

                    pragmasOnSave: {
                        //removes Handlebars.Parser code (used to compile template strings) set
                        //it to `false` if you need to parse template strings even after build
                        excludeHbsParser: true,
                        // kills the entire plugin set once it's built.
                        excludeHbs: true,
                        // removes i18n precompiler, handlebars and json2
                        excludeAfterBuild: true
                    },

                    // default plugin settings, listing here just as a reference
                    hbs: {
                        templateExtension: 'hbs',
                        // if disableI18n is `true` it won't load locales and the i18n helper
                        // won't work as well.
                        disableI18n: false
                    },

                    // Define the modules to compile.
                    modules: [

                        // When compiling the main file, don't include the FAQ module.
                        // We want to lazy-load FAQ since it probably won't be used
                        // very much.
                        {
                            name: "main",
                        },

                        {
                            name: "js/Init",

                            // Explicitly include modules that are NOT required
                            // directly by the MAIN module. This allows us to include
                            // commonly used modules that we want to front-load.
                            // include: [
                            //     "bootstrap",
                            //     "config",
                            //     "colorpicker"
                            // ],

                            // Use the *shallow* exclude; otherwise, dependencies of
                            // the FAQ module will also be excluded from this build
                            // (including jQuery and text and util modules). In other
                            // words, a deep-exclude would override our above include.
                            // excludeShallow: [
                            //     "views/faq"
                            // ]
                        },

                        {
                            name: "js/CustomView"
                        }, {
                            name: "js/AppView"
                        }, {
                            name: "js/AppModel"
                        }, {
                            name: "js/views/etch_extension"
                        },
                        // When compiling the FAQ module, don't include the modules
                        // that have already been included as part of the main
                        // compilation (ie. jquery, text, util). This way, we only
                        // include the parts of the FAQ dependencies that are unique
                        // to the FAQ module (ie. its HTML).
                        {
                            name: "js/views/headbar/HeadbarView",

                            // If we don't exclude these modules, they will be doubly
                            // defined in our main module (since these are ALSO
                            // dependencies of our main module).
                            // exclude: [
                            //     "CustomView"
                            // ]
                        }, {
                            name: "js/views/headbar/ThemeProviderBtn",
                        }, {
                            name: "js/views/save_btn/ButtonView",
                        }, {
                            name: "js/views/slide_components/drawers/AbstractDrawer"
                        }, {
                            name: "js/views/slide_components/drawers/ImageDrawer"
                        }, {
                            name: "js/views/slide_components/drawers/TextBoxDrawer"
                        }, {
                            name: "js/views/slide_components/view/Component"
                        }, {
                            name: "js/views/slide_components/view/ComponentButton"
                        }, {
                            name: "js/views/slide_components/view/ComponentImportButton"
                        }, {
                            name: "js/views/slide_components/view/ImageView"
                        }, {
                            name: "js/views/slide_components/view/TextBoxView"
                        }, {
                            name: "js/views/slide_components/ComponentFactory"
                        }, {
                            name: "js/views/slide_editor/AddSlideButton"
                        }, {
                            name: "js/views/slide_editor/OperatingTable"
                        }, {
                            name: "js/views/slide_editor/SlideEditorView"
                        }, {
                            name: "js/views/slide_editor/SlideWell"
                        }, {
                            name: "js/views/slide_editor/WellContextBox"
                        }, {
                            name: "js/views/slide_snapshot/Slide2Image"
                        }, {
                            name: "js/views/slide_snapshot/SlideDrawer"
                        }, {
                            name: "js/views/slide_snapshot/SlideSnapshot"
                        }, {
                            name: "js/views/storage/StorageInterface"
                        }, {
                            name: "js/views/storage/StorageModal"
                        }, {
                            name: "js/views/themes/AvailableBackgrounds"
                        }, {
                            name: "js/views/themes/BackgroundProvider"
                        }, {
                            name: "js/models/Component"
                        }, {
                            name: "js/models/ComponentCommands"
                        }, {
                            name: "js/models/Deck"
                        }, {
                            name: "js/models/Image"
                        }, {
                            name: "js/models/Slide"
                        }, {
                            name: "js/models/SlideCollection"
                        }, {
                            name: "js/models/SlideCommands"
                        }, {
                            name: "js/models/SpatialObject"
                        }, {
                            name: "js/models/TextBox"
                        }, {
                            name: "js/config/config"
                        }, {
                            name: "js/vendors/css"
                        }, {
                            name: "js/vendors/hbs"
                        }, {
                            name: "js/vendors/etch/etch"
                        }, {
                            name: "js/vendors/hbs/handlebars"
                        }, {
                            name: "js/vendors/hbs/handlebars.runtime"
                        }, {
                            name: "js/vendors/hbs/i18nprecompile"
                        }, {
                            name: "js/vendors/hbs/json2"
                        }, {
                            name: "js/common/FileUtils"
                        }, {
                            name: "js/common/Iterator"
                        }, {
                            name: "js/common/MapResolver"
                        }, {
                            name: "js/common/Math2"
                        }, {
                            name: "js/common/Queue"
                        }, {
                            name: "js/common/collections/LinkedList"
                        }, {
                            name: "js/common/collections/MultiMap"
                        }, {
                            name: "js/common/web/interactions/Clipboard"
                        }, {
                            name: "js/common/web/interactions/Sortable"
                        }, {
                            name: "js/common/web/remote_storage/RemoteStorageProvider"
                        }, {
                            name: "js/common/web/undo_support/UndoHistory"
                        }, {
                            name: "js/common/web/undo_support/UndoHistoryFactory"
                        }, {
                            name: "js/common/web/widgets/DeltaDragControl"
                        }, {
                            name: "js/common/web/widgets/Dropdown"
                        }, {
                            name: "js/common/web/widgets/ErrorModal"
                        }, {
                            name: "js/common/web/widgets/HiddenOpen"
                        }, {
                            name: "js/common/web/widgets/ItemImportModal"
                        }
                    ]
                }
            }
        },
        uglify: {
            prod: {
                files: {
                    '<%= yeoman.release %>/main.js': '<%= yeoman.release %>/main.js'
                }
            }
        },
        imagemin: {
            release: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/img',
                    src: '{,**/}*.{png,jpg,jpeg,gif,ico}',
                    dest: '<%= yeoman.release %>/img'
                }]
            }
        },
        cssmin: {
            release: {
                files: {
                    '<%= yeoman.release %>/styles/main.css': [
                        '.tmp/styles/{,**/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            release: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace      : true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.release %>'
                }]
            }
        }
    });

    grunt.registerTask('test-lint', [
        'clean:dev',
        'jsbeautifier:test',
        'jshint',
        // 'csslint:lax'
        // 'mocha'
    ]);

    grunt.registerTask('fix-lint', [
        'jsbeautifier:fix'
    ]);

    grunt.registerTask('build', [
        'clean:release',
        'requirejs',
        'uglify',
        'imagemin',
        'htmlmin',
        // 'cssmin',
    ]);

    grunt.registerTask('default', [
        'test-lint',
        'build'
    ]);
};
