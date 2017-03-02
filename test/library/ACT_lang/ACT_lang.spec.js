var expect = chai.expect;

describe("ACT.Lang", function() {
  it("should have ACT lang", function(){
    expect(ACT.Lang).to.exist;
  });

  describe('dateNow', function() {
    it('now should be same as Date.now()', function() {
      var actDate = ACT.Lang.dateNow() / 10;
      var vanillaDate = Date.now() / 10;
      expect(actDate).to.equal(vanillaDate);
    });
  });

  describe('bind', function() {
    // Function.bind doesnt work as expected on PhantonJS.
  });

  describe("delay", function(){
    it('should call delay', function() {
      var res = ACT.Lang.delay(function() {return 'testing';}, 1000, this, ['blah']);
      expect(res).to.be.at.least(0);
    });
  });

  describe("size", function(){
    it('should return length of an object', function() {
      var len = 4;
      var obj = {"1":1,"2":2,"3":3,"4":4};
      var res = ACT.Lang.size(obj);
      expect(res).to.equal(len);
      expect(obj[res]).to.equal(obj[len]);
    });
  });

  describe("merge", function() {
    it("should merge two empty objects", function() {
      var o1 = {};
      var o2 = {};
      var res = ACT.Lang.merge(o1, o2);
      expect(res).to.exist;
      expect(res).to.be.empty;
    });

    it("should copy one object to empty object", function() {
      var o1 = {val1: 2};
      var o2 = {};
      var res = ACT.Lang.merge(o1, o2);
      expect(res).to.exist;
      expect(res).to.not.be.empty;
      expect(res.val1).to.equal(2);
    });

    it("should copy multiple values from one object to empty object", function() {
      var o1 = {val1: 3, val2: 4};
      var o2 = {};
      var res = ACT.Lang.merge(o1, o2);
      expect(res).to.exist;
      expect(res).to.not.be.empty;
      expect(res.val1).to.equal(3);
      expect(res.val2).to.equal(4);
    });

    it("should replace old values by new ones", function() {
      var o1 = {val1: 5, val2: 6};
      var o2 = {val2: 7};
      var res = ACT.Lang.merge(o1, o2);
      expect(res).to.exist;
      expect(res).to.not.be.empty;
      expect(res.val1).to.equal(5);
      expect(res.val2).to.equal(7);
    });

    it('should merge even if both have same elements', function() {
      var o1 = {val: 1};
      var o2 = {val: 1};
      var res = ACT.Lang.merge(o1, o2);
      expect(res).to.exist;
      expect(res).to.not.be.empty;
      expect(res.val).to.equal(1);
    });

    it('should merge when from has an object', function() {
      var o1 = {};
      var o2 = {val: {name: "Jon"}};
      var res = ACT.Lang.merge(o1, o2);
      expect(res).to.exist;
      expect(res).to.not.be.empty;
      expect(res.val).to.exist;
      expect(res.val).to.not.empty;
      expect(res.val.name).to.equal('Jon');
    });

    it('should merge when from has a deep object', function() {
      var o1 = {};
      var o2 = {val: {name: {first: "Jon"}}};
      var res = ACT.Lang.merge(o1, o2);
      expect(res).to.exist;
      expect(res).to.not.be.empty;
      expect(res.val).to.exist;
      expect(res.val).to.not.empty;
      expect(res.val.name).to.exist;
      expect(res.val.name).to.not.empty;
      expect(res.val.name.first).to.equal('Jon');
    });

    it('should merge when from has an object and target also has object', function() {
      var o1 = {val: {name: "Igor"}};
      var o2 = {val: {name: "Jon", last: 'Zing'}};
      var res = ACT.Lang.merge(o1, o2);
      expect(res).to.exist;
      expect(res).to.not.be.empty;
      expect(res.val).to.exist;
      expect(res.val).to.not.empty;
      expect(res.val.name).to.equal('Jon');
      expect(res.val.last).to.equal('Zing');
    });

    it('should merge when from has an object and target also has object', function() {
      var o2 = {val: {name: "Igor"}};
      var o1 = {val: {name: "Jon", last: 'Zing'}};
      var res = ACT.Lang.merge(o1, o2);
      expect(res).to.exist;
      expect(res).to.not.be.empty;
      expect(res.val).to.exist;
      expect(res.val).to.not.empty;
      expect(res.val.name).to.equal('Igor');
      expect(res.val.last).to.equal('Zing');
    });

    it('should merge when from has an array', function() {
      var o1 = {};
      var o2 = {val: ['banana', 'apple']};
      var res = ACT.Lang.merge(o1, o2);
      expect(res).to.exist;
      expect(res).to.not.be.empty;
      expect(res.val).to.exist;
      expect(res.val).to.not.empty;
      expect(res.val[0]).to.equal('banana');
      expect(res.val[1]).to.equal('apple');
    });

    it('should merge when from and target have array', function() {
      var o1 = {val: ['grapes']};
      var o2 = {val: ['banana', 'apple']};
      var res = ACT.Lang.merge(o1, o2);
      expect(res).to.exist;
      expect(res).to.not.be.empty;
      expect(res.val).to.exist;
      expect(res.val).to.not.empty;
      expect(res.val.length).to.equal(3);
      expect(res.val.indexOf('grapes')).to.be.at.least(0);
      expect(res.val.indexOf('banana')).to.be.at.least(0);
      expect(res.val.indexOf('apple')).to.be.at.least(0);
    });

    it('should merge when from and target have array', function() {
      var o1 = {val: ['apple', 'grapes']};
      var o2 = {val: ['banana', 'apple']};
      var res = ACT.Lang.merge(o1, o2);
      expect(res).to.exist;
      expect(res).to.not.be.empty;
      expect(res.val).to.exist;
      expect(res.val).to.not.empty;
      expect(res.val.length).to.equal(4);
      expect(res.val.indexOf('grapes')).to.be.at.least(0);
      expect(res.val.indexOf('banana')).to.be.at.least(0);
      expect(res.val.indexOf('apple')).to.be.at.least(0);
    });

    it('should merge array of objects', function() {
      var o1 = {val: [{name: 'Ginger'}, {name: 'Gautham'}]};
      var o2 = {val: [{name: 'Cintia'}, {name: 'Ginger'}]};
      var res = ACT.Lang.merge(o1, o2);
      expect(res).to.exist;
      expect(res).to.not.be.empty;
      expect(res.val).to.exist;
      expect(res.val).to.not.empty;
      expect(res.val.length).to.equal(4);
    });
  });

  describe('createHash', function() {

    it('should return empty string when no elements are passed', function() {
      var res = ACT.Lang.createHash({});
      expect(res).to.be.a('string');
      expect(res.length).to.equal(0);
    });

    it('should return key and value in a string', function() {
      var res = ACT.Lang.createHash({value: 'my new name'});
      expect(res).to.be.a('string');
      expect(res).to.contain('value');
      expect(res).to.contain('my%20new%20name');
    });

    it('should return multiple key and value in a string', function() {
      var res = ACT.Lang.createHash({value: 'my new name', val2: 'testing', num: 42});
      expect(res).to.be.a('string');
      expect(res).to.contain('value');
      expect(res).to.contain('my%20new%20name');
      expect(res).to.contain('val2');
      expect(res).to.contain('testing');
      expect(res).to.contain('num');
      expect(res).to.contain('42');
    });

  });

  describe('parseHash', function() {

    it('should return empty object when no arguments', function() {
      expect(ACT.Lang.parseHash()).to.be.empty;
    });

    it('should be false when arg cant be parsed', function() {
      expect(ACT.Lang.parseHash(null)).to.be.empty;
    });

    it('should be false when arg cant be parsed', function() {
      expect(ACT.Lang.parseHash(true)).to.be.empty;
    });

    it('should parse a simple hash', function() {
      var res = ACT.Lang.parseHash('value=test');
      expect(res).to.be.an('object');
      expect(res.value).to.equal('test');
    });

    it('should parse a hash with more than one param', function() {
      var res = ACT.Lang.parseHash('value=my%20new%20name&val2=testing&num=42');
      expect(res).to.be.an('object');
      expect(res.value).to.equal('my new name');
      expect(res.val2).to.equal('testing');
      expect(res.num).to.equal('42');
    });

  });

  describe('isObject', function() {
    it('should return true for object', function() {
      expect(ACT.Lang.isObject({})).to.be.true;
    });
    it('should return true for function', function() {
      expect(ACT.Lang.isObject(function test(){})).to.be.true;
    });
    it('should return true for arrays', function() {
      expect(ACT.Lang.isObject([])).to.be.true;
    });
    it('should return false for numbers', function() {
      expect(ACT.Lang.isObject(1)).to.be.false;
    });
    it('should return false for strings', function() {
      expect(ACT.Lang.isObject('test')).to.be.false;
    });
    it('should return false for null', function() {
      expect(ACT.Lang.isObject(null)).to.be.false;
    });
    it('should return false for undefined', function() {
      expect(ACT.Lang.isObject(undefined)).to.be.false;
    });
  });

  describe('objHasKey', function(){
    it('should be true if there is a key', function(){
      var obj = {key: 1};
      expect(ACT.Lang.objHasKey(obj, 'key')).to.be.true;
    });
    it('should be false if there is no key', function(){
      var obj = {key2: 1};
      expect(ACT.Lang.objHasKey(obj, 'key')).to.be.false;
    });
    it('should be false if there is no object', function(){
      expect(ACT.Lang.objHasKey('test', 'key')).to.be.false;
    });
  });

  describe('isArray', function() {
    it('should be true for arrays', function() {
      expect(ACT.Lang.isArray([])).to.be.true;
    });
    it('should be false for objects', function() {
      expect(ACT.Lang.isArray({})).to.be.false;
    });
    it('should be false for functions', function() {
      expect(ACT.Lang.isArray(function test(){})).to.be.false;
    });
    it('should be false for numbers', function() {
      expect(ACT.Lang.isArray(1)).to.be.false;
    });
  });

  describe('isString', function(){
    it('should be true for strings', function(){
      expect(ACT.Lang.isString('a')).to.be.true;
    });
    it('should be false for objects', function(){
      expect(ACT.Lang.isString({})).to.be.false;
    });
    it('should be false for numbers', function(){
      expect(ACT.Lang.isString(0)).to.be.false;
    });
  });

  describe('isNumber', function(){
    it('should be true for integer with type number', function(){
      expect(ACT.Lang.isNumber(1000)).to.be.true;
    });
    it('should be true for integer without type number', function(){
      expect(ACT.Lang.isNumber('1000')).to.be.true;
    });
    it('should be false for value without number', function(){
      expect(ACT.Lang.isNumber('hello world')).to.be.false;
    });
  });

  describe('isStrictNumber', function(){
    it('should be true for integer with type number', function(){
      expect(ACT.Lang.isStrictNumber(1000)).to.be.true;
    });
    it('should be false for integer without type number', function(){
      expect(ACT.Lang.isStrictNumber('1000')).to.be.false;
    });
    it('should be false for value without number', function(){
      expect(ACT.Lang.isStrictNumber('hello world')).to.be.false;
    });
  });

  describe('clone', function(){
    it('should return null when null is passed in', function() {
      var res = ACT.Lang.clone(null);
      expect(res).to.be.null;
    });
    it('should copy a simple object', function() {
      var obj1 = {k1: 0};
      var obj2 = ACT.Lang.clone(obj1);
      expect(obj2.k1).to.be.equal(obj1.k1);
    });
    it('should be able to change copy without changing original', function(){
      var obj1 = {k1: 1};
      var obj2 = ACT.Lang.clone(obj1);
      expect(obj2.k1).to.be.equal(obj1.k1);
      obj2.k1 = 2;
      expect(obj1.k1).to.equal(1);
      expect(obj2.k1).to.equal(2);
    });
  });

  describe('numberific', function(){
    it('should return 0 when arg is not a number', function() {
      expect(ACT.Lang.numberific('a')).to.equal(0);
    });
    it('should return a parsed float number', function(){
      expect(ACT.Lang.numberific('3.0.2')).to.equal(3.0);
    });
  });

  describe('arrayIndexOf', function(){
    it('should return > -1 if value found in array', function(){
      var array = ['a', 'a', 'c', 'd'];
      var value = 'a';
      expect(ACT.Lang.arrayIndexOf(array, value, 0)).to.not.equal(-1);
    });
    it('should return -1 if value not found in array', function(){
      var array = ['a', 'a', 'c', 'd'];
      var value = 'e';
      expect(ACT.Lang.arrayIndexOf(array, value, 0)).to.equal(-1);
    });
  });

  describe('inArray', function(){
    it('should return true if value exist in array', function(){
      var array = ['a', 'a', 'c', 'd'];
      var value = 'a';
      expect(ACT.Lang.inArray(array, value)).to.be.true;
     })
    it('should return false if value doesnot exist in array', function(){
      var array = ['a', 'a', 'c', 'd'];
      var value = 'e';
      expect(ACT.Lang.inArray(array, value)).to.be.false;
     })
  });

  describe('arrayDedupe', function(){
    it('should dedupe string values from an array', function(){
      var array = ['a', 'a', 'a', 'c', 'd'];
      array = ACT.Lang.arrayDedupe(array);
      expect(ACT.Lang.arrayIndexOf(array, 'a', 0)).to.equal(0);
    });
  });

  describe('inString', function() {
    it('should return false if no string is checked', function(){
      expect(ACT.Lang.inString('')).to.be.false;
    });

    it('should return true if the two strings are the same', function() {
      expect(ACT.Lang.inString('a', 'a')).to.be.true;
    });

    it('should return true if the you have a letter from a string', function() {
      expect(ACT.Lang.inString('panda', 'a')).to.be.true;
    });

    it('should return false if the you dont have a letter from a string', function() {
      expect(ACT.Lang.inString('panda', 'b')).to.be.false;
    });

  });

  describe("forEach", function(){
    it("should loop through all object's properties ", function(){
      var obj = {
        a: 'va',
        b: 'vb',
        c: 'vc'
      }
      var func = sinon.stub();
      func.returns(true);

      ACT.Lang.forEach(obj, func);

      expect(func.callCount).to.equal(3);
      expect(func.firstCall.calledWith("a","va")).to.be.true;
      expect(func.secondCall.calledWith("b","vb")).to.be.true;
      expect(func.thirdCall.calledWith("c","vc")).to.be.true;
    });

    it("should stop loop if function return false", function(){
      var obj = {
        a: 'va',
        b: 'vb',
        c: 'vc'
      }
      var func = sinon.stub();
      func.onCall(1).returns(false);
      func.returns(true);

      ACT.Lang.forEach(obj, func);

      expect(func.callCount).to.equal(2);
      expect(func.firstCall.calledWith("a","va")).to.be.true;
      expect(func.secondCall.calledWith("b","vb")).to.be.true;
    });

  });
});
