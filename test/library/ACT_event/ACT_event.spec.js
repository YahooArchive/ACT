var expect = chai.expect;
var assert = chai.assert;

describe("ACT.Event", function() {

    it("should have ACT.Event instance", function () {
        expect(ACT.Event).to.exist;
        expect(ACT.Lang).to.exist;
    });

    it("Should to be a singleton", function(){
        var ev1 = ACT.Event;
        var ev2 = ACT.Event;
        expect(ev1).to.be.equal(ev2);
    });

    describe('isEventSupported', function() {

        it('should support click', function() {
            expect(ACT.Event.debugIsEventSupported('click')).to.be.true;
        });

        it('should not support boo', function() {
            expect(ACT.Event.debugIsEventSupported('boo')).to.be.false;
        });

        it("should support submit even passing empty array", function(){
            expect(ACT.Event.debugIsEventSupported('submit', [])).to.be.true;
        });

    });

    describe('addListener', function() {
        var el;

        beforeEach(function() {
            el = createDummyElement('addListener');
        });

        afterEach(function() {
            removeDummyElement('addListener');
        });

        it('should add listener without scope', function() {
            var res = ACT.Event.debugAddListener('click', function() {return 'listen';}, el);
            expect(res).to.exist;
            expect(res.element.id).to.equal('addListener');
            expect(res.fn()).to.equal('listen');
            expect(res.event).to.equal('click');
            expect(res.bound).to.equal(res.fn);
        });

        it('should add listener with scope', function() {
            var res = ACT.Event.debugAddListener('click', function() {return 'listen';}, el, this);
            expect(res).to.exist;
            expect(res.element.id).to.equal('addListener');
            expect(res.fn()).to.equal('listen');
            expect(res.event).to.equal('click');
            expect(res.bound).to.not.equal(res.fn);
        });

    });

/*
    describe('hOP', function() {

        it('should return false if listeners is empty', function() {
            ACT.Event.debugClearListeners();
            expect(ACT.Event.hOP('anything')).to.be.false;
        });

        it('should return false if listeners dont have value', function() {
            ACT.Event.debugSetListeners('anything2', 'value');
            expect(ACT.Event.hOP('anything')).to.be.false;
            ACT.Event.debugClearListeners();
        });

        it('should return true if listeners have value', function() {
            ACT.Event.debugSetListeners('anything', 'value');
            expect(ACT.Event.hOP('anything')).to.be.true;
            ACT.Event.debugClearListeners();
        });

    });
*/

    describe('on', function() {
        var el, el2;

        beforeEach(function() {
            el = createDummyElement('onTest');
            el2 = createDummyElement('onTest2');
        });

        afterEach(function() {
            removeDummyElement('onTest');
            removeDummyElement('onTest2');
        });

        it('should subscribe an event with on with native event', function() {
            var debugEventIndex = ACT.Event.debugEventIndex();
            var res = ACT.Event.on('click', function() {return 'onTest';}, el);
            var listeners = ACT.Event.debugGetListeners();
            expect(res).to.exist;
            expect(res.remove).to.exist;
            expect(listeners).to.exist;
            expect(listeners.click).to.exist;
            expect(listeners.click[debugEventIndex].fn()).to.equal('onTest');
            expect(listeners.click[debugEventIndex].element.id).to.equal('onTest');
        });


        it('should subscribe an event with on with native event against window', function() {
            var res = ACT.Event.on('resize', function() {return 'onTest';}, window);
            var listeners = ACT.Event.debugGetListeners();
            expect(res).to.exist;
            expect(res.remove).to.exist;
            expect(listeners).to.exist;
            expect(listeners.resize).to.exist;
        });

        it('should be able to run remove', function() {
        	var debugEventIndex = ACT.Event.debugEventIndex(); 
            var res = ACT.Event.on('click', function() {return 'onTest';}, el);
            var listeners = ACT.Event.debugGetListeners();
            expect(res).to.exist;
            expect(res.remove).to.exist;
            expect(listeners.click).to.exist;
            expect(res.remove()).to.not.throw;
            listeners = ACT.Event.debugGetListeners();
            expect(listeners.click[debugEventIndex]).to.be.a('undefined');
        });

        it('should subscribe a custom event with on', function() {
            var debugEventIndex = ACT.Event.debugEventIndex();
            var res = ACT.Event.on('customClick', function() {return 'onTest2';}, el);
            var listeners = ACT.Event.debugGetListeners();
            expect(res).to.exist;
            expect(res.remove).to.exist;
            expect(listeners).to.exist;
            expect(listeners.customClick).to.exist;
            expect(listeners.customClick[debugEventIndex].fn()).to.equal('onTest2');
        });

    });

    describe('addCSSListener', function() {
        var el;

        beforeEach(function() {
            el = createDummyElement('onTest');
        });

        afterEach(function() {
            removeDummyElement('onTest');
        });

        it('should listen for all events', function() {
            ACT.Event.addCSSListener('animationend', function() {return 'css listener';}, el);
            var listeners = ACT.Event.debugGetListeners();
            expect(listeners['animationend']).to.exist;
            expect(listeners['webkitanimationend']).to.exist;
            expect(listeners['mozanimationend']).to.exist;
            expect(listeners['msanimationend']).to.exist;
            expect(listeners['oanimationend']).to.exist;
        });

    });

    describe('removeListenerHelper', function() {
        var el;
        var fn;

        beforeEach(function() {
            el = createDummyElement('onTest');
            fn = function() { return 'testing'; };
        });

        afterEach(function() {
            removeDummyElement('onTest');
        });

        it('should remove event listener', function() {
            //test addEventListener
            ACT.Event.debugAddListener('click', fn, el);
            expect(ACT.Event.removeListenerHelper('click', fn, el)).to.not.throw;
        });

    });

    describe('ready', function() {

        it("ll", function(){

            var ready = function(){
                expect(ACT.Event.ready.isReady).to.be.true;
            };

            ACT.Event.ready(ready);

        });


    });

    describe('purgeListeners', function() {

        var el;
        var fn;

        beforeEach(function() {
            el = createDummyElement('onTest');
            fn = function() { return 'testing'; };
        });

        afterEach(function() {
            removeDummyElement('onTest');
        });

        it('should purge listener', function() {
            ACT.Event.debugAddListener('click', fn, el);
            expect(ACT.Event.purgeListeners(el)).to.not.throw;
        });

    });

    describe("attachEvent and detachEvent ", function(){

        var fn;
        var tmpW = window;

        beforeEach(function() {
            fn = function() { return 'testing'; };
            Object.getPrototypeOf(window).addEventListener = false;
            Object.getPrototypeOf(window).removeEventListener = false;

            Object.getPrototypeOf(window).attachEvent = true;
            Object.getPrototypeOf(window).detachEvent = true;
            ACT.Debug.log(window.addEventListener);
        });

        it('should attach and detach', function(done) {

            //test attachEvent
            var obj = {
                attachEvent: function (e, f) {},
                detachEvent: function(e, f){}
            };
            ACT.Event.debugAddListener('click', fn, obj);
            expect(ACT.Event.removeListenerHelper('click', fn, obj)).to.not.throw;

            done();
        });

        afterEach(function(){
            window = tmpW;
        });

    });

    describe('fire', function() {
        it ('should fire a custom event', function() {
            var debugEventIndex = ACT.Event.debugEventIndex();
            var res = ACT.Event.on('customClick', function() {return 'onTest2';}, null, this);
            var listeners = ACT.Event.debugGetListeners();
            expect(res).to.exist;
            expect(res.remove).to.exist;
            expect(listeners).to.exist;
            expect(listeners.customClick).to.exist;
            expect(listeners.customClick[debugEventIndex].fn()).to.equal('onTest2');
            expect(ACT.Event.fire('customClick')).to.not.throw;
        });
        
        it ('should fire custom event', function() {
            var env1 = new function() {
                return {
                    name: "name1",
                    change: function() {
                    	console.log("CHANGING NAME");
                        this.name = "changed1";
                    }
                }
            };
            var event = ACT.Event;
            event.on('customEvent', function() { this.change(); }, null, env1);
            event.fire('customEvent');
            expect(env1.name).to.equal("changed1");
        });

        it ('should fire custom event with different scopes', function() {
            var env1 = new function() {
                return {
                    name: "name1",
                    change: function() {
                        this.name = "changed1";
                    }
                }
            };
            var env2 = new function() {
                return {
                    name: "name2",
                    change: function() {
                        this.name = "changed2";
                    }
                }
            };
            var event = ACT.Event;
			var debugEventIndex = ACT.Event.debugEventIndex();
            event.on('customEvent', function() {console.log("inside callback1", this);this.name = "changed1";}, null, env1);
            var debugEventIndex2 = ACT.Event.debugEventIndex();
            event.on('customEvent', function() {console.log("inside callback2", this);this.name = "changed2";}, null, env2);
            event.fire('customEvent');
            var listeners = event.debugGetListeners();
            expect(listeners['customEvent'][debugEventIndex].scope.name).to.equal("changed1");
            expect(listeners['customEvent'][debugEventIndex2].scope.name).to.equal("changed2");
        });

        it ('should fire specific custom event with different scopes', function() {
            var env1 = new function() {
                return {
                    name: "name1"
                }
            };
            var env2 = new function() {
                return {
                    name: "name2"
                }
            };
            var event = ACT.Event;
            var debugEventIndex = ACT.Event.debugEventIndex();
            event.on('customEvent', function() {console.log("inside callback1", this);this.name = "changed1";}, null, env1);
            var debugEventIndex2 = ACT.Event.debugEventIndex();
            event.on('customEvent', function() {console.log("inside callback2", this);this.name = "changed2";}, null, env2);
            event.fire('customEvent', {scope: env1});
            var listeners = event.debugGetListeners();
            expect(listeners['customEvent'][debugEventIndex].scope.name).to.equal("changed1");
            expect(listeners['customEvent'][debugEventIndex2].scope.name).to.equal("name2");
        });

        it ('should fire specific custom event with different scopes', function() {
            var env1 = new function() {
                return {
                    name: "name1"
                }
            };
            var env2 = new function() {
                return {
                    name: "name2"
                }
            };
            var event = ACT.Event;
            var debugEventIndex = ACT.Event.debugEventIndex();
            event.on('customEvent', function() {console.log("inside callback1", this);this.name = "changed1";}, null, env1);
            var debugEventIndex2 = ACT.Event.debugEventIndex();
            event.on('customEvent', function() {console.log("inside callback2", this);this.name = "changed2";}, null, env2);
            event.fire('customEvent', {scope: env2});
            var listeners = event.debugGetListeners();
            expect(listeners['customEvent'][debugEventIndex].scope.name).to.equal("name1");
            expect(listeners['customEvent'][debugEventIndex2].scope.name).to.equal("changed2");
        });

    });

    describe('preventDefault', function() {

        it('should set returnValue to false when no preventDefault', function() {
            var fakeEvent = {};
            ACT.Event.preventDefault(fakeEvent);
            expect(fakeEvent.returnValue).to.be.false;
        });

        it('should call preventDefault when supported', function() {
            var fakeEvent = {preventDefault: function() {this.returnValue = true;}};
            ACT.Event.preventDefault(fakeEvent);
            expect(fakeEvent.returnValue).to.be.true;
        });

    });

});

function createDummyElement(id) {
    var iDiv = document.createElement('div');
    iDiv.id = id;
    document.getElementsByTagName('body')[0].appendChild(iDiv);
    return document.getElementById(id);
}

function removeDummyElement(id) {
    var iDiv = document.getElementById(id);
    if (iDiv) {
        document.getElementsByTagName('body')[0].removeChild(iDiv);
    }
}