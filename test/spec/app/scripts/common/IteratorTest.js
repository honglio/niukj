define(["jquery",
    "common/Iterator"
], function ($, Iterator) {
    "use strict";

    describe('Iterator', function () {
        var num = 5,
            array = [1, 2, 3],
            obj = { a: 1, b: 2, c: 3 },
            nIterator = new Iterator(num),
            aIterator = new Iterator(array),
            oIterator = new Iterator(obj);

        describe("module", function () {
            it("has trigger method", function () {
                expect(nIterator).to.deep.equal({});
                expect(aIterator).to.be.a("object");
                expect(oIterator).to.be.a("object");
                expect(nIterator.next).to.equal(undefined);
                expect(aIterator.next).to.be.a("function");
                expect(oIterator.next).to.be.a("function");
            });
        });

        describe("hasNext()", function () {
            it("init value", function () {
                expect(aIterator.hasNext()).to.equal(true);
                expect(oIterator.hasNext()).to.equal(true);
            });
        });

        describe("next()", function () {
            it("next elem is 2", function () {
                expect(aIterator.next()).to.equal(2);
                expect(oIterator.next()).to.equal(2);
            });
            it("the last elem is 3", function () {
                expect(aIterator.hasNext()).to.equal(true);
                expect(oIterator.hasNext()).to.equal(true);
                expect(aIterator.next()).to.equal(3);
                expect(oIterator.next()).to.equal(3);
            });
            it("beyond end value", function () {
                expect(aIterator.hasNext()).to.equal(false);
                expect(oIterator.hasNext()).to.equal(false);
                expect(aIterator.next()).to.equal(undefined);
                expect(oIterator.next()).to.equal(undefined);
            });
        });
    });
});