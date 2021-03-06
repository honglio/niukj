define(["underscore",
    "./AvailableBackgrounds",
    "common/web/widgets/ItemImportModal",
    "common/web/widgets/Dropdown",
    "hbs!templates/BackgroundChooser"
], function(_, Backgrounds, ItemImportModal, View, BackgroundChooser) {


    function BackgroundProvider(editorModel) {
        this._view = new View(Backgrounds, BackgroundChooser);
        this._editorModel = editorModel;
        // this._previewBackground = _.debounce(this._previewBackground.bind(this), 10);
        // this._restoreBackground = _.debounce(this._restoreBackground.bind(this), 10);
        // this._setBackground = _.debounce(this._setBackground.bind(this), 10);
        this._view.on("over", this._previewBackground, this);
        this._view.on("out", this._restoreBackground, this);
        this._view.on("selected", this._setBackground, this);
        // Bind to selection events fired from view
    }

    var imgUploadModal = ItemImportModal.get({
        tag: 'img',
        title: '插入背景图片',
        browsable: false
    });

    BackgroundProvider.prototype = {
        view: function() {
            return this._view;
        },

        _previewBackground: function(e) {
            var $slideContainer = $('.slideContainer');
            var target = (e.srcElement) ? e.srcElement : e.currentTarget;
            var className = target.dataset['class'] ? target.dataset['class'] : target.className;
            this._swapBg($slideContainer, className);
        },

        _setBackground: function(e) {
            var target = (e.srcElement) ? e.srcElement : e.currentTarget;
            var className = target.dataset['class'] ? target.dataset['class'] : target.className;
            if (className === 'img-bg') {
                var self = this;
                imgUploadModal.show(function(src) {
                    self._editorModel.activeSlide().set('background', 'img:' + src);
                });
                return;
            } else {
                this._editorModel.activeSlide().set('background', className || 'defaultbg');
            }
        },

        _restoreBackground: function(e) {
            var bg = this._editorModel.activeSlide().get('background');
            // console.log(bg);
            var $slideContainer = $('.slideContainer');
            this._swapBg($slideContainer, bg || 'defaultbg');
        },

        _swapBg: function($el, newBg) {
            // console.log($el.attr('background'));
            $el.removeClass($el.attr('background')).addClass(newBg);
            $el.attr('background', newBg);
        },

        dispose: function() {
            this._view.dispose();
        }
    };

    return BackgroundProvider;
});
