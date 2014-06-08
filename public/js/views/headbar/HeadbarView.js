define(["CustomView",
    "cloudslide/start_button/ButtonView",
    "./ThemeProviderView",
    "../slide_components/view/ComponentButton",
    "../slide_components/view/ComponentImportButton",
    "hbs!templates/Headbar"
], function(CustomView, StartButton,
            ThemeProviderView, ComponentButton, ComponentImportButton,
            HeadbarTemplate) {
	"use strict";
    return CustomView.extend({
        className: 'row-fluid headbar',
        events: {
            destroyed: 'remove'
        },
        initialize: function() {
            this._startButton = new StartButton(this._editorModel);
            this._themeProviderView = new ThemeProviderView(this._editorModel);
        },

        // TODO: need to respond to addition/removal of
        // create component buttons
        render: function() {
            this.$el.html(HeadbarTemplate());

            this.$el.find('.start-button').append(this._startButton.render().$el);

            var $createCompButtons = this.$el.find('.create-comp-buttons > div');
            $createCompButtons.append(new ComponentButton({
                componentType: 'TextBox',
                icon: 'icon-text-width',
                name: '插入文本框',
                editorModel: this._editorModel
            }).render().$el);


            $createCompButtons.append(new ComponentImportButton({
                componentType: 'Image',
                icon: 'icon-picture',
                name: '插入图片',
                tag: 'img',
                title: '插入图片',
                editorModel: this._editorModel,
                browsable: true
            }).render().$el);

            var $themeButtons = this.$el.find('.theme-buttons');
            $themeButtons.append(this._themeProviderView.render().$el);

            return this;
        },

        dispose: function(){
            this._startButton.dispose();
            this._themeProviderView.dispose();
            CustomView.dispose.call(this);
        },

        constructor: function HeadbarView(editorModel) {
            this._editorModel = editorModel;
            Backbone.View.prototype.constructor.apply(this, arguments);
        }
    });
});
