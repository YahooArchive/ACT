var expect = chai.expect;
var assert = chai.assert;

describe("Start test for ad feedback", function(){
	var Event;
	var Lang;
	var Dom;
	var Animation;

	before(function(){
		refreshModule('Event');
		refreshModule('ContentAdfeedback');
		Event = ACT.Event;
		Lang = ACT.Lang;
		Dom = ACT.Dom;
		Animation = ACT.Animation;
	});

var wrapper = document.createElement('div');
wrapper.setAttribute('id', 'adfeedback-act-ad');
document.body.appendChild(wrapper);
describe("ContentAdfeedback", function() {


describe("ContentAdfeedback state", function() {

	it("should have ACT.ContentAdfeedback instance", function(){
	  expect(ACT.ContentAdfeedback).to.exist;
	});

	it("should have ACT.dom instance", function(){
	  expect(Dom).to.exist;
	});

	it("should have ACT.lang instance", function(){
	  expect(Lang).to.exist;
	});

	it("should have ACT.event instance", function(){
	  expect(Event).to.exist;
	});

  it("should have ACT.Animation instance", function(){
    expect(Animation).to.exist;
  });

});

describe("ContentAdfeedback actions", function(){

  before(function(){
    var fpad_fdb = {
        fdb_exp: "1444049377585",
        fdb_intl: "fr-FR",
        fdb_on: "1",
        fdb_url: "https://beap-bc.yahoo.com/af/emea?bv=1.0.0&bs=(162j5gvqp(gid$6gDJqTEwLjLI_Ge9VhIpRxuaNjYuMVYSVcERcipk,st$1444042177585614,srv$1,si$3189532,ct$25,exp$1444049377585614,adv$27771008204,li$436719532,cr$5587359032,dmn$www.toyota.fr,v$1.0,pbid$26876032518))&al=(type${type},cmnt${cmnt},subo${subo})&r=10"
    };

    this.adfeedbackObject = {
      type: 'content-adfeedback',
      id: 'adfeedback1',
      env: ["flash", "html", "backup"],
      classNode: 'adfeedback_class',
      css: {
          'width': '300px',
          'height': '250px',
          'display': 'block',
          'overflow': 'visible'
      },
      AdfeedbackConfig: {
        triggerNode: 'adfeedback-act-ad',
        placement_config: fpad_fdb,
        translation_config: {
          act_fdb_balloon_text: "I don't like this ad",
          fdb_srvy_title: "What don't you like about this ad?",
          fdb_srvy_thankyou_text: "Thank you for helping us improve your Yahoo experience",
          fdb_srvy_answers_one: "It's distracting",
          fdb_srvy_answers_two: "It's not relevant",
          fdb_srvy_answers_three: "It's offensive",
          fdb_srvy_answers_four: "Something else",
          fdb_srvy_details_submit: "Send",
          fdb_srvy_why_text: "Why do I see ads?",
          fdb_srvy_learn_text: "Learn more about your feedback.",
          fdb_srvy_done: "Done"
         },
        url_config: {
          adfeedback_open_why_url: 'https://uk.yahoo.com',
          adfeedback_open_learn_url: 'https://uk.yahoo.com'
        }
      },
      eventConfig: [{
        eventType: 'adfeedbackEnabled',
        actions:[{
          type: 'containerHide',
          id: 'test_container'
        }]
      }]};
  });

  it("should return true against valid arguments", function(done){

      ACT.Event.originalEventFire = ACT.Event.fire;
      sinon.stub(ACT.Event, 'fire', function(event, data){
console.log(data);
        if (event === 'register:Actions'){

          var disableAdFeedbackInit = data[0].argument;
          var enableAdFeedbackInit = data[1].argument;
          var enableAdFeedback = data[2].argument;
          var trackAdfeedback = data[3].argument;


          expect(disableAdFeedbackInit.timeout.test("10")).to.be.true;
          expect(disableAdFeedbackInit.timeout.test(10)).to.be.true;
          expect(disableAdFeedbackInit.timeout.test(undefined)).to.be.true;
          expect(disableAdFeedbackInit.timeout.test(null)).to.be.true;

          expect(enableAdFeedbackInit.timeout.test("10")).to.be.true;
          expect(enableAdFeedbackInit.timeout.test(10)).to.be.true;
          expect(enableAdFeedbackInit.timeout.test(undefined)).to.be.true;
          expect(enableAdFeedbackInit.timeout.test(null)).to.be.true;

          expect(enableAdFeedback.timeout.test("10")).to.be.true;
          expect(enableAdFeedback.timeout.test(10)).to.be.true;
          expect(enableAdFeedback.timeout.test(undefined)).to.be.true;
          expect(enableAdFeedback.timeout.test(null)).to.be.true;

          expect(trackAdfeedback.interactionType.test("test")).to.be.true;
          expect(trackAdfeedback.suboption.test(1)).to.be.true;
          expect(trackAdfeedback.commentNodeId.test(1)).to.be.true;
          expect(trackAdfeedback.suboption.test("1")).to.be.true;
          expect(trackAdfeedback.commentNodeId.test("1")).to.be.true;

          expect(trackAdfeedback.timeout.test(10)).to.be.true;
          expect(trackAdfeedback.timeout.test("10")).to.be.true;
          expect(trackAdfeedback.timeout.test(undefined)).to.be.true;
          expect(trackAdfeedback.timeout.test(null)).to.be.true;

          ACT.Event.fire.restore();
          done();
        } else {
            ACT.Event.originalEventFire(event, data);
        }


      });

    var adfeedback = new ACT.ContentAdfeedback(this.adfeedbackObject);


  });
  it("should return false against invalid arguments", function(done){

      ACT.Event.originalEventFire = ACT.Event.fire;
      sinon.stub(ACT.Event, 'fire', function(event, data){

        if (event === 'register:Actions'){

          var disableAdFeedbackInit = data[0].argument;
          var enableAdFeedbackInit = data[1].argument;
          var enableAdFeedback = data[2].argument;
          var trackAdfeedback = data[3].argument;

          expect(disableAdFeedbackInit.timeout.test("test")).to.be.false;
          expect(enableAdFeedbackInit.timeout.test("test")).to.be.false;
          expect(enableAdFeedback.timeout.test("test")).to.be.false;
          expect(trackAdfeedback.timeout.test("test")).to.be.false;

          ACT.Event.fire.restore();
          done();
        } else {
            ACT.Event.originalEventFire(event, data);
        }


      });

    var adfeedback = new ACT.ContentAdfeedback(this.adfeedbackObject);

  });

});

describe("ContentAdfeedback getContent", function(){

  before(function(){
    sinon.stub(ACT.Event, 'fire');

    var fpad_fdb = {
        fdb_exp: "1444049377585",
        fdb_intl: "fr-FR",
        fdb_on: "1",
        fdb_url: "https://beap-bc.yahoo.com/af/emea?bv=1.0.0&bs=(162j5gvqp(gid$6gDJqTEwLjLI_Ge9VhIpRxuaNjYuMVYSVcERcipk,st$1444042177585614,srv$1,si$3189532,ct$25,exp$1444049377585614,adv$27771008204,li$436719532,cr$5587359032,dmn$www.toyota.fr,v$1.0,pbid$26876032518))&al=(type${type},cmnt${cmnt},subo${subo})&r=10"
    };

    this.adfeedbackObject = {
      type: 'content-adfeedback',
      id: 'adfeedback1',
      env: ["flash", "html", "backup"],
      classNode: 'adfeedback_class',
      css: {
          'width': '300px',
          'height': '250px',
          'display': 'block',
          'overflow': 'visible'
      },
      AdfeedbackConfig: {
        triggerNode: 'adfeedback-act-ad',
        placement_config: fpad_fdb,
        translation_config: {
          act_fdb_balloon_text: "I don't like this ad",
          fdb_srvy_title: "What don't you like about this ad?",
          fdb_srvy_thankyou_text: "Thank you for helping us improve your Yahoo experience",
          fdb_srvy_answers_one: "It's distracting",
          fdb_srvy_answers_two: "It's not relevant",
          fdb_srvy_answers_three: "It's offensive",
          fdb_srvy_answers_four: "Something else",
          fdb_srvy_details_submit: "Send",
          fdb_srvy_why_text: "Why do I see ads?",
          fdb_srvy_learn_text: "Learn more about your feedback.",
          fdb_srvy_done: "Done"
         },
        url_config: {
          adfeedback_open_why_url: 'https://uk.yahoo.com',
          adfeedback_open_learn_url: 'https://uk.yahoo.com'
        }
      },
      eventConfig: [{
        eventType: 'adfeedbackEnabled',
        actions:[{
          type: 'containerHide',
          id: 'test_container'
        }]
      }]};


  });

  after(function(){
    ACT.Event.fire.restore();
  });

  it("should render a node with a class", function(){
    var adfeedback = new ACT.ContentAdfeedback(this.adfeedbackObject);
    var fdb = adfeedback.getContent();
    wrapper.appendChild(fdb.node);

    var nodeClass = fdb.node.className;

    assert.strictEqual(" "+this.adfeedbackObject.classNode, nodeClass, 'class name not found');

    adfeedback.destructor();

  });

  it("should render a node without a class", function(){
    var fdbObject = this.adfeedbackObject;
    fdbObject.classNode = '';

    var adfeedback = new ACT.ContentAdfeedback(fdbObject);

    var fdb = adfeedback.getContent();
    wrapper.appendChild(fdb.node);

    var nodeClass = fdb.node.className;

    assert.strictEqual('', nodeClass, 'class name found');

    adfeedback.destructor();

  });

  it("should render a node with css styles set", function(){
    var adfeedback = new ACT.ContentAdfeedback(this.adfeedbackObject);
    var fdb = adfeedback.getContent();
    wrapper.appendChild(fdb.node);

    assert.strictEqual(this.adfeedbackObject.css.width, fdb.node.style.width, 'width not found');
    assert.strictEqual(this.adfeedbackObject.css.height, fdb.node.style.height, 'height not found');
    assert.strictEqual(this.adfeedbackObject.css.display, fdb.node.style.display, 'display not found');
    adfeedback.destructor();

  });

  it("should render a node without css styles set", function(){
    var fdbObject = this.adfeedbackObject;
    delete fdbObject.css;

    var adfeedback = new ACT.ContentAdfeedback(fdbObject);
    var fdb = adfeedback.getContent();
    wrapper.appendChild(fdb.node);

    assert.strictEqual('', fdb.node.style.width, 'width found');
    assert.strictEqual('', fdb.node.style.height, 'height found');
    assert.strictEqual('', fdb.node.style.display, 'display found');
    adfeedback.destructor();

  });

  it("should not pass content with adfeedback config not passed", function(){
    var fdbObject = this.adfeedbackObject;
    fdbObject.AdfeedbackConfig.placement_config = undefined;

    var adfeedback = new ACT.ContentAdfeedback(fdbObject);
    var fdb = adfeedback.getContent();

    assert.strictEqual(false, fdb, 'getContent returned data');

    adfeedback.destructor();

  });

  it("should not pass content with adfeedback switched off", function(){

    var adfeedback_off_config = {
        fdb_exp: "1444049377585",
        fdb_intl: "fr-FR",
        fdb_on: "0",
        fdb_url: "https://beap-bc.yahoo.com/af/emea?bv=1.0.0&bs=(162j5gvqp(gid$6gDJqTEwLjLI_Ge9VhIpRxuaNjYuMVYSVcERcipk,st$1444042177585614,srv$1,si$3189532,ct$25,exp$1444049377585614,adv$27771008204,li$436719532,cr$5587359032,dmn$www.toyota.fr,v$1.0,pbid$26876032518))&al=(type${type},cmnt${cmnt},subo${subo})&r=10"
    };

    var fdbObject = this.adfeedbackObject;
    fdbObject.AdfeedbackConfig.placement_config = adfeedback_off_config;

    var adfeedback = new ACT.ContentAdfeedback(fdbObject);
    var fdb = adfeedback.getContent();

    assert.strictEqual(false, fdb, 'getContent returned data');

    adfeedback.destructor();

  });

  it("should not pass content with the capability config not set", function(){
    var fdbObject = this.adfeedbackObject;
    delete fdbObject.AdfeedbackConfig;

    var adfeedback = new ACT.ContentAdfeedback(fdbObject);
    var fdb = adfeedback.getContent();

    assert.strictEqual(false, fdb, 'getContent returned data');

    adfeedback.destructor();

  });

});

describe("ContentAdfeedback interaction tracking", function(){
  before(function(){
    sinon.stub(ACT.Event, 'fire');
    var fpad_fdb = {
        fdb_exp: "1444049377585",
        fdb_intl: "fr-FR",
        fdb_on: "1",
        fdb_url: "https://localhost:3000&al=(type${type},cmnt${cmnt},subo${subo})&r=10"
    };

    this.adfeedbackObject = {
      type: 'content-adfeedback',
      id: 'adfeedback1',
      env: ["flash", "html", "backup"],
      classNode: 'adfeedback_class',
      css: {
          'width': '300px',
          'height': '250px',
          'display': 'block',
          'overflow': 'visible'
      },
      AdfeedbackConfig: {
        triggerNode: 'adfeedback-act-ad',
        placement_config: fpad_fdb,
        translation_config: {
          act_fdb_balloon_text: "I don't like this ad",
          fdb_srvy_title: "What don't you like about this ad?",
          fdb_srvy_thankyou_text: "Thank you for helping us improve your Yahoo experience",
          fdb_srvy_answers_one: "It's distracting",
          fdb_srvy_answers_two: "It's not relevant",
          fdb_srvy_answers_three: "It's offensive",
          fdb_srvy_answers_four: "Something else",
          fdb_srvy_details_submit: "Send",
          fdb_srvy_why_text: "Why do I see ads?",
          fdb_srvy_learn_text: "Learn more about your feedback.",
          fdb_srvy_done: "Done"
         },
        url_config: {
          adfeedback_open_why_url: 'https://uk.yahoo.com',
          adfeedback_open_learn_url: 'https://uk.yahoo.com'
        }
      }
    };


  });

  after(function(){
    ACT.Event.fire.restore();
  });

  it("should fire a fdb_start event", function(done){
    var fdbObject = this.adfeedbackObject;

    sinon.stub(ACT.Util, 'pixelTrack', function(url){
      assert.strictEqual("https://localhost:3000&r=10&al=(type$fdb_start)r=10", url, 'returned url is not expected');
      done();
      ACT.Util.pixelTrack.restore();
    });

    var adfeedback = new ACT.ContentAdfeedback(fdbObject);
    var fdb = adfeedback.interaction_track('fdb_start', null, null, null);

    adfeedback.destructor();

  });

  it("should fire a fdb_submit event with a suboption", function(done){
    var fdbObject = this.adfeedbackObject;

    sinon.stub(ACT.Util, 'pixelTrack', function(url){
      assert.strictEqual("https://localhost:3000&r=10&al=(type$fdb_submit,subo$2)r=10", url, 'returned url is not expected');
      done();
      ACT.Util.pixelTrack.restore();
    });

    var adfeedback = new ACT.ContentAdfeedback(fdbObject);
    var fdb = adfeedback.interaction_track('fdb_submit', 2, null, null);

    adfeedback.destructor();

  });

 it("should not fire an event with a track type smaller than 4 characters", function(){
    var fdbObject = this.adfeedbackObject;

    var adfeedback = new ACT.ContentAdfeedback(fdbObject);
    var fdb = adfeedback.interaction_track('act', null, null, null);

    adfeedback.destructor();

  });

 it("should not fire an event with no track type", function(){
    var fdbObject = this.adfeedbackObject;

    var adfeedback = new ACT.ContentAdfeedback(fdbObject);
    var fdb = adfeedback.interaction_track(null, null, null, null);

    adfeedback.destructor();

  });

 it("should not fire a subopt 2 event with a comment", function(){
    var TAwrapper = document.createElement('div');
    TAwrapper.setAttribute('id', 'adfeedback-act-ad-textarea');
    TAwrapper.innerHTML =  "<textarea id=\"testCommentNode\" maxlength=\"512\" autofocus=\"autofocus\">hello world</textarea>";
    document.body.appendChild(TAwrapper);

    var fdbObject = this.adfeedbackObject;

    var adfeedback = new ACT.ContentAdfeedback(fdbObject);
    var fdb = adfeedback.interaction_track('fdb_submit', 2, 'testCommentNode', null);

    adfeedback.destructor();
    document.body.removeChild(TAwrapper);

  });

 it("should not fire an event with a done callback", function(done){
    var fdbObject = this.adfeedbackObject;

    sinon.stub(ACT.Util, 'pixelTrack', function(url){
      assert.strictEqual("https://localhost:3000&r=10&al=(type$fdb_submit,subo$2)r=10", url, 'returned url is not expected');
      ACT.Util.pixelTrack.restore();
    });

    var adfeedback = new ACT.ContentAdfeedback(fdbObject);
    var fdb = adfeedback.interaction_track('fdb_submit', 2, null, function(){
      done();
    });

    adfeedback.destructor();


  });

});

describe("ContentAdfeedback enable function", function(){
  before(function(){
    sinon.stub(ACT.Event, 'fire');

    var fpad_fdb = {
        fdb_exp: "1444049377585",
        fdb_intl: "fr-FR",
        fdb_on: "1",
        fdb_url: "https://localhost:3000&al=(type${type},cmnt${cmnt},subo${subo})&r=10"
    };

    this.adfeedbackObject = {
      type: 'content-adfeedback',
      id: 'adfeedback1',
      env: ["flash", "html", "backup"],
      classNode: 'adfeedback_class',
      css: {
          'width': '300px',
          'height': '250px',
          'display': 'block',
          'overflow': 'visible'
      },
      AdfeedbackConfig: {
        triggerNode: 'adfeedback-act-ad',
        placement_config: fpad_fdb,
        translation_config: {
          act_fdb_balloon_text: "I don't like this ad",
          fdb_srvy_title: "What don't you like about this ad?",
          fdb_srvy_thankyou_text: "Thank you for helping us improve your Yahoo experience",
          fdb_srvy_answers_one: "It's distracting",
          fdb_srvy_answers_two: "It's not relevant",
          fdb_srvy_answers_three: "It's offensive",
          fdb_srvy_answers_four: "Something else",
          fdb_srvy_details_submit: "Send",
          fdb_srvy_why_text: "Why do I see ads?",
          fdb_srvy_learn_text: "Learn more about your feedback.",
          fdb_srvy_done: "Done"
         },
        url_config: {
          adfeedback_open_why_url: 'https://uk.yahoo.com',
          adfeedback_open_learn_url: 'https://uk.yahoo.com'
        }
      }
    };


  });

  after(function(){
    ACT.Event.fire.restore();
  });

  it("should fire add:actions", function(){
    var fdbObject = this.adfeedbackObject;



    var adfeedback = new ACT.ContentAdfeedback(fdbObject);
    var fdb = adfeedback.enableAdfeedback();


    expect(Event.fire.calledWith('add:actions'), 'must fire event add:actions').to.be.true;


  adfeedback.destructor();
  });


});

});
});
