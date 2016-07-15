// Generated on 2014-07-31 using generator-angular 0.9.5
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    connect: 'grunt-connect-proxy'
  });
  //grunt.loadNpmTasks('grunt-connect-proxy');

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };


  // Define the configuration for all the tasks
  grunt.initConfig({

                     // Project settings
                     yeoman: appConfig,

                     // Watches files for changes and runs tasks based on the changed files
                     watch: {
                       bower: {
                         files: ['bower.json'],
                         tasks: ['wiredep']
                       },
                       js: {
                         files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                         tasks: ['newer:jshint:all'],
                         options: {
                           livereload: '<%= connect.options.livereload %>'
                         }
                       },
                       jsTest: {
                         files: ['test/spec/{,*/}*.js'],
                         tasks: ['newer:jshint:test', 'karma']
                       },
                       styles: {
                         files: ['<%= yeoman.app %>/sass/{,*/}*.scss','<%= yeoman.app %>/styles/{,*/}*.css'],
                         tasks: ['sass', 'newer:copy:styles', 'autoprefixer']
                       },
                       gruntfile: {
                         files: ['Gruntfile.js']
                       },
                       livereload: {
                         options: {
                           livereload: '<%= connect.options.livereload %>'
                         },
                         files: [
                           '<%= yeoman.app %>/{,*/}*.html',
                           '<%= yeoman.app %>/views/tmpl/{,*/}*.html',
                           '.tmp/styles/{,*/}*.css',
                           '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                         ]
                       }
                     },

                     // The actual grunt server settings
                     connect: {
                       options: {
                         port: 9000,
                         // Change this to '0.0.0.0' to access the server from outside.
                         hostname: '0.0.0.0',
                         livereload: 35729
                       },
                       proxies: [
                         {
                           context: '/Authenticate',
                           host: 'localhost',
                           port: 9999,
                           https: false,
                           xforward: false
                         }
                       ],
                       livereload: {
                         options: {
                           open: true,
                           middleware: function (connect) {
                             return [
                               require('grunt-connect-proxy/lib/utils').proxyRequest,
                               connect.static('.tmp'),
                               connect().use(
                                 '/bower_components',
                                 connect.static('./bower_components')
                               ),
                               connect.static(appConfig.app)
                             ];
                           }
                         }
                       },
                       test: {
                         options: {
                           port: 9001,
                           middleware: function (connect) {
                             return [
                               connect.static('.tmp'),
                               connect.static('test'),
                               connect().use(
                                 '/bower_components',
                                 connect.static('./bower_components')
                               ),
                               connect.static(appConfig.app)
                             ];
                           }
                         }
                       },
                       dist: {
                         options: {
                           open: true,
                           base: '<%= yeoman.dist %>',
                           middleware: function (connect) {
                             return [
                               require('grunt-connect-proxy/lib/utils')
                                 .proxyRequest,
                               connect.static(appConfig.dist)];
                           }
                         }
                       }
                     },

                     // Make sure code styles are up to par and there are no obvious mistakes
                     jshint: {
                       options: {
                         jshintrc: '.jshintrc',
                         reporter: require('jshint-stylish')
                       },
                       all: {
                         src: [
                           'Gruntfile.js',
                           '<%= yeoman.app %>/scripts/{,*/}*.js'
                         ]
                       },
                       test: {
                         options: {
                           jshintrc: 'test/.jshintrc'
                         },
                         src: ['test/spec/{,*/}*.js']
                       }
                     },

                     // compile sass files
                     sass: {
                       dist: {
                         files: [{
                           expand: true,
                           cwd: '<%= yeoman.app %>/sass',
                           src: ['*.scss'],
                           dest: '<%= yeoman.app %>/styles',
                           ext: '.css'
                         }],

                         options: {
                           loadPath: [
                             './bower_components/bourbon/dist'
                           ]
                         }
                       }
                     },

                     // Empties folders to start fresh
                     clean: {
                       dist: {
                         files: [{
                           dot: true,
                           src: [
                             '.tmp',
                             '<%= yeoman.dist %>/*',
                             '!<%= yeoman.dist %>/.git*'
                           ]
                         }]
                       },
                       server: '.tmp'
                     },

                     // Add vendor prefixed styles
                     autoprefixer: {
                       options: {
                         browsers: ['last 1 version']
                       },
                       dist: {
                         files: [{
                           expand: true,
                           cwd: '.tmp/styles/',
                           src: '{,*/}*.css',
                           dest: '.tmp/styles/'
                         }]
                       }
                     },

                     // Automatically inject Bower components into the app
                     wiredep: {
                       app: {
                         src: ['<%= yeoman.app %>/index.html'],
                         ignorePath: /\.\.\//
                       }
                     },

                     // Renames files for browser caching purposes
                     filerev: {
                       dist: {
                         src: [
                           '<%= yeoman.dist %>/scripts/scripts{,*/}*.js',
                           //          '<%= yeoman.dist %>/styles/{,*/}*.css',
                           //'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                           '<%= yeoman.dist %>/styles/fonts/*'
                         ]
                       }
                     },

                     // Reads HTML for usemin blocks to enable smart builds that automatically
                     // concat, minify and revision files. Creates configurations in memory so
                     // additional tasks can operate on them
                     useminPrepare: {
                       html: '<%= yeoman.app %>/index.html',
                       options: {
                         dest: '<%= yeoman.dist %>',
                         flow: {
                           html: {
                             steps: {
                               js: ['concat', 'uglifyjs'],
                               css: ['concat', 'cssmin']
                             },
                             post: {}
                           }
                         }
                       }
                     },

                     // Performs rewrites based on filerev and the useminPrepare configuration
                     usemin: {
                       html: ['<%= yeoman.dist %>/{,**/}*.html'],
                       css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
                       json: ['<%= yeoman.dist %>/scripts/jsons/*.json'],
                       js: ['<%= yeoman.dist %>/scripts/**/*.js', '!<%= yeoman.dist %>/scripts/vendor/**/*.js'],
                       options: {
                         assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images', '<%= yeoman.dist %>/styles'],
                         patterns: {
                           js: [
                             [/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']
                           ]
                         },
                         blockReplacements: {
                           js: function (block) {
                             var stmtArr = [];
                             if (block.dest.indexOf('vendor') != -1 || block.dest.indexOf('oldieshim') != -1) {
                               for (var i = 2; i < block.raw.length - 2; i++) {
                                 stmtArr.push(
                                   block.raw[i].replace(/bower_components.*\/([^\/]*\.js)/g, 'scripts/vendor/$1'));
                               }
                             } else {
                               for (var i = 1; i < block.raw.length - 1; i++) {
                                 stmtArr.push(block.raw[i].replace(/app\//g, ''));
                               }
                               stmtArr.push('<script src="' + block.dest + '"><\/script>');
                             }
                             grunt.log.writeln("Script tags : " + stmtArr);
                             return stmtArr.join('');
                           },
                           css: function (block) {
                             var stmtArr = [];
                             if (block.dest.indexOf('vendor') != -1) {
                               for (var i = 2; i < block.raw.length - 2; i++) {
                                 stmtArr.push(block.raw[i].replace(/bower_components.*\/([^\/]*\.css)/g, 'styles/$1'));
                               }
                             } else {
                               stmtArr.push('<link rel="stylesheet" href="' + block.dest + '" />');
                             }
                             grunt.log.writeln("CSS tags : " + stmtArr);
                             return stmtArr.join('');
                           }
                         }
                       }
                     },

                     // The following *-min tasks will produce minified files in the dist folder
                     // By default, your `index.html`'s <!-- Usemin block --> will take care of
                     // minification. These next options are pre-configured if you do not wish
                     // to use the Usemin blocks.
                     // cssmin: {
                     //   dist: {
                     //     files: {
                     //       '<%= yeoman.dist %>/styles/main.css': [
                     //         '.tmp/styles/{,*/}*.css'
                     //       ]
                     //     }
                     //   }
                     // },
                     // uglify: {
                     //   options: {
                     //    mangle: { except: ["$super"] }
                     //   }
                     //   dist: {
                     //     files: {
                     //       '<%= yeoman.dist %>/scripts/scripts.js': [
                     //         '<%= yeoman.dist %>/scripts/scripts.js'
                     //       ]
                     //     }
                     //   },
                     // },
                     // concat: {
                     //   dist: {}
                     // },

                     cssmin: {
                       options: {
                         processImport: false
                       },
                       dist: {
                         files: [{
                           expand: true,
                           cwd: 'dist/styles',
                           src: ['*.css'],
                           dest: '<%= yeoman.dist %>/styles'
                         }]
                       }
                     },

                     uglify: {
                       options: {
                         mangle: {
                           except: ['$super']
                         }
                       }
                     },

                     concat: {
                       options: {
                         sourceMap: false,
                         process: function (src, filepath) {
                           grunt.log.writeln(filepath);
                           if (filepath.indexOf('.css') != -1 && filepath.indexOf('main.css') == -1) {
                             grunt.file.copy(filepath,
                                             'dist/styles/' + filepath.substring(filepath.lastIndexOf("/") + 1));
                           } else if (filepath.indexOf('bower_components') != -1 && filepath.indexOf('.js') != -1) {
                             grunt.file.copy(filepath, 'dist/scripts/vendor/' + filepath.substring(
                                               filepath.lastIndexOf("/") + 1));
                           } else {
                             grunt.file.copy(filepath, filepath.replace(/app\//g, 'dist/'));
                           }
                           return filepath.indexOf('templateCache') != -1 || filepath.indexOf('main.css') != -1 ? src :
                             '';
                         }
                       }
                     },

                     imagemin: {
                       dist: {
                         files: [{
                           expand: true,
                           cwd: '<%= yeoman.app %>/images',
                           src: '{,*/}*.{png,jpg,jpeg,gif}',
                           dest: '<%= yeoman.dist %>/images'
                         }]
                       }
                     },

                     svgmin: {
                       dist: {
                         files: [{
                           expand: true,
                           cwd: '<%= yeoman.app %>/images',
                           src: '{,*/}*.svg',
                           dest: '<%= yeoman.dist %>/images'
                         }]
                       }
                     },

                     htmlmin: {
                       dist: {
                         options: {
                           collapseWhitespace: true,
                           conservativeCollapse: true,
                           collapseBooleanAttributes: false,
                           removeCommentsFromCDATA: true,
                           removeOptionalTags: true
                         },
                         files: [{
                           expand: true,
                           cwd: '<%= yeoman.dist %>',
                           src: ['*.html'],
                           dest: '<%= yeoman.dist %>'
                         }]
                       }
                     },

                     ngtemplates: {
                       dist: {
                         options: {
                           module: 'app',
                           htmlmin: '<%= htmlmin.dist.options %>',
                           usemin: 'scripts/scripts.js'
                         },
                         cwd: '<%= yeoman.app %>',
                         src: 'views/{,*/}*.html',
                         dest: '.tmp/templateCache.js'
                       }
                     },

                     // ngmin tries to make the code safe for minification automatically by
                     // using the Angular long form for dependency injection. It doesn't work on
                     // things like resolve or inject so those have to be done manually.
                     ngmin: {
                       dist: {
                         files: [{
                           expand: true,
                           cwd: '.tmp/concat/scripts',
                           src: '*.js',
                           dest: '.tmp/concat/scripts'
                         }]
                       }
                     },

                     // Replace Google CDN references
                     cdnify: {
                       dist: {
                         html: ['<%= yeoman.dist %>/*.html']
                       }
                     },

                     // Copies remaining files to places other tasks can use
                     copy: {
                       dist: {
                         files: [{
                           expand: true,
                           dot: true,
                           cwd: '<%= yeoman.app %>',
                           dest: '<%= yeoman.dist %>',
                           src: [
                             '*.{ico,png,txt}',
                             '.htaccess',
                             '*.html',
                             'views/**/*',
                             'images/{,*/}*.{webp,png,jpg,jpeg,gif}',
                             'fonts/*'
                           ]
                         }, {
                           expand: true,
                           cwd: '.tmp/images',
                           dest: '<%= yeoman.dist %>/images',
                           src: ['generated/*']
                         }, {
                           expand: true,
                           cwd: 'bower_components/bootstrap/dist',
                           src: 'fonts/*',
                           dest: '<%= yeoman.dist %>'
                         }, {
                           expand: true,
                           cwd: 'bower_components/simple-line-icons',
                           src: 'fonts/*',
                           dest: '<%= yeoman.dist %>'
                         }, {
                           expand: true,
                           cwd: 'bower_components/font-awesome',
                           src: 'fonts/*',
                           dest: '<%= yeoman.dist %>'
                         }, {
                           expand: true,
                           cwd: 'bower_components/weather-icons',
                           src: 'font/*',
                           dest: '<%= yeoman.dist %>'
                         }, {
                           expand: true,
                           cwd: '<%= yeoman.app %>/scripts',
                           src: ['jsons/**', 'modules/**', 'vendor/**'],
                           dest: '<%= yeoman.dist %>/scripts'
                         }]
                       },
                       styles: {
                         expand: true,
                         cwd: '<%= yeoman.app %>/styles',
                         dest: '.tmp/styles/',
                         src: '{,*/}*.css'
                       }
                     },

                     // Run some tasks in parallel to speed up the build process
                     concurrent: {
                       server: [
                         'copy:styles'
                       ],
                       test: [
                         'copy:styles'
                       ],
                       dist: [
                         'copy:styles',
                        // 'imagemin',
                         'svgmin'
                       ]
                     },

                     // Test settings
                     karma: {
                       unit: {
                         configFile: 'test/karma.conf.js',
                         singleRun: true
                       }
                     },

                     serve1: {
                       local: {
                         options: {
                           pretasks: [
                             'config_env:local'
                           ]
                         }
                       },
                       dev: {
                         options: {
                           pretasks: [
                             'config_env:dev'
                           ]
                         }
                       },
                       qa: {
                         options: {
                           pretasks: [
                             'config_env:qa'
                           ]
                         }
                       },
                       stg: {
                         options: {
                           pretasks: [
                             'config_env:stg'
                           ]
                         }
                       }
                     }
                   }
  )
  ;

  grunt.registerMultiTask('serve1', 'Serve', function () {
    var trg = grunt.config.get(this.name + '.options.target');
    if (trg) {
      grunt.log.error('Default task already executed');
      return;
    }
    grunt.config.set(this.name + '.options.target', this.target);
    console.log("Target : ", this.target);

    var options = this.options({
                                 dist: this.flags.dist || false,
                                 pretasks: [],
                                 tasks: ['clean:server',
                                         'wiredep',
                                         'concurrent:server',
                                         'sass',
                                         'autoprefixer',
                                         'configureProxies:server',
                                         'connect:livereload',
                                         'watch'],
                                 posttasks: []
                               });

    if (options.dist) {
      options.tasks = ['build:' + this.target, 'configureProxies:server', 'connect:dist:keepalive'];
    }

    grunt.log.ok("Options : ", options);
    if (options.pretasks && options.pretasks.length > 0) {
      grunt.log.writeln("Running Pre tasks", options.pretasks);
      grunt.task.run(options.pretasks);
    }
    grunt.log.writeln("Running Tasks", options.tasks);
    grunt.task.run(options.tasks);
    if (options.posttasks && options.posttasks.length > 0) {
      grunt.log.writeln("Running Post tasks", options.posttasks);
      grunt.task.run(options.posttasks);
    }
  })

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'configureProxies:server', 'connect:dist:keepalive']);
    }
    switch (target) {
      case "development":
        target = "dev";
        break;
      case "qa":
        target = "qa";
        break;
      case "production":
        target = "prod";
        break;
      case "stage":
        target = "stg";
        break;
      case "local":
        target = "local";
        break;
      case "local_int":
        target = "local_int";
        break;

    }

    grunt.task.run([
                     'clean:server',
                     'wiredep',
                     'config_env:' + target,
                     'concurrent:server',
                     'sass',
                     'autoprefixer',
                     'configureProxies:server',
                     'connect:livereload',
                     'watch'
                   ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', function (target) {

    if (target === undefined) {
      grunt.fail.fatal(
        "TARGET NOT SET\nYou need to declare which environment you want to build for.\nex. grunt build:development\n[development,integration,production]");
      return false;
    }

    var tasks = [
      'clean:dist',
      'wiredep',
      'useminPrepare',
      'concurrent:dist',
      'autoprefixer',
      'concat',
      'copy:dist',
      'cdnify',
      'cssmin',
      'uglify',
      'filerev',
      'usemin',
      'htmlmin'
    ];

    switch (target) {
      case "local":
        tasks.unshift('config_env:local');
        break;
      case "local_int":
        tasks.unshift('config_env:local_int');
        break;
      case "qa":
      case "qa":
        tasks.unshift('config_env:qa');
        break;
      case "prod":
      case "production":
        tasks.unshift('config_env:prod');
        break;
      case "stg":
      case "stage":
        tasks.unshift('config_env:stg');
        break;
      case "dev":
      case "development":
        tasks.unshift('config_env:dev');
        break;

    }

    grunt.task.run(tasks);

  });

  grunt.registerTask('config_env', function (target) {

    if (target.toString() === "undefined") {
      grunt.fail.fatal(
        "TARGET NOT SET\nYou need to declare which environment you want to build for.\nex. grunt build:development\n[development,integration,production]");
      return false;
    }

    switch (target) {
      //allowed env targets
      case 'local':
      case 'local_int':
      case 'qa':
      case 'stg':
      case 'prod': //local ui, int api
      case 'stg':
      case 'dev':
        break;
      default:
        grunt.fail.fatal("INVALID TARGET\n" + target + " is not a known environment");
        return false;
    }

    //Copy env specific constants file
    grunt.file.copy("env/" + target + "/constants.js", "app/scripts/constants.js");
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
}
;
