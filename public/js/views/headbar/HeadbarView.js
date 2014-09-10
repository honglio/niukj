define(["CustomView",
    "../save_btn/ButtonView",
    "./ThemeProviderBtn",
    "../slide_components/view/ComponentButton",
    "../slide_components/view/ComponentImportButton",
    "../themes/BackgroundProvider",
    "hbs!templates/Headbar"
], function(CustomView, SaveButton, ThemeProviderBtn,
            ComponentButton, ComponentImportButton,
            BackgroundProvider, HeadbarTemplate) {
	"use strict";
    return CustomView.extend({
        className: 'page-header',
        events: {
            'click .undo': 'undo',
            'click .redo': 'redo',
            'click .cut': '_cut',
            'click .copy': '_copy',
            'click .paste': '_paste'
        },
        initialize: function() {
            this._saveButton = new SaveButton({model: this.model});
            this._ThemeProviderBtn = new ThemeProviderBtn({model: this.model});
            this._textBoxButton = new ComponentButton({
                componentType: 'TextBox',
                icon: 'icon-text-width',
                name: '插入文本框',
                model: this.model
            });
            this._imageButton = new ComponentImportButton({
                componentType: 'Image',
                icon: 'icon-picture',
                name: '插入图片',
                tag: 'img',
                title: '插入图片',
                model: this.model,
                browsable: true
            });
        },

        render: function() {
            // Uncomment this, if you want to display name of action
            /*************************************************/
            // this.$el.html(HeadbarTemplate({
            //     undoName: this.model._undoHistory.undoName(),
            //     redoName: this.model._undoHistory.redoName()
            // }));
            /*************************************************/
            this.$el.html(HeadbarTemplate());

            var $saveBtn = this.$el.find('.save-button');
            $saveBtn.append(this._saveButton.render().$el);

            var $createCompButtons = this.$el.find('.create-comp-buttons > div');
            $createCompButtons.append(this._textBoxButton.render().$el);
            $createCompButtons.append(this._imageButton.render().$el);
            $createCompButtons.append(this._ThemeProviderBtn.render().$el);
            $createCompButtons.append(new BackgroundProvider(this.model).view().render().$el);

            return this;
        },

        undo: function() {
            this.model._undoHistory.undo();
            // Uncomment this, if you want to display name of action
            // this.initialize();
            // this.render();
        },

        redo: function() {
            this.model._undoHistory.redo();
            // Uncomment this, if you want to display name of action
            // this.initialize();
            // this.render();
        },

        _cut: function() {
            this.model.trigger('actionCut');
        },

        _copy: function() {
            this.model.trigger('actionCopy');
        },

        _paste: function() {
            this.model.trigger('actionPaste');
        },

        dispose: function(){
            this._saveButton.dispose();
            this._ThemeProviderBtn.dispose();
            this._textBoxButton.dispose();
            this._imageButton.dispose();
            CustomView.dispose.call(this);
        }
    });
});
