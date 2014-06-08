define(["jquery",
    "common/Adapter"
], function ($, Adapter) {
    "use strict";

    describe('Adapter', function () {
        var wrapped = {
            left: function () {
                return 1;
            }
        };
        var adapter = new Adapter(wrapped, {
            right: 'left'
        });
        describe("module load", function () {
            it("has trigger method", function () {
                expect(adapter).to.be.a("object");
                expect(Adapter).to.be.a("function");
            });
        });

        describe("adapter", function () {
            it("has left and right", function () {
                expect(adapter.right()).to.equal(1);
            });
        });
    });
});