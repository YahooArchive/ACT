var expect = chai.expect;
var assert = chai.assert;

var Event = ACT.Event;
var Lang = ACT.Lang;
var Dom = ACT.Dom;
var Class = ACT.Class;
var Capability = ACT.Capability;

describe('ContentThirdParty', function() {

    var thirpartyIframe = document.createElement('div');
    thirpartyIframe.id = "thirdparty-iframe";
    thirpartyIframe.innerHTML = "<!--<script language='JavaScript1.1' src='https://ad.doubleclick.net/adj/N7480.285959YAHOO.COM/B8203653.110762464;sz=970x250;click=${CLICKURL};ord=${REQUESTID}?'></script>-->";
    document.body.appendChild(thirpartyIframe);

    describe("Check the init state", function() {

        var iframe_config = {
            type: "content-thirdparty",
            id: "thirdparty_container",
            classNode: "thirdparty_class",
            env: ["flash", "html"],
            thirdPartyConfig: {
                "id": "thirdparty-iframe",
                "iframe": true
            },
            eventActions: []
        };

        var div_config = {
            type: "content-thirdparty",
            id: "thirdparty_container",
            classNode: "thirdparty_class",
            env: ["flash", "html"],
            thirdPartyConfig: {
                "id": "thirdparty-iframe",
                "iframe": false
            },
            eventActions: []
        };

        it("should have ACT.ContentThirdParty instance", function() {
            expect(ACT.ContentThirdParty).to.exist;
        });

        it("should have ACT.Event instance", function() {
            expect(Event).to.exist;
        });

        it("should have ACT.Lang instance", function() {
            expect(Lang).to.exist;
        });

        it("should have ACT.Dom instance", function() {
            expect(Dom).to.exist;
        });

        it("should have ACT.Class instance", function() {
            expect(Class).to.exist;
        });

        it("should have ACT.Capability instance", function() {
            expect(Capability).to.exist;
        });

        describe("Check ATTRS", function() {

            var contentThirdParty = new ACT.ContentThirdParty(iframe_config);
            var node = contentThirdParty.getContent().node;

            it("Should have NAME", function() {
                expect(contentThirdParty.ATTRS.NAME).to.exist;
                assert.strictEqual(contentThirdParty.ATTRS.NAME, 'ContentThirdParty', 'Name is not ContentThirdParty');
            });

            it("Should have version", function() {
                expect(contentThirdParty.ATTRS).to.exist;
            });

            it("Should have configObject", function() {
                expect(contentThirdParty.ATTRS.configObject).to.exist;
                assert.isObject(contentThirdParty.ATTRS.configObject);
            });

            it("Should node be null", function() {
                expect(contentThirdParty.ATTRS.node).to.exist;
                assert.isNotNull(contentThirdParty.ATTRS.node);
            });

            it("Should have eventList", function() {
                expect(contentThirdParty.ATTRS.eventList).to.exist;
                assert.isArray(contentThirdParty.ATTRS.eventList);
            });

            contentThirdParty.destroy();

        });

        describe("register actions", function(){

            it("should return true against valid arguments", function(done){


                ACT.Event.originalEventFire = ACT.Event.fire;
                sinon.stub(ACT.Event, 'fire', function(event, data){

                    if (event === 'register:Actions'){

                        var thirdpartyStart = data[0].argument;
                        var thirdpartyStop = data[1].argument;
                        var thirdpartyBroadcast = data[2].argument;

                        expect(thirdpartyStart.to.test("mpu_iframe_content")).to.be.true;
                        expect(thirdpartyStart.timeout.test(10)).to.be.true;
                        expect(thirdpartyStart.timeout.test("10")).to.be.true;
                        expect(thirdpartyStart.timeout.test(undefined)).to.be.true;
                        expect(thirdpartyStart.timeout.test(null)).to.be.true;

                        expect(thirdpartyStop.to.test("mpu_iframe_content")).to.be.true;
                        expect(thirdpartyStop.timeout.test(10)).to.be.true;
                        expect(thirdpartyStop.timeout.test("10")).to.be.true;
                        expect(thirdpartyStop.timeout.test(undefined)).to.be.true;
                        expect(thirdpartyStop.timeout.test(null)).to.be.true;

                        expect(thirdpartyBroadcast.to.test("mpu_iframe_content")).to.be.true;
                        expect(thirdpartyBroadcast.name.test("do_this_action")).to.be.true;
                        expect(thirdpartyBroadcast.timeout.test(10)).to.be.true;
                        expect(thirdpartyBroadcast.timeout.test("10")).to.be.true;
                        expect(thirdpartyBroadcast.timeout.test(undefined)).to.be.true;
                        expect(thirdpartyBroadcast.timeout.test(null)).to.be.true;

                        ACT.Event.fire.restore(); 
                        done();

                    } else {
                        ACT.Event.originalEventFire(event, data);
                    }
                
                });

                var contentThirdParty = new ACT.ContentThirdParty(iframe_config);
              
            });

            it("should return false against invalid arguments", function(done){


                ACT.Event.originalEventFire = ACT.Event.fire;
                sinon.stub(ACT.Event, 'fire', function(event, data){

                    if (event === 'register:Actions'){

                        var thirdpartyStart = data[0].argument;
                        var thirdpartyStop = data[1].argument;
                        var thirdpartyBroadcast = data[2].argument;

                        expect(thirdpartyStart.to.test(1)).to.be.false;
                        expect(thirdpartyStart.to.test(null)).to.be.false;
                        expect(thirdpartyStart.to.test(undefined)).to.be.false;

                        expect(thirdpartyStop.to.test(1)).to.be.false;
                        expect(thirdpartyStop.to.test(null)).to.be.false;
                        expect(thirdpartyStop.to.test(undefined)).to.be.false;

                        expect(thirdpartyBroadcast.to.test(1)).to.be.false;
                        expect(thirdpartyBroadcast.to.test(null)).to.be.false;
                        expect(thirdpartyBroadcast.to.test(undefined)).to.be.false;
                        expect(thirdpartyBroadcast.name.test(1)).to.be.false;
                        expect(thirdpartyBroadcast.name.test(null)).to.be.false;
                        expect(thirdpartyBroadcast.name.test(undefined)).to.be.false;

                        ACT.Event.fire.restore(); 
                        done();

                    } else {
                        ACT.Event.originalEventFire(event, data);
                    }
                
                });

                var contentThirdParty = new ACT.ContentThirdParty(iframe_config);
              
            });

        });

        describe("Check all functions", function() {


            var iframe_config = {
                type: "content-thirdparty",
                id: "thirdparty_container",
                classNode: "thirdparty_class",
                env: ["flash", "html"],
                thirdPartyConfig: {
                    "id": "thirdparty-iframe",
                    "iframe": true
                },
                eventActions: []
            };

            var iframe_src_config = {
                type: "content-thirdparty",
                id: "thirdparty_container",
                classNode: "thirdparty_class",
                env: ["flash", "html"],
                thirdPartyConfig: {
                    "id": "thirdparty-iframe",
                    "iframe": true,
                    src: "https://s.yimg.com/cv/ae/actjs/basic-iframe/0-0-1/test.html"
                },
                eventActions: []
            };

            var div_config = {
                type: "content-thirdparty",
                id: "thirdparty_container",
                classNode: "thirdparty_class",
                env: ["flash", "html"],
                thirdPartyConfig: {
                    "id": "thirdparty-iframe",
                    "iframe": false
                },
                eventActions: []
            };

           

            it("Should have startThirdParty", function() {
                var contentThirdParty = new ACT.ContentThirdParty(iframe_config);

                expect(contentThirdParty.startThirdParty).to.exist;
                assert.isFunction(contentThirdParty.startThirdParty);

                contentThirdParty.destroy();
            });

            it("Should have stopThirdParty", function() {
                var contentThirdParty = new ACT.ContentThirdParty(iframe_config);

                expect(contentThirdParty.stopThirdParty).to.exist;
                assert.isFunction(contentThirdParty.stopThirdParty);

                contentThirdParty.destroy();                
            });

            it("Should render within iframe on init", function(){
                var contentThirdParty = new ACT.ContentThirdParty(iframe_config);
                var node = contentThirdParty.getContent().node;
                expect(node.tagName.toLowerCase()).is.equal("iframe");
                expect(node.getAttribute('src')).is.equal(null);
                contentThirdParty.destroy();  
            });

            it("Should render cross-origin src within iframe on init", function(){
                var contentThirdParty = new ACT.ContentThirdParty(iframe_src_config);
                var node = contentThirdParty.getContent().node;
                expect(node.tagName.toLowerCase()).is.equal("iframe");
                expect(node.getAttribute('src')).is.equal(iframe_src_config.thirdPartyConfig.src);
                contentThirdParty.destroy();  
            });

            it("Should render within div on init", function(){
                var contentThirdParty = new ACT.ContentThirdParty(div_config);
                var node = contentThirdParty.getContent().node;
                expect(node.tagName.toLowerCase()).is.equal("div");
                contentThirdParty.destroy();  
            });

        });

    });

    describe("Check actions, events and methods", function() {

        var iframe_config = {
            type: "content-thirdparty",
            id: "thirdparty_container",
            classNode: "thirdparty_class",
            env: ["flash", "html"],
            css: {
                width: '970px',
                height: '250px'
            },
            thirdPartyConfig: {
                "id": "thirdparty-iframe",
                "iframe": true
            },
            eventActions: [{
                eventType: "closeEvent",
                actions: [{}]
            }, {
                eventType: "openEvent",
                actions: [{}]
            }, {
                eventType: "expandEvent",
                actions: [{
                    type: "thirdpartyBroadcast",
                    to: "thirdparty_container",
                    name: "expandedEvent"
                }]
            }, {
                eventType: "contractEvent",
                actions: [{
                    type: "thirdpartyBroadcast",
                    to: "thirdparty_container",
                    name: "contractedEvent"
                }]
            }]
        };

        var iframe_invalid_event_config = {
            type: "content-thirdparty",
            id: "thirdparty_container",
            classNode: "thirdparty_class",
            env: ["flash", "html"],
            css: {
                width: '970px',
                height: '250px'
            },
            thirdPartyConfig: {
                "id": "thirdparty-iframe",
                "iframe": true
            },
            eventActions: [{
                eventType: "containerShow",
                actions: [{}]
            }]
        };

        it("Check actions", function(done) {

            var actions = null;

            var listener = Event.on('register:Actions', function(e) {
                actions = e;

                listener.remove();
            });

            var contentThirdParty = new ACT.ContentThirdParty(iframe_config);

            assert.isArray(actions, 'reigstered action must be array');
            assert.isObject(actions[0], 'first actions must be an Object');
            assert.strictEqual('thirdpartyStart', actions[0].type, 'first action is wrong');
            assert.strictEqual('thirdpartyStop', actions[1].type, 'second action is wrong');

            var i = e = 0,
                actionParamType = [
                    [''],
                    [''],
                    ['', '']
                ];

            for (var action in actions) {
                var argDefinition = actions[action].argument;
                assert.isFunction(actions[action].process);

                for (var param in argDefinition) {
                    var definition = argDefinition[param];
                    var test = definition.test(actionParamType[i][e]);
                    assert.strictEqual(true, test, 'test value type failed');
                    e++;
                }
                i++;
                e = 0;
            }

            contentThirdParty.destroy();
            done();

        });

        it("Check custom events with invalid event config", function(done){

            var contentThirdParty = new ACT.ContentThirdParty(iframe_invalid_event_config);
            var node = contentThirdParty.getContent().node;
            node.onload = function() {

                // expand
                var expandedEvent = false;
                document.addEventListener('thirdparty:expandedEvent', function() {
                    expandedEvent = true;
                });

                Event.fire('thirdparty:broadcast', {
                    containerId: node.id,
                    name: "expandadEvent"
                });

                expect(expandedEvent).to.be.false;
                
                contentThirdParty.destroy();
                done();
            };

            document.body.appendChild(node);
        });

        it("Check custom events", function(done) {

            var contentThirdParty = new ACT.ContentThirdParty(iframe_config);
            var node = contentThirdParty.getContent().node;

            node.onload = function() {

                // expand
                var expandedEvent = false;
                document.addEventListener('thirdparty:expandedEvent', function() {
                    expandedEvent = true;
                });
                Event.fire('thirdparty:broadcast', {
                    containerId: node.id,
                    name: "expandedEvent"
                });
                expect(expandedEvent).to.be.true;

                // contract
                var contractedEvent = false;
                document.addEventListener('thirdparty:contractedEvent', function() {
                    contractedEvent = true;
                });
                Event.fire('thirdparty:broadcast', {
                    containerId: node.id,
                    name: "contractedEvent"
                });
                expect(contractedEvent).to.be.true;

                // open
                var openedEvent = false;
                document.addEventListener('thirdparty:openedEvent', function() {
                    openedEvent = true;
                });
                Event.fire('thirdparty:broadcast', {
                    containerId: node.id,
                    name: "openedEvent"
                });
                expect(openedEvent).to.be.true;

                // close
                var closedEvent = false;
                document.addEventListener('thirdparty:closedEvent', function() {
                    closedEvent = true;
                });
                Event.fire('thirdparty:broadcast', {
                    containerId: node.id,
                    name: "closedEvent"
                });
                expect(closedEvent).to.be.true;

                contentThirdParty.destroy();
                done();
            };

            document.body.appendChild(node);

        });

        it("Check events", function(done) {

            var contentThirdParty = new ACT.ContentThirdParty(iframe_config);
            var node = contentThirdParty.getContent().node;

            node.onload = function() {

                sinon.spy(Event, 'fire');

                Event.fire('thirdparty:start', {
                    containerId: node.id
                });
                expect(Event.fire.calledWith('thirdparty:start', sinon.match.object.and(sinon.match.has('containerId', node.id)))).to.be.true;

                Event.fire('thirdparty:stop', {
                    containerId: node.id
                });
                expect(Event.fire.calledWith('thirdparty:stop', sinon.match.object.and(sinon.match.has('containerId', node.id)))).to.be.true;

                Event.fire.restore();

                contentThirdParty.destroy();
                done();
            };

            document.body.appendChild(node);

        });

    });

    describe("Check ACT global event", function() {

        var iframe_config = {
            type: "content-thirdparty",
            id: "thirdparty_container",
            css: {
                width: '300px',
                height: '500px'
            },
            resize: {
                sizeFrom: 'root'
            },
            thirdPartyConfig: {
                "id": "thirdparty-iframe",
                "iframe": true
            }
        };

        it("Check resize and stop", function(done) {

            var contentThirdParty = new ACT.ContentThirdParty(iframe_config);
            var node = contentThirdParty.getContent().node;
            
            node.onload = function() {

                Event.fire('screen:status', {
                    screenWidth: '1024px',
                    screenHeight: '800px'
                });

                assert.strictEqual('1024px', node.style.width, 'wrong new width');
                assert.strictEqual('800px', node.style.height, 'wrong new height');

                // has to be tested somehow
                Event.fire('STOP_CONTENT');

                contentThirdParty.destroy();
                done();

            };

            var container = document.createElement('div');
            container.style.width = '500px';
            container.style.height = '250px';
            container.appendChild(node);
            document.body.appendChild(container);
        });
    });
});