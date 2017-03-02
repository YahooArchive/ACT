/* global browser, it, describe, before, after */
/* eslint newline-per-chained-call: 0 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
chai.use(chaiAsPromised);

describe('billboard-html-specs', function () {
    before(function () {
        var URL = JSON.parse(process.env.functionalLinks).billboard;
        return browser
            .session('delete')
            .init()
            .url(URL);
    });

    after(function () {
        return browser.end();
    });

	describe('Start Billboard HTML Test', function () {
		it('should find ACT_billboard layer', function () {
			return browser
				.waitForExist('#ACT_billboard', 4000).then(function (exists) {
					assert.isTrue(exists, 'ACT tag exists');
					return browser.getTagName('#ACT_billboard');
				}).then(function (tagName) {
					return assert.equal('div', tagName);
				});
		});

		it('should click close button and change layer inline CSS to diplay "none"', function () {
			return browser
				.waitForExist('#closeBtn', 10000).then(function (exists) {
					assert.isTrue(exists, 'Close Button exists');
					return browser.click('#closeBtn');
				}).then(function () {
					return browser.waitForExist('#ACT_billboard', 10000);
				}).then(function (exists) {
					assert.isTrue(exists, 'ACT tag exists');
					return browser.getCssProperty('#ACT_billboard', 'display');
				}).then(function (display) {
					return assert.equal('none', display.value);
				});
		});

		it('should click open button and change layer inline CSS to diplay "block"', function () {
			return browser
				.waitForExist('#openBtn', 10000).then(function (exists) {
					assert.isTrue(exists, 'Open Button exists');
					return browser.click('#openBtn');
				}).then(function () {
					return browser.waitForExist('#ACT_billboard', 10000);
				}).then(function (exists) {
					assert.isTrue(exists, 'ACT tag exists');
					return browser.getCssProperty('#ACT_billboard', 'display');
				}).then(function (display) {
					return assert.equal('block', display.value);
				});
		});

		it('should click throught landing page within HTML5 content', function () {
			return browser
				.waitForExist('#html5_container', 10000).then(function (exists) {
					assert.isTrue(exists, 'HTML5 container exists');
					return browser.getTagName('#html5_container');
				}).then(function (tagName) {
					assert.equal('iframe', tagName);
					return browser.frame('html5_container');
				}).then(function () {
					return browser.waitForExist('.button', 40000);
				}).then(function (exists) {
					assert.isTrue(exists, 'Button class exists');
					return browser.click('.button');
				}).then(function (eventTest) {
					return assert.equal(0, eventTest.status);
				});
		});
	});
});
