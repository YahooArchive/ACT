describe('ACT.DwellTime', function() {

    var assert = chai.assert;
    var expect = chai.expect;

    it('should be available', function() {
        expect(ACT.DwellTime, 'ACT.DwellTime should available').to.exist;
    });

    describe('Initialization', function() {
        var targetElement = document.body;

        beforeEach(function() {
            // spy ACT.Event on function so we can test registered event
            sinon.spy(ACT.Event, 'on');
        });

        afterEach(function() {
            // restore ACT.Event.on function
            ACT.Event.on.restore();
        });

        it('should pass the correct targetElement', function(done) {
            var dwellTime = new ACT.DwellTime({
                targetElement: targetElement,
                targetName: 'test'
            });

            assert.instanceOf(dwellTime, ACT.DwellTime, 'dwellTime is an instance of ACT.DwellTime');
            assert.deepEqual(dwellTime.get('targetElement'), targetElement, 'must have correct target element');

            dwellTime.destroy();
            done();
        });

        it('should register mouseenter and mouseleave on init', function(done) {
            var dwellTime = new ACT.DwellTime({
                targetElement: targetElement,
                targetName: 'test'
            });

            assert.deepEqual(dwellTime.get('eventList').length, 2, 'must have 2 events registered');
            assert.isTrue(ACT.Event.on.calledWith('mouseenter', sinon.match.func, targetElement), 'mouseenter for targetElement must be registered');
            assert.isTrue(ACT.Event.on.calledWith('mouseleave', sinon.match.func, targetElement), 'mouseleave for targetElement must be registered');

            dwellTime.destroy();
            done();
        });

        it('should not register mouseenter and mouseleave events if no targetElement', function(done) {
            var dwellTime = new ACT.DwellTime({
                targetElement: 'targetElement',
                targetName: 'test'
            });

            assert.deepEqual(dwellTime.get('eventList').length, 0, 'must have 0 events registered');
            dwellTime.destroy();
            done();
        });

        it('should unregister mouseenter and mouseleave if dwell time is fired', function(done) {
            var dwellTime = new ACT.DwellTime({
                targetElement: targetElement,
                targetName: 'test'
            });

            var clock = sinon.useFakeTimers(Date.now());

            assert.deepEqual(dwellTime.get('eventList').length, 2, 'must have 2 events registered');

            ACT.Event.fire('mouseenter', {preventDefault:function(){}});
            clock.tick(2000); // advance 2 seconds
            ACT.Event.fire('mouseleave', {preventDefault:function(){}});
            clock.tick(2000); // advance 2 seconds

            clock.restore();

            assert.deepEqual(dwellTime.get('eventList').length, 0, 'must have events unregistered');
            dwellTime.destroy();
            done();
        });
    });

    describe('Track when mouse out for different case', function() {
        var element, dwelltime, clock;

        beforeEach(function(){
            // facking clock so we can control time for testing
            clock = sinon.useFakeTimers(Date.now());

            // sty ACT.Event.fire
            sinon.spy(ACT.Event, 'fire');

            // Create and Append node
            element = ACT.Dom.nodeCreate("<div style='width:300px;height:250px;'></div>").firstChild;
            document.body.appendChild(element);

            // Instanciate Dwell
            dwelltime = new ACT.DwellTime({
                targetElement: element,
                targetName: "floating"
            });
        });

        afterEach(function() {
            // restore normal clock
            clock.restore();

            // restore ACT.Event.fire event
            ACT.Event.fire.restore();

            // Destroy dwell
            dwelltime.destroy();

            // Remove node
            document.body.removeChild(element);
        });

        it('shouldn\'t track after mouse leave within 1 seconds', function(done) {
            ACT.Event.fire('mouseenter', {preventDefault:function(){}});
            clock.tick(1000); // advance 1 seconds
            ACT.Event.fire('mouseleave', {preventDefault:function(){}});
            clock.tick(2000); // advance 2 seconds

            // Shouldn't be 1 seconds
            assert.isFalse(ACT.Event.fire.calledWith("tracking:track", {label: "floating_view_dwell_1"}), "tracking label must be correct");
            done();
        });

        it('should track after mouse leave', function(done) {
            ACT.Event.fire('mouseenter', {preventDefault:function(){}});
            clock.tick(5000); // advance 5 seconds
            ACT.Event.fire('mouseleave', {preventDefault:function(){}});
            clock.tick(2000); // advance 2 seconds

            // Should be 5 seconds
            assert.isTrue(ACT.Event.fire.calledWith("tracking:track", {label: "floating_view_dwell_5"}), "tracking label must be correct");
            done();
        });

        it('should continue tracking if mouse back within 2 seconds', function(done) {
            ACT.Event.fire('mouseenter', {preventDefault:function(){}});
            clock.tick(5000); // advance 5 seconds
            ACT.Event.fire('mouseleave', {preventDefault:function(){}});
            clock.tick(1500); // advane 1.5 second
            ACT.Event.fire('mouseenter', {preventDefault:function(){}});
            ACT.Event.fire('mouseleave', {preventDefault:function(){}});
            clock.tick(2000); // advance 2 seconds

            // Should be 7 seconds as it floor the numbers
            assert.isTrue(ACT.Event.fire.calledWith("tracking:track", {label: "floating_view_dwell_7"}), "tracking label must be correct");
            done();
        });

        it('should track if mouse leave just before 10 minutes', function(done) {
            ACT.Event.fire('mouseenter', {preventDefault:function(){}});
            clock.tick(599000); // advance 9 minutes and 59 seconds
            ACT.Event.fire('mouseleave', {preventDefault:function(){}});
            clock.tick(2000); // advance 2 seconds

            // Should be 599 seconds
            assert.isTrue(ACT.Event.fire.calledWith("tracking:track", {label: "floating_view_dwell_599"}), "tracking label must be correct");
            done();
        });

        it('should track 10 minutes if mouse leave over 10 minutes', function(done) {
            ACT.Event.fire('mouseenter', {preventDefault:function(){}});
            clock.tick(660000); // advance 11 minutes
            ACT.Event.fire('mouseleave', {preventDefault:function(){}});
            clock.tick(2000); // advance 2 seconds

            // Should be 600 seconds and not 660 seconds
            assert.isTrue(ACT.Event.fire.calledWith("tracking:track", {label: "floating_view_dwell_600"}), "tracking label must be correct");
            done();
        });

        it('should track if mouse leave element but never enter', function(done) {
            clock.tick(7000); // advance 7 seconds
            ACT.Event.fire('mouseleave', {preventDefault:function(){}});
            clock.tick(2000); // advance 2 seconds

            // Should be 7 seconds
            assert.isTrue(ACT.Event.fire.calledWith("tracking:track", {label: "floating_view_dwell_7"}), "tracking label must be correct");
            done();
        });
    });
});
