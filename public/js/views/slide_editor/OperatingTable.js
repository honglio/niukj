define(["CustomView",
    "css!styles/app/slide_editor/operatingTable.css",
    "../slide_components/ComponentFactory",
    "models/Component"
], function(CustomView, css, ComponentFactory, Component) {
    "use strict";
    return CustomView.extend({
        className: 'operatingTable',
        events: {
            click: '_clicked',
            focused: '_focus',
            dragover: '_dragover',
            drop: '_drop',
            destroyed: 'remove'
        },

        initialize: function() {
            this._deck = this.model.deck();
            this._activeSlide = this._deck.get('activeSlide');
            this._clipboard = this.model.clipboard;

            // this._calculateLayout = this._calculateLayout.bind(this);
            // var lazyLayout = _.debounce(this._calculateLayout, 300);
            // $(window).resize(lazyLayout);
            this.setModel(this._activeSlide);
            // Re-render when active slide changes in the deck
            this._deck.on("change:activeSlide", function(deck, model) {
                this.setModel(model);
            }, this);
        },

        render: function() {
            this._$slideContainer = $('<div class="slideContainer"></div>');
            // this.$el.css('width', 1020);
            // this.$el.css('height', 764);
            this.$el.html(this._$slideContainer);
            this._$slideContainer.css(config.slide.size);

            var background = this._activeSlide ? this._activeSlide.get('background') : 'defaultbg';
            this._$slideContainer.addClass(background);
            this._$slideContainer.data('background', background);

            var self = this;
            setTimeout(function() {
                self._rendered = true;
                // self._calculateLayout();
                self._renderContents();
            }, 100);
            return this;
        },

        _updateBg: function(model, bg) {
            if (!this._$slideContainer) { return; }
            this._$slideContainer.removeClass();
            this._$slideContainer.addClass('slideContainer ' + (bg || 'defaultbg'));
            this._$slideContainer.data('background', (bg || 'defaultbg'));
        },

        _cut: function() {
            if (this.model.get('scope') === 'operatingTable') {
                var comp = this.model.lastSelection;
                if (comp) {
                    this.model.remove(comp);
                    this._clipboard.item = comp.clone();
                    comp.dispose();
                }
            }
        },

        _copy: function() {
            if (this.model.get('scope') === 'operatingTable') {
                var comp = this.model.lastSelection;
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
                this.model.add(comp);
            }
        },

        _delete: function() {
            if (this.model.get('scope') === 'operatingTable') {
                var comp = this.model.lastSelection;
                if (comp) {
                    this.model.remove(comp);
                    comp.dispose();
                }
            }
        },

        _clicked: function() {
            this._focus();
            this.model.get('components').forEach(function(comp) {
                if (comp.get('selected')) {
                    comp.set('selected', false);
                }
            });
            this.$el.find('.editable').removeClass('editable').attr('contenteditable', false)
                .trigger("editComplete");

            this._focus();
        },

        _focus: function() {
            this.model.set('scope', 'operatingTable');
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
                self.model.add(
                    compFactory.instance.createModel({
                        type: 'Image',
                        src: e.target.result
                    }));
            };

            reader.readAsDataURL(f);
        },

        _componentAdded: function(model, comp) {
            var compFactory = new ComponentFactory();
            var view = compFactory.instance.createView(comp);
            this._$slideContainer.append(view.render());
        },

        setModel: function(model) {
            var prevModel = this.model;
            if (this.model === model) { return; }
            if (this.model) {
                this.model.off(null, null, this);
            }
            this.model = model;
            if (this.model) {
                this._updateBg(this.model, this.model.get('background'));
                this.model.on("change:components.add", this._componentAdded, this);
                this.model.on("change:background", this._updateBg, this);
            }
            this._renderContents(prevModel);
            return this;
        },

        _renderContents: function(prevModel) {
            if (prevModel) {
                prevModel.trigger("unrender", true);
            }

            if (!this._rendered) {
                return;
            }
            if (this.model) {
                var components = this.model.get('components');
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

            var slideSize = config.slide.size;

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
