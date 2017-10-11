var expect = chai.expect;

describe("ACT.TrackingFacade.spec.js", function() {
    it("should have ACT tracking", function() {
        expect(ACT.Tracking).to.exist;
    });

    /* Tracking basics */
    describe("Tracking basic requirements", function() {

        describe("attributes", function() {
            it("should have ATTRS", function() {
                expect(ACT.Tracking.ATTRS).to.exist;
            });

            it("should have ATTRS.NAME defined", function() {
                expect(ACT.Tracking.ATTRS.NAME).to.exist;
            });
        });

        describe("configuration object", function() {
        	var tracking;

		    before(function() {
		        tracking = new ACT.Tracking(null);
		    });

		    after(function(){
		    	tracking.destroy();
		    })

            it("should have a config object", function() {
                expect(tracking.config).to.exist;
                expect(tracking.config).to.be.a("object");
            });
        });

        /* Test sending in a ref */
        describe("Sending a ref should bind functions to it", function() {
            var ref = {};
            var trk;

            before(function(){
            	trk = new ACT.Tracking(null, ref);
            });

            after(function(){
            	trk.destroy();
            });

            it("should have 'interaction_track' reference", function() {
                expect(ref.interaction_track).to.exist;
                expect(ref.interaction_track).to.be.a("function");
            });

            it("should have 'redirect_track' reference", function() {
                expect(ref.redirect_track).to.exist;
                expect(ref.redirect_track).to.be.a("function");
            });

            it("should have 'track' reference", function() {
                expect(ref.track).to.exist;
                expect(ref.track).to.be.a("function");
            });
        });
    });

    /* Interaction Track */
    describe("Function - 'interaction_track' tests", function() {
    	var tracking;

    	before(function(){
    		tracking = new ACT.Tracking(null);
    	});

    	after(function(){
    		tracking.destroy();
    	});

        it("should have 'interaction_track' accessible", function() {
            expect(tracking.interaction_track).to.exist;
            expect(tracking.interaction_track).to.be.a("function");
        });

        describe("Invalid values test - returns false", function() {
            it("should fail gracefully on empty values", function() {
            	var returnObj = {
            		overwriteFired: false,
            		trackingID: 0,
            		trackingString: '',
            		result: null
            	};
            	var track1 = tracking.interaction_track();
            	var track2 = tracking.interaction_track(null);
                expect(track1).to.deep.equal(returnObj);
                expect(track2).to.deep.equal(returnObj);
            });
        });
    });

    /* Redirect Track */
    describe("Function - 'redirect_track' tests", function() {
    	var tracking;

    	before(function(){
    		tracking = new ACT.Tracking(null);
    	});

    	after(function(){
    		tracking.destroy();
    	});

        it("should have 'redirect_track' accessible", function() {
            expect(tracking.redirect_track).to.exist;
            expect(tracking.redirect_track).to.be.a("function");
        });

        describe("Invalid values test - returns empty string", function() {
            it("should fail gracefully on empty values", function() {
                var str = "test_string";
                var num = "55";
                var url = "https://www.yahoo.com";

            	var redirect1 = tracking.redirect_track("one", "two", "");
            	var redirect2 = tracking.redirect_track();
            	var redirect3 = tracking.redirect_track(str, num, url);
                expect(redirect1).to.equal("");
                expect(redirect2).to.equal("");
                expect(redirect3).to.equal(url);
            });
        });
    });

    /* Track Tests */
    describe("Function - 'track' tests", function() {
    	var trk;

        before(function() {
            var conf = {};
            trk = new ACT.Tracking(conf);
        });

        after(function(){
        	trk.destroy();
        });

        it("should have 'track' accessible", function() {
            expect(trk.track).to.exist;
            expect(trk.track).to.be.a("function");
        });

        it("should call 'track'->'interaction_track' with null values and return object", function(done) {
            trk.track(null, null, null, function(res) {
            	var returnObj = {
            		overwriteFired: false,
            		trackingID: 0,
            		trackingString: '',
            		result: null
            	};
                expect(res).to.deep.equal(returnObj);
                done();
            });
        });

        it("should call 'track'->'interaction_track' with a label and return true", function(done) {
            trk.track("fluffy", null, null, function(res) {
            	var returnObj = {
            		overwriteFired: false,
            		trackingID: 	1271466774,
            		trackingString: 'fluffy',
            		result: null
            	};
                expect(res).to.deep.equal(returnObj);
                done();
            });
        });

        it("should call 'track'->'redirect_track' with just the url and return a string", function(done) {
            trk.track(null, null, "abc", function(res) {
                expect(res).to.equal('abc');
                done();
            });
        });

        it("should call 'track'->'redirect_track'  with all params and return string", function(done) {
            trk.track("string", 123, "http://www.yahoo.com", function(res) {
                expect(res).to.equal('http://www.yahoo.com');
                done();
            });
        });
    });

    /* Overwrite Tracking Events */
    /* Tracking Events */
    describe("Overwrite Tracking Events", function() {
    	describe("Overwrite Tracking Events with Overwrite set to TRUE", function() {
			var overwriteTRK = null;
			var redirectTrack = sinon.spy();
			var interactionTrack = sinon.spy();

			before(function() {
				var conf = {
					"trackingFunctions": {
						"overwrite": true,
						"redirect": redirectTrack,
						"interaction": function () {
							interactionTrack.apply(this, arguments);
							return true
						}
					}
				};
				overwriteTRK = new ACT.Tracking(conf);
			});

			after(function(){
				redirectTrack.reset();
				interactionTrack.reset();
				overwriteTRK.destroy();
			});

			it("should fire interaction tracking on an event firing", function(done) {
				var trackingListner = ACT.Event.on('tracking:track:complete', function(res) {
					var out = {
						overwriteFired: true,
						result: true,
						trackingID: 1197365343,
						trackingString: 'template_click_button_opensomething'
					};
					trackingListner.remove();
					expect(interactionTrack.called).to.equal(true);
	            	expect(interactionTrack.calledWith("template_click_button_opensomething")).to.equal(true);
					expect(res.data).to.deep.equal(out);
					done();
				});
				ACT.Event.fire('tracking:track', { label: 'template_click_button_opensomething' });
			});

			it("should fire redirect tracking on event firing", function(done){
				var redirectListner = ACT.Event.on("tracking:registerRedirect:complete", function(data){
					redirectListner.remove();
					expect(redirectTrack.calledOnce).to.equal(true);
	            	expect(redirectTrack.calledWithMatch("YahooUK", 259938998, "https://uk.yahoo.com")).to.equal(true);
					done();
				});

				ACT.Event.fire("tracking:registerRedirect", {
					clickTag: 'https://uk.yahoo.com',
					clickTagName: 'YahooUK'
				});
			});
		});

    	describe("Overwrite Tracking Events with Overwrite set to FALSE", function() {
			var overwriteTRK = null;
			var redirectTrack = sinon.spy();
			var interactionTrack = sinon.spy();

			before(function() {
				var conf = {
					"trackingFunctions": {
						"overwrite": false,
						"redirect": redirectTrack,
						"interaction": interactionTrack
					}
				};
				overwriteTRK = new ACT.Tracking(conf);
			});

			after(function(){
				redirectTrack.reset();
				interactionTrack.reset();
				overwriteTRK.destroy();
			});

			it("should fire interaction tracking on an event firing", function(done) {
				var trackingListner = ACT.Event.on('tracking:track:complete', function(res) {
					var out = {
						overwriteFired: false,
						result: null,
						trackingID: 1197365343,
						trackingString: "template_click_button_opensomething"
					};
					trackingListner.remove();
					expect(interactionTrack.called).to.equal(false);
	            	expect(interactionTrack.calledWith("template_click_button_opensomething")).to.equal(false);
					expect(res.data).to.deep.equal(out);
					done();
				});
				ACT.Event.fire('tracking:track', { label: 'template_click_button_opensomething' });
			});

			it("should fire redirect tracking on event firing", function(done){
				var redirectListner = ACT.Event.on("tracking:registerRedirect:complete", function(data){
					redirectListner.remove();
					expect(redirectTrack.calledOnce).to.equal(false);
	            	expect(redirectTrack.calledWithMatch("YahooUK", 259938998, "https://uk.yahoo.com")).to.equal(false);
					expect(data.link.indexOf('https://uk.yahoo.com') > -1).to.equal(true);
					done();
				});

				ACT.Event.fire("tracking:registerRedirect", {
					clickTag: 'https://uk.yahoo.com',
					clickTagName: 'YahooUK'
				});
			});
		});

	});

	/* Track with unique */
    describe("Track with unique", function(){
        var trk = null;
        before(function() {
            var conf = {
            	"trackUnique": true
            };
            trk = new ACT.Tracking(conf);
        });

        after(function(){
        	trk.destroy();
        });

    	it("should tracking event with unique key", function(done){
            var trackListener = ACT.Event.on('tracking:track:complete', function(res) {
            	trackListener.remove();
            	var out = {
            		overwriteFired: false,
            		result: null,
            		trackingID: 1291785443,
            		trackingString: 'u_template_click_button_close'
            	};
            	expect(res.data).to.deep.equal(out);
                done();
            });

            var cookieListener = ACT.Event.on('localRegister:updateAdEvent', function(data){
            	cookieListener.remove();
            	ACT.Event.fire('localRegister:updateAdEvent:complete', {
            		unique: true
            	});
            });
            ACT.Event.fire('tracking:track', { label: 'template_click_button_close' });
    	});

    	it("should tracking event with non unique key", function(done){
            var trackListener = ACT.Event.on('tracking:track:complete', function(res) {
            	trackListener.remove();
            	var out = {
            		overwriteFired: false,
            		result: null,
            		trackingID: 47011473,
            		trackingString: 'nu_template_click_button_close'
            	};
            	expect(res.data).to.deep.equal(out);
                done();
            });

            var cookieListener = ACT.Event.on('localRegister:updateAdEvent', function(data){
            	cookieListener.remove();
            	ACT.Event.fire('localRegister:updateAdEvent:complete', {
            		unique: false
            	});
            });
            ACT.Event.fire('tracking:track', { label: 'template_click_button_close' });
    	});
    });

	/* Track the Macros */
    describe("Track with macros", function(){
        var trk = null;
        before(function() {
            var conf = {};
            trk = new ACT.Tracking(conf);
        });

        after(function(){
        	trk.destroy();
        });

    	it("should tracking event with conveted valid macros", function(done){
            var trackListener = ACT.Event.on('tracking:track:complete', function(res) {
            	trackListener.remove();
				var out = {
					overwriteFired: false,
					result: null,
					trackingID: 833454115,
					trackingString: 'template_play_firstplay_backup'
				};

            	expect(res.data).to.deep.equal(out);
                done();
            });

            var envListener = ACT.Event.on('env:envRendered', function(data){
            	envListener.remove();
            	ACT.Event.fire('env:envRendered:Done', 'html');
            });
            ACT.Event.fire('tracking:track', { label: 'template_play_firstplay_::envRendered::'});
    	});

    	it("should tracking event with invalid macros", function(done){
            var trackListener = ACT.Event.on('tracking:track:complete', function(res) {
            	trackListener.remove();
				var out = {
					overwriteFired: false,
					result: null,
					trackingID: 1419290401,
					trackingString: "template_play_firstplay_"
				};
            	expect(res.data).to.deep.equal(out);
                done();
            });
            ACT.Event.fire('tracking:track', { label: 'template_play_firstplay_::undefinedMacros::'});
    	});
    });

	/* Tracking Actions */
    describe("Tracking Actions", function(){
        it("should return true against valid arguments", function(done){
            ACT.Event.originalEventFire = ACT.Event.fire;
            sinon.stub(ACT.Event, 'fire', function(event, data){
                if (event === 'register:Actions'){
                    var track = data[0].argument;
                    expect(track.label.test("word1_word2_word3_word4")).to.equal(true);
                    expect(track.timeout.test(10)).to.equal(true);
                    expect(track.timeout.test("10")).to.equal(true);
                    expect(track.timeout.test(undefined)).to.equal(true);
                    expect(track.timeout.test(null)).to.equal(true);
                    ACT.Event.fire.restore();
                    done();
                } else {
                    ACT.Event.originalEventFire(event, data);
                }
            });
           var trk = new ACT.Tracking();
        });

        it("should return false against invalid arguments", function(done){
            ACT.Event.originalEventFire = ACT.Event.fire;
            sinon.stub(ACT.Event, 'fire', function(event, data){
                if (event === 'register:Actions'){
                    var track = data[0].argument;
                    expect(track.label.test(1000)).to.equal(false);
                    expect(track.label.test(null)).to.equal(false);
                    expect(track.label.test(undefined)).to.equal(false);
                    expect(track.timeout.test("test")).to.equal(false);
                    ACT.Event.fire.restore();
                    done();
                } else {
                    ACT.Event.originalEventFire(event, data);
                }
            });
            var trk = new ACT.Tracking();
        });
	});

});
