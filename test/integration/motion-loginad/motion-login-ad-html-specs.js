/* global browser, it, describe, before, after */
/* eslint newline-per-chained-call: 0 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
chai.use(chaiAsPromised);

describe('Motion-Loginad-html-specs', function () {
    before(function () {
        var URL = JSON.parse(process.env.functionalLinks)['motion-loginad'];
        return browser
            .session('delete')
            .init()
            .url(URL);
    });

    after(function () {
        return browser.end();
    });

	describe('Start Motion Login Ad HTML Test', function () {
		describe('Ad Loaded', function () {
			it('should have ACT_login layer exist and visible', function () {
				return browser
					.waitForExist('#ACT_login', 4000)
					.then(function (exists) {
						return assert.isTrue(exists, 'ACT_login layer must exists');
					})
					.isVisible('#ACT_login')
					.then(function (isVisible) {
						return assert.isTrue(isVisible, 'ACT_login must be visible');
					});
			});

			it('should have video tag for autoplay', function () {
				return browser
					.waitForExist('#video1')
					.then(function (isExist) {
						return assert.isTrue(isExist, 'video autoplay element exists');
					})
					.getTagName('#video1')
					.then(function (tagName) {
						return assert.equal(tagName, 'video', 'must be video tag');
					})
					.getAttribute('#video1', 'autoplay')
					.then(function (attr) {
						return assert.equal(attr, 'true', 'must be set to autoplay');
					})
					.getAttribute('#video1', 'loop')
					.then(function (attr) {
						return assert.equal(attr, 'true', 'must be set to loop');
					})
					.getAttribute('#video1 source', 'type')
					.then(function (attrs) {
						assert.include(attrs, 'video/webm');
						assert.include(attrs, 'video/mp4');
						return true;
					})
					.getAttribute('#video1 source', 'src')
					.then(function (attrs) {
						assert.include(attrs, 'https://s.yimg.com/cv/ae/uk/audience/040426/1440x810xto00kyuv.webm');
						assert.include(attrs, 'https://s.yimg.com/cv/ae/uk/audience/040426/1440x810xto00kicf.mp4');
						return true;
					});
			});

			it('should have Video control buttons', function () {
				return browser
					.waitForExist('#userinit_videocontrols_btn')
					.then(function (exists) {
						return assert.isTrue(exists, 'Video controls container must exists');
					})
					.isVisible('#userinit_play_btn')
					.then(function (isVisible) {
						return assert.isFalse(isVisible, 'Play button must be visible');
					})
					.isVisible('#userinit_pause_btn')
					.then(function (isVisible) {
						return assert.isTrue(isVisible, 'Pause button must be visible');
					});
			});
		});

		describe('click on video to pause', function () {
			it('should have click container', function () {
				return browser
					.click('#userinit_pause_btn')
					.then(function (event) {
						return assert.equal(event.status, 0, 'should click without any problem');
					})
					.isVisible('#userinit_play_btn')
					.then(function (isVisible) {
						return assert.isTrue(isVisible, 'Play button must be visible');
					})
					.isVisible('#userinit_pause_btn')
					.then(function (isVisible) {
						return assert.isFalse(isVisible, 'Pause button must be visible');
					});
			});
		});

		describe('click on video to play', function () {
			it('should have click container', function () {
				return browser
					.click('#userinit_play_btn')
					.then(function (event) {
						return assert.equal(event.status, 0, 'should click without any problem');
					})
					.isVisible('#userinit_pause_btn')
					.then(function (isVisible) {
						return assert.isTrue(isVisible, 'Play button must be visible');
					})
					.isVisible('#userinit_play_btn')
					.then(function (isVisible) {
						return assert.isFalse(isVisible, 'Pause button must be visible');
					});
			});
		});

		describe('click on clicktags', function () {
			it('wallpaper click should open landing page', function () {
				var numberOfTabs = 1;
				return browser
					.getTabIds()
					.then(function (tabsIds) {
						numberOfTabs = tabsIds.length;
					})
					.waitForVisible('#wallpaper_rich_standard', 2000)
					.click('#wallpaper_rich_standard')
					.waitUntil(function () {
						return browser
							.getTabIds()
							.then(function (tabs) {
								return tabs.length > numberOfTabs;
							});
					})
					.getTabIds()
					.then(function (tabs) {
						assert.isTrue(tabs.length === numberOfTabs + 1, 'must have 1 more tab opened');
						return tabs[tabs.length - 1];
					});
			});
		});
    });
});
