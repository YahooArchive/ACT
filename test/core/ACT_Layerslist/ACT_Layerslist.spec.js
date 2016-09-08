/*global describe, before, after, it, ACT, sinon, chai */
'use strict';
describe("ACT.layersList", function() {

	var expect = chai.expect;

	if(ACT.LayerStandard === undefined){
		ACT.define('LayerStandard', ['Event', 'Lang', 'Class'], function(ACT) {

			var lang = ACT.Lang;
			var Class = ACT.Class;

			function LayerStandard(config) {
				this.init(config);
			}

			LayerStandard.ATTRS = {
				'NAME': 'LayerStandard',
				'version': '0.0.1',
				'playing': false
			};

			lang.extend(LayerStandard, Class, {
				initializer: function(config){
					this.set('config', config);
				},

				play: function() {
					var root = this;
					root.set('playing', true);
					ACT.Event.fire('layer:played', {
						layerName: root.get('layerName')
					});

				},

				stop: function() {
					var root = this;
					root.set('playing', false);

					ACT.Event.fire('layer:stopped', {
						layerName: root.get('layerName')
					});

				},

				getType: function() {
					return 'normal';
				},

				currentLayerPosition: function() {
					return [300, 800];
				}

			});

			return LayerStandard;

		});
	}

	ACT.define('LayerSdarla', ['Event', 'Lang', 'Class'], function(ACT) {

		var lang = ACT.Lang;
		var Class = ACT.Class;

		function LayerSdarla(config) {
			this.init(config);
			//LayerSdarla.superclass.constructor.apply(this, arguments);
		}
		LayerSdarla.ATTRS = {

			'NAME': 'LayerSdarla',
			'version': '0.0.1'
		};

		lang.extend(LayerSdarla, Class, {
			initializer: function(config){
				this.ATTRS = lang.merge(this.ATTRS, config.config);
			},

			play: function() {
				var root = this;
				root.set('playing', true);

				ACT.Event.fire('layer:played', {
					layerName: root.get('layerName')
				});

			},

			stop: function() {
				var root = this;
				root.set('playing', false);

				ACT.Event.fire('layer:stopped', {
					layerName: root.get('layerName')
				});

			},

			getType: function() {
				return 'darla';
			},

			currentLayerPosition: function() {
				return [300, 800];
			}

		});

		return LayerSdarla;

	});

	var sDarlaAPI = {
		lyr: {
			open: function(layer) {},
			close: function() {}
		},
		geom: function() {
			return {
				self: {
					t: 10,
					l: 20
				}
			};
		},
		register: function(w, h, msg, root) {},
		expand: function(x, y, push) {},
		collapse: function() {},
		supports: function(bool) {},
		cookie: function(cookie, obj) {}
	};


	describe('constructor', function() {

		var layersList;

		before(function() {

			var layersConfig = {
				mpu: {
					layerName: 'mpu',
					type: 'inline',
					base: "act-ad",
					x: 0,
					y: 0,
					width: 300,
					height: 250,
					contentLayer: {}
				},
				floating: {
					layerName: 'floating',
					type: 'overlay',
					base : 'body',
					x: 0,
					y: 0,
					frame: true,
					width: 600,
					height: 250,
					contentLayer: {}
				}
			};

			layersList = new ACT.LayersList({
				layersConfig: layersConfig,
				sDarlaAPI: null,
				envToPlay: "html",
				status: {}
			});


		});

		after(function(){
			layersList.destroy();
		});

		it("should be able to instantiate layersList", function() {
			expect(layersList).to.exist;
		});

		it("should be able to fetch a layer", function() {
			var layer = layersList.getLayer('mpu');
			expect(layer).to.not.equal(false);
		});

		it("should be able to return false fetching an invalid layer", function() {
			var layer = layersList.getLayer('billboard');
			expect(layer).to.equal(false);
		});

	});


	describe("ACT.layersList events in standard layers", function() {

		var layersList;

		var layersConfig = {
			mpu: {
				layerName: 'mpu',
				type: 'inline',
				base: "act-ad",
				x: 0,
				y: 0,
				width: 300,
				height: 250,
				contentLayer: {}
			},
			floating: {
				layerName: 'floating',
				type: 'overlay',
				base: 'body',
				x: 0,
				y: 0,
				frame: true,
				width: 600,
				height: 250,
				contentLayer: {}
			}
		};

		before(function() {

			layersList = new ACT.LayersList({
				layersConfig: layersConfig,
				sDarlaAPI: null,
				envToPlay: "html",
				status: {}
			});

		});

		after(function(){
			layersList.destroy();
		});

		it("should create a layerList without Darla", function() {

			var layerList = layersList.get('layersList');

			expect(layerList.length).to.equal(2);

			expect(layersList.get('envToPlay')).to.equal('html');

			expect(layersList.get('sDarlaAPI')).to.equal(null);

		});

		it("should fire a resetInlineFrame event", function(done) {

			var resetInlineEvent = ACT.Event.on('add:actions', function(actions) {
				resetInlineEvent.remove();

				expect(actions).is.a('object');
				expect(actions.type).is.equal('contractInlineFrame');

				done();
			});

			ACT.Event.fire('layersList:resetInlineFrame');

		});

		it("should fire a layer position event", function(done) {

			var layerPositionHandlerEvent = ACT.Event.on('layersList:getLayerPosition:complete', function(e) {
				layerPositionHandlerEvent.remove();

				expect(e.layerName).is.equal('floating');
				expect(e.newValue.x).is.equal(300);
				expect(e.newValue.y).is.equal(800);

				done();
			});

			ACT.Event.fire('layersList:getLayerPosition', {
				layerName: 'floating',
				coordinate: 'tl',
				attributes: {
					x: 'get:mpu:x',
					y: 800
				}
			});

		});

		it("should fire a layer position event with blank object if attributes not set", function(done) {

			var layerPositionHandlerEvent = ACT.Event.on('layersList:getLayerPosition:complete', function(e) {
				layerPositionHandlerEvent.remove();

				expect(e.layerName).is.equal('floating');
				expect(e.newValue.x).is.equal(undefined);
				expect(e.newValue.y).is.equal(undefined);

				done();
			});

			ACT.Event.fire('layersList:getLayerPosition', {
				layerName: 'floating',
				coordinate: 'tl',
				attributes: 'test'
			});

		});

	});

	describe("ACT.layersList in darla layers", function() {

		var layersList;

		var layersConfig = {
			mpu: {
				layerName: 'mpu',
				type: 'inline',
				base: "act-ad",
				x: 0,
				y: 0,
				width: 300,
				height: 250,
				contentLayer: {}
			},
			floating: {
				layerName: 'floating',
				type: 'overlay',
				base: 'body',
				x: 0,
				y: 0,
				frame: true,
				width: 600,
				height: 250,
				contentLayer: {}
			}
		};

		before(function(){
			layersList = new ACT.LayersList({
				layersConfig: layersConfig,
				sDarlaAPI: sDarlaAPI,
				envToPlay: "html",
				status: {}
			});
		});

		after(function(){
			layersList.destroy();
		});

		it("should create a layerList with Darla API", function() {

			var layerList = layersList.get('layersList');

			expect(layerList.length).to.equal(2);
			expect(layerList[0].get('layerName')).to.equal('mpu');
			expect(layerList[0].getType()).to.equal('normal');
			expect(layerList[1].get('layerName')).to.equal('floating');
			expect(layerList[1].getType()).to.equal('darla');
			expect(layersList.get('envToPlay')).to.equal('html');
			expect(layersList.get('sDarlaAPI')).is.a('object');

		});

	});

	describe("ACT.layersList play & stop", function() {

		var layersList;

		var layersConfig = {
			mpu: {
				layerName: 'mpu',
				type: 'inline',
				base: "act-ad",
				x: 0,
				y: 0,
				width: 300,
				height: 250,
				contentLayer: {}
			},
			floating: {
				layerName: 'floating',
				type: 'overlay',
				base: 'body',
				x: 0,
				y: 0,
				frame: true,
				width: 600,
				height: 250,
				contentLayer: {}
			}
		};

		before(function() {

			layersList = new ACT.LayersList({
				layersConfig: layersConfig,
				sDarlaAPI: null,
				envToPlay: "html",
				status: {}
			});

		});

		after(function(){
			layersList.destroy();
		});

		it("should fire a standard layer open event", function(done) {

			var handlerPlayed = ACT.Event.on('layer:played', function(e) {
				handlerPlayed.remove();

				expect(e.layerName).to.equal('mpu');

				done();
			});

			ACT.Event.fire('layersList:open', {
				layerToOpen: 'mpu'
			});

		});

		it("should not play layer when it is already playing", function(done) {

			sinon.spy(layersList, 'playLayer');
			sinon.stub(layersList, 'isLayerPlaying', function(layerName){
				return true;
			});

			var handlerPlayed =  ACT.Event.on('complete:action', function(eventId) {
				handlerPlayed.remove();

				expect(layersList.isLayerPlaying.calledWith('mpu')).to.be.true;
				expect(layersList.playLayer.callCount).to.equal(0);

				layersList.playLayer.restore();
				layersList.isLayerPlaying.restore();
				done();
			});

			ACT.Event.fire('layersList:open', {
				layerToOpen: 'mpu'
			});

		});

		it("should fire a standard layer close event", function(done) {

			sinon.stub(layersList, 'isLayerPlaying', function(layerName){
				return true;
			});

			var stopLayerEvent = ACT.Event.on('layer:stopped', function(event) {
				stopLayerEvent.remove();

				expect(layersList.isLayerPlaying.calledWith('mpu')).to.be.true;
				expect(event.layerName).to.equal('mpu');

				layersList.isLayerPlaying.restore();

				done();
			});

			ACT.Event.fire('layersList:stop', {
				layerToStop: 'mpu',
				destroy: 'false'
			});

		});

		it("should fire a play all layers open event", function(done) {

			var playAllEvent = ACT.Event.on('add:actions', function(actions) {
				playAllEvent.remove();

				expect(actions).is.instanceOf(Array);
				expect(actions[0].type).is.equal('playLayer');

				done();
			});

			ACT.Event.fire('layersList:playAllLayers');

		});

		it("should fire a stop all layers close event", function(done) {

			var stopAllEvent = ACT.Event.on('add:actions', function(actions) {
				stopAllEvent.remove();

				expect(actions).is.instanceOf(Array);
				expect(actions[0].type).is.equal('stopLayer');

				done();
			});

			ACT.Event.fire('layersList:stopAllLayers');

		});

	});

	describe("ACT.layersList darla play & stop", function() {

		var layersList;

		var layersConfig = {
			mpu: {
				layerName: 'mpu',
				type: 'inline',
				base: "act-ad",
				x: 0,
				y: 0,
				width: 300,
				height: 250,
				contentLayer: {}
			},
			floating: {
				layerName: 'floating',
				type: 'overlay',
				base: 'body',
				x: 0,
				y: 0,
				frame: true,
				width: 600,
				height: 250,
				contentLayer: {}
			}
		};

		before(function() {

			layersList = new ACT.LayersList({
				layersConfig: layersConfig,
				sDarlaAPI: sDarlaAPI,
				envToPlay: "html",
				status: {}
			});

		});

		after(function(){
			layersList.destroy();
		});

		it("should play and stop for a darla layers", function(done) {


			var layerStoppedEvent = ACT.Event.on('complete:action', function(r) {
				layerStoppedEvent.remove();
				done();
			});

			var layerPlayedEvent = ACT.Event.on('layer:played', function(r) {
				layersList.stopLayer('floating', 1);
				layerPlayedEvent.remove();
			});

			layersList.playLayer('floating', 1);

		});

	});

	describe("ACT.layersList standard layer positioning", function() {

		var layersList;

		var layersConfig = {
			mpu: {
				layerName: 'mpu',
				type: 'inline',
				base: "act-ad",
				x: 0,
				y: 0,
				width: 300,
				height: 250,
				contentLayer: {}
			},
			floating: {
				layerName: 'floating',
				type: 'overlay',
				base: 'body',
				x: 0,
				y: 0,
				frame: true,
				width: 600,
				height: 250,
				contentLayer: {}
			}
		};

		before(function() {

			layersList = new ACT.LayersList({
				layersConfig: layersConfig,
				sDarlaAPI: null,
				envToPlay: "html",
				status: {}
			});

		});

		after(function(){
			layersList.destroy();
		});

		it("should get layer top left position", function(done) {

			var layerPositionEvent = ACT.Event.on('layersList:getLayerPosition:complete', function(e) {
				expect(e.layerName).is.equal('floating');

				expect(e.newValue.x).is.equal(300);
				expect(e.newValue.y).is.equal(800);


				layerPositionEvent.remove();
				done();
			});

			layersList.getLayerPosition('floating', 'tl', {
				x: 'get:mpu:x',
				y: 'get:mpu:y'
			});


		});

		it("should get layer bottom right position", function(done) {

			var layerPositionEvent = ACT.Event.on('layersList:getLayerPosition:complete', function(e) {
				expect(e.layerName).is.equal('floating');
				expect(e.newValue.x).is.equal(0);
				expect(e.newValue.y).is.equal(800);
				layerPositionEvent.remove();
				layersList.destroy();
				done();
			});

			layersList.getLayerPosition('floating', 'br', {
				x: 'get:mpu:x',
				y: 'get:mpu:y'
			});

		});
	});

	describe("ACT.layersList darla layer positioning", function() {

		var layersList;

		var layersConfig = {
			mpu: {
				layerName: 'mpu',
				type: 'inline',
				base: "act-ad",
				x: 0,
				y: 0,
				width: 300,
				height: 250,
				contentLayer: {}
			},
			floating: {
				layerName: 'floating',
				type: 'overlay',
				base: "body",
				x: 0,
				y: 0,
				frame: true,
				width: 600,
				height: 250,
				contentLayer: {}
			}
		};

		before(function() {

			layersList = new ACT.LayersList({
				layersConfig: layersConfig,
				sDarlaAPI: sDarlaAPI,
				envToPlay: "html",
				status: {}
			});

		});

		after(function(){
			layersList.destroy();
		});

		it("should get layer top left position", function(done) {

			var layerPositionEvent = ACT.Event.on('layersList:getLayerPosition:complete', function(e) {
				layerPositionEvent.remove();
				layersList.destroy();
				expect(e.layerName).is.equal('floating');
				expect(e.newValue.x).is.equal(21);
				expect(e.newValue.y).is.equal(11);
				done();
			});

			layersList.getLayerPosition('floating', 'tl', {
				x: 'get:mpu:x',
				y: 'get:mpu:y'
			});

		});

	});

	describe("ACT.layersList test if layer exists", function() {

		var layersList;

		var layersConfig = {
			mpu: {
				layerName: 'mpu',
				type: 'inline',
				base: "act-ad",
				x: 0,
				y: 0,
				width: 300,
				height: 250,
				contentLayer: {}
			},
			floating: {
				layerName: 'floating',
				type: 'overlay',
				base: "body",
				x: 0,
				y: 0,
				frame: true,
				width: 600,
				height: 250,
				contentLayer: {}
			}
		};

		before(function() {

			layersList = new ACT.LayersList({
				layersConfig: layersConfig,
				sDarlaAPI: sDarlaAPI,
				envToPlay: "html",
				status: {}
			});

		});

		after(function(){
			layersList.destroy();
		});

		it("should test mpu", function() {

			var layerExists = layersList.checkLayerExists('mpu');
			expect(layerExists).is.equal(true);

		});
		it("should test floating", function() {

			var layerExists = layersList.checkLayerExists('floating');
			expect(layerExists).is.equal(true);

		});

		it("should test floating with event", function(done) {

			var handleLayerExits = ACT.Event.on("layersList:existLayerResult", function(e){
				handleLayerExits.remove();
				expect(e).is.equal(true);
				layersList.destroy();
				done();
			});

			ACT.Event.fire('layersList:existLayer', {
				layerName: "floating"
			});

		});

	});

	describe("ACT.layersList response to reSize event", function() {

		var layersList;

		var layersConfig = {
			mpu: {
				layerName: 'mpu',
				type: 'inline',
				base: "act-ad",
				x: 0,
				y: 0,
				width: 300,
				height: 250,
				contentLayer: {}
			},
			floating: {
				layerName: "floating",
				type: "overlay",
				base: "body",
				onResize: "refresh",
				x: 0,
				y: 0,
				frame: true,
				width: 600,
				height: 250,
				contentLayer: {}
			}
		};

		before(function() {

			layersList = new ACT.LayersList({
				layersConfig: layersConfig,
				sDarlaAPI: null,
				envToPlay: "html",
				status: {}
			});

		});

		after(function(){
			layersList.destroy();
		});

		it("should refresh the layer when resize layer attribute is set to resize and resize status changes", function(done) {

			var status={
				screenWidth: 0,
				screenHeight: 0,
				orientation: 'P'
			};

			var resizeScreen = ACT.Event.on('add:actions', function(actions) {
				resizeScreen.remove();

				expect(actions.length).to.equal(2);
				expect(actions[0].from).to.equal('floating');

				done();
			});

			var layerPlayedEvent = ACT.Event.on('layer:played', function(r) {
				layerPlayedEvent.remove();

				setTimeout(function() {
					ACT.Event.fire('screen:status', status);
				}, 10);

			});

			layersList.playLayer('floating');

		});

	});

	describe("ACT.layersList test the arguments sent in the actions", function() {
		var layersList, playLayer, stopLayer;

		var layersConfig = {
			mpu: {
				layerName: 'mpu',
				type: 'inline',
				base: "act-ad",
				x: 0,
				y: 0,
				width: 300,
				height: 250,
				contentLayer: {}
			},
			floating: {
				layerName: 'floating',
				type: 'overlay',
				base: "body",
				x: 0,
				y: 0,
				frame: true,
				width: 600,
				height: 250,
				contentLayer: {}
			}
		};

		before(function(done){
			sinon.stub(ACT.Event, 'fire', function(event, data){
				if(event === "register:Actions"){
					playLayer = data[0].argument;
					stopLayer = data[1].argument;
					done();
				}
			});

			layersList = new ACT.LayersList({
				layersConfig: layersConfig,
				sDarlaAPI: null,
				envToPlay: "html",
				status: {}
			});

		});

		after(function(){
			ACT.Event.fire.restore();
			layersList.destroy();
		});

		it("should return true against valid arguments", function(){

			expect(playLayer.timeout.test("10")).to.be.true;
			expect(playLayer.timeout.test(10)).to.be.true;
			expect(playLayer.timeout.test(undefined)).to.be.true;
			expect(playLayer.timeout.test(null)).to.be.true;

			expect(stopLayer.timeout.test("10")).to.be.true;
			expect(stopLayer.timeout.test(10)).to.be.true;
			expect(stopLayer.timeout.test(undefined)).to.be.true;
			expect(stopLayer.timeout.test(null)).to.be.true;

		});

		it("should return false against invalid arguments", function(){

			expect(playLayer.timeout.test("test")).to.be.false;
			expect(stopLayer.timeout.test("test")).to.be.false;

		});

	});
});