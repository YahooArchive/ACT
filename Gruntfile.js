var path = require('path');
var tempAssets = [];
var temCoreLink = "";

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
        "core/ACT_TrackingFacade.js",
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
        "library/ACT_class.js",
        "library/ACT_lang.js",
        "library/ACT_UA.js",
        "library/ACT_VideoEvents.js",
        "library/ACT_json.js",
        "core/ACT_TrackingFacade.js",
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
    var base = getFullPath(base_files, deploy);
    var base_min = getFullPath(base_files, min);
    var enabler = getFullPath(enablerFiles, deploy);
    var enablerDebug = getFullPath(enablerFiles, debug);

    baseDebug.push(debug + 'library/ACT_debug.js');
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
                cwd: 'examples/',
                src: '**',
                dest: 'temp_examples/'
            },
            enabler_docs: {
                expand: true,
                cwd: 'src/',
                src: enablerPublic,
                dest: 'temp_enabler/'
            },
            src: {
                expand: true,
                cwd: 'src/',
                src: '**',
                dest: 'temp_src/'
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
        karma: {
            unit: {
                options: {
                    files: [
                        'node_modules/chai/chai.js',
                        'test/vendor/sinon.js',
                        'test/globals.js',
                        'src/core/ACT.js',
                        'src/**/*.js',
                        'test/**/*.js'
                    ],
                    exclude: [
                        'src/capabilities/ACT_capability-skeleton.js',
                        'test/integration/**/*.js'
                    ],
                    basePath: '',
                    autoWatch: true,
                    singleRun: true,
                    frameworks: ['mocha'],
                    browsers: ['PhantomJS'],
                    //browserNoActivityTimeout: 100000,
                    reporters: ['progress', 'coverage', 'tap', 'junit'],
                    preprocessors: {
                        'src/**/*.js': ['coverage']
                    },
                    coverageReporter: {
                        type: 'lcov',
                        dir: 'artifacts/',
                        subdir: 'coverage/'
                    },
                    tapReporter: {
                        outputFile: 'test/results.tap'
                    },
                    junitReporter: {
                        outputDir: 'artifacts/test', // results will be saved as $outputDir/$browserName.xml
                        outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
                        suite: '', // suite will become the package name attribute in xml testsuite element
                        useBrowserName: false // add browser name to report and classes names
                    }
                }
            }
        },
        mocha: {
            test: {
                src: ['./test/**/*.html']
            },
            options: {
                run: true
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
                logo: '<%= pkg.logoURL %>',
                type: 'doc',
                options: {
                    paths: 'src/',
                    themedir: 'doc_themes/default/',
                    outdir: 'temp_docs/',
                    tabtospace: 2,
                    helpers: ["doc_themes/preprocessor/process.js"]
                }
            },
            enabler: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.url %>',
                logo: '<%= pkg.logoURL %>',
                type: 'enabler',
                options: {
                    paths: 'temp_enabler/',
                    themedir: 'doc_themes/default/',
                    outdir: 'temp_enabler_docs/',
                    tabtospace: 2,
                    helpers: ["doc_themes/preprocessor/process.js"]
                }
            }
        },
        'docs-demo': {
            demo: {
                options: {
                    src: ['examples'],
                    storePath: 'temp_docs/demo/',
                    filter: {
                        ok:['js', 'html', 'json'],
                        ignore: ['asset', '.DS_Store'],
                        folder_ok: false
                    },
                    template: './doc_themes/default/layouts/main.handlebars'
                }
            },
            demoEnabler: {
                options: {
                    src: ['examples'],
                    storePath: 'temp_enabler_docs/demo/',
                    filter: {
                        ok:['js', 'html', 'json'],
                        ignore: ['asset', '.DS_Store'],
                        folder_ok: ['enabler']
                    },
                    template: './doc_themes/default/layouts/main.handlebars'
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
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-compile-handlebars');
    grunt.loadNpmTasks('grunt-eslint');
    // load the extra tasks defined in the ./tasks folder
    grunt.loadTasks('tasks');
    grunt.registerTask('debug', ['debug_code_remover']);
    grunt.registerTask('build', ['copy', 'concat:debug', 'concat:enablerDebug', 'debug_code_remover', 'concat:deploy', 'concat:enabler', 'uglify', 'copy:assets']);
    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('docs', ['yuidoc:all', 'copy:enabler_docs', 'yuidoc:enabler', 'docsdemo', 'string-replace', 'copy:examples', 'copy:src']);
    grunt.registerTask('docsdemo', ['docs-demo:demo', 'docs-demo:demoEnabler']);
    grunt.registerTask('default', ['lint', 'test']);
};
