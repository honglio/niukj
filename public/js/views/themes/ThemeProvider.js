define(["./AvailableThemes",
    "common/web/widgets/Dropdown",
    "hbs!templates/ThemeChooser"
], function(Themes, View, ThemeChooser) {


    function ThemeProvider(editorModel) {
        this._view = new View(Themes, ThemeChooser);
        this._editorModel = editorModel;

        this._view.on("over", this._previewTheme, this);
        this._view.on("out", this._restoreTheme, this);
        this._view.on("selected", this._setTheme, this);
        // Bind to selection events fired from view
    }

    ThemeProvider.prototype = {
        view: function() {
            return this._view;
        },

        _previewTheme: function(e) {
            // console.log('_previewTheme');
            var $slideContainer = $('.slideContainer');
            var target = (e.srcElement) ? e.srcElement : e.currentTarget;
            var className = target.dataset['class'] ? target.dataset['class'] : target.className;

            this._swapTheme($slideContainer, this.__getTheme(className));
        },

        _setTheme: function(e) {
            // console.log('_setTheme');
            var target = (e.srcElement) ? e.srcElement : e.currentTarget;
            var className = target.dataset['class'] ? target.dataset['class'] : target.className;

            this._editorModel.activeSlide().set('theme', this.__getTheme(className) || '');
        },

        _restoreTheme: function(e) {
            // console.log('_restoreTheme');
            var theme = this._editorModel.activeSlide().get('theme');
            var $slideContainer = $('.slideContainer');
            this._swapTheme($slideContainer, theme || '');
        },

        _swapTheme: function($el, newTheme) {
            // console.log('_swapTheme');
            $el.removeClass($el.attr('theme')).addClass(newTheme);
            $el.attr('theme', newTheme);
        },

        __getTheme: function(className) {
            switch (className) {
                case 'th-top':
                    className = 'theme-top';
                    break;
                case 'th-middle':
                    className = 'theme-middle';
                    break;
                case 'th-bottom':
                    className = 'theme-bottom';
                    break;
                case 'th-left':
                    className = 'theme-left';
                    break;
                case 'th-right':
                    className = 'theme-right';
                    break;
                case 'th-full':
                    className = 'theme-full';
                    break;
            }
            return className;
        },

        dispose: function() {
            this._view.dispose();
        }
    };

    return ThemeProvider;
});
