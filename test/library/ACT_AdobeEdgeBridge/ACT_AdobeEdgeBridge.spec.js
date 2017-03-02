var expect = chai.expect;

/* Generic function exist tests */
describe("ACT.AdobeEdgeBridge", function() {

	beforeEach(function() {
		AEB = ACT.AdobeEdgeBridge;
	});

    /* ACT.AdobeEdgeBridge test */
    it("should have ACT.AdobeEdgeBridge instance", function() {
        expect(ACT.AdobeEdgeBridge).to.exist;
    });

    /* ACT.Lang test */
    it("should have ACT.Lang instance", function() {
        expect(ACT.Lang).to.exist;
    });

    /* ACT.Event test */
    it("should have ACT.Event instance", function() {
        expect(ACT.Lang).to.exist;
    });
    
    /* AdobeEdgeBridge.trackR */
    it("should have trackR", function(){
    	expect(AEB.trackR).to.exist;
    });

    /* AdobeEdgeBridge.trackN */
    it("should have trackN", function(){
    	expect(AEB.trackN).to.exist;
    });

    /* AdobeEdgeBridge.getComposition */
    it("should have getComposition", function(){
    	expect(AEB.getComposition).to.exist;
    });

    /* AdobeEdgeBridge.stopComposition */
    it("should have stopComposition", function(){
    	expect(AEB.stopComposition).to.exist;
    });

    /* AdobeEdgeBridge.replayComposition */
    it("should have replayComposition", function(){
    	expect(AEB.replayComposition).to.exist;
    });
});

describe("ACT.AdobeEdgeBridge Functional Tests ", function() {

	beforeEach(function() {
		AEB = ACT.AdobeEdgeBridge;
	});

	it ('Should fire trackR custom event', function() {
		var event = ACT.Event;
		var payload = {
			"compositionId": "a",
			"eventType": "event_type",
			"action_name": "action_name_track_name",
			"special": ""
		};
		var payloadCompare = {};
		event.on('ContentAdobeEdge:actions', function(data) { payloadCompare = data; }, null, this);
		AEB.trackR( "a", "event_type", "action_name_track_name", "" );	
		expect(payloadCompare).to.deep.equal(payload);
	});

	it ('Should fire trackN custom event', function() {
		var event = ACT.Event;
		var payload = {
			"compositionId": "b",
			"eventType": "event_type",
			"action_name": "action_name_track_name",
			"special": ""
		};
		var payloadCompare = {};
		event.on('ContentAdobeEdge:actions', function(data) { payloadCompare = data; }, null, this);
		AEB.trackN( "b", "event_type", "action_name_track_name", "" );	
		expect(payloadCompare).to.deep.equal(payload);
	});
	
	it("Should be able to 'get composition'", function(){
		
		window.AdobeEdge = {
			"getComposition": function( id ){
				return {
					id: id
				}
			}
		};
		
		expect(AEB.getComposition("mclaren_init_150723").id).to.be.equal("mclaren_init_150723");
		console.log(AEB.getComposition("mclaren_init_150723"));
	});
	
	it("Should be able to run stopComposition", function(){
		expect(AEB.stopComposition("a")).not.to.throw;
	});

	it("Should be able to run replayComposition", function(){
		expect(AEB.replayComposition("a")).not.to.throw;
	});
});