

describe("ACT.StandardAd", function () {

    var expect = chai.expect;

    before(function () {
        sinon.stub(ACT.Screen.prototype, 'initializer');
        sinon.stub(ACT.Cookie.prototype, 'saveState');
        sinon.stub(ACT.Cookie.prototype, 'registerAd');
        //	sinon.stub(ACT.Event, 'fire');
    });

    after(function () {
        ACT.Screen.prototype.initializer.restore();
        ACT.Cookie.prototype.saveState.restore();
        ACT.Cookie.prototype.registerAd.restore();
        //	ACT.Event.fire.restore();
    });


    it("should have ACT.StandardAd instance", function () {
        expect(ACT.StandardAd).to.exist;
    });

    describe("action attributes", function(){

        before(function(){
            this.validConfig = {
                baseConfig: {
                    id: "test",
                    template: 'floating',
                    version: '0.0.1.5',
                    forceEnv: {
                        forcedFlashList: {},
                        forcedHTML5List: {},
                        forcedBackupList: {}
                    }
                },
                tracking: {},
                format: {
                    flow: [{
                        eventType: "firstPlay"
                    }]
                }
            };
        });

        it("should return true against valid arguments", function(done){

            var data = {
                firstPlay: true
            };  


            ACT.Event.originalEventFire = ACT.Event.fire;
            sinon.stub(ACT.Event, 'fire', function(event, data){

                if (event === 'register:Actions'){

                    var replayAd = data[0].argument;
                    var stopProcesses = data[1].argument;

                    expect(replayAd.timeout.test("10")).to.be.true;
                    expect(replayAd.timeout.test(10)).to.be.true;
                    expect(replayAd.timeout.test(undefined)).to.be.true;
                    expect(replayAd.timeout.test(null)).to.be.true;
                    expect(stopProcesses.timeout.test("10")).to.be.true;
                    expect(stopProcesses.timeout.test(10)).to.be.true;
                    expect(stopProcesses.timeout.test(undefined)).to.be.true;
                    expect(stopProcesses.timeout.test(null)).to.be.true;
                    ACT.Event.fire.restore();   
                    done();
                } else {
                    ACT.Event.originalEventFire(event, data);
                }
                
                    
            });
        
            var ad = new ACT.StandardAd({ "config": {config: this.validConfig}, "parent": {config: this.validConfig}});
            ACT.Event.fire('localRegister:registerAd:complete', data);  

        });

        it("should return false against invalid arguments", function(done){

            var data = {
                firstPlay: true
            };  

            ACT.Event.originalEventFire = ACT.Event.fire;
            sinon.stub(ACT.Event, 'fire', function(event, data){

                if (event === 'register:Actions'){

                    var replayAd = data[0].argument;
                    var stopProcesses = data[1].argument;

                    expect(replayAd.timeout.test("test")).to.be.false;
                    expect(stopProcesses.timeout.test("test")).to.be.false;
                    ACT.Event.fire.restore();
                    done();
                } else {
                    ACT.Event.originalEventFire(event, data);
                }
            
                    
            });
        
            var ad = new ACT.StandardAd({ "config": {config: this.validConfig}, "parent": {config: this.validConfig}});
            ACT.Event.fire('localRegister:registerAd:complete', data);  

        });

    });

    describe("initialise function on firstplay", function () {
        var validConfig;
        var invalidConfig;
        before(function () {

            validConfig = {
                baseConfig: {
                    id: "test",
                    template: 'floating',
                    version: '0.0.1.5',
                    forceEnv: {
                        forcedFlashList: {},
                        forcedHTML5List: {},
                        forcedBackupList: {}
                    }
                },
                tracking: {},
                format: {
                    flow: [{
                        eventType: "firstPlay",
                        actions: [{
                            "type": "replayAd"
                        }, {
                            "type": "stopProcesses"
                        }],
                        timeTo: 2,
                        doIf: {
                            state: {
                                id: 'billboard',
                                value: 'open'
                            }
                        }
                    }]
                }
            };



            invalidConfig = {
                baseConfig: {
                    id: "test",
                    template: 'floating',
                    version: '0.0.1.5',
                    forceEnv: {
                        forcedFlashList: {},
                        forcedHTML5List: {},
                        forcedBackupList: {}
                    }
                },
                tracking: {},
                format: {}
            };

        });


        it("should execute on localRegister:registerAd:complete event with valid config and timeTo", function (done) {

            var ad = new ACT.StandardAd({
                "config": {
                    config: validConfig
                },
                "parent": {
                    config: validConfig
                }
            });

            var data = {
                firstPlay: true,
                states: {
                    billboard: "open"
                },
                status: 0
            };

            var validStatusAction = ACT.Event.on('register:Actions', function () {
                validStatusAction.remove();

                expect(ad.get('firstPlay')).to.equal(true);
                ad.destroy();
                done();

               
            });

            ACT.Event.fire('localRegister:registerAd:complete', data);

        });

        it("should call isStateMatch with a missmatch and return false on localRegister:registerAd:complete event with valid config and timeTo", function (done) {
            var ad = new ACT.StandardAd({
                "config": {
                    config: validConfig
                },
                "parent": {
                    config: validConfig
                }
            });
            var data = {
                firstPlay: true,
                states: {
                    billboard: "missmatch"
                },
                status: 0
            };

            ad.set('states', {
                "billboard": "closed"
            });


            var validStatusAction = ACT.Event.on('register:Actions', function (actions) {
                //check this is the register action from standard ad
                if(actions[0].type === "playLayer"){
                    validStatusAction.remove();
                    expect(ad.isStateMatch(data.states)).to.equal(false);
                    ad.destroy();
                    done();
                }
                
               
            });

            ACT.Event.fire('localRegister:registerAd:complete', data);
        });

        it("Should force to play add", function (done) {

            var ad = new ACT.StandardAd({
                "config": {
                    config: validConfig
                },
                "parent": {
                    config: validConfig
                }
            });
            var data = {
                firstPlay: true,
                states: {
                    billboard: "missmatch"
                },
                status: 0
            };

            var registerhandler = ACT.Event.on('register:Actions', function (actions) {
                //check this is the register action from standard ad
                if(actions[0].type === "playLayer"){
                    registerhandler.remove();
                    
                    var validStatusAction = ACT.Event.on('adProduct:playAd', function (data) {
                        validStatusAction.remove();
                        expect(data.forceFirstPlay).to.be.true;
                        ad.destroy();
                        done();
                    });    

                }

                ACT.Event.fire('adProduct:playAd', {forceFirstPlay: true});
                
               
            });

            ACT.Event.fire('localRegister:registerAd:complete', data);

            
        
        });



        it("Should add new actions with counters", function (done) {

            var ad = new ACT.StandardAd({
                "config": {
                    config: validConfig
                },
                "parent": {
                    config: validConfig
                }
            });

            var data = {
                firstPlay: true,
                states: {
                    billboard: "missmatch"
                },
                status: 0
            };
            
            var onlyAction = {
                eventType: "firstPlay",
                actions: [{
                    "type": "replayAd"
                }, {
                    "type": "stopProcesses"
                }],
                timeTo: 0.2
            }

          
            var registerhandler = ACT.Event.on('register:Actions', function (actions) {
                //check this is the register action from standard ad
                if(actions[0].type === "playLayer"){
                    
                    registerhandler.remove();
                    var activeCounters = ad.addCounterTrigger(onlyAction);
                    expect(activeCounters).to.have.length.above(0);
                    ad.destroy();
                    done();
                    
                }
                
               
            });

            ACT.Event.fire('localRegister:registerAd:complete', data);
        
        });

         it("Should stopProcesses new actions with counters", function (done) {

            var ad = new ACT.StandardAd({
                "config": {
                    config: validConfig
                },
                "parent": {
                    config: validConfig
                }
            });

            var data = {
                firstPlay: true,
                states: {
                    billboard: "missmatch"
                },
                status: 0
            };
            
            var onlyAction = {
                eventType: "firstPlay",
                actions: [{
                    "type": "replayAd"
                }, {
                    "type": "stopProcesses"
                }],
                timeTo: 0.2
            }

            //stop all the counters
            var validStatusAction = ACT.Event.on('register:Actions', function (actions) {

                if(actions[0].type === "playLayer"){
                    validStatusAction.remove();
                    //check length
                    
                    var stopCounterHandler = ACT.Event.on('adProduct:stopCounter', function () {

                        stopCounterHandler.remove();
                        expect(ad.activeCounters).to.have.lengthOf(0);
                        ad.destroy();
                        done();
                    });

                    ACT.Event.fire('adProduct:stopCounter');    
                }    
             
            });    

            ACT.Event.fire('localRegister:registerAd:complete', data);
            
            
        
        });

        it("check isCookieMatch returns values", function (done) {
            var ad = new ACT.StandardAd({
                "config": {
                    config: validConfig
                },
                "parent": {
                    config: validConfig
                }
            });
            /* Return cookie data - that is falsey. */
            var validStatusAction = ACT.Event.on('register:Actions', function (actions) {

                if(actions[0].type === "playLayer"){
                    validStatusAction.remove();
                    ad.destroy();
                    expect(ad.isCookieMatch(false)).to.equal(false);
                    done();    
                }    
                
            });

            ACT.Event.fire('localRegister:registerAd:complete', {});
        });

        it("check darlaAPI is correctly set", function (done) {
            var ad = new ACT.StandardAd({
                "config": {
                    config: validConfig
                },
                "parent": {
                    config: validConfig
                }
            });
            var mockDarla = "mockDarla";
            ad.set('sDarlaAPI', mockDarla);

            var getDarlaHandler = ACT.Event.on('adProduct:getDarlaAPI:done', function(){
                    getDarlaHandler.remove();
                    expect(ad.get('sDarlaAPI')).to.equal(mockDarla);
                    ad.destroy();
                    done();
            });

            ACT.Event.fire('localRegister:registerAd:complete', {});

            ACT.Event.fire('adProduct:getDarlaAPI')
        });    


        it("should execute on localRegister:registerAd:complete event with invalid config", function (done) {
            var ad = new ACT.StandardAd({
                "config": {
                    config: invalidConfig
                },
                "parent": {
                    config: invalidConfig
                }
            });

            var data = {
                firstPlay: true,
                states: {},
                status: 0
            };

            var validStatusAction = ACT.Event.on('register:Actions', function (actions) {

                if(actions[0].type === "playLayer"){
                    expect(ad.get('firstPlay')).to.equal(true);
                    validStatusAction.remove();
                    ad.destroy();
                    done();    
                }    

            });

            ACT.Event.fire('localRegister:registerAd:complete', data);

        });

    });

    describe("initialise function on capped play", function () {
        var validConfig;
        before(function () {

            validConfig = {
                baseConfig: {
                    id: "test",
                    template: 'floating',
                    version: '0.0.1.5',
                    forceEnv: {
                        forcedFlashList: {},
                        forcedHTML5List: {},
                        forcedBackupList: {}
                    }
                },
                tracking: {},
                format: {
                    flow: [{
                        eventType: "cappedPlay",
                        actions: [{
                            "type": "replayAd"
                        }, {
                            "type": "stopProcesses"
                        }],
                        timeTo: 2
                    }]
                }
            };

            invalidConfig = {
                baseConfig: {
                    id: "test",
                    template: 'floating',
                    version: '0.0.1.5',
                    forceEnv: {
                        forcedFlashList: {},
                        forcedHTML5List: {},
                        forcedBackupList: {}
                    }
                },
                tracking: {},
                format: {}
            };

        });

        

        it("should execute on localRegister:registerAd:complete event with valid config", function (done) {

            // this.timeout(40000);


            var ad = new ACT.StandardAd({
                "config": {
                    config: validConfig
                },
                "parent": {
                    config: validConfig
                }
            });

            var data = {
                firstPlay: false,
                states: {},
                status: 0
            };

            var validStatusAction = ACT.Event.on('register:Actions', function (actions) {

                if(actions[0].type === "playLayer"){
                    expect(ad.get('firstPlay')).to.equal(true);
                    validStatusAction.remove();
                    ad.destroy();
                    done();
                }    
            });

            ACT.Event.fire('localRegister:registerAd:complete', data);

        });
        it("should execute on localRegister:registerAd:complete event with invalid config", function (done) {
            var ad = new ACT.StandardAd({
                "config": {
                    config: invalidConfig
                },
                "parent": {
                    config: invalidConfig
                }
            });

            var data = {
                firstPlay: false,
                states: {},
                status: 0
            };

            var validStatusAction = ACT.Event.on('register:Actions', function (actions) {
                if(actions[0].type === "playLayer"){
                    expect(ad.get('firstPlay')).to.equal(true);
                    validStatusAction.remove();
                    ad.destroy();
                    done();
                }
                
            });

            ACT.Event.fire('localRegister:registerAd:complete', data);

        });

    });


     describe("initialise function on capped play with no flow timeto set", function () {
        var validConfig;
        var invalidConfig;
        before(function () {

            validConfig = {
                baseConfig: {
                    id: "test",
                    template: 'floating',
                    version: '0.0.1.5',
                    forceEnv: {
                        forcedFlashList: {},
                        forcedHTML5List: {},
                        forcedBackupList: {}
                    }
                },
                tracking: {},
                format: {
                    flow: [{
                        eventType: "cappedPlay",
                        actions: [{
                            "type": "replayAd"
                        }, {
                            "type": "stopProcesses"
                        }]
                    }]
                }
            };

            invalidConfig = {
                baseConfig: {
                    id: "test",
                    template: 'floating',
                    version: '0.0.1.5',
                    forceEnv: {
                        forcedFlashList: {},
                        forcedHTML5List: {},
                        forcedBackupList: {}
                    }
                },
                tracking: {},
                format: {}
            };

        });


       
        it("should execute on localRegister:registerAd:complete event with invalid config", function (done) {
            var ad = new ACT.StandardAd({
                "config": {
                    config: invalidConfig
                },
                "parent": {
                    config: invalidConfig
                }
            });

            var data = {
                firstPlay: false,
                states: {},
                status: 0
            };

            var validStatusAction = ACT.Event.on('register:Actions', function (actions) {
                if(actions[0].type === "playLayer"){
                    expect(ad.get('firstPlay')).to.equal(true);
                    validStatusAction.remove();
                    ad.destroy();
                    done();
                }    
                
            });

            ACT.Event.fire('localRegister:registerAd:complete', data);

        });

    });

    describe("checking dateCondition in flow", function () {
        var standardAd;

        before(function () {
            standardAd = new ACT.StandardAd({
                baseConfig: {
                    id: "test",
                    template: 'floating',
                    version: '0.0.1.5',
                    forceEnv: {
                        forcedFlashList: {},
                        forcedHTML5List: {},
                        forcedBackupList: {}
                    }
                },
                tracking: {},
                format: {}
            });

            // stub Date.now() to always return 13 July, 2015 13:30:00
            sinon.stub(Date, 'now', function () {
                return new Date('13 July, 2015 13:30:00').getTime();
            });
        });

        after(function () {
            Date.now.restore();
        });

        it("should return true if dateCondition is not an Object", function () {
            expect(standardAd.isDateMatch('random thing')).to.be.true;
        });

        it("should return true if dateCondition doesn't have from and to", function () {
            expect(standardAd.isDateMatch({})).to.be.true;
        });

        describe("has both from and to attribute", function () {

            it("shoudld return true if current date is in the range", function () {
                var dateCondition = {
                    from: 'July 1, 2015 00:00:00',
                    to: 'July 29, 2015 23:59:59'
                };

                expect(standardAd.isDateMatch(dateCondition)).to.be.true;
            });

            it("shoudld return false if current date later than to", function () {
                var dateCondition = {
                    from: 'July 1, 2015 00 :00:00',
                    to: 'July 12, 2015'
                };

                expect(standardAd.isDateMatch(dateCondition)).to.be.false;

            });

            it("shoudld return false if current date sooner than from", function () {
                var dateCondition = {
                    from: 'July 15, 2015 00:00:00',
                    to: 'July 29, 2015 23:59:59'
                };

                expect(standardAd.isDateMatch(dateCondition)).to.be.false;
            });
        });

        describe("has only from attribute", function () {
            it("shoud return true if current date is later than from", function () {
                var dateCondition = {
                    from: 'July 10, 2015 00:00:00'
                };

                expect(standardAd.isDateMatch(dateCondition)).to.be.true;

            });

            it("shoud return false if current date is sooner than from", function () {
                var dateCondition = {
                    from: 'July 15, 2015 00:00:00'
                };

                expect(standardAd.isDateMatch(dateCondition)).to.be.false;

            });
        });

        describe("has only to attribute", function () {
            it("shoud return true if current date is sooner than to", function () {

                var dateCondition = {
                    to: 'July 29, 2015 23:59:59'
                };

                expect(standardAd.isDateMatch(dateCondition)).to.be.true;

            });

            it("shoud return false if current date is later than to", function () {
                var dateCondition = {
                    to: 'July 10, 2015 23:59:59'
                };

                expect(standardAd.isDateMatch(dateCondition)).to.be.false;

            });
        });

    });


    describe("checking timeout attribute", function(){
        var standardAd;

        before(function(){
            standardAd = new ACT.StandardAd({
                baseConfig: {
                    id: "test",
                    template: 'floating',
                    version: '0.0.1.5',
                    actionTimeout: 2,
                    forceEnv: {
                        forcedFlashList: {},
                        forcedHTML5List: {},
                        forcedBackupList: {}
                    }
                },
                tracking: {},
                format: {}
            });

            


        });

        it("should return the newly set global timeout value", function(done){
            var timeout = 2;

            var validTimeoutAction = ACT.Event.on('setTimeout:action', function(res){
                expect(standardAd.get('baseConfig').actionTimeout).to.equal(timeout);
                validTimeoutAction.remove();
                done();
            });

            standardAd.setActionTimeout();
    
        });


    });
});