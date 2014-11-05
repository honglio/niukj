define(["jquery",
    "common/Math2"
], function($, Math2) {


    describe('Math2', function() {
        describe("module", function() {
            it("has trigger method", function() {
                expect(Math2).to.be.a("object");
                expect(Math2.round).to.be.a("function");
            });
        });

        describe("round()", function() {
            it("Rounds a number to the specified decimal place", function() {
                expect(Math2.round(5.232, 2)).to.deep.equal(5.23);
            });
        });

        describe("toDeg()", function() {
            it("Converts radians to degrees", function() {
                expect(Math2.toDeg(2 * Math.PI)).to.deep.equal(360);
                expect(Math2.toDeg(Math.PI / 4)).to.deep.equal(45);
            });
        });

        describe("toRads()", function() {
            it("Converts degrees to radians", function() {
                expect(Math2.toRads(360)).to.deep.equal(2 * Math.PI);
                expect(Math2.toRads(30)).to.deep.equal(Math.PI / 6);
            });
        });

        describe("withinThresh()", function() {
            it("return true if two numbers are within thresh of one another", function() {
                expect(Math2.withinThresh(1.1, 1.5, 0.5)).to.deep.equal(true);
                expect(Math2.withinThresh(1.5, 1.1, 0.3)).to.deep.equal(false);
            });
        });

    });
});
