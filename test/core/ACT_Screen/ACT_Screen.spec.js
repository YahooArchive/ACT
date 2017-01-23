var expect = chai.expect;

describe("ACT.Screen", function() {

	before(function(){

		if(ACT.Dom){

			sinon.stub(ACT.Dom, "getWindowSize", function(){
				return {
					width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
					height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
				}
			});
		}

		this.config = {
			currentWindow:{
				width : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
				height : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
			},
			sDarlaAPI:{
				lyr:{
					open:function(layer){},
					close:function(){}
				},
				geom:function(){
					return {
						win:{
							h: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
							w: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
						}
						
					};
					 
				},
				register:function(w,h,msg,root){},
				expand:function(x,y,push){},
				collapse:function(){},
				supports:function(bool){},
				cookie:function(cookie,obj){}
    		}
		};

		sinon.stub(ACT.Event, 'fire');
		sinon.stub(ACT.Event, 'on');

	});

	after(function(){
		if(ACT.Dom){
			ACT.Dom.getWindowSize.restore();
		}

		ACT.Event.fire.restore();
		ACT.Event.on.restore();

	});

	describe('constructor', function() {

		var Screen;

		before(function(){
			sinon.stub(ACT.Screen.prototype, 'setStatus');

			Screen = new ACT.Screen();
		});

		after(function(){
			ACT.Screen.prototype.setStatus.restore();
		});

		it("should be able to instantiate Screen", function() {
			expect(ACT.Screen).to.exist;
		});

		it("should call setStatus function", function(){
			expect(Screen.setStatus.called, 'setStatus function is called').to.be.true;
		})
	});

	describe('set current window status', function(){
		var Screen;

		before(function(){
			sinon.stub(ACT.Screen.prototype, 'setStatusStandard');
			sinon.stub(ACT.Screen.prototype, 'startListenScreenStandard');
			sinon.stub(ACT.Screen.prototype, 'setStatusSF');
			sinon.stub(ACT.Screen.prototype, 'startListenScreenSF');

			Screen = new ACT.Screen();
		});

		after(function(){
			ACT.Screen.prototype.setStatusStandard.restore();
			ACT.Screen.prototype.startListenScreenStandard.restore();
			ACT.Screen.prototype.setStatusSF.restore();
			ACT.Screen.prototype.startListenScreenSF.restore();
		});

		it("should fire and listen to sframe to get API", function(){
			Screen.setStatus();

			expect(ACT.Event.fire.calledWith('sframe:darlaCheck'), 'fire darlaCheck to Darla').to.be.true;
			expect(ACT.Event.on.calledWith('sframe:darlaCheck:complete', sinon.match.func), 'fire darlaCheck to Darla').to.be.true;
		});

		it("should use standard functions of Darla is not available", function(){
			// temporarily retrieve original fire event for testing
			ACT.Event.on.restore();

			Screen.setStatus();

			ACT.Event.fire.restore();
			ACT.Event.fire('sframe:darlaCheck:complete', {
				key: null,
				yAPI: null
			});

			expect(Screen.setStatusStandard.called, 'setStatusStandard function is fired').to.be.true;
			expect(Screen.startListenScreenStandard.called, 'startListenScreenStandard function is fired').to.be.true;

			// stub Event function again to prevent side effect
			sinon.stub(ACT.Event, 'fire');
			sinon.stub(ACT.Event, 'on');
		});

		it("should use darla functions of Darla is available", function(){
			// temporarily retrieve original fire event for testing
			ACT.Event.on.restore();

			Screen.setStatus();

			ACT.Event.fire.restore();

			ACT.Event.fire('sframe:darlaCheck:complete', {
				key: {},
				yAPI: this.config.sDarlaAPI
			});

			expect(Screen.setStatusSF.called, 'setStatusSF function is fired').to.be.true;
			expect(Screen.startListenScreenSF.called, 'startListenScreenSF function is fired').to.be.true;

			// stub Event function again to prevent side effect
			sinon.stub(ACT.Event, 'fire');
			sinon.stub(ACT.Event, 'on');
		});
	});

	describe('standard window screen height & width', function(){
		var Screen;

		before(function(){
			Screen = new ACT.Screen();
			Screen.setStatusStandard();
			Screen.startListenScreenStandard();
		});


		it("should match screen width with current window width", function() {
	    	var status = Screen.getStatus();
			expect(status.screenWidth).to.equal(this.config.currentWindow.width);
	    	//Event cannot be fired in phantomjs 1.9.8 - Code valid in v2.0.0
	    	//window.dispatchEvent(new Event('resize'));
		});	

		it("should match screen height with current window height", function() {
	    	var status = Screen.getStatus();
			expect(status.screenHeight).to.equal(this.config.currentWindow.height);
	    	//Event cannot be fired in phantomjs 1.9.8 - Code valid in v2.0.0
	    	//window.dispatchEvent(new Event('resize'));

		});						
	});

	describe('safeframe screen height & width', function(){
		var Screen;

		before(function(){
			Screen = new ACT.Screen();
			Screen.set('sDarlaAPI', this.config.sDarlaAPI);
			Screen.setStatusSF();
			Screen.startListenScreenSF();
		});

		it("should match screen width with current window width", function() {
	    	var status = Screen.getStatus();
			expect(status.screenWidth).to.equal(this.config.currentWindow.width);
	    	//Event cannot be fired in phantomjs 1.9.8 - Code valid in v2.0.0
	    	//window.dispatchEvent(new Event('resize'));
		});	

		it("should match screen height with current window height", function() {
	    	var status = Screen.getStatus();
			expect(status.screenHeight).to.equal(this.config.currentWindow.height);
	    	//Event cannot be fired in phantomjs 1.9.8 - Code valid in v2.0.0
	    	//window.dispatchEvent(new Event('resize'));
		});						
	});

	describe('safeframe orientation', function(){
		var Screen;

		before(function(){
			Screen = new ACT.Screen({
	    		sDarlaAPI: this.config.sDarlaAPI
			});
		});

		after(function(){
		});

		it("should return landscape", function() {
			this.config.sDarlaAPI.geom = function(){
					return {
						win:{
							w: 1000,
							h: 400
						}
						
					};
					 
			};

			Screen.setStatusSF();
	    	
	    	var status = Screen.getStatus();
	    	expect(status.orientation, 'status orientation').to.equal('L');
		});	

		it("should return portrait", function() {
			this.config.sDarlaAPI.geom = function(){
					return {
						win:{
							w: 1000,
							h: 1800
						}	
					};
			};

			Screen.setStatusSF();
	    	var status = Screen.getStatus();
	    	expect(status.orientation, 'status orientation').to.equal('P');
		});					
	});

	describe('global events', function(){
		
		var Screen;

		before(function(){
			// don;t run setStatus for this test
			sinon.stub(ACT.Screen.prototype, 'setStatus');

			// free event to run
			ACT.Event.fire.restore();
			ACT.Event.on.restore();

			Screen = new ACT.Screen({
	    		sDarlaAPI: this.config.sDarlaAPI
			});
		});

		after(function(){

			ACT.Screen.prototype.setStatus.restore();

			// re-block Event again
			sinon.stub(ACT.Event, 'fire');
			sinon.stub(ACT.Event, 'on');
		});

		it("should get the status done event", function(done){
			ACT.Event.on('screen:getStatus:Done', function(e){
				expect(e).is.a('Object');
				done();
			});
			ACT.Event.fire('screen:getStatus');
		});
	});

	describe('safeframe window events listener', function(){
		var Screen;

		before(function(){
			Screen = new ACT.Screen({
				sDarlaAPI: this.config.sDarlaAPI
			});

			// free event for testing
			ACT.Event.fire.restore();
			ACT.Event.on.restore();

			Screen.setStatusSF();
			Screen.startListenScreenSF();
		});

		after(function(){
			// block events again
			sinon.stub(ACT.Event, 'fire');
			sinon.stub(ACT.Event, 'on');

		});

		it("should fire resize", function(done) {
			var listener = ACT.Event.on('screen:status', function(e){
				listener.remove();
				expect(e).is.a('Object');
				done();
			});

			this.config.sDarlaAPI.geom = function(){
				return {
					win:{
						h: 3000,
						w: 6000
					}
				}
			}

			ACT.Event.fire('secureDarla:geom-update', {});
		});	
		
		// This test should be sinon.calledWith Event.on
		it("should not fire resize if the window sizes match", function(done) {
			var temp = 0;
			var listener = ACT.Event.on('screen:status', function(e){
				temp = 1;
				listener.remove();
			});
			var listener2 = ACT.Event.on('secureDarla:geom-update', function(e){
				expect(temp).to.equal(0);
				done();
			});
			ACT.Event.fire('secureDarla:geom-update', {});
		});	
	});
});