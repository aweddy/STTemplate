var os = require('os');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['<%= pkg.path.src.js %>/**/*.js']
    },
    concat: {
      cutup: {
        src: ['<%= pkg.path.cutup.js %>/plugins/**/*.js', '<%= pkg.path.src.js %>/**/*.js'],
        dest: '<%= pkg.path.cutup.js %>/scripts.js'
      }
    },
    uglify: {
      options: {
        mangle: {
          except: ['jQuery']
        },
        preserveComments: 'none',
        sourceMap: true
      },
      '<%= pkg.path.cutup.js %>/scripts.min.js': ['<%= pkg.path.cutup.js %>/scripts.js']
    },
    sass: {
      options: {
        sourceMap: true,
        outputStyle: 'compressed'
      },
      cutup: {
        files: {
          '<%= pkg.path.cutup.css %>/screen.css' : '<%= pkg.path.src.sass %>/screen.scss'
        }
      }
    },
    autoprefixer: {
      options: {
        // Task-specific options go here.
        browsers: ['last 2 versions', 'ie 8', 'ie 9'],
        map: true
      },
      cutup: {
        src: "<%= pkg.path.cutup.css %>/screen.css",
        dest: "<%= pkg.path.cutup.css %>/screen.css"
      }
    },
    combine_mq: {
      cutup: {
        expand: true,
        cwd: "<%= pkg.path.cutup.css %>",
        src: "**/*.css",
        dest: "<%= pkg.path.cutup.css %>",
        ext: ".css"
      }
    },
    cssmin: {
      cutup: {
        keepSpecialComments: true,
        expand: true,
        cwd: '<%= pkg.path.cutup.css %>/',
        src: ['*.css', '!*.min.css'],
        dest: '<%= pkg.path.cutup.css %>/',
        ext: '.min.css'
      }
    },  
    imagemin: {
      cutup: {
        options: {
          optimizationLevel: 7
        },
        files: [{
          expand: true,
          cwd: '<%= pkg.path.src.img %>/',
          src: '**/*.{jpg,png,gif,svg}',
          dest: '<%= pkg.path.cutup.img %>/'
        }]
      }
    },
    express: {
      dev: {
        options: {
          script: 'index.js',
          port:1337
        }
      },
      crawler:{
        options: {
          script: 'crawler.js',
          port:8080
        }        
      }
    },
    webfont: {
      icons: {
        src: '<%= pkg.path.src.font %>/icons/*.svg',
        dest: '<%= pkg.path.cutup.font %>',
        destCss: '<%= pkg.path.src.sass %>',
        options: {
          engine: os.platform() === 'win32' ? 'node' : 'fontforge',
          font: 'fontcustom',
          hashes: false,
          stylesheet: 'scss',
          relativeFontPath: '/library/fonts/',
          template: '<%= pkg.path.src.font %>/fontcustom.css',
          templateOptions: {
            baseClass: "",
            classPrefix: 'icon-',
            mixinPrefix: 'icon-'
          }
        }
      }
    },    
    clean: ["library/**/tmp"],
    watch: {      
      options: { livereload: true },
      scripts: {
        files: ['<%= pkg.path.cutup.js %>/plugins/*.js', '<%= pkg.path.src.js %>/*.js'],
        tasks: ['js']
      },
      css: {
        files: '<%= pkg.path.src.sass %>/**/*.scss',
        tasks: ['css']
      },
      img: {
        files: '<%= pkg.path.src.img %>/**/*.{jpg,gif,png,svg}',
        tasks: ['img']
      },
      html: {
        files: '**/*.html',
        tasks: []
      }
    },
    githooks: {
      all: {
        'post-merge': 'post-merge'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-combine-mq');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-npm-install');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-webfont');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('js', ['jshint', 'concat', 'uglify', 'clean']);
  grunt.registerTask('css', ['sass', 'autoprefixer', 'combine_mq', 'cssmin', 'clean']);
  grunt.registerTask('img', ['newer:imagemin']);
  grunt.registerTask('post-merge', ['npm-install', 'default']);
  grunt.registerTask('server', ['express:dev', 'express:crawler', 'watch', ]);
  grunt.registerTask('default', ['js', 'css:development', 'img', 'server']);
}