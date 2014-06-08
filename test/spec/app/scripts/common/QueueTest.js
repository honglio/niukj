define(["jquery",
    "common/Queue"
], function ($, Queue) {
    "use strict";

    describe('Queue', function () {
        var num = 3;
        var a = 0;
        var b = 0;

        function StepCB() {
            return a += 1;
        }

        function CompleteCB() {
            return b += 99;
        }
        var queue = new Queue();

        describe("module", function () {
            it("has trigger method", function () {
                expect(queue).to.be.a("object");
                expect(queue.dequeue).to.be.a("function");
            });
        });

        describe("decrement()", function () {
            it("allow enqueue object and function", function () {
                queue.enqueue(a);
                queue.enqueue(b);
                queue.enqueue(StepCB);
                queue.enqueue(CompleteCB);
            });
            it("allow take", function () {
                for (var i = num - 1; i >= 0; i-=1) {
                    queue.dequeue();
                }
            });
            it("should run CompleteCB", function () {
                expect((queue.dequeue())()).to.equal(99);
            });
        });
    });
});