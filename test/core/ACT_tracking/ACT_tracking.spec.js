var expect = chai.expect;

describe("ACT.Tracking", function() {
    it("should have ACT tracking", function() {
        expect(ACT.Tracking).to.exist;
    });

    /* Tracking basics */
    describe("Tracking basic requirements", function() {

        describe("attributes", function() {
            it("should have ATTRS defined", function() {
                expect(ACT.Tracking.ATTRS).to.exist;
            });

            it("should have ATTRS.version defined", function() {
                expect(ACT.Tracking.ATTRS.version).to.exist;
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

            it("should have basic values defined", function() {
                expect(tracking.config).to.have.property("z1");
                expect(tracking.config).to.have.property("rB");
                expect(tracking.config).to.have.property("beap");
                expect(tracking.config).to.have.property("adid");
                expect(tracking.config).to.have.property("unique");
            });
        });

        /* Test setting of individual properties */
        describe("Check declaration of individual properties", function() {
            var props = ["z1", "rB", "adid", "unique"];
            var conf;
            var trk;
            var prop_name;
            var prop_cur;
            var itor = 0;

            beforeEach(function() {
                conf = {};
                prop_name = props[itor] + "_name";
                prop_cur = props[itor];
                conf[prop_cur] = prop_name;
                trk = new ACT.Tracking(conf);
            });

            afterEach(function() {
                itor++;
                trk.destroy();
            });

            for (var itor2 = 0; itor2 < props.length; itor2++) {
                var prop_name_1 = props[itor2] + "_name";
                var prop_cur_1 = props[itor2];
                it("should have " + prop_cur_1 + " defined as '" + prop_name_1 + "'", function() {
                    expect(trk.config).to.have.property(prop_cur);
                    expect(trk.config[prop_cur]).to.equal(prop_name);
                });
            }

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
                expect(tracking.interaction_track()).to.equal(false);
                expect(tracking.interaction_track(null)).to.equal(false);
            });
        });

        describe("Invalid values test - returns true", function() {
            it("should fire the track", function() {
                var conf = {
                    "r0": "https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3aW1yODVycihnaWQkdlZuMFBqSXdOaTZnWDlBRlZUR2Z3eFowTmpZdU1sVklCakVBQUFBQSxzdCQxNDMwNzgzNTM3NzgxODIxLHNpJDQ0NTIwNTEsc3AkMjAyMzc3MjgxOSxjciQ0MzgxNTY1NTUxLHYkMi4wLGFpZCQ3RVdIQ0dLTGM0Yy0sY3QkMjUseWJ4JDg1c0h1dGlTV2JVSGRPbjhBSXFZSGcsYmkkMjE3MjcwNzA1MSxtbWUkOTE3MDk2MjI4MjIyMDA1Nzc4NCxsbmckZW4tdXMsciQxLHlvbyQxLGFncCQzMzIzMzY1MDUxLGFwJEZQQUQpKQ/2/*",
                    "z1": "https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(14441prlg(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,si$4452051,sp$2023772819,bi$2172707051,cr$4381565551,cpcv$0,v$2.0,st$1430783537781821))&al=(as$11vp3jqc3,aid$7EWHCGKLc4c-,ct$25,id({beap_client_event}))",
                    "rB": "https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17ibv609f(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,st$1430783537781821,si$4452051,sp$2023772819,cr$4381565551,v$2.0,aid$7EWHCGKLc4c-,ct$25,ybx$85sHutiSWbUHdOn8AIqYHg,bi$2172707051,mme$9170962282220057784,lng$en-us,r$2,yoo$1,agp$3323365051,ap$FPAD))/*"
                };
                var tracker = new ACT.Tracking(conf);
                expect(tracker.interaction_track("param")).to.equal(true);
                tracker.destroy();
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
                expect(tracking.redirect_track("one", "two", "")).to.equal("");
                expect(tracking.redirect_track()).to.equal("");
                var str = "test_string";
                var num = "55";
                var url = "https://www.yahoo.com";
                expect(tracking.redirect_track(str, num, url)).to.equal("");
            });
        });

        describe("Valid values test - returns redirect string", function() {
            it("should return the redirect track", function() {
                var _conf = {
                    "r0": "https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3aW1yODVycihnaWQkdlZuMFBqSXdOaTZnWDlBRlZUR2Z3eFowTmpZdU1sVklCakVBQUFBQSxzdCQxNDMwNzgzNTM3NzgxODIxLHNpJDQ0NTIwNTEsc3AkMjAyMzc3MjgxOSxjciQ0MzgxNTY1NTUxLHYkMi4wLGFpZCQ3RVdIQ0dLTGM0Yy0sY3QkMjUseWJ4JDg1c0h1dGlTV2JVSGRPbjhBSXFZSGcsYmkkMjE3MjcwNzA1MSxtbWUkOTE3MDk2MjI4MjIyMDA1Nzc4NCxsbmckZW4tdXMsciQxLHlvbyQxLGFncCQzMzIzMzY1MDUxLGFwJEZQQUQpKQ/2/*",
                    "z1": "https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(14441prlg(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,si$4452051,sp$2023772819,bi$2172707051,cr$4381565551,cpcv$0,v$2.0,st$1430783537781821))&al=(as$11vp3jqc3,aid$7EWHCGKLc4c-,ct$25,id({beap_client_event}))",
                    "rB": "https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17ibv609f(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,st$1430783537781821,si$4452051,sp$2023772819,cr$4381565551,v$2.0,aid$7EWHCGKLc4c-,ct$25,ybx$85sHutiSWbUHdOn8AIqYHg,bi$2172707051,mme$9170962282220057784,lng$en-us,r$2,yoo$1,agp$3323365051,ap$FPAD))/*"
                };
                var test_against = "https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17ibv609f(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,st$1430783537781821,si$4452051,sp$2023772819,cr$4381565551,v$2.0,aid$7EWHCGKLc4c-,ct$25,ybx$85sHutiSWbUHdOn8AIqYHg,bi$2172707051,mme$9170962282220057784,lng$en-us,r$2,yoo$1,agp$3323365051,ap$FPAD))&id=test_string&r=55/*https://www.yahoo.com";
                var tracker = new ACT.Tracking(_conf);
                var str = "test_string";
                var num = "55";
                var url = "https://www.yahoo.com";
                expect(tracker.redirect_track(str, num, url)).to.equal(test_against);
                tracker.destroy();
            });
        });
    });

    /* Track Tests */
    describe("Function - 'track' tests", function() {
    	var trk;

        before(function() {
            var conf = {
                "r0": "https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3aW1yODVycihnaWQkdlZuMFBqSXdOaTZnWDlBRlZUR2Z3eFowTmpZdU1sVklCakVBQUFBQSxzdCQxNDMwNzgzNTM3NzgxODIxLHNpJDQ0NTIwNTEsc3AkMjAyMzc3MjgxOSxjciQ0MzgxNTY1NTUxLHYkMi4wLGFpZCQ3RVdIQ0dLTGM0Yy0sY3QkMjUseWJ4JDg1c0h1dGlTV2JVSGRPbjhBSXFZSGcsYmkkMjE3MjcwNzA1MSxtbWUkOTE3MDk2MjI4MjIyMDA1Nzc4NCxsbmckZW4tdXMsciQxLHlvbyQxLGFncCQzMzIzMzY1MDUxLGFwJEZQQUQpKQ/2/*",
                "z1": "https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(14441prlg(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,si$4452051,sp$2023772819,bi$2172707051,cr$4381565551,cpcv$0,v$2.0,st$1430783537781821))&al=(as$11vp3jqc3,aid$7EWHCGKLc4c-,ct$25,id({beap_client_event}))",
                "rB": "https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17ibv609f(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,st$1430783537781821,si$4452051,sp$2023772819,cr$4381565551,v$2.0,aid$7EWHCGKLc4c-,ct$25,ybx$85sHutiSWbUHdOn8AIqYHg,bi$2172707051,mme$9170962282220057784,lng$en-us,r$2,yoo$1,agp$3323365051,ap$FPAD))/*"
            };
            trk = new ACT.Tracking(conf);
        });

        after(function(){
        	trk.destroy();
        });

        it("should have 'track' accessible", function() {
            expect(trk.track).to.exist;
            expect(trk.track).to.be.a("function");
        });

        it("should call 'track'->'interaction_track' with null values and return false", function(done) {
            trk.track(null, null, null, function(res) {
                expect(res).to.equal(false);
                done();
            });
        });

        it("should call 'track'->'interaction_track' with a label and return true", function(done) {
            trk.track("fluffy", null, null, function(res) {
                expect(res).to.equal(true);
                done();
            });
        });

        it("should call 'track'->'redirect_track' with just the url and return an empty string", function(done) {
            trk.track(null, null, "abc", function(res) {
                expect(res).to.equal("");
                done();
            });
        });

        it("should call 'track'->'redirect_track'  with all params and return string", function(done) {
            trk.track("string", 123, "http://www.yahoo.com", function(res) {
                expect(res).to.equal('https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17ibv609f(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,st$1430783537781821,si$4452051,sp$2023772819,cr$4381565551,v$2.0,aid$7EWHCGKLc4c-,ct$25,ybx$85sHutiSWbUHdOn8AIqYHg,bi$2172707051,mme$9170962282220057784,lng$en-us,r$2,yoo$1,agp$3323365051,ap$FPAD))&id=string&r=123/*http://www.yahoo.com');
                done();
            });
        });
    });

	/* Tracking Events */
    describe("Tracking Events", function() {
        before(function() {
            var conf = {
                "r0": "https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3aW1yODVycihnaWQkdlZuMFBqSXdOaTZnWDlBRlZUR2Z3eFowTmpZdU1sVklCakVBQUFBQSxzdCQxNDMwNzgzNTM3NzgxODIxLHNpJDQ0NTIwNTEsc3AkMjAyMzc3MjgxOSxjciQ0MzgxNTY1NTUxLHYkMi4wLGFpZCQ3RVdIQ0dLTGM0Yy0sY3QkMjUseWJ4JDg1c0h1dGlTV2JVSGRPbjhBSXFZSGcsYmkkMjE3MjcwNzA1MSxtbWUkOTE3MDk2MjI4MjIyMDA1Nzc4NCxsbmckZW4tdXMsciQxLHlvbyQxLGFncCQzMzIzMzY1MDUxLGFwJEZQQUQpKQ/2/*",
                "z1": "https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(14441prlg(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,si$4452051,sp$2023772819,bi$2172707051,cr$4381565551,cpcv$0,v$2.0,st$1430783537781821))&al=(as$11vp3jqc3,aid$7EWHCGKLc4c-,ct$25,id({beap_client_event}))",
                "rB": "https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17ibv609f(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,st$1430783537781821,si$4452051,sp$2023772819,cr$4381565551,v$2.0,aid$7EWHCGKLc4c-,ct$25,ybx$85sHutiSWbUHdOn8AIqYHg,bi$2172707051,mme$9170962282220057784,lng$en-us,r$2,yoo$1,agp$3323365051,ap$FPAD))/*"
            };
            trk = new ACT.Tracking(conf);
        });

        after(function(){
        	trk.destroy();
        });

        it("should fire interaction tracking on an event firing", function(done) {
            sinon.stub(ACT.Util, 'pixelTrack');
            var trackingListner = ACT.Event.on('tracking:track:complete', function(res) {
            	trackingListner.remove();
            	expect(ACT.Util.pixelTrack.calledWith(sinon.match('label$template_click_button_opensomething'))).to.equal(true);
	        	ACT.Util.pixelTrack.restore();
                done();
            });
            ACT.Event.fire('tracking:track', { label: 'template_click_button_opensomething' });
        });

        it("should fire redirect tracking on event firing", function(done){
        	var redirectListner = ACT.Event.on("tracking:registerRedirect:complete", function(data){
        		redirectListner.remove();
        		expect(data.link.indexOf('https://uk.yahoo.com') > -1).to.equal(true);
        		expect(data.link.indexOf('YahooUk') > -1).to.equal(true);
        		done();
        	});

        	ACT.Event.fire("tracking:registerRedirect", {
        		clickTag: 'https://uk.yahoo.com',
        		clickTagName: 'YahooUk'
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
					"r0": "https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3aW1yODVycihnaWQkdlZuMFBqSXdOaTZnWDlBRlZUR2Z3eFowTmpZdU1sVklCakVBQUFBQSxzdCQxNDMwNzgzNTM3NzgxODIxLHNpJDQ0NTIwNTEsc3AkMjAyMzc3MjgxOSxjciQ0MzgxNTY1NTUxLHYkMi4wLGFpZCQ3RVdIQ0dLTGM0Yy0sY3QkMjUseWJ4JDg1c0h1dGlTV2JVSGRPbjhBSXFZSGcsYmkkMjE3MjcwNzA1MSxtbWUkOTE3MDk2MjI4MjIyMDA1Nzc4NCxsbmckZW4tdXMsciQxLHlvbyQxLGFncCQzMzIzMzY1MDUxLGFwJEZQQUQpKQ/2/*",
					"z1": "https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(14441prlg(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,si$4452051,sp$2023772819,bi$2172707051,cr$4381565551,cpcv$0,v$2.0,st$1430783537781821))&al=(as$11vp3jqc3,aid$7EWHCGKLc4c-,ct$25,id({beap_client_event}))",
					"rB": "https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17ibv609f(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,st$1430783537781821,si$4452051,sp$2023772819,cr$4381565551,v$2.0,aid$7EWHCGKLc4c-,ct$25,ybx$85sHutiSWbUHdOn8AIqYHg,bi$2172707051,mme$9170962282220057784,lng$en-us,r$2,yoo$1,agp$3323365051,ap$FPAD))/*",
					"trackingFunctions": {
						"overwrite": true,
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
					trackingListner.remove();
					expect(interactionTrack.called).to.equal(true);
	            	expect(interactionTrack.calledWith("template_click_button_opensomething")).to.equal(true);
					expect(res.data).to.equal(true);
					done();
				});
				ACT.Event.fire('tracking:track', { label: 'template_click_button_opensomething' });
			});

			it("should fire redirect tracking on event firing", function(done){
				var redirectListner = ACT.Event.on("tracking:registerRedirect:complete", function(data){
					redirectListner.remove();
					expect(redirectTrack.calledOnce).to.equal(true);
	            	expect(redirectTrack.calledWithMatch("YahooUK", 259938998, "https://uk.yahoo.com")).to.equal(true);	            	
					expect(data.link.indexOf('https://uk.yahoo.com') > -1).to.equal(true);
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
					"r0": "https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3aW1yODVycihnaWQkdlZuMFBqSXdOaTZnWDlBRlZUR2Z3eFowTmpZdU1sVklCakVBQUFBQSxzdCQxNDMwNzgzNTM3NzgxODIxLHNpJDQ0NTIwNTEsc3AkMjAyMzc3MjgxOSxjciQ0MzgxNTY1NTUxLHYkMi4wLGFpZCQ3RVdIQ0dLTGM0Yy0sY3QkMjUseWJ4JDg1c0h1dGlTV2JVSGRPbjhBSXFZSGcsYmkkMjE3MjcwNzA1MSxtbWUkOTE3MDk2MjI4MjIyMDA1Nzc4NCxsbmckZW4tdXMsciQxLHlvbyQxLGFncCQzMzIzMzY1MDUxLGFwJEZQQUQpKQ/2/*",
					"z1": "https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(14441prlg(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,si$4452051,sp$2023772819,bi$2172707051,cr$4381565551,cpcv$0,v$2.0,st$1430783537781821))&al=(as$11vp3jqc3,aid$7EWHCGKLc4c-,ct$25,id({beap_client_event}))",
					"rB": "https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17ibv609f(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,st$1430783537781821,si$4452051,sp$2023772819,cr$4381565551,v$2.0,aid$7EWHCGKLc4c-,ct$25,ybx$85sHutiSWbUHdOn8AIqYHg,bi$2172707051,mme$9170962282220057784,lng$en-us,r$2,yoo$1,agp$3323365051,ap$FPAD))/*",
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
					trackingListner.remove();
					expect(interactionTrack.called).to.equal(true);
	            	expect(interactionTrack.calledWith("template_click_button_opensomething")).to.equal(true);
					expect(res.data).to.equal(true);
					done();
				});
				ACT.Event.fire('tracking:track', { label: 'template_click_button_opensomething' });
			});

			it("should fire redirect tracking on event firing", function(done){
				var redirectListner = ACT.Event.on("tracking:registerRedirect:complete", function(data){
					redirectListner.remove();
					expect(redirectTrack.calledOnce).to.equal(true);
	            	expect(redirectTrack.calledWithMatch("YahooUK", 259938998, "https://uk.yahoo.com")).to.equal(true);	            	
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
        before(function() {
            var conf = {
            	"trackUnique": true,
                "r0": "https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3aW1yODVycihnaWQkdlZuMFBqSXdOaTZnWDlBRlZUR2Z3eFowTmpZdU1sVklCakVBQUFBQSxzdCQxNDMwNzgzNTM3NzgxODIxLHNpJDQ0NTIwNTEsc3AkMjAyMzc3MjgxOSxjciQ0MzgxNTY1NTUxLHYkMi4wLGFpZCQ3RVdIQ0dLTGM0Yy0sY3QkMjUseWJ4JDg1c0h1dGlTV2JVSGRPbjhBSXFZSGcsYmkkMjE3MjcwNzA1MSxtbWUkOTE3MDk2MjI4MjIyMDA1Nzc4NCxsbmckZW4tdXMsciQxLHlvbyQxLGFncCQzMzIzMzY1MDUxLGFwJEZQQUQpKQ/2/*",
                "z1": "https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(14441prlg(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,si$4452051,sp$2023772819,bi$2172707051,cr$4381565551,cpcv$0,v$2.0,st$1430783537781821))&al=(as$11vp3jqc3,aid$7EWHCGKLc4c-,ct$25,id({beap_client_event}))",
                "rB": "https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17ibv609f(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,st$1430783537781821,si$4452051,sp$2023772819,cr$4381565551,v$2.0,aid$7EWHCGKLc4c-,ct$25,ybx$85sHutiSWbUHdOn8AIqYHg,bi$2172707051,mme$9170962282220057784,lng$en-us,r$2,yoo$1,agp$3323365051,ap$FPAD))/*"
            };
            trk = new ACT.Tracking(conf);
        });

        after(function(){
        	trk.destroy();
        });

    	it("should tracking event with unique key", function(done){
            sinon.stub(ACT.Util, 'pixelTrack');
            var trackListener = ACT.Event.on('tracking:track:complete', function(res) {
            	trackListener.remove();
            	expect(ACT.Util.pixelTrack.calledWith(sinon.match('label$u_template_click_button_close'))).to.equal(true);
	        	ACT.Util.pixelTrack.restore();
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
            sinon.stub(ACT.Util, 'pixelTrack');
            var trackListener = ACT.Event.on('tracking:track:complete', function(res) {
            	trackListener.remove();
            	expect(ACT.Util.pixelTrack.calledWith(sinon.match('label$nu_template_click_button_close'))).to.equal(true);
	        	ACT.Util.pixelTrack.restore();
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
        before(function() {
            var conf = {
                "r0": "https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3aW1yODVycihnaWQkdlZuMFBqSXdOaTZnWDlBRlZUR2Z3eFowTmpZdU1sVklCakVBQUFBQSxzdCQxNDMwNzgzNTM3NzgxODIxLHNpJDQ0NTIwNTEsc3AkMjAyMzc3MjgxOSxjciQ0MzgxNTY1NTUxLHYkMi4wLGFpZCQ3RVdIQ0dLTGM0Yy0sY3QkMjUseWJ4JDg1c0h1dGlTV2JVSGRPbjhBSXFZSGcsYmkkMjE3MjcwNzA1MSxtbWUkOTE3MDk2MjI4MjIyMDA1Nzc4NCxsbmckZW4tdXMsciQxLHlvbyQxLGFncCQzMzIzMzY1MDUxLGFwJEZQQUQpKQ/2/*",
                "z1": "https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(14441prlg(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,si$4452051,sp$2023772819,bi$2172707051,cr$4381565551,cpcv$0,v$2.0,st$1430783537781821))&al=(as$11vp3jqc3,aid$7EWHCGKLc4c-,ct$25,id({beap_client_event}))",
                "rB": "https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17ibv609f(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,st$1430783537781821,si$4452051,sp$2023772819,cr$4381565551,v$2.0,aid$7EWHCGKLc4c-,ct$25,ybx$85sHutiSWbUHdOn8AIqYHg,bi$2172707051,mme$9170962282220057784,lng$en-us,r$2,yoo$1,agp$3323365051,ap$FPAD))/*"
            };
            trk = new ACT.Tracking(conf);
        });

        after(function(){
        	trk.destroy();
        });

    	it("should tracking event with conveted valid macros", function(done){
            sinon.stub(ACT.Util, 'pixelTrack');
            var trackListener = ACT.Event.on('tracking:track:complete', function(res) {
            	trackListener.remove();
            	expect(ACT.Util.pixelTrack.calledWith(sinon.match('label$template_play_firstplay_html'))).to.equal(true);
	        	ACT.Util.pixelTrack.restore();
                done();
            });

            var envListener = ACT.Event.on('env:envRendered', function(data){
            	envListener.remove();
            	ACT.Event.fire('env:envRendered:Done', 'html');
            });
            ACT.Event.fire('tracking:track', { label: 'template_play_firstplay_::envRendered::'});
    	});

    	it("should tracking event with invalid macros", function(done){
            sinon.stub(ACT.Util, 'pixelTrack');
            var trackListener = ACT.Event.on('tracking:track:complete', function(res) {
            	trackListener.remove();
            	expect(ACT.Util.pixelTrack.calledWith(sinon.match('label$template_play_firstplay_'))).to.equal(true);
	        	ACT.Util.pixelTrack.restore();
                done();
            });
            ACT.Event.fire('tracking:track', { label: 'template_play_firstplay_::undefinedMacros::'});
    	});
    });

	/* Tracking Actions */
    describe("Tracking Actions", function(){
        before(function(){
            conf = {
                "r0":"https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3aW1yODVycihnaWQkdlZuMFBqSXdOaTZnWDlBRlZUR2Z3eFowTmpZdU1sVklCakVBQUFBQSxzdCQxNDMwNzgzNTM3NzgxODIxLHNpJDQ0NTIwNTEsc3AkMjAyMzc3MjgxOSxjciQ0MzgxNTY1NTUxLHYkMi4wLGFpZCQ3RVdIQ0dLTGM0Yy0sY3QkMjUseWJ4JDg1c0h1dGlTV2JVSGRPbjhBSXFZSGcsYmkkMjE3MjcwNzA1MSxtbWUkOTE3MDk2MjI4MjIyMDA1Nzc4NCxsbmckZW4tdXMsciQxLHlvbyQxLGFncCQzMzIzMzY1MDUxLGFwJEZQQUQpKQ/2/*",
                "z1":"https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(14441prlg(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,si$4452051,sp$2023772819,bi$2172707051,cr$4381565551,cpcv$0,v$2.0,st$1430783537781821))&al=(as$11vp3jqc3,aid$7EWHCGKLc4c-,ct$25,id({beap_client_event}))",
                "rB":"https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17ibv609f(gid$vVn0PjIwNi6gX9AFVTGfwxZ0NjYuMlVIBjEAAAAA,st$1430783537781821,si$4452051,sp$2023772819,cr$4381565551,v$2.0,aid$7EWHCGKLc4c-,ct$25,ybx$85sHutiSWbUHdOn8AIqYHg,bi$2172707051,mme$9170962282220057784,lng$en-us,r$2,yoo$1,agp$3323365051,ap$FPAD))/*"
            };
        });

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
           var trk = new ACT.Tracking(conf);
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
            var trk = new ACT.Tracking(conf);
        });
	});
});
