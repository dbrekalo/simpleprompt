/* jshint node: true */
module.exports = function(grunt) {

    grunt.initConfig({

        uglify: {
            min: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**/*.js',
                    dest: 'dist',
                    ext: '.min.js'
                }],
                options: {

                }
            }
        },

        copy: {
            jsFiles: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.js'],
                    dest: 'dist'
                }]
            }
        },

        jshint: {
            options: {
                'jshintrc': '.jshintrc'
            },
            all: ['src', 'test/**/*.js', 'Gruntfile.js']
        },

        jscs: {
            options: {
                config: '.jscsrc'
            },
            scripts: {
                files: {
                    src: ['src/**/*.js', 'test/**/*.js']
                }
            }
        },

        sass: {
            min: {
                files: {
                    'dist/prompt.min.css': 'src/prompt.scss'
                },
                options: {
                    outputStyle: 'compressed',
                    sourceMap: false,
                    precision: 5
                }
            },
            expandend: {
                files: {
                    'dist/prompt.css': 'src/prompt.scss'
                },
                options: {
                    outputStyle: 'compressed',
                    sourceMap: false,
                    precision: 5
                }
            }
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                commitFiles: ['package.json', 'bower.json'],
                tagName: '%VERSION%',
                push: false
            }
        },

        watch: {
            jsFiles: {
                expand: true,
                files: ['src/**/*.js'],
                tasks: ['jshint', 'jscs', 'copy','uglify'],
                options: {
                    spawn: false
                }
            },
            cssFiles: {
                expand: true,
                files: ['src/**/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            },
            testFiles: {
                expand: true,
                files: ['test/**/*.js'],
                tasks: ['jshint', 'jscs'],
                options: {
                    spawn: false
                }
            }
        }

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['jshint', 'jscs', 'sass', 'uglify', 'copy']);

};
