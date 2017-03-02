/* global browser, it, describe, before, after */
/* eslint newline-per-chained-call: 0 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
chai.use(chaiAsPromised);

describe('HTML5-Loginad-html-specs', function () {
    before(function () {
        var URL = JSON.parse(process.env.functionalLinks)['html5-loginad'];
        return browser
            .session('delete')
            .init()
            .url(URL);
    });

    after(function () {
        return browser.end();
    });

    describe('Start HTML5 Login Ad Test', function () {
        it('should have ACT_login layer exist and be visible', function () {
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

		it('should have wallpaper container exist', function () {
			return browser
				.waitForExist('#wallpaper_container', 4000)
				.then(function (exists) {
					return assert.isTrue(exists, 'wallpaper_container must exists');
				});
		});

		it('should have wallpaper asset exist and image src set', function () {
			return browser
				.waitForExist('#wallpaper_standard_rich_image')
				.then(function (isExist) {
					return assert.isTrue(isExist, 'wallpaper element exists');
				})
				.getTagName('#wallpaper_standard_rich_image')
				.then(function (tagName) {
					return assert.equal(tagName, 'img', 'must be image tag');
				})
				.getAttribute('#wallpaper_standard_rich_image', 'src')
				.then(function (attr) {
					return assert.equal(attr, 'https://s.yimg.com/cv/ae/us/audience/050510/1440x1280xtttnvyrg.jpg', 'must be set to correct value');
				});
		});

		it('should have an iframed asset container', function () {
			return browser
				.waitForExist('#html5_container', 4000)
				.then(function (exists) {
					return assert.isTrue(exists, 'HTML5 iframe must exist');
				});
		});

		it('iframed click should register successfully', function () {
			return browser
			.waitForExist('#html5_container', 5000).then(function (exists) {
				assert.isTrue(exists, 'HTML5 container exists');
				return browser.getTagName('#html5_container');
			}).then(function (tagName) {
				assert.equal('iframe', tagName);
				return browser.frame('html5_container');
			}).then(function () {
				return browser.waitForExist('#txtBtn', 4000);
			}).then(function (exists) {
				assert.isTrue(exists, 'Button exists');
				return browser.click('#txtBtn');
			}).then(function (eventTest) {
				return assert.equal(0, eventTest.status);
			});
		});
	});
});
