define(["CustomView",
    "../storage/StorageModal"
], function(CustomView, StorageModal) {
    "use strict";
    return CustomView.extend({
        events: {
            click: 'save',
            destroyed: 'remove'
        },

        initialize: function() {
            this.storageModal = new StorageModal({model: this.model});
            $('#modals').append(this.storageModal.render().$el);
        },

        render: function() {
            this.$el.find('.save-button').html('<a>保存</a>');
            return this;
        },

        save: function() {
            this.storageModal.show();
        }
    });
});
