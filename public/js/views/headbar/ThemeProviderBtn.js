define(["CustomView", "../themes/BackgroundProvider", "css!styles/app/headbar/themeProviderBtn.css"],
    function(CustomView, BackgroundProvider) {

        return CustomView.extend({
            className: 'btn btn-primary dropdown',
            id: 'themeProvider',
            events: {
                click: '_clicked'
            },

            render: function() {
                this.$el.append('<a data-target="#" data-toggle="dropdown" role="button" class="dropdown-toggle">' +
                    '<i class="fa fa-bars"></i></a>');
                this.$el.append(new BackgroundProvider(this.model).view().render().$el);

                return this;
            },

            _clicked: function() {
                this.$('[role="menu"]').toggle("fast");
            }
        });
    });
