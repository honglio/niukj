define(["underscore",
    "./Component",
    "etch",
    "models/ComponentCommands",
    "common/web/undo_support/UndoHistoryFactory"
], function(_, ComponentView, etch, ComponentCommands, UndoHistoryFactory) {
    "use strict";

    var undoHistory = UndoHistoryFactory.managedInstance('editor');

    var styles = ["size"]; //, "weight", "style", "color", "decoration", "align"

    return ComponentView.extend({
        className: "component textBox",

        tagName: "div",

        events: function() {
            var parentEvents = ComponentView.prototype.events.call(this);
            var myEvents = {
                dblclick: '_dblclicked',
                editComplete: '_editCompleted',
                mousedown: '_mousedown',
                mouseup: '_mouseup'
            };
            return _.extend(parentEvents, myEvents);
        },

        initialize: function() {
            ComponentView.prototype.initialize.apply(this, arguments);

			// this._lastDx = 0;
            styles.forEach(function(style) {
                this.model.on("change:" + style, this._styleChanged, this);
            }, this);
            this.model.on("change:text", this._textChanged, this); // binding text change for undo
            this.model.on("edit", this.edit, this);
        },

        // ****************************************************
        // Scale Content Text Size
        // ****************************************************
        // scaleStart: function() {
        //   this._initialSize = this.model.get('size');
        // },
        // scale: function(e, deltas) {
        //   var currSize, sign;
        //   currSize = this.model.get('size');
        //   sign = deltas.dx - this._lastDx > 0 ? 1 : -1;
        //   this.model.set('size', currSize + Math.round(sign * Math.sqrt(Math.abs(deltas.dx - this._lastDx))));
        //   return this._lastDx = deltas.dx;
        // },
        // scaleStop: function() {
        //   var cmd = ComponentCommands.Scale(this._initialSize, this.model);
        //   undoHistory.push(cmd);
        // },
        // ****************************************************

        _dblclicked: function(e) {
            this.$el.addClass("editable");
            this.$el.find('.content').attr('contenteditable', true);
            if (e) {
                this._initialText = this.$textEl.html(); // for undo
                etch.editableInit.call(this, e, this.model.get('y') * this.dragScale + 35);
            }
            console.log(this.model);
            this.allowDragging = false;
            this.editing = true;
        },

        // _mouseup: function(e) {
        //     if (this.editing) {
        //         etch.editableInit.call(this, e, this.model.get('y') * this.dragScale + 35);
        //     }
        // },

        _mousedown: function(e) {
            if (this.editing) {
                e.stopPropagation();
                etch.editableInit.call(this, e, this.model.get('y') * this.dragScale + 35);
            } else {
                ComponentView.prototype.mousedown.apply(this, arguments);
            }
        },

        _editCompleted: function() {
            var text = this.$textEl.html();
            this.editing = false;
            if (text === "") {
                return this.remove();
            } else {
                var cmd = ComponentCommands.Text(this._initialText, this.model);
                undoHistory.push(cmd); // for undo

                this.model.set('text', text);
                this.$el.find(".content").attr("contenteditable", false);
                this.$el.removeClass("editable");
                this.allowDragging = true;
            }
        },

        _selectionChanged: function(model, selected) {
            ComponentView.prototype._selectionChanged.apply(this, arguments);
            if (!selected && this.editing) {
                return this._editCompleted();
            }
        },

        edit: function() {
            this.model.set('selected', true);
            var e = $.Event("click", {
                pageX: this.model.get('x')
            });
            this._dblclicked(e);
            this.$el.find('.content').selectText();
        },

        _styleChanged: function(model, style, opts) {
            // if not model.changed;
            if (!opts.changes) { return; }
            for (var i = 0; i < opts.changes.length; i+=1) {
                var key = opts.changes[i];
                var value = model.get(key);
                if (value) {
                    if (key === "decoration" || key === "align") {
                        console.log("DECORATION CHANGE");
                        key = "text" + key.substring(0, 1).toUpperCase() + key.substr(1);
                    } else if (key !== "color") {
                        key = "font" + key.substr(0, 1).toUpperCase() + key.substr(1);
                    }
                    this.$el.css(key, style);
                }
            }
        },

        _textChanged: function(model, text) {
            this.$textEl.html(text);
        },

        render: function() {
            ComponentView.prototype.render.call(this);
            this.$textEl = this.$el.find('.content');
            this.$textEl.html(this.model.get('text'));
            this.$el.css({
                fontSize: this.model.get('size') + 'pt',
                color: '#' + this.model.get('color'),
                top: this.model.get('y') + 'px',
                left: this.model.get('x') + 'px',
            });
            return this.$el;
        }
    });
});
