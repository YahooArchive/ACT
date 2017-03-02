//Gruntfile
module.exports = function(grunt) {
    grunt.initConfig({

        clean: {
            before: {
                src: ['docs/', 'examples/', 'enabler/', 'src/']
            },
            after: {
                src: ['temp_docs/', 'temp_examples/', 'temp_enabler/', 'temp_enabler_docs/', 'temp_src/']
            }
        },
        copy: {
            docs: {
                expand: true,
                cwd: 'temp_docs/',
                src: '**',
                dest: 'docs'
            },
            examples: {
                expand: true,
                cwd: 'temp_examples/',
                src: '**',
                dest: 'examples'
            },
            enabler: {
                expand: true,
                cwd: 'temp_enabler_docs',
                src: '**',
                dest: 'enabler'
            }, 
            src: {
            	expand: true, 
            	cwd: 'temp_src',
            	src: '**',
            	dest: 'src'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['clean:before', 'copy:docs', 'copy:examples', 'copy:enabler', 'copy:src']);
    grunt.registerTask('clear', ['clean:after']);
};