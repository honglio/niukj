define(["jquery",
    "common/web/interactions/Sortable"
], function($, Sortable) {


    describe('Sortable', function() {
        var sortable = new Sortable({
            container: {
                0: '<div style="position: relative;"><div class="slideSnapshot defaultbg active" style="height: 91.875px;"><canvas></canvas><span class="close-btn-red-20 removeBtn" title="Remove"></span><span class="badge badge-inverse"></span></div></div>'
            },
            selector: '> .slideSnapshot',
            scrollParent: {
                0: '<div class="slideWell"><div style="position: relative;"><div class="slideSnapshot defaultbg active" style="height: 91.875px;"><canvas></canvas><span class="close-btn-red-20 removeBtn" title="Remove"></span><span class="badge badge-inverse"></span></div></div><div class="wellContextMenu"><div class="addBtn btn btn-warning"><center><i class="icon-plus icon-white"></i></center></div></div></div>'
            }
        });

        describe('module', function() {
            it("has trigger method", function() {
                expect(sortable).to.be.a("object");
                expect(Sortable).to.be.a("function");
                expect(sortable._pressed).to.be.a("function");
            });
        });

        describe('init value', function() {
            it('_delta', function() {
                expect(sortable._delta).to.deep.equal({
                    x: 0,
                    y: 0
                });
            });
        });

        describe('_pressed()', function() {
            var e = jQuery.Event("mousedown", {
                pageX: 64,
                pageY: 128,
                currentTarget: '<canvas>'
            });
            sortable._pressed(e);
            it('Simple test', function() {
                expect(sortable._origPoint).to.deep.equal({
                    x: 64,
                    y: 128
                });
                expect(sortable._delta).to.deep.equal({
                    x: 0,
                    y: 0
                });
                expect(sortable._startIndex).to.deep.equal({
                    r: 0,
                    c: 0
                });
                expect(sortable._startScroll).to.deep.equal();
            });
        });

        describe('events', function() {

        });
    });
});
