define(["jquery",
    "cloudslide/splash/Splash"
], function ($, Splash) {
    "use strict";

    describe('Splash', function () {
        beforeEach(function () {
            // console.log("Before");
            // do some setup code
        });

        var splash = new Splash();
        describe('your function to be tested', function () {
            it('the expectation which should be happened', function () {});
        });

        describe("module", function () {
            it("has trigger method", function () {
                expect(splash).to.be.a("object");
                expect(Splash).to.be.a("function");
                expect(splash.render).to.be.a("function");
            });
        });

        describe("one tautology", function () {
            it("is tautology", function () {
                expect(true).to.equal(true);
            });
        });

        describe("simple tests", function () {
            it("increments (improved)", function () {
                var mike = 0;
                /* comment out to avoid jshint error */
                // expect(mike++).to.equal(0);
                // expect(mike).to.equal(1);
                // expect(mike += 1).to.equal(2);
            });
        });

        describe("responds to the ajax request correctly", function () {
            it("multiple async call", function (done) {

                // in some callback, call:
                var semaphore = 2;

                setTimeout(function () {
                    // expect(true).to.be.true;
                    semaphore -= 1;
                }, 500);

                setTimeout(function () {
                    // expect(true).to.be.true;
                    semaphore -= 1;
                }, 500);

                setTimeout(function () {
                    expect(semaphore).to.equal(0);
                    done();
                }, 600);
            });
        });

        afterEach(function () {
            // console.log("After");
            // do some cleanup code
        });
    });
});
