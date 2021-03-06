define(["CustomView"], function(CustomView) {

    return CustomView.extend({
        className: 'btn btn-icon icon-left hidden-print',
        tagName: 'a',

        events: {
            click: '_clicked'
        },

        initialize: function() {
            this.$el.attr('data-compType', this.options.componentType);
            this.$el.addClass(this.options.btnType);
        },

        _clicked: function() {
            this.model.addComponent(this.options.componentType);
        },

        render: function() {
            this.$el.html('<i class="' + this.options.icon + '"></i> <strong>' + this.options.name + '</strong>');
            return this;
        },
    });
});
