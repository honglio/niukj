define([
    "website/list/view/Deckdetail",
    "website/list/model/Deck",
    "templates"
], function(DeckdetailView, DeckModel) {
    "use strict";

    describe('DeckdetailView', function() {
        var model = new DeckModel({
            _id: "123456"
        });
        var view = new DeckdetailView({
            model: model
        });
        describe('Initialize', function() {
            it("should render as a div item", function() {
                expect(view.el.nodeName).to.equal("DIV");
            });
            it("should contain the title as text", function() {
                expect(view.$('legend').text()).to.equal("Deck Details");
            });
            it("should include a label for the status", function() {
                expect(view.$("label").length).to.equal(7);
            });
            it("should include an <input> checkbox", function() {
                expect(view.$("input[type='text']").length).to.equal(5);
            });
            it("should be disabled by default (for '_id')", function() {
                expect(view.$("#deckId").is(":disabled")).to.equal(true);
            });
            it("should be enabled by default (for 'fileName')", function() {
                expect(view.$("#fileName").is(":enabled")).to.equal(true);
            });
        });
        describe("Model Interaction", function() {
            beforeEach(function() {
                this.save_stub = sinon.stub(model, "save");
            });
            afterEach(function() {
                this.save_stub.restore();
            });
            it('should be set for "save"', function() {
                model.set("fileName", "MyTestFile");
                view.render();
                expect(view.$("#fileName").val()).to.equal("MyTestFile");
            });
            it("should update model when save clicked", function() {
                view.$("#slides").val("<p><b>BIG Letter</b></p>");
                view.$("#slides").change();
                view.$(".save").click();
                expect(this.save_stub).to.be.calledOnce;
                expect(model.get('_id')).to.equal("123456");
                expect(model.get('fileName')).to.equal("MyTestFile");
                expect(model.get('slides')).to.equal("<p><b>BIG Letter</b></p>");
            });

        });
    });
});
