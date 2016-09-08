var path = require('path');
var tempAssets = [];
var temCoreLink = "";

function fixXUnitXML() {
	var fs = require('fs');
	var path = 'artifacts/test/test.xml';
	var xml = fs.readFileSync(path, 'utf8');
	xml = '<testsuites>' + xml + '</testsuites>';
	fs.writeFileSync(path, xml);
}

function getDateStr() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    yyyy = "" + yyyy;
    var yy = yyyy.substr(2, 2);

    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    return yy + mm + dd;
}

function getFullPath(filesArr, path) {
    var p = path ? path : "";
    var f = filesArr && filesArr.length > 0 ? filesArr : [];
    var res = [];

    for (var i = 0; i < f.length; i++) {
        res.push(p + f[i]);
    }
    return res;
}

module.exports = function(grunt) {
    var dateStr = getDateStr();
    var debug = 'build/debug/';
    var deploy = 'build/deploy/';
    var min = 'build/min/';

    var base_files = [
        "core/ACT.js",
        "core/ACT_actionsQueue.js",
        "core/ACT_base.js",
        "core/ACT_cookie.js",
        "core/ACT_environment.js",
        "core/ACT_Layerslist.js",
        "core/ACT_layerStandard.js",
        "core/ACT_scaffolding.js",
        "core/ACT_Screen.js",
        "core/ACT_secureDarla.js",
        "core/ACT_StandardAd.js",
        "core/ACT_tracking.js",
        "library/ACT_AdobeEdgeBridge.js",
        "library/ACT_animation.js",
        "library/ACT_capability.js",
        "library/ACT_class.js",
        "library/ACT_customData.js",
        "library/ACT_DwellTime.js",
        "library/ACT_dom.js",
        "library/ACT_event.js",
        "library/ACT_flash.js",
        "library/ACT_IO.js",
        "library/ACT_json.js",
        "library/ACT_lang.js",
        "library/ACT_SWFBridge.js",
        "library/ACT_UA.js",
        "library/ACT_util.js",
        "library/ACT_VideoEvents.js",
        // Adding back contentSwf
        "capabilities/ACT_contentSwf.js",
        // Adding back contentVideoFlash
        "capabilities/ACT_contentVideoFlash.js",
        "capabilities/ACT_contentContainer.js",
        "capabilities/ACT_contentCarousel.js",
        "capabilities/ACT_contentHtml5.js",
        "capabilities/ACT_contentImage.js",
        "capabilities/ACT_contentThirdParty.js",
        "capabilities/ACT_contentVideoHtml.js",
        "capabilities/ACT_contentYoutube.js",
        "capabilities/ACT_contentYtv.js"

    ];
    var enablerFiles = [
        "core/ACT.js",
        "library/ACT_dom.js",
        "library/ACT_Enabler.js",
        "library/ACT_event.js",
        "library/ACT_lang.js",
        "library/ACT_UA.js",
        "library/ACT_VideoEvents.js",
        "library/ACT_json.js",
        "core/ACT_tracking.js",
        "library/ACT_util.js",
        "core/ACT_actionsQueue.js"
    ];
    var enablerPublic = [
        "library/ACT_dom.js",
        "library/ACT_Enabler.js",
        "library/ACT_event.js",
        "library/ACT_lang.js",
        "library/ACT_UA.js",
        "library/ACT_json.js",
        "library/ACT_util.js"
    ];
    var baseDebug = getFullPath(base_files, debug);
    baseDebug.push(debug + 'library/ACT_debug.js');
    var base = getFullPath(base_files, deploy);
    var base_min = getFullPath(base_files, min);
    var enabler = getFullPath(enablerFiles, deploy);
    var enablerDebug = getFullPath(enablerFiles, debug);
    enablerDebug.push(debug + 'library/ACT_debug.js');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            debug: {
                src: baseDebug,
                dest: debug + 'ACT.core.js'
            },
            enablerDebug: {
                src: enablerDebug,
                dest: debug + 'ACT_Enabler.js'
            },
            deploy: {
                src: base,
                dest: deploy + 'ACT.core.js'
            },
            enabler: {
                src: enabler,
                dest: deploy + 'ACT_Enabler.js'
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'src/',
                src: '**',
                dest: debug
            },
            assets: {
                expand: true,
                cwd: debug + 'assets/',
                src: '**',
                dest: min + 'assets/'
            },
            examples: {
                expand: true,
                cwd: 'ad-products/',
                src: '**/production/**',
                dest: 'temp_examples/'
            },
            enabler_docs: {
                expand: true,
                cwd: 'src/',
                src: enablerPublic,
                dest: 'temp_enabler/'
            }
        },
        debug_code_remover: {
            main: {
                files: [{
                    expand: true,
                    cwd: debug,
                    src: ["**/*.js", 'assets/**'],
                    dest: deploy
                }]
            }
        },
        instrument: {
            files: 'src/!(assets)/*.js',
            options: {
                lazy: true,
                basePath: 'artifacts/instrument/'
            }
        },
        mocha: {
            test: {
                src: ['test/capabilities/**/index.html', 'test/core/**/index.html', 'test/library/**/index.html'],
                dest: "artifacts/test/test.xml"
            },
            options: {
                run: true,
                timeout: 20000,
                reporter: process.env.SCREWDRIVER ? 'XUnit' : 'Dot',
                coverage: {
                    jsonReport: 'artifacts/coverage/'
                },
                page: {
                    settings: {
                        resourceTimeout: 60000
                    }
                }
            }
        },
        makeReport: {
            src: 'artifacts/coverage/*.json',
            options: {
                type: 'lcov',
                dir: 'artifacts/coverage/',
                print: 'detail'
            }
        },
        uglify: {
            my_target: {
                files: [{
                    expand: true,
                    cwd: deploy,
                    src: "**/*.js",
                    dest: min
                }]
            }
        },
        yuidoc: {
            all: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.url %>',
                options: {
                    paths: 'src/',
                    themedir: 'doc_themes/default/',
                    outdir: 'temp_docs/',
                    tabtospace: 2
                }
            },
            enabler: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.url %>',
                options: {
                    paths: 'temp_enabler/',
                    themedir: 'doc_themes/default/',
                    outdir: 'temp_enabler_docs/',
                    tabtospace: 2
                }
            }
        },
       	eslint: {
			target: ['./src/']
		},
        'compile-handlebars': {
            'integration-tests': {
                files: [{
                    expand: true,
                    src: 'test/integration/**/*.html',
                    dest: 'temp_integration/',
                    flatten: true,
                    ext: '.html'
                }],
                templateData: {
                    'ACTJS_core_file': '<%= grunt.option("actjscore_candidate") %>'
                }
            },
        },
        'string-replace': {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'temp_docs/',
                    src: '**/*.html',
                    dest: 'temp_docs/'
                }],
                options: {
                    replacements: [{
                        pattern: 'http://yui.yahooapis.com/3.9.1/build/cssgrids/cssgrids-min.css',
                        replacement: 'https://s.yimg.com/zz/combo?yui-s:3.14.1/build/cssgrids/cssgrids-min.css'
                    }, {
                        pattern: 'http://yui.yahooapis.com/combo?3.9.1/build/yui/yui-min.js',
                        replacement: 'https://s.yimg.com/zz/combo?yui-s:3.14.1/yui/yui-min.js'
                    }]
                }
            },
            enabler: {
                files: [{
                    expand: true,
                    cwd: 'temp_enabler_docs/',
                    src: '**/*.html',
                    dest: 'temp_enabler_docs/'
                }],
                options: {
                    replacements: [{
                        pattern: 'http://yui.yahooapis.com/3.9.1/build/cssgrids/cssgrids-min.css',
                        replacement: 'https://s.yimg.com/zz/combo?yui-s:3.14.1/build/cssgrids/cssgrids-min.css'
                    }, {
                        pattern: 'http://yui.yahooapis.com/combo?3.9.1/build/yui/yui-min.js',
                        replacement: 'https://s.yimg.com/zz/combo?yui-s:3.14.1/yui/yui-min.js'
                    }]
                }
            }
        },
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-debug-code-remover');
    grunt.loadNpmTasks('grunt-mocha-phantom-istanbul');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-compile-handlebars');
    grunt.loadNpmTasks('grunt-eslint');
	grunt.registerTask('fixXUnitXML', fixXUnitXML);
    grunt.registerTask('debug', ['debug_code_remover']);
    grunt.registerTask('build', ['copy', 'concat:debug', 'concat:enablerDebug', 'debug_code_remover', 'concat:deploy', 'concat:enabler', 'uglify', 'copy:assets']);
    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('test', ['instrument', 'mocha', 'fixXUnitXML', 'makeReport']);
    grunt.registerTask('docs', ['yuidoc:all', 'copy:enabler_docs', 'yuidoc:enabler', 'string-replace', 'copy:examples']);
    grunt.registerTask('default', ['lint', 'test']);
};
