var expect = chai.expect;

describe('ACT.UA:', function () {

    /**
     * Set of sample OS UserAgent strings to test against
     *     str: recieved UserAgent string
     *     name: expected returned name
     *     version: expected version to be detected
     *     browser: name ( lower case ) of the browser to be detected in the UserAgent string
     *     device: device ( lower case ) to be detected from the UserAgent string
     */
    var OSStrings = [{
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E8301 Safari/602.1',
            version: 10,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'android',
            str: 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19',
            version: 4,
            browser: 'chrome',
            device: 'mobile'
        }, {
            name: 'android',
            str: 'Mozilla/5.0 (Android; 4.0.4; Google Pixel Build) AppleWebKit/535.19(KHTML, like Gecko) Chrome/Chrome/43.0.2357.65 Safari/535.19',
            version: 4,
            browser: 'chrome',
            device: 'tablet'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53',
            version: 7,
            browser: 'safari',
            device: 'tablet'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25',
            version: 6,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B206 Safari/7534.48.3',
            version: 5,
            browser: 'safari',
            device: 'tablet'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11A465 Twitter for iPhone',
            version: 7,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53',
            version: 7,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11A4449d Twitter for iPhone',
            version: 7,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11A465',
            version: 7,
            browser: 'safari',
            device: 'tablet'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11A465 Twitter for iPhone',
            version: 7,
            browser: 'safari',
            device: 'tablet'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25',
            version: 6,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPad; CPU OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25',
            version: 6,
            browser: 'safari',
            device: 'tablet'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0_1 like Mac OS X; nl-nl) AppleWebKit/536.26 (KHTML, like Gecko) CriOS/23.0.1271.96 Mobile/10A523 Safari/8536.25 (1C019986-AF73-46A7-8F31-0E86ADFFCDB4)',
            version: 6,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A405 Safari/8536.25',
            version: 6,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_2 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11A501 Twitter for iPhone',
            version: 7,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_2 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A501 Safari/9537.53',
            version: 7,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10B329',
            version: 6,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10B329 Twitter for iPhone',
            version: 6,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25',
            version: 6,
            browser: 'safari',
            device: 'tablet'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3',
            version: 0,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'windows',
            str: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
            version: 0,
            browser: 'safari',
            device: 'desktop'
        }, {
            name: 'windows',
            str: 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0',
            version: 0,
            browser: 'safari',
            device: 'desktop'
        }, {
            name: 'macintosh',
            str: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A',
            version: 0,
            browser: 'safari',
            device: 'desktop'
        }, {
            name: 'windows',
            str: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
            version: 0,
            browser: 'safari',
            device: 'desktop'
        }, {
            name: 'android',
            str: 'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
            version: 4,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'windows',
            str: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
            version: 0,
            browser: 'safari',
            device: 'desktop'
        }, {
            name: 'linux',
            str: 'Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/31.0',
            version: 0,
            browser: 'safari',
            device: 'desktop'
        }, {
            name: 'BlackBerry',
            str: 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+',
            version: 0,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'webOS',
            str: 'Mozilla/5.0 (webOS/1.0; U; en-US) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/1.0 Safari/525.27.1 Pre/1.0',
            version: 0,
            browser: 'safari',
            device: 'desktop'
        }, {
            name: 'Opera Mini',
            str: 'Opera/9.80 (J2ME/MIDP; Opera Mini/9.80 (S60; SymbOS; Opera Mobi/23.348; U; en) Presto/2.5.25 Version/10.54',
            version: 0,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'Windows Phone',
            str: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)',
            version: 7,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'Windows Phone',
            str: 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; NOKIA; Lumia 1520) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.1016',
            version: 10,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/8.0 Mobile/11A465 Safari/9537.53',
            version: 8,
            browser: 'safari',
            device: 'mobile'
        }, {
            name: 'ios',
            str: 'Mozilla/5.0 (iPad; CPU OS 8_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) CriOS/30.0.1599.12 Mobile/11A465 Safari/8536.25 (3B92C18B-D9DE-4CB7-A02A-22FD2AF17C8F)',
            version: 8,
            browser: 'safari',
            device: 'tablet'
        }, {
            name: 'android',
            str: 'Mozilla/5.0 (Linux; Android 4.0.4; en-gb; SM-T330 Build/IMM76D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Safari/533.1',
            version: 4,
            browser: 'safari',
            device: 'tablet'
        }, {
            name: 'android',
            str: 'Mozilla/5.0 (Linux; Android 5.1.1; SM-G925F Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.94 Mobile Safari/537.36',
            version: 5,
            browser: 'safari',
            device: 'mobile'
        }
    ];

    /* ACT.Environment test */
    it('should have ACT.UA instance', function () {
        expect(ACT.UA).to.exist;
    });

    /* ACT.Lang test */
    it('should have ACT.Lang instance', function () {
        expect(ACT.Lang).to.exist;
    });

    /* Function checkBrowser */
    describe('checkBrowser:', function () {
        var browsers = [{
            name: 'IE',
            str: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
            regex: /MSIE ([^;]*)|Trident.*; rv:([0-9.]+)/,
            version: 11
        }, {
            name: 'FireFox',
            str: 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0',
            regex: /Firefox\/([0-9.]+)/,
            version: 36
        }, {
            name: 'Safari',
            str: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A',
            regex: /Version\/([0-9.]+)\s?Safari/,
            version: 7
        }, {
            name: 'Chrome',
            str: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
            regex: /Chrome\/([0-9.]+)/,
            version: 41
        }, {
            name: 'Webkit',
            str: 'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
            regex: /AppleWebKit\/([0-9.]+)/,
            version: 534.3
        }, {
            name: 'Edge',
            str: 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136',
            regex: /Edge\/([0-9]+)/,
            version: 12
        }];

        var ind = 0;
        var b = {};
        var env = {};

        beforeEach(function () {
            env = ACT.UA;
            b = browsers[ind];
        });
        for (var i = 0; i < browsers.length; i++) {
            it('should be able to identify ' + browsers[i].name, function () {
                var value = env.checkBrowser(b.str, b.regex);
                expect(value).to.equal(b.version);
            });
        }
        afterEach(function () {
            ind += 1;
        });

        it('should fail gracefully', function () {
            var value = env.checkBrowser('Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko', /Chrome\/([0-9.]+)/);
            expect(value).to.equal(0);
        });
    });

    /* Function detectOS */
    describe('Should Detect the OS Name and OS Version:', function () {
        OSStrings.forEach(function (itor) {
            it('Should be able to identify OS: ' + itor.name + ' OS Version :' + itor.version, function () {
                var env = ACT.UA;
                var b = itor;
                var value = env.detectOS(b.str);
                expect(value.version).to.equal(b.version);
                expect(value.name).to.equal(b.name);
            });
        });

        it('should fail gracefully', function () {
            var value = ACT.UA.detectOS('Mozilla/5.0 (X11; U; SunOS sun4u; en-US; rv:1.4b) Gecko/20030517 Mozilla Firebird/0.6');
            expect(value.version).to.equal(0);
            expect(value.name).to.equal('other');
        });
    });

    describe('check for devices:', function () {
        OSStrings.forEach(function (itor) {
            it('Should be able to identify Device: ' + itor.device, function () {
                var userAgent = itor.str;
                switch (itor.device) {
                    case 'mobile':
                        expect(ACT.UA.checkMobile(userAgent)).to.equal(true);
                        break;
                    case 'tablet':
                        expect(ACT.UA.checkTablet(userAgent)).to.equal(true);
                        break;
                    case 'desktop':
                    default:
                        expect(ACT.UA.checkTablet(userAgent)).to.equal(false);
                        expect(ACT.UA.checkTablet(userAgent)).to.equal(false);
                        break;
                }
            });
        });
    });

    /* Check un-instantiated properties */
    describe('check for properties:', function () {

        beforeEach(function () {
            simple_env = ACT.UA;
            env = ACT.UA;
        });

        it('should have `os` defined', function () {
            expect(simple_env.os).to.exist;
        });

        it('should have `browser` defined', function () {
            expect(simple_env.browser).to.exist;
        });

        it('should have `flash` defined', function () {
            expect(simple_env.flash).to.exist;
        });

        it('should have `isHtml5Supported` defined', function () {
            expect(simple_env.isHtml5Supported).to.exist;
        });

        it('should have `html` defined', function () {
            expect(simple_env.html).to.exist;
        });

        it('should have `isMobile` defined', function () {
            expect(simple_env.isMobile).to.exist;
        });

        it('should have `isTablet` defined', function () {
            expect(simple_env.isTablet).to.exist;
        });
    });

    /* Test Attributes */
    describe('attributes:', function () {
        it('should have ATTRS defined', function () {
            expect(ACT.UA.ATTRS).to.exist;
        });

        it('should have ATTRS.NAME defined', function () {
            expect(ACT.UA.ATTRS.NAME).to.exist;
        });
    });

    describe('check that the instance has properties defined:', function () {
        it('should have `html` defined', function () {
            expect(env.html).to.exist;

        });

        it('should have `checkBrowser` defined', function () {
            expect(env.checkBrowser).to.exist;
            expect(env.checkBrowser).to.be.a('function');
        });

        it('should have `os` defined', function () {
            expect(env.os).to.exist;
            expect(env.os).to.be.an('object');
            expect(env.os).to.have.property('name');
            expect(env.os).to.have.property('version');
        });

        it('should have `browser` defined', function () {
            expect(env.browser).to.exist;
            expect(env.browser).to.be.an('object');
            expect(env.browser).to.have.property('version');
            expect(env.browser).to.have.property('name');
        });

        it('should have `ie` defined', function () {
            expect(env.ie).to.exist;
            expect(env.ie).to.be.a('number');
        });

        it('should have `firefox` defined', function () {
            expect(env.firefox).to.exist;
            expect(env.firefox).to.be.a('number');
        });

        it('should have `safari` defined', function () {
            expect(env.safari).to.exist;
            expect(env.safari).to.be.a('number');
        });

        it('should have `chrome` defined', function () {
            expect(env.chrome).to.exist;
            expect(env.chrome).to.be.a('number');
        });

        it('should have `webkit` defined', function () {
            expect(env.webkit).to.exist;
            expect(env.webkit).to.be.a('number');
        });

        it('should have `flash` defined', function () {
            expect(env.flash).to.exist;
            expect(env.flash).to.be.a('number');
        });

        it('should have `dragDrop` defined', function () {
            expect(env.dragDrop).to.exist;
            expect(env.dragDrop).to.be.a('boolean');
        });

        it('should have `canvasText` defined', function () {
            expect(env.canvasText).to.exist;
            expect(env.canvasText).to.be.a('boolean');
        });

        it('should have `canvas` defined', function () {
            expect(env.canvas).to.exist;
            expect(env.canvas).to.be.a('boolean');
        });

        it('should have `audio` defined', function () {
            expect(env.audio).to.exist;
            expect(env.audio).to.be.a('boolean');
        });

        it('should have `video` defined', function () {
            expect(env.video).to.exist;
            expect(env.video).to.be.a('boolean');
        });

        it('should have `isHtml5Supported` defined', function () {
            expect(env.isHtml5Supported).to.exist;
            expect(env.isHtml5Supported).to.be.a('boolean');
        });
    });
});
