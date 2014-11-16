define(["CustomView",
    "AppModel",
    "./views/headbar/HeadbarView",
    "./views/slide_editor/SlideEditorView"
], function(CustomView, AppModel, HeadbarView, SlideEditorView) {

    return CustomView.extend({
        className: 'container',
        id: 'slide-editor',
        events: {
            destroyed: 'remove'
        },

        initialize: function() {
            this.model = new AppModel();
        },

        render: function() {
            this.$el.empty(); // this.$el = 'container-fluid'
            var self = this;
            setTimeout(function() {
                self.$el.append(new HeadbarView({
                    model: self.model
                }).render().$el);
                self.$el.append(new SlideEditorView({
                    model: self.model
                }).render().$el);
            }, 100);
            return this;
        }
    });
});
