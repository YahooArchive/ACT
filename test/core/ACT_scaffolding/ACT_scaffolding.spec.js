describe("ACT_Scaffolding", function() {

    var expect = chai.expect;
    var assert = chai.assert;


    // Fake Capabilities
    before(function() {
        ACT.ContentSwf = function(config) {
            this.id = config.id;
            this.getContent = function(env, orientation) {
                var node = document.createElement('object');
                node.id = this.id;
                return {
                    node: node
                }
            }
        };
        ACT.ContentImg = function(config) {
            this.id = config.id;

            this.getContent = function(env, orientation) {
                var node = document.createElement('img');
                node.id = this.id;
                return {
                    node: node
                }
            }
        };

        ACT.ContentContainer = function(config) {
            this.id = config.id;

            this.getContent = function(env, orientation) {
                var node = document.createElement('div');
                node.id = this.id;
                return {
                    node: node
                }
            }
        };

    });

    after(function(){});

    describe("Scaffolding: Check the init state", function() {

        it("should have ACT.Scaffolding instance", function() {
            expect(ACT.Scaffolding).to.exist;
        });

        it("should able to create Scaffolding instance", function(){
            var scaffolding = new ACT.Scaffolding({
                refObj: {},
                env: 'flash',
                status: null,
                layerName: 'mpu'
            });

            expect(scaffolding).to.be.instanceOf(ACT.Scaffolding);
        });
    });

    describe('Html Parsed: check appended value', function() {

        before(function() {
            this.config = {
                'type': 'contentContainer',
                'id': 'billboardContainer',
                'env': [
                    'flash',
                    'backup'
                ],
                'content': [{
                    'type': 'contentSwf',
                    'id': 'swf_1_1',
                    'env': ['flash'],
                    'swfConfig': {
                        'asset': '',
                        'flashvars': {}
                    }
                }, {
                    'type': 'contentContainer',
                    'id': 'backupContainer',
                    'env': ['backup'],
                    'content': [{
                        'type': 'contentImg',
                        'id': 'backupImg',
                        'env': ['backup']
                    }, {
                        'type': 'contentImg',
                        'id': 'backupImgEnv',
                        'env': ["backup"]
                    }]
                }]
            };

            this.backupEnvConfig = {
                'type': 'contentContainer',
                'id': 'billboardContainer',
                'env': [
                    'flash',
                    'backup'
                ],
                'content': [{
                    'type': 'contentSwf',
                    'id': 'swf_1_1',
                    'env': ['flash'],
                    'swfConfig': {
                        'asset': '',
                        'flashvars': {}
                    }
                }, {
                    'type': 'contentContainer',
                    'id': 'backupContainer',
                    'env': ['backup'],
                    'content': [{
                        'type': 'contentImg',
                        'id': 'backupImg',
                        'env': [{
                            'backup':{
                                "min-height": "300",
                                "max-height": "600",
                                "max-width": "1200",
                                "min-width": "1000"
                            }
                        }]
                    }, {
                        'type': 'contentImg',
                        'id': 'backupImgEnv',
                        'env': [{
                            "backup": {
                                "min-height": "300",
                                "max-height": "400",
                                "max-width": "930",
                                "min-width": "900"
                            }
                        }]
                    }]
                }]
            };
            this.status = {
                orientation: 'p',
                screenHeight: '345',
                screenWidth: '1073'
            };

        });

        it("render with html env", function() {

            var Scaffolding = new ACT.Scaffolding({
                refObj: this.config,
                env: 'html',
                status: this.status,
                layerName: 'mpu'
            });

            var node = Scaffolding.get('htmlParsed');
            assert.isFalse(node, 'result must be false');

            var capabilityInstances = Scaffolding.getHtmlParsered().capabilityInstances;
            assert.isArray(capabilityInstances, 'rendered capability Instances must be saved');
            assert.equal(capabilityInstances.length, 0, 'no Capabilities rendered');
        });

        it("render with flash env", function() {

            var expectedHtml = '<div id="billboardContainer"><object id="swf_1_1"></object></div>';

            var Scaffolding = new ACT.Scaffolding({
                refObj: this.config,
                env: 'flash',
                status: this.status,
                layerName: 'mpu'
            });

            var node = Scaffolding.get('htmlParsed');

            var wrapper = document.createElement('div');
            wrapper.appendChild(node);
            assert.instanceOf(node, HTMLElement, "result node must be instance of HTMLElement");
            expect(expectedHtml).to.equal(wrapper.innerHTML, "returned html is wrong");

            var capabilityInstances = Scaffolding.getHtmlParsered().capabilityInstances;
            assert.isArray(capabilityInstances, 'rendered capability Instances must be saved');
            assert.equal(capabilityInstances.length, 2, '2 Capabilities rendered');

        });

        it("render with backup env", function() {

            var expectedHtml = '<div id="billboardContainer"><div id="backupContainer"><img id="backupImg"><img id="backupImgEnv"></div></div>';

            var Scaffolding = new ACT.Scaffolding({
                refObj: this.config,
                env: 'backup',
                status: this.status,
                layerName: 'floating'
            });

            var node = Scaffolding.get('htmlParsed');

            var wrapper = document.createElement('div');
            wrapper.appendChild(node);

            assert.instanceOf(node, HTMLElement, "result node must be instance of HTMLElement");
            expect(expectedHtml).to.equal(wrapper.innerHTML, "returned html is wrong");

            var capabilityInstances = Scaffolding.getHtmlParsered().capabilityInstances;
            assert.isArray(capabilityInstances, 'rendered capability Instances must be saved');
            assert.equal(capabilityInstances.length, 4, '4 Capabilities rendered');
        });

        it("does not render with backup env and element width is out of scope ", function() {

            var expectedHtml = '<div id="billboardContainer"><div id="backupContainer"><img id="backupImg"></div></div>';

            var Scaffolding = new ACT.Scaffolding({
                refObj: this.backupEnvConfig,
                env: 'backup',
                status: this.status,
                layerName: 'expandable'
            });

            var node = Scaffolding.get('htmlParsed');

            var wrapper = document.createElement('div');
            wrapper.appendChild(node);

            assert.instanceOf(node, HTMLElement, "result node must be instance of HTMLElement");
            expect(expectedHtml).to.equal(wrapper.innerHTML, "rendered html should not include image with wrong width");

            var capabilityInstances = Scaffolding.getHtmlParsered().capabilityInstances;
            assert.isArray(capabilityInstances, 'rendered capability Instances must be saved');
            assert.equal(capabilityInstances.length, 3, '3 Capabilities rendered');
        });

        it("does not render with backup env and element height is out of scope ", function() {

            var expectedHtml = '<div id="billboardContainer"><div id="backupContainer"></div></div>';

            var Scaffolding = new ACT.Scaffolding({
                refObj: this.backupEnvConfig,
                env: 'backup',
                status: {
                    orientation: 'p',
                    screenHeight: '700',
                    screenWidth: '1073'
                },
                layerName: 'expandable'
            });

            var node = Scaffolding.get('htmlParsed');

            var wrapper = document.createElement('div');
            wrapper.appendChild(node);

            assert.instanceOf(node, HTMLElement, "result node must be instance of HTMLElement");
            expect(expectedHtml).to.equal(wrapper.innerHTML, "rendered html should not include image with wrong width");

            var capabilityInstances = Scaffolding.getHtmlParsered().capabilityInstances;
            assert.isArray(capabilityInstances, 'rendered capability Instances must be saved');
            assert.equal(capabilityInstances.length, 2, '2 Capabilities rendered');
        });

    });

});