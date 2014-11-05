define(["./ButtonView"], function(Button) {

    var service = {
        createButtons: function() {
            var buttons = [];

            buttons.push(new Button({
                icon: 'icon-question-sign',
                name: '帮助'
            }));

            return buttons;
        }
    };

    return {
        initialize: function(registry) {
            registry.register({
                interfaces: 'cloudslide.ScreenHelpButtonProvider'
            }, service);
        }
    };
});
