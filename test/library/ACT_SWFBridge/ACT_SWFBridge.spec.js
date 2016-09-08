/*
UNIT TEST VALID FOR PHANTOMJS ONLY
*/

var expect = chai.expect;

describe('ACT.SWFBridge', function() {

    var sandbox;
    var SWFBridge = ACT.SWFBridge;

    before(function() {
        sandbox = sinon.sandbox.create();
        sandbox.spy(window.console, "log");
    });

    after(function() {
        sandbox.restore();
    });
     

    describe('swfAction function', function() {
        it('should output a log', function() {
            SWFBridge.swfAction('clickTag', 2);
            expect(console.log.called).to.be.true;
            sinon.assert.calledWith(console.log, "SWFBridge: label, number: ", "clickTag", 2);
        });
    });

    describe('callSWF function', function() {

        it('should call a valid function with no arguments', function() {
            var node = document.createElement('div');  
            SWFBridge.callSWF(node, 'getAttribute');
            sinon.assert.calledWith(console.log, "SWFBridge: calling swf function : getAttribute");
        });

        it('should call an invalid function with no arguments', function() {
            var node = document.createElement('div');  
            SWFBridge.callSWF(node, 'click');
            sinon.assert.neverCalledWith(console.log, "SWFBridge: calling swf function : click");
        });

        it('should call a valid function with arguments', function() {
            var node = document.createElement('div');  
            SWFBridge.callSWF(node, 'getAttribute', 'test', true, 9, null, undefined);
            sinon.assert.calledWith(console.log, "SWFBridge: calling swf function : getAttribute");
        });

    });

    describe('register function', function() {

        it('should register a valid function against an instance', function() {
            var node = document.createElement('div');  
            SWFBridge.register(node, 'fpad');
            
            expect(SWFBridge.fpad).to.not.be.undefined;

            SWFBridge.fpad.swfAction('getAttribute');
        });

        it('should register an invalid function against an instance', function() {
            var node = document.createElement('div');  
            SWFBridge.register(node, 'fpad');

            expect(SWFBridge.fpad).to.not.be.undefined;

            SWFBridge.fpad.swfAction('click');
        });       

        it('should register and fire the swfAction against an instance', function() {
            var node = document.createElement('div');  
            SWFBridge.register(node, 'fpad');

            expect(SWFBridge.fpad).to.not.be.undefined;

            SWFBridge.fpad.swfAction();
        });       

    });

    describe('unregister function', function() {
        
        it('should unregister the fpad id', function() { 
            SWFBridge.unregister('fpad');
             expect(SWFBridge.fpad).to.be.undefined;
        });

        it('should not break on an invalid id', function() { 
            SWFBridge.unregister('test');
        });

    });

});