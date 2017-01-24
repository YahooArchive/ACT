/* global browser, it, describe, before, after */
/* eslint newline-per-chained-call: 0 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
chai.use(chaiAsPromised);

describe('floating-backup-specs', function () {
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

	describe('Start Floating Backup Test', function () {
		it('should find template container appended', function () {
			return browser
				.waitForExist('#act-ad-container', 6000).then(function (exists) {
					return assert.isTrue(exists, 'act-ad-container tag exists');
				});
		});

		it('should find MPU layer', function () {
			return browser
				.waitForExist('#ACT_mpu', 6000).then(function (exists) {
					return assert.isTrue(exists, 'ACT_mpu tag exists');
				});
		});

		it('should find backup image', function () {
			return browser
				.waitForExist('#backup_image', 6000).then(function (exists) {
					return assert.isTrue(exists, 'ACT_mpu tag exists');
				});
		});

		it('should click thought image', function () {
			return browser
				.waitForExist('#backup_container', 6000).then(function (exists) {
					assert.isTrue(exists, 'ACT_mpu tag exists');
					return browser.click('#backup_container');
				}).then(function (eventTest) {
					return assert.equal(0, eventTest.status);
				});
		});
	});
});
