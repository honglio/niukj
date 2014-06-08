define(["./ButtonView"
], function(Button) {
    "use strict";
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
            console.log('screen_help register');
            registry.register({
                interfaces: 'cloudslide.ScreenHelpButtonProvider'
            }, service);
        }
    };
});

