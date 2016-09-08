describe("ACT_LayerStandard", function() {

    var expect = chai.expect;
    var assert = chai.assert;
    var event = ACT.event;

    // fake Scaffolding module
    ACT.define('Scaffolding', [], function(ACT) {
        console.log('Scaffolding loaded');

        var Scaffolding = function(config) {
            for (var i in config) {
                this[i] = config[i];
            }

            this.node = document.createElement('div');
            this.node.id = config.refObj.id;
        };

        Scaffolding.ATTRS = {
            "NAME": "Scaffolding",
            "version": "0.0.0"
        }

        Scaffolding.prototype.getHtmlParsered = function() {
            return {
                rawHtml: this.node,
                capabilityInstances: []
            };
        }

        return Scaffolding;
    });

    var body = document.getElementsByTagName('body')[0];

    before(function() {
        sinon.stub(body, 'appendChild');
    });

    after(function() {
        body.appendChild.restore();
    });

    it("LayerStandard available", function(done) {

        expect(ACT.LayerStandard).is.exist;

        done();
    });

    describe("Test constructor", function() {

        beforeEach(function() {
            sinon.stub(ACT.LayerStandard.prototype, 'createContainer');
            sinon.stub(ACT.LayerStandard.prototype, 'addContent');
        });

        afterEach(function() {
            ACT.LayerStandard.prototype.createContainer.restore();
            ACT.LayerStandard.prototype.addContent.restore();
        });

        it("should be initialized", function(done) {

            var LayerStandard = new ACT.LayerStandard({
                base: '#frescoAd',
                layerName: 'mpu'
            });

            expect(LayerStandard, 'LayerStandard').is.exist;
            expect(LayerStandard.get('config'), 'config').to.be.a('object');
            expect(LayerStandard.get('config'), 'config.layer').to.have.property('layerName').to.be.equal('mpu');
            expect(LayerStandard.get('config'), 'config.base').to.have.property('base').to.be.equal('#frescoAd');

            expect(LayerStandard.get('layerName'), 'layerName').to.be.equal('mpu');
            expect(LayerStandard.get('base'), 'base').to.be.equal('#frescoAd');

            expect(LayerStandard.createContainer.called, 'called createContainer function').to.be.true;

            expect(LayerStandard.getType(), 'layer type').to.be.equal('standard');

            done();
        });

        it("should be initialized with different instances", function(done) {

            var mpu = new ACT.LayerStandard({
                base: '#frescoAd',
                layerName: 'mpu',
                width: 300,
                height: 250,
            });

            var floating = new ACT.LayerStandard({
                base: 'body',
                layerName: 'floating'
            });

            expect(mpu.get('width'), 'mpu width').to.be.equal(300);
            expect(mpu.get('height'), 'mpu height').to.be.equal(250);

            expect(floating.get('layerName'), 'floating layerName').to.be.equal('floating');
            expect(floating.get('base'), 'floating base').to.be.equal('body');
            expect(floating.get('width'), 'floating width').to.be.undefined;
            expect(floating.get('height'), 'floating height').to.be.undefined;

            // check these infor later to make sure new instance doesnt override old instance
            expect(mpu.get('layerName'), 'mpu layerName').to.be.equal('mpu');
            expect(mpu.get('base'), 'mpu base').to.be.equal('#frescoAd');

            done();
        });

    });

    describe("Test render content", function() {

        it("render container should create DOM node ", function(done) {

            var mpu = new ACT.LayerStandard({
                base: 'body',
                layerName: 'mpu',
                width: 300,
                height: 250,
            });

            var container = mpu.get('container');

            expect(container).to.be.exist;
            expect(container).to.have.property('id').to.be.equal('ACT_mpu');
            expect(container).to.have.property('tagName').to.be.equal('DIV');

            expect(body.appendChild.calledWith(container), 'body.appendChild called').to.be.true;

            done();
        });

        it("add content shoud passing contentConfig to Scaffolding and get rendered content back", function(done) {
            // var spy = sinon.spy(ACT, 'Scaffolding');

            sinon.stub(ACT.Scaffolding.prototype, "getHtmlParsered", function(config) {
                // return document.createTextNode('content');
                return {
                    rawHtml: "content",
                    capabilityInstances: []
                };
            });

            var mpu = new ACT.LayerStandard({
                base: 'body',
                layerName: 'mpu',
                width: 300,
                height: 250,
                contentLayer: {
                    type: 'content-container',
                    id: 'layer_container'
                }
            });

            mpu.addContent();

            var container = mpu.get('container');

            expect(mpu.get('contentAppended'), 'contentAppended attr').to.be.true;
            expect(container.innerHTML, 'container innerHTML').to.be.equal('content');
            expect(mpu.get('capabilityInstances')).to.be.instanceof(Array);

            ACT.Scaffolding.prototype.getHtmlParsered.restore();

            done();
        });
    });

    describe("Test Play and Stop function", function() {

        beforeEach(function() {
            var Event = ACT.Event;
            // stub updateLayerPosition to something simple to avoid unexpected errors
            sinon.stub(ACT.LayerStandard.prototype, 'updateLayerPosition', function(callback) {
                callback();
            });

            sinon.stub(Event, 'fire');

        });

        afterEach(function() {
            ACT.LayerStandard.prototype.updateLayerPosition.restore();
            ACT.Event.fire.restore();
        });

        it("shoud play layer", function(done) {

            var mpu = new ACT.LayerStandard({
                base: 'body',
                layerName: 'mpu',
                width: 300,
                height: 250,
                contentLayer: {
                    type: 'content-container',
                    id: 'layer_container'
                }
            });

            mpu.play();

            expect(mpu.updateLayerPosition.called, 'updateLayerPosition called').to.be.true;
            expect(mpu.get('container').style.display, 'container display').to.be.equal('block');
            expect(mpu.get('playing'), 'playing attr').to.be.true;
            // check event fired as well
            expect(ACT.Event.fire.calledWith('layer:played', { 'layerName': 'mpu' }), 'event fire').to.be.true;

            done();
        });

        it("should stop layer without destroy content", function(done) {
            var mpu = new ACT.LayerStandard({
                base: 'body',
                layerName: 'mpu',
                width: 300,
                height: 250,
                contentLayer: {
                    type: 'content-container',
                    id: 'layer_container'
                }
            });

            mpu.play();

            // wait few secs
            setTimeout(function() {

                mpu.stop();

                // now testing
                expect(mpu.get('container').style.display, 'container display').to.be.equal('none');
                expect(mpu.get('playing'), 'playing attr').to.be.false;
                // check event fired as well
                expect(ACT.Event.fire.calledWith('layer:stopped', { 'layerName': 'mpu' }), 'event fire').to.be.true;

                done();

            }, 50);

        });

        it("should stop layer with destroy content", function(done) {
            var mpu = new ACT.LayerStandard({
                base: 'body',
                layerName: 'mpu',
                width: 300,
                height: 250,
                contentLayer: {
                    type: 'content-container',
                    id: 'layer_container'
                }
            });
            mpu.play();

            // wait few secs
            setTimeout(function() {

                mpu.stop(true);

                // now testing
                expect(mpu.get('container').style.display, 'container display').to.be.equal('none');
                expect(mpu.get('container').innerHTML, 'content in container').to.be.equal('');
                expect(mpu.get('playing'), 'playing attr').to.be.false;
                // check event fired as well
                expect(ACT.Event.fire.calledWith('layer:stopped', { 'layerName': 'mpu' }), 'event fire').to.be.true;

                done();

            }, 50);
        });

    });

    describe("Test applying layer style", function() {
        var Event = ACT.Event;
        before(function() {
            // stub updateLayerPosition to something simple to avoid unexpected errors
            sinon.stub(ACT.LayerStandard.prototype, 'updateLayerPosition', function(callback) {
                callback();
            });

            // stub this one to prevent actual fire event happen
            sinon.stub(Event, 'fire');

        });

        after(function() {
            ACT.LayerStandard.prototype.updateLayerPosition.restore();
            Event.fire.restore();
        });

        it("should have relative position for inline layer", function(done) {
            var mpu = new ACT.LayerStandard({
                type: 'inline',
                base: 'body',
                layerName: 'mpu',
                width: '300px',
                height: '250px',
                contentLayer: {}
            });

            mpu.play();


            expect(mpu.get('container').style.position, 'container position').to.be.equal('relative');
            expect(mpu.get('container').style.width, 'container width').to.be.equal('300px');
            expect(mpu.get('container').style.height, 'container height').to.be.equal('250px');

            done();

        });

        it("should have absoulte position for overlay layer", function(done) {
            var mpu = new ACT.LayerStandard({
                type: 'overlay',
                base: 'body',
                layerName: 'mpu',
                width: '300px',
                height: '250px',
                contentLayer: {}
            });

            mpu.play();

            expect(mpu.get('container').style.position, 'container position').to.be.equal('absolute');
            expect(mpu.get('container').style['z-index'], 'container z-index').to.be.equal('1000000');

            done();
        });

        it("should have fixed position for anchor layer", function(done) {
            var mpu = new ACT.LayerStandard({
                type: 'anchor',
                base: 'body',
                layerName: 'mpu',
                width: '300px',
                height: '250px',
                contentLayer: {}
            });

            mpu.play();

            expect(mpu.get('container').style.position, 'container position').to.be.equal('fixed');
            expect(mpu.get('container').style['z-index'], 'container z-index').to.be.equal('1000000');

            done();
        });

    });

    describe("Test layer alignment ", function() {
        before(function() {
            // stub updateLayerPosition to something simple to avoid unexpected errors
            sinon.stub(ACT.LayerStandard.prototype, 'updateLayerPosition', function(callback) {
                callback();
            });

            // stub this one to prevent actual fire event happen
            sinon.stub(ACT.Event, 'fire');

        });

        after(function() {
            ACT.LayerStandard.prototype.updateLayerPosition.restore();
            ACT.Event.fire.restore();
        });

        it('layer shoud have set to right if alignH is right', function(done) {
            var mpu = new ACT.LayerStandard({
                type: 'overlay',
                base: 'body',
                layerName: 'mpu',
                x: '100px',
                y: '100px',
                width: '300px',
                height: '250px',
                alignH: 'right',
                contentLayer: {}
            });

            mpu.play();

            expect(mpu.get('container').style['right'], 'container right').to.be.equal(mpu.get('x'));

            done();

        });

        it('layer should have set to left if alignH is left', function(done) {
            var mpu = new ACT.LayerStandard({
                type: 'overlay',
                base: 'body',
                layerName: 'mpu',
                x: '100px',
                y: '100px',
                alignH: 'left',
                contentLayer: {}
            });

            mpu.play();

            expect(mpu.get('container').style['left'], 'container left').to.be.equal(mpu.get('x'));

            done();

        });

        it('layer should stick to top if alignV is Top', function(done) {

            var mpu = new ACT.LayerStandard({
                type: 'overlay',
                base: 'body',
                layerName: 'mpu',
                x: '100px',
                y: '200px',
                alignV: 'top',
                alignH: 'left',
                contentLayer: {}
            });

            mpu.play();

            expect(mpu.get('container').style['top'], 'container top').to.be.equal(mpu.get('y'));

            done();
        });

        it('layer should stick to bottom if alignV is bottom', function(done) {

            var mpu = new ACT.LayerStandard({
                type: 'overlay',
                base: 'body',
                layerName: 'mpu',
                x: '100px',
                y: '200px',
                alignV: 'bottom',
                alignH: 'left',
                contentLayer: {}
            });

            mpu.play();

            expect(mpu.get('container').style['bottom'], 'container bottom').to.be.equal(mpu.get('y'));

            done();
        });

        it('layer css should match with center in horizontal', function(done) {
            var mpu = new ACT.LayerStandard({
                type: 'overlay',
                base: 'body',
                layerName: 'mpu',
                x: '100px',
                y: '200px',
                width: '300px',
                height: '250px',
                center: 'horizontal',
                contentLayer: {}
            });

            mpu.play();

            expect(mpu.get('container').style['left'], 'container left').to.be.equal('50%');
            expect(mpu.get('container').style['margin-left'], 'container margin-left').to.be.equal('-150px');

            done();
        });

        it('layer css should match with center is vertical', function(done) {
            var mpu = new ACT.LayerStandard({
                type: 'overlay',
                base: 'body',
                layerName: 'mpu',
                x: '100px',
                y: '200px',
                width: '300px',
                height: '250px',
                center: 'vertical',
                contentLayer: {}
            });

            mpu.play();

            expect(mpu.get('container').style['top'], 'container top').to.be.equal('50%');
            expect(mpu.get('container').style['margin-top'], 'container margin-top').to.be.equal('-125px');

            done();
        });

        it('layer css should match with center is both', function(done) {
            var mpu = new ACT.LayerStandard({
                type: 'overlay',
                base: 'body',
                layerName: 'mpu',
                x: '100px',
                y: '200px',
                width: '300px',
                height: '250px',
                center: 'both',
                contentLayer: {}
            });

            mpu.play();

            expect(mpu.get('container').style['left'], 'container left').to.be.equal('50%');
            expect(mpu.get('container').style['margin-left'], 'container margin-left').to.be.equal('-150px');
            expect(mpu.get('container').style['top'], 'container top').to.be.equal('50%');
            expect(mpu.get('container').style['margin-top'], 'container margin-top').to.be.equal('-125px');

            done();
        });
    });

    describe("updateLayerPosition", function() {
        it("should fire layersList:getLayerPosition event", function(done) {
            var Event = ACT.Event;
            sinon.stub(ACT.Event, 'fire');

            var mpu = new ACT.LayerStandard({
                layerName: 'mpu',
                type: 'inline',
                x: '50px',
                y: '50px',
                width: '300px',
                height: '250px',
                contentLayer: {}
            });

            mpu.updateLayerPosition(function() {});

            var passingParams = {
                layerName: 'mpu',
                attributes: {
                    x: '50px',
                    y: '50px'
                },
                coordinate: 'tl'
            }

            expect(ACT.Event.fire.calledWith('layersList:getLayerPosition', passingParams), 'event called with right attribute').to.be.true;

            ACT.Event.fire.restore();

            done();
        });

        it('should update layer X and Y when receive layersList:getLayerPosition:complete', function(done) {

            if (ACT.LayersList !== undefined) {
                sinon.stub(ACT.LayersList.prototype, 'getLayerPosition');
            }
            // fake event for layersList:getLayerPosition
            var fakeEvent = ACT.Event.on('layersList:getLayerPosition', function() {
                ACT.Event.fire('layersList:getLayerPosition:complete', {
                    layerName: 'mpu',
                    newValue: {
                        x: '100px',
                        y: '50px'
                    }
                });
            });

            var mpu = new ACT.LayerStandard({
                layerName: 'mpu',
                type: 'inline',
                x: '50px',
                y: '50px',
                width: '300px',
                height: '250px',
                contentLayer: {}
            });

            mpu.updateLayerPosition(function() {

                expect(mpu.get('x'), 'mpu.x').to.be.equal('100px');
                expect(mpu.get('y'), 'mpu.y').to.be.equal('50px');

                fakeEvent.remove();

                done();

            });

        });

    });

    describe("test layer stick to other layer position", function() {
        it('should return x and y for current position in page coordinate', function(done) {

            var mpu = new ACT.LayerStandard({
                layerName: 'mpu',
                type: 'inline',
                x: '50px',
                y: '50px',
                width: '300px',
                height: '250px',
                contentLayer: {}
            });

            var result = mpu.currentLayerPosition();

            expect(result, 'result').to.be.a('Array');
            expect(result[0], 'result[0]').to.be.a('number');
            expect(result[1], 'result[1]').to.be.a('number');

            done();
        });

    });

    describe("dwelltime tracking", function(){
    	// save a original dwelltime here ... just incase
    	var originalDwellTime = ACT.DwellTime;

    	before(function(){
    		// fake DwellTime class
    		ACT.DwellTime = function(config){};
    	});

    	after(function(){
    		// restore original DwellTime
    		ACT.DwellTime = originalDwellTime;

    	});

    	it("shoud initlize dwelltime tracking if flag is on", function(done){
            var mpu = new ACT.LayerStandard({
                layerName: 'expandable',
                type: 'inline',
                width: '300px',
                height: '250px',
                dwelltime: true,
                contentLayer: {}
            });


            assert.isTrue(mpu.get("dwelltime"), "dwelltime flag must be on");
            assert.instanceOf(mpu.get("dwelltimeInstance"), ACT.DwellTime, "DwellTime Instance must be initialized");

            done();
    	});

    	it("should track dwelltime with correct label", function(done){
            var mpu = new ACT.LayerStandard({
                layerName: 'expandable',
                type: 'inline',
                width: '300px',
                height: '250px',
                // dwelltime: false, -> default to false already
                contentLayer: {}
            });


            assert.isFalse(mpu.get("dwelltime"), "dwelltime flag must be off");
            assert.isNull(mpu.get("dwelltimeInstance"), "No DwellTime Instance must be initialized");

    		done();
    	});

    });

})
