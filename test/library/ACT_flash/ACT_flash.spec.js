var expect = chai.expect;
var assert = chai.assert;

describe("ACT.Flash", function() {

    it("should have ACT.Flash instance", function() {
        expect(ACT.Lang).to.exist;
        expect(ACT.Dom).to.exist;
        expect(ACT.Flash).to.exist;
    });

    describe("Create Embed", function() {

        describe("!IE browsers", function() {

            var fl;
            var dID = "actflash";
            var div;
            var conf = {
                src: "https://s.yimg.com/cv/ae/global/actjs/ACTPlayer1435242612.swf",
                position: dID
            };

            beforeEach(function() {
                fl = ACT.Flash;
                div = createDummyElement(dID);
            });

            it("Should create tag", function() {
                fl.injectFlashVersion();
                var node = fl.objectEmbed(conf);
                assert.match(node.nodeName, /EMBED/, 'Wrong tag node');
            });

            afterEach(function() {
                removeDummyElement(dID);
            });

        });


        describe("IE browsers", function() {

            var fl;
            var ie = ACT.UA.ie;
            var dID = "actflash";
            var div;
            var conf = {
                src: "https://s.yimg.com/cv/ae/global/actjs/ACTPlayer1435242612.swf",
                position: dID
            };

            beforeEach(function() {
                ACT.UA.ie = 1;
                fl = ACT.Flash;
                div = createDummyElement(dID);
            });

            it("Should create tag", function() {
                fl.injectFlashVersion();
                var node = fl.objectEmbed(conf);
                assert.match(node.nodeName, /OBJECT/, 'Wrong tag node');
            });

            afterEach(function() {
                ACT.UA.ie = ie;
                removeDummyElement(dID);
            });

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