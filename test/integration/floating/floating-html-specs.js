/* global browser, it, describe, before, after */
/* eslint newline-per-chained-call: 0 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
chai.use(chaiAsPromised);

describe('floating-html-specs', function () {
    before(function () {
        var URL = JSON.parse(process.env.functionalLinks).floating;
        return browser
            .session('delete')
            .init()
            .url(URL);
    });

    after(function () {
        return browser.end();
    });

	describe('Start Floating HTML Test', function () {
		it('should find Floating layer playing', function () {
			return browser
				.waitForExist('#ACT_floating', 2000).then(function (exists) {
					assert.isTrue(exists, 'ACT_floating tag exists');
					return browser.getCssProperty('#ACT_floating', 'display');
				}).then(function (display) {
					return assert.equal('block', display.value);
				});
		});

		it('should close floating itself after firstPlay (waiting 3 secs)', function () {
			return browser
				.timeoutsAsyncScript(6000).then(function () {
					browser.pause(6500);
					return browser.getCssProperty('#ACT_floating', 'display');
				}).then(function (display) {
					if (display.value === 'block') {
						// Still visible, wait a bit more
						return browser
							.timeoutsAsyncScript(6000).then(function () {
								browser.pause(3000);
								return browser.waitForVisible('#ACT_mpu', 3000);
							}).then(function (display1) {
								return assert.equal(true, display1);
							});
					}
					return assert.equal('none', display.value);
				});
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
					return assert.isTrue(exists, 'ACT_mpu tag exists');
				});
		});

		it('should find Expandable layer', function () {
			return browser
				.waitForExist('#ACT_expandable', 4000).then(function (exists) {
					return assert.isTrue(exists, 'ACT_expandable tag exists');
				});
		});

		it('should open button in MPU layer open Expandable layer', function () {
			this.timeout(45000);
			return browser
				.waitForVisible('#ACT_mpu', 3000).then(function () {
					return browser.waitForExist('#floating_html', 6000, true);
				}).then(function () {
					return browser.waitForVisible('#ACT_floating', 6000, true);
				}).then(function () {
					return browser.frame('mpu_html');
				}).then(function () {
					// wait for the iframe to close
					return browser.waitForExist('#clickArea', 3000);
				}).then(function (exists) {
					assert.isTrue(exists, 'clickArea tag exists');
				}).then(function () {
					return browser.waitForExist('.button', 3000);
				}).then(function () {
					return browser.click('.button');
				}).then(function (eventTest) {
					return assert.equal(0, eventTest.status);
				});
		});
	});
});
