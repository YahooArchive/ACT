var expect = chai.expect;
var assert = chai.assert;

var Event = ACT.Event;
var Lang = ACT.Lang;

describe("ACT_contentAdobeEdge", function() {

	before(function(){
		// stub AdobeEdge
		AdobeEdge = {
			loadComposition: sinon.stub(),
			bootstrapCallback: function(){return;},
			getComposition: function(){return;}
		};

	});

	it('should available for creating instance', function(){

		expect(ACT.ContentAdobeEdge).is.exist;

	});

	describe('create new instance', function(){
		var content;

		before(function(){
			sinon.stub(Event, 'on', function(){
				return {
					remove: function(){}
				}
			});

			content = new ACT.ContentAdobeEdge({
				id: 'content_id',
				adobeEdgeConfig: {
					compositionId: 'EDGE_112312321',
					compositionLink: 'composition_link'
				},
				eventConfig: [{
					eventType: 'onEventTrigger',
					actions: [{
						type: 'action1',
						param1: 'param'
					}, {
						type: 'action2',
						param2: 'param2'
					}]
				}],
				css: 'test'
			});

		});

		after(function(){
			Event.on.restore();

			content.destroy();
		});

		it('should be instance of ContentAdobeEdge class', function(done){
			assert.instanceOf(content, ACT.ContentAdobeEdge);
			done();
		});

		it('should listen to ContentAdobeEdge:action event', function(done){
			assert.isTrue(Event.on.calledWith('ContentAdobeEdge:actions', sinon.match.func));
			done();
		});

		it('should have eventActions data based on configObject', function(done){

			var eventActions = content.get('eventActions');
			assert.isObject(eventActions, 'eventActions must be object');
			assert.property(eventActions, 'onEventTrigger', 'must have onEventTrigger property');
			assert.isArray(eventActions.onEventTrigger, 'onEventTrigger must be array');
			assert.equal(eventActions.onEventTrigger.length, 2, 'onEventTrigger must have 2 items');
			assert.isObject(eventActions.onEventTrigger[0], 'onEventTrigger first item must be object');
			assert.equal(eventActions.onEventTrigger[0].type, 'action1', 'onEventTrigger first item type test');
			assert.equal(eventActions.onEventTrigger[0].param1, 'param', 'onEventTrigger first item param test');
			assert.isObject(eventActions.onEventTrigger[1], 'onEventTrigger second item must be object');
			assert.equal(eventActions.onEventTrigger[1].type, 'action2', 'onEventTrigger second item type test');
			assert.equal(eventActions.onEventTrigger[1].param2, 'param2', 'onEventTrigger second item param test');

			done();
		});
		it("should return true against valid action arguments", function(done){

			var content;

			Event.originalEventFire = Event.fire;
			sinon.stub(Event, 'fire', function(event, data){

				if (event === 'register:Actions'){

					var replayAdobeEdgeComposition = data[0].argument;

					expect(replayAdobeEdgeComposition.instanceId.test("id")).to.be.true;
					expect(replayAdobeEdgeComposition.timeout.test(10)).to.be.true;
					expect(replayAdobeEdgeComposition.timeout.test("10")).to.be.true;
					expect(replayAdobeEdgeComposition.timeout.test(null)).to.be.true;
					expect(replayAdobeEdgeComposition.timeout.test(undefined)).to.be.true;

					Event.fire.restore();	
					done();

                } else {
                    Event.originalEventFire(event, data);
                }
				
					
			});
		
			content = new ACT.ContentAdobeEdge({
				id: 'content_id',
				adobeEdgeConfig: {
					compositionId: 'EDGE_112312321', 
					compositionLink: 'composition_link'
				},
				eventConfig: [{
					eventType: 'onEventTrigger',
					actions: [{
						type: 'action1',
						param1: 'param'
					}, {
						type: 'action2',
						param2: 'param2'
					}]
				}],
				css: 'test'
			});

		});

		it("should return false against invalid action arguments", function(done){

			var content;

			Event.originalEventFire = Event.fire;
			sinon.stub(Event, 'fire', function(event, data){

				if (event === 'register:Actions'){

					var replayAdobeEdgeComposition = data[0].argument;

					expect(replayAdobeEdgeComposition.instanceId.test(10)).to.be.false;
					expect(replayAdobeEdgeComposition.instanceId.test(null)).to.be.false;
					expect(replayAdobeEdgeComposition.instanceId.test(undefined)).to.be.false;					
					expect(replayAdobeEdgeComposition.timeout.test("test")).to.be.false;
					Event.fire.restore();	
					done();
					
                } else {
                    Event.originalEventFire(event, data);
                }
				
					
			});
		
			content = new ACT.ContentAdobeEdge({
				id: 'content_id',
				adobeEdgeConfig: {
					compositionId: 'EDGE_112312321', 
					compositionLink: 'composition_link'
				},
				eventConfig: [{
					eventType: 'onEventTrigger',
					actions: [{
						type: 'action1',
						param1: 'param'
					}, {
						type: 'action2',
						param2: 'param2'
					}]
				}],
				css: 'test'
			});

		});
	});

	describe('render content', function(){
		var content, node;

		before(function(){
			sinon.stub(Event, 'on', function(){
				return {
					remove: function(){}
				}
			});

			content = new ACT.ContentAdobeEdge({
				id: 'content_id',
				classNode: 'adobe_edge_content',
				adobeEdgeConfig: {
					compositionId: 'EDGE_112312321',
					compositionLink: 'composition_link'
				},
				css: {
					position: 'relative'
				}
			});
		});

		after(function(){
			Event.on.restore();
			content.destroy();
		});

		it('should load AdobeEdge composition', function(done){
			
			sinon.stub(document, 'getElementById', function(){ return true; });
			sinon.stub(window, 'setInterval', function(callback){ callback(); });

			/*
			 * Need to move this here, the content will be generated in a fake way as before
			 * but isolated between to sinon stub faking 'setInterval' and 'getElementById'
			 */
			node = content.getContent().node;

			assert.isTrue(AdobeEdge.loadComposition.calledWith('composition_link', 'EDGE_112312321'));

			document.getElementById.restore();
			window.setInterval.restore();

			done();

		});

		it('should have a className', function(done){
			assert.equal(node.className, ' adobe_edge_content EDGE_112312321');
			done();
		});

		it('should have div wrapper', function(done){
			assert.equal(node.tagName, 'DIV');
			done();
		});

	});
	describe('event trigger', function(){
		
		var content, composition, playAll = sinon.spy();

		before(function() {

			composition = {
				getStage: function(){
					return {
						playAll: playAll
					}
				}
			};

			AdobeEdge.getComposition = function() {
				return composition;
			}
			AdobeEdge.bootstrapCallback = function(callback) {
				callback('EDGE_112312321');
			}

			content = new ACT.ContentAdobeEdge({
				id: 'content_id',
				adobeEdgeConfig: {
					compositionId: 'EDGE_112312321',
					compositionLink: 'composition_link'
				},
				eventConfig: [{
					eventType: 'onEventTrigger',
					actions: [{
						type: 'action1',
						param1: 'param'
					}, {
						type: 'action2',
						param2: 'param2'
					}]
				}]
			});

		});

		after(function(){
			content.destroy();
		});

		it('should add actions to queue when receive right trigger with right composition id', function(done){

			var listener = Event.on('add:actions', function(eventData){

				listener.remove();

				assert.isArray(eventData);
				assert.isObject(eventData[0]);
				assert.equal(eventData[0].type, 'action1');
				assert.equal(eventData[0].param1, 'param');
				assert.isObject(eventData[1]);
				assert.equal(eventData[1].type, 'action2');
				assert.equal(eventData[1].param2, 'param2');

				done();

			});

			Event.fire('ContentAdobeEdge:actions',{
				compositionId: 'EDGE_112312321',
				eventType: 'onEventTrigger'
			});

		});

		it('should not add actions to queue if composition id is not match', function(done){
			
			var eventCalled = true;
			var listener = Event.on('add:actions', function(eventData) {
				listener.remove();
				eventCalled = true;
			});

			var contentAdobeEdgeActions = Event.on('ContentAdobeEdge:actions', function() {
				contentAdobeEdgeActions.remove();
				eventCalled = false;
			});

			Event.fire('ContentAdobeEdge:actions',{
				compositionId: 'EDGE_OTHERONE',
				eventType: 'onEventTrigger'
			});

			assert.isFalse(eventCalled, 'add:action must be called');
			done();
		});

		it('should not add actions to queue if eventType is not exist', function(done) {

			var eventCalled = true;
			var listener = Event.on('add:actions', function(eventData) {
				listener.remove();
				eventCalled = true;
			});

			var contentAdobeEdgeActions = Event.on('ContentAdobeEdge:actions', function() {
				contentAdobeEdgeActions.remove();
				eventCalled = false;
			});

			Event.fire('ContentAdobeEdge:actions',{
				compositionId: 'EDGE_112312321',
				eventType: 'onEventTriggerAnotherone'
			});

			assert.isFalse(eventCalled, 'add:action must be called');
			done();
		});

		it('should do replay when receive event replayContent', function(done) {

			sinon.stub(document, 'getElementById', function(){ return true; });
			sinon.stub(window, 'setInterval', function(callback){ callback(); });

			content.getContent();

			Event.fire('ContentAdobeEdge:replay', {
				instanceId: 'content_id'
			});
			
			expect(playAll.calledOnce).to.be.true;
			document.getElementById.restore();
			window.setInterval.restore();

			done();
		});
	});

});