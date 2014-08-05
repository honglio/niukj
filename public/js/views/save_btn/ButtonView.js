define(["CustomView",
    "../storage/StorageModal"
], function(CustomView, StorageModal) {
    "use strict";
    return CustomView.extend({
        className: 'btn btn-success',
        tagName: 'a',
        events: {
            click: 'save'
        },

        initialize: function() {
            this.storageModal = new StorageModal({model: this.model});
            $('#modals').append(this.storageModal.render().$el);
        },

        render: function() {
            this.$el.html('保存');
            return this;
        },

        save: function() {
            this.storageModal.show();
        }
    });
});
