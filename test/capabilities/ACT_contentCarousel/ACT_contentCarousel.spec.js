var expect = chai.expect;
var assert = chai.assert;

var Event = ACT.Event;
var Lang = ACT.Lang;
var Dom = ACT.Dom;
var Animation = ACT.Animation;

carouselObject = {
        type: 'ContentCarousel',
        id: 'carousel1',
        env: ["flash", "html", "backup"],
        classNode: 'carousel_class',
        css: {
            'width': '300px',
            'height': '250px',
            'position': 'absolute',
            'top': '100px',
            'left': '200px',
            'display': 'block',
            'overflow': 'hidden'
        },
        ContentCarouselConfig:{

        },
        eventConfig:[{
                eventType: "carouselAnimationStart",
                actions: [{
                    type: "containerChangeStyles",
                    id: "content_one",
                    styles: {
                        "background-color": "yellow"
                    }
                }]

        }],
        content: [{
            id: 'content_one',
            type: 'content-container',
            env: ["flash", "html", "backup"],
            "classNode": "active",
            css: {
                height: '250px',
                width: '300px',
                "color": "black",
                "background-color": "red",
                cursor: "pointer"
            },
            containerConfig: {
                innerText: ''
            },
            eventConfig: []
        },{
            id: 'content_two',
            type: 'content-container',
            env: ["flash", "html", "backup"],
            "classNode": "active",
            css: {
                height: '250px',
                width: '300px',
                "color": "black",
                "background-color": "blue",
                cursor: "pointer"
            },
            containerConfig: {
                innerText: ''
            },
            eventConfig: []
        },{
            id: 'content_three',
            type: 'content-container',
            env: ["flash", "html", "backup"],
            "classNode": "active",
            css: {
                height: '250px',
                width: '300px',
                "color": "black",
                "background-color": "green",
                cursor: "pointer"
            },
            containerConfig: {
                innerText: ''
            },
            eventConfig: []
        }]
};

carouselObjectNoDetails = {
        type: 'ContentCarousel',
        id: 'carousel1',
        env: ["flash", "html", "backup"],
        ContentCarouselConfig:{

        },
        eventConfig:[{
                eventType: "carouselAnimationStart",
                actions: [{
                    type: "containerChangeStyles",
                    id: "content_one",
                    styles: {
                        "background-color": "yellow"
                    }
                }]

        }],
        content: [{
            id: 'content_one',
            type: 'content-container',
            env: ["flash", "html", "backup"],
            "classNode": "active",
            css: {
                height: '250px',
                width: '300px',
                "color": "black",
                "background-color": "red",
                cursor: "pointer"
            },
            containerConfig: {
                innerText: ''
            },
            eventConfig: []
        },{
            id: 'content_two',
            type: 'content-container',
            env: ["flash", "html", "backup"],
            "classNode": "active",
            css: {
                height: '250px',
                width: '300px',
                "color": "black",
                "background-color": "blue",
                cursor: "pointer"
            },
            containerConfig: {
                innerText: ''
            },
            eventConfig: []
        },{
            id: 'content_three',
            type: 'content-container',
            env: ["flash", "html", "backup"],
            "classNode": "active",
            css: {
                height: '250px',
                width: '300px',
                "color": "black",
                "background-color": "green",
                cursor: "pointer"
            },
            containerConfig: {
                innerText: ''
            },
            eventConfig: []
        }]
};

describe("ContentCarousel state", function() {

	it("should have ACT.ContentCarousel instance", function(){
	  expect(ACT.ContentCarousel).to.exist;
	});

});

describe("ContentCarousel actions", function(){

    it("should return true against valid arguments", function(done){

      ACT.Event.originalEventFire = ACT.Event.fire;
      sinon.stub(ACT.Event, 'fire', function(event, data){

        if (event === 'register:Actions'){

          var carouselNextSlide = data[0].argument;
          var carouselPreviousSlide = data[1].argument;
          var carouselJumpToSlide = data[2].argument;

          expect(carouselNextSlide.to.test("slideId")).to.be.true;
          expect(carouselNextSlide.timeout.test(10)).to.be.true;
          expect(carouselNextSlide.timeout.test("10")).to.be.true;
          expect(carouselNextSlide.timeout.test(undefined)).to.be.true;
          expect(carouselNextSlide.timeout.test(null)).to.be.true;

          expect(carouselPreviousSlide.to.test("slideId")).to.be.true;
          expect(carouselPreviousSlide.timeout.test(10)).to.be.true;
          expect(carouselPreviousSlide.timeout.test("10")).to.be.true;
          expect(carouselPreviousSlide.timeout.test(undefined)).to.be.true;
          expect(carouselPreviousSlide.timeout.test(null)).to.be.true;

          expect(carouselJumpToSlide.to.test("slideId")).to.be.true;
          expect(carouselJumpToSlide.slidePositionId.test(10)).to.be.true;
          expect(carouselJumpToSlide.timeout.test(10)).to.be.true;
          expect(carouselJumpToSlide.slidePositionId.test("10")).to.be.true;
          expect(carouselJumpToSlide.timeout.test("10")).to.be.tru
          expect(carouselJumpToSlide.timeout.test(undefined)).to.be.true;
          expect(carouselJumpToSlide.timeout.test(null)).to.be.true;

          ACT.Event.fire.restore();
          done();
        } else {
          ACT.Event.originalEventFire(event, data);
        }

      });

      var carousel = new ACT.ContentCarousel(carouselObject);

    });

    it("should return false against invalid arguments", function(done){

      ACT.Event.originalEventFire = ACT.Event.fire;
      sinon.stub(ACT.Event, 'fire', function(event, data){

        if (event === 'register:Actions'){

          var carouselNextSlide = data[0].argument;
          var carouselPreviousSlide = data[1].argument;
          var carouselJumpToSlide = data[2].argument;

          expect(carouselNextSlide.to.test(1)).to.be.false;
          expect(carouselNextSlide.to.test(null)).to.be.false;
          expect(carouselNextSlide.to.test(undefined)).to.be.false;
          expect(carouselNextSlide.timeout.test("test")).to.be.false;


          expect(carouselPreviousSlide.to.test(1)).to.be.false;
          expect(carouselPreviousSlide.to.test(null)).to.be.false;
          expect(carouselPreviousSlide.to.test(undefined)).to.be.false;
          expect(carouselPreviousSlide.timeout.test("test")).to.be.false;


          expect(carouselJumpToSlide.to.test(1)).to.be.false;
          expect(carouselJumpToSlide.to.test(null)).to.be.false;
          expect(carouselJumpToSlide.to.test(undefined)).to.be.false;
          expect(carouselJumpToSlide.slidePositionId.test("test")).to.be.false;
          expect(carouselJumpToSlide.slidePositionId.test(null)).to.be.false;
          expect(carouselJumpToSlide.slidePositionId.test(undefined)).to.be.false;
          expect(carouselJumpToSlide.timeout.test("test")).to.be.false;

          ACT.Event.fire.restore();
          done();
        } else {
          ACT.Event.originalEventFire(event, data);
        }

      });

      var carousel = new ACT.ContentCarousel(carouselObject);

    });

});

