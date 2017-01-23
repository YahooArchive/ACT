var expect = chai.expect;
var assert = chai.assert;

var Event = ACT.Event;
var Lang = ACT.Lang;
var Dom = ACT.Dom;
var Class = ACT.Class;
var Capability = ACT.Capability;


describe("ContentVideoHtml capability", function() {
	var config = {
	    type: "content-video-html",
	    id: "video_id",
	    classNode: "fluffynat0r",
	    env: ["html"],
	    css: {
	        width: "300px",
	        height: "250px"
	    },
	    videoHtmlConfig: {
	        autoplay: false,
	        videoMuted: true,
	        videoWebM: "https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p1411995788.webm",
	        videoMP4: "https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p13982563191411995727.mp4",
	        posterImage: 'https://s.yimg.com/dh/ap/hoangnm/test/mpubackup-300x250.jpg'
	    }
	};

	// for debugging only....
	Event.on('video:state', function(eventData) {

	    console.info('video:state', eventData);

	});

	// fake checking action condition event
	var actionChecking = ACT.Event.on('standardAd:checkActionCondition', function(eventData){
		eventData.callback(true);
	});

	var fakeVideoTag = {
		id: 'video_id',
	    nodeName: 'VIDEO',
	    className: '',
	    appendChild: sinon.stub(),
	    setAttribute: function() {},
	    getAttribute: function() {},
	    parentNode: null,
	    style: {},
	    attributes: {},
	    currentTime: 0,
	    duration: 100,
	    muted: false,
	    play: function() {},
	    pause: function() {},
	}

    before(function() {


        // stub DOM render to have a fake video tag
        // We do this because we don;t want to realize on outside module and video tag is not supported by phantomjs
        sinon.stub(Dom, 'nodeCreate', function(tag) {
        	if (tag.indexOf('<video') > -1){
	            return {
	                firstChild: fakeVideoTag
	            }
        	} else if (tag.indexOf('<source') > -1) {
        		return {
        			firstChild: {
        				nodeName: 'SOURCE'
        			}
        		}
        	}
        });
    });

    after(function() {
    	actionChecking.remove();
        Dom.nodeCreate.restore();
    });

    it("should have ACT.ContentVideoHtml instance", function() {
        expect(ACT.ContentVideoHtml).to.exist;
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

	/* "Create video content " */
    describe("Create video content ", function() {
        var ContentVideoHtml;
        var node;

        before(function() {
            console.info('test Create video content - before');

            sinon.stub(Event, 'fire', function(e) {
                return {
                    remove: function() {}
                }
            });

            sinon.stub(fakeVideoTag, 'setAttribute');

            ContentVideoHtml = new ACT.ContentVideoHtml({
                type: "content-video-html",
                id: "video_id-CreateVideoContent",
                classNode: "fluffynat0r",
                env: ["html"],
                css: {
                    width: "300px",
                    height: "250px"
                },
                videoHtmlConfig: {
                    autoplay: true,
                    videoMuted: true,
                    videoWebM: "https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p1411995788.webm",
                    videoMP4: "https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p13982563191411995727.mp4",
                    posterImage: 'https://s.yimg.com/dh/ap/hoangnm/test/mpubackup-300x250.jpg'
                }
            });

            node = ContentVideoHtml.getContent().node;
        });

        after(function() {
            Event.fire.restore();
            fakeVideoTag.setAttribute.restore();

            ContentVideoHtml.destroy();
            ContentVideoHtml = null;
            node = null;

            console.info('test Create video content - after');
        });

        it("should create video tag with pre-defined styles", function(done) {

            assert.match(node.nodeName, /VIDEO/, 'Wrong tag node');
            assert.strictEqual(node.style.width, '300px', 'Wrong width');
            assert.strictEqual(node.style.height, '250px', 'Wrong height');
            assert.isTrue(node.setAttribute.calledWith('id', 'video_id-CreateVideoContent'), 'Wrong id node');
            /* Since we're adding to the class and not replacing className a space is required.
            	Updating the test accordingly.
            */
            assert.strictEqual(node.className, ' fluffynat0r', 'Wrong class node');

            done();
        });

        it("should have default states from configObject", function(done) {

            assert.isTrue(node.controls, 'controls must be disabled');
            assert.isTrue(node.autoplay, 'autoplay must be enabled');
            assert.isTrue(node.muted, 'video sound is off by default');
            assert.isFalse(node.loop, 'video loop must be off');
            assert.isString(node.poster, 'poster string must be string');

            done();
        });

        it("should register actions to actions queue", function(done) {

            assert.isTrue(Event.fire.calledWith('register:Actions', sinon.match.array), 'must fire register actions event with right arguments');

            done();
        });
    });
/* "Create video content " */
    describe("Create video content with no css or class", function() {
        var ContentVideoHtmlNoData;
        var nodeNoData;

        before(function() {
            console.info('test Create video content - before');

            sinon.stub(Event, 'fire', function(e) {
                return {
                    remove: function() {}
                }
            });

            sinon.stub(fakeVideoTag, 'setAttribute');

            ContentVideoHtmlNoData = new ACT.ContentVideoHtml({
                type: "content-video-html",
                id: "video_id-CreateVideoContentTwo",
                env: ["html"],
                videoHtmlConfig: {
                    autoplay: true,
                    videoMuted: true,
                    videoWebM: "https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p1411995788.webm",
                    videoMP4: "https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p13982563191411995727.mp4",
                    posterImage: 'https://s.yimg.com/dh/ap/hoangnm/test/mpubackup-300x250.jpg'
                }
            });

            nodeNoData = ContentVideoHtmlNoData.getContent().node;
        });

        after(function() {
            Event.fire.restore();
            fakeVideoTag.setAttribute.restore();

            ContentVideoHtmlNoData.destroy();
            ContentVideoHtmlNoData = null;
            nodeNoData = null;

            console.info('test Create video content - after');
        });

        it("should create video tag with pre-defined styles", function(done) {

            assert.match(nodeNoData.nodeName, /VIDEO/, 'Wrong tag node');
            assert.isTrue(nodeNoData.setAttribute.calledWith('id', 'video_id-CreateVideoContentTwo'), 'Wrong id node');


            done();
        });

    });
	/* "Basic video functions" - make an instance of ContentVideoHtml  */
    describe("Basic video functions", function() {

        var ContentVideoHtml;
        var node;

        before(function() {
            console.info('test Basic video functions - before');
            sinon.stub(Event, 'fire', function() {
                return {
                    remove: function() {}
                }
            });

            ContentVideoHtml = new ACT.ContentVideoHtml(config);
            node = ContentVideoHtml.getContent().node;
            // document.body.appendChild(node);
        });

        after(function() {
            Event.fire.restore();
            ContentVideoHtml = null;
            node = null;
            console.info('test Basic video functions - after');
        });

        it("Should have play video", function(done) {

            sinon.stub(node, 'play');

            ContentVideoHtml.play(3);
            assert.isTrue(node.play.called, 'video play function is called');
            assert.equal(node.currentTime, 3, 'currentTime must be changed to 10');

            node.play.restore();
            done();

        });

        it("Should have pause", function(done) {
            sinon.stub(node, 'pause');

            ContentVideoHtml.pause();
            assert.isTrue(node.pause.called, 'video pause function is called');

            node.pause.restore();
            done();
        });

        it("Should have soundon", function(done) {

            ContentVideoHtml.soundOn();

            assert.isFalse(node.muted, 'video sound should be on');

            done();
        });

        it("Should have soundoff", function(done) {
            ContentVideoHtml.soundOff();

            assert.isTrue(node.muted, 'video sound should be off');

            done();
        });

        it("Should have start video", function(done) {

            sinon.stub(node, 'play');
            node.currentTime = 10;

            ContentVideoHtml.start();
            assert.isTrue(node.play.called, 'play function is called');
            assert.strictEqual(node.currentTime, 0, 'currentTime should start from 0');

            node.play.restore();
            done();

        });

        it("Should have stop video", function(done) {
            sinon.stub(node, 'pause');
            node.currentTime = 20;

            ContentVideoHtml.stop();
            assert.isTrue(node.pause.called, 'video should be paused');
            assert.strictEqual(node.currentTime, 0, 'timeline should get back to 0');

            node.pause.restore();

            done();
        });

        it("Should have seek video", function(done){

            node.currentTime = 20;

            ContentVideoHtml.seek(110); // 110%
            assert.strictEqual(node.currentTime, 20, 'timeline should not change because of invalid percentage');


            ContentVideoHtml.seek(30); // 30%
            // video.duration = 100;
            assert.strictEqual(node.currentTime, 30, 'timeline should be at equivelant of 30% video duration');

            done();
        });

        it("Should have fullscreen function", function(done){

            // assuming requestFullscreen is available
            node.requestFullscreen = sinon.spy();
            ContentVideoHtml.fullScreen();
            assert.isTrue(node.requestFullscreen.called, 'requestFullscreen is called');

            // remove requestFullscreen function
            node.requestFullscreen = null;
            // assuming msRequestFullscreen is available
            node.msRequestFullscreen = sinon.spy();
            ContentVideoHtml.fullScreen();
            assert.isTrue(node.msRequestFullscreen.called, 'msRequestFullscreen is called');


            // remove msRequestFullscreen function
            node.msRequestFullscreen = null;
            // assuming mozRequestFullScreen is available
            node.mozRequestFullScreen = sinon.spy();
            ContentVideoHtml.fullScreen();
            assert.isTrue(node.mozRequestFullScreen.called, 'mozRequestFullScreen is called');

            // remove mozRequestFullScreen function
            node.mozRequestFullScreen = null;
            // assuming webkitRequestFullscreen is available
            node.webkitRequestFullscreen = sinon.spy();
            ContentVideoHtml.fullScreen();
            assert.isTrue(node.webkitRequestFullscreen.called, 'webkitRequestFullscreen is called');

            // remove webkitRequestFullscreen function
            node.webkitRequestFullscreen = null;

            done();
        });

        it("should destroy instance and dom", function(done){
        	// node.parentNode.removeChild(node);
        	node.parentNode = {
        		removeChild: sinon.stub()
        	};

        	ContentVideoHtml.destroy();

        	assert.isTrue(node.parentNode.removeChild.called, 'removeChild shoudl be called');

        	done();
        });

    });

    /* "Video triggers events" */
    describe("Video triggers events", function() {
        var ContentVideoHtml;

        before(function() {
            console.info('Test Video triggers events - before');
            ContentVideoHtml = new ACT.ContentVideoHtml(config);
            node = ContentVideoHtml.getContent().node;
        });

        after(function() {
            ContentVideoHtml.destroy();
            ContentVideoHtml = null;

            console.info('Test Video triggers events - after');
        });

        it('should have events registered', function(done){
        	// 11 event listeners:
        	// [start, stop, play, seek, pause, soundon, soundoff, fullscreen, resize, screen_status]
            assert.deepEqual(ContentVideoHtml.get('eventList').length, 11, '11 event listeners must be registed');
            done();
        });

        it("should start video with video:start event", function(done) {

            sinon.stub(node, 'play');
            node.currentTime = 10;
            Event.fire('video:start', {
                videoId: 'video_id'
            });

            setTimeout(function() {
                assert.isTrue(node.play.called, 'start function should be called');
                assert.strictEqual(node.currentTime, 0, 'should play from start');

	            node.play.restore();
                done();

            }, 10);
        });

        it('should play video with video:play event', function(done) {
            sinon.stub(node, 'play');
            node.currentTime = 10;

            Event.fire('video:play', {
                videoId: 'video_id'
            });

            setTimeout(function() {

                assert.isTrue(node.play.called, 'play function should be called');
                assert.strictEqual(node.currentTime, 10, 'play should be from 10');
                node.play.restore();
                done();

            }, 10);
        });

        it('should pause video with video:pause event', function(done) {
        	sinon.stub(node, 'pause');
        	node.currentTime = 10;
            Event.fire('video:pause', {
                videoId: 'video_id'
            });

            setTimeout(function() {

                assert.isTrue(node.pause.called, 'pause function should be called');
                assert.strictEqual(node.currentTime, 10, 'pause at 10 second');
                node.pause.restore();
                done();

            }, 10);
        });

        it('should stop video with video:stop event', function(done) {
        	sinon.stub(node, 'pause');
        	node.currentTime = 10;

            Event.fire('video:stop', {
                videoId: 'video_id'
            });

            setTimeout(function() {

                assert.isTrue(node.pause.called, 'stop function should be called');
                assert.strictEqual(node.currentTime, 0, 'timeline must get back to 0');
                node.pause.restore();
                done();

            }, 10);

        });

        it('should unmute video with video:soundOn event', function(done) {

            Event.fire('video:soundOn', {
                videoId: 'video_id'
            });

            setTimeout(function() {

                assert.strictEqual(node.muted, false, 'muted should be off');

                done();

            }, 10);

        });

        it('should mute video with video:soundOff event', function(done) {

            Event.fire('video:soundOff', {
                videoId: 'video_id'
            });

            setTimeout(function() {

                assert.strictEqual(node.muted, true, 'muted should be on');

                done();

            }, 10);

        });

        it('should call resize function with resize event', function(done){

        	sinon.stub(ContentVideoHtml, 'resize');

        	Event.fire('video:resize', {
        		videoId: 'video_id',
        		state: 'state'
        	});

        	setTimeout(function(){

        		assert.isTrue(ContentVideoHtml.resize.calledWith('state'), 'resize function should be called');
        		ContentVideoHtml.resize.restore();

        		done();
        	}, 10);
        });

        it('should call resize function with screen status event', function(done){

        	sinon.stub(ContentVideoHtml, 'resize');

        	// with resize attribute is not define, resize function should not be called
        	Event.fire('screen:status', {
        		status: 'expand1'
        	});

        	// with resize attribute is defined, resize function should be called
        	ContentVideoHtml.get('configObject').resize = true;
        	Event.fire('screen:status', {
        		status: 'expand2'
        	});

        	setTimeout(function(){

        		assert.isTrue(ContentVideoHtml.resize.calledOnce, 'resize function should be called once only');
        		assert.isTrue(ContentVideoHtml.resize.calledWith(sinon.match.object.and(sinon.match.has('status', 'expand2'))), 'resize function should be called with expand2');
        		ContentVideoHtml.resize.restore();

        		done();
        	}, 10);

        });

        it("Should seek video progress with video seek event", function(done){
            Event.fire("video:seek", {
                videoId: "video_id",
                percentage: 40
            });

            setTimeout(function(){
                var node = ContentVideoHtml.get('node');

                assert.deepEqual(node.currentTime, 40, "video currentTime must be the same with equivalent of 40% duration");

                done();

            }, 10);

        });

        it("Should do video fullscreen with fullScreen event", function(done){
            sinon.stub(ContentVideoHtml, 'fullScreen');

            Event.fire('video:fullscreen', {
                videoId: 'video_id'
            });

            setTimeout(function(){
                assert.isTrue(ContentVideoHtml.fullScreen.called, 'ContentVideoHtml.fullScreen should be called');
                ContentVideoHtml.fullScreen.restore();
                done();
            }, 10);
        });

        it("Should broadcase video events from VideoEvents module", function(done){
            sinon.spy(Event, "fire");

            Event.fire("video:action", {
                "videoId": "video_id",
                "videoNode": node,
                "data": "",
                "eventType": "",
                "eventLongName": "volumechange",
                "event": "video:volumechange"
            });

            setTimeout(function(){

                assert.isTrue(Event.fire.calledWith("video:state", {videoId:"video_id", "data": "volumechange"}), "must broadcase volumechange event");

                Event.fire.restore();
                done();
            }, 10);
        });
    });

    describe("Video with cuePoint", function(){

        var ContentVideoHtml;
        var node;

        before(function() {
            // keeping ref for original EventFire so we can control what kind of event we atually want to fire
            Event.originalEventFire = Event.fire;
            sinon.stub(Event, 'fire', function(eventName, data) {
                // assuming action condition is always correct so we can execute the call back directly
                if (eventName === 'standardAd:checkActionCondition'){
                    data.callback(true);
                }
                else {
                    Event.originalEventFire(eventName, data);
                }
            });

            // keeping ref for original EventFire so we can control what kind of event we atually want to fire
            // var originalEventOn = Event.on;
            // sinon.stub(Event, 'on', function(eventName, data, target, scope) {
            //     return originalEventOn(eventName, data, target, scope);
            // });

            sinon.stub(fakeVideoTag, 'setAttribute');

            ContentVideoHtml = new ACT.ContentVideoHtml({
                type: "content-video-html",
                id: "video_id",
                classNode: "fluffynat0r",
                env: ["html"],
                css: {
                    width: "300px",
                    height: "250px"
                },
                videoHtmlConfig: {
                    autoplay: true,
                    videoMuted: true,
                    videoWebM: "https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p1411995788.webm",
                    videoMP4: "https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p13982563191411995727.mp4",
                    posterImage: 'https://s.yimg.com/dh/ap/hoangnm/test/mpubackup-300x250.jpg'
                },
                customEventActions: {
                    cuePoint1: 5, // new eventType named cuePoint1 which triggered when the video reach 5 second
                    cuePoint2: 10,
                    cuePoint3: 15
                },
                eventConfig: [{
                eventType: 'cuePoint1',
                actions: [{
                        type: 'actionForCuePoint1',
                        to: 'video1'
                    }]
                },{
                    eventType: 'cuePoint2',
                    actions: [{
                        type: 'actionForCuePoint2',
                        to: 'video1'
                    }]
                },{
                    eventType: 'cuePoint3',
                    actions: [{
                        type: 'actionForCuePoint3',
                        to: 'video1'
                    }]
                }]
            });

            node = ContentVideoHtml.getContent().node;
        });

        after(function() {
            Event.fire.restore();
            fakeVideoTag.setAttribute.restore();

            ContentVideoHtml.destroy();

        });

        it("should register cuePoints eventType", function(){
            var customEventActions = ContentVideoHtml.get('customEventActions');
            assert.deepEqual(customEventActions['cuePoint1'], 5, 'cuePoint1 custom event must be added with correct related seconds');
            assert.deepEqual(customEventActions['cuePoint2'], 10, 'cuePoint1 custom event must be added with correct related seconds');
            assert.deepEqual(customEventActions['cuePoint3'], 15, 'cuePoint1 custom event must be added with correct related seconds');
            assert.deepEqual(ContentVideoHtml.get('eventList').length, 14, '3 new event listener must be registed');
        });

        it("should register cuePoints to videoEvents module", function(){
            var videoEvents = ContentVideoHtml.get('videoEventsRef');
            var cuePoints = videoEvents.config.cuePoints;
            var tracking = videoEvents.config.tracking;
            assert.isTrue(tracking.cuePoint1, 'cuePoint1 should be registed on videoEvents tracking');
            assert.isTrue(tracking.cuePoint2, 'cuePoint2 should be registed on videoEvents tracking');
            assert.isTrue(tracking.cuePoint3, 'cuePoint3 should be registed on videoEvents tracking');

            assert.deepEqual(cuePoints[5], 'cuePoint1', 'trigger time for cuePoint1 should be registed on videoEvents cuePoints');
            assert.deepEqual(cuePoints[10], 'cuePoint2', 'trigger time for cuePoint2 should be registed on videoEvents cuePoints');
            assert.deepEqual(cuePoints[15], 'cuePoint3', 'trigger time for cuePoint3 should be registed on videoEvents cuePoints');
        });

        it("should trigger cuePoints when time reach", function(done){
            // if we fire video:state with cuePoint1, it should do something like firing pauseVideo action
            Event.fire('video:state', {
                videoId: 'video_id',
                data: 'cuePoint1'
            });

            Event.fire('video:state', {
                videoId: 'video_id',
                data: 'cuePoint3'
            });

            setTimeout(function(){

                assert.isTrue(Event.fire.calledWith('add:actions', [{type: 'actionForCuePoint1', to: 'video1'}]), 'actionForCuePoint1 should be triggered');
                assert.isTrue(Event.fire.calledWith('add:actions', [{type: 'actionForCuePoint3', to: 'video1'}]), 'actionForCuePoint3 should be triggered');

                assert.isFalse(Event.fire.calledWith('add:actions', [{type: 'actionForCuePoint2', to: 'video1'}]), 'actionForCuePoint2 should be triggered');

                done();

            }, 10);
        });

    });
});
