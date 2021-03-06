define(["CustomView", "../themes/ThemeProvider", "css!styles/app/headbar/themeProviderBtn.css"],
    function(CustomView, ThemeProvider) {

        return CustomView.extend({
            className: 'btn btn-primary dropdown',
            id: 'themeProvider',
            events: {
                click: '_clicked'
            },

            render: function() {
                this.$el.append('<a data-target="#" data-toggle="dropdown" role="button" class="dropdown-toggle">' +
                    '<i class="fa fa-bars"></i></a>');
                this.$el.append(new ThemeProvider(this.model).view().render().$el);

                return this;
            },

            _clicked: function() {
                this.$('[role="menu"]').toggle("fast");
            }
        });
    });
