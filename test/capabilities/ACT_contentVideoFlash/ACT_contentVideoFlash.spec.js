var expect = chai.expect;
var assert = chai.assert;

var Event = ACT.Event;
var Lang = ACT.Lang;
var Dom = ACT.Dom;
var Class = ACT.Class;
var Capability = ACT.Capability;
var SWFBridge = ACT.SWFBridge;
var ContentSwf = ACT.ContentSwf;

var TEST_FLASHVARS = [
    "width",
    "height",
    "videoPath",
    "autoplay",
    "videoMuted",
    "swfId",
    "callback",
    "callscope"
];

describe("ContentVideoFlash: Check the init state", function() {

    it("should have ACT.ContentVideoFlash instance", function() {
        expect(ACT.ContentVideoFlash).to.exist;
    });

    it("should have ACT.Event instance", function() {
        expect(Event).to.exist;
    });

    it("should have ACT.Lang instance", function() {
        expect(Lang).to.exist;
    });

    it("should have ACT.Dom instance", function() {
        expect(Dom).to.exist;
    });

    it("should have ACT.Class instance", function() {
        expect(Class).to.exist;
    });

    it("should have ACT.Capability instance", function() {
        expect(Capability).to.exist;
    });

    it("should have ACT.SWFBridge instance", function() {
        expect(SWFBridge).to.exist;
    });

    it("should have ACT.ContentSwf instance", function() {
        expect(ContentSwf).to.exist;
    });

    describe("Check ATTRS", function() {

        var config = {
            type: "content-video-flash",
            id: "flash_video_container",
            classNode: "fluffynat0r",
            env: ["flash"],
            css: {},
            "videoFlashConfig": {
                width: "300px",
                height: "400px",
                videoPath: "",
                autoplay: true,
                videoMuted: true
            }
        };

        var ContentVideoFlash = new ACT.ContentVideoFlash(config);
        var node = ContentVideoFlash.getContent().node;


        it("Should have NAME", function() {
            expect(ContentVideoFlash.ATTRS.NAME).to.exist;
            assert.strictEqual(ContentVideoFlash.ATTRS.NAME, 'ContentVideoFlash', 'Name is not ContentVideoFlash');
        });

        it("Should have version", function() {
            expect(ContentVideoFlash.ATTRS.version).to.exist;
        });

        it("Should have configObject", function() {
            expect(ContentVideoFlash.ATTRS.configObject).to.exist;
            assert.isObject(ContentVideoFlash.ATTRS.configObject);
        });

        it("Should have videoId", function() {
            expect(ContentVideoFlash.ATTRS.videoId).to.exist;
            assert.strictEqual(ContentVideoFlash.ATTRS.videoId, 'flash_video_container', 'ID is not flash_video_container');
        });

        it("Should node be null", function() {
            expect(ContentVideoFlash.ATTRS.node).to.exist;
            assert.isNotNull(ContentVideoFlash.ATTRS.node);
        });

        it("Should have eventList", function() {
            expect(ContentVideoFlash.ATTRS.eventList).to.exist;
            assert.isArray(ContentVideoFlash.ATTRS.eventList);
        });


    });

    describe("Check all functions", function() {

        var ContentVideoFlash = new ACT.ContentVideoFlash({});

        it("Should have start", function() {
            expect(ContentVideoFlash.start).to.exist;
            assert.isFunction(ContentVideoFlash.start);
        });

        it("Should have stop", function() {
            expect(ContentVideoFlash.stop).to.exist;
            assert.isFunction(ContentVideoFlash.stop);
        });

        it("Should have play", function() {
            expect(ContentVideoFlash.play).to.exist;
            assert.isFunction(ContentVideoFlash.play);
        });

        it("Should have pause", function() {
            expect(ContentVideoFlash.pause).to.exist;
            assert.isFunction(ContentVideoFlash.pause);
        });

        it("Should have soundon", function() {
            expect(ContentVideoFlash.soundOn).to.exist;
            assert.isFunction(ContentVideoFlash.soundOn);
        });

        it("Should have soundoff", function() {
            expect(ContentVideoFlash.soundOff).to.exist;
            assert.isFunction(ContentVideoFlash.soundOff);
        });

    });

    describe("ContentVideoFlash: Check Content without videoFlashConfig", function(){

        it("Checking no videoFlashConfig", function(done){

            var config = {
                type: "content-video-flash",
                id: "flash_video_container",
                classNode: "fluffynat0r",
                env: ["flash"],
                css: {}
            };
            var ContentVideoFlash = new ACT.ContentVideoFlash(config);
            var node = ContentVideoFlash.getContent().node;

            assert.match(node.nodeName, /OBJECT||EMBED/, 'Wrong tag node');
            assert.strictEqual(node.width, '100%', 'Wrong width');
            assert.strictEqual(node.height, '100%', 'Wrong height');

            done();

        });

    });

    describe("ContentVideoFlash: Check SWF Player", function() {

        var config = {
            type: "content-video-flash",
            id: "flash_video_container",
            classNode: "fluffynat0r",
            env: ["flash"],
            css: {},
            "videoFlashConfig": {
                width: "300px",
                height: "400px",
                videoPath: "",
                autoplay: true,
                videoMuted: true
            },
            eventActions: [{
                eventType: "start",
                actions: [{}]
            }]
        };

        var ContentVideoFlash;

        it("Checking videoEvents", function(done){

            var checkRegister = function(a, b){

                //avoid to test other actions
                if(a!=='register:Actions'){
                    return;
                }

                expect(a).to.be.equal('register:Actions');
                expect(b).to.be.a('Array');

                var videoEvents = b;
                videoEvents.forEach(function(element, index, array){

                    expect(element.type).to.exist;
                    expect(element.argument).to.exist;
                    expect(element.process).to.exist;

                    //testing type
                    expect(element.type).to.be.a('string');

                    //testing argument
                    expect(element.argument).to.be.a('object');
                    expect(element.argument).to.have.property('videoId');
                    expect(element.argument.videoId).to.be.a('object');
                    expect(element.argument.videoId.name).to.exist;
                    expect(element.argument.videoId.test).to.exist;
                    assert.strictEqual('videoId', element.argument.videoId.name);
                    assert.isFunction(element.argument.videoId.test);
                    expect(element.argument.videoId.test('video')).to.be.true;
                    expect(element.argument.videoId.test(1)).to.be.false;
                    expect(element.argument.videoId.test(undefined)).to.be.false;
                    expect(element.argument.videoId.test(null)).to.be.false;                    
                    expect(element.argument.timeout.test(10)).to.be.true;
                    expect(element.argument.timeout.test(undefined)).to.be.true;
                    expect(element.argument.timeout.test(null)).to.be.true;
                    expect(element.argument.timeout.test("10")).to.be.true;
                    //testing process
                    assert.isFunction(element.process);
                    element.process(1, 'videoId');

                });

            };

            sinon.stub(Event, 'fire', function(a, b){
                checkRegister(a, b);
            });

            ContentVideoFlash = new ACT.ContentVideoFlash(config);

            Event.fire.restore();

            done();

        });

        ContentVideoFlash = new ACT.ContentVideoFlash(config);
        var node = ContentVideoFlash.getContent().node;
        document.body.appendChild(node);

        it("Checking Node", function(done) {

            assert.match(node.nodeName, /OBJECT||EMBED/, 'Wrong tag node');
            assert.strictEqual(node.width, '300px', 'Wrong width');
            assert.strictEqual(node.height, '400px', 'Wrong height');

            done();

        });

        it("Checking Flashvars", function(done) {

            var flashvars = node.getAttribute("flashvars").split("&");
            expect(flashvars).to.be.a('Array');

            var fv = {};
            flashvars.forEach(function(element, index, array) {
                var temp = element.split("=");
                fv[temp[0]] = temp[1];
            });

            expect(fv).to.contain.all.keys(TEST_FLASHVARS);

            expect(fv.width).to.exist;
            expect(fv.width).to.be.equal("300px", "Wrong video width");

            expect(fv.height).to.exist;
            expect(fv.height).to.be.equal("400px", "Wrong video height");

            expect(fv.videoPath).to.exist;
            expect(fv.videoPath).to.be.equal("", "Wrong videoPath");

            expect(fv.autoplay).to.exist;
            expect(fv.autoplay).to.be.equal("true", "Wrong autoplay");

            expect(fv.videoMuted).to.exist;
            expect(fv.videoMuted).to.be.equal("true", "Wrong videoMuted");

            done();

        });

        it("Checking all events", function(done) {

            sinon.stub(Event, 'fire');

            ContentVideoFlash.eventHandler(node.id, {type: "handler:start"});
            expect(Event.fire.calledWith('handler:start', sinon.match.object.and(sinon.match.has('id', node.id)))).to.be.true;

            ContentVideoFlash.eventHandler(node.id, {actions: []});
            expect(Event.fire.calledWith('add:actions'), sinon.match.array ).to.be.true;

            Event.fire.restore();

            ContentVideoFlash.eventHandler(node.id, {type: "videoflash:start"});

            sinon.stub(SWFBridge, 'callSWF');

            Event.fire("video:start", {videoId: config.id});
            expect(SWFBridge.callSWF.calledWith(sinon.match.has('id', node.id), 'startVideo')).to.be.true;

            Event.fire("video:stop", {videoId: config.id});
            expect(SWFBridge.callSWF.calledWith(sinon.match.has('id', node.id), 'stopVideo')).to.be.true;

            Event.fire("video:play", {videoId: config.id});
            expect(SWFBridge.callSWF.calledWith(sinon.match.has('id', node.id), 'videoResume')).to.be.true;

            Event.fire("video:pause", {videoId: config.id});
            expect(SWFBridge.callSWF.calledWith(sinon.match.has('id', node.id), 'videoPause')).to.be.true;

            Event.fire("video:soundOn", {videoId: config.id});
            expect(SWFBridge.callSWF.calledWith(sinon.match.has('id', node.id), 'videoUnmute')).to.be.true;

            Event.fire("video:soundOff", {videoId: config.id});
            expect(SWFBridge.callSWF.calledWith(sinon.match.has('id', node.id), 'videoMute')).to.be.true;

            SWFBridge.callSWF.restore();

            done();

        });

        ContentVideoFlash.destructor();

    });

});

