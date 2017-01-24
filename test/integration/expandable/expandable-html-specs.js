/* global browser, it, describe, before, after */
/* eslint newline-per-chained-call: 0 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
chai.use(chaiAsPromised);

describe('expandable-html-specs', function () {
    before(function () {
        var URL = JSON.parse(process.env.functionalLinks).expandable;
        return browser
            .session('delete')
            .init()
            .url(URL);
    });

    after(function () {
        return browser.end();
    });

	describe('Start Expandable HTML', function () {
		it('should find template container appended', function () {
			return browser
				.waitForExist('#act-ad-container', 4000).then(function (exists) {
					return assert.isTrue(exists, 'act-ad-container tag exists');
				});
			});
			it('should find MPU layer', function () {
				return browser
					.waitForExist('#ACT_mpu', 2000).then(function (exists) {
						return assert.isTrue(exists, 'ACT_mpu tag exists');
					});
			});

			it('should find Expandable layer', function () {
				return browser
					.waitForExist('#ACT_expandable', 2000).then(function (exists) {
						return assert.isTrue(exists, 'ACT_expandable tag exists');
					});
			});

			// note, button id was moved into the container due Selenium could not find it,
			it('should open button in MPU layer open Expandable layer', function () {
				return browser
					.waitForVisible('#ACT_mpu', 3000).then(function (exists) {
						assert.isTrue(exists, 'ACT_mpu tag exists');
						// click in mpu
						return browser.frame('mpu_html');
					}).then(function () {
						// wait for button to exits
						return browser.waitForExist('#clickArea', 3000);
					}).then(function (exists) {
						assert.isTrue(exists, 'clickArea tag exists');
						// click it
						return browser.click('.button');
					}).then(function () {
						// move to parent container
						return browser.frame(null);
					}).then(function () {
						// wait for expandable layer to render
						return browser.waitForExist('#ACT_expandable', 3000);
					}).then(function (exists) {
						assert.isTrue(exists, 'ACT_expandable tag exists');
						// check its css diplay is block, so visible
						return browser.getCssProperty('#ACT_expandable', 'display');
					}).then(function (display) {
						return assert.equal('block', display.value);
					});
			});

			it('should close button in Expandable layer close Expandable layer', function () {
				return browser
					.frame(null).then(function () {
						// frameParent() does not work, so call frame(null) to move focus into parent frame
						return browser.pause(2000);
					}).then(function () {
						return browser.waitForExist('#ACT_expandable', 2000);
					}).then(function (exists) {
						assert.isTrue(exists, 'ACT_expandable tag exists');
						return browser.frame('expandable_html');
					}).then(function () {
						// wait for the buttons to exit
						return browser.waitForExist('#closeButton', 3000);
					}).then(function (exists) {
						assert.isTrue(exists, 'closeButton tag exists');
						return browser.click('#closeButton');
					}).then(function () {
						return browser.timeoutsAsyncScript(2000);
					}).then(function (eventTest) {
						return assert.equal(0, eventTest.status);
					});
			});
	});
});
