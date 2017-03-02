var expect = chai.expect;

describe("ACT.Debug", function() {
  it("should have ACT.Debug instance", function () {
    expect(ACT.Debug).to.exist;
  });
  
  describe('ACT.Debug.log', function() {
    it('should have ACT.Debug.log', function() {
      expect(ACT.Debug.log).to.exist;
    });
    
    it('should log with no errors', function() {
      expect(ACT.Debug.log('testing')).to.not.throw;
      
    });
  });

  describe('ACT.Debug.error', function() {
    it('should have ACT.Debug.error', function() {
      expect(ACT.Debug.error).to.exist;
    });

    it('should debug error with no errors', function() {
      expect(ACT.Debug.error('testing')).to.not.throw;

    });
  });

  describe('ACT.Debug.warn', function() {
    it('should have ACT.Debug.warn', function() {
      expect(ACT.Debug.warn).to.exist;      
    });

    it('should warn with no errors', function() {
      expect(ACT.Debug.warn('testing')).to.not.throw;

    });
  });

  describe('ACT.Debug.info', function() {
    it('should have ACT.Debug.info', function() {
      expect(ACT.Debug.info).to.exist;
    });

    it('should info with no errors', function() {
      expect(ACT.Debug.info('testing')).to.not.throw;
    });
  });
  
//  describe('ACT.Debug with no console', function() {
//    var sandbox;
//    var mock;
//    var expectation;
//
//    beforeEach(function() {
//      sandbox = sinon.sandbox.create();
//      sandbox.stub(window.console, "log");
//      window.console = false;
////      console.log(sandbox, window.console);
//    });
//
//    afterEach(function() {
//      sandbox.restore();
//    });
//
//    it('should not console.log', function() {
//      expect(ACT.Debug.log('testing')).to.not.throw;
//
//    });
//
//  });

});