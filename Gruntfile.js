'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'handlebars'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'public',
        server: 'server',
        dist: 'dist',
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
            release: ['.tmp', '<%= yeoman.dist %>/*'],
            dev: '.tmp'
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

        // ### Config for grunt-contrib-concat
        // concatenate multiple JS files into a single file ready for use
        concat: {
            dev: {
                files: {
                    'core/built/scripts/vendor.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/jquery-ui/ui/jquery-ui.js',
                        'core/client/assets/lib/jquery-utils.js',
                        'core/client/assets/lib/uploader.js',

                        'bower_components/lodash/dist/lodash.underscore.js',
                        'bower_components/backbone/backbone.js',
                        'bower_components/handlebars/handlebars.runtime.js',
                        'bower_components/moment/moment.js',
                        'bower_components/jquery-file-upload/js/jquery.fileupload.js',
                        'bower_components/codemirror/lib/codemirror.js',
                        'bower_components/codemirror/addon/mode/overlay.js',
                        'bower_components/codemirror/mode/markdown/markdown.js',
                        'bower_components/codemirror/mode/gfm/gfm.js',
                        'bower_components/showdown/src/showdown.js',
                        'bower_components/validator-js/validator.js',

                        'core/shared/lib/showdown/extensions/ghostimagepreview.js',
                        'core/shared/lib/showdown/extensions/ghostgfm.js',

                        // ToDo: Remove or replace
                        'core/client/assets/vendor/shortcuts.js',
                        'core/client/assets/vendor/to-title-case.js',

                        'bower_components/Countable/Countable.js',
                        'bower_components/fastclick/lib/fastclick.js',
                        'bower_components/nprogress/nprogress.js'
                    ],

                    'core/built/scripts/helpers.js': [
                        'core/client/init.js',

                        'core/client/mobile-interactions.js',
                        'core/client/toggle.js',
                        'core/client/markdown-actions.js',
                        'core/client/helpers/index.js',
                        'core/client/assets/lib/editor/index.js',
                        'core/client/assets/lib/editor/markerManager.js',
                        'core/client/assets/lib/editor/uploadManager.js',
                        'core/client/assets/lib/editor/markdownEditor.js',
                        'core/client/assets/lib/editor/htmlPreview.js',
                        'core/client/assets/lib/editor/scrollHandler.js',
                        'core/client/assets/lib/editor/mobileCodeMirror.js'
                    ],

                    'core/built/scripts/templates.js': [
                        'core/client/tpl/hbs-tpl.js'
                    ],

                    'core/built/scripts/models.js': [
                        'core/client/models/**/*.js'
                    ],

                    'core/built/scripts/views.js': [
                        'core/client/views/**/*.js',
                        'core/client/router.js'
                    ]
                }
            },
            prod: {
                files: {
                    'core/built/scripts/ghost.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/jquery-ui/ui/jquery-ui.js',
                        'core/client/assets/lib/jquery-utils.js',
                        'core/client/assets/lib/uploader.js',

                        'bower_components/lodash/dist/lodash.underscore.js',
                        'bower_components/backbone/backbone.js',
                        'bower_components/handlebars/handlebars.runtime.js',
                        'bower_components/moment/moment.js',
                        'bower_components/jquery-file-upload/js/jquery.fileupload.js',
                        'bower_components/codemirror/lib/codemirror.js',
                        'bower_components/codemirror/addon/mode/overlay.js',
                        'bower_components/codemirror/mode/markdown/markdown.js',
                        'bower_components/codemirror/mode/gfm/gfm.js',
                        'bower_components/showdown/src/showdown.js',
                        'bower_components/validator-js/validator.js',

                        'core/shared/lib/showdown/extensions/ghostimagepreview.js',
                        'core/shared/lib/showdown/extensions/ghostgfm.js',

                        // ToDo: Remove or replace
                        'core/client/assets/vendor/shortcuts.js',
                        'core/client/assets/vendor/to-title-case.js',

                        'bower_components/Countable/Countable.js',
                        'bower_components/fastclick/lib/fastclick.js',
                        'bower_components/nprogress/nprogress.js',

                        'core/client/init.js',

                        'core/client/mobile-interactions.js',
                        'core/client/toggle.js',
                        'core/client/markdown-actions.js',
                        'core/client/helpers/index.js',

                        'core/client/assets/lib/editor/index.js',
                        'core/client/assets/lib/editor/markerManager.js',
                        'core/client/assets/lib/editor/uploadManager.js',
                        'core/client/assets/lib/editor/markdownEditor.js',
                        'core/client/assets/lib/editor/htmlPreview.js',
                        'core/client/assets/lib/editor/scrollHandler.js',
                        'core/client/assets/lib/editor/mobileCodeMirror.js',

                        'core/client/tpl/hbs-tpl.js',

                        'core/client/models/**/*.js',

                        'core/client/views/**/*.js',

                        'core/client/router.js'
                    ]
                }
            }
        },
        // ### Config for grunt-contrib-uglify
        // minify javascript file for production
        uglify: {
            prod: {
                files: {
                    'core/built/scripts/ghost.min.js': 'core/built/scripts/ghost.js'
                }
            }
        },

        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
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
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        rev: {
            dist: {
                files: {
                    src: ['<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= yeoman.dist %>/styles/fonts/*']
                }
            }
        }
    });

    grunt.registerTask('test', [
        'clean:dev',
        'jshint:shared',
        // 'csslint:lax'
        // 'mocha'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'imagemin',
        'htmlmin',
        'cssmin',
        'usemin',
        'rev'
    ]);

    grunt.registerTask('default', [
        // 'test',
        // 'build'
    ]);
};
