define(["jquery",
    "common/Queue"
], function($, Queue) {


    describe('Queue', function() {
        var num = 3,
            a = 0,
            b = 0,
            queue = new Queue();

        function StepCB() {
            return a += 1;
        }

        function CompleteCB() {
            return b += 99;
        }

        describe("module", function() {
            it("has trigger method", function() {
                expect(queue).to.be.a("object");
                expect(queue.dequeue).to.be.a("function");
            });
        });

        describe("decrement()", function() {
            it("allow enqueue object and function", function() {
                queue.enqueue(a);
                queue.enqueue(b);
                queue.enqueue(StepCB);
                queue.enqueue(CompleteCB);
            });
            it("allow take", function() {
                for (var i = num - 1; i >= 0; i -= 1) {
                    queue.dequeue();
                }
            });
            it("should run CompleteCB", function() {
                expect((queue.dequeue())()).to.equal(99);
            });
        });
    });
});
