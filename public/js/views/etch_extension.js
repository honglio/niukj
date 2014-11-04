define([
    "underscore",
    "etch",
    "hbs!templates/etch_extension/fontSizeSelection",
    "hbs!templates/etch_extension/fontFamilySelection",
    "hbs!templates/etch_extension/colorChooser",
    "hbs!templates/etch_extension/align",
    "hbs!templates/etch_extension/defaultButton",
    "css!styles/app/etch_extension/EtchOverrides.css"
], function(_, etch, FontSizeSelectionTemplate, FontFamilySelectionTemplate,
    ColorChooserTemplate, AlignTemplate, DefaultButtonTemplate) {
    "use strict";
    _.extend(etch.config.buttonClasses, {
        default: [
            '<group>', 'bold', 'italic', 'underline', '</group>',
            'font-family', 'font-size',
            '<group>', 'color', '</group>'
        ]
    });

    var noText = [
        'link',
        'clear-formatting',
        'ordered-list',
        'unordered-list'
    ];

    etch.buttonElFactory = function(button) {
        var viewData = {
            button: button,
            title: button.replace('-', ' '),
            display: button.substring(0, 1).toUpperCase()
        };

        if (noText.indexOf(button) > -1) {
            viewData.display = '';
        }

        switch (button) {
            case 'font-size':
                return FontSizeSelectionTemplate(viewData);
            case 'font-family':
                return FontFamilySelectionTemplate(viewData);
            case 'color':
                return ColorChooserTemplate(viewData);
            default:
                if (button.indexOf('justify') !== -1) {
                    viewData.icon = button.substring(button.indexOf('-') + 1, button.length);
                    return AlignTemplate(viewData);
                } else {
                    return DefaultButtonTemplate(viewData);
                }
        }
    };

    etch.groupElFactory = function() {
        return $('<div class="btn-group">');
    };

    return {
        initialize: function() {}
    };
});
