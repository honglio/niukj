define(["CustomView"],
    function(CustomView) {

        return CustomView.extend({
            className: 'addBtn btn btn-warning',
            events: {
                click: '_addSlide'
            },

            initialize: function() {},

            render: function() {
                this.$el.html('<center><i class="fa fa-plus fa-lg"></i></center>');
                return this;
            },

            _addSlide: function() {
                this.model.addSlide(this.options.wellContextBox.slideIndex());
            }
        });
    });
