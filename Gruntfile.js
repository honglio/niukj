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
        dist: 'dist',
        test: 'test',
        hbs: ['<%= yeoman.app %>/templates/**/*.hbs', '<%= yeoman.app %>/js/common/web/widgets/templates/*.hbs'],
        jsApp: '<%= yeoman.app %>/js/**/*.js',
        jsServer: ['<%= yeoman.server %>/models/**/*.js', '<%= yeoman.server %>/controllers/**/*.js'],
        jade: '<%= yeoman.server %>/views/**/*.jade',
        css: '{.tmp,<%= yeoman.app %>}/css/**/*.css'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,

        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/modules/**/*.js',
                '<%= yeoman.app %>/present_dependence/**/*.js',
                '<%= yeoman.app %>/scripts/**/*.js',
                '!<%= yeoman.app %>/scripts/libs/**/*.js',
                '!<%= yeoman.app %>/scripts/templates/app-templates.js',
                'test/spec/**/*.js',
                'server/**/*.js',
                '*.js'
            ]
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            strict: {
                options: {
                    import: 2
                },
                src: ['<%= yeoman.app %>/styles/**/*.css']
            },
            lax: {
                options: {
                    import: false
                },
                src: ['<%= yeoman.app %>/styles/**/*.css']
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

    grunt.registerTask('server', function(target) {
        grunt.task.run([
            'clean:server',
            'express:dev',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'mocha'
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
        'jshint',
        'csslint',
        // 'test',
        // 'build'
    ]);
};
