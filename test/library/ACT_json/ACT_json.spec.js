describe("ACT.JSON", function() {
    var expect = chai.expect;
    var assert = chai.assert;

    it("should have ACT.Json instance", function() {
        expect(ACT.Json).to.exist;
    });

    describe('stringify', function() {
        // var tmpJSON;

        // before(function(){
        //     var tmpJSON = window.JSON;
        //     window.JSON = null;
        // });

        // after(function(){
        //     window.JSON = tmpJSON;
        // });

        it('should have stringify', function() {
            expect(ACT.Json.stringify).to.exist;
        });

        it('should stringify an empty object', function() {
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.stringify({});
            expect(res).to.equal('{}');

            window.JSON = tmpJSON;
        });

        it('should stringify true', function() {
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.stringify(true);
            expect(res).to.equal('true');

            window.JSON = tmpJSON;
        });

        it('should stringify a string', function() {
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.stringify('foo');
            expect(res).to.equal('"foo"');

            window.JSON = tmpJSON;
        });

        it('should stringify an array', function() {
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.stringify([1, 'false', false]);
            expect(res).to.equal('[1,"false",false]');

            window.JSON = tmpJSON;
        });

        it('should stringify an object', function() {
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.stringify({ x: 5 });
            expect(res).to.equal('{"x":5}');

            window.JSON = tmpJSON;
        });

        it("should stringify with native function", function(){
            var res = ACT.Json.stringify({ a: 5, b: '0' });
            expect(res).to.equal('{"a":5,"b":"0"}');
        });
    });

    describe('parse', function() {
        it('should have parse', function() {
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            expect(ACT.Json.parse).to.exist;

            window.JSON = tmpJSON;
        });

        it('should parse a string', function() {
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.parse('"foo"');
            expect(res).to.equal('foo');

            window.JSON = tmpJSON;
        });

        it('should parse an array', function() {
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.parse('[1, 5, "false"]');
            expect(res).to.not.empty;
            expect(res.length).to.equal(3);
            expect(res[0]).to.equal(1);

            window.JSON = tmpJSON;
        });

        it('should parse an object', function(){
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.parse('{"name":"act", "type":"framework" }');
            expect(res).to.not.empty;
            assert.isObject(res, 'Is a object');

            window.JSON = tmpJSON;
        });

        it('should parse an number', function(){
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.parse('-1.23E+11');
            assert.isNumber(res, 'Value is number');
            assert.equal(res, -123000000000, 'Not number -1.23E+11');

            window.JSON = tmpJSON;
        });

        it('should parse an unicode', function(){
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.parse('"\\u0041"');
            assert.isString(res);
            assert.equal(res, 'A', 'Not String A');

            window.JSON = tmpJSON;
        });


        //false, true and null

        it('should parse a boolean', function() {
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.parse('true');
            expect(res).to.be.true;

            window.JSON = tmpJSON;
        });

        it('should parse null', function() {
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.parse('null');
            expect(res).to.be.null;

            window.JSON = tmpJSON;
        });

        it('should parse null', function() {
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.parse('false');
            expect(res).to.be.false;

            window.JSON = tmpJSON;
        });


        //Empty

        it('should parse an empty object', function() {
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.parse('{}');
            expect(res).to.exist;
            expect(res).to.be.empty;

            window.JSON = tmpJSON;
        });

        it('should parse an empty array', function(){
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            var res = ACT.Json.parse('[]');
            expect(res).to.exist;
            expect(res).to.be.empty;

            window.JSON = tmpJSON;
        });

        it('should parse with native function', function(){

            var res = ACT.Json.parse('{"name":"act", "type":"framework" }');
            expect(res).to.not.empty;
            assert.isObject(res, 'Is a object');
            assert.deepEqual(res, {"name":"act","type":"framework"});

        });

        //Catch Errors

        it('should throw syntax error', function(){
            // set window.JSON must be inside test case otherwise phantomjs will break;
            var tmpJSON = window.JSON;
            window.JSON = null;

            try{
                var res = ACT.Json.parse("act");
            } catch(e){
                expect(e.name.toString()).to.be.equal('SyntaxError');
            }

            try{
                var res = ACT.Json.parse('{"name": "act", "name": "framework"}');
            } catch(e){
                expect(e.name.toString()).to.be.equal('SyntaxError');
            }

            try{
                var res = ACT.Json.parse('-1aa');
            } catch(e){
                expect(e.name.toString()).to.be.equal('SyntaxError');
            }

            try{
                var res = ACT.Json.parse('"\\uAsAs"');
            } catch(e){
                expect(e.name.toString()).to.be.equal('SyntaxError');
            }

            window.JSON = tmpJSON;

        });

    });

});