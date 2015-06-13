module.exports = function(grunt) {
    "use strict";

    //Load module Rewrite URL
    var modRewrite = require('connect-modrewrite');

    grunt.initConfig({
        // Wipe out previous builds and test reporting.
        clean: ["dist/", "test/reports"],

        // Run your source code through JSHint's defaults.
        jshint: {
            all : ["app/modules/**/*.jsx"],
            options: {
                smarttabs: true
            }
        },



        // This task uses James Burke's excellent r.js AMD builder to take all
        // modules and concatenate them into a single file.
        browserify: {
            dev: {
                // A single entry point for our app
                src: 'app/main.js',
                // Compile to a single file to add a script tag for in your HTML
                dest: 'dist/app.js',


                options : {
                    watch : true, // use watchify for incremental builds!
                    browserifyOptions : {
                        transform: [ require('grunt-react').browserify ],
                        extensions: ['.jsx']

                    }
                }

            },
            dist: {
                src: 'app/main.js',
                // Compile to a single file to add a script tag for in your HTML
                dest: 'dist/app.js'
            }
        },

        // This task simplifies working with CSS inside Backbone Boilerplate
        // projects.  Instead of manually specifying your stylesheets inside the
        // HTML, you can use `@imports` and this task will concatenate only those
        // paths.
        styles: {
            // Out the concatenated contents of the following styles into the below
            // development file path.
            "dist/styles.css": {
                // Point this to where your `index.css` file is location.
                src: "app/styles/styles.css",

                // The relative path to use for the @imports.
                paths: ["app/styles"],

                // Rewrite image paths during release to be relative to the `img`
                // directory.
                forceRelative: "/app/img/"
            }
        },


        // Minfiy the distribution CSS.
        cssmin: {
            release: {
                files: {
                    "dist/styles.min.css": ["dist/styles.css"]
                }
            }
        },

        sass: {                              // Task
            dist: {                            // Target
                options: {                       // Target options
                    style: 'expanded',
                    sourcemap: 'none'
                },
                files: {                         // Dictionary of files
                    'app/styles/styles.css': 'app/styles/scss/styles.scss'      // 'destination': 'source'
                }
            }
        },


        // UNIT TESTING
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        processhtml: {
            release: {
                files: {
                    "dist/index.html": ["index.html"]
                }
            }
        },

        // Move vendor and app logic during a build.
        copy: {
            release: {
                files: [
                    {
                        src: ["app/**"],
                        dest: "dist/"
                    },
                    {
                        src: "vendor/**",
                        dest: "dist/"
                    },
                    {
                        src:"*.png",
                        dest:"dist/"
                    }
                ]
            }
        },

        compress: {
            release: {
                options: {
                    archive: "dist/source.min.js.gz"
                },

                files: ["dist/source.min.js"]
            }
        },


        watch: {
            scripts: {
                files: ['app/**/**/*.js', 'app/**/**/*.jsx', 'app/styles/**/*.scss', 'app/**/*.html', 'index.html', 'app/modules/**/**/*.jsx'],
                tasks: ['sass', 'jshint'],
                options: {
                    livereload: true
                }
            }
        },

        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: '*',
                    open: true,
                    // Fix route #
                    middleware: function(connect, options) {
                        var middlewares;
                        middlewares = [];
                        middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]']));
                        options.base.forEach(function(base) {
                            return middlewares.push(connect["static"](base));
                        });
                        return middlewares;
                    }
                }
            }
        }
    });



    // Grunt contribution tasks.
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks("grunt-bbb-requirejs");
    grunt.loadNpmTasks("grunt-bbb-styles");
    grunt.loadNpmTasks("grunt-react");
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-jsxhint');
    grunt.loadNpmTasks('grunt-karma');

    // When running the default Grunt command, just lint the code.
    grunt.registerTask("default", [
        "clean",
        "processhtml",
        "copy",
        "browserify:dist",
        "styles",
        "cssmin",
        "jshint"
    ]);

    // Start server
    grunt.registerTask("server", [
        "browserify:dev",
        "connect",
        "watch"
    ]);




};