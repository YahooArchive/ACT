/* global browser, it, describe, before, after */
/* eslint newline-per-chained-call: 0 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
chai.use(chaiAsPromised);

describe('Loginad-backup-specs', function () {
    before(function () {
        var URL = JSON.parse(process.env.functionalLinks).loginad;
		return browser
            .session('delete')
            .init()
            .url(URL);
    });
     after(function () {
        return browser.end();
    });

	describe('Start LoginAd Backup Tests.', function () {
		it('should have login layer exist and visible', function () {
			return browser
				.waitForExist('#ACT_videoLogin', 4000)
				.then(function (exists) {
					return assert.isTrue(exists, 'ACT_videoLogin layer must exists');
				})
				.isVisible('#ACT_videoLogin')
				.then(function (isVisible) {
					return assert.isTrue(isVisible, 'ACT_videoLogin must be visible');
				});
		});

		it('should have backup container with backup image', function () {
			return browser
				.waitForExist('#bkp_container', 4000)
				.then(function (exists) {
					return assert.isTrue(exists, 'backup container must exists');
				})
				.isVisible('#bkp_container')
				.then(function (isVisible) {
					return assert.isTrue(isVisible, 'backup container must be shown');
				})
				.getCssProperty('#bkp_container', 'background-image')
				.then(function (image) {
					assert.deepEqual(image.property, 'background-image', 'backgound-image property test');
					return assert.include(image.value, 'https://s.yimg.com/cv/ae/us/audience/040414/1440x1024x2k0tog7a.jpg', 'must have correct image');
				});
		});

		it('should click through backup image', function () {
			var numberOfTabs = 1;
			return browser
				// get number of tabs opened at the moment
				.getTabIds()
				.then(function (tabIds) {
					numberOfTabs = tabIds.length;
				})
				.waitForVisible('#bkp_container', 4000)
				.click('#bkp_container')
				.pause(3000)
				.getTabIds()
				.then(function (tabs) {
					assert.isTrue(tabs.length === numberOfTabs + 1, 'must have 1 more tab opened');
					return tabs[tabs.length - 1];
				});
		});
	});
});
