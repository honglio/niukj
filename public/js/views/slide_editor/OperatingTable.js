define(["CustomView",
    "css!styles/app/slide_editor/operatingTable.css",
    "../slide_components/ComponentFactory",
    "models/Component",
    "config"
], function(CustomView, css, ComponentFactory, Component, Config) {

    return CustomView.extend({
        className: 'operatingTable',
        events: {
            click: '_clicked',
            focused: '_focus',
            dragover: '_dragover',
            drop: '_drop'
        },

        initialize: function() {
            this._cut = this._cut.bind(this);
            this._copy = this._copy.bind(this);
            this._paste = this._paste.bind(this);

            this.model.on('actionCut', this._cut, this);
            this.model.on('actionCopy', this._copy, this);
            this.model.on('actionPaste', this._paste, this);

            this._deck = this.model.deck();
            this._activeSlide = this._deck.get('activeSlide');
            this._clipboard = this.model.clipboard;

            this._calculateLayout = this._calculateLayout.bind(this);
            // var lazyLayout = _.debounce(this._calculateLayout, 100);
            $(window).resize(this._calculateLayout);

            this.setModel(this._activeSlide);

            // Re-render when active slide changes in the deck
            this._deck.on("change:activeSlide", function(deck, slide) {
                this.setModel(slide);
                this._renderContents();
            }, this);
        },

        render: function() {
            this._$slideContainer = $('<div class="slideContainer"></div>');
            // this.$el.css('width', 1020);
            // this.$el.css('height', 764);
            this.$el.html(this._$slideContainer);
            this._$slideContainer.css(Config.slide.size);

            var background = this._activeSlide ? this._activeSlide.get('background') : 'defaultbg';

            if (background.indexOf('img:') === -1) {
                this._$slideContainer.addClass(background);
            } else {
                this.$el.css('background-image', 'url(' + background.substring(4) + ')');
                this.$el.css('background-repeat', 'no-repeat');
                this.$el.css('background-size', '100% 100%');
                this.$el.css('background-position', 'center');
            }
            this._$slideContainer.data('background', background);

            var self = this;
            setTimeout(function() {
                // self._calculateLayout();
                self._renderContents();
            }, 100);
            return this;
        },

        _updateBg: function(slide, bg) {
            if (!this._$slideContainer) {
                return;
            }
            this.$el.css('background-image', '');
            this._$slideContainer.removeClass();
            if (bg.indexOf('img:') === -1) {
                this._$slideContainer.addClass('slideContainer ' + (bg || 'defaultbg'));
            } else {
                this.$el.css('background-image', 'url(' + bg.substring(4) + ')');
                this.$el.css('background-repeat', 'no-repeat');
                this.$el.css('background-size', '100% 100%');
                this.$el.css('background-position', 'center');
            }
            this._$slideContainer.data('background', (bg || 'defaultbg'));
        },

        _cut: function() {
            if (this.model.get('scope') === 'operatingTable') {
                var comp = this.modelActive.lastSelection;
                if (comp) {
                    this.modelActive.remove(comp);
                    this._clipboard.item = comp.clone();
                    comp.dispose();
                }
            }
        },

        _copy: function() {
            if (this.model.get('scope') === 'operatingTable') {
                var comp = this.modelActive.lastSelection;
                if (comp) {
                    this._clipboard.item = comp;
                }
            }
        },

        _paste: function() {
            var item = this._clipboard.item || {};
            if (item && item instanceof Component) {
                var comp = item.clone();
                comp.set({
                    selected: false,
                    active: false
                });
                this.modelActive.add(comp);
            }
        },

        _delete: function() {
            if (this.model.get('scope') === 'operatingTable') {
                var comp = this.modelActive.lastSelection;
                if (comp) {
                    this.modelActive.remove(comp);
                    comp.dispose();
                }
            }
        },

        _clicked: function() {
            if (this._focus()) {
                this.modelActive.get('components').forEach(function(comp) {
                    if (comp.get('selected')) {
                        comp.set('selected', false);
                    }
                });
                this.$el.find('.editable').removeClass('editable')
                    .attr('contenteditable', false).trigger("editComplete");
                this._focus();
            }
        },

        _focus: function() {
            if (this.model) {
                this.model.set('scope', 'operatingTable');
                return true;
            }
            return false;
        },

        _dragover: function(e) {
            e.stopPropagation();
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'copy';
        },

        _drop: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var f = e.originalEvent.dataTransfer.files[0];

            if (!f.type.match('image.*')) {
                return;
            }

            var reader = new FileReader();
            var self = this;
            var compFactory = new ComponentFactory();
            reader.onload = function(e) {
                self.modelActive.add(
                    compFactory.instance.createModel({
                        type: 'Image',
                        src: e.target.result
                    }));
            };

            reader.readAsDataURL(f);
        },

        _componentAdded: function(slide, comp) {
            var compFactory = new ComponentFactory();
            var view = compFactory.instance.createView(comp);
            this._$slideContainer.append(view.render());
        },

        setModel: function(slide) {
            if (this.modelActive === slide) {
                return;
            }
            if (this.modelActive) {
                this.modelActive.off(null, null, this);
            }

            this.prevModel = this.modelActive;
            this.modelActive = slide;

            if (this.modelActive) {
                this._updateBg(this.modelActive, this.modelActive.get('background'));
                this.modelActive.on("change:components.add", this._componentAdded, this);
                this.modelActive.on("change:background", this._updateBg, this);
            }
            return this;
        },

        _renderContents: function() {
            if (this.prevModel) {
                this.prevModel.trigger("unrender", true);
            }

            if (this.modelActive) {
                var components = this.modelActive.get('components');
                var compFactory = new ComponentFactory();
                var self = this;
                components.forEach(function(comp) {
                    var view = compFactory.instance.createView(comp);
                    self._$slideContainer.append(view.render());
                });
            }
        },

        _calculateLayout: function() {
            var width = this.$el.width();
            var height = this.$el.height();

            var slideSize = Config.slide.size;

            var xScale = width / slideSize.width;
            var yScale = (height - 20) / slideSize.height;

            var newHeight = slideSize.height * xScale;

            var scale;
            if (newHeight > height) {
                scale = yScale;
            } else {
                scale = xScale;
            }

            var scaledWidth = scale * slideSize.width;

            var remainingWidth = width - scaledWidth;

            this._$slideContainer.css(window.browserPrefix + 'transform', 'scale(' + scale + ')');
            this.$el.css('height', newHeight);
        }
    });
});
