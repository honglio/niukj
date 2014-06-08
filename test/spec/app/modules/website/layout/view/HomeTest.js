define([
    "website/layout/view/Home",
    "templates"
], function(HomeView) {
    "use strict";
    describe('HomeView', function() {
        beforeEach(function() {
            this.homeView = new HomeView();
        });
        it("should render as a div item", function() {
            expect(this.homeView.el.nodeName).to.equal("DIV");
        });
        it('templates should load succuessful', function() {
            var $market = this.homeView.$('.marketing');
            expect($market.find('h1').eq(0).text()).to.equal('现在就来改善您的课件吧');
            expect($market.find('.marketing-img').eq(0).attr('src')).to.equal('../img/collect.jpg');
        });
    });
});
