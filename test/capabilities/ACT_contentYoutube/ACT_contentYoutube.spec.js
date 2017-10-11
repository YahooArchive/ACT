var expect = chai.expect;
var assert = chai.assert;

var Event = ACT.Event;
var Lang = ACT.Lang;

describe('ContentYoutube', function() {

    var config = {
        type: "content-youtube",
        id: "youtube_container",
        classNode: "youtube_class",
        env: ["flash", "html"],
        css: {
            width: '352px',
            height: '198px'
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
            eventType: "ready",
            actions: [{}]
        }, {
            eventType: "25percent",
            actions: [{}]
        }, {
            eventType: "50percent",
            actions: [{}]
        }, {
            eventType: "75percent",
            actions: [{}]
        }]
    };

    describe("ContentYoutube: Check the init state", function() {

        it("should have ACT.ContentYoutube instance", function() {
            expect(ACT.ContentYoutube).to.exist;
        });

        it("should have ACT.Lang instance", function() {
            expect(Lang).to.exist;
        });

        it("should have ACT.Event instance", function() {
            expect(Event).to.exist;
        });

        describe("Check ATTRS", function() {

            var contentYoutube = new ACT.ContentYoutube(config);
            var node = contentYoutube.getContent().node;

            it("Should have NAME", function() {
                expect(contentYoutube.ATTRS.NAME).to.exist;
                assert.strictEqual(contentYoutube.ATTRS.NAME, 'ContentYoutube', 'Name is not ContentYoutube');
            });

            it("Should have version", function() {
                expect(contentYoutube.ATTRS).to.exist;
            });

            it("Should have configObject", function() {
                expect(contentYoutube.ATTRS.configObject).to.exist;
                assert.isObject(contentYoutube.ATTRS.configObject);
            });

            it("Should node be null", function() {
                expect(contentYoutube.ATTRS.node).to.exist;
                assert.isNotNull(contentYoutube.ATTRS.node);
            });

            it("Should have eventList", function() {
                expect(contentYoutube.ATTRS.eventList).to.exist;
                assert.isArray(contentYoutube.ATTRS.eventList);
            });

            contentYoutube.destroy();

        });

        describe("Check all functions", function() {

            var contentYoutube = new ACT.ContentYoutube({});

            it("Should have start", function() {
                expect(contentYoutube.start).to.exist;
                assert.isFunction(contentYoutube.start);
            });

            it("Should have stop", function() {
                expect(contentYoutube.stop).to.exist;
                assert.isFunction(contentYoutube.stop);
            });

            it("Should have play", function() {
                expect(contentYoutube.play).to.exist;
                assert.isFunction(contentYoutube.play);
            });

            it("Should have pause", function() {
                expect(contentYoutube.pause).to.exist;
                assert.isFunction(contentYoutube.pause);
            });

            it("Should have soundon", function() {
                expect(contentYoutube.soundOn).to.exist;
                assert.isFunction(contentYoutube.soundOn);
            });

            it("Should have soundoff", function() {
                expect(contentYoutube.soundOff).to.exist;
                assert.isFunction(contentYoutube.soundOff);
            });

            contentYoutube.destroy();

        });

    });

    describe("ContentYoutube: Check actions, events and methods", function() {

        it("Check actions", function(done) {

            var actions = null;

            var listener = Event.on('register:Actions', function(e) {
                actions = e;

                listener.remove();
            });

            var contentYoutube = new ACT.ContentYoutube(config);

            assert.isArray(actions, 'reigstered action must be array');
            assert.isObject(actions[0], 'first actions must be an Object');
            assert.strictEqual('youtubeStart', actions[0].type, 'first action is wrong');
            assert.strictEqual('youtubeStop', actions[1].type, 'second action is wrong');
            assert.strictEqual('youtubePlay', actions[2].type, 'third action is wrong');
            assert.strictEqual('youtubePause', actions[3].type, 'fourth action is wrong');
            assert.strictEqual('youtubeUnmute', actions[4].type, 'fifth action is wrong');
            assert.strictEqual('youtubeMute', actions[5].type, 'sixth action is wrong');

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

                    if(definition.name === "timeout"){
                        var nullTest = definition.test(null);
                        assert.strictEqual(true, nullTest, 'test value of null failed');
                    }
                    e++;
                }
                i++;
                e = 0;
            }

            contentYoutube.destroy();
            done();

        });

        it("Check config and render class and id", function(done) {

            var contentYoutube = new ACT.ContentYoutube(config);
            var node = contentYoutube.getContent().node;

            assert.strictEqual(node.id, 'youtube_container');
            assert.strictEqual(node.className, ' youtube_class');

            contentYoutube.destroy();
            done();

        });

        it("Check events", function(done) {

            var contentYoutube = new ACT.ContentYoutube(config);
            var node = contentYoutube.getContent().node;
            document.body.appendChild(node);

            sinon.spy(Event, 'fire');

            Event.fire('youtube:start', {
                to: node.id
            });
            expect(Event.fire.calledWith('youtube:start', sinon.match.object.and(sinon.match.has('to', node.id)))).to.be.true;

            Event.fire('youtube:stop', {
                to: node.id
            });
            expect(Event.fire.calledWith('youtube:stop', sinon.match.object.and(sinon.match.has('to', node.id)))).to.be.true;

            Event.fire('youtube:play', {
                to: node.id
            });
            expect(Event.fire.calledWith('youtube:play', sinon.match.object.and(sinon.match.has('to', node.id)))).to.be.true;

            Event.fire('youtube:pause', {
                to: node.id
            });
            expect(Event.fire.calledWith('youtube:pause', sinon.match.object.and(sinon.match.has('to', node.id)))).to.be.true;

            Event.fire('youtube:soundOn', {
                to: node.id
            });
            expect(Event.fire.calledWith('youtube:soundOn', sinon.match.object.and(sinon.match.has('to', node.id)))).to.be.true;

            Event.fire('youtube:soundOff', {
                to: node.id
            });
            expect(Event.fire.calledWith('youtube:soundOff', sinon.match.object.and(sinon.match.has('to', node.id)))).to.be.true;

            Event.fire.restore();

            contentYoutube.destroy();
            done();

        });

        it("Check API Events", function(done) {

            var contentYoutube = new ACT.ContentYoutube(config);
            var node = contentYoutube.getContent().node;
            var store = contentYoutube.get('store');
            document.body.appendChild(node);

            sinon.spy(contentYoutube, 'subscribeActionsToVideoEvents');

            contentYoutube.subscribeActionsToVideoEvents(config, store);
            expect(contentYoutube.subscribeActionsToVideoEvents.calledWith(config, store)).to.be.true;

            expect(store)
                .that.is.an('array')
                .to.have.all.keys('25percent', '50percent', '75percent', 'start', 'complete', 'play', 'pause', 'ready');

            contentYoutube.subscribeActionsToVideoEvents.restore();
            contentYoutube.destroy();
            done();

        });

    });

});