/*
global describe, it
*/
describe('ACT_ContentProgressBar', function() {
    var expect = chai.expect;
    var assert = chai.assert;

    var Event = ACT.Event;
    var Lang = ACT.Lang;

    var progressBar, videoTag;
    var eventHolder = {}

    before(function(){
        // create a video tag for testing
        // NOTE: BECAUSE PHANTOMJS DOESN'T SUPPORT VIDEO TAG SO WE WILL FAKE THE VIDEO TAG
        var videoObject = function(){
            if (videoObject.prototype._singleton) {
                return videoObject.prototype._singleton;
            }
            videoObject.prototype._singleton = this;
        }
        videoObject.prototype = {
            getAttribute: function(attr){
                return this[attr] || null;
            }
        }

        videoTag = new videoObject();
        videoTag.id = 'videoPlayer';
        videoTag.duration = 20; // 20 seconds
        videoTag.currentTime = 0;
        videoTag.tagName = 'VIDEO';
        videoTag.nodeType = 1; // nodeType and nodeName is needed for make sure Dom.isDomElement will return true
        videoTag.nodeName = 'string';

        console.log(videoTag);

        // fake Dom.byId to return fake videoObject
        sinon.stub(ACT.Dom, 'byId', function(id){
            if (id === videoTag.id){
                return videoTag;
            } else {
                return null;
            }
        });

        // stub ACT.event.on so we can fake video event
        sinon.stub(ACT.Event, 'on', function(eventName, func, target, scope){
            eventHolder[eventName] = {
                func: func,
                target: target,
                scope: scope
            }
            console.info(eventHolder)
            return {
                remove: function(){
                    delete eventHolder[eventName];
                }
            }
        });

        // stub ACT.event.fire so we can fake video event
        sinon.stub(ACT.Event, 'fire', function(eventName, data, target){
            var eventDef = eventHolder[eventName];
            console.info(eventName, data, target, eventDef);
            if (eventDef && target === eventDef.target){
                eventDef.func(data);
            }
        });

        // stub Dom.isDomElement so we can work with fake dom
        sinon.stub(ACT.Dom, 'isDomElement', function(){
            return true;
        });
    });

    after(function(){
        // reset ACT.Dom to normal
        ACT.Dom.byId.restore();
        ACT.Event.on.restore();
        ACT.Event.fire.restore();
        ACT.Dom.isDomElement.restore();
    });

    it('shoud available to be initialize', function() {
        expect(ACT.ContentProgressBar).to.exist;
    });

    describe('initialize progressBar instance', function(){

        before(function(){
            progressBar = new ACT.ContentProgressBar({
                id: "video_progressbar",
                type: "content-progressbar",
                classNode: 'cssclass',
                env: ["html", "backup"],
                css: {
                    width: "900px",
                },
                "progressBarConfig": {
                    value: 10,
                    sourceId: 'videoPlayer' // id of video element
                }
            });

            // append it into dom
            document.body.appendChild(progressBar.getContent().node);
        });

        after(function(){
            // remove progress bar from dom and destroy
            document.body.removeChild(progressBar.getContent().node);
            // console.info('after ')
            progressBar.destroy();
        });

        it('should initialize ContentProgressBar instance', function() {
            assert.instanceOf(progressBar, ACT.ContentProgressBar, 'created object must be instance of ACT.ContentProgressBar');
        });

        it('should render progress bar element', function(){
            var node = progressBar.get('node');

            assert.equal(node.tagName.toLowerCase(), 'progress', 'should render progress tag');
            assert.equal(node.id, 'video_progressbar', 'should have correct element ID');
            assert.equal(node.getAttribute("value"), 10, 'should have correct value attribute');
            assert.equal(node.style.width, '900px', 'should have correct css ');
        });

        it('should get the correct target DOM', function(){
            assert.deepEqual(progressBar.get('sourceNode'), videoTag, 'must get correct DOM node');
            assert.deepEqual(progressBar.get('sourceType'), 'video', 'must detect the correct type of source');
        });

    });

    describe('sync with target element', function() {

        before(function(){
            progressBar = new ACT.ContentProgressBar({
                id: "video_progressbar",
                type: "content-progressbar",
                env: ["html", "backup"],
                css: {
                    position: 'absolute',
                    top: "0px",
                    left: "0px",
                    width: "600px",
                },
                "progressBarConfig": {
                    value: 10,
                    sourceId: 'videoPlayer'
                }
            });

            // append it into dom
            document.body.appendChild(progressBar.getContent().node);
        });

        after(function(){
            // remove progress bar from dom and destroy
            document.body.removeChild(progressBar.getContent().node);
            // console.info('after ')
            progressBar.destroy();
        });

        it('should listen to video event and update progress bar', function(){
            var node = progressBar.get('node');

            assert.isTrue(progressBar.get('isSyncTargetToNode'), "flag to event listeners should be on");

            // seek video to 60% then check progress bar value
            videoTag.currentTime = Math.round(videoTag.duration * 60 / 100);

            ACT.Event.fire('timeupdate', {}, videoTag);
            assert.equal(node.getAttribute("value"), 60, 'value attribute must be the same with video current percentage');

        });

        it('should seek video when click on progress bar', function(){
            var node = progressBar.get('node');

            assert.isTrue(progressBar.get('isSyncNodeToTarget'), "flag to event listeners should be on");

            // when fire click event, we need to fake clientX value because progressBar use it to canculate the where the mouse is clicked on
            ACT.Event.fire('click', {
                clientX: 150 // it should be 25percent of progressBar
            }, node);
            assert.equal(videoTag.currentTime, 5, 'video currentTime must change according to progressBar change');

            // need to fire timeupdate manually because ... it's a fake DOM element
            ACT.Event.fire('timeupdate', {}, videoTag);
            assert.equal(node.getAttribute("value"), 25, 'progressBar value must be 25');

        });
    });

});
