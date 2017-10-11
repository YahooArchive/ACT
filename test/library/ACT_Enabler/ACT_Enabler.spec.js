var expect = chai.expect;

describe('ACT.Enabler', function() {

    before(function(){
        // fake parent postMessage
        sinon.stub(parent, 'postMessage', function(data){
            ACT.Event.fire('Enabler:actions', data.EnablerData)
        });

        // fake window.open so it will not open anything
        sinon.stub(window, 'open', function(data){
            return 'macros:' + data;
        });
    });

    after(function(){
        parent.postMessage.restore();
        window.open.restore();
    });

    describe('studio', function() {

        var studio = window.studio;

        it ('should have instance of studio', function() {
            expect(studio).to.exist;
        });

        it ('should have VIDEO ModuleId', function() {
            expect(studio.module.ModuleId.VIDEO).to.exist;
        });

        it ('should have video Reporter', function() {
            expect(studio.video.Reporter).to.exist;
        });

        describe('video.Reporter', function() {

            var Reporter = studio.video.Reporter;
            var dummyVideo;

            before(function() {
                sinon.stub(Enabler, 'counter');
                createDummyElement('testVideo', 'video');
                dummyVideo = document.getElementById('testVideo');
            });

            after(function() {
                removeDummyElement('testVideo');
                Enabler.counter.restore();
            });

            it('should have the attach method', function() {
                expect(Reporter.attach).to.exist;
                expect(ACT.VideoEvents).to.exist;
                Reporter.getVideoTracking();
            });

            it('should attach a new video tracking', function() {
                var result = Reporter.attach('Video Tracking ID', dummyVideo, false);
                var videoTracking = Reporter.getVideoTracking();

                expect(videoTracking).ownProperty('Video Tracking ID');

            });

            /***************************************************************************************************************/
            /* Test video:events and automatic tracking in Enabler */
            /***************************************************************************************************************/
            /* start */
            it('should listen to video:action event - start', function(){
                ACT.Event.fire('video:action', {
                    "videoId": 'Video Tracking ID',
                    "videoNode": document.getElementById('testVideo'),
                    "data": "",
                    "eventType": 'start',
                    "event" : 'video:start'
                });
				expect(Enabler.counter.calledWith('Video Tracking ID:start')).to.be.equal(true);
            });

            /* 25% */
            it('should listen to video:action event - 25', function(){
                ACT.Event.fire('video:action', {
                    "videoId": 'Video Tracking ID',
                    "videoNode": document.getElementById('testVideo'),
                    "data": "",
                    "eventType": '25',
                    "event" : 'video:25percent'
                });
				expect(Enabler.counter.calledWith('Video Tracking ID:25')).to.be.equal(true);
            });

            /* 50% */
            it('should listen to video:action event - 50', function(){
                ACT.Event.fire('video:action', {
                    "videoId": 'Video Tracking ID',
                    "videoNode": document.getElementById('testVideo'),
                    "data": "",
                    "eventType": '50',
                    "event" : 'video:50percent'
                });
				expect(Enabler.counter.calledWith('Video Tracking ID:50')).to.be.equal(true);
            });

            /* 75% */
            it('should listen to video:action event - 75', function(){
                ACT.Event.fire('video:action', {
                    "videoId": 'Video Tracking ID',
                    "videoNode": document.getElementById('testVideo'),
                    "data": "",
                    "eventType": '75',
                    "event" : 'video:75percent'
                });
				expect(Enabler.counter.calledWith('Video Tracking ID:75')).to.be.equal(true);
            });

            /* ended/complete  */
            it('should listen to video:action event - ended/complete', function(){
                ACT.Event.fire('video:action', {
                    "videoId": 'Video Tracking ID',
                    "videoNode": document.getElementById('testVideo'),
                    "data": "",
                    "eventType": 'ended',
                    "event" : 'video:complete'
                });
				expect(Enabler.counter.calledWith('Video Tracking ID:ended')).to.be.equal(true);
            });

            /* pause */
            it('should listen to video:action event - pause', function(){
                ACT.Event.fire('video:action', {
                    "videoId": 'Video Tracking ID',
                    "videoNode": document.getElementById('testVideo'),
                    "data": "",
                    "eventType": 'pause',
                    "event" : 'video:pause'
                });
				expect(Enabler.counter.calledWith('Video Tracking ID:pause')).to.be.equal(true);
            });

            it('should detach a video identifier from reporting', function() {
                var videoTrackId = 'Video Tracking ID2';
                var result = Reporter.attach(videoTrackId, dummyVideo, true);
                var videoTracking = Reporter.getVideoTracking();
                var track = videoTracking[videoTrackId];

                expect(videoTracking).ownProperty(videoTrackId);
                expect(track).to.not.be.empty;

                Reporter.detach(videoTrackId);

                expect(videoTracking).not.ownProperty(videoTrackId);
            });
        });

        describe('common mde', function() {
            it ('should be able to return a valid direction', function() {
                var direction = studio.common.mde.Direction();
                expect(direction).to.equal('tl');
            });

            it('should be able to rotate between direction when is multidirectional', function() {
                var result = Enabler.setConfig({isMultiDirectional: true}, 'expand');
                var direction = studio.common.mde.Direction();
                expect(direction).to.equal('tl');
                var direction = studio.common.mde.Direction();
                expect(direction).to.equal('tr');
                var direction = studio.common.mde.Direction();
                expect(direction).to.equal('bl');
                var direction = studio.common.mde.Direction();
                expect(direction).to.equal('br');
                var direction = studio.common.mde.Direction();
                expect(direction).to.equal('tl');
            });
        });

        describe('common Environment', function() {
            it('should be able to return a valid environment', function() {
                var environment = studio.common.Environment.getValue();
                expect(environment).to.equal(6);
            });

            it('should be able to check the environment type', function(){
                var env = studio.common.Environment.Type.CREATIVE_TOOLSET;
                var check = studio.common.Environment.hasType(env);
                expect(check).to.equal(false);
            });

            it('should be able to set the environment type', function(){
                var env = studio.common.Environment.Type.CREATIVE_TOOLSET;
                studio.common.Environment.setType(env);
                expect(studio.common.Environment.hasType(env)).to.equal(true);
            });

            it('should be able to add a new environment type', function(){
                var env = 256;
                studio.common.Environment.addType(env);
                studio.common.Environment.setType(env);
                expect(studio.common.Environment.hasType(env)).to.equal(true);
            });

        });
    });

    describe('Enabler', function() {
        var Enabler = ACT.Enabler;
        var enablerEventStr = 'Enabler:actions';

        before(function(){
            Enabler.setConfig({
                tracking: {
                    "r0": "http://example.com/r0",
                    "rB": "http://example.com/rB",
                    "z1": "http://example.com/z1",
                    "cb": Math.round(Math.random() * 10000)
                },
                trackingLabels: {
                    clickTAG: 'clicktag_tracking_label'
                },
                exitUrls: {
                    clickTAG: 'landingpage'
                },
            }, 'tracking'); // need tracking here to avoid proble with JSON.stringify
        });

        it('should have ACT.Enabler', function() {
            expect(ACT.Enabler).to.exist;
            expect(window.Enabler).to.exist;
        });

        it('should have initialized', function() {
            expect(ACT.Enabler.isInitialized()).to.be.truthy;
        });

        it('should have helper modules exposed', function() {
            var Enabler = ACT.Enabler;
            expect(Enabler.Event).to.exist;
            expect(Enabler.Lang).to.exist;
            expect(Enabler.Util).to.exist;
            expect(Enabler.Dom).to.exist;
            expect(Enabler.Json).to.exist;
        });

        describe('Listen to Enabler Events', function() {
            window.parent = window;
            var onEvent = function (eventId, check) {
                var listener = ACT.Event.on(enablerEventStr, function(e) {
                    if (e.id === eventId) {
                        check(e);
                        listener.remove();
                    }
                });

                return listener;
            };

            describe('check visible', function(){
                it('should return visibility and fire visible event', function(done){
                    Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, function(e){
                        Enabler.removeEventListener(studio.events.StudioEvent.VISIBLE);
                        done();
                    });
                    expect(Enabler.isVisible()).to.be.truthy;
                });
            });

            it ('should open window for a simple exit', function() {
                var eventId = 'clickTAG';
                Enabler.exit(eventId);
                // window.open is called with correct URL
                expect(window.open.calledWith('landingpage', '_blank')).to.be.equal(true);
            });

            it ('should fire for an exit with redirect', function() {
                var eventId = 'clickTAG2';
                Enabler.exit(eventId, 'http://www.yahoo.com');

                // window.open is called with correct URL
                expect(window.open.calledWith('http://www.yahoo.com', '_blank')).to.be.equal(true);

                // exit link need to be updated
                expect(Enabler.getConfigObject('exitUrls').clickTAG2).to.be.equal('http://www.yahoo.com');
            });

            describe('`enablerInteractionTracking` - interaction tracking', function(){
            	describe('`enablerInteractionTracking: false`', function() {
					it ('should fire event if enablerInteractionTracking is false', function(done) {
						var eventId = 'CountingStars';

						onEvent(eventId, function(e) {
							expect(e.eventType).to.equal('interaction');
							expect(e.actionName).to.equal('track');
							expect(e.url).to.be.null;
							expect(e.special).to.equal(1);
							done();
						});

						Enabler.counter(eventId);
					});
				});
				
            	describe('`enablerInteractionTracking: true`', function() {
					before(function(){
						Enabler.setConfig(true, 'enablerInteractionTracking');
						Enabler.setConfig({
							CountingTrackingLabels: 'tracking_label_counting_stars_::envRendered::',
							CountingStars: 'tracking_label_counting_stars'
						}, 'trackingLabels');
					});

					it ('should call actTracking.interaction_track', function() {
						var actTracking = Enabler.getConfigObject('actTracking');
						sinon.stub(actTracking, 'interaction_track');
						// call the interaction
						Enabler.counter('CountingStars');
						// assert
						expect(actTracking.interaction_track.calledWith('tracking_label_counting_stars')).to.be.equal(true);

						// restore actTracking
						actTracking.interaction_track.restore();
					});
                
					it ('should call actTracking.interaction_track with ::envRendered:: macro filled out.', function(done) {
						var actTracking = Enabler.getConfigObject('actTracking');
						sinon.stub(actTracking, 'interaction_track', function(stuff){
							if (stuff.indexOf('tracking_label_counting_stars_') !== -1) {
								// restore actTracking
								actTracking.interaction_track.restore();
								done();
							}
						});

						Enabler.counter('CountingTrackingLabels');
					});
                });
            });

            describe('exitOverride', function() {
                it('should fire for exitOverride', function() {
                    var eventId = 'clickTAG2';
                    Enabler.exitOverride(eventId, 'https://vn.yahoo.com');

                    // window.open is called with correct URL
                    expect(window.open.calledWith('https://vn.yahoo.com', '_blank')).to.be.equal(true);

                    // exit link need to be updated
                    expect(Enabler.getConfigObject('exitUrls').clickTAG2).to.be.equal('https://vn.yahoo.com');
                });
            });

            describe('exitQueryString', function() {

                before(function() {
                    Enabler.exitOverride('exitQueryString test', 'https://www.yahoo.com');
                });

                it('should fire for exitQueryString', function() {
                    var eventId = 'exitQueryString test';
                    // No fireEvent checked need as window.open will be called by Enabler and nothing need to send to parent
                    /*
                    onEvent(eventId, function(e) {
                        expect(e.id).to.equal(eventId);
                        expect(e.eventType).to.equal('exit');
                        expect(e.actionName).to.equal('redirect');
                        expect(e.url).to.equal('https://www.yahoo.com');
                        expect(e.special).to.equal('?type=test');

                    });
                    */

                    Enabler.exitQueryString(eventId, '?type=test');

                    // window.open is called with correct URL
                    expect(window.open.calledWith('https://www.yahoo.com?type=test', '_blank')).to.be.equal(true);
                });
            });

            describe('getFullUrl', function() {
                var testUrl = 'https://www.yahoo.com';
                var testUrlWithParam = testUrl + '?param=1';
                it ('should return empty string', function() {
                    var res = Enabler.getFullUrl();
                    expect(res).to.be.empty;
                });
                it ('should return the original url', function() {
                    var res = Enabler.getFullUrl(testUrl);
                    expect(res).to.equal(testUrl);
                });
                it ('should concatenate something starting with ?', function() {
                    var res = Enabler.getFullUrl(testUrl, '?something');
                    expect(res).to.be.equal(testUrl + '?something');
                });
                it ('should concatenate something without ?', function() {
                    var res = Enabler.getFullUrl(testUrl, 'else');
                    expect(res).to.be.equal(testUrl + '?else');
                });
                it ('should concatenate something if url ends with ?', function() {
                    var res = Enabler.getFullUrl(testUrl + '?', 'param2');
                    expect(res).to.be.equal(testUrl + '?param2');
                });
                it ('should concatenate something without ? url with paramater', function() {
                    var res = Enabler.getFullUrl(testUrlWithParam, 'param2');
                    expect(res).to.be.equal(testUrlWithParam + '&param2');
                });
                it ('should concatenate something with ? url with paramater', function() {
                    var res = Enabler.getFullUrl(testUrlWithParam, '?param2');
                    expect(res).to.be.equal(testUrlWithParam + '&param2');
                });
                it ('should accept objects as params', function() {
                    var res = Enabler.getFullUrl(testUrl, {val: "blah"});
                    expect(res).to.be.equal(testUrl + '?val=blah');
                    var res = Enabler.getFullUrl(testUrlWithParam, {val: "blah"});
                    expect(res).to.be.equal(testUrlWithParam + '&val=blah');
                });
                it ('should accept objects with multiple values as params', function() {
                    var res = Enabler.getFullUrl(testUrl, {val: "blah", val2: 'foo'});
                    expect(res).to.be.equal(testUrl + '?val=blah&val2=foo');
                    var res = Enabler.getFullUrl(testUrlWithParam, {val: "blah", val2: 'foo'});
                    expect(res).to.be.equal(testUrlWithParam + '&val=blah&val2=foo');
                });
                it ('should accept arrays as params', function() {
                    var res = Enabler.getFullUrl(testUrl, [ 'val=blah' ]);
                    expect(res).to.be.equal(testUrl + '?val=blah');
                    var res = Enabler.getFullUrl(testUrlWithParam, [ 'val=blah' ]);
                    expect(res).to.be.equal(testUrlWithParam + '&val=blah');
                });
                it ('should accept arrays with multiple values as params', function() {
                    var res = Enabler.getFullUrl(testUrl, [ 'val=blah', 'val2=foo' ]);
                    expect(res).to.be.equal(testUrl + '?val=blah&val2=foo');
                    var res = Enabler.getFullUrl(testUrlWithParam, [ 'val=blah', 'val2=foo' ]);
                    expect(res).to.be.equal(testUrlWithParam + '&val=blah&val2=foo');
                });
            });

            describe('Expand, close, collapse', function() {
                it('should fire closing event and set states', function(done) {
                    onEvent('close', function(e) {
                        expect(e.id).to.equal('close');
                        expect(e.eventType).to.equal(studio.events.StudioEvent.COLLAPSE_START);
                        expect(e.actionName).to.equal('close');
                        expect(e.special).to.exist;
                        expect(e.special.containerState).to.exist;

                        expect(Enabler.getContainerState()).to.equal(studio.sdk.ContainerState.COLLAPSING);

                        done();
                    });

                    Enabler.close();
                });

                it ('should set the container state when closing to collapsing', function(done) {
                    var listener = ACT.Event.on(studio.events.StudioEvent.COLLAPSE_START, function(e) {
                        expect(e.containerState).to.equal(studio.sdk.ContainerState.COLLAPSING);
                        listener.remove();
                        done();
                    });
                    Enabler.close();
                });

                it('should set custom close to true', function() {
                    var config = JSON.parse(Enabler.getConfig('expand'));
                    expect(config.useCustomClose).to.be.falsy;
                    Enabler.setUseCustomClose(true);
                    var config = JSON.parse(Enabler.getConfig('expand'));
                    expect(config.useCustomClose).to.be.truthy;
                    Enabler.setUseCustomClose();
                    var config = JSON.parse(Enabler.getConfig('expand'));
                    expect(config.useCustomClose).to.be.falsy;
                });

                it ('should get the container state', function() {
                    var result = Enabler.getContainerState();
                    expect(result).to.not.empty;
                });

                it ('should set default state when its empty', function() {
                    Enabler.setConfig({containerState: ''}, 'expand');
                    var result = Enabler.getContainerState();
                    expect(result).to.include(studio.sdk.ContainerState.COLLAPSED);
                });

                it ('should return the direction to where it expands to', function() {
                    var result = Enabler.setConfig({isMultiDirectional: false, expandDirection: 'bl'}, 'expand');
                    var direction = Enabler.getExpandDirection();
                    expect(direction).to.equal('bl');
                });

                it ('should report a manual close', function(done) {
                    onEvent('reportManualClose', function(e) {
                        expect(e.special).to.not.empty;
                        expect(e.special.containerState).to.exist;
                        done();
                    });
                    Enabler.reportManualClose();
                });

                it ('should set the expanding offsets', function() {
                    var result = Enabler.setExpandingPixelOffsets();
                    expect(result.left).to.equal(0);
                    expect(result.top).to.equal(0);
                    expect(result.expandedWidth).to.equal(0);
                    expect(result.expandedHeight).to.equal(0);
                });

                it ('should set the expanding offsets with values', function() {
                    var result = Enabler.setExpandingPixelOffsets(100, 150, 440, 400);
                    expect(result.left).to.equal(100);
                    expect(result.top).to.equal(150);
                    expect(result.expandedWidth).to.equal(440);
                    expect(result.expandedHeight).to.equal(400);
                });

                it('should set the floating dimensions', function() {
                    var result = Enabler.setFloatingPixelDimensions();
                    expect(result.width).to.equal(0);
                    expect(result.height).to.equal(0);
                });

                it('should set the floating dimensions', function() {
                    var result = Enabler.setFloatingPixelDimensions(300, 250);
                    expect(result.width).to.equal(300);
                    expect(result.height).to.equal(250);
                });

                it ('should set as multidirectional', function() {
                    var result = Enabler.setIsMultiDirectional();
                    expect(result).to.be.falsy;
                    result = Enabler.setIsMultiDirectional(1);
                    expect(result).to.be.truthy;
                });

                /* Query Params test */
                it ('should getParameter from query string plain.', function() {
                    sinon.stub(ACT.Util, 'getQStrVal', function(name){
                        return 'attrvalue';
                    });

                    // test with empty param
                    var result = Enabler.getParameter();
                    expect(result).to.be.equal('');

                    // test with non-empty param
                    var result = Enabler.getParameter('attrName');
                    expect(ACT.Util.getQStrVal.calledWith('attrName')).to.be.equal(true);
                    expect(result).to.equal('attrvalue');

                    ACT.Util.getQStrVal.restore();
                });

                it ('should getParameter from query string as integer.', function() {
                    // test with empty param
                    var result = Enabler.getParameterAsInteger();
                    expect(result).to.equal(0);

                    // test with interger result
                    sinon.stub(ACT.Util, 'getQStrVal', function(name){
                        return '12';
                    });
                    result = Enabler.getParameterAsInteger('attrName');
                    expect(ACT.Util.getQStrVal.calledWith('attrName')).to.be.equal(true);
                    expect(result).to.be.equal(12);
                    ACT.Util.getQStrVal.restore();

                    // test with non-number result
                    sinon.stub(ACT.Util, 'getQStrVal', function(name){
                        return 'abc';
                    });
                    result = Enabler.getParameterAsInteger('attrName2');
                    expect(ACT.Util.getQStrVal.calledWith('attrName2')).to.be.equal(true);
                    expect(result).to.be.equal(0);
                    ACT.Util.getQStrVal.restore();

                });

                it ('should getParameter from query as string.', function() {
                    // test with non-parameter
                    var result = Enabler.getParameterAsNullableString();
                    expect(result).to.be.equal(0);

                    // test with parameter
                    sinon.stub(ACT.Util, 'getQStrVal', function(name){
                        return 'abc';
                    });
                    result = Enabler.getParameterAsNullableString('attrName');
                    expect(ACT.Util.getQStrVal.calledWith('attrName')).to.be.equal(true);
                    expect(result).to.equal('abc');
                    ACT.Util.getQStrVal.restore();

                });

                /* End Query Params test*/

                it('should set start expanded', function() {
                    var result = Enabler.setStartExpanded();
                    expect(result).to.be.falsy;
                    result = Enabler.setStartExpanded(true);
                    expect(result).to.be.truthy;
                });

                describe('requestExpand', function() {
                    it ('should fire for expand', function(done) {
                        onEvent('requestExpand', function(e) {
                            expect(e.id).to.equal('requestExpand');
                            expect(e.eventType).to.equal(studio.events.StudioEvent.EXPAND_START);
                            expect(e.actionName).to.equal('expand');
                            expect(e.special).to.not.empty;
                            expect(e.special.containerState).to.exist;

                            expect(Enabler.getContainerState()).to.equal(studio.sdk.ContainerState.EXPANDING);

                            done();
                        });
                        Enabler.requestExpand();
                    });

                    // it ('should fire the expand start event', function(done) {
                    //     ACT.Event.on(studio.events.StudioEvent.EXPAND_START, function(e) {
                    //         expect(e).to.not.empty;
                    //         expect(e.containerState).to.equal(studio.sdk.ContainerState.EXPANDING);
                    //         done();
                    //     });
                    //     Enabler.requestExpand();
                    // });
                });

                describe('finishExpand', function() {
                    it ('should fire finish expand', function(done) {
                        onEvent('finishExpand', function(e) {
                            expect(e.id).to.equal('finishExpand');
                            expect(e.eventType).to.equal(studio.events.StudioEvent.EXPAND_FINISH);
                            expect(e.actionName).to.equal('expand');
                            expect(e.special).to.not.empty;
                            expect(e.special.containerState).to.exist;

                            expect(Enabler.getContainerState()).to.equal(studio.sdk.ContainerState.EXPANDED);

                            done();
                        });
                        Enabler.finishExpand();
                    });

                    // it ('should fire the expand finish event', function(done) {
                    //     ACT.Event.on(studio.events.StudioEvent.EXPAND_FINISH, function(e) {
                    //         expect(e).to.not.empty;
                    //         expect(e.containerState).to.equal(studio.sdk.ContainerState.EXPANDED);
                    //         done();
                    //     });
                    //     Enabler.finishExpand();
                    // });
                });

                describe('requestCollapse', function() {
                    it ('should fire request collapse', function(done) {
                        onEvent('requestCollapse', function(e) {
                            expect(e.id).to.equal('requestCollapse');
                            expect(e.eventType).to.equal(studio.events.StudioEvent.COLLAPSE_START);
                            expect(e.actionName).to.equal('collapse');
                            expect(e.special).to.not.empty;
                            expect(e.special.containerState).to.exist;

                            expect(Enabler.getContainerState()).to.equal(studio.sdk.ContainerState.COLLAPSING);

                            done();
                        });
                        Enabler.requestCollapse();
                    });

                    // it ('should fire the collapse start event', function(done) {
                    //     ACT.Event.on(studio.events.StudioEvent.COLLAPSE_START, function(e) {
                    //         expect(e).to.not.empty;
                    //         expect(e.containerState).to.equal(studio.sdk.ContainerState.COLLAPSING);
                    //         done();
                    //     });
                    //     Enabler.requestCollapse();
                    // });
                });

                describe('finishCollapse', function() {
                    it ('should fire finish collapse', function(done) {
                        onEvent('finishCollapse', function(e) {
                            expect(e.id).to.equal('finishCollapse');
                            expect(e.eventType).to.equal(studio.events.StudioEvent.COLLAPSE_FINISH);
                            expect(e.actionName).to.equal('collapse');
                            expect(e.special).to.not.empty;
                            expect(e.special.containerState).to.exist;

                            expect(Enabler.getContainerState()).to.equal(studio.sdk.ContainerState.COLLAPSED);

                            done();
                        });
                        Enabler.finishCollapse();
                    });

                    // it ('should fire the collapse finish event', function(done) {
                    //     ACT.Event.on(studio.events.StudioEvent.COLLAPSE_FINISH, function(e) {
                    //         expect(e).to.not.empty;
                    //         expect(e.containerState).to.equal(studio.sdk.ContainerState.COLLAPSED);
                    //         done();
                    //     });
                    //     Enabler.finishCollapse();
                    // });
                });

                describe('requestFullscreenCollapse', function() {
                    it ('should fire request fullscreen collapse', function(done) {
                        onEvent('requestFullscreenCollapse', function(e) {
                            expect(e.id).to.equal('requestFullscreenCollapse');
                            expect(e.eventType).to.equal(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START);
                            expect(e.actionName).to.equal('collapse');
                            expect(e.special).to.not.empty;
                            expect(e.special.containerState).to.exist;

                            expect(Enabler.getContainerState()).to.equal(studio.sdk.ContainerState.FS_COLLAPSING);

                            done();
                        });
                        Enabler.requestFullscreenCollapse();
                    });

                    // it ('should fire the request fullscreen collapse event', function(done) {
                    //     ACT.Event.on(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START, function(e) {
                    //         expect(e).to.not.empty;
                    //         expect(e.containerState).to.equal(studio.sdk.ContainerState.FS_COLLAPSING);
                    //         done();
                    //     });
                    //     Enabler.requestFullscreenCollapse();
                    // });
                });

                describe('requestFullscreenExpand', function() {
                    // it ('should fire the request fullscreen expand event', function(done) {
                    //     ACT.Event.on(studio.events.StudioEvent.FULLSCREEN_EXPAND_START, function(e) {
                    //         expect(e).to.not.empty;
                    //         expect(e.containerState).to.equal(studio.sdk.ContainerState.FS_EXPANDING);
                    //         expect(e.fsExpandHeight).to.equal(600);
                    //         expect(e.fsExpandWidth).to.equal(800);
                    //         done();
                    //     });
                    //     Enabler.requestFullscreenExpand(800, 600);
                    // });

                    it ('should fire request fullscreen expand', function(done) {
                        onEvent('requestFullscreenExpand', function(e) {
                            expect(e.id).to.equal('requestFullscreenExpand');
                            expect(e.eventType).to.equal(studio.events.StudioEvent.FULLSCREEN_EXPAND_START);
                            expect(e.actionName).to.equal('expand');
                            expect(e.special).to.not.empty;
                            expect(e.special.containerState).to.exist;

                            expect(Enabler.getContainerState()).to.equal(studio.sdk.ContainerState.FS_EXPANDING);

                            done();
                        });
                        Enabler.requestFullscreenExpand();
                    });
                });

                describe('finishFullscreenCollapse', function() {
                    it ('should fire finish fullscreen collapse', function(done) {
                        onEvent('finishFullscreenCollapse', function(e) {
                            expect(e.id).to.equal('finishFullscreenCollapse');
                            expect(e.eventType).to.equal(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH);
                            expect(e.actionName).to.equal('collapse');
                            expect(e.special).to.not.empty;
                            expect(e.special.containerState).to.exist;

                            expect(Enabler.getContainerState()).to.equal(studio.sdk.ContainerState.COLLAPSED);

                            done();
                        });
                        Enabler.finishFullscreenCollapse();
                    });

                    // it ('should fire the finish fullscreen collapse event', function(done) {
                    //     ACT.Event.on(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH, function(e) {
                    //         expect(e).to.not.empty;
                    //         expect(e.containerState).to.equal(studio.sdk.ContainerState.COLLAPSED);
                    //         done();
                    //     });
                    //     Enabler.finishFullscreenCollapse();
                    // });
                });

                describe('finishFullscreenExpand', function() {
                    it ('should fire finish fullscreen expand', function(done) {
                        onEvent('finishFullscreenExpand', function(e) {
                            expect(e.id).to.equal('finishFullscreenExpand');
                            expect(e.eventType).to.equal(studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH);
                            expect(e.actionName).to.equal('expand');
                            expect(e.special).to.not.empty;
                            expect(e.special.containerState).to.exist;

                            expect(Enabler.getContainerState()).to.equal(studio.sdk.ContainerState.FS_EXPANDED);

                            done();
                        });
                        Enabler.finishFullscreenExpand();
                    });

                    // it ('should fire the finish fullscreen expand event', function(done) {
                    //     ACT.Event.on(studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH, function(e) {
                    //         expect(e).to.not.empty;
                    //         expect(e.containerState).to.equal(studio.sdk.ContainerState.FS_EXPANDED);
                    //         done();
                    //     });
                    //     Enabler.finishFullscreenExpand();
                    // });
                });

                describe('closeCompanion, displayCompanion', function() {
                    it ('should fire closeCompanion', function(done) {
                        onEvent('closeCompanion', function(e) {

                            expect(e.id).to.equal('closeCompanion');
                            expect(e.actionName).to.be.undefined;
                            expect(e.eventType).to.be.undefined;
                            expect(e.special).to.be.undefined;
                            expect(e.url).to.be.undefined;

                            done();
                        });
                        Enabler.closeCompanion();
                    });
                    it ('should fire displayCompanion', function(done) {
                        onEvent('displayCompanion', function(e) {

                            expect(e.id).to.equal('displayCompanion');
                            expect(e.actionName).to.be.undefined;
                            expect(e.eventType).to.be.undefined;
                            expect(e.special).to.be.undefined;
                            expect(e.url).to.be.undefined;

                            done();
                        });
                        Enabler.displayCompanion();
                    });
                });
            });

        });

        describe('addEventListener & removeEventListener', function() {

            var getEventQueue = Enabler.getEventQueue;
            var StudioEvent = studio.events.StudioEvent;

            it ('should start with an empty event queue', function() {
                var events = getEventQueue();
                expect(events).to.be.empty;
            });

            it ('should avoid to include non existent events to the queue', function() {
                Enabler.addEventListener('superFakeType', function() {
                    return 10;
                });
                var events = getEventQueue();
                expect(events).to.be.empty;
            });

            it ('should add an event listener', function() {
                Enabler.addEventListener(StudioEvent.EXIT, function(){return 1;});
                var events = getEventQueue();
                expect(events).to.exist;
                var instance = events[StudioEvent.EXIT];
                expect(instance).to.exist;
                expect(instance.callback).to.exist;
                var res = instance.callback();
                expect(res).to.equal(1);

                Enabler.addEventListener(StudioEvent.EXIT, function(){return 3;});
                var events = getEventQueue();
                expect(events).to.exist;
                var instance = events[StudioEvent.EXIT];
                expect(instance).to.exist;
                expect(instance.callback).to.exist;
                var res = instance.callback();
                expect(res).to.equal(3);
            });

        });

        describe('dispatchEvent', function() {
            var Event = ACT.Event;
            var eventStr = 'testingDispatch';

            it('should fire an event', function(done) {
                var listener = Event.on(eventStr, function(data) {
                    listener.remove();
                    expect(data.value).to.equal('tested!');
                    done();
                });
                Enabler.dispatchEvent(eventStr, {value: 'tested!'});
            });
        });

        describe('getUrl', function() {
            before(function(){
                sinon.stub(Enabler.Dom, 'getCurrentLocation', function(){
                    return 'http://uk.yahoo.com/motobike/superbike';
                });
            });

            after(function(){
                Enabler.Dom.getCurrentLocation.restore();
            });

            it('should get default url', function() {
                var res = Enabler.getUrl();
                expect(Enabler.Dom.getCurrentLocation.calledOnce).to.be.equal(true);
                expect(res).to.not.be.empty;
                expect(res).to.be.a('string');
                expect(res).to.contain('http');
                expect(res[res.length - 1]).to.equal('/');
            });

            it('should get url with path', function() {
                var res = Enabler.getUrl('file.html');
                // getCurrentLocation is not called because htmlRoot is set after previous test
                expect(Enabler.Dom.getCurrentLocation.calledOnce).to.be.equal(true);
                expect(res).to.not.be.empty;
                expect(res).to.be.a('string');
                expect(res).to.contain('http');
                expect(res).to.contain('/file.html');
            });

            it('should set the url', function() {
                Enabler.setUrl('https://www.yahoo.com');
                var res = Enabler.getUrl();
                // this test should call getCurrentLocation method
                expect(Enabler.Dom.getCurrentLocation.calledOnce).to.be.equal(true);
                expect(res).to.not.be.empty;
                expect(res).to.be.a('string');
                expect(res).to.contain('http');
                expect(res[res.length - 1]).to.equal('/');
            });
        });

        describe('startTimer & stopTimer', function() {
            var clock;

            before(function() {
                clock = sinon.useFakeTimers();
            });

            after(function() {
                clock.restore();
            });

            it ('should be able to start and stop timer', function(done) {
                var timerId = 'myTimer';
                var timerCollection = Enabler.getTimerCollection();

                expect(timerCollection.hasOwnProperty(timerId)).to.be.falsy;

                Enabler.startTimer(timerId);

                timerCollection = Enabler.getTimerCollection();
                expect(timerCollection.hasOwnProperty(timerId)).to.be.truthy;

                clock.tick(1003);

                timerCollection = Enabler.getTimerCollection();
                expect(timerCollection[timerId].time).to.equal(1);

                clock.tick(1003);

                timerCollection = Enabler.getTimerCollection();
                expect(timerCollection[timerId].time).to.equal(2);

                Enabler.stopTimer(timerId);

                timerCollection = Enabler.getTimerCollection();
                expect(timerCollection.hasOwnProperty(timerId)).to.be.falsy;

                done();
            });
        });

        describe('getConfigObject', function() {
            it ('should return the config object when no arguments', function() {
                var res = Enabler.getConfigObject();
                expect(res).to.not.empty;
                expect(res.callbacks).to.exist;
                expect(res.callbacks.length).to.equal(0);
            });

            it('should be able to acces a specific config element', function() {
                var res = Enabler.getConfigObject('callbacks');
                expect(res).to.exist;
                expect(res.length).to.equal(0);
            });

            it ('should return null from config object when argument-key doesn\'t exist', function() {
                var res = Enabler.getConfigObject("big_fluffy_dog_yeah");
                expect(res).to.be.null;
            });
        });

        describe('dispatchPageLoaded', function() {

            it('should return false when page loaded event wasnt dispatched yet', function() {
                expect(Enabler.isPageLoaded()).to.be.falsy;
            });

            it('should fire the page loaded event and set config', function(done) {
                var listener = ACT.Event.on(studio.events.StudioEvent.PAGE_LOADED, function() {
                    listener.remove();
                    var val = Enabler.getConfigObject('pageLoaded');
                    expect(val).to.be.truthy;
                    expect(Enabler.isPageLoaded()).to.be.truthy;
                    done();
                });
                Enabler.dispatchPageLoaded();
            });
        });

        describe('callAfterInitialized', function() {
            it('should include a function to callback', function(done) {
                expect(Enabler.getConfigObject('callbacks')).to.be.empty;
                
                /**
                 * callAfterInitiialized queues up the passed function into callbacks 
                 * We test that the callbacks queue has something in it, AND that our function does in fact
                 * get executed.
                 */
                Enabler.callAfterInitialized(function(){
                    var callbacks = Enabler.getConfigObject('callbacks');
                    expect(callbacks).to.not.be.empty;
                    expect(callbacks.length).to.equal(1);
                    done();
                });
            });
        });

        describe('get and set Config', function() {

            var configStr;

            // TODO for some reason these tests don't run correctly with KARMA (coverage doesn't work)
            it('should get a config string', function() {
                configStr = Enabler.getConfig('callbacks');
                expect(configStr).to.be.a('string');
                expect(configStr.length).to.be.at.least(1);
            });

            it('should set a new value if set', function() {
                var newConf = {value: 'Testing'};
                Enabler.setConfig(newConf, 'value');
                expect(Enabler.getConfigObject('value')).to.equal('Testing');
            });

            it('should set a new string value if set', function() {
                var newConf = '{"value2": "Testing2"}';
                var result = Enabler.setConfig(newConf, 'value2');
                expect(Enabler.getConfigObject('value2')).to.equal('Testing2');
            });

            it('should set the tracking config and new tracking obj', function() {
                var result = Enabler.setConfig({
                    "tracking" : {
						"r0": "http://example.com/r0",
						"rB": "http://example.com/rB",
						"z1": "http://example.com/z1"
                    }
                }, 'tracking');
                expect(result).to.exist;
                expect(result).to.not.empty;
                expect(result).to.include('http://example.com/r0');
                expect(result).to.include('r0');
                expect(result).to.include('rB');
                expect(result).to.include('z1');
            })
        });

        describe('loadScript', function() {

            it('should load a external script', function(done) {
                var callback = sinon.spy();

                var script = Enabler.loadScript('../../globals.js', callback);
                // called onload without loaded flag
                script.readyState = true;
                script.onload();

                // called onload with loaded flag
                script.readyState = "loaded";
                script.onload();

                expect(script.src).to.have.string('globals.js');
                expect(callback.called).to.be.equal(true);
                expect(script.onload).to.be.null;

                done();
            });
        });

        describe('loadModule', function() {
            it('should load an existing module: video', function() {
                var res = Enabler.loadModule(studio.module.ModuleId.VIDEO);
                expect(res).to.exist;
                expect(res).ownProperty('Reporter');
            });

            it('should load an existing module: enabler', function() {
                var res = Enabler.loadModule(studio.module.ModuleId.ENABLER);
                expect(res).to.exist;
            });

            it('should fail to load fake module', function() {
                var res = Enabler.loadModule('fakeModule');
                expect(res).to.be.empty;
            });

            it('should fail to load empty module', function() {
                res = Enabler.loadModule();
                expect(res).to.be.empty;
            });

            it('should call module with callback', function() {
                var callback = sinon.spy();
                var res = Enabler.loadModule(studio.module.ModuleId.VIDEO, callback);

                expect(callback.calledWith(res)).to.be.equal(true);
                expect(res).to.exist;
            })
        });

        describe('Listen to parent message', function(){
            it('should dispatch enabler event when receive data from parent', function(done){
                Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_START, function(){
                    Enabler.removeEventListener(studio.events.StudioEvent.COLLAPSE_START);
                    done();
                });

                ACT.Event.fire('message', {
                    data: {
                        eventName: "html5:message",
                        message: "COLLAPSE_START"
                    }
                }, window);
            });
        });

        describe('getInstance', function() {
            it('should get the instance of the enabler singleton', function() {
                var res = Enabler.getInstance();
                expect(res).to.deep.equal(Enabler);
                expect(res).to.be.an.instanceof(Enabler.constructor);
            });
        });

        describe('Call and check type of methods not implemented', function() {

            it('@addMessageHandler should return undefined', function() {
                expect(Enabler.addMessageHandler()).to.be.a('undefined');
            });
            it('@removeMessageHandler should return undefined', function() {
                expect(Enabler.removeMessageHandler()).to.be.a('undefined');
            });
            it('@getOrientation should return object', function() {
                expect(Enabler.getOrientation()).to.be.a('object');
            });
            it('@getUserBandwidth should return number', function() {
                expect(Enabler.getUserBandwidth()).to.be.a('number');
            });
            it('@getUserCountry should return string', function() {
                expect(Enabler.getUserCountry()).to.be.a('string');
            });
            it('@getUserDMACode should return number', function() {
                expect(Enabler.getUserDMACode()).to.be.a('number');
            });
            it('@getUserState should return string', function() {
                expect(Enabler.getUserState()).to.be.a('string');
            });
            it('@getUserZipCode should return string', function() {
                expect(Enabler.getUserZipCode()).to.be.a('string');
            });
            it('@hasUserInteracted should return boolean', function() {
                expect(Enabler.hasUserInteracted()).to.be.a('boolean');
            });
            it('@invokeExternalJsFunction should return undefined', function() {
                expect(Enabler.invokeExternalJsFunction()).to.be.a('undefined');
            });
            it('@invokeMraidMethod should return undefined', function() {
                expect(Enabler.invokeMraidMethod()).to.be.a('undefined');
            });
            it('@isServingInLiveEnvironment should return boolean', function() {
                expect(Enabler.isServingInLiveEnvironment()).to.be.a('boolean');
            });
            it('@queryFullscreenDimensions should return undefined', function() {
                expect(Enabler.queryFullscreenDimensions()).to.be.a('undefined');
            });
            it('@queryFullscreenSupport should return undefined', function() {
                expect(Enabler.queryFullscreenSupport()).to.be.a('undefined');
            });
            it('@registerChargeableEventName should return undefined', function() {
                expect(Enabler.registerChargeableEventName()).to.be.a('undefined');
            });
            it('@reportCustomVariableCount1 should return undefined', function() {
                expect(Enabler.reportCustomVariableCount1()).to.be.a('undefined');
            });
            it('@reportCustomVariableCount2 should return undefined', function() {
                expect(Enabler.reportCustomVariableCount2()).to.be.a('undefined');
            });
            it('@setDevDynamicContent should return undefined', function() {
                expect(Enabler.setDevDynamicContent()).to.be.a('undefined');
            });
            it('@setHint should return undefined', function() {
                expect(Enabler.setHint()).to.be.a('undefined');
            });
            it('@getProfileId should return number', function() {
                expect(Enabler.getProfileId()).to.be.a('number');
            });
            it('@setProfileId should return undefined', function() {
                expect(Enabler.setProfileId()).to.be.a('undefined');
            });
            it('@getDartAdId should return number', function() {
                expect(Enabler.getDartAdId()).to.be.a('number');
            });
            it('@getDartAssetId should return string', function() {
                expect(Enabler.getDartAssetId()).to.be.a('string');
            });
            it('@getDartCreativeId should return number', function() {
                expect(Enabler.getDartCreativeId()).to.be.a('number');
            });
            it('@getDartPageId should return number', function() {
                expect(Enabler.getDartPageId()).to.be.a('number');
            });
            it('@getDartRenderingId should return string', function() {
                expect(Enabler.getDartRenderingId()).to.be.a('string');
            });
            it('@getDartSiteId should return number', function() {
                expect(Enabler.getDartSiteId()).to.be.a('number');
            });
            it('@getDartSiteName should return string', function() {
                expect(Enabler.getDartSiteName()).to.be.a('string');
            });

        });

    });

    describe('Enabler Redirect with Event Propagation', function() {

        var Enabler = ACT.Enabler;
        var enablerEventStr = 'Enabler:actions';

        describe('Listen to Enabler Events With Propagation', function() {
            Enabler.setConfig({
                tracking: {
                    "r0": "http://example.com/r0",
                    "rB": "http://example.com/rB",
                    "z1": "http://example.com/z1",
                    "cb": Math.round(Math.random() * 10000)
                },
                trackingLabels: {
                    clickTAG: 'clicktag_tracking_label'
                },
                eventPropagation: true,
                exitUrls: {
                    clickTAG: 'landingpage'
                },
            }, 'tracking'); // need tracking here to avoid proble with JSON.stringify

            window.parent = window;
            var onEvent = function (eventId, check) {
                var listener = ACT.Event.on(enablerEventStr, function(e) {
                    if (e.id === eventId) {
                        check(e);
                        listener.remove();
                    }
                });

                return listener;
            };

            it ('should open window for a simple exit', function(done) {
                var eventId = 'clickTAG';
                // No fireEvent checked need as window.open will be called by Enabler and nothing need to send to parent
                onEvent(eventId, function(e) {
                    // checking if event fired is correct
                    expect(e.id).to.equal(eventId);
                    expect(e.eventType).to.equal('exit');
                    expect(e.actionName).to.equal('redirect');
                    expect(e.url).to.equal('landingpage');
                    expect(e.special).to.not.exist;
                    done();
                });
                Enabler.exit(eventId);
                // window.open is called with correct URL
                expect(window.open.calledWith('landingpage', '_blank')).to.be.equal(true);
            });

            describe('interaction tracking', function(done){
                it ('should fire event if enablerInteractionTracking is false', function(done) {
                    var eventId = 'PropagatingStars_::envRendered::';
                    onEvent(eventId, function(e) {
                        expect(e.eventType).to.equal('interaction');
                        expect(e.actionName).to.equal('track');
                        expect(e.url).to.be.null;
                        expect(e.special).to.equal(1);
                        done();
                    });

                    Enabler.counter(eventId);
                });
            });
        });
    });
    
    describe('EnablerADTECH', function() {
        var Enabler = ACT.Enabler;

        describe('EnablerADTECH Should get configured', function() {
            Enabler.setConfig({
                exposeADTECH: true
            });

            it ('EnablerADTECH should exist', function() {
            	expect(ACT.EnablerADTECH).to.be.a('object');
            	expect(window.ADTECH).to.be.a('object');
            });

            describe('window.ADTECH tests', function() {
            	it ('ADTECH.addEventListener to exist', function() {
            		expect(window.ADTECH.addEventListener).to.be.a('function');
            	});
            	it ('ADTECH.removeEventListener to exist', function() {
            		expect(window.ADTECH.removeEventListener).to.be.a('function');
            	});

            	it ('ADTECH.dynamicClick to exist', function() {
            		expect(window.ADTECH.dynamicClick).to.be.a('function');
            	});

            	it ('ADTECH.click to exist', function() {
            		expect(window.ADTECH.click).to.be.a('function');
            	});

				it ('ADTECH.event to exist', function() {
            		expect(window.ADTECH.event).to.be.a('function');
            	});

            	it ('ADTECH.registerVideoPlayer to exist', function() {
            		expect(window.ADTECH.registerVideoPlayer).to.be.a('function');
            	});

            	it ('ADTECH.ready to exist', function() {
            		expect(window.ADTECH.ready).to.be.a('function');
            	});

            	it ('ADTECH.expand to exist', function() {
            		expect(window.ADTECH.expand).to.be.a('function');
            	});

            	it ('ADTECH.contract to exist', function() {
            		expect(window.ADTECH.contract).to.be.a('function');
            	});

            	it ('ADTECH.close to exist', function() {
            		expect(window.ADTECH.close).to.be.a('function');
            	});

            	it ('ADTECH.show to exist', function() {
            		expect(window.ADTECH.show).to.be.a('function');
            	});

            	it ('ADTECH.hide to exist', function() {
            		expect(window.ADTECH.hide).to.be.a('function');
            	});
            });
        });
    });
});

function createDummyElement(id, tag) {
    var inTag = tag ? tag : 'div';
    var element = document.createElement(inTag);
    element.id = id;
    document.getElementsByTagName('body')[0].appendChild(element);
    return document.getElementById(id);
}

function removeDummyElement(id) {
    var element = document.getElementById(id);
    if (element) {
        document.getElementsByTagName('body')[0].removeChild(element);
    }
}
