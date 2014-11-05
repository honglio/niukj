define(["jquery",
    "common/MapResolver"
], function($, MapResolver) {


    describe('MapResolver', function() {
        var aMap = {
            email: 'test@tobi.com',
            user: {
                admin: 'admin',
                test: 'test'
            },
            pass: 'tobi'
        };

        describe("module", function() {
            it("has trigger method", function() {
                expect(MapResolver).to.be.a("object");
                expect(MapResolver.getItem).to.be.a("function");
            });
        });

        describe("resolveItem", function() {
            it("Return a sub-sub value from the two-dimensional array", function() {
                expect(MapResolver.getItem(aMap, ['user', 'admin'])).to.deep.equal('admin');
            });
        });

        describe("placeItem", function() {
            it("Replace a sub-sub value", function() {
                MapResolver.setItem(aMap, ['user', 'admin'], 'tobi');
                expect(MapResolver.getItem(aMap, ['user', 'admin'])).to.deep.equal('tobi');
            });
        });
    });
});
