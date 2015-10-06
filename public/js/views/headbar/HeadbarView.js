define(["CustomView",
    "../save_btn/ButtonView",
    "./BackgroundProviderBtn",
    "./ThemeProviderBtn",
    "../slide_components/view/ComponentButton",
    "../slide_components/view/ComponentImportButton",
    "hbs!templates/Headbar"
], function(CustomView, SaveButton, BackgroundProviderBtn, ThemeProviderBtn,
    ComponentButton, ComponentImportButton, HeadbarTemplate) {

    return CustomView.extend({
        events: {
            'click .undo': 'undo',
            'click .redo': 'redo',
            'click .cut': '_cut',
            'click .copy': '_copy',
            'click .paste': '_paste',
            'click [data-comptype="TextBox"]': '_textbox'
        },
        initialize: function() {
            this._saveButton = new SaveButton({
                model: this.model
            });
            this._BackgroundProviderBtn = new BackgroundProviderBtn({
                model: this.model
            });
            this._ThemeProviderBtn = new ThemeProviderBtn({
                model: this.model
            });
            this._textBoxButton = new ComponentButton({
                componentType: 'TextBox',
                icon: 'fa fa-text-width',
                btnType: 'btn-info',
                name: '',
                model: this.model
            });
            this._imageButton = new ComponentImportButton({
                componentType: 'Image',
                icon: 'fa fa-picture-o',
                name: '',
                btnType: 'btn-success',
                tag: 'img',
                title: '插入图片',
                model: this.model,
                browsable: false
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
            $createCompButtons.append(this._BackgroundProviderBtn.render().$el);
            $createCompButtons.append(this._ThemeProviderBtn.render().$el);

            if (this.model._undoHistory.count <= 0) {
                var $undoBtn = this.$el.find('.undo');
                $undoBtn.attr('disabled', 'disabled');
            }
            if (this.model._undoHistory.count > (this.model._undoHistory.actions.length - 2)) {
                var $redoBtn = this.$el.find('.redo');
                $redoBtn.attr('disabled', 'disabled');
            }

            return this;
        },

        _textbox: function() {
            this.initialize();
            this.render();
        },

        undo: function() {
            this.model._undoHistory.undo();
            this.initialize();
            this.render();
        },

        redo: function() {
            this.model._undoHistory.redo();
            this.initialize();
            this.render();
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

        dispose: function() {
            this._saveButton.dispose();
            this._BackgroundProviderBtn.dispose();
            this._ThemeProviderBtn.dispose();
            this._textBoxButton.dispose();
            this._imageButton.dispose();
            CustomView.dispose.call(this);
        }
    });
});
