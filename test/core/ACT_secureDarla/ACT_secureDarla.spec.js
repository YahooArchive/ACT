var expect = chai.expect;

describe("ACT.secureDarla", function() {

    var yAPI;
	var sDarla;
	var Event = ACT.Event;

    before(function() {
    	refreshSecureDarla(true);
        yAPI = window.Y.SandBox.vendor;
    });

    after(function() {
    	refreshSecureDarla(false);
    	yAPI = null;
    });

	it("should have ACT secureDarla", function(done){
		expect(ACT.SecureDarla).to.exist;
		done();
	});

	it("should overide config", function(done){
		// stub register function so it will not be executed when create new SecureDarla instance
		sinon.stub(ACT.SecureDarla.prototype, 'register');

		sDarla = new ACT.SecureDarla({
			template:{
				adId: 'testad',
				template: 'floating',
				width: 300,
				height: 600
			}
		}, null, true);

		expect(sDarla.config.width, 'config width').to.be.equal(300);
		expect(sDarla.config.height, 'config height').to.be.equal(600);
		expect(sDarla.config.adId, 'config adId').to.be.equal('testad');
		expect(sDarla.config.template, 'config template').to.be.equal('floating');
		expect(sDarla.isSafeFrame(), 'secureDarla available').to.be.true;
		expect(sDarla.register.called, 'register function to be called').to.be.true;

		// release register function from stub
		sDarla.register.restore();

		done();
	});

	describe("Darla register function", function(){
		it("Should available", function(done){

			expect(sDarla.register).to.be.a('function');

			done();
		});

		it("should register sDarla and events", function(done){
			sinon.spy(sDarla, 'initializeEvents');
			sinon.stub(Event, 'fire');
			// checking params passing into register:Actions event
			var testActions = sinon.match(function(value){
				if (!(value instanceof Array)) return false;
				if (value.length !== 4) return false;
				if (typeof value[0] !== 'object') return false;
				if (value[0].type !== 'darlaMessage') return false;
				if (typeof value[1] !== 'object') return false;
				if (value[1].type !== 'expandInlineFrame') return false;
				if (typeof value[2] !== 'object') return false;
				if (value[2].type !== 'contractInlineFrame') return false;
				if (typeof value[3] !== 'object') return false;
				if (value[3].type !== 'resizeInlineFrame') return false;

				return true;
			});

			sDarla.register();

			expect(yAPI.register.calledWith(300, 600), 'darla register function called with 300 and 600').to.be.true;
			expect(sDarla.initializeEvents.called, 'initializeEvents function is called').to.be.true;
			expect(Event.fire.calledWith('register:Actions', testActions), 'event register:Action is fired').to.be.true;

			sDarla.initializeEvents.restore();
			Event.fire.restore();

			done();
		});
	});

	describe("Darla notify function", function(){

		it('should fire event when called', function(done){
			sinon.stub(Event, 'fire');

			sDarla.notify('geom-update', {data:'value'});

			expect(Event.fire.calledWith('secureDarla:geom-update'), sinon.match.has('data', 'value'), 'geom-update event is fired').to.be.true;

			Event.fire.restore();
			done();
		});

		it('should save key if cmd is register or register-update', function(done){
			sinon.stub(Event, 'fire');

			sDarla.notify('register', {"cmd":"register","info":{},"value":null,"reason":"","key":"key"});

			expect(sDarla.config.sdKey, 'stored darla key').to.be.equal('key');

			sDarla.notify('register-update', {"cmd":"register-update","info":{},"value":null,"reason":"","key":"newkey"});

			expect(sDarla.config.sdKey, 'stored darla key').to.be.equal('newkey');

			Event.fire.restore();
			done();
		})
	});

	describe("Darla actions", function(){
		// we gonna use this list to keep reference to all registered action and test them
		var actionsRegistered = {};

		// fake runAction
		function runAction(actionName, args){
			var actionDef = actionsRegistered[actionName];
			var argsDef = actionDef.arguments;
			var process = actionDef.process;

			// run throught all test for args
			var valid = true;
			for (var argName in argsDef){
				var argDef = argsDef[argName];
				if (typeof argDef.test === 'function'){
					valid = argDef.test(args[argName]);
				}
				if (!valid) return;
			}

			// run process
			process(1, args);
		};

		it("should be registered", function(done){

			var actionEvent = Event.on('register:Actions', function(actionsList){
				actionEvent.remove();

				// save all actions into the list
				for (var index = 0; index < actionsList.length; index ++){
					var action = actionsList[index];
					actionsRegistered[action.type] = action;
				}

			});

			sDarla.register();

			expect(actionsRegistered, 'registered actions').to.have.all.keys('darlaMessage', 'expandInlineFrame', 'contractInlineFrame', 'resizeInlineFrame');

			done();
		});



		it("should return true against valid arguments", function(done){


			sinon.stub(ACT.Event, 'fire', function(event, data){
				if(event === "register:Actions"){

					var darlaMessage = data[0].argument;
					var expandInlineFrame = data[1].argument;
					var contractInlineFrame = data[2].argument;
					var resizeInlineFrame = data[3].argument;


					expect(darlaMessage.msg.test("hello world")).to.be.true;
					expect(darlaMessage.timeout.test(10)).to.be.true;
					expect(darlaMessage.timeout.test("10")).to.be.true;
					expect(darlaMessage.timeout.test(undefined)).to.be.true;
					expect(darlaMessage.timeout.test(null)).to.be.true;

					expect(expandInlineFrame.top.test(100)).to.be.true;
					expect(expandInlineFrame.right.test(100)).to.be.true;
					expect(expandInlineFrame.bottom.test(100)).to.be.true;
					expect(expandInlineFrame.left.test(100)).to.be.true;
					expect(expandInlineFrame.push.test(true)).to.be.true;
					expect(expandInlineFrame.push.test(false)).to.be.true;
					expect(expandInlineFrame.timeout.test(10)).to.be.true;
					expect(expandInlineFrame.timeout.test("10")).to.be.true;
					expect(expandInlineFrame.timeout.test(undefined)).to.be.true;
					expect(expandInlineFrame.timeout.test(null)).to.be.true;

					expect(contractInlineFrame.timeout.test("10")).to.be.true;
					expect(contractInlineFrame.timeout.test(10)).to.be.true;
					expect(contractInlineFrame.timeout.test(undefined)).to.be.true;
					expect(contractInlineFrame.timeout.test(null)).to.be.true;

					expect(resizeInlineFrame.width.test("100")).to.be.true;
					expect(resizeInlineFrame.height.test("100")).to.be.true;
					expect(resizeInlineFrame.width.test(100)).to.be.true;
					expect(resizeInlineFrame.height.test(100)).to.be.true;
					expect(resizeInlineFrame.animationLength.test("1000")).to.be.true;
					expect(resizeInlineFrame.animationLength.test(1000)).to.be.true;
					expect(resizeInlineFrame.animationLength.test(undefined)).to.be.true;
					expect(resizeInlineFrame.animationLength.test(null)).to.be.true;
					expect(resizeInlineFrame.timeout.test(10)).to.be.true;
					expect(resizeInlineFrame.timeout.test("10")).to.be.true;
					expect(resizeInlineFrame.timeout.test(undefined)).to.be.true;
					expect(resizeInlineFrame.timeout.test(null)).to.be.true;

					ACT.Event.fire.restore();
					done();
				}
			});

			sDarla.register();


		});


		it("should return false against invalid arguments", function(done){


			sinon.stub(ACT.Event, 'fire', function(event, data){
				if(event === "register:Actions"){

					var darlaMessage = data[0].argument;
					var expandInlineFrame = data[1].argument;
					var contractInlineFrame = data[2].argument;
					var resizeInlineFrame = data[3].argument;

					expect(darlaMessage.msg.test(10)).to.be.false;
					expect(darlaMessage.msg.test(undefined)).to.be.false;
					expect(darlaMessage.msg.test(null)).to.be.false;
					expect(darlaMessage.timeout.test("test")).to.be.false;

					expect(expandInlineFrame.top.test("test")).to.be.false;
					expect(expandInlineFrame.right.test("test")).to.be.false;
					expect(expandInlineFrame.bottom.test("test")).to.be.false;
					expect(expandInlineFrame.left.test("test")).to.be.false;
					expect(expandInlineFrame.push.test("true")).to.be.false;
					expect(expandInlineFrame.push.test("false")).to.be.false;
					expect(expandInlineFrame.timeout.test("test")).to.be.false;

					expect(contractInlineFrame.timeout.test("test")).to.be.false;

					expect(resizeInlineFrame.animationLength.test("test")).to.be.false;
					expect(resizeInlineFrame.timeout.test("test")).to.be.false;
					ACT.Event.fire.restore();
					done();
				}
			});

			sDarla.register();


		});


		describe("expandInlineFrame action", function(){
			it('should fire expandInlineFrame event', function(done){

				sinon.stub(Event, 'on');
				sinon.stub(Event, 'fire');

				runAction('expandInlineFrame', {
					top: 50,
					bottom: 0,
					left: 500,
					right: 10,
					push: true
				});

				expect(Event.fire.calledWith('sframe:expand', sinon.match.object), 'sframe:expand is fire with correct arg').to.be.true;
				expect(Event.on.calledWith('sframe:expand:complete', sinon.match.func), 'sframe:expand:complete is listened').to.be.true;

				Event.on.restore();
				Event.fire.restore();

				done();
			});

			it("should complete action when expand finsh", function(done){

				sinon.spy(Event, 'fire');

				runAction('expandInlineFrame', {
					top: 50,
					bottom: 0,
					left: 500,
					right: 10,
					push: true
				});

				Event.fire('secureDarla:expanded');

				expect(Event.fire.calledWith('sframe:expand:complete'), 'sframe:expand:complete is fired').to.be.true;
				expect(Event.fire.calledWith('complete:action'), 'complete:action is fired').to.be.true;

				Event.fire.restore();

				done();
			});
		});

		describe("contractInlineFrame action", function(){
			it('should fire contractInlineFrame event', function(done){

				sinon.stub(Event, 'on');
				sinon.stub(Event, 'fire');

				runAction('contractInlineFrame');

				expect(Event.fire.calledWith('sframe:collapse'), 'sframe:collapse is fire with correct arg').to.be.true;
				expect(Event.on.calledWith('sframe:collapse:complete', sinon.match.func), 'sframe:collapse:complete is listened').to.be.true;

				Event.on.restore();
				Event.fire.restore();

				done();
			});

			it("should complete action when collapse finsh", function(done){

				sinon.spy(Event, 'fire');

				runAction('contractInlineFrame');

				Event.fire('secureDarla:collapsed');

				expect(Event.fire.calledWith('sframe:collapse:complete'), 'sframe::collapse is fired').to.be.true;
				expect(Event.fire.calledWith('complete:action'), 'complete:action is fired').to.be.true;

				Event.fire.restore();

				done();
			});
		});

		describe("resizeInlineFrame action", function(){
			it('should fire resizeInlineFrame event', function(done){

				sinon.stub(Event, 'on');
				sinon.stub(Event, 'fire');

				runAction('resizeInlineFrame', {
					width: 500,
					height: 500,
					animationLength: 1000
				});

				expect(Event.fire.calledWith('sframe:resize-to', sinon.match.object), 'sframe:resize-to is fire with correct arg').to.be.true;
				expect(Event.on.calledWith('sframe:resize-to:complete', sinon.match.func), 'sframe:resize-to:complete is listened').to.be.true;

				Event.on.restore();
				Event.fire.restore();

				done();
			});

			it("should complete action when resize finsh", function(done){
				yAPI.geom.returns({
					self: {
						w: 300,
						h: 600
					}
				})

				sinon.spy(Event, 'fire');

				runAction('resizeInlineFrame', {
					width: 300,
					height: 100,
					animationLength: 1000
				});

				Event.fire('secureDarla:resize-to');

				expect(Event.fire.calledWith('sframe:resize-to:complete'), 'sframe::resize-to is fired').to.be.true;
				expect(Event.fire.calledWith('complete:action'), 'complete:action is fired').to.be.true;

				Event.fire.restore();

				done();
			});
		});
	});

	describe("Darla ResizeTo function", function(){
		it("Should available", function(done){
			expect(sDarla.resizeTo).to.be.a('function');

			done();
		});

		it("Should do nothing if sizes doesn't change", function(done){
			yAPI.geom.returns({
				self: {
					w: 300,
					h: 600
				}
			})

			window.innerWidth = 300;
			window.innerHeight = 600;

			sinon.stub(Event, 'fire');

			sDarla.resizeTo({
				width: 300,
				height: 600,
				animationLength: 1000
			});

			expect(Event.fire.calledWith('sframe:resize-to:complete'), 'sframe:resize-to:complete event should be fired').to.be.true;

			Event.fire.restore();

			done();
		});

		it("Should call yAPI resize when has valid params", function(done){
			// make return some default value
			yAPI.geom.returns({
				self: {
					w: 300,
					h: 600
				}
			});

			sinon.stub(Event, 'on');

			sDarla.resizeTo({
				width: 400,
				height: 700,
				animationLength: 1000
			});

			expect(yAPI.resizeTo.calledWith(
				sinon.match.has('w', 400).and(
					sinon.match.has('h', 700).and(
						sinon.match.has('animTime', 1000)
					)
				)
			), 'yAPI resizeTo is called with right params').to.be.true;

			expect(Event.on.calledWith('secureDarla:resize-to', sinon.match.func), 'resize-to is listened').to.be.true;

			Event.on.restore();
			done();
		});

		it("Should complete action when receive message from yAPI", function(done){

			sinon.spy(Event, 'on');
			sinon.spy(Event, 'fire');

			yAPI.resizeTo = function(){
				sDarla.notify('resize-to', {});
			}

			sDarla.resizeTo({
				width: 400,
				height: 700,
				animationLength: 1000
			});

			expect(Event.fire.calledWith('secureDarla:resize-to'), 'secureDarla:resize-to is fired').to.be.true;
			expect(Event.fire.calledWith('sframe:resize-to:complete'), 'sframe:resize-to:complete is fired').to.be.true;

			Event.on.restore();
			Event.fire.restore();

			done();

		});
	});

	describe("Darla Expand function", function(){
		it("Should available", function(done){
			expect(sDarla.expand).to.be.a('function');
			done();
		});

		it("should stop action if expand state is true", function(done){

			sinon.stub(Event, 'fire');

			sDarla.isInlineExpanded = true;

			sDarla.expand();

			expect(Event.fire.calledWith('sframe:expand:complete'), 'sframe:expand:complete event is fired');

			Event.fire.restore();
			done();

		});

		it("should stop action if invalid arguments are passed", function(done){

			sinon.stub(Event, 'fire');

			sDarla.isInlineExpanded = false;

			sDarla.expand({
				top: 0,
				right: -1,
				bottom: 10,
				left: 20,
				push: false
			});

			expect(Event.fire.calledWith('sframe:expand:complete'), 'sframe:expand:complete event is fired').to.be.true;

			Event.fire.restore();
			done();

		});

		it("should call yAPI.expand if valid argument is passed", function(done){

			sinon.stub(Event, 'on');
			sDarla.isInlineExpanded = false;
			sDarla.expand({
				top: 50,
				right: 0,
				bottom: 50,
				left: 500,
				push: true
			});

			expect(yAPI.expand.calledWith(
				sinon.match.has('t', 50).and(
					sinon.match.has('r', 0).and(
						sinon.match.has('b', 50).and(
							sinon.match.has('l', 500).and(
								sinon.match.has('push', true)
							)
						)
					)
				)
			), 'yAPI expand function is called with right args').to.be.true;
			expect(Event.on.calledWith('secureDarla:expanded', sinon.match.func), 'listentener for safeFrame expanded msg').to.be.true;

			Event.on.restore();
			done();
		});

		it("should stop action when Darla finish expand", function(done){

			sinon.spy(Event, 'on');
			sinon.spy(Event, 'fire');

			yAPI.expand = function(){
				sDarla.notify('expanded', {});
			}
			sDarla.isInlineExpanded = false;
			sDarla.expand({
				top: 10,
				right: 10,
				left: 10,
				bottom: 10,
				push: false
			});

			expect(Event.fire.calledWith('secureDarla:expanded'), 'secureDarla:expanded is fired').to.be.true;
			expect(Event.fire.calledWith('sframe:expand:complete'), 'sframe:expand:completee is fired').to.be.true;
			expect(sDarla.isInlineExpanded, 'isInlineExpanded flag').to.be.true;

			Event.on.restore();
			Event.fire.restore();

			done();
		});
	});

	describe("Darla Collapse function", function(){
		it("Should available", function(done){
			expect(sDarla.collapse).to.be.a('function');
			done();
		});

		it("Should stop action if expand state is false", function(done){
			sDarla.isInlineExpanded = false;

			sinon.stub(Event, 'fire');

			sDarla.collapse();

			expect(Event.fire.calledWith('sframe:collapse:complete'), 'sframe:collapse:complete is fired').to.be.true;

			Event.fire.restore();
			done();
		});

		it("Should call yAPI collapse function if expand state is true", function(done){
			sDarla.isInlineExpanded = true;

			sinon.stub(Event, 'on');

			sDarla.collapse();

			expect(yAPI.collapse.called, 'yAPI collapse is called').to.be.true;
			expect(Event.on.calledWith('secureDarla:collapsed', sinon.match.func), 'listener for secureDarla:collapsed is created').to.be.true;

			Event.on.restore();

			done();
		});

		it("should stop event when receive message from Darla", function(done){
			sinon.spy(Event, 'on');
			sinon.spy(Event, 'fire');

			yAPI.collapse = function(){
				sDarla.notify('collapsed', {});
			};

			sDarla.collapse();

			expect(Event.fire.calledWith('secureDarla:collapsed'), 'secureDarla:collapsed is fired').to.be.true;
			expect(Event.fire.calledWith('sframe:collapse:complete'), 'sframe:collapse:completee is fired').to.be.true;
			expect(sDarla.isInlineExpanded, 'isInlineExpanded flag').to.be.false;

			Event.on.restore();
			Event.fire.restore();

			done();
		});
	});
});
