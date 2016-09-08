/* global describe, it, before, after, chai, sinon, ACT */
'use strict';

describe("ACT.Class", function(){
	var expect = chai.expect;

	it('should exist', function(){
		expect(ACT.Class).to.exist;
	});

	describe('instance', function(){
		var classInstance, mockEventRemove;

		before(function(){
			classInstance = new ACT.Class({});
			mockEventRemove = sinon.spy();
		});

		after(function(){});

		describe('initialized', function(){
			before(function(){
				sinon.spy(classInstance, 'initializer');

				classInstance.init({});
			});

			after(function(){
				classInstance.initializer.restore();
			});

			it('should call initializer method', function(){
				expect(classInstance.initializer.calledWith(sinon.match.object), 'initializer must be called').to.be.true;
			});

			it('should have correct attributes', function(){
				expect(classInstance.get('NAME'), 'name must be class').to.deep.equal('Class');
				expect(classInstance.get('eventList'), 'eventList must be empty array').to.have.length(0);
			});

			it('should be able to set group of new attributes', function(){
				classInstance.setAttrs({
					attr1: '1',
					attr2: {
						sub1: [],
						sub2: 'asd'
					}
				});

				expect(classInstance.get('attr1'), 'attr1 value must be correct').to.deep.equal('1');
				expect(classInstance.get('attr2'), 'attr2 value must be correct').to.deep.equal({sub1: [],sub2: 'asd'});
			});

			it('should be able to register event listeners', function(){
				classInstance.addEventListeners('1', {remove: mockEventRemove}, '2');

				expect(classInstance.get('eventList'), 'eventList must have 3 items').to.have.length(3);
				expect(classInstance.get('eventList')[0], 'eventList first item').to.deep.equal('1');
				expect(classInstance.get('eventList')[2], 'eventList third item').to.deep.equal('2');
				expect(classInstance.get('eventList')[1], 'eventList second item').to.have.ownProperty('remove');
			});
		});

		describe('destroy', function(){
			before(function(){
				sinon.spy(classInstance, 'destructor');

				classInstance.destroy();
			});

			after(function(){
				classInstance.destructor.restore();
			});

			it('should call destructor method', function(){
				expect(classInstance.destructor.called, 'destructor must be called').to.be.true;
			});

			it('should delete all registed events', function(){
				// add some fake event listeners
				expect(classInstance.get('eventList'), 'eventList must be empty').to.have.length(0);
				expect(mockEventRemove.calledOnce, 'event listener remove function must be called').to.be.true;
			});
		});
	});

});