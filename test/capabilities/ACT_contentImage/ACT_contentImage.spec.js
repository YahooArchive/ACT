var expect = chai.expect;
var assert = chai.assert;

describe("ContentImage", function() {
	var Event;
	var Lang;
	var Dom;

	before(function(){
		refreshModule('Event');
		refreshModule('ContentImage');

		Event = ACT.Event;
		Lang = ACT.Lang;
		Dom = ACT.Dom;
	});

    describe("ContentImage: Check the init state", function() {

        it("should have ACT.ContentImage instance", function() {
            expect(ACT.ContentImage).to.exist;
        });

        it("should have ACT.dom instance", function() {
            expect(Dom).to.exist;
        });

        it("should have ACT.lang instance", function() {
            expect(Lang).to.exist;
        });

        it("should have ACT.event instance", function() {
            expect(Event).to.exist;
        });

    });

    describe('Content: check getContent method which return the node', function() {

        it("Render img", function(done) {

            var contentImage = new ACT.ContentImage({
                type: 'ContentImage',
                id: 'img1',
                classNode: 'image_class',
                css: {
                    'width': '1440px',
                    'height': '600px',
                    'top': '0',
                    'left': '10px',
                    'display': 'block'
                },
                imageConfig: {
                    src: "https://s.yimg.com/hl/ap/default/140911/BIGTS_YAHOO-VIDSPLASH_v2_031410429559.jpg",
                    alt: 'test image',
                    title: 'Best image ever'
                }
            });

            var node = contentImage.getContent().node;

            assert.strictEqual(node.nodeName, 'IMG', 'Wrong tag node');
            assert.strictEqual(node.getAttribute('id'), 'img1', 'Wrong id node');
            assert.strictEqual(node.getAttribute('class'), ' image_class', 'Wrong class node');

            assert.strictEqual(node.style.width, '1440px', 'Wrong width node');
            assert.strictEqual(node.style.height, '600px', 'Wrong height node');
            assert.strictEqual(node.style.top, '0px', 'Wrong top node');
            assert.strictEqual(node.style.left, '10px', 'Wrong left node');

            assert.strictEqual(node.src, 'https://s.yimg.com/hl/ap/default/140911/BIGTS_YAHOO-VIDSPLASH_v2_031410429559.jpg', 'Wrong src node');
            assert.strictEqual(node.alt, 'test image', 'Wrong alt node');
            assert.strictEqual(node.title, 'Best image ever', 'Wrong title node');

            contentImage.destroy();

            done();

        });

        it("Render img with no CSS attributes", function(done) {

            var contentImage = new ACT.ContentImage({
                type: 'ContentImage',
                id: 'img2',
                classNode: 'image_class',
                imageConfig: {
                    src: "https://s.yimg.com/hl/ap/default/140911/BIGTS_YAHOO-VIDSPLASH_v2_031410429559.jpg",
                    alt: 'test image',
                    title: 'Best image ever',
                }
            });

            var node = contentImage.getContent().node;

            assert.strictEqual(node.nodeName, 'IMG', 'Wrong tag node');
            assert.strictEqual(node.getAttribute('id'), 'img2', 'Wrong id node');
            assert.strictEqual(node.getAttribute('class'), ' image_class', 'Wrong class node');


            assert.strictEqual(node.src, 'https://s.yimg.com/hl/ap/default/140911/BIGTS_YAHOO-VIDSPLASH_v2_031410429559.jpg', 'Wrong src node');
            assert.strictEqual(node.alt, 'test image', 'Wrong alt node');
            assert.strictEqual(node.title, 'Best image ever', 'Wrong title node');

            contentImage.destroy();

            done();

        });

        it("Render img with no class node attribute", function(done) {

            var contentImage = new ACT.ContentImage({
                type: 'ContentImage',
                id: 'img2',
                imageConfig: {
                    src: "https://s.yimg.com/hl/ap/default/140911/BIGTS_YAHOO-VIDSPLASH_v2_031410429559.jpg",
                    alt: 'test image',
                    title: 'Best image ever',
                }
            });

            var node = contentImage.getContent().node;

            assert.strictEqual(node.nodeName, 'IMG', 'Wrong tag node');
            assert.strictEqual(node.getAttribute('id'), 'img2', 'Wrong id node');

            assert.strictEqual(node.src, 'https://s.yimg.com/hl/ap/default/140911/BIGTS_YAHOO-VIDSPLASH_v2_031410429559.jpg', 'Wrong src node');
            assert.strictEqual(node.alt, 'test image', 'Wrong alt node');
            assert.strictEqual(node.title, 'Best image ever', 'Wrong title node');

            contentImage.destroy();

            done();

        });

    });

    describe('Resize: Check resize and status', function() {

        var contentImage = new ACT.ContentImage({
            type: 'ContentImage',
            id: 'image_id',
            classNode: 'image_class',
            resize: {
                sizeFrom: 'root'
            },
            css: {
                'width': '300px',
                'height': '500px',
                'display': 'block'
            },
            imageConfig: {
                src: "https://s.yimg.com/hl/ap/default/140911/BIGTS_YAHOO-VIDSPLASH_v2_031410429559.jpg",
                alt: 'test image',
                title: 'Best image ever',
            }
        });

        var node = contentImage.getContent().node;
        var container = document.createElement('div');
        container.style.width = '500px';
        container.style.height = '250px';
        container.appendChild(node);
        document.body.appendChild(container);

        it("Resize using screen data", function(done) {
            Event.fire('screen:status', {
                screenWidth: '1024px',
                screenHeight: '800px'
            });

            assert.strictEqual('1024px', node.style.width, 'wrong new width');
            assert.strictEqual('800px', node.style.height, 'wrong new height');
            done();
        });

        it("Resize using parent data", function(done) {

            contentImage.set('configObject', {
                type: 'ContentImage',
                id: 'image_id',
                classNode: 'image_class',
                resize: {
                    sizeFrom: 'parent'
                },
                css: {
                    'width': '300px',
                    'height': '500px',
                    'display': 'block'
                }
            });

            Event.fire('screen:status');

            assert.strictEqual(node.parentNode.offsetWidth, node.offsetWidth, 'wrong new width');
            assert.strictEqual(node.parentNode.offsetHeight, node.offsetHeight, 'wrong new height');

            done();

        });

        it("Resize 16:9", function(done) {

            contentImage.set('configObject', {
                type: 'ContentImage',
                id: 'image_id',
                classNode: 'image_class',
                resize: {
                    sizeFrom: 'root',
                    ratio: '16:9'
                },
                css: {
                    'width': '300px',
                    'height': '500px',
                    'display': 'block'
                }
            });

            Event.fire('screen:status', {
                screenWidth: '1024px',
                screenHeight: '800px'
            });

            assert.strictEqual(1024, node.offsetWidth, 'wrong new width');
            assert.strictEqual(250, node.offsetHeight, 'wrong new height');

            done();

        });

        it("Resize with ratio only", function(done) {

            contentImage.set('configObject', {
                type: 'ContentImage',
                id: 'image_id',
                classNode: 'image_class',
                resize: {
                    ratio: '1:1'
                },
                css: {
                    'width': '300px',
                    'height': '500px',
                    'display': 'block'
                }
            });

            Event.fire('screen:status');

            assert.strictEqual(1024, node.offsetWidth, 'wrong new width');
            assert.strictEqual(1024, node.offsetHeight, 'wrong new height');

            done();

        });

        after(function() {

            contentImage.destroy();

        });

    });
});
