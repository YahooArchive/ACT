var chai = require('chai');
var assert = chai.assert;

describe('HTML5-Loginad-backup-specs', function() {
    before(function(done) {
        this.timeout(300000);
        var URL = JSON.parse(process.env.functionalLinks)['html5-loginad'];
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


    it("should have login layer exist and be visible", function() {
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

    it('should have wallpaper container exist', function() {
        return browser
            .waitForExist('#wallpaper_container', 4000)
            .then(function(exists) {
                return assert.isTrue(exists, 'wallpaper_container must exists');
            });
    });

    it('should have wallpaper asset exist and image src set', function() {
        return browser
            .waitForExist("#wallpaper_backup_image", 4000)
            .then(function(isExist) {
                return assert.isTrue(isExist, 'wallpaper element exists');
            })
            .getTagName('#wallpaper_backup_image')
            .then(function(tagName) {
                return assert.equal(tagName, 'img', 'must be image tag');
            })
            .getAttribute('#wallpaper_backup_image', 'src')
            .then(function(attr) {
                return assert.equal(attr, 'https://s.yimg.com/cv/ae/us/audience/050510/1440x1280xtttnvyrg.jpg', 'must be set to correct value');
            });
    });  

    it("should have backup container with backup image", function() {
        return browser
            .waitForExist('#html5_backup_container', 4000)
            .then(function(exists) {
                return assert.isTrue(exists, 'backup container must exists');
            })
            .getAttribute('#login_backup_image', 'src')
            .then(function(imageSrc) {
                assert.deepEqual(imageSrc, 'https://s.yimg.com/cv/ae/us/audience/050510/600x450xtttnvypn.png', 'image src attribute test');
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
