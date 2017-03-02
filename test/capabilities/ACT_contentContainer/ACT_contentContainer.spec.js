
var expect = chai.expect;
var assert = chai.assert;

describe("ContentContainer", function() {
	var Event;
	var Lang;

	before(function(){
		refreshModule('Event');
		refreshModule('ContentContainer');
		Event = ACT.Event;
		Lang = ACT.Lang;
	});

    describe("ContentContainer: Check the init state", function() {
        it("should have ACT.ContentContainer instance", function() {
            expect(ACT.ContentContainer).to.exist;
        });

        it("should have ACT.Lang instance", function() {
            expect(Lang).to.exist;
        });

        it("should have ACT.Event instance", function() {
            expect(Event).to.exist;
        });

        it("Actions registered", function(done) {
            var actions = null;
			var contentContainer;

			sinon.stub(ACT.Event, 'fire', function(name, actions){
				ACT.Event.fire.restore();

				assert.isArray(actions, 'reigstered action must be array');
				assert.isObject(actions[0], 'first actions must be an Object');
				assert.strictEqual('openURL', actions[0].type, 'first action is wrong');
				assert.strictEqual('containerShow', actions[1].type, 'second action is wrong');
				assert.strictEqual('containerHide', actions[2].type, 'third action is wrong');
				assert.strictEqual('containerChangeStyles', actions[3].type, 'fourth action is wrong');
				assert.strictEqual('containerStartFadeTo', actions[4].type, 'fifth action is wrong');
				assert.strictEqual('containerStopFadeTo', actions[5].type, 'sixth action is wrong');
				assert.strictEqual('containerAnimate', actions[6].type, 'seventh action is wrong');
				assert.strictEqual('containerStopProcesses', actions[7].type, 'seventh action is wrong');

				// Test value for the action definition
				var i = e = 0,
					actionParamType = [
						['', ''],
						[''],
						[''],
						['', {}],
						['', '', 0],
						[''],
						['', {}, {}, 0, 0]
					];


				for (var action in actions) {
					var argDefinition = actions[action].argument;
					assert.isFunction(actions[action].process);
					i++;
				}

				done();
			});


            contentContainer = new ACT.ContentContainer({
                type: 'ContentContainer',
                id: 'container4'
            });

			contentContainer.destroy();
        });

        it('should return true against valid action arguments', function(done){
            ACT.Event.originalEventFire = ACT.Event.fire;

            sinon.stub(ACT.Event, 'fire', function(event, data){

                if (event === 'register:Actions'){

                  var openURL = data[0].argument;
                  var containerShow = data[1].argument;
                  var containerHide = data[2].argument;
                  var containerChangeStyles = data[3].argument;
                  var containerStartFadeTo = data[4].argument;
                  var containerStopFadeTo = data[5].argument;
                  var containerAnimate = data[6].argument;
                  var containerStopProcesses = data[7].argument;

                  expect(openURL.URLpath.test("https://uk.yahoo.com")).to.be.true;
                  expect(openURL.URLname.test("click_url")).to.be.true;
                  expect(openURL.timeout.test(10)).to.be.true;
                  expect(openURL.timeout.test("10")).to.be.true;
                  expect(openURL.timeout.test(null)).to.be.true;
                  expect(openURL.timeout.test(undefined)).to.be.true;

                  expect(containerShow.id.test("mpu_container")).to.be.true;
                  expect(containerHide.timeout.test(10)).to.be.true;
                  expect(containerHide.timeout.test("10")).to.be.true;
                  expect(containerShow.timeout.test(null)).to.be.true;
                  expect(containerShow.timeout.test(undefined)).to.be.true;

                  expect(containerHide.id.test("mpu_container")).to.be.true;
                  expect(containerHide.timeout.test(10)).to.be.true;
                  expect(containerHide.timeout.test("10")).to.be.true;
                  expect(containerHide.timeout.test(null)).to.be.true;
                  expect(containerHide.timeout.test(undefined)).to.be.true;

                  expect(containerChangeStyles.id.test("mpu_container")).to.be.true;
                  expect(containerChangeStyles.styles.test({"z-index": "10"})).to.be.true;
                  expect(containerChangeStyles.timeout.test(10)).to.be.true;
                  expect(containerChangeStyles.timeout.test("10")).to.be.true;
                  expect(containerChangeStyles.timeout.test(null)).to.be.true;
                  expect(containerChangeStyles.timeout.test(undefined)).to.be.true;

                  expect(containerStartFadeTo.id.test("mpu_container")).to.be.true;
                  expect(containerStartFadeTo.to.test("billboard_container")).to.be.true;
                  expect(containerStartFadeTo.delay.test(10)).to.be.true;
                  expect(containerStartFadeTo.timeout.test(10)).to.be.true;
                  expect(containerStartFadeTo.delay.test("10")).to.be.true;
                  expect(containerStartFadeTo.timeout.test("10")).to.be.true;
                  expect(containerStartFadeTo.timeout.test(null)).to.be.true;
                  expect(containerStartFadeTo.timeout.test(undefined)).to.be.true;

                  expect(containerStopFadeTo.id.test("mpu_container")).to.be.true;
                  expect(containerStopFadeTo.timeout.test(10)).to.be.true;
                  expect(containerStopFadeTo.timeout.test("10")).to.be.true;
                  expect(containerStopFadeTo.timeout.test(null)).to.be.true;
                  expect(containerStopFadeTo.timeout.test(undefined)).to.be.true;


                  expect(containerAnimate.id.test("mpu_container")).to.be.true;
                  expect(containerAnimate.from.test({"left": "400px"})).to.be.true;
                  expect(containerAnimate.to.test({"left": "100px"})).to.be.true;
                  expect(containerAnimate.duration.test(10)).to.be.true;
                  expect(containerAnimate.duration.test("10")).to.be.true;
                  expect(containerAnimate.delay.test(10)).to.be.true;
                  expect(containerAnimate.delay.test("10")).to.be.true;
                  expect(containerAnimate.timeout.test(10)).to.be.true;
                  expect(containerAnimate.timeout.test("10")).to.be.true;
                  expect(containerAnimate.timeout.test(null)).to.be.true;
                  expect(containerAnimate.timeout.test(undefined)).to.be.true;

                  expect(containerStopProcesses.timeout.test(10)).to.be.true;

                  ACT.Event.fire.restore();
                  done();

                } else {
                  ACT.Event.originalEventFire(event, data);
                }

            });

            var contentContainer = new ACT.ContentContainer({
                type: 'ContentContainer',
                id: 'container4'
            });

        });

        it('should return false against invalid action arguments', function(done){
            ACT.Event.originalEventFire = ACT.Event.fire;

            sinon.stub(ACT.Event, 'fire', function(event, data){

                if (event === 'register:Actions'){

                  var openURL = data[0].argument;
                  var containerShow = data[1].argument;
                  var containerHide = data[2].argument;
                  var containerChangeStyles = data[3].argument;
                  var containerStartFadeTo = data[4].argument;
                  var containerStopFadeTo = data[5].argument;
                  var containerAnimate = data[6].argument;
                  var containerStopProcesses = data[7].argument;

                  expect(openURL.URLpath.test(1)).to.be.false;
                  expect(openURL.URLpath.test(true)).to.be.false;
                  expect(openURL.URLpath.test(null)).to.be.false;
                  expect(openURL.URLpath.test(undefined)).to.be.false;
                  expect(openURL.URLname.test(1)).to.be.false;
                  expect(openURL.URLname.test(true)).to.be.false;
                  expect(openURL.URLname.test(null)).to.be.false;
                  expect(openURL.URLname.test(undefined)).to.be.false;
                  expect(openURL.timeout.test("test")).to.be.false;

                  expect(containerShow.id.test(1)).to.be.false;
                  expect(containerShow.id.test(true)).to.be.false;
                  expect(containerShow.id.test(null)).to.be.false;
                  expect(containerShow.id.test(undefined)).to.be.false;
                  expect(containerShow.timeout.test("test")).to.be.false;

                  expect(containerHide.id.test(1)).to.be.false;
                  expect(containerHide.id.test(true)).to.be.false;
                  expect(containerHide.id.test(null)).to.be.false;
                  expect(containerHide.id.test(undefined)).to.be.false;
                  expect(containerHide.timeout.test("test")).to.be.false;

                  expect(containerChangeStyles.id.test(1)).to.be.false;
                  expect(containerChangeStyles.id.test(true)).to.be.false;
                  expect(containerChangeStyles.id.test(null)).to.be.false;
                  expect(containerChangeStyles.id.test(undefined)).to.be.false;
                  expect(containerChangeStyles.styles.test(1)).to.be.false;
                  expect(containerChangeStyles.styles.test("z-index: 2")).to.be.false;
                  expect(containerChangeStyles.styles.test(true)).to.be.false;
                  expect(containerChangeStyles.styles.test(null)).to.be.false;
                  expect(containerChangeStyles.styles.test(undefined)).to.be.false;
                  expect(containerChangeStyles.timeout.test("test")).to.be.false;

                  expect(containerStartFadeTo.id.test(1)).to.be.false;
                  expect(containerStartFadeTo.id.test(true)).to.be.false;
                  expect(containerStartFadeTo.id.test(null)).to.be.false;
                  expect(containerStartFadeTo.id.test(undefined)).to.be.false;
                  expect(containerStartFadeTo.to.test(1)).to.be.false;
                  expect(containerStartFadeTo.to.test(null)).to.be.false;
                  expect(containerStartFadeTo.to.test(undefined)).to.be.false;
                  expect(containerStartFadeTo.delay.test("test")).to.be.false;
                  expect(containerStartFadeTo.delay.test(null)).to.be.false;
                  expect(containerStartFadeTo.delay.test(undefined)).to.be.false;
                  expect(containerStartFadeTo.timeout.test("test")).to.be.false;

                  expect(containerStopFadeTo.id.test(1)).to.be.false;
                  expect(containerStopFadeTo.id.test(true)).to.be.false;
                  expect(containerStopFadeTo.id.test(null)).to.be.false;
                  expect(containerStopFadeTo.id.test(undefined)).to.be.false;
                  expect(containerStopFadeTo.timeout.test("test")).to.be.false;


                  expect(containerAnimate.id.test(1)).to.be.false;
                  expect(containerAnimate.id.test(true)).to.be.false;
                  expect(containerAnimate.id.test(null)).to.be.false;
                  expect(containerAnimate.id.test(undefined)).to.be.false;
                  expect(containerAnimate.from.test(1)).to.be.false;
                  expect(containerAnimate.from.test("left: 10px")).to.be.false;
                  expect(containerAnimate.from.test(true)).to.be.false;
                  expect(containerAnimate.from.test(null)).to.be.false;
                  expect(containerAnimate.from.test(undefined)).to.be.false;
                  expect(containerAnimate.to.test(1)).to.be.false;
                  expect(containerAnimate.to.test("left: 900px")).to.be.false;
                  expect(containerAnimate.to.test(true)).to.be.false;
                  expect(containerAnimate.to.test(null)).to.be.false;
                  expect(containerAnimate.to.test(undefined)).to.be.false;
                  expect(containerAnimate.duration.test("test")).to.be.false;
                  expect(containerAnimate.duration.test(null)).to.be.false;
                  expect(containerAnimate.duration.test(undefined)).to.be.false;
                  expect(containerAnimate.delay.test("test")).to.be.false;
                  expect(containerAnimate.delay.test(null)).to.be.false;
                  expect(containerAnimate.delay.test(undefined)).to.be.false;
                  expect(containerAnimate.timeout.test("test")).to.be.false;


                  expect(containerStopProcesses.timeout.test("test")).to.be.false;

                  ACT.Event.fire.restore();
                  done();

                } else {
                  ACT.Event.originalEventFire(event, data);
                }

            });

            var contentContainer = new ACT.ContentContainer({
                type: 'ContentContainer',
                id: 'container4'
            });

        });

    });

    describe('Content: check getContent method which return the node', function() {

        it("Render simple div container", function(done) {

            var contentContainer = new ACT.ContentContainer({
                type: 'ContentContainer',
                id: 'container1',
                classNode: 'funny-class'
            });
            var node = contentContainer.getContent().node;

            assert.strictEqual(node.nodeName, 'DIV', 'Wrong tag node');
            assert.strictEqual(node.getAttribute('id'), 'container1', 'Wrong id node');
            assert.strictEqual(node.getAttribute('class'), ' funny-class', 'Wrong class node');

            contentContainer.destroy();
            done();

        });

        it("Render container with styles", function(done) {

            var contentContainer = new ACT.ContentContainer({
                type: 'ContentContainer',
                id: 'container2',
                classNode: 'funny-class',
                css: {
                    width: '300px',
                    height: '600px',
                    backgroundColor: 'red'
                }
            });

            var node = contentContainer.getContent().node;

            assert.strictEqual(node.style.width, '300px', 'Wrong width');
            assert.strictEqual(node.style.height, '600px', 'Wrong height');
            assert.strictEqual(node.style.backgroundColor, 'red', 'Wrong background color');

            contentContainer.destroy();
            done();

        });

        it("Render container with inner text", function(done) {

            var contentContainer = new ACT.ContentContainer({
                type: 'ContentContainer',
                id: 'container3',
                classNode: 'funny-class',
                css: {
                    width: '300px',
                    height: '600px'
                },
                containerConfig: {
                    innerText: "test inner test"
                }
            });

            var node = contentContainer.getContent().node;

            assert.strictEqual(node.innerHTML, 'test inner test', 'Wrong inner text');

            contentContainer.destroy();
            done();

        });

    });

    describe('Actions: Check all the actions executions', function() {

        var contentContainerOne, nodeOne;
        var contentContainerTwo, nodeTwo;

        before(function() {

            contentContainerOne = new ACT.ContentContainer({
                type: 'ContentContainer',
                id: 'container1',
                css: {
                    display: 'inherit'
                }
            });

            nodeOne = contentContainerOne.getContent().node;

            contentContainerTwo = new ACT.ContentContainer({
                type: 'ContentContainer',
                id: 'container2',
                css: {
                    display: 'inherit'
                }
            });

            nodeTwo = contentContainerTwo.getContent().node;
        });

        after(function() {

            contentContainerOne.destroy();
            contentContainerTwo.destroy();

            contentContainerOne = null;
            contentContainerTwo= null;

            nodeOne = nodeTwo = null;
        });

        it("Test open URL", function(done) {

            sinon.stub(window, 'open');
            sinon.stub(Event, 'on');
            sinon.stub(Event, 'fire');

            var testOpenUrlObject = sinon.match(function(value) {

                if (!(value instanceof Object)) return false;
                if (value.clickTag !== 'https://uk.yahoo.com') return false;
                if (value.clickTagName !== 'yahoo_uk') return false;

                return true;
            });

            contentContainerTwo.openUrl('https://uk.yahoo.com', 'yahoo_uk', function(url) {
                Event.fire('complete:action', {
                    url: url
                });
            });

            expect(Event.on.calledWith('tracking:registerRedirect:complete', sinon.match.func), 'must have listener for tracking redirect complete').to.be.true;
            expect(Event.fire.calledWith('tracking:registerRedirect', testOpenUrlObject), 'must fire event tracking redirect').to.be.true;

            window.open.restore();
            Event.on.restore();
            Event.fire.restore();

            sinon.stub(window, 'open', function(a, b) {
                var reg = new RegExp("(http[s?].*)");
                expect(reg.test(a)).to.be.true;
                assert.strictEqual(b, '_blank', 'Target is not blank');
            });

            Event.fire('container:openURL', {
                URLpath: "https://br.yahoo.com",
                URLname: "Yahoo Brasil",
                done: function(link) {
                    var reg = new RegExp("(http[s?].*)");
                    expect(reg.test(link)).to.be.true;
                }
            });

            window.open.restore();
            done();
        });

        it("Test show container", function(done) {

            Event.fire('container:show', {
                containerId: 'container2',
                done: function() {}
            });

            assert.strictEqual('inherit', nodeOne.style.display, 'display style attribute of container 1 must be inherit');
            assert.strictEqual('block', nodeTwo.style.display, 'display style attribute of container 2 must be block');
            done();
        });

        it("Test hide container", function(done) {

            Event.fire('container:hide', {
                containerId: 'container1'
            });

            assert.strictEqual('none', nodeOne.style.display, 'display style attribute of container 1 must be none');
            assert.strictEqual('block', nodeTwo.style.display, 'display style attribute of container 2 must be block');
            done();
        });

        it("Test containerChangeStyles", function(done) {

            Event.fire('container:changeStyles', {
                containerId: 'container1',
                styles: {
                    width: '600px',
                    height: '1200px'
                }
            });

            assert.strictEqual('600px', nodeOne.style.width, 'wrong width for container 1');
            assert.strictEqual('1200px', nodeOne.style.height, 'wrong height for container 1');
            assert.strictEqual('', nodeTwo.style.width, 'wrong width for container 2');
            assert.strictEqual('', nodeTwo.style.height, 'wrong height for container 2');

            done();

        });

        it("Test animate container", function(done) {

            var completed = false;

            Event.on('complete:action', function() {

                completed = true;
            });

            Event.fire('container:animate', {
                containerId: 'container1',
                from: {
                    "opacity": 1
                },
                to: {
                    "opacity": 0
                },
                duration: 1000,
                delay: 10,
                done: function() {
                    Event.fire('complete:action');
                    assert.strictEqual(true, completed, 'action not fired');
                    done();
                }
            });

        });

    });

    describe('Actions: Check all the trigger actions', function() {

        it("Trigger click container", function(done) {

            var contentContainer = new ACT.ContentContainer({
                type: 'ContentContainer',
                id: 'container_click',
                classNode: 'container_class',
                css: {
                    width: '50px',
                    height: '50px',
                    backgroundColor: 'red'
                },
                eventConfig: [{
                    eventType: 'click',
                    actions: [{
                        type: 'containerHide',
                        id: 'container_click'
                    }]
                }]
            });

            var clicked = false;
            var node = contentContainer.getContent().node;
            document.body.appendChild(node);

            /*
             * Had to fake a listener which is living in standard Ad
             */
            var checkActionCondition = Event.on('standardAd:checkActionCondition', function(data) {

                checkActionCondition.remove();

                Event.fire('add:actions', data.actionConfig.actions);
            });

            var listener = Event.on('add:actions', function(actions) {

                listener.remove();

                clicked = true;
                assert.isArray(actions);
                assert.strictEqual(1, actions.length, 'number of click actions must be 1');
                assert.strictEqual('containerHide', actions[0].type, 'type of first actions must be containerHide');
                assert.strictEqual('container_click', actions[0].id, 'id of action must be container_click');

                contentContainer.destroy();
                done();
            });

            Event.fire('click',{preventDefault: new Function()});

        });

        it("Trigger mouseleave container", function(done) {

            var contentContainer = new ACT.ContentContainer({
                type: 'ContentContainer',
                id: 'container_leave',
                classNode: 'container_class',
                css: {
                    width: '50px',
                    height: '50px',
                    backgroundColor: 'blue'
                },
                eventConfig: [{
                    eventType: 'mouseleave',
                    actions: [{
                        type: 'containerHide',
                        id: 'container_leave'
                    }]
                }]
            });

            var leaved = false;
            var node = contentContainer.getContent().node;
            document.body.appendChild(node);

            /*
             * Had to fake a listener which is living in standard Ad
             */
            var checkActionCondition = Event.on('standardAd:checkActionCondition', function(data) {

                checkActionCondition.remove();

                Event.fire('add:actions', data.actionConfig.actions);
            });

            var listener = Event.on('add:actions', function(actions) {

                listener.remove();

                leaved = true;
                assert.isArray(actions);
                assert.strictEqual(1, actions.length, 'number of mouseleave actions must be 1');
                assert.strictEqual('containerHide', actions[0].type, 'type of first actions must be containerHide');
                assert.strictEqual('container_leave', actions[0].id, 'id of action must be container_leave');

                contentContainer.destroy();
                done();
            });

            Event.fire('mouseleave',{preventDefault: new Function()});

        });

        it("Trigger mouseenter container", function(done) {

            var contentContainer = new ACT.ContentContainer({
                type: 'ContentContainer',
                id: 'container_move',
                classNode: 'container_class',
                css: {
                    width: '50px',
                    height: '50px',
                    backgroundColor: 'yellow'
                },
                eventConfig: [{
                    eventType: 'mouseenter',
                    actions: [{
                        type: 'containerChangeStyles',
                        id: 'container_enter',
                        styles: {
                            backgroundColor: 'green'
                        }
                    }]
                }]
            });

            var entered = false;
            var node = contentContainer.getContent().node;
            document.body.appendChild(node);

            /*
             * Had to fake a listener which is living in standard Ad
             */
            var checkActionCondition = Event.on('standardAd:checkActionCondition', function(data) {

                checkActionCondition.remove();

                Event.fire('add:actions', data.actionConfig.actions);
            });

            var listener = Event.on('add:actions', function(actions) {

                listener.remove();

                moved = true;
                assert.isArray(actions);
                assert.strictEqual(1, actions.length, 'number of mouseenter actions must be 1');
                assert.strictEqual('containerChangeStyles', actions[0].type, 'type of first actions must be containerChangeStyles');
                assert.strictEqual('container_enter', actions[0].id, 'id of action must be container_enter');
                assert.isObject(actions[0].styles, 'styles attribute must be objects');

                contentContainer.destroy();
                done();
            });

            Event.fire('mouseenter',{preventDefault: new Function()});

        });

    });

    describe('Resize: Check resize and status', function() {

        var contentContainer, node;

        before(function() {

            contentContainer = new ACT.ContentContainer({
                type: 'ContentContainer',
                id: 'container_id',
                classNode: 'container_class',
                resize: {
                    sizeFrom: 'root'
                },
                css: {
                    width: '300px',
                    height: '500px',
                    backgroundColor: 'pink',
                    position: 'absolute'
                }
            });

            node = contentContainer.getContent().node;
            var container = document.createElement('div');
            container.style.width = '500px';
            container.style.height = '250px';
            container.appendChild(node);
            document.body.appendChild(container);
        });

        after(function() {

            contentContainer.destroy();
        });

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

            contentContainer.set('configObject', {
                type: 'ContentContainer',
                id: 'container_id',
                classNode: 'container_class',
                resize: {
                    sizeFrom: 'parent'
                },
                css: {
                    width: '300px',
                    height: '500px',
                    backgroundColor: 'pink',
                    position: 'absolute'
                }
            });

            Event.fire('screen:status');

            assert.strictEqual(node.parentNode.offsetWidth, node.offsetWidth, 'wrong new width');
            assert.strictEqual(node.parentNode.offsetHeight, node.offsetHeight, 'wrong new height');

            done();

        });

        it("Resize 16:9", function(done) {

            contentContainer.set('configObject', {
                type: 'ContentContainer',
                id: 'container_id',
                classNode: 'container_class',
                resize: {
                    sizeFrom: 'root',
                    ratio: '16:9'
                },
                css: {
                    width: '300px',
                    height: '500px',
                    backgroundColor: 'pink',
                    position: 'absolute'
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

            contentContainer.set('configObject', {
                type: 'ContentContainer',
                id: 'container_id',
                classNode: 'container_class',
                resize: {
                    ratio: '1:1'
                },
                css: {
                    width: '300px',
                    height: '500px',
                    backgroundColor: 'pink',
                    position: 'absolute'
                }
            });

            contentContainer.changeStyles({
                width: '300px'
            });

            Event.fire('screen:status');

            assert.strictEqual(300, node.offsetWidth, 'wrong new width');
            assert.strictEqual(300, node.offsetHeight, 'wrong new height');

            done();

        });
    });
});
