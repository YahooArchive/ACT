/* global browser, it, describe, before, after */
/* eslint newline-per-chained-call: 0 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
chai.use(chaiAsPromised);

describe('Loginad-html-specs', function () {
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

	describe('Start Login Ad HTML Test', function () {
		describe('Ad Loaded', function () {
			it('should have ACT_videoLogin layer exist and visible', function () {
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

			it('should have wallpaper image visible', function () {
				return browser
					.waitForExist('#html_container', 4000)
					.isVisible('#html_container')
					.then(function (isVisible) {
						return assert.isTrue(isVisible, 'html_container must be visible');
					})
					.getCssProperty('#html_container', 'background-image')
					.then(function (image) {
						assert.deepEqual(image.property, 'background-image', 'backgound-image property');
						assert.include(image.value, 'https://s.yimg.com/cv/ae/us/audience/040414/1440x1024x2k0t7oif.jpg', 'must have correct image');
						return true;
					});
			});

			it('should have video tag for autoplay', function () {
				return browser
					.waitForExist('#video_login_ap')
					.then(function (isExist) {
						return assert.isTrue(isExist, 'video autoplay elemene exist');
					})
					.getTagName('#video_login_ap')
					.then(function (tagName) {
						return assert.equal(tagName, 'video', 'must be video tag');
					});
			});

			it('should have ACT_videoEmbed layer exist but not visible', function () {
				return browser
					.waitForExist('#ACT_videoEmbed', 4000)
					.then(function (exists) {
						return assert.isTrue(exists, 'ACT_videoEmbed layer must exists');
					})
					.isVisible('#ACT_videoEmbed')
					.then(function (isVisible) {
						return assert.isFalse(isVisible, 'ACT_videoEmbed must be visible');
					});
			});
		});

		describe('click on video to play', function () {
			it('should have click container', function () {
				return browser
					.waitForExist('#apbt_container')
					.then(function (isExist) {
						return assert.isTrue(isExist, 'click container exist elemene exist');
					})
					.click('#apbt_container')
					.then(function (event) {
						return assert.equal(event.status, 0, 'should click without any problem');
					});
			});

			// because internet explorer is run with flash so we need to test it differently
			if (browser.desiredCapabilities.browserName !== 'internet explorer') {
				it('should have video tag user initiated view', function () {
					return browser
						// check if element exist
						.waitForExist('#video_login_full')
						.then(function (isExist) {
							return assert.isTrue(isExist, 'video user initiated element exist');
						})
						// check if it's a video tag
						.getTagName('#video_login_full')
						.then(function (tagName) {
							return assert.equal(tagName, 'video', 'must be video tag');
						})
						// check video type and source
						.getAttribute('#video_login_full source', 'type')
						.then(function (attrs) {
							assert.include(attrs, 'video/webm');
							assert.include(attrs, 'video/mp4');
							return true;
						})
						.getAttribute('#video_login_full source', 'src')
						.then(function (attrs) {
							assert.include(attrs, 'https://s.yimg.com/cv/ae/us/audience/040414/600x600x2k0t79sa.webm');
							assert.include(attrs, 'https://s.yimg.com/cv/ae/us/audience/040414/600x600x2k0t77vo.mp4');
							return true;
						});
				});
			} else if (browser.desiredCapabilities.version.indexOf('9') !== 0) {
			// Exlude test on IE9 because IE9 in SauceLab doesn't have flash installed
				it('should have flash container for rendereding video on IE', function () {
					return browser
						// check if element exist
						.waitForExist('#swf_container')
						.then(function (isExist) {
							return assert.isTrue(isExist, 'video flash element exist');
						})
						// check if it's a video tag
						.getTagName('#swf_container')
						.then(function (tagName) {
							return assert.equal(tagName, 'object', 'must be swf tag');
						})

						// check flash source
						.getAttribute('#swf_container param[name=src]', 'value')
						.then(function (attr) {
							return assert.equal(attr, 'https://s.yimg.com/cv/ae/global/actjs/login/ie_video_player.swf', 'must have correct flash file');
						})

						// check video source
						.getAttribute('#swf_container param[name=movie]', 'value')
						.then(function (attr) {
							return assert.equal(attr, 'https://s.yimg.com/cv/ae/global/actjs/login/ie_video_player.swf', 'must have correct flash file');
						});
				});
			}
		});

		describe('click on clicktag', function () {
			it('should open landing page', function () {
				var numberOfTabs = 1;
				return browser
					.getTabIds()
					.then(function (tabsIds) {
						numberOfTabs = tabsIds.length;
					})
					.waitForVisible('#click_container', 10000)
					.click('#click_container')
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
