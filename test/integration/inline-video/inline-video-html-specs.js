var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var assert = chai.assert;

describe('inline-video-html-specs', function () {

    before(function () {
        this.timeout(300000);
        var URL = JSON.parse(process.env.functionalLinks)['inline-video'];
        return browser
            .session('delete')
            .init()
            .url(URL);
    });

    after(function(){
        return browser.end();
    });

    it('should find template container appended', function () {
        return browser
            .waitForExist('#act-ad-container', 4000).then(function (exists) {
                return assert.isTrue(exists, 'act-ad-container tag exists');
            });
    });

    it('should find MPU layer', function () {
        return browser
            .waitForExist('#ACT_mpu', 4000).then(function (exists) {
                return assert.isTrue(exists, 'act-ad-container tag exists');
            });
    });


    it('play video playing', function () {

        //wait for button video play to exits
        return browser
            .waitForExist('#button_play_video', 4000).then(function(exists){
                assert.isTrue(exists, 'button_play_video tag exists');
                //click the video
                return browser.click('#button_play_video');
            }).then(function (eventTest) {
                return assert.equal(0, eventTest.status);
            });

            //browser logs are too buggy supported in Window 10
            // .log('browser')
            // //logs in selenium must be concated by + and not using commas.
            // //get all the videos logs and scan it locking for the start//
            // .then(function(logs){
            //   var word = "start";
            //   for(var i=0; i<logs.value.length; i++){
            //     var msg = logs.value[i].message;
            //     var test = msg.match(/start/g);
            //     var result;
            //     //check for
            //     if( test!== null){
            //       result = test;
            //     }
            //     if(i==logs.value.length-1){
            //       //check that video has started by looking for start word in the video module logs and expected to matched more than zero
            //       assert.notEqual(0, result.length);
            //       browser.end(done);
            //     }
            //   }
            //});

    });

});




