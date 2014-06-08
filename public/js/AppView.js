define(["backbone",
        "AppModel",
        "./headbar/HeadbarView"
], function(Backbone, AppModel, HeadbarView) {
	"use strict";
    return Backbone.View.extend({
        className: 'container-fluid',
		id: 'slide-editor',
        events: {
            destroyed: 'remove'
        },

        initialize: function() {
            var model = new AppModel();
            this._headbar = new HeadbarView(model);
            this._slideEditorView = new SlideEditorView(model);
        },

        render: function() {
            this.$el.empty(); // this.$el = 'container-fluid'

            this.$el.append(this._headbar.render().$el);
            this.$el.append(this._slideEditorView.render().$el);
            return this;
        }
    });
});
