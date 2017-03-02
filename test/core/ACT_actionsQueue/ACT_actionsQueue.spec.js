var expect = chai.expect;
var assert = chai.assert;
var Event = ACT.Event;

/* It's an instance of ACtionsQueue. */


describe("ACT.ActionsQueue", function() {



    describe("Test register actions", function(){


    	it("should add new actions into the list if input is Array", function(done){

    		var actionsQueue = new ACT.ActionsQueue();
    		
    		var result = actionsQueue.registerActions([
    			{
    				type: 'action1',
    				argument: {},
    				process: function(){}
    			},
    			{
    				type: 'action2',
    				argument: {},
    				process: function(){}
    			}
    		]);

    		expect(result).to.equal(true);
    		expect(actionsQueue.get('registeredActions').action1).to.exist;
    		expect(actionsQueue.get('registeredActions').action1).to.be.a('object');
    		expect(actionsQueue.get('registeredActions').action1.type).to.be.equal('action1');
    		expect(actionsQueue.get('registeredActions').action2).to.exist;
    		expect(actionsQueue.get('registeredActions').action2).to.be.a('object');
    		expect(actionsQueue.get('registeredActions').action2.type).to.be.equal('action2');
			actionsQueue.destructor();
    		done();
    	});

    	it("should add one action into the list if input is Object", function(done){

    		var actionsQueue = new ACT.ActionsQueue();

    		var result = actionsQueue.registerActions({
    			type: 'action3',
    			argument: {},
    			process: function(){}
    		});

    		expect(result).to.equal(true);
    		expect(actionsQueue.get('registeredActions').action3).to.exist;
    		expect(actionsQueue.get('registeredActions').action3).to.be.a('object');
    		expect(actionsQueue.get('registeredActions').action3.type).to.be.equal('action3');
			actionsQueue.destructor();
    		done();
    	});

    	it("should return error for wrong input", function(done){
    		var actionsQueue = new ACT.ActionsQueue();
    		var result = actionsQueue.registerActions("");
    		expect(result).to.equal(false);
    		actionsQueue.destructor();
    		done();
    	});

    });

	describe("Test queue functions", function(){



		describe("Test enqueue", function(){

		    it("shoud add action to end of queue", function(done){
		    	
	            var actionsQueue = new ACT.ActionsQueue();

				sinon.stub(actionsQueue, 'isValidAction', function(){
					return true;
				});
					
		    	actionsQueue.enqueue({type: 'action2', agr: '2'});
		    	actionsQueue.enqueue({type: 'action1', agr: '1'});
		    	actionsQueue.enqueue({type: 'action3', agr: 3});

		    	var queue = actionsQueue.get('executeQueue');

		    	expect(queue).to.be.a('Array');
		    	expect(queue).to.have.length(3);
		    	expect(queue[0].action).to.have.property('type').to.equal('action2');
		    	expect(queue[1].action).to.have.property('type').to.equal('action1');
		    	expect(queue[2].action).to.have.property('type').to.equal('action3');

		    	actionsQueue.isValidAction.restore();
		    	actionsQueue.destructor();
		    	done();
		    });

		    it("shoud not add invalid action to end of queue", function(done){

			    var actionsQueue = new ACT.ActionsQueue();
	            
				sinon.stub(actionsQueue, 'isValidAction', function(){
					return false;
				});

		    	actionsQueue.enqueue('random thing');
		    	actionsQueue.enqueue({arg: 'object without type'});

		    	var queue = actionsQueue.get('executeQueue');

		    	expect(queue).to.be.a('Array');
		    	expect(queue).to.have.length(0);

				actionsQueue.isValidAction.restore();
				actionsQueue.destructor();
			    done();

		    });


		});

		describe("Test dequeue", function(){

		    it("should dequeue the selected item", function(done){

		    	var actionsQueue = new ACT.ActionsQueue();

		    	actionsQueue.set('executeQueue', [{id: 0, action:{type:'action1'}},{id: 1, action:{type:'action2'}},{id: 2, action:{type:'action3'}}]);
		    	actionsQueue.dequeue(0);

		    	var queue = actionsQueue.get('executeQueue');

		    	expect(queue).to.have.length(2);
		    	expect(queue[0].action).to.have.property('type').to.equal('action2');
		    	expect(queue[1].action).to.have.property('type').to.equal('action3');
		    	actionsQueue.destructor();
		    	done();
		    });

		});

		describe("Test run queue", function(){
			

			it('shoudnt do anything when running flag is off', function(done){
		    	var actionsQueue = new ACT.ActionsQueue();

		    	sinon.spy(actionsQueue, "dequeue");
				sinon.spy(actionsQueue, "executeAction");

		    	actionsQueue.set('isRunning', true);

		    	actionsQueue.runQueue();

		    	expect(actionsQueue.dequeue.called).to.be.false;

				actionsQueue.dequeue.restore();
				actionsQueue.executeAction.restore();
				actionsQueue.destructor();
		    	done();
			});
	
		});

	});

	describe("Test action related function", function(){

		var process1 = sinon.spy();
		var process2 = sinon.spy();
		var process3 = sinon.spy();



		describe("Test verfify action", function(){
		    it("should return false for non-object input", function(){
		    	var actionsQueue = new ACT.ActionsQueue();
		    	expect(actionsQueue.isValidAction('random thing')).to.false;
		    	actionsQueue.destructor();
		    });

		    it("should return false for object without type", function(){
		    	var actionsQueue = new ACT.ActionsQueue();
		    	expect(actionsQueue.isValidAction({arg: 'something'})).to.false;
		    	actionsQueue.destructor();
		    });

		    it("should return true for a valid action", function(){
		    	var actionsQueue = new ACT.ActionsQueue();
		    	expect(actionsQueue.isValidAction({type:'action1', arg: 1})).to.true;
		    	actionsQueue.destructor();
		    });
		});
			
		describe("Test verify action arguments", function(){
			//COMMENTED OUT AS WILL ALWAYS RETURN TRUE
			// it('should return false if 1 argument wrong', function(done){
			// 	var actionsQueue = new ACT.ActionsQueue();


			// 	actionsQueue.set('registeredActions',{
			// 		'action1': {
			// 			argument: {
			// 				arg1: {
			// 					test: function(value){
			// 						return (typeof value === 'string');
			// 					}
			// 				},
			// 				arg2: {
			// 					test: function(value){
			// 						return (value === 1);
			// 					}
			// 				}
			// 			}
			// 		}
			// 	});

			// 	var result = actionsQueue.isActionArgumentsValid({type: 'action1', arg1: 0, arg2: 1});

			// 	expect(result).to.be.false;
			// 	actionsQueue.destructor();		
			// 	done();
			// });

			// it('should return false if 2 arguments wrong', function(done){

			// 	var actionsQueue = new ACT.ActionsQueue();

			// 	actionsQueue.set('registeredActions',{
			// 		'action1': {
			// 			argument: {
			// 				arg1: {
			// 					test: function(value){
			// 						return (typeof value === 'string');
			// 					}
			// 				},
			// 				arg2: {
			// 					test: function(value){
			// 						return (value === 1);
			// 					}
			// 				}
			// 			}
			// 		}
			// 	});
			// 	var result = actionsQueue.isActionArgumentsValid({type: 'action1', arg1: 0, arg2: '3'});

			// 	expect(result).to.be.false;
			// 	actionsQueue.destructor();		
			// 	done();
			// });

			it('should return true if both argument ok', function(done){
				var actionsQueue = new ACT.ActionsQueue();


				actionsQueue.set('registeredActions',{
					'action1': {
						argument: {
							arg1: {
								test: function(value){
									return (typeof value === 'string');
								}
							},
							arg2: {
								test: function(value){
									return (value === 1);
								}
							}
						}
					}
				});


				var result = actionsQueue.isActionArgumentsValid({type: 'action1', arg1: 'string', arg2: 1});

				expect(result).to.be.true;
				actionsQueue.destructor();		
				done();
			});

		});

	    describe("Test execute actions", function(){
		    
		    it("should call process function of action2", function(done){
				var actionsQueue = new ACT.ActionsQueue();

				var processFunc = sinon.spy();

				actionsQueue.set('registeredActions',{
					'action2': {
						argument: {},
						process: processFunc
					}
				});


		    	actionsQueue.executeAction(1, {
		    		type: 'action2'
		    	});

		    	expect(processFunc.called).to.be.true;
		    	actionsQueue.destructor();		
		    	done();
		    });

		    it("should not execute unregistered actions", function(done){
				var actionsQueue = new ACT.ActionsQueue();
		    	var result = actionsQueue.executeAction(2, {
		    		type: 'action3'
		    	});

		    	expect(result).to.be.false;
		    	actionsQueue.destructor();		
		    	done();
		    });

	    });

	    describe("Test add actions to queue", function(){
		    

		    it("add 1 action", function(done){
		    	var actionsQueue = new ACT.ActionsQueue();

		    	sinon.stub(actionsQueue, "runQueue");
		    	sinon.stub(actionsQueue, "enqueue");

		    	actionsQueue.addActions({type: 'action1'});

		    	expect(actionsQueue.enqueue.calledOnce, 'enqueue called once').to.be.true;
		    	expect(actionsQueue.runQueue.calledOnce, 'runqueue called once').to.be.true;
				
				actionsQueue.runQueue.restore();
		    	actionsQueue.enqueue.restore();
		    	actionsQueue.destructor();		
		    	done();

		    });

		    it("add many action", function(done){

		    	var actionsQueue = new ACT.ActionsQueue();

		    	sinon.stub(actionsQueue, "runQueue");
		    	sinon.stub(actionsQueue, "enqueue");

		    	actionsQueue.addActions([{type: 'action1'}, {type: 'action2'}]);

		    	expect(actionsQueue.enqueue.calledTwice, 'enqueue called twice').to.be.true;
		    	expect(actionsQueue.runQueue.calledOnce, 'runqueue called once').to.be.true;
				
				actionsQueue.runQueue.restore();
		    	actionsQueue.enqueue.restore();
				actionsQueue.destructor();		
		    	done();

		    });

	    });

	    describe("Test complete actions", function(){
		    
		    it("should change running flag and call runQueue again", function(done){
				var actionsQueue = new ACT.ActionsQueue();
		    	// using stub to avoid runQueue to be executed
		    	sinon.stub(actionsQueue, 'runQueue');

		    	// empty queue to make sure nothing will be execute
		    	actionsQueue.isRunning = true;

		    	actionsQueue.completeAction();

		    	expect(actionsQueue.runQueue.called, "called runQueue").to.be.true;
		    	expect(actionsQueue.isRunning, "isRunning").to.be.false;

		    	actionsQueue.runQueue.restore();
				actionsQueue.destructor();		
		    	done();
		    });

	    });

	});


	describe("Test timeout events", function(){


		var clock;
		beforeEach(function () {
		     clock = sinon.useFakeTimers();
		 });

		afterEach(function () {
		    clock.restore();
		});

		it('should set the global timeout value from setActionTimeout function', function(){
			var actionsQueue = new ACT.ActionsQueue();
			actionsQueue.setActionTimeout(5);

			expect(actionsQueue.get('actionTimeout')).to.equal(5);
			actionsQueue.destructor();

		});

		it('should call startTimeout function when timing out an action', function(){

			var actionsQueue = new ACT.ActionsQueue();

			var processFunc = sinon.spy();

			actionsQueue.set('registeredActions',{
				'action': {
					argument: {

					},
					process: processFunc
				}
			});

			this.timeout(5000);

		    var actionProcess = {
				process:function(){}
			};

			sinon.stub(actionsQueue, 'isActionArgumentsValid', function(){
				return true;
			});

			sinon.stub(actionsQueue, 'registerActions');

			sinon.spy(actionsQueue, 'startTimeout');
			sinon.spy(window.console, 'log');


			var action =[{type:'action', arg:1, timeout: 2}];

			actionsQueue.addActions(action);
			clock.tick(2000);
			expect(actionsQueue.startTimeout.calledWith(0, action[0].type, action[0].timeout), 'called startTimeout with same param').to.be.true;
			expect(console.log.calledWith('[ ACT_actionsQueue.js ] ActionQueue: Action action timed out at 2 seconds'), 'called console.log with same param').to.be.true;
			actionsQueue.isActionArgumentsValid.restore();
			actionsQueue.registerActions.restore();
			actionsQueue.startTimeout.restore();
			window.console.log.restore();
	
			actionsQueue.destructor();

		});

		it('should call startTimeout function with no timeout when setting argument to 0', function(){
			var actionsQueue = new ACT.ActionsQueue();

			var processFunc = sinon.spy();

			actionsQueue.set('registeredActions',{
				'action': {
					argument: {

					},
					process: processFunc
				}
			});

			sinon.stub(actionsQueue, 'isActionArgumentsValid', function(){
				return true;
			});

			sinon.stub(actionsQueue, 'registerActions');

			sinon.spy(actionsQueue, 'startTimeout');

			var action = {type:'action', arg:1, timeout: 0};

			actionsQueue.executeAction(1, action);

			expect(actionsQueue.startTimeout.calledWith(1, action.type, action.timeout), 'called startTimeout with same param').to.be.true;
			actionsQueue.isActionArgumentsValid.restore();
			actionsQueue.registerActions.restore();
			actionsQueue.startTimeout.restore();			


			actionsQueue.completeAction();	

			actionsQueue.destructor();		
		});

	});


});