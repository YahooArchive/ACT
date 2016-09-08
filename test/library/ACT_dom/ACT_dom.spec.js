var expect = chai.expect;

describe("ACT.Dom", function () {

    var dom;

    beforeEach(function () {
        dom = ACT.Dom;
    });

    it("should have ACT.Dom instance", function () {
        expect(ACT.Dom).to.exist;
    });

    describe("byId", function () {
        var fakeId = "block";

        beforeEach(function () {
            createDummyElement(fakeId);
        });

        afterEach(function () {
            removeDummyElement(fakeId);
        });

        it("should return null in case there is no element with id", function () {
            expect(dom.byId("test")).to.be.null;
            expect(dom.byId("test")).to.not.exist;
        });
        it("should return element when exists", function () {
            var el = createDummyElement('block');
            expect(dom.byId('block')).to.exist;
        });
    });

    describe('viewportOffset', function () {
        var fakeId = "view";
        var element;
        var back;

        beforeEach(function () {
            element = createDummyElement(fakeId);
        });

        afterEach(function () {
            removeDummyElement(fakeId);
        });

        it('should return the viewportOffset', function () {
            var viewport = dom.viewportOffset(fakeId);
            expect(viewport.left).to.be.at.least(0);
            expect(viewport.top).to.be.at.least(0);
        });

    });

    describe('hasClass', function () {
        var fakeId = "hasClass";
        var element;

        beforeEach(function () {
            element = createDummyElement(fakeId);
            element.className = "dummy1 dummy2 other";
        });

        afterEach(function () {
            removeDummyElement(fakeId);
        });

        it('should return false when there is not a class for the element', function () {
            var res = dom.hasClass(element, 'fake');
            expect(res).to.be.false;
        });

        it('should return true when there is a class for the element', function () {
            var res = dom.hasClass(element, 'dummy1');
            expect(res).to.be.true;
        });

        it('should return true when there is a class for the element', function () {
            var res = dom.hasClass(element, 'dummy2');
            expect(res).to.be.true;
        });

        it('should return true when there is a class for the element', function () {
            var res = dom.hasClass(element, 'other');
            expect(res).to.be.true;
        });
    });

    describe('byClassName', function () {
        var fakeId = "byClassName";
        var element, el2;

        beforeEach(function () {
            element = createDummyElement(fakeId);
            element.className = "dummy1 dummy2 other";
            el2 = createDummyElement('el2');
            el2.className = "other";
        });

        afterEach(function () {
            removeDummyElement(fakeId);
            removeDummyElement('el2');
        });

        it('should return empty array when no element is found', function () {
            var res = dom.byClassName('fake');
            expect(res.length).to.equal(0);
        });

        it('should return only one element', function () {
            var res = dom.byClassName('dummy1');
            expect(res.length).to.equal(1);
        });

        it('should return two elements', function () {
            var res = dom.byClassName('other');
            expect(res.length).to.equal(2);
        });
    });

    describe('addClass', function () {
        var fakeId = "addClass";
        var element;

        beforeEach(function () {
            element = createDummyElement(fakeId);
        });

        afterEach(function () {
            removeDummyElement(fakeId);
        });

        it('should be false if no elements are passed', function () {
            var res = dom.addClass();
            expect(res).to.be.false;
        });

        it('should add first classname', function () {
            var res = dom.addClass(element, 'test');
            expect(res).to.be.true;
            expect(dom.hasClass(element, 'test')).to.be.true;
        });

        it('should add more than one classname', function () {
            var res = dom.addClass(element, 'test');
            expect(res).to.be.true;
            expect(dom.hasClass(element, 'test')).to.be.true;
            var res = dom.addClass(element, 'test2');
            expect(res).to.be.true;
            expect(dom.hasClass(element, 'test2')).to.be.true;
        });

    });

    describe('removeClass', function () {
        var fakeId = "removeClass";
        var element;

        beforeEach(function () {
            element = createDummyElement(fakeId);
            element.className = "test1 test2 fakeclass";
        });

        afterEach(function () {
            removeDummyElement(fakeId);
        });

        it('should be false if element has no class', function () {
            var res = dom.removeClass(element, 'notreal');
            expect(res).to.be.false;
        });

        it('should remove first classname', function () {
            expect(dom.hasClass(element, 'test1')).to.be.true;
            var res = dom.removeClass(element, 'test1');
            expect(res).to.be.true;
            expect(dom.hasClass(element, 'test1')).to.be.false;
        });

        it('should remove classname', function () {
            expect(dom.hasClass(element, 'test2')).to.be.true;
            var res = dom.removeClass(element, 'test2');
            expect(res).to.be.true;
            expect(dom.hasClass(element, 'test2')).to.be.false;
        });

        it('should remove classname', function () {
            expect(dom.hasClass(element, 'fakeclass')).to.be.true;
            var res = dom.removeClass(element, 'fakeclass');
            expect(res).to.be.true;
            expect(dom.hasClass(element, 'fakeclass')).to.be.false;
        });
    });

    describe('nodeCreate', function () {
        it('should create single div', function () {
            var el = dom.nodeCreate('<div></div>');
            expect(el).to.exist;
        });

        it('should create div append to body and find by id', function () {
            var el = dom.nodeCreate('<div id="testing">Booo</div>');
            var body = document.getElementsByTagName("body")[0];
            body.appendChild(el);
            var domel = document.getElementById('testing');
            expect(domel).to.exist;
            removeDummyElement('testing');
        });
    });

    describe('getParent', function () {
        var fakeId = "getParent";
        var element;
        var child;

        beforeEach(function () {
            element = createDummyElement(fakeId);
            element.className = "test1 test2 fakeclass";
            child = document.createElement('div');
            child.id = "child";
            element.appendChild(child);
            child = document.getElementById('child');
        });

        afterEach(function () {
            removeDummyElement(fakeId);
        });

        it('should return null when element doesnt have selector', function () {
            var res = dom.getParent("fake", child);
            expect(res).to.be.null;
        });

        it('should return element when element has selector', function () {
            var res = dom.getParent("test1", child);
            expect(res).to.exist;
            expect(res.id).to.equal(fakeId);
        });

        it('should return element when element has selector', function () {
            var res = dom.getParent("test2", element);
            expect(res).to.exist;
            expect(res.id).to.equal(fakeId);
        });
    });

    describe('clear', function () {
        var fakeId = "clear";
        var element;

        beforeEach(function () {
            element = createDummyElement(fakeId);
            element.className = "test1 test2 fakeclass";
            element.innerHTML = 'PrettyBear';
        });

        afterEach(function () {
            removeDummyElement(fakeId);
        });

        it('should handle when its not a DOM element', function () {
            expect(dom.clear()).not.to.throw;
            expect(element.innerHTML).to.equal('PrettyBear');
        });

        it('should clear DOM element', function () {
            expect(dom.clear(element)).not.to.throw;
            expect(element.innerHTML).to.equal('');
        });
    });

    describe('visible', function () {
        var fakeId = "visible";
        var element;

        beforeEach(function () {
            element = createDummyElement(fakeId);
            element.className = "test1 test2 fakeclass";
        });

        afterEach(function () {
            removeDummyElement(fakeId);
        });

        it('should set visibility to visible', function () {
            dom.visible(element, true);
            expect(element.style.visibility).to.equal('visible');
        });

        it('should set visibility to hidden', function () {
            dom.visible(element, false);
            expect(element.style.visibility).to.equal('hidden');
        });
    });

    describe('display', function () {
        var fakeId = "display";
        var element;

        beforeEach(function () {
            element = createDummyElement(fakeId);
            element.className = "test1 test2 fakeclass";
        });

        afterEach(function () {
            removeDummyElement(fakeId);
        });

        it('should set display to block', function () {
            dom.display(element, 'block');
            expect(element.style.display).to.equal('block');
        });

        it('should set visibility to empty', function () {
            dom.display(element);
            expect(element.style.display).to.equal('');
        });
    });

    describe('createStylesheet', function () {
        it('should create a new stylesheet', function () {
            var sheet = dom.createStylesheet();
            expect(sheet).to.exist;
            expect(sheet instanceof CSSStyleSheet).to.be.true;
        });
    });

    describe('addCSSRule', function () {
        var fakeId = "addCSSRule";
        var element;
        var sheet;

        beforeEach(function () {
            element = createDummyElement(fakeId);
            sheet = dom.createStylesheet();
            sheet.id = 'test';
        });

        afterEach(function () {
            removeDummyElement(fakeId);
        });

        it('should add a new css rule', function () {
            dom.addCSSRule(sheet, '#' + fakeId, 'color:red;', 0);
            expect(sheet.cssRules.length).to.be.at.least(1);

            dom.addCSSRule(sheet, '#' + fakeId, 'width: 300px;', 0);
            expect(sheet.cssRules.length).to.be.at.least(2);
        });
    });

    describe('applyStyles', function () {
        var fakeId = "addCSSRule";
        var element;

        beforeEach(function () {
            element = createDummyElement(fakeId);
        });

        afterEach(function () {
            removeDummyElement(fakeId);
        });

        it('should apply styles', function () {
            element.style['width'] = '0px';
            element.style['color'] = 'red';
            expect(element.style['width']).to.equal('0px');
            expect(element.style['color']).to.equal('red');

            dom.applyStyles(element, {width: '300px', color: 'blue'});
            expect(element.style['width']).to.equal('300px');
            expect(element.style['color']).to.equal('blue');
        });
    });

    describe('isDomElement', function () {
        var fakeId = "isDomElement";
        var element;

        beforeEach(function () {
            element = createDummyElement(fakeId);
        });

        afterEach(function () {
            removeDummyElement(fakeId);
        });

        it('should return false when no dom element', function () {
            var res = dom.isDomElement({});
            expect(res).to.be.false;
        });

        it('should return true when dom element', function () {
            var res = dom.isDomElement(element);
            expect(res).to.be.true;
        });

    });

    describe('getWindowSize', function () {
        it('shouldnt throw and error', function () {
            expect(dom.getWindowSize()).not.throw;
        });

        it('should return a minimum size', function () {
            var val = dom.getWindowSize();

            expect(val.width).to.be.at.least(0);
            expect(val.height).to.be.at.least(0);
        });

    });

    describe("getMinProportion", function () {
        it('should return proportion 1', function () {
            var prop = dom.getMinProportion(10, 10);
            expect(prop).to.be.equal(1);
        });

        it('should return proportion less than 1', function () {
            var prop = dom.getMinProportion(20000, 10000);
            expect(prop).to.be.below(1);
        });
    });

    describe("getCurrentLocation", function(){
        it('should return window location href', function(){
            var currentLocation = window.location.href;
            var result = dom.getCurrentLocation();

            expect(result, currentLocation).to.equal;
        });
    });
});

function createDummyElement(id) {
    var iDiv = document.createElement('div');
    iDiv.id = id;
    document.getElementsByTagName('body')[0].appendChild(iDiv);
    return document.getElementById(id);
}

function removeDummyElement(id) {
    var iDiv = document.getElementById(id);
    if (iDiv) {
        document.getElementsByTagName('body')[0].removeChild(iDiv);
    }
}