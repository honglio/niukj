define(["CustomView",
    "./view/StorageModal",
    "./view/SaveItem",
    "./model/StorageInterface",
], function(CustomView, ) {
    "use strict";
    return CustomView.extend({
        events: {
            click: 'save',
            destroyed: 'remove'
        },

        initialize: function() {
            this.storageModal = new StorageModal(this._editorModel);
            $('#modals').append(this.storageModal.render().$el);
        },

        render: function() {
            this.$el.find('.save-button').append('<a>保存</a>');
            return this;
        },

        save: function() {
            this.storageModal.show();
        },

        constructor: function ButtonView(editorModel) {
            this._editorModel = editorModel;
            Backbone.View.prototype.constructor.apply(this, arguments);
        }
    });
});
