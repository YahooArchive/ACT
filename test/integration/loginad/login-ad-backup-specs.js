var chai = require('chai');
var assert = chai.assert;

describe('Loginad-backup-specs', function() {

    before(function(done) {
        this.timeout(300000);
        var URL = JSON.parse(process.env.functionalLinks).loginad;
        // var URL = 'https://s.yimg.com/cv/ae/actjs/integration/loginad/2/index.html';
        // var URL = 'https://act-tools.zenfs.com/default/160418/iframe.html';
        return browser
            .session('delete')
            .init()
            .url(URL)
            .waitForExist('iframe#adeast-container', 50000)
            .frame('adeast-container')
            .then(function() {
                done();
            });
    });

    after(function() {
        return browser.end();
    })


    it("should have login layer exist and visible", function() {
        return browser
            .waitForExist('#ACT_videoLogin', 4000)
            .then(function(exists) {
                return assert.isTrue(exists, 'ACT_videoLogin layer must exists');
            })

            .isVisible('#ACT_videoLogin')
            .then(function(isVisible) {
                return assert.isTrue(isVisible, 'ACT_videoLogin must be visible');
            });
    });

	/* NOTE: With the latest update, if a layer should not play for an environment, it no longer renders. */
/*
    it('should have video layer exist but not visible', function() {
        return browser
            .waitForExist('#ACT_videoEmbed', 4000)
            .then(function(exists) {
                return assert.isTrue(exists, 'ACT_videoEmbed layer must exists');
            })

            .isVisible('#ACT_videoEmbed')
            .then(function(isVisible) {
                return assert.isFalse(isVisible, 'ACT_videoEmbed must not be visible');
            });

    });
*/

    it("should have backup container with backup image", function() {
        return browser
            .waitForExist('#bkp_container', 4000)
            .then(function(exists) {
                return assert.isTrue(exists, 'backup container must exists');
            })

            // container must be visible
            .isVisible('#bkp_container')
            .then(function(isVisible) {
                return assert.isTrue(isVisible, 'backup container must be shown');
            })

            // background image must available
            .getCssProperty('#bkp_container', 'background-image')
            .then(function(image) {

                // console.log(image);
                // output the following: {
                //     property: 'backgound-image',
                //     value: 'url("https://s.yimg.com/cv/ae/us/audience/040414/1440x1024x2k0tog7a.jpg")'
                // }

                assert.deepEqual(image.property, 'background-image', 'backgound-image property test');
                assert.include(image.value, 'https://s.yimg.com/cv/ae/us/audience/040414/1440x1024x2k0tog7a.jpg', 'must have correct image');
                return true;
            });

    });

    it("should click through backup image", function() {
        var numberOfTabs = 1;

        return browser
            // get number of tabs opened at the moment
            .getTabIds()
            .then(function(tabIds) {
                numberOfTabs = tabIds.length;
            })

            // click on backup container
            .waitForVisible('#bkp_container', 4000)
            .click('#bkp_container')

            // 3s for page to be loaded
            .pause(3000)

            .getTabIds()
            .then(function(tabs) {
                assert.isTrue(tabs.length == numberOfTabs + 1, 'must have 1 more tab opened');
                return tabs[tabs.length - 1];
            });
    });

});
