define(["CustomView", "../storage/StorageModal"], function(CustomView, StorageModal) {

    return CustomView.extend({
        className: 'btn btn-success',
        tagName: 'a',
        events: {
            click: '_clicked'
        },

        initialize: function() {
            this._modal = StorageModal.get({
                model: this.model
            });
        },

        render: function() {
            this.$el.html('保存');
            return this;
        },

        _clicked: function() {
            this._modal.show();
        }
    });
});
