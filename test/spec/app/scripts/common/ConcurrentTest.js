define(["jquery",
    "common/Concurrent"
], function ($, Concurrent) {
    "use strict";

    describe('Concurrent', function () {
        var num = 5;
        var a = 0;
        var b = 0;

        function StepCB() {
            return a += 1;
        }

        function CompleteCB() {
            return b += 99;
        }
        var countdown = new Concurrent.countdown(num, CompleteCB, StepCB);

        describe("module load", function () {
            it("has trigger method", function () {
                expect(countdown).to.be.a("object");
                expect(countdown.decrement).to.be.a("function");
            });
        });

        describe("decrement()", function () {
            it("init value", function () {
                expect(a).to.equal(0);
                expect(b).to.equal(0);
            });
            it("should run num times of StepCB", function () {
                for (var i = num - 1; i >= 0; i-=1) {
                    countdown.decrement();
                    expect(a).to.equal(num - i);
                }
            });
            it("should call CompleteCB", function () {
                expect(b).to.equal(99);
            });
        });
    });
});
