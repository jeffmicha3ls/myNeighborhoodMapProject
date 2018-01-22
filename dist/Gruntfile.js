module.exports = function(grunt) {

  grunt.initConfig({
    uglify : {
	     options : {
		        banner : "/*! javascript file */\n"
	     },
	     files : {
			      src: 'js/vm.js',
            dest: 'js/vm.min.js'
       }
    },

    htmlmin: {
      dist: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      files: {
      'index.min.html': 'index.html'
      }
      }
    },

    cssmin: {
      dist:{
        files: {
          'css/style.min.css':'css/style.css'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['htmlmin', 'cssmin', 'uglify']);

};
