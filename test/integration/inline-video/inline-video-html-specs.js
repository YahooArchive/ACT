/* global browser, it, describe, before, after */
/* eslint newline-per-chained-call: 0 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
chai.use(chaiAsPromised);

describe('inline-video-html-specs', function () {
    before(function () {
        var URL = JSON.parse(process.env.functionalLinks)['inline-video'];
        return browser
            .session('delete')
            .init()
            .url(URL);
    });

    after(function () {
        return browser.end();
    });

	describe('Start Inline Video HTML Test', function () {
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
			// wait for button video play to exits
			return browser
				.waitForExist('#button_play_video', 4000).then(function (exists) {
					assert.isTrue(exists, 'button_play_video tag exists');
					// click the video
					return browser.click('#button_play_video');
				}).then(function (eventTest) {
					return assert.equal(0, eventTest.status);
				});
		});
	});
});
