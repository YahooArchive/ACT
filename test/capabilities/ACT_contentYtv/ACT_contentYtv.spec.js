var expect = chai.expect;
var assert = chai.assert;

var Event = ACT.Event;
var Lang = ACT.Lang;

describe('ContentYtv', function() {
    var config = {
        type: "content-ytv",
        id: "ytv_container",
        classNode: "ytv_class",
        env: ["flash", "html"],
        css: {
            width: '352px',
            height: '198px'
        },
        ytvConfig: {
            "pageSpaceId": "1197357330",
            "playlist": {
                "mediaItems": [{
                    "id": "7b7521ca-8c38-3dd4-a996-07c7e09369b8"
                }]
            },
            "YVAP": {
                "accountId": "616",
                "playContext": "default"
            },
            "comscoreC4": "dummyC4"
        },
        eventActions: [{
            eventType: "start",
            actions: [{}]
        }, {
            eventType: "complete",
            actions: [{}]
        }, {
            eventType: "play",
            actions: [{}]
        }, {
            eventType: "pause",
            actions: [{}]
        }, {
            eventType: "replay",
            actions: [{}]
        }, {
            eventType: "soundon",
            actions: [{}]
        }, {
            eventType: "soundoff",
            actions: [{}]
        }, {
            eventType: "fullscreen",
            actions: [{}]
        }]
    };

    var NoDataConfig = {
        type: "content-ytv",
        id: "ytv_container",
        env: ["flash", "html"],
        ytvConfig: {
            "pageSpaceId": "1197357330",
            "playlist": {
                "mediaItems": [{
                    "id": "7b7521ca-8c38-3dd4-a996-07c7e09369b8"
                }]
            },
            "YVAP": {
                "accountId": "616",
                "playContext": "default"
            },
            "comscoreC4": "dummyC4"
        },
        eventActions: [{
            eventType: "start",
            actions: [{}]
        }, {
            eventType: "complete",
            actions: [{}]
        }, {
            eventType: "play",
            actions: [{}]
        }, {
            eventType: "pause",
            actions: [{}]
        }, {
            eventType: "replay",
            actions: [{}]
        }, {
            eventType: "soundon",
            actions: [{}]
        }, {
            eventType: "soundoff",
            actions: [{}]
        }, {
            eventType: "fullscreen",
            actions: [{}]
        }]
    };

    describe("ContentYtv: Check the init state", function() {

        it("should have ACT.ContentYtv instance", function() {
            expect(ACT.ContentYtv).to.exist;
        });

        it("should have ACT.Lang instance", function() {
            expect(Lang).to.exist;
        });

        it("should have ACT.Event instance", function() {
            expect(Event).to.exist;
        });

        describe("Check ATTRS", function() {

            var contentYtv = new ACT.ContentYtv(config);
            var node = contentYtv.getContent().node;

            it("Should have NAME", function() {
                expect(contentYtv.ATTRS.NAME).to.exist;
                assert.strictEqual(contentYtv.ATTRS.NAME, 'ContentYtv', 'Name is not ContentYtv');
            });

            it("Should have version", function() {
                expect(contentYtv.ATTRS.version).to.exist;
            });

            it("Should have configObject", function() {
                expect(contentYtv.ATTRS.configObject).to.exist;
                assert.isObject(contentYtv.ATTRS.configObject);
            });

            it("Should node be null", function() {
                expect(contentYtv.ATTRS.node).to.exist;
                assert.isNotNull(contentYtv.ATTRS.node);
            });

            it("Should have eventList", function() {
                expect(contentYtv.ATTRS.eventList).to.exist;
                assert.isArray(contentYtv.ATTRS.eventList);
            });

            contentYtv.destroy();

        });

        describe("Check all functions", function() {

            var contentYtv = new ACT.ContentYtv({});

            it("Should have start", function() {
                expect(contentYtv.start).to.exist;
                assert.isFunction(contentYtv.start);
            });

            it("Should have stop", function() {
                expect(contentYtv.stop).to.exist;
                assert.isFunction(contentYtv.stop);
            });

            it("Should have play", function() {
                expect(contentYtv.play).to.exist;
                assert.isFunction(contentYtv.play);
            });

            it("Should have pause", function() {
                expect(contentYtv.pause).to.exist;
                assert.isFunction(contentYtv.pause);
            });

            it("Should have soundon", function() {
                expect(contentYtv.soundOn).to.exist;
                assert.isFunction(contentYtv.soundOn);
            });

            it("Should have soundoff", function() {
                expect(contentYtv.soundOff).to.exist;
                assert.isFunction(contentYtv.soundOff);
            });

            contentYtv.destroy();

        });

    });

    describe("ContentYtv: Check actions, events and methods", function() {


        it("Check actions", function(done) {

            var actions = null;

            var listener = Event.on('register:Actions', function(e) {
                actions = e;

                listener.remove();
            });

            var contentYtv = new ACT.ContentYtv(config);

            assert.isArray(actions, 'reigstered action must be array');
            assert.isObject(actions[0], 'first actions must be an Object');
            assert.strictEqual('ytvStart', actions[0].type, 'first action is wrong');
            assert.strictEqual('ytvStop', actions[1].type, 'second action is wrong');
            assert.strictEqual('ytvPlay', actions[2].type, 'third action is wrong');
            assert.strictEqual('ytvPause', actions[3].type, 'fourth action is wrong');
            assert.strictEqual('ytvUnmute', actions[4].type, 'fifth action is wrong');
            assert.strictEqual('ytvMute', actions[5].type, 'sixth action is wrong');

            var i = e = 0,
                actionParamType = [
                    [''],
                    [''],
                    [''],
                    [''],
                    [''],
                    ['']
                ];

            for (var action in actions) {
                var argDefinition = actions[action].argument;
                assert.isFunction(actions[action].process);
                actions[action].process(1, {});
                for (var param in argDefinition) {
                    var definition = argDefinition[param];
                    var test = definition.test(actionParamType[i][e]);
                    assert.strictEqual(true, test, 'test value type failed');
                    e++;
                }
                i++;
                e = 0;
            }

            contentYtv.destroy();
            done();

        });



        it("should return false against invalid action arguments", function(done){


            ACT.Event.originalEventFire = ACT.Event.fire;
            sinon.stub(ACT.Event, 'fire', function(event, data){

                if (event === 'register:Actions'){

                    var ytvStart = data[0].argument;
                    var ytvStop = data[1].argument;
                    var ytvPlay = data[2].argument;
                    var ytvPause = data[0].argument;
                    var ytvUnmute = data[1].argument;
                    var ytvMute = data[2].argument;

                    expect(ytvStart.id.test(1)).to.be.false;
                    expect(ytvStart.id.test(undefined)).to.be.false;
                    expect(ytvStart.id.test(null)).to.be.false;
                    expect(ytvStart.timeout.test("test")).to.be.false;

                    expect(ytvStop.id.test(1)).to.be.false;
                    expect(ytvStop.id.test(undefined)).to.be.false;
                    expect(ytvStop.id.test(null)).to.be.false;
                    expect(ytvStop.timeout.test("test")).to.be.false;

                    expect(ytvPlay.id.test(1)).to.be.false;
                    expect(ytvPlay.id.test(undefined)).to.be.false;
                    expect(ytvPlay.id.test(null)).to.be.false;
                    expect(ytvPlay.timeout.test("test")).to.be.false;

                    expect(ytvPause.id.test(1)).to.be.false;
                    expect(ytvPause.id.test(undefined)).to.be.false;
                    expect(ytvPause.id.test(null)).to.be.false;
                    expect(ytvPause.timeout.test("test")).to.be.false;

                    expect(ytvUnmute.id.test(1)).to.be.false;
                    expect(ytvUnmute.id.test(undefined)).to.be.false;
                    expect(ytvUnmute.id.test(null)).to.be.false;
                    expect(ytvUnmute.timeout.test("test")).to.be.false;

                    expect(ytvUnmute.id.test(1)).to.be.false;
                    expect(ytvUnmute.id.test(undefined)).to.be.false;
                    expect(ytvUnmute.id.test(null)).to.be.false;
                    expect(ytvUnmute.timeout.test("test")).to.be.false;

                    ACT.Event.fire.restore(); 
                    done();

                } else {
                    ACT.Event.originalEventFire(event, data);
                }
            
            });

            var contentYtv = new ACT.ContentYtv(config);
          
        });

        it("should return true against valid action arguments", function(done){


            ACT.Event.originalEventFire = ACT.Event.fire;
            sinon.stub(ACT.Event, 'fire', function(event, data){

                if (event === 'register:Actions'){

                    var ytvStart = data[0].argument;
                    var ytvStop = data[1].argument;
                    var ytvPlay = data[2].argument;
                    var ytvPause = data[0].argument;
                    var ytvUnmute = data[1].argument;
                    var ytvMute = data[2].argument;

                    expect(ytvStart.id.test("ytv_content")).to.be.true;
                    expect(ytvStart.timeout.test(10)).to.be.true;
                    expect(ytvStart.timeout.test(undefined)).to.be.true;
                    expect(ytvStart.timeout.test(null)).to.be.true;

                    expect(ytvStop.id.test("ytv_content")).to.be.true;
                    expect(ytvStop.timeout.test(10)).to.be.true;
                    expect(ytvStop.timeout.test(undefined)).to.be.true;
                    expect(ytvStop.timeout.test(null)).to.be.true;

                    expect(ytvPlay.id.test("ytv_content")).to.be.true;
                    expect(ytvPlay.timeout.test(10)).to.be.true;
                    expect(ytvPlay.timeout.test(undefined)).to.be.true;
                    expect(ytvPlay.timeout.test(null)).to.be.true;

                    expect(ytvPause.id.test("ytv_content")).to.be.true;
                    expect(ytvPause.timeout.test(10)).to.be.true;
                    expect(ytvPause.timeout.test(undefined)).to.be.true;
                    expect(ytvPause.timeout.test(null)).to.be.true;

                    expect(ytvUnmute.id.test("ytv_content")).to.be.true;
                    expect(ytvUnmute.timeout.test(10)).to.be.true;
                    expect(ytvUnmute.timeout.test(undefined)).to.be.true;
                    expect(ytvUnmute.timeout.test(null)).to.be.true;

                    expect(ytvUnmute.id.test("ytv_content")).to.be.true;
                    expect(ytvUnmute.timeout.test(10)).to.be.true;
                    expect(ytvUnmute.timeout.test(undefined)).to.be.true;
                    expect(ytvUnmute.timeout.test(null)).to.be.true;

                    ACT.Event.fire.restore(); 
                    done();

                } else {
                    ACT.Event.originalEventFire(event, data);
                }
            
            });

            var contentYtv = new ACT.ContentYtv(config);
          
        });


        it("Check config and render with no css and no classname", function(done) {

            var contentYtv = new ACT.ContentYtv(NoDataConfig);
            var node = contentYtv.getContent().node;

            assert.strictEqual(node.className, '');

            done();

        });

        it("Check events", function(done) {

            var contentYtv = new ACT.ContentYtv(config);
            var node = contentYtv.getContent().node;
            document.body.appendChild(node);

            sinon.spy(Event, 'fire');

            Event.fire('ytv:start', {
                id: node.id
            });
            expect(Event.fire.calledWith('ytv:start', sinon.match.object.and(sinon.match.has('id', node.id)))).to.be.true;

            Event.fire('ytv:stop', {
                id: node.id
            });
            expect(Event.fire.calledWith('ytv:stop', sinon.match.object.and(sinon.match.has('id', node.id)))).to.be.true;

            Event.fire('ytv:play', {
                id: node.id
            });
            expect(Event.fire.calledWith('ytv:play', sinon.match.object.and(sinon.match.has('id', node.id)))).to.be.true;

            Event.fire('ytv:pause', {
                id: node.id
            });
            expect(Event.fire.calledWith('ytv:pause', sinon.match.object.and(sinon.match.has('id', node.id)))).to.be.true;

            Event.fire('ytv:soundOn', {
                id: node.id
            });
            expect(Event.fire.calledWith('ytv:soundOn', sinon.match.object.and(sinon.match.has('id', node.id)))).to.be.true;

            Event.fire('ytv:soundOff', {
                id: node.id
            });
            expect(Event.fire.calledWith('ytv:soundOff', sinon.match.object.and(sinon.match.has('id', node.id)))).to.be.true;

            Event.fire.restore();

            contentYtv.destroy();
            done();

        });

        it("Check API events", function(done) {

            var contentYtv = new ACT.ContentYtv(config);
            var node = contentYtv.getContent().node;
            document.body.appendChild(node);

            sinon.spy(contentYtv, 'subscribeVideoEvents');

            contentYtv.subscribeVideoEvents(config);
            expect(contentYtv.subscribeVideoEvents.calledWith(config)).to.be.true;

            contentYtv.subscribeVideoEvents.restore();
            contentYtv.destroy();
            done();
        });

    });

});