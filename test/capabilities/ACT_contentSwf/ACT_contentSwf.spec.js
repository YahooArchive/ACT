var expect = chai.expect;
var assert = chai.assert;

var Event = ACT.Event;
var Lang = ACT.Lang;
var SWFBridge = ACT.SWFBridge;

describe("ContentSwf", function() {

    describe("ContentSwf: Check the init state", function() {

        it("should have ACT.ContentSwf instance", function() {
            expect(ACT.ContentSwf).to.exist;
        });

        it("should have ACT.Lang instance", function() {
            expect(Lang).to.exist;
        });

        it("should have ACT.Event instance", function() {
            expect(Event).to.exist;
        });

        it("should have ACT.SWFBridge instance", function() {
            expect(SWFBridge).to.exist;
        });

        it("Actions registered", function() {

            var actions = null;
            var listener = Event.on('register:Actions', function(e) {
                actions = e;
                listener.remove();
                assert.isArray(actions, 'reigstered action must be array');

            });

            var swfElement = new ACT.ContentSwf({
                type: 'ContentSwf',
                id: 'swf_test',
                classNode: 'funny-class',
                swfConfig: {
                    width: '970px',
                    height: '250px',
                    src: "https://s.yimg.com/cv/ae/actjs/swf-assets/0-0-1/billboard_simple_test.swf",
                    allowedDomain: "*",
                    allowNetworking: "all",
                    wmode: "transparent",
                    allowFullScreen: false,
                    flashvars: {
                        clickTAG: "https://uk.yahoo.com"
                    }
                }
            });
        });
    });

    describe("ContentSwf: check stop content", function() {

        var swfElement = new ACT.ContentSwf({
            swfConfig: {
                src: "https://s.yimg.com/cv/ae/actjs/swf-assets/0-0-1/mpu.swf"
            }
        });

        it("Running stop content", function() {

            var node = swfElement.getContent().node;
            sinon.stub(SWFBridge, 'callSWF', function(a, b) {
                assert.strictEqual(b, 'stopContent');
            });
            Event.fire('STOP_CONTENT');
            SWFBridge.callSWF.restore();

        });

    });

    describe('ContentSwf: check getContent method which return the node', function() {

        it("Render simple SWF", function() {

            var swfElement = new ACT.ContentSwf({
                type: 'ContentSwf',
                id: 'swf_test',
                classNode: 'funny-class',
                swfConfig: {
                    width: '970px',
                    height: '250px',
                    src: "https://s.yimg.com/cv/ae/actjs/swf-assets/0-0-1/billboard_simple_test.swf",
                    allowedDomain: "*",
                    allowNetworking: "all",
                    wmode: "transparent",
                    allowFullScreen: false,
                    flashvars: {
                        clickTAG: "https://uk.yahoo.com"
                    }
                }
            });

            var node = swfElement.getContent().node;

            assert.match(node.nodeName, /OBJECT||EMBED/, 'Wrong tag node');
            assert.strictEqual(node.getAttribute('id'), 'swf_test', 'Wrong id node');
            assert.strictEqual(node.getAttribute('class'), ' funny-class', 'Wrong class node');

            swfElement.destroy();

        });

        it("Render SWF with styles", function() {

            var swfElement = new ACT.ContentSwf({
                type: 'ContentSwf',
                id: 'swf_test',
                classNode: 'funny-class',
                css: {
                    width: '970px',
                    height: '300px',
                    backgroundColor: 'red',
                    border: '1px solid red'
                },
                swfConfig: {
                    width: '970px',
                    height: '250px',
                    src: "https://s.yimg.com/cv/ae/actjs/swf-assets/0-0-1/billboard_simple_test.swf",
                    allowedDomain: "*",
                    allowNetworking: "all",
                    wmode: "transparent",
                    allowFullScreen: false,
                    flashvars: {
                        clickTAG: "https://uk.yahoo.com"
                    }
                }
            });


            var node = swfElement.getContent().node;

            assert.strictEqual(node.style.width, '970px', 'Wrong width');
            assert.strictEqual(node.style.height, '300px', 'Wrong height');
            assert.strictEqual(node.style.backgroundColor, 'red', 'Wrong background color');
            assert.strictEqual(node.style.border, '1px solid red', 'Wrong background color');

            swfElement.destroy();

        });

        it("CallSWF and callback function", function(done) {

            var swfElement1 = new ACT.ContentSwf({
                type: 'ContentSwf',
                id: 'swf_test1',
                classNode: 'funny-class',
                css: {
                    width: '500px',
                    height: '250px',
                    backgroundColor: 'pink',
                    border: '1px solid red'
                },
                swfConfig: {
                    src: "https://s.yimg.com/cv/ae/actjs/swf-assets/0-0-1/mpu.swf",
                    width: '300px',
                    height: '250px',
                    allowedDomain: "*",
                    allowNetworking: "all",
                    wmode: "transparent",
                    allowFullScreen: false,
                    flashvars: {
                        clickTAG: "https://uk.yahoo.com"
                    }
                }
            });

            var node1 = swfElement1.getContent().node;
            document.body.appendChild(node1);

            var swfElement2 = new ACT.ContentSwf({
                type: 'ContentSwf',
                id: 'swf_test2',
                classNode: 'funny-class',
                css: {
                    width: '500px',
                    height: '250px',
                    backgroundColor: 'yellow',
                    border: '1px solid green'
                },
                swfConfig: {
                    src: "https://s.yimg.com/cv/ae/actjs/swf-assets/0-0-1/mpu.swf",
                    width: '300px',
                    height: '250px',
                    allowedDomain: "*",
                    allowNetworking: "all",
                    wmode: "transparent",
                    allowFullScreen: false,
                    flashvars: {
                        clickTAG: "https://uk.yahoo.com"
                    }
                }
            });

            var node2 = swfElement2.getContent().node;
            document.body.appendChild(node2);

            /// Node 1

            Event.on('swfReady', function() {

                SWFBridge.callSWF(node1, 'swfIsReady', {});

                Event.on('click', function(data) {

                    SWFBridge.callSWF(node1, 'changeColor');

                    expect(data.id).to.equal(node1.id);
                    expect(data.scope).to.equal(swfElement1);
                    expect(data.scope).to.be.an.instanceof(ACT.ContentSwf);

                }, null, swfElement1);

                Event.fire('click', {
                    id: node1.id,
                    scope: swfElement1
                });

            }, null, swfElement1);

            /// Node 2

            Event.on('swfReady', function() {

                SWFBridge.callSWF(node2, 'swfIsReady', {});

                Event.on('click', function(data) {

                    SWFBridge.callSWF(node2, 'changeColor');

                    expect(data.id).to.equal(node2.id);
                    expect(data.scope).to.equal(swfElement2);
                    expect(data.scope).to.be.an.instanceof(ACT.ContentSwf);

                }, null, swfElement2);

                Event.fire('click', {
                    id: node2.id,
                    scope: swfElement2
                });

            }, null, swfElement2);

            swfElement1.destroy();
            swfElement2.destroy();

            done();

        });

        it("eventHandler test", function(done) {

            var swfElement = new ACT.ContentSwf({
                swfConfig: {
                    src: "https://s.yimg.com/cv/ae/actjs/swf-assets/0-0-1/mpu.swf"
                }
            });

            var node = swfElement.getContent().node;
            document.body.appendChild(node);

            /// Local

            Event.on('click', function(data) {

                expect(data.id).to.equal(node.id);
                expect(data.scope).to.equal(swfElement);
                expect(data.scope).to.be.an.instanceof(ACT.ContentSwf);
                done();
            }, null, swfElement);

            swfElement.eventHandler(node.id, {
                type: "click"
            });

            swfElement.eventHandler(node.id, {
                actions: [{
                    type: "playLayer",
                    to: "mpu"
                }]
            });

            swfElement.destroy();

        });

    });

    describe('Resize: Check resize and status', function() {

        it("Resize using screen data", function(done) {

            var swfElement = new ACT.ContentSwf({
                resize: {
                    sizeFrom: 'root'
                },
                swfConfig: {
                    src: "https://s.yimg.com/cv/ae/actjs/swf-assets/0-0-1/mpu.swf"
                }
            });

            var node = swfElement.getContent().node;
            document.body.appendChild(node);

            Event.fire('screen:status', {
                screenWidth: '1024px',
                screenHeight: '800px'
            });

            assert.strictEqual('1024px', node.style.width, 'wrong new width');
            assert.strictEqual('800px', node.style.height, 'wrong new height');

            swfElement.destroy();

            done();

        });

    });
});
