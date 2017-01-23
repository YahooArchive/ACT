/* global browser, it, describe, before, after */
/* eslint newline-per-chained-call: 0 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
chai.use(chaiAsPromised);

describe('billboard-backup-specs', function () {
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

    describe('Start Billboard Backup Test', function () {
        it('should find ACT_billboard layer', function () {
            return browser
                .waitForExist('#ACT_billboard', 2000).then(function (exists) {
                    assert.isTrue(exists, 'ACT tag exists');
                    return browser.getTagName('#ACT_billboard');
                }).then(function (tagName) {
                    return assert.equal('div', tagName);
                });
        });

        it('should click close button and change layer inline CSS to diplay "none"', function () {
            return browser
                .waitForExist('#closeBtn', 2000).then(function (exists) {
                    assert.isTrue(exists, 'closeBtn tag exists');
                    return browser.click('#closeBtn');
                }).then(function () {
                    return browser.waitForExist('#ACT_billboard', 20000);
                }).then(function (exists) {
                    assert.isTrue(exists, 'ACT tag exists');
                    return browser.getCssProperty('#ACT_billboard', 'display');
                }).then(function (display) {
                    return assert.equal('none', display.value);
                });
        });

        it('should click open button and change layer inline CSS to diplay "block"', function () {
            return browser
                .waitForExist('#openBtn', 2000).then(function (exists) {
                    assert.isTrue(exists, 'openBtn tag exists');
                    return browser.click('#openBtn');
                }).then(function () {
                    return browser.waitForExist('#ACT_billboard', 20000);
                }).then(function (exists) {
                    assert.isTrue(exists, 'ACT tag exists');
                    return browser.
                            getCssProperty('#ACT_billboard', 'display');
                }).then(function (display) {
                    return assert.equal('block', display.value);
                });
        });

        it('should click throught backup image to landding page', function () {
            return browser
                .waitForExist('#backup_container', 2000).then(function (exists) {
                    assert.isTrue(exists, 'backup_container tag exists');
                    return browser.click('#backup_container');
                }).then(function (eventTest) {
                    return assert.equal(0, eventTest.status);
                });
        });
    });
});
