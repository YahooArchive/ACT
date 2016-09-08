var expect = chai.expect;
var assert = chai.assert;

var Event = ACT.Event;
var Lang = ACT.Lang;
var Dom = ACT.Dom;

/*

This test file is mostly taken from the HTML Video Capability. Since similar tracking tests need to happen.

*/
/* VideoEvents Basic Tests */
describe("VideoEvents Library", function() {

	/* ACT.VideoEvents */
    it("should have ACT.VideoEvents instance", function() {
        expect(ACT.VideoEvents).to.exist;
		expect(ACT.VideoEvents.ATTRS).to.exist;
		expect(ACT.VideoEvents.ATTRS.NAME).to.exist;
		expect(ACT.VideoEvents.ATTRS.version).to.exist;
    });

	/* ACT.Event */
    it("should have ACT.Event instance", function() {
        expect(Event).to.exist;
    });

	/* ACT.Lang */
    it("should have ACT.Lang instance", function() {
        expect(Lang).to.exist;
    });

	/* ACT.DOM */
    it("should have ACT.Dom instance", function() {
        expect(Dom).to.exist;
    });

    /* Test simple functions - validateVideoNde, calculateVideoPercentage, destroy, broadcast */
    describe("Test simple function calls", function(){

    	it("Should return true for new video node - validateVideoNode", function(){
			var videoNode = Dom.nodeCreate('<div id="video_node"><video id="bob" width="400" controls><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p13982563191411995727.mp4" type="video/mp4"><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p1411995788.webm" type="video/webm"></video></div>');
			var domVideoNode = videoNode.firstChild.firstChild;
			var VE = new ACT.VideoEvents( domVideoNode, "bob_the_video" );
			expect(VE.validateVideoNode()).to.equal(true);
    	});

		it("Should return false for new video node - validateVideoNode", function(){
			var videoNode = Dom.nodeCreate('<div id="video_node1"></div>');
			var domVideoNode = videoNode.firstChild;
			var VE = new ACT.VideoEvents( domVideoNode, "bob_the_video" );
			expect(VE.validateVideoNode()).to.equal(false);
    	});

		it("Should work for a string node id", function(){
			var videoNode = Dom.nodeCreate('<div id="video_node2"><video id="bob" width="400" controls><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p13982563191411995727.mp4" type="video/mp4"><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p1411995788.webm" type="video/webm"></video></div>');
			document.body.appendChild(videoNode);
			var VE = new ACT.VideoEvents( 'bob', "bob_the_video" );
			expect(VE.validateVideoNode()).to.equal(true);
			document.body.removeChild(Dom.byId("video_node2"));
		});

		it("Should work OK for calculate video percentage. ", function(){
			var videoNode = Dom.nodeCreate('<div id="video_node3"><video id="bob" width="400" controls><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p13982563191411995727.mp4" type="video/mp4"><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p1411995788.webm" type="video/webm"></video></div>');
			var domVideoNode = videoNode.firstChild.firstChild;
			var VE = new ACT.VideoEvents( domVideoNode, "bob_the_video" );
			console.log("HERE ==>>>", VE.calculateVideoPercentage);
			expect(VE.calculateVideoPercentage()).not.to.throw;
    	});

		it("Should not throw errors on resetParts", function(){
			var videoNode = Dom.nodeCreate('<div id="video_node4"><video id="bob" width="400" controls><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p13982563191411995727.mp4" type="video/mp4"><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p1411995788.webm" type="video/webm"></video></div>');
			var domVideoNode = videoNode.firstChild.firstChild;
			var VE = new ACT.VideoEvents( domVideoNode, "bob_the_video" );
			expect(VE.resetParts()).not.to.throw;
		});

		it("Should be able to broadcast events with extra data ", function(done){
			var videoNode = Dom.nodeCreate('<div id="video_node4"><video id="bob" width="400" controls><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p13982563191411995727.mp4" type="video/mp4"><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p1411995788.webm" type="video/webm"></video></div>');
			var domVideoNode = videoNode.firstChild.firstChild;
			var VE = new ACT.VideoEvents( domVideoNode, "bob_the_video" );

			var tmp = Event.on('video:action', function(event){
				expect(event).to.deep.equal({ "eventType": "ended", "event":"video:complete", data: { "test": true }, videoId: "bob_the_video", videoNode: domVideoNode, eventLongName: "complete" });
				tmp.remove();
				done();
			}, null, this);

			expect(VE.broadcast("ended", { "test": true })).not.to.throw;
		});

		it("Should be able to broadcast events no extra data ", function(done){
			var videoNode = Dom.nodeCreate('<div id="video_node4"><video id="bob" width="400" controls><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p13982563191411995727.mp4" type="video/mp4"><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p1411995788.webm" type="video/webm"></video></div>');
			var domVideoNode = videoNode.firstChild.firstChild;
			var VE = new ACT.VideoEvents( domVideoNode, "bob_the_video" );

			var tmp = Event.on('video:action', function(event){
				expect(event).to.deep.equal({ "eventType": "ended", "event":"video:complete", data: { }, videoId: "bob_the_video", videoNode: domVideoNode, eventLongName: "complete" });
				tmp.remove();
				done();
			}, null, this);

			expect(VE.broadcast("ended")).not.to.throw;
		});

		it("Should not throw errors on destroy", function(){
			var videoNode = Dom.nodeCreate('<div id="video_node5"><video id="bob" width="400" controls><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p13982563191411995727.mp4" type="video/mp4"><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p1411995788.webm" type="video/webm"></video></div>');
			var domVideoNode = videoNode.firstChild.firstChild;
			var VE = new ACT.VideoEvents( domVideoNode, "bob_the_video" );
			expect(VE.destroy()).not.to.throw;
		});

        it("Should not throw errors on click", function(){
            var videoNode = Dom.nodeCreate('<div id="video_node5"><video id="bob" width="400" controls><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p13982563191411995727.mp4" type="video/mp4"><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p1411995788.webm" type="video/webm"></video></div>');
            var domVideoNode = videoNode.firstChild.firstChild;
            domVideoNode.controls = true;
            var VE = new ACT.VideoEvents( domVideoNode, "bob_the_video" );
            expect(VE.onClicked({
                offsetX: 100,
                offsetY: 200
            })).not.to.throw;
        });
    });

	describe("Test all the events.", function(){
		var VE;
        before(function() {
        	/* Simple Vide Node Tag */
			var videoNode = Dom.nodeCreate('<div id="video_node6"><video id="bob" width="400" controls><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p13982563191411995727.mp4" type="video/mp4"><source src="https://s.yimg.com/hl/ap/default/140929/AOV_25_490wide_768Kbps_360p1411995788.webm" type="video/webm"></video></div>');
			document.body.appendChild(videoNode);
			var domVideoNode = Dom.byId("bob");
            var eventConfig = {
                tracking: {
                    "cuePoint1": true,
                    "cuePoint2": true
                },
                cuePoints: {
                    5: "cuePoint1",
                    10: "cuePoint2"
                }
            }
			VE = new ACT.VideoEvents( domVideoNode, "bob_the_video",  eventConfig);
        });

        after(function() {
        	VE.destroy();
        	document.body.removeChild(document.getElementById("video_node6"));
        });

		/* Seeked  */
		it("Should Fire 'seeked' event", function(done){
			var tmp = Event.on('video:action', function(event){
                if(event.event === "video:seeked") {
                    expect(event.videoId).to.equal("bob_the_video");
                    tmp.remove();
                    done();
                }
			}, null, this);
			expect(VE.onSeeked()).to.not.throw;
		});

		/* 25% */
		it("Should Fire on25Percent event", function(done){
			var tmp = Event.on('video:action', function(event){
                if(event.event === "video:25percent"){
                    expect(event.videoId).to.equal("bob_the_video");
                    tmp.remove();
                    done();
                }
			}, null, this);
			expect(VE.on25Percent()).to.not.throw;
		});

		/* 50% */
		it("Should Fire on50Percent event", function(done){
			var tmp = Event.on('video:action', function(event){
                if(event.event === "video:50percent") {
                    expect(event.videoId).to.equal("bob_the_video");
                    tmp.remove();
                    done();
                }
			}, null, this);
			expect(VE.on50Percent()).to.not.throw;
		});

		/* 75% */
		it("Should Fire on75Percent event", function(done){
			var tmp = Event.on('video:action', function(event){
                if(event.event === "video:75percent") {
                    expect(event.videoId).to.equal("bob_the_video");
                    tmp.remove();
                    done();
                }
			}, null, this);
			expect(VE.on75Percent()).to.not.throw;
		});

		/* onEnded */
		it("Should Fire onEnded event", function(done){
			var tmp = Event.on('video:action', function(event){
                if(event.event === "video:complete") {
                    expect(event.videoId).to.equal("bob_the_video");
                    tmp.remove();
                    done();
                }
			}, null, this);
			expect(VE.onEnded()).to.not.throw;
		});

		/* onPause */
		it("Should Fire onPause event", function(done){
			var tmp = Event.on('video:action', function(event){
                if(event.event === "video:pause") {
                    expect(event.videoId).to.equal("bob_the_video");
                    tmp.remove();
                    done();
                }
			}, null, this);

			/* Fake Video Node */
			var domVideoNode = {
				id: 'bob_the_video',
				nodeName: 'VIDEO',
				className: '',
				currentTime: 15,
				duration: 100,
				muted: false,
				play: function() {},
				pause: function() {},
			};

			VE.videoNode = domVideoNode;
			expect(VE.onPause()).to.not.throw;
		});

		/* soundOn */
		it("Should Fire soundOn event if not muted and volumn is bigger than 0", function(done){
			var tmp = Event.on('video:action', function(event){
                if(event.event === "video:soundOn") {
                    tmp.remove();
                    expect(event.videoId).to.equal("bob_the_video");
                    console.info(VE.soundState);
                    expect(VE.soundState).to.equal("On");
                    done();
                }
			}, null, this);

			/* Fake Video Node */
			var domVideoNode1 = {
				id: 'bob_the_video',
				nodeName: 'VIDEO',
				className: '',
				currentTime: 15,
				duration: 100,
				muted: false,
				volume: 0.2,
				play: function() {},
				pause: function() {},
			};

			VE.videoNode = domVideoNode1;
			VE.soundState = 'Off';
			expect(VE.onVolumeChange()).to.not.throw;
		});

        /* soundOff with muted*/
        it("Should Fire soundOff event if muted", function(done){
            var tmp = Event.on('video:action', function(event){
                if(event.event === "video:soundOff") {
                    tmp.remove();
                    expect(event.videoId).to.equal("bob_the_video");
                    expect(VE.soundState).to.equal("Off");
                    done();
                }
            }, null, this);

            /* Fake Video Node */
            var domVideoNode2 = {
                id: 'bob_the_video',
                nodeName: 'VIDEO',
                className: '',
                currentTime: 15,
                duration: 100,
                muted: true,
                volume: 1,
                play: function() {},
                pause: function() {},
            };

            VE.videoNode = domVideoNode2;
            VE.soundState = 'On';
            expect(VE.onVolumeChange()).to.not.throw;
        });

        /* soundOff with 0 volumn */
        it("Should Fire soundOff event if volumn is 0", function(done){
            var tmp = Event.on('video:action', function(event){
                if(event.event === "video:soundOff") {
                    tmp.remove();
                    expect(event.videoId).to.equal("bob_the_video");
		            expect(VE.soundState).to.equal("Off");
                    done();
                }
            }, null, this);

            /* Fake Video Node */
            var domVideoNode2 = {
                id: 'bob_the_video',
                nodeName: 'VIDEO',
                className: '',
                currentTime: 15,
                duration: 100,
                muted: false,
                volume: 0,
                play: function() {},
                pause: function() {},
            };

            VE.videoNode = domVideoNode2;
            VE.soundState = 'On';
            expect(VE.onVolumeChange()).to.not.throw;
        });

        it("Should do nothing if sound state is not changed", function(done){
            /* Fake Video Node */
            var domVideoNode2 = {
                id: 'bob_the_video',
                nodeName: 'VIDEO',
                className: '',
                currentTime: 15,
                duration: 100,
                muted: false,
                volume: 0.1,
                play: function() {},
                pause: function() {},
            };

            VE.videoNode = domVideoNode2;
            VE.soundState = 'On';
            expect(VE.onVolumeChange()).to.not.throw;
            expect(VE.soundState).to.equal('On');
            done();
        });

        /* onTimeUpdate */
		it("Should Fire onTimeUpdate event", function(){
			/* Fake Video Node */
			var domVideoNode = {
				id: 'bob_the_video',
				nodeName: 'VIDEO',
				className: '',
				currentTime: 25,
				duration: 100,
				muted: false,
				play: function() {},
				pause: function() {},
			};

			VE.videoNode = domVideoNode;
			expect(VE.onTimeUpdate()).to.not.throw;

			domVideoNode.currentTime = 18;
			VE.videoNode = domVideoNode;
			expect(VE.onTimeUpdate()).to.not.throw;
		});

		it("Should Fire onPlay event", function(){
			/* Fake Video Node */
			var domVideoNode = {
				id: 'bob_the_video',
				nodeName: 'VIDEO',
				className: '',
				currentTime: 25,
				duration: 100,
				muted: false,
				play: function() {},
				pause: function() {},
			};

			VE.videoNode = domVideoNode;
			expect(VE.onPlay()).to.not.throw;

			expect(VE.onPlay()).to.not.throw;

			domVideoNode.currentTime = 2;
			VE.videoNode = domVideoNode;
			expect(VE.onPlay()).to.not.throw;
		});

        it("Should fire cuePoints events", function(){
            VE.videoNode.currentTime = 5;
            expect(VE.onTimeUpdate()).to.not.throw;
        });

		/* IF we are running the test in PhantomJS then ignore the "real" event test. Move on to the "fake" ones */
		if (navigator.userAgent.indexOf('PhantomJS') < 0) {
			it("should broadcast video events", function(done) {
				this.timeout(0);
				var count = 0;
				var events = [
					Event.on('video:play', function(event){ events[0].remove(); console.log("play", event); }, null, this),
					Event.on('video:start',function(event){ events[1].remove(); console.log("start", event); }, null, this),
					Event.on('video:stop',function(event){ events[2].remove(); console.log("stop", event); }, null, this),
					Event.on('video:resume',function(event){ events[3].remove(); console.log("resume", event); }, null, this),
					Event.on('video:replay',function(event){ events[4].remove(); console.log("replay", event); done(); }, null, this),
					Event.on('video:pause',function(event){ events[5].remove(); console.log("pause", event); }, null, this),
					Event.on('video:soundOn',function(event){ events[6].remove(); console.log("soundOn", event); }, null, this),
					Event.on('video:soundOff',function(event){ events[7].remove(); console.log("soundOff", event); }, null, this),
					Event.on('video:seeked',function(event){ events[8].remove(); console.log("seeked", event); }, null, this),
					Event.on('video:25percent',function(event){ events[9].remove(); console.log("25%", event); }, null, this),
					Event.on('video:50percent',function(event){ events[10].remove(); Dom.byId("bob").pause(); Dom.byId("bob").play();console.log("50%", event); }, null, this),
					Event.on('video:75percent',function(event){ events[11].remove(); console.log("75%", event); }, null, this),
					Event.on('video:complete',function(event){ events[12].remove();  console.log("complete", event); }, null, this),
                    Event.on('video:cuePoint1',function(event){ events[13].remove(); console.log("cuePoint1", event); }, null, this)
				];
				Dom.byId("bob").play();
			});
		}


    });
});