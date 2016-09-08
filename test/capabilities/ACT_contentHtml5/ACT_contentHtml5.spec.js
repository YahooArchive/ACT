var expect = chai.expect;
var assert = chai.assert;

var Event = ACT.Event;
var Lang = ACT.Lang;
var Dom = ACT.Dom;
var Class = ACT.Class;
var Capability = ACT.Capability;

describe("ACT_contentHtml5", function() {

    before(function() {
        Event.removeListener('complete:action');
    });

    describe("initialization", function() {

        var config = {
            type: "content-html5",
            id: "html5_container",
            classNode: "html5_class",
            env: ["html"],
            css: {
                width: '970px',
                height: '250px'
            },
            html5Config: {}
        };

        it("should have ACT.ContentHtml5 instance", function(done) {
            expect(ACT.ContentHtml5).to.exist;
            done();
        });

        describe("Check ATTRS", function() {

            var contentHtml5, node;

            before(function() {
                contentHtml5 = new ACT.ContentHtml5(config);
                node = contentHtml5.getContent().node;
            });

            after(function() {
                contentHtml5.destroy();
            });

            it("Should have NAME", function(done) {
                expect(contentHtml5.ATTRS.NAME).to.exist;
                assert.strictEqual(contentHtml5.ATTRS.NAME, 'ContentHtml5', 'Name is not ContentHtml5');

                done();
            });

            it("Should have version", function(done) {
                expect(contentHtml5.ATTRS.version).to.exist;

                done();
            });

            it("Should have configObject", function(done) {
                expect(contentHtml5.ATTRS.configObject).to.exist;
                assert.isObject(contentHtml5.ATTRS.configObject);
                done();
            });

            it("Should node be not null", function(done) {
                expect(contentHtml5.ATTRS.node).to.exist;
                assert.isNotNull(contentHtml5.ATTRS.node);
                done();
            });

            it("Should have eventList", function(done) {
                expect(contentHtml5.ATTRS.eventList).to.exist;
                assert.isArray(contentHtml5.ATTRS.eventList);
                done();
            });

        });

        describe("initiate instance", function() {

            it("Should create div if iframe is false", function(done) {
                config.html5Config.iframe = false;

                var contentHtml5 = new ACT.ContentHtml5(config);
                var node = contentHtml5.getContent().node;

                assert.strictEqual(node.tagName.toLowerCase(), 'div');
                assert.strictEqual(node.id, 'html5_container');
                assert.strictEqual(node.className, ' html5_class');

                contentHtml5.destroy();

                done();
            });

            it("Should create iframe if iframe is true", function(done) {
                config.html5Config.iframe = true;

                var contentHtml5 = new ACT.ContentHtml5(config);
                var node = contentHtml5.getContent().node;

                assert.strictEqual(node.tagName.toLowerCase(), 'iframe');
                assert.strictEqual(node.id, 'html5_container');
                assert.strictEqual(node.className, ' html5_class');

                contentHtml5.destroy();

                done();
            });


            describe("register actions", function(){

                it("should return true against valid arguments", function(done){


                    ACT.Event.originalEventFire = ACT.Event.fire;
                    sinon.stub(ACT.Event, 'fire', function(event, data){

                        if (event === 'register:Actions'){

                            var html5Broadcast = data[0].argument;
                            var changeHtml5FrameStyles = data[1].argument;

                            expect(html5Broadcast.to.test("mpu_iframe_content")).to.be.true;
                            expect(html5Broadcast.name.test("do_this_action")).to.be.true;
                            expect(html5Broadcast.timeout.test(10)).to.be.true;
                            expect(html5Broadcast.timeout.test("10")).to.be.true;
                            expect(html5Broadcast.timeout.test(undefined)).to.be.true;
                            expect(html5Broadcast.timeout.test(null)).to.be.true;

                            expect(changeHtml5FrameStyles.to.test("mpu_iframe_content")).to.be.true;
                            expect(changeHtml5FrameStyles.css.test({"z-index": "10"})).to.be.true;
                            expect(changeHtml5FrameStyles.timeout.test(10)).to.be.true;
                            expect(changeHtml5FrameStyles.timeout.test("10")).to.be.true;
                            expect(changeHtml5FrameStyles.timeout.test(undefined)).to.be.true;
                            expect(changeHtml5FrameStyles.timeout.test(null)).to.be.true;

                            ACT.Event.fire.restore();
                            done();

                        } else {
                            ACT.Event.originalEventFire(event, data);
                        }

                    });

                    var contentHtml5 = new ACT.ContentHtml5(config);

                });

                it("should return false against invalid arguments", function(done){


                    ACT.Event.originalEventFire = ACT.Event.fire;
                    sinon.stub(ACT.Event, 'fire', function(event, data){

                        if (event === 'register:Actions'){

                            var html5Broadcast = data[0].argument;
                            var changeHtml5FrameStyles = data[1].argument;

                            expect(html5Broadcast.to.test(1)).to.be.false;
                            expect(html5Broadcast.to.test(null)).to.be.false;
                            expect(html5Broadcast.to.test(undefined)).to.be.false;
                            expect(html5Broadcast.name.test(1)).to.be.false;
                            expect(html5Broadcast.name.test(null)).to.be.false;
                            expect(html5Broadcast.name.test(undefined)).to.be.false;



                            expect(changeHtml5FrameStyles.to.test(1)).to.be.false;
                            expect(changeHtml5FrameStyles.to.test(null)).to.be.false;
                            expect(changeHtml5FrameStyles.to.test(undefined)).to.be.false;
                            expect(changeHtml5FrameStyles.css.test("z-index: 10")).to.be.false;
                            expect(changeHtml5FrameStyles.css.test(null)).to.be.false;
                            expect(changeHtml5FrameStyles.css.test(undefined)).to.be.false;


                            ACT.Event.fire.restore();
                            done();

                        } else {
                            ACT.Event.originalEventFire(event, data);
                        }

                    });

                    var contentHtml5 = new ACT.ContentHtml5(config);

                });

            });

        });

    });

    describe("Non-enabler config", function() {

        var contentHtml5, iframe, config = {
            type: "content-html5",
            id: "html5_container",
            classNode: "html5_class",
            env: ["html"],
            css: {
                width: '970px',
                height: '250px'
            },
            html5Config: {
                iframe: true,
                enaber: false,
                src: '<div id="contentTest">test content</div>',
                iframevars: {
                    clickTag: 'https://vn.yahoo.com'
                }
            }
        };

        it("should write src inside iframe and pass clickTag inside iframe", function(done) {

            var contentHtml5 = new ACT.ContentHtml5(config);
            var iframe = contentHtml5.getContent().node;

            var load = function() {

                iframe.removeEventListener("load", load);

                setTimeout(function() {

                    var iframeWindow = iframe.contentWindow;
                    var iframeDocument = iframeWindow.document;

                    var item = iframeDocument.getElementById('contentTest');

                    assert.strictEqual(item.id, 'contentTest');
                    assert.strictEqual(item.tagName, 'DIV');
                    assert.strictEqual(item.innerHTML, 'test content');

                    assert.isObject(iframeWindow.ACT, 'ACT should be available');
                    assert.strictEqual(iframeWindow.ACT.clickTag, 'https://vn.yahoo.com');

                    contentHtml5.destroy();
                    done();

                }, 1);
            };

            iframe.addEventListener("load", load);

            document.body.appendChild(iframe);

        });

    });

    describe("Enabler config", function() {

        var config = {
            type: "content-html5",
            id: "html5_container",
            classNode: "html5_class",
            env: ["html"],
            css: {
                width: '300px',
                height: '250px'
            },
            html5Config: {
                "src": '<div id="mainContent">example content</div><scr' + 'ipt></scr' + 'ipt>',
                "iframe": true,
                "enabler": true,
                "enablerPath": "https://s.yimg.com/cv/eng/externals/actjs/1.0.12/min/",
                iframevars: {
                    "exitUrls": {
                        clickTag: "https://uk.yahoo.com"
                    }
                }
            },
            trackingLabels: {
                "clickTag": 'template_click_button_clicktaghtml'
            },
            eventActions: [{
                eventType: "requestExpand",
                actions: [{
                    type: "html5Broadcast",
                    to: "html5_container",
                    name: "videoPlay"
                }]
            }, {
                eventType: "requestCollapse",
                actions: [{
                    type: "html5Broadcast",
                    to: "html5_container",
                    name: "videoPause"
                }]
            }]
        };

        it('should load Enabler instance inside iframe', function(done) {

            var contentHtml5 = new ACT.ContentHtml5(config);
            var iframe = contentHtml5.getContent().node;

            var backup = iframe.onload;

            var load = function() {

                iframe.onload = null;

                var iframeWindow = (this.contentWindow || this.contentDocument);
                var iframeDocument = (iframeWindow.document) ? iframeWindow.document : iframeWindow;

                sinon.stub(iframeDocument, 'write');

                Lang.bind(this, null, backup)();

                setTimeout(function() {

                    assert.isTrue(iframeDocument.write.firstCall.calledWith(sinon.match(/^<script/i)), 'open script tag');
                    assert.isTrue(iframeDocument.write.firstCall.calledWith(sinon.match(/><\/script>$/i)), 'close script tag');
                    assert.isTrue(iframeDocument.write.firstCall.calledWithMatch('src="https://s.yimg.com/cv/eng/externals/actjs/1.0.12/min/ACT_Enabler.js"'), 'Enabler link should be added');

                    iframeDocument.write.restore();
                    contentHtml5.destroy();
                    done();

                }, 1);
            };

            iframe.onload = load;

            document.body.appendChild(iframe);
        });

        it('should passing Enabler config into iframe', function(done) {

            var contentHtml5 = new ACT.ContentHtml5(config);
            var iframe = contentHtml5.getContent().node;

            var backup = iframe.onload;

            var load = function() {

                iframe.onload = null;

                var iframeWindow = (this.contentWindow || this.contentDocument);
                var iframeDocument = (iframeWindow.document) ? iframeWindow.document : iframeWindow;

                sinon.stub(iframeDocument, 'write');

                Lang.bind(this, null, backup)();

                setTimeout(function() {

                    assert.isTrue(iframeDocument.write.secondCall.calledWith(sinon.match(/^<script/i)), 'open script tag');
                    assert.isTrue(iframeDocument.write.secondCall.calledWith(sinon.match(/<\/script>$/i)), 'close script tag');
                    assert.isTrue(iframeDocument.write.secondCall.calledWith(sinon.match(/(Enabler.setConfig\()(.*)(\))/)), 'Enabler.setConfig should be added');

                    iframeDocument.write.restore();
                    contentHtml5.destroy();
                    done();

                }, 1);
            };

            iframe.onload = load;

            document.body.appendChild(iframe);
        });

        it('should passing correct clickTag and trackingLabels into iframe', function(done) {

            var contentHtml5 = new ACT.ContentHtml5(config);
            var iframe = contentHtml5.getContent().node;

            var backup = iframe.onload;

            var load = function() {

                iframe.onload = null;

                var iframeWindow = (this.contentWindow || this.contentDocument);
                var iframeDocument = (iframeWindow.document) ? iframeWindow.document : iframeWindow;

                sinon.stub(iframeDocument, 'write');

                Lang.bind(this, null, backup)();

                setTimeout(function() {

                    assert.isTrue(iframeDocument.write.secondCall.calledWith(sinon.match(/(Enabler.setConfig\()(.*)(\"exitUrls\"\:\{\"clickTag\"\:\"https\:\/\/uk.yahoo.com\"\})(.*)(\))/)));
                    assert.isTrue(iframeDocument.write.secondCall.calledWith(sinon.match(/(Enabler.setConfig\()(.*)(\"trackingLabels\"\:\{\"clickTag\"\:\"template_click_button_clicktaghtml\"\})(.*)(\))/)));

                    iframeDocument.write.restore();
                    contentHtml5.destroy();
                    done();

                }, 1);
            };

            iframe.onload = load;

            document.body.appendChild(iframe);
        });

        it('the onload event of the iframe should be available from the inside', function(done) {
            this.timeout(5000);

            var contentHtml5 = new ACT.ContentHtml5(config);
            var iframe = contentHtml5.getContent().node;

            var backup = iframe.onload;

            var load = function() {

                iframe.onload = null;

                var iframeWindow = (this.contentWindow || this.contentDocument);
                var iframeDocument = (iframeWindow.document) ? iframeWindow.document : iframeWindow;

                Lang.bind(this, null, backup)();

                setTimeout(function() {

                    iframeWindow.onload = function() {

                        assert.deepEqual(iframeWindow, this, "Not the same window");
                        contentHtml5.destroy();
                        done();
                    };

                }, 1);

            };

            iframe.onload = load;

            document.body.appendChild(iframe);
        });

    });

    describe("Iframe with url path", function() {

        var config = {
            type: "content-html5",
            id: "html5_container",
            css: {
                width: '300px',
                height: '500px'
            },
            html5Config: {
                "src": '<link rel=stylesheet href=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/styles/styles.css type=text/css><div class=container><div class=video-container><video class=video1 muted poster=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/poster-img.jpg><source src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/media/970x250.mp4 type=video/mp4></video></div><img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/shadow.jpg class=shadow><div class=star-map-elements><img class=loading-fr src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/loading.png> <img class=copy-1 src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/where.png> <img class=copy-2 src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/thedeparture.png> <img class=copy-3 src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/theroad.png> <img class=copy-4 src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/theedge.png></div><div class=end-frame><img class=copy-end src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/thenew.png> <img class=cta src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/explore.png></div><a id=clickArea target=_blank></a><div class=controls><div class=play-btn><img class=replay-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/replay.png> <img class=play-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/play.png> <img class=pause-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/pause.png></div><div class=sound-btn><img class=sound-on-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/sound-on.png> <img class=sound-off-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/sound-off.png></div></div></div><scr' + 'ipt type=text/javascript>var YAHOOPATH="https://s.yimg.com/cv/ae/jonathan/html5/test/dior/";</scr' + 'ipt><scr' + 'ipt src=https://s.yimg.com/cv/ae/jonathan/html5/iframe/f/script.js></scr' + 'ipt>',
                "iframe": true,
                "iframeUrlPath": "https://s.yimg.com/cv/ae/actjs/basic-iframe/0-0-1/test.html",
                iframevars: {
                    "exitUrls": {
                        "clickTag": "${CLICKURL?billboard_click_interactive_clicktaghtml}http://lattesafilm.tumblr.com/"
                    }
                }
            }
        };

        var invalidConfig = {
            type: "content-html5",
            id: "html5_container",
            css: {
                width: '300px',
                height: '500px'
            },
            html5Config: {
                "src": '<link rel=stylesheet href=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/styles/styles.css type=text/css><div class=container><div class=video-container><video class=video1 muted poster=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/poster-img.jpg><source src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/media/970x250.mp4 type=video/mp4></video></div><img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/shadow.jpg class=shadow><div class=star-map-elements><img class=loading-fr src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/loading.png> <img class=copy-1 src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/where.png> <img class=copy-2 src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/thedeparture.png> <img class=copy-3 src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/theroad.png> <img class=copy-4 src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/theedge.png></div><div class=end-frame><img class=copy-end src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/thenew.png> <img class=cta src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/explore.png></div><a id=clickArea target=_blank></a><div class=controls><div class=play-btn><img class=replay-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/replay.png> <img class=play-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/play.png> <img class=pause-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/pause.png></div><div class=sound-btn><img class=sound-on-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/sound-on.png> <img class=sound-off-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/sound-off.png></div></div></div><scr' + 'ipt type=text/javascript>var YAHOOPATH="https://s.yimg.com/cv/ae/jonathan/html5/test/dior/";</scr' + 'ipt><scr' + 'ipt src=https://s.yimg.com/cv/ae/jonathan/html5/iframe/f/script.js></scr' + 'ipt>',
                "iframe": true,
                "iframeUrlPath": "https://s.yimg.com/cv/ae/actjs/basic-iframe/0-0-1/test.html",
                iframevars: "${CLICKURL?billboard_click_interactive_clicktaghtml}http://lattesafilm.tumblr.com/"
            }
        };

        it("should render node with attribute using valid iframevars config", function(done) {

            var contentHtml5 = new ACT.ContentHtml5(config);
            var node = contentHtml5.getContent().node;

            document.body.appendChild(node);

            var name = JSON.parse(decodeURI(node.getAttribute("name")));
            assert.strictEqual('${CLICKURL?billboard_click_interactive_clicktaghtml}http://lattesafilm.tumblr.com/', name.exitUrls.clickTag, 'wrong JSON data passed');

            contentHtml5.destroy();
            done();

        });

        it("should render node without attribute using invalid iframevars config", function(done) {

            var contentHtml5 = new ACT.ContentHtml5(invalidConfig);
            var node = contentHtml5.getContent().node;

            document.body.appendChild(node);

            var name = JSON.parse(decodeURI(node.getAttribute("name")));
            assert.strictEqual(null, name, 'iframe attribute found when invalid');

            contentHtml5.destroy();
            done();

        });

    });

    describe("ACT global event", function() {

        var config = {
            type: "content-html5",
            id: "html5_container",
            css: {
                width: '300px',
                height: '500px'
            },
            resize: {
                sizeFrom: 'root'
            },
            html5Config: {
                "src": '<link rel=stylesheet href=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/styles/styles.css type=text/css><div class=container><div class=video-container><video class=video1 muted poster=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/poster-img.jpg><source src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/media/970x250.mp4 type=video/mp4></video></div><img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/shadow.jpg class=shadow><div class=star-map-elements><img class=loading-fr src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/loading.png> <img class=copy-1 src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/where.png> <img class=copy-2 src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/thedeparture.png> <img class=copy-3 src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/theroad.png> <img class=copy-4 src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/theedge.png></div><div class=end-frame><img class=copy-end src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/thenew.png> <img class=cta src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/explore.png></div><a id=clickArea target=_blank></a><div class=controls><div class=play-btn><img class=replay-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/replay.png> <img class=play-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/play.png> <img class=pause-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/pause.png></div><div class=sound-btn><img class=sound-on-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/sound-on.png> <img class=sound-off-img src=https://s.yimg.com/cv/ae/jonathan/html5/test/dior/images/sound-off.png></div></div></div><scr' + 'ipt type=text/javascript>var YAHOOPATH="https://s.yimg.com/cv/ae/jonathan/html5/test/dior/";</scr' + 'ipt><scr' + 'ipt src=https://s.yimg.com/cv/ae/jonathan/html5/iframe/f/script.js></scr' + 'ipt>',
                "iframe": true
            }
        };

        it("Check resize", function(done) {

            var contentHtml5 = new ACT.ContentHtml5(config);
            var node = contentHtml5.getContent().node;
            var container = document.createElement('div');
            container.style.width = '500px';
            container.style.height = '250px';
            container.appendChild(node);
            document.body.appendChild(container);

            Event.fire('screen:status', {
                screenWidth: '1024px',
                screenHeight: '800px'
            });

            assert.strictEqual('1024px', node.style.width, 'wrong new width');
            assert.strictEqual('800px', node.style.height, 'wrong new height');

            contentHtml5.destroy();
            done();
        });

    });

    describe("Communication with child iframe", function() {

        describe("send message to child", function() {

            it('should send iframe child via post message', function(done) {

                var contentHtml5 = new ACT.ContentHtml5({
                    id: 'content-html5',
                    type: 'content-html5',
                    html5Config: {
                        iframe: true
                    }
                });
                var iframe = contentHtml5.getContent().node;
                document.body.appendChild(iframe);

                sinon.stub(iframe.contentWindow, 'postMessage');

                contentHtml5.broadcastToHtml5('messageContent');
                expect(iframe.contentWindow.postMessage.calledWith(sinon.match({
                    eventName: 'html5:message',
                    message: 'messageContent'
                }))).to.be.true;

                iframe.contentWindow.postMessage.restore();
                contentHtml5.destroy();
                done();

            });

            it('should send to div child via event', function(done) {

                var contentHtml5 = new ACT.ContentHtml5({
                    id: 'content-html5',
                    type: 'content-html5',
                    html5Config: {
                        iframe: false
                    }
                });

                var tmp = Event.on('html5:message', function(e) {
                    tmp.remove();
                    assert.deepEqual(e, {
                        message: 'contentFromChild'
                    });
                    contentHtml5.destroy();
                    done();
                });

                contentHtml5.broadcastToHtml5('contentFromChild');

            });
        });

        describe('receive message from child', function() {

            describe('via postMessage', function() {

                it('should fire event if message data has type', function(done) {

                    var contentHtml5 = new ACT.ContentHtml5({
                        id: 'content-html5',
                        type: 'content-html5',
                        html5Config: {
                            iframe: true
                        }
                    });
                    document.body.appendChild(contentHtml5.getContent().node);

                    var contentWindow = contentHtml5.get('node').contentWindow;

                    var tmp = Event.on('doingSomething', function(e) {
                        tmp.remove();

                        assert.ok(true, 'event called so it is passed');

                        contentHtml5.destroy();
                        done();
                    });

                    Event.fire("message", {
                        data: {
                            type: 'doingSomething'
                        },
                        source: contentWindow

                    }, window);

                });

                it('should fire action if mesage data has actions', function(done) {

                    var contentHtml5 = new ACT.ContentHtml5({
                        id: 'content-html5',
                        type: 'content-html5',
                        html5Config: {
                            iframe: true
                        }
                    });
                    document.body.appendChild(contentHtml5.getContent().node);

                    var contentWindow = contentHtml5.get('node').contentWindow;

                    var tmp = Event.on('add:actions', function(e) {
                        tmp.remove();

                        assert.deepEqual(e, {
                            type: 'openURL',
                            URLpath: 'http://uk.yahoo.com',
                            URLname: 'yahoo'
                        });

                        contentHtml5.destroy();
                        done();
                    });

                    Event.fire("message", {
                        data: {
                            actions: {
                                type: 'openURL',
                                URLpath: 'http://uk.yahoo.com',
                                URLname: 'yahoo'
                            }
                        },
                        source: contentWindow

                    }, window);
                });

                it('should fire Enabler event if message data has Enabler data', function(done) {

                    var contentHtml5 = new ACT.ContentHtml5({
                        id: 'content-html5',
                        type: 'content-html5',
                        html5Config: {
                            iframe: true
                        }
                    });
                    document.body.appendChild(contentHtml5.getContent().node);

                    var contentWindow = contentHtml5.get('node').contentWindow;

                    var tmp = Event.on('Enabler:actions', function(e) {
                        tmp.remove();

                        assert.deepEqual(e, {
                            id: 'action',
                            frameId: 'content-html5',
                            actionName: 'something'
                        });

                        contentHtml5.destroy();
                        done();
                    });

                    Event.fire("message", {
                        data: {
                            EnablerData: {
                                id: 'action',
                                frameId: 'something',
                                actionName: 'something'
                            }
                        },
                        source: contentWindow

                    }, window);

                });

            });

            describe('via enabler event', function() {

                it('should fire tracking if action is track', function(done) {

                    var contentHtml5 = new ACT.ContentHtml5({
                        id: 'content-html5',
                        type: 'content-html5',
                        html5Config: {
                            iframe: true,
                            enabler: true
                        },
                        trackingLabels: {
                            random: 'label_for_random'
                        }
                    });
                    contentHtml5.getContent();

                    var tmp = Event.on('add:actions', function(e) {
                        tmp.remove();

                        assert.deepEqual(e, {
                            type: 'track',
                            label: 'label_for_random'
                        });

                        contentHtml5.destroy();
                        done();
                    });

                    Event.fire("Enabler:actions", {
                        id: 'random',
                        frameId: 'content-html5',
                        actionName: 'track',
                        url: null,
                        special: null
                    });
                });

                it('should do action base on action name', function(done) {

                    var contentHtml5 = new ACT.ContentHtml5({
                        id: 'content-html5',
                        type: 'content-html5',
                        html5Config: {
                            iframe: true,
                            enabler: true
                        },
                        trackingLabels: {
                            random: 'label_for_random'
                        },
                        eventConfig: [{
                            eventType: 'requestCollapse',
                            actions: [{
                                type: 'stopLayer',
                                to: 'expandable'
                            }]
                        }]
                    });
                    contentHtml5.getContent();

                    var tmp = Event.on('add:actions', function(e) {
                        tmp.remove();

                        assert.deepEqual(e, [{
                            type: 'stopLayer',
                            to: 'expandable'
                        }]);

                        contentHtml5.destroy();
                        done();
                    });

                    Event.fire("Enabler:actions", {
                        id: 'requestCollapse',
                        frameId: 'content-html5',
                        actionName: 'collapse',
                        url: null,
                        special: null
                    });
                });

            });

        });

    });

    describe("Defined acions", function() {

        var contentHtml5, registeredActions;

        before(function(done) {

            var actionsListener = Event.on('register:Actions', function(e) {
                actionsListener.remove();
                registeredActions = e;
                done();
            });

            contentHtml5 = new ACT.ContentHtml5({
                id: 'mpu-content-html5',
                type: 'content-html5',
                css: {
                    width: '300px',
                    height: '250px'
                },
                html5Config: {
                    iframe: true
                }
            });

            document.body.appendChild(contentHtml5.getContent().node);
        });

        after(function() {
            contentHtml5.destroy();
        });

        it('should register correct actions', function(done) {
            assert.isArray(registeredActions, 'action list must be array');
            assert.strictEqual(registeredActions.length, 2, 'there must be 2 actions registered');

            // first action - html5Broadcast
            var html5Broadcast = registeredActions[0];
            assert.strictEqual(html5Broadcast.type, 'html5Broadcast');
            assert.property(html5Broadcast, 'argument');
            assert.property(html5Broadcast, 'process');
            assert.isFunction(html5Broadcast.process);

            // second action - changeHtml5FrameStyles
            var changeHtml5FrameStyles = registeredActions[1];
            assert.strictEqual(changeHtml5FrameStyles.type, 'changeHtml5FrameStyles');
            assert.property(changeHtml5FrameStyles, 'argument');
            assert.property(changeHtml5FrameStyles, 'process');
            assert.isFunction(changeHtml5FrameStyles.process);

            done();
        });

        describe('html5Broadcast action', function() {

            it('should check argument correctly', function(done) {
                var args = registeredActions[0].argument;

                assert.isTrue(args.to.test('content-html'));
                assert.isFalse(args.to.test(123));

                assert.isTrue(args.name.test('mesageCOnten'));
                assert.isFalse(args.name.test(123));

                done();
            });

            it('should send message to target frame', function(done) {
                var html5Broadcast = registeredActions[0];
                var iframe = contentHtml5.get('node');

                sinon.stub(iframe.contentWindow, 'postMessage');

                html5Broadcast.process(1, {
                    to: 'mpu-content-html5',
                    name: 'messageContent'
                });

                assert.isTrue(iframe.contentWindow.postMessage.calledWithMatch({
                    eventName: 'html5:message',
                    message: 'messageContent'
                }));

                iframe.contentWindow.postMessage.restore();
                done();

            });
        });

        describe('changeHtml5FrameStyles', function() {

            it('should check argument correctly', function(done) {
                var args = registeredActions[1].argument;

                assert.isTrue(args.to.test('content-html5'));
                assert.isFalse(args.to.test(true));

                assert.isTrue(args.css.test({
                    width: '300px'
                }));
                assert.isFalse(args.css.test('random thing'));

                done();
            });

            it('shoud change style of iframe', function(done) {
                var actionDef = registeredActions[1];
                var iframe = contentHtml5.get('node');

                actionDef.process(1, {
                    to: 'mpu-content-html5',
                    css: {
                        height: "600px"
                    }
                });

                assert.equal(iframe.style.height, '600px');
                assert.equal(iframe.style.width, '300px');

                done();
            });
        });

    });
});