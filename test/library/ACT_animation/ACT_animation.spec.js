var expect = chai.expect;
var assert = chai.assert;

describe("ACT.Animation", function() {

    it("should have ACT.Animation instance", function () {
        expect(ACT.Animation).to.exist;
        expect(ACT.Lang).to.exist;
        expect(ACT.Dom).to.exist;
    });

    it("Should to be a singleton", function(){
        var an1 = ACT.Animation;
        var an2 = ACT.Animation;
        expect(an1).to.be.equal(an2);
    });

    describe('Animate Method', function() {

        var node, clock, anim;

        beforeEach(function() {
            clock = sinon.useFakeTimers(Date.now());
            anim = sinon.spy(ACT.Animation, "anim");

            node = document.createElement('DIV');
            node.style.width = "300px";
            node.style.height = "600px";
            document.body.appendChild(node);
        });

        afterEach(function() {
            clock.restore();
            anim.restore();

            document.body.removeChild(node);
        });

        it('With To', function(done) {
            
            var to = {width: "150px", height: "300px", opacity: 0};

            ACT.Animation.anim(node, to, null, 1000);
            clock.tick(1050);

            sinon.assert.calledWith(anim, node, to, null, 1000);

            expect(node.style.width).to.equal('150px');
            expect(node.style.height).to.equal('300px');
            expect(node.style.opacity).to.equal('0');

            done();
        });

        it('With From and To', function(done) {

            var from = {width:"150px", height:"300px", opacity:.5};
            var to = {width:"300px", height:"150px", opacity:1};

            ACT.Animation.anim(node, from, to, 2000);
            clock.tick(2050);

            sinon.assert.calledWith(anim, node, from, to, 2000);

            expect(node.style.width).to.equal('300px');
            expect(node.style.height).to.equal('150px');
            expect(node.style.opacity).to.equal('1');

            done();

        });

    });

});