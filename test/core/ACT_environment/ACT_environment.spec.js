var expect = chai.expect;

var UA = ACT.UA;

describe("ACT.Environment", function() {

    /* ACT.Environment test */
    it("should have ACT.Environment instance", function() {
        expect(ACT.Environment).to.exist;
    });


    /* Test Attributes */
    describe("attributes", function() {
        it("should have ATTRS defined", function() {
            expect(ACT.Environment.ATTRS).to.exist;
        });

        it("should have ATTRS.version defined", function() {
            expect(ACT.Environment.ATTRS.version).to.exist;
        });

        it("should have ATTRS.NAME defined", function() {
            expect(ACT.Environment.ATTRS.NAME).to.exist;
        });

        it("should have ATTRS.forceEnv defined", function() {
            expect(ACT.Environment.ATTRS.forceEnv).to.exist;
        });

        it("should have ATTRS.forcedFlash defined", function() {
            expect(ACT.Environment.ATTRS.forcedFlash).to.exist;
        });

        it("should have ATTRS.forcedHTML5 defined", function() {
            expect(ACT.Environment.ATTRS.forcedHTML5).to.exist;
        });

        it("should have ATTRS.forcedBackup defined", function() {
            expect(ACT.Environment.ATTRS.forcedBackup).to.exist;
        });

        it("should have ATTRS.forcedMobile defined", function() {
            expect(ACT.Environment.ATTRS.forcedBackup).to.exist;
        });

        it("should have ATTRS.forcedTablet defined", function() {
            expect(ACT.Environment.ATTRS.forcedBackup).to.exist;
        });

        it("should have ATTRS.currentEnvPlaying defined", function() {
            expect(ACT.Environment.ATTRS.currentEnvPlaying).to.exist;
        });
    });

    /* Force Enviroments */
    describe("force enviroments", function() {
        var UATest = {
            "html": {},
            "os": {
                "name": "macintosh",
                "version": 0
            },
            "browser": {
                "name": "FireFox",
                "version": 38
            },
            "ie": 0,
            "firefox": 38,
            "safari": 0,
            "chrome": 0,
            "webkit": 0,
            "flash": 17,
            "dragDrop": true,
            "canvasText": true,
            "canvas": true,
            "audio": true,
            "video": true,
            "isHtml5Supported": true
        }

        var envConfig = {
            forcedBackupList: {
                "FireFox": "*",
            },
            forcedFlashList: {
                "Safari": "*"
            },
            forcedHTML5List: {}
        }

        it("should play backup in firefox when all the versions '*' are forced ", function() {

            var env = new ACT.Environment({
                forceEnv: envConfig
            });
            //UA: UATest
            env.forceEnv(UATest);
            var envToPlay = env.checkEnv();

            expect(envToPlay).to.equal("backup");

            env.destroy();
        });

        it("should play all in firefox when all browsers are forced ", function() {

            var env = new ACT.Environment({
                forceEnv: {
                    forcedBackupList: {
                        "allBrowsers": "*"
                    }
                }
            });
            //UA: UATest
            env.forceEnv(UATest);
            var envToPlay = env.checkEnv();

            expect(envToPlay).to.equal("backup")
            env.destroy();
        });


        it("should play flash in Safari when flash is forced and playable", function() {
            var _UATest = UATest;
            //_UATest.flash = 20;
            _UATest.browser.name = "Safari";
            _UATest.browser.version = 10;


            var env = new ACT.Environment({
                forceEnv: envConfig
            });
            env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();
            expect(envToPlay).to.equal("flash")

            env.destroy();
        });


        it("should play backup in Safari when flash is forced but it is not available", function() {
            var _UATest = UATest;
            _UATest.flash = 0;
            _UATest.browser.name = "Safari";
            _UATest.browser.version = 10;


            var env = new ACT.Environment({
                forceEnv: envConfig
            });
            env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();

            expect(envToPlay).to.equal("backup")

            env.destroy();
        });


        it("should play html in Chrome", function() {
            var _UATest = UATest;
            _UATest.flash = 0;
            _UATest.browser.name = "Chrome";
            _UATest.browser.version = 10;


            var env = new ACT.Environment({
                forceEnv: envConfig
            });
            env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();

            expect(envToPlay).to.equal("html")

            env.destroy();
        });


        it("should play backup in Chrome version 5", function() {

            var temEnv = envConfig;
            temEnv.forcedBackupList = {
                Chrome: "5"
            }

            var _UATest = UATest;
            _UATest.browser.name = "Chrome";
            _UATest.browser.version = 5;


            var env = new ACT.Environment({
                forceEnv: envConfig
            });
            env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();

            expect(envToPlay).to.equal("backup")

            env.destroy();
        });


        it("should play flash in Chrome versions lower 10", function() {

            var temEnv = envConfig;

            temEnv.forcedBackupList = {}

            temEnv.forcedFlashList = {
                Chrome: "<=10"
            }

            var _UATest = UATest;
            _UATest.flash = 1;
            _UATest.browser.name = "Chrome";
            _UATest.browser.version = 5;


            var env = new ACT.Environment({
                forceEnv: envConfig
            });
            env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();

            expect(envToPlay).to.equal("flash")

            env.destroy();
        });

		it("should play flash in Chrome versions lower 10", function() {

            var temEnv = envConfig;

            temEnv.forcedBackupList = {}

            temEnv.forcedFlashList = {
                Chrome: "<10"
            }

            var _UATest = UATest;
            _UATest.flash = 1;
            _UATest.browser.name = "Chrome";
            _UATest.browser.version = 9;

            var env = new ACT.Environment({
                forceEnv: envConfig
            });
                        
            env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();
            expect(envToPlay).to.equal("flash")

			_UATest.browser.version = 10;
			env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();
            expect(envToPlay).to.equal("html")

            env.destroy();
        });

		it("should play flash in Chrome versions higher than 10", function() {

            var temEnv = envConfig;

            temEnv.forcedBackupList = {}

            temEnv.forcedFlashList = {
                Chrome: ">10"
            }

            var _UATest = UATest;
            _UATest.flash = 1;
            _UATest.browser.name = "Chrome";
            _UATest.browser.version = 11;

            var env = new ACT.Environment({
                forceEnv: envConfig
            });
                        
            env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();
            expect(envToPlay).to.equal("flash")

			_UATest.browser.version = 10;
			env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();
            expect(envToPlay).to.equal("html")

            env.destroy();
        });

        it("should play flash in Chrome versions greater 10", function() {

            var temEnv = envConfig;
            temEnv.forcedFlashList = {
                Chrome: ">=10"
            }

            var _UATest = UATest;
            _UATest.flash = 1;
            _UATest.browser.name = "Chrome";
            _UATest.browser.version = 15;


            var env = new ACT.Environment({
                forceEnv: envConfig
            });
            env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();

            expect(envToPlay).to.equal("flash")

            env.destroy();
        });

        it("should play flash in Firefox versions 3,5,8", function() {

            var temEnv = envConfig;
            temEnv.forcedFlashList = {
                Firefox: "3,5,8"
            }

            var _UATest = UATest;
            _UATest.flash = 1;
            _UATest.browser.name = "Firefox";
            _UATest.browser.version = 5;


            var env = new ACT.Environment({
                forceEnv: envConfig
            });
            env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();

            expect(envToPlay).to.equal("flash")

            env.destroy();
        });

        it("should play mobile in Safari", function() {

            var temEnv = envConfig;
            temEnv.forcedMobileList = {
                Safari: "*"
            }

            var _UATest = UATest;
            _UATest.isMobile = true;
            _UATest.browser.name = "Safari";
            _UATest.browser.version = 15;


            var env = new ACT.Environment({
                forceEnv: envConfig
            });
            env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();

            expect(envToPlay).to.equal("mobile");

            env.destroy();
        });


        it("should play tablet in Safari", function() {

            var temEnv = envConfig;
            temEnv.forcedMobileList = {};
            temEnv.forcedTabletList = {
                Safari: "*"
            }

            var _UATest = UATest;
            _UATest.isTablet = true;
            _UATest.browser.name = "Safari";
            _UATest.browser.version = 15;


            var env = new ACT.Environment({
                forceEnv: envConfig
            });
            env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();

            expect(envToPlay).to.equal("tablet");

            env.destroy();
        });

        it("should play backup when tablet does not support html5", function() {

            var temEnv = envConfig;
            temEnv.forcedMobileList = {};
            temEnv.forcedTabletList = {
                Safari: "*"
            }

            var _UATest = UATest;
            _UATest.isTablet = true;
            _UATest.isHtml5Supported = false;
            _UATest.browser.name = "Safari";
            _UATest.browser.version = 15;


            var env = new ACT.Environment({
                forceEnv: envConfig
            });
            env.forceEnv(_UATest);
            var envToPlay = env.checkEnv();

            expect(envToPlay).to.equal("backup");

            env.destroy();
        });

    });

    describe('forceByBrowserVersion function', function() {
        UATest = {
            "browser": {
                "name": "FireFox",
                "version": 38
            }
        };

        var envConfig = {
            forcedBackupList: {},
            forcedFlashList: {},
            forcedHTML5List: {}
        }

        var env;
        before(function(){
	 		env = new ACT.Environment({
	            forceEnv: envConfig
	        });
	        env.forceEnv(UATest);
 		});

 		after(function(){
 			env.destroy();
 		});

        it ('should return true if current browser is in browser list', function(){
        	var result = env.forceByBrowserVersion('37,38,39,40');
        	expect(result).to.be.true;
        });

        it ('should return false if current browser is not in browser list', function(){
        	var result = env.forceByBrowserVersion('41,42');
        	expect(result).to.be.false;
        });
    });

    /* Helper function */
    describe("env:envRendered event", function() {

        var UATest = {
            "html": {},
            "os": {
                "name": "macintosh",
                "version": 0
            },
            "browser": {
                "name": "FireFox",
                "version": 38
            },
            "ie": 0,
            "firefox": 38,
            "safari": 0,
            "chrome": 0,
            "webkit": 0,
            "flash": 17,
            "dragDrop": true,
            "canvasText": true,
            "canvas": true,
            "audio": true,
            "video": true,
            "isHtml5Supported": true
        }

        var envConfig = {
            forcedBackupList: {
                "FireFox": "*",
            },
            forcedFlashList: {
                "Safari": "*"
            },
            forcedHTML5List: {}
        }

        it('should return current playing environment', function(done) {
            var env = new ACT.Environment({
                forceEnv: envConfig
            });
            env.forceEnv(UATest);
            env.checkEnv();

            var listener = ACT.Event.on('env:envRendered:Done', function(data) {
                listener.remove();

                expect(data).to.equal('backup');

                done();
            });

            ACT.Event.fire('env:envRendered');

            env.destroy();
        });
    });

});
