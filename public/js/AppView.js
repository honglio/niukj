define(["CustomView",
        "AppModel",
        "./views/headbar/HeadbarView",
        "./views/slide_editor/SlideEditorView"
], function(CustomView, AppModel, HeadbarView, SlideEditorView) {
	"use strict";
    return CustomView.extend({
        className: 'container-fluid',
		id: 'slide-editor',
        events: {
            destroyed: 'remove'
        },

        initialize: function() {
            var model = new AppModel();
            this._headbar = new HeadbarView({model: model});
            this._slideEditorView = new SlideEditorView({model: model});
        },

        render: function() {
            this.$el.empty(); // this.$el = 'container-fluid'

            this.$el.append(this._headbar.render().$el);
            this.$el.append(this._slideEditorView.render().$el);
            return this;
        }
    });
});
