var expect = chai.expect;

describe("ACT.IO", function() {
    /* ACT.Environment test */
    it("should have ACT.IO instance", function() {
        expect(ACT.IO).to.exist;
    });

    /* ACT.Lang test */
    it("should have ACT.Lang instance", function() {
        expect(ACT.Lang).to.exist;
    });

    describe('checking loading files', function(){
        var comingData;
        before(function() {
            // faking head
            sinon.stub(document, 'getElementsByTagName', function(){
                return [{
                    appendChild: function(child){

                        if (child.onload){
                            child.onload();
                            console.log(child.onload);
                        } else if (child.onreadystatechange){
                            child.readyState == "complete"
                            child.onreadystatechange();
                        }
                    }
                }];

            });
        });    

        after(function(){
            document.getElementsByTagName.restore();
        });

        it('should fire "load:done" event and give the right data', function(done) {
            ACT.Event.on('IO:load:done', function(data){
                    var data = getFeed();
                    console.log(data)
                    expect(data).to.exist;
                    expect(data.response.blog.title).to.equal("Winter Adventures");
                    done();
            });

			var config = {
				dataFeed : "json_feed.js"
            };
            comingData = new ACT.IO(config);
        });
    });
});
