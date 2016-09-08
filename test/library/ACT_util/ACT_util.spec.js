var expect = chai.expect;

describe("ACT.Util", function() {
  it("should have ACT.Util instance", function(){
    expect(ACT.Util).to.exist;
  });

  describe('toggleTakeover', function() {
    it('should not set ad_takeover when not initialized', function() {
      ACT.Util.toggleTakeover('value');
      expect(window.ad_takeover).to.be.undefined;
    });

    it('should set ad_takeover to true', function() {
      window.ad_takeover = function(param){return param;};
      expect(window.ad_takeover).to.exist;
      expect(ACT.Util.toggleTakeover(true)).to.not.throw;
    });
  });

  describe('adRunning', function() {

    it('should not set ad_running when not initialized', function() {
      ACT.Util.adRunning('value');
      expect(window.ad_running).to.be.undefined;
    });

    it('should set adRunning to true', function() {
      window.ad_running = function(param){return param;};
      expect(window.ad_running).to.exist;
      expect(ACT.Util.adRunning(true)).to.not.throw;
    });
  });

  describe('registerAdAction', function() {
    it('should do nothing when called with no params', function() {
      ACT.Util.adAction = {};
      expect(ACT.Util.registerAdAction({})).to.not.throw;
      expect(ACT.Util.adAction).to.be.empty;
    });

    it('should register ad action when there is an ad', function() {
      ACT.Util.adAction = {};
      expect(ACT.Util.registerAdAction({ad: 'test'})).to.not.throw;
      expect(ACT.Util.adAction).to.not.empty;
      expect(ACT.Util.adAction['test']).to.exist;
    });

  });

  describe('getInt', function() {
    it('should return zero for empty string', function() {
      expect(ACT.Util.getInt('')).to.equal(0);
    });

    it('should return zero for string with no numbers', function() {
      expect(ACT.Util.getInt('testing')).to.equal(0);
    });

    it('should return number in the beginning of string', function() {
      expect(ACT.Util.getInt('1testing')).to.equal(1);
    });

    it('should return number in the beginning of string', function() {
      expect(ACT.Util.getInt('122testing')).to.equal(122);
    });

    it('should return number in the middle of string', function() {
      expect(ACT.Util.getInt('test42ing')).to.equal(42);
    });

    it('should return number in the end of string', function() {
      expect(ACT.Util.getInt('testing98')).to.equal(98);
    });

    it('should return separated numbers in the string', function() {
      expect(ACT.Util.getInt('tes9ting8')).to.equal(98);
    });
  });

  describe('pixelTrack', function() {

    it('should not throw exception when no pixel is given', function() {
      expect(ACT.Util.pixelTrack()).not.to.throw;
    });

    it('should create new pixel without throwing', function() {
      expect(ACT.Util.pixelTrack('https://s.yimg.com/cv/eng/externals/131110/a/p.gif')).not.to.throw;
    });
  });

  describe('adDate', function() {
    it('should return false if no date is passed', function() {
      expect(ACT.Util.adDate('')).to.be.false;
    });

    it('should return true if give date in past', function() {
      expect(ACT.Util.adDate('2000/01/01')).to.be.true;
    });

    it('should return true if give date is today', function() {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10){
        dd='0'+dd
      }
      if(mm<10){
        mm='0'+mm
      }
      expect(ACT.Util.adDate(yyyy+'/'+mm+'/'+dd)).to.be.true;
    });

    it('should return false if give date is in future', function() {
      var today = new Date();
      today.setDate(today.getDate() + 14);
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10){
        dd='0'+dd
      }
      if(mm<10){
        mm='0'+mm
      }
      expect(ACT.Util.adDate(yyyy+'/'+mm+'/'+dd)).to.be.false;
    });

  });

  describe('hashString', function() {

    it('should return 0 when empty string', function(){
      expect(ACT.Util.hashString('')).to.equal(0);
    });

    it('should return a greater number when a', function() {
      expect(ACT.Util.hashString('a')).to.be.above(0);
    });

  });

  describe('getQStrVal', function() {
    it('should return empty string', function() {
      expect(ACT.Util.getQStrVal('')).to.be.empty;
    });

    it('should return empty string', function() {
      expect(ACT.Util.getQStrVal('val')).to.be.empty;
    });

  });
});