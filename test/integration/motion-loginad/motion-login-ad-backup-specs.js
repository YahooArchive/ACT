var chai = require('chai');
var assert = chai.assert;

describe('Motion-Loginad-backup-specs', function() {
    before(function(done) {
        this.timeout(300000);
        var URL = JSON.parse(process.env.functionalLinks)['motion-loginad'];
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
            .waitForExist('#ACT_login', 4000)
            .then(function(exists) {
                return assert.isTrue(exists, 'ACT_login layer must exists');
            })

            .isVisible('#ACT_login')
            .then(function(isVisible) {
                return assert.isTrue(isVisible, 'ACT_vlogin must be visible');
            });
    });

    it("should have backup container with backup image", function() {
        return browser
            .waitForExist('#wallpaper_backup', 4000)
            .then(function(exists) {
                return assert.isTrue(exists, 'backup container must exists');
            })
            .isVisible('#wallpaper_backup')
            .then(function(isVisible) {
                return assert.isTrue(isVisible, 'backup container must be shown');
            })
            .getAttribute('#wallpaper_backup_image', 'src')
            .then(function(imageSrc) {
                assert.deepEqual(imageSrc, 'https://s.yimg.com/cv/ae/uk/audience/040426/1440x1024xto00k99f.jpg', 'image src attribute test');
                return true;
            });
    });

    it("should click through backup image", function() {

        var numberOfTabs = 1;

        return browser
            .getTabIds()
            .then(function(tabIds) {
                numberOfTabs = tabIds.length;
            })
            .waitForVisible('#wallpaper_backup', 4000)
            .click('#wallpaper_backup')
            .pause(3000)
            .getTabIds()
            .then(function(tabs) {
                assert.isTrue(tabs.length == numberOfTabs + 1, 'must have 1 more tab opened');
                return tabs[tabs.length - 1];
            });
    });
});
