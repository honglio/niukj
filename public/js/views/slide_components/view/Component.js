define(["jquery", "CustomView",
    "common/web/widgets/DeltaDragControl",
    "common/Math2",
    "models/ComponentCommands",
    "common/web/undo_support/UndoHistoryFactory",
    "hbs!templates/Component",
    "css!styles/app/slide_components/Component.css",
], function($, CustomView, DeltaDragControl, Math2,
    ComponentCommands, UndoHistoryFactory, ComponentTemplate) {

    var undoHistory = UndoHistoryFactory.managedInstance('editor');
    return CustomView.extend({
        transforms: [],
        className: "component",
        events: function() {
            return {
                mousedown: 'mousedown',
                click: 'clicked',
                "click .remove-icon": 'removeClicked',
                "mousedown .remove-icon": 'removePressed',
                "deltadrag span[data-delta='scale']": 'scale',
                "deltadragStart span[data-delta='scale']": 'scaleStart'
            };
        },
        initialize: function() {
            this._dragging = false;
            this.allowDragging = true;
            this.model.on("change:selected", this._selectionChanged, this);
            this.model.on("change:color", this._colorChanged, this);
            this.model.on("unrender", this._unrender, this);
            this._mouseup = this.stopdrag.bind(this);
            this._mousemove = this.mousemove.bind(this);
            $(document).bind("mouseup", this._mouseup);
            $(document).bind("mousemove", this._mousemove);
            this._deltaDrags = [];
            this.model.on("rerender", this._setUpdatedTransform, this);
            this.model.on("change:x", this._xChanged, this);
            this.model.on("change:y", this._yChanged, this);
            this.model.on("change:scale", this._setUpdatedTransform, this);
            this.$el.css('z-index', zTracker.next());
            this._lastDeltas = {
                dx: 0,
                dy: 0
            };
            if (!$.isEmptyObject(this.model.get('scale'))) {
                this._initialScale = this.model.get('scale');
            } else {
                this._initialScale = {
                    x: 1,
                    y: 1
                };
            }
        },
        _selectionChanged: function(model, selected) {
            if (selected) {
                this.$el.addClass("selected");
            } else {
                this.$el.removeClass("selected");
            }
        },
        _colorChanged: function(model, color) {
            this.$el.css("color", "#" + color);
        },
        _xChanged: function(model, value) {
            this.$el.css("left", value);
            this.$xInput.val(value);
        },
        _yChanged: function(model, value) {
            this.$el.css("top", value);
            this.$yInput.val(value);
        },
        clicked: function(e) {
            this.$el.css('z-index', zTracker.next());
            this.$el.trigger("focused");
            e.stopPropagation();
        },
        removeClicked: function(e) {
            e.stopPropagation();
            var cmd = new ComponentCommands.Remove(this.model.slide, this.model);
            undoHistory.pushdo(cmd);
            this.remove();
        },
        removePressed: function(e) {
            e.stopPropagation();
        },
        updateOrigin: function() {
            var offset = this.$el.offset();
            this._origin = {
                x: this.$el.width() / 2 + offset.left,
                y: this.$el.height() / 2 + offset.top
            };
        },
        _calcRot: function(point) {
            return Math.atan2(point.y - this._origin.y, point.x - this._origin.x);
        },
        scaleStart: function(e, deltas) {
            e.preventDefault();
            e.stopPropagation();
            this.dragScale = this.$el.parent().css(window.browserPrefix + "transform");
            this.dragScale = parseFloat(this.dragScale.substring(7, this.dragScale.indexOf(","))) || 1;

            var elOffset = this.$el.offset();
            var elWidth = this.$el.width() * this._initialScale.x;
            var elHeight = this.$el.height() * this._initialScale.y;

            if (this.origSize == null) {
                this.origSize = {
                    width: this.$el.width(),
                    height: this.$el.height()
                };
            }

            this._scaleDim = {
                width: this._initialScale.x * this.origSize.width,
                height: this._initialScale.y * this.origSize.height,
            };
        },

        scale: function(e, deltas) {
            e.preventDefault();
            e.stopPropagation();
            var fixRatioDisabled = false;

            var xSignum = 1;
            var ySignum = 1;
            var scaleX = (xSignum * deltas.dx + this._scaleDim.width) / (this._scaleDim.width);
            var scaleY = (ySignum * deltas.dy + this._scaleDim.height) / (this._scaleDim.height);
            var scale = {
                x: this._initialScale.x * scaleX,
                y: this._initialScale.y * (fixRatioDisabled ? scaleY : scaleX)
            };
            scale.width = scale.x * this.origSize.width;
            scale.height = scale.y * this.origSize.height;
            this.model.set('scale', scale);
        },

        _setUpdatedTransform: function() {
            var transformStr = this.buildTransformString();
            var obj = {
                transform: transformStr
            };
            obj[window.browserPrefix + "transform"] = transformStr;
            this.$content.css(obj);
            var scale = this.model.get('scale');
            if (this.origSize) {
                var newWidth = scale.width || this.origSize.width;
                var newHeight = scale.height || this.origSize.height;
                this.$el.css({
                    width: newWidth,
                    height: newHeight
                });
            }
            if (scale && scale.x < 1) {
                this.$el.css(window.browserPrefix + 'transform', 'scale(' + scale.x + ',' + scale.y + ')');
            }
            if (scale && scale.x >= 1) {
                this.$contentScale.css(window.browserPrefix + 'transform', 'scale(' + scale.x + ',' + scale.y + ')');
            }
        },
        buildTransformString: function() {
            var transformStr = '';
            this.transforms.forEach(function(transformName) {
                var transformValue;
                transformValue = this.model.get(transformName);
                if (transformValue) {
                    return transformStr += transformName + '(' + transformValue + 'rad) ';
                }
            }, this);
            return transformStr;
        },
        mousedown: function(e) {
            if (e.which === 1) {
                e.preventDefault();
                e.stopPropagation();
                this.model.set('selected', true);
                this.$el.css("zIndex", zTracker.next());
                this.dragScale = this.$el.parent().css(window.browserPrefix + "transform");
                this.dragScale = parseFloat(this.dragScale.substring(7, this.dragScale.indexOf(","))) || 1;
                this._dragging = true;
                this.$el.addClass("dragged");
                this._prevPos = {
                    x: this.model.get('x'),
                    y: this.model.get('y')
                };
                this._prevMousePos = {
                    x: e.pageX,
                    y: e.pageY
                };
            }
        },
        render: function() {
            var self = this;
            this.$el.html(ComponentTemplate(this.model.attributes));
            this.$el.find('span[data-delta]').each(function(idx, elem) {
                var deltaDrag = new DeltaDragControl($(elem), true);
                return self._deltaDrags.push(deltaDrag);
            });
            this.$content = this.$el.find('.content');
            this.$contentScale = this.$el.find('.content-scale');
            this._selectionChanged(this.model, this.model.get('selected'));
            this.$xInput = this.$el.find("[data-option='x']");
            this.$yInput = this.$el.find("[data-option='y']");

            this._setUpdatedTransform();
            return this.$el;
        },
        _unrender: function() {
            this.remove();
        },
        dispose: function() {
            this._deltaDrags.forEach(function(deltaDrag) {
                deltaDrag.dispose();
            });
            $(document).unbind("mouseup", this._mouseup);
            $(document).unbind("mousemove", this._mousemove);
            CustomView.prototype.dispose.call(this);
        },
        mousemove: function(e) {
            if (this._dragging && this.allowDragging) {
                var snapToGrid = true;
                var dx = e.pageX - this._prevMousePos.x;
                var dy = e.pageY - this._prevMousePos.y;
                var newX = parseInt(this._prevPos.x, 10) + dx / this.dragScale;
                var newY = parseInt(this._prevPos.y, 10) + dy / this.dragScale;
                if (snapToGrid) {
                    var gridSize = 20;
                    newX = Math.floor(newX / gridSize) * gridSize;
                    newY = Math.floor(newY / gridSize) * gridSize;
                }
                this.model.setInt("x", newX);
                this.model.setInt("y", newY);
                if (this.dragStartLoc == null) {
                    this.dragStartLoc = {
                        x: newX,
                        y: newY
                    };
                }
            }
        },
        stopdrag: function() {
            if (this._dragging) {
                this._dragging = false;
                this.$el.removeClass("dragged");
                if (this.dragStartLoc && ( this.dragStartLoc.x !== this.model.get('x') || this.dragStartLoc.y !== this.model.get('y'))) {
                    var cmd = new ComponentCommands.Move(this.dragStartLoc, this.model);
                    this.model.slide.trigger('contentsChanged');
                    undoHistory.pushdo(cmd);
                }
                this.dragStartLoc = void 0;
            }
        }
    });
});
