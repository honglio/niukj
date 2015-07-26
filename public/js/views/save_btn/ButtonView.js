define(["CustomView", "../storage/StorageModal"], function(CustomView, StorageModal) {

    return CustomView.extend({
        className: 'btn btn-dark',
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
            this.$el.html('<i class="fa fa-save"></i>');
            return this;
        },

        _clicked: function() {
            this._modal.show();
            this.model._deck.get('activeSlide').trigger('saveBtnClicked');
        }
    });
});