describe("ContentCarousel getContent and render", function(){

  before(function(){

    this.status = {
      orientation: 'p',
      screenHeight: '345',
      screenWidth: '1073'
    }

    carousel = new ACT.ContentCarousel(carouselObject);

  });

  after(function(){
    carousel.destroy();
  });

  it("should return a parent container", function(){
    var html = carousel.getContent('html', 'P');
    expect(html.node.id).to.equal('carousel1');
    expect(html.node.className).to.equal(' carousel_class');
  });

  it("should return a full dom slide structure", function(){

    var Scaffolding = new ACT.Scaffolding({
        refObj: carouselObject,
        env: 'html',
        status: this.status
    });

    var node = Scaffolding.get('htmlParsed');
    var wrapper = document.createElement('div');
    wrapper.appendChild(node);
    document.body.appendChild(wrapper);

    var carouselDom = document.getElementById('carousel1');

    expect(carouselDom.childNodes.length).to.equal(1);
    expect(carouselDom.childNodes[0].className).to.equal(' carousel-relative-container');
    expect(carouselDom.childNodes[0].childNodes[0].childNodes.length).to.equal(3);

  });

});

describe("ContentCarousel getContent and render with no CSS or class", function(){

  before(function(){

    this.status = {
      orientation: 'p',
      screenHeight: '345',
      screenWidth: '1073'
    }

    carousel = new ACT.ContentCarousel(carouselObjectNoDetails);

  });

  after(function(){
    carousel.destroy();
  });

  it("should return a parent container", function(){
    var html = carousel.getContent('html', 'P');
    expect(html.node.id).to.equal('carousel1');
  });

  it("should return a full dom slide structure", function(){

    var Scaffolding = new ACT.Scaffolding({
        refObj: carouselObject,
        env: 'html',
        status: this.status
    });

    var node = Scaffolding.get('htmlParsed');
    var wrapper = document.createElement('div');
    wrapper.appendChild(node);
    document.body.appendChild(wrapper);

    var carouselDom = document.getElementById('carousel1');

    expect(carouselDom.childNodes.length).to.equal(1);
    expect(carouselDom.childNodes[0].className).to.equal(' carousel-relative-container');
    expect(carouselDom.childNodes[0].childNodes[0].childNodes.length).to.equal(3);

  });

});

describe("ContentCarousel animation", function(){
  before(function(){

    this.status = {
      orientation: 'p',
      screenHeight: '345',
      screenWidth: '1073'
    }

    carousel = new ACT.ContentCarousel(carouselObject);

    var Scaffolding = new ACT.Scaffolding({
        refObj: carouselObject,
        env: 'html',
        status: this.status
    });

    var node = Scaffolding.get('htmlParsed');
    var wrapper = document.createElement('div');
    wrapper.appendChild(node);
    document.body.appendChild(wrapper);

  });

  after(function(){
    carousel.destroy();
  });

  it("should slide to the left", function(done){

    var eventListener = Event.on('action:complete', function(){
      eventListener.remove();
      done();
    });

    Event.fire('carousel:slideTransition', {
      to: 'carousel1',
      direction: 'LEFT',
      done: function() {
        Event.fire('action:complete');
      }
    });

  });

  it("should slide to the right", function(done){

    var eventListener = Event.on('action:complete', function(){
      eventListener.remove();
      done();
    });

    Event.fire('carousel:slideTransition', {
      to: 'carousel1',
      direction: 'RIGHT',
      done: function() {
        Event.fire('action:complete');
      }
    });

  });

  it("should jump to a specific slide", function(done){

    var eventListener= Event.on('action:complete', function(){
      eventListener.remove();
      done();
    });

    Event.fire('carousel:jumpToSlide', {
      to: 'carousel1',
      slidePositionId: 3,
      done: function() {
        Event.fire('action:complete');
      }
    });

  });


});

