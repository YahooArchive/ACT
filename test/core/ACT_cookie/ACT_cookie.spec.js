describe("ACT.Cookie", function() {

    var expect = chai.expect;

    it("should have ACT.Cookie instance", function(done) {
        expect(ACT.Cookie).to.exist;
        done();
    });

    it("should have ACT.Json instance", function(done) {
        expect(ACT.Json).to.exist;
        done();
    });

    it("should have ACT.Lang instance", function(done) {
        expect(ACT.Lang).to.exist;
        done();
    });

    it("should have ACT.Event instance", function(done) {
        expect(ACT.Event).to.exist;
        done();
    });

    describe("attributes", function() {
        it("should have ATTRS defined", function(done) {
            expect(ACT.Cookie.ATTRS).to.exist;
            done();
        });

        it("should have ATTRS.version defined", function(done) {
            expect(ACT.Cookie.ATTRS.version).to.exist;
            done();
        });

        it("should have ATTRS.NAME defined", function(done) {
            expect(ACT.Cookie.ATTRS.NAME).to.exist;
            done();
        });
    });

    describe('constructor', function() {

        it("should be able to instantiate Cookie", function(done) {
            var cookie = new ACT.Cookie({});
            expect(cookie).to.exist;
            cookie.destroy();
            done();
        });

        describe('default', function() {

            it("should have default config elements defined", function(done) {
                var cookie = new ACT.Cookie({});

                expect(cookie.COOKIE_NAME).to.exist;
                expect(cookie.COOKIE_NAME).to.have.length.above(2);

                expect(cookie.DEFAULT_COOKIE_NAME).to.exist;
                expect(cookie.DEFAULT_COOKIE_NAME).to.have.length.above(2);
                expect(cookie.DEFAULT_COOKIE_NAME).to.equal("CRZY");

                expect(cookie.DEFAULT_DOMAIN).to.exist;
                expect(cookie.DEFAULT_DOMAIN).to.have.length.above(2);

                expect(cookie.DEFAULT_EXPIRES).to.exist;
                expect(cookie.DEFAULT_EXPIRES).to.be.above(60);

                expect(cookie.DEFAULT_PATH).to.exist;
                expect(cookie.DEFAULT_PATH).to.have.length.above(0);

                expect(cookie.FREQ_CAP).to.exist;
                expect(cookie.FREQ_CAP).to.equal(1);

                cookie.destroy();
                done();
            });
        });

        describe('parameter instance', function() {
            it("should use passed in 'name' from config", function(done) {
                var config = {
                    "name": "ACT.Cookie.test"
                };
                var defined_cookie = new ACT.Cookie(config);

                expect(defined_cookie.COOKIE_NAME).to.exist;
                expect(defined_cookie.COOKIE_NAME).to.equal('ACT.Cookie.test');

                expect(defined_cookie.DEFAULT_COOKIE_NAME).to.exist;
                expect(defined_cookie.DEFAULT_COOKIE_NAME).to.have.length.above(2);

                expect(defined_cookie.DEFAULT_DOMAIN).to.exist;
                expect(defined_cookie.DEFAULT_DOMAIN).to.have.length.above(2);

                expect(defined_cookie.DEFAULT_EXPIRES).to.exist;
                expect(defined_cookie.DEFAULT_EXPIRES).to.be.above(60);

                expect(defined_cookie.DEFAULT_PATH).to.exist;
                expect(defined_cookie.DEFAULT_PATH).to.have.length.above(0);

                expect(defined_cookie.FREQ_CAP).to.exist;
                expect(defined_cookie.FREQ_CAP).to.equal(1);

                defined_cookie.destroy();
                done();
            });

            it("should use passed in 'domain' from config", function(done) {
                var config = {
                    "domain": "sports.yahoo.com"
                };
                var defined_cookie = new ACT.Cookie(config);
                expect(defined_cookie.DEFAULT_DOMAIN).to.exist;
                expect(defined_cookie.DEFAULT_DOMAIN).to.equal("sports.yahoo.com");

                expect(defined_cookie.COOKIE_NAME).to.exist;
                expect(defined_cookie.COOKIE_NAME).to.have.length.above(2);

                expect(defined_cookie.DEFAULT_COOKIE_NAME).to.exist;
                expect(defined_cookie.DEFAULT_COOKIE_NAME).to.have.length.above(2);

                expect(defined_cookie.DEFAULT_EXPIRES).to.exist;
                expect(defined_cookie.DEFAULT_EXPIRES).to.be.above(60);

                expect(defined_cookie.DEFAULT_PATH).to.exist;
                expect(defined_cookie.DEFAULT_PATH).to.have.length.above(0);

                expect(defined_cookie.FREQ_CAP).to.exist;
                expect(defined_cookie.FREQ_CAP).to.equal(1);

                defined_cookie.destroy();
                done();
            });

            it("should use passed in 'expires' from config", function(done) {
                var config = {
                    "expires": 1500
                };
                var defined_cookie = new ACT.Cookie(config);
                expect(defined_cookie.DEFAULT_EXPIRES).to.exist;
                expect(defined_cookie.DEFAULT_EXPIRES).to.be.above(60);

                expect(defined_cookie.COOKIE_NAME).to.exist;
                expect(defined_cookie.COOKIE_NAME).to.have.length.above(2);

                expect(defined_cookie.DEFAULT_COOKIE_NAME).to.exist;
                expect(defined_cookie.DEFAULT_COOKIE_NAME).to.have.length.above(2);

                expect(defined_cookie.DEFAULT_DOMAIN).to.exist;
                expect(defined_cookie.DEFAULT_DOMAIN).to.have.length.above(2);

                expect(defined_cookie.DEFAULT_PATH).to.exist;
                expect(defined_cookie.DEFAULT_PATH).to.have.length.above(0);

                expect(defined_cookie.FREQ_CAP).to.exist;
                expect(defined_cookie.FREQ_CAP).to.equal(1);

                defined_cookie.destroy();
                done();
            });

            it("should use passed in 'path' from config", function(done) {
                var config = {
                    "path": "www.yahoo.com/test/more/"
                };
                var defined_cookie = new ACT.Cookie(config);
                expect(defined_cookie.DEFAULT_PATH).to.exist;
                expect(defined_cookie.DEFAULT_PATH).to.have.length.above(0);
                expect(defined_cookie.DEFAULT_PATH).to.equal("www.yahoo.com/test/more/");

                expect(defined_cookie.COOKIE_NAME).to.exist;
                expect(defined_cookie.COOKIE_NAME).to.have.length.above(2);

                expect(defined_cookie.DEFAULT_COOKIE_NAME).to.exist;
                expect(defined_cookie.DEFAULT_COOKIE_NAME).to.have.length.above(2);

                expect(defined_cookie.DEFAULT_DOMAIN).to.exist;
                expect(defined_cookie.DEFAULT_DOMAIN).to.have.length.above(2);

                expect(defined_cookie.DEFAULT_EXPIRES).to.exist;
                expect(defined_cookie.DEFAULT_EXPIRES).to.be.above(60);

                expect(defined_cookie.FREQ_CAP).to.exist;
                expect(defined_cookie.FREQ_CAP).to.equal(1);

                defined_cookie.destroy();
                done();
            });

            it("should use passed in 'freq_cap' from config", function(done) {
                var config = {
                    "freq_cap": 2
                };
                var defined_cookie = new ACT.Cookie(config);
                expect(defined_cookie.FREQ_CAP).to.exist;
                expect(defined_cookie.FREQ_CAP).to.equal(2);

                expect(defined_cookie.COOKIE_NAME).to.exist;
                expect(defined_cookie.COOKIE_NAME).to.have.length.above(2);

                expect(defined_cookie.DEFAULT_COOKIE_NAME).to.exist;
                expect(defined_cookie.DEFAULT_COOKIE_NAME).to.have.length.above(2);

                expect(defined_cookie.DEFAULT_DOMAIN).to.exist;
                expect(defined_cookie.DEFAULT_DOMAIN).to.have.length.above(2);

                expect(defined_cookie.DEFAULT_PATH).to.exist;
                expect(defined_cookie.DEFAULT_PATH).to.have.length.above(0);

                expect(defined_cookie.DEFAULT_EXPIRES).to.exist;
                expect(defined_cookie.DEFAULT_EXPIRES).to.be.above(60);

                defined_cookie.destroy();
                done();
            });

            it("should use the full set of config data", function(done) {
                var config = {
                    "domain": "sports.yahoo.com",
                    "path": "sports.yahoo.com/path/",
                    "expires": 123456,
                    "name": "COOKIE_TEST",
                    "freq_cap" : 2
                };
                var defined_cookie = new ACT.Cookie(config);

                expect(defined_cookie.DEFAULT_PATH).to.exist;
                expect(defined_cookie.DEFAULT_PATH).to.have.length.above(0);
                expect(defined_cookie.DEFAULT_PATH).to.equal("sports.yahoo.com/path/");

                expect(defined_cookie.COOKIE_NAME).to.exist;
                expect(defined_cookie.COOKIE_NAME).to.have.length.above(2);
                expect(defined_cookie.COOKIE_NAME).to.equal('COOKIE_TEST');

                expect(defined_cookie.DEFAULT_COOKIE_NAME).to.exist;
                expect(defined_cookie.DEFAULT_COOKIE_NAME).to.have.length.above(2);
                expect(defined_cookie.DEFAULT_COOKIE_NAME).to.equal("CRZY");

                expect(defined_cookie.DEFAULT_DOMAIN).to.exist;
                expect(defined_cookie.DEFAULT_DOMAIN).to.have.length.above(2);
                expect(defined_cookie.DEFAULT_DOMAIN).to.equal("sports.yahoo.com");

                expect(defined_cookie.DEFAULT_EXPIRES).to.exist;
                expect(defined_cookie.DEFAULT_EXPIRES).to.be.above(60);
                expect(defined_cookie.DEFAULT_EXPIRES).to.equal(123456);

                expect(defined_cookie.FREQ_CAP).to.exist;
                expect(defined_cookie.FREQ_CAP).to.be.above(1);
                expect(defined_cookie.FREQ_CAP).to.equal(2);

                defined_cookie.destroy();
                done();
            });
        });

        describe('event listeners', function() {
            var cookie;

            before(function() {
                sinon.stub(ACT.Event, 'fire');
                sinon.stub(ACT.Event, 'on', function() {
                    return {
                        remove: function() {}
                    }
                });
                cookie = new ACT.Cookie({});
            });

            after(function() {
                cookie.destroy();
                ACT.Event.on.restore();
                ACT.Event.fire.restore();
            });

            it('should listen to Darla register event', function(done) {
                expect(ACT.Event.on.calledWith('secureDarla:register', sinon.match.func)).to.be.true;
                done();
            });

            it('should listen to Darla register-update event', function(done) {
                expect(ACT.Event.on.calledWith('secureDarla:register-update', sinon.match.func)).to.be.true;
                done();
            });

            it('should listen to registerAd event action', function(done) {
                expect(ACT.Event.on.calledWith('localRegister:registerAd', sinon.match.func)).to.be.true;
                done();
            });

            it('should listen to trackState event action', function(done) {
                expect(ACT.Event.on.calledWith('localRegister:trackState', sinon.match.func)).to.be.true;
                done();
            });

            it('should listen to updateAdEvent event action', function(done) {
                expect(ACT.Event.on.calledWith('localRegister:updateAdEvent', sinon.match.func)).to.be.true;
                done();
            });

            it('should fire registerAd event', function(done) {
                expect(ACT.Event.fire.calledWith('register:Actions', sinon.match.array)).to.be.true;
                done();
            });
        });
    });

    describe('Cookie instance functions', function() {
        var cookie, helper;

        /* Simple/default cookie */
        before(function() {
            // stub all event function from happen so it will not effect other modules when run karma
            sinon.stub(ACT.Event, 'fire');
            sinon.stub(ACT.Event, 'on');

            cookie = new ACT.Cookie({});
            helper = cookie.cookie;
        });

        after(function() {
            // test done, restore Event functions
            ACT.Event.fire.restore();
            ACT.Event.on.restore();
        });

        describe('function test', function() {
            it('should call helper test function', function(done) {

                sinon.stub(helper, 'test');

                cookie.test();
                expect(helper.test.called, 'helper test function is called').to.be.true;

                helper.test.restore();

                done();
            });
        });

        describe('function set', function() {
            it('should call helper set function', function(done) {

                sinon.stub(helper, 'set');

                cookie.set('cookieContent');

                expect(helper.set.calledWith(cookie.DEFAULT_COOKIE_NAME, sinon.match.object), 'helper set function is called').to.be.true;

                helper.set.restore();

                done();
            });

            it('should update cookie content of existing cookie when cookies obj is not empty', function(done) {
                sinon.stub(helper, 'set');
                cookie.clean = function() {
                    return { "cookie": {}, "ACTCookie": {} } }
                cookie.set('cookieContent');

                expect(helper.set.calledWith(cookie.DEFAULT_COOKIE_NAME, sinon.match.object), 'helper set function is called').to.be.true;

                helper.set.restore();

                done();
            });

        });

        describe('function get', function() {
            it('should call helper get function', function(done) {

                sinon.stub(helper, 'get');

                cookie.get();

                expect(helper.get.calledWith(cookie.DEFAULT_COOKIE_NAME), 'helper get function is called with COOKIE_NAME').to.be.true;

                helper.get.restore();

                done();
            });
        });

    });

    describe('Standard cookie helper', function() {
        var defined_cookie, cookie, domain;

        /* Simple/default cookie */
        before(function() {
            // stub all event function from happen so it will not effect other modules when run karma
            sinon.stub(ACT.Event, 'fire');
            sinon.stub(ACT.Event, 'on');

            defined_cookie = new ACT.Cookie({});
            cookie = defined_cookie.cookie;
            domain = location.hostname.replace(/^www\./, '') || "localhost"; // this is set for localhost

        });

        after(function() {
            // test done, restore Event functions
            ACT.Event.fire.restore();
            ACT.Event.on.restore();
        });

        it("should be using standard cookie", function(done) {
            expect(cookie, 'cookie helper').to.exist;
            expect(cookie.TYPE).to.equal("standard");
            done();
        });

        describe('cookie test function', function() {

            it("should have test function", function(done) {
                expect(defined_cookie.cookie.test).to.exist;
                expect(defined_cookie.cookie.test).to.be.a('function');
                expect(defined_cookie.test()).to.be.true;
                done();
            });
        });

        describe('function saveState', function() {
            it('should call helper saveState function', function(done) {
                defined_cookie.saveState();
                done();
            });
        });


        describe('function updateAdEvent', function() {
            it('should call helper updateAdEvent function', function(done) {
                defined_cookie.updateAdEvent();
                done();
            });
        });

        describe('cookie set function', function() {

            it("should have set function", function(done) {
                expect(cookie.set).to.exist;
                expect(cookie.set).to.be.a('function');
                done();
            });

            it("should change document.cookie value", function(done) {
                // TODO: find a way to test with document.cookie - unable to change document.cookie at the moment

                // document.cookie = "";

                // console.log(document);

                // cookie.set('SET_COOKIE_TEST', {a:1}, domain, null, 'path');
                // console.log('document.cookie', document.cookie);

                // expect(document.cookie.indexOf('SET_COOKIE_TEST='), 'cookie name available in document.cookie').to.be.above(-1);
                // expect(document.cookie.indexOf('domain=' + domain), 'domain available in document.cookie').to.be.above(-1);
                // expect(document.cookie.indexOf('path=path'), 'path name available in document.cookie').to.be.above(-1);

                done();
            });
        });

        describe('cookie get function', function() {
            it('should have get function', function(done) {
                expect(defined_cookie.cookie.get).to.exist;
                expect(defined_cookie.cookie.get).to.be.a('function');

                done();
            });

            it('should read from document.cookie', function(done) {
                // TODO: find a way to test with document.cookie - unable to change document.cookie at the moment
                // document.cookie = "CRZY=%7B%22a%22%3A1%7D; expires=Fri, 26 Jun 2015 15:27:03 GMT; domain=localhost; path=path";

                // console.log(document.cookie);
                // var result = defined_cookie.cookie.get("CRZY");
                // console.log(result);
                // expect(result.a).to.be.equal(1);

                done();
            });
        });

        describe('cookie remove function', function() {
            it('should have remove function', function(done) {
                /* Fake the read function */
                defined_cookie.read = function() {
                    return { "ACTCookie": {} }; };
                expect(defined_cookie.cookie.remove).to.exist;
                expect(defined_cookie.cookie.remove).to.be.a('function');
                expect(defined_cookie.cookie.remove("CRZY", 'localhost', '/')).to.be.ok;
                done();
            });
        });

        describe('cookie.remove function', function() {
            it('should have remove function', function(done) {
                expect(defined_cookie.remove).to.exist;
                expect(defined_cookie.remove).to.be.a('function');
                expect(defined_cookie.remove("ACTCookie", 'localhost', '/')).to.be.ok;
                done();
            });

            //          it('shoud clean document.cookie');
        });


        describe('cookie clean function', function() {

            it('should have clean function', function(done) {
                expect(defined_cookie.clean).to.exist;
                expect(defined_cookie.clean).to.be.a('function');
                expect(defined_cookie.clean()).to.be.ok;
                done();
            });
        });

        describe('cookie getHelper function', function() {

            it('should have getHelper function', function(done) {

                expect(defined_cookie.getHelper).to.exist;
                expect(defined_cookie.getHelper).to.be.a('function');

                defined_cookie.getHelper({
                    status: 0,
                    data: {}
                });

                // all event functions have been stubbed so it will not do the actual work
                expect(ACT.Event.fire.calledWith('Cookie:getData:complete'), 'Cookie:getData:complete event is fired').to.be.true;

                done();
            });

            it('should behave with data calling - getHelper function', function(done) {
                // Fake the event return, to make sure the path is taken.
                defined_cookie.cookie_ready_event = { "remove": function() {} };

                expect(defined_cookie.getHelper).to.exist;
                expect(defined_cookie.getHelper).to.be.a('function');

                defined_cookie.getHelper({ "status": 0, data: { "ACTCookie": {} } });

                expect(ACT.Event.fire.calledWith('Cookie:getData:complete'), 'Cookie:getData:complete event is fired').to.be.true;

                done();
            });
        });

    });

    describe('sDarla cookie helper', function() {
        var yAPI = {
            supports: sinon.stub().returns(true),
            cookie: sinon.stub()
        }

        var cookie;

        before(function() {
            // stub all event function from happen so it will not effect other modules when run karma
            sinon.stub(ACT.Event, 'fire');

            cookie = new ACT.Cookie({});

        });

        after(function() {
            cookie.destroy();

            // test done, restore Event functions
            ACT.Event.fire.restore();
        });

        it('should use darla cookie helper', function(done) {

            cookie.register({
                yAPI: yAPI,
                key: {}
            })

            expect(cookie.cookie.TYPE).to.be.equal('safeFrame');

            done();

        });

        describe('read cookie', function() {

        });

        describe('write cookie', function() {

            it('should use Darla cookie API', function(done) {

                cookie.cookie.set('SD_name', 'content');

                function checkCookieData(data) {
                    return (data.value !== undefined) && (data.key !== undefined);
                }

                expect(yAPI.cookie.calledWith('SD_name', sinon.match(checkCookieData))).to.be.true;

                done();

            });
        });

        describe('get SF cookie', function() {

            it('should use Darla cookie API', function(done) {

                cookie.cookie.getSFCookie('SD_name');

                setTimeout(function() {

                    expect(yAPI.cookie.calledWith('SD_name', sinon.match.has('key'))).to.be.true;
                    done();

                }, 110);
            });

            it('should use Darla cookie API with get', function(done) {

                cookie.cookie.get('SD_name');

                setTimeout(function() {

                    expect(yAPI.cookie.calledWith('SD_name', sinon.match.has('key'))).to.be.true;
                    done();

                }, 110);
            });

        });

        describe('read SF cookie', function() {

            it('should use Darla cookie API', function(done) {

                cookie.cookie.readSFCookie({ cmd: 'read-cookie' });

                setTimeout(function() {

                    expect(yAPI.cookie.calledWith('SD_name', sinon.match.has('key'))).to.be.true;
                    done();

                }, 110);
            });


        })

    });

    describe('functional events', function(){

        before(function() {
            // stub all event function from happen so it will not effect other modules when run karma
            // ACT.Event.originalFire = ACT.Event.fire;
            // sinon.stub(ACT.Event, 'fire', function(eventName, data){
            //  // only allow some event to actually fired and block the rest
            //  if (eventName.indexOf("localRegister:") == 0 || eventName.indexOf("Cookie:") == 0){
            //      ACT.Event.originalFire(eventName, data);
            //  }
            // });
        });

        after(function(){
            // test done, restore Event functions
            // ACT.Event.fire.restore();
        });

        describe("get state event", function(){

            it("should answer state value if cookie is available", function(done){

                var yAPI = {
                    supports: sinon.stub().returns(true),
                    cookie: function(cookie_name){
                        ACT.Debug.log("aadasfsadsasd");
                        ACT.Event.fire("secureDarla:read-cookie", {
                            cmd: "read-cookie",
                            value: '{"ACTCookie":{"data":{"states":{"stateId":"some value"}}}}'
                        });
                    }
                }

                var cookie = new ACT.Cookie({
                    name: "ACTCookie"
                });

                // reset sf cookie before doing test
                cookie.exposedSafeframeCookie.pending = null;

                cookie.register({
                    yAPI: yAPI,
                    key: {}
                });
                ACT.Debug.log(cookie.cookie.TYPE);

                var temp = ACT.Event.on("localRegister:getState:complete", function(data){
                    temp.remove();
                    // test returned value here
                    expect(data.status, 'return status must be cookie ok').to.equal(0);
                    expect(data.value).to.equal("some value");

                    cookie.destroy();
                    done();
                });

                // give it sometime to read cookie data
                setTimeout(function(){
                    ACT.Event.fire("localRegister:getState", {stateId: "stateId"});
                }, 20);


            });

            it("should answer false if cookie is not available to use ", function(done){
                var yAPI = {
                    supports: sinon.stub().returns(false)
                }

                var cookie = new ACT.Cookie({});

                cookie.register({
                    yAPI: yAPI,
                    key: {}
                });

                var temp = ACT.Event.on("localRegister:getState:complete", function(data){
                    temp.remove();
                    // test returned value here
                    expect(data.status, 'return status must be no cookie').to.equal(-1);
                    cookie.destroy();
                    done();
                });

                ACT.Event.fire("localRegister:getState", {stateId: "stateId"});
            });

            
        });


    });

    describe('Frequency Test', function(){

        it('should return firstPlay true if ad play the first time', function(done){

            var cookie = new ACT.Cookie({freq_cap : 2});

            sinon.stub(cookie, 'get', function(){

                ACT.Event.fire('Cookie:getData:complete', {
                    status: 0
                });
            });

            

            var registerAdListener = ACT.Event.on('localRegister:registerAd:complete', function(result){
                registerAdListener.remove();

                expect(result.firstPlay, 'firstPlay must be true').to.be.true;

                cookie.get.restore();
                cookie.destroy();

                done();
            });

            cookie.registerAd();

        });
   
        it('should return firstPlay true if ad play the second time', function(done){

            var cookie = new ACT.Cookie({freq_cap : 2});


            sinon.stub(cookie, 'get', function(){

                ACT.Event.fire('Cookie:getData:complete', {
                    status: 0, 
                    data: {play:0}
                });
            });

            var registerAdListener = ACT.Event.on('localRegister:registerAd:complete', function(result){
                registerAdListener.remove();

                expect(result.firstPlay, 'firstPlay must be true').to.be.true;

                cookie.get.restore();
                cookie.destroy();
                done();
            });

            cookie.registerAd();

        });

        it('should return firstPlay false if ad play the third time', function(done){

            var cookie = new ACT.Cookie({freq_cap : 2});


            sinon.stub(cookie, 'get', function(){

                ACT.Event.fire('Cookie:getData:complete', {
                    status: 0, 
                    data: {play:1}
                });
            });

            var registerAdListener = ACT.Event.on('localRegister:registerAd:complete', function(result){
                registerAdListener.remove();

                expect(result.firstPlay, 'firstPlay must be false').to.be.false;

                cookie.get.restore();
                cookie.destroy();
                done();
            });

            cookie.registerAd();

        });
    })

});
