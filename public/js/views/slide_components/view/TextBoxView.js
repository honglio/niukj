define(["underscore",
    "./Component",
    "etch",
    "models/ComponentCommands",
    "common/web/undo_support/UndoHistoryFactory"
], function(_, ComponentView, etch, ComponentCommands, UndoHistoryFactory) {
    "use strict";

    var undoHistory = UndoHistoryFactory.managedInstance('editor');

    var styles = ["face", "size", "weight", "style", "color", "decoration", "align"];

    return ComponentView.extend({
        className: "component textBox",

        tagName: "div",

        events: function() {
            var parentEvents = ComponentView.prototype.events.call(this);
            var myEvents = {
                dblclick: '_dblclicked',
                editComplete: '_editCompleted',
                mousedown: '_mousedown',
                mouseup: '_mouseup',
                keydown: '_keydown'
            };
            return _.extend(parentEvents, myEvents);
        },

        initialize: function() {
            ComponentView.prototype.initialize.apply(this, arguments);

            // this._lastDx = 0; this is for scale

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
            this.$textEl.attr('contenteditable', true);
            if (e) {
                this._initialText = this.$textEl.html(); // for undo
                etch.editableInit.call(this, e, this.model.get('y') * this.dragScale + 35);

                // Focus editor and select all text.
                if (!this.editing) {
                    this.$textEl.get(0).focus();
                    try {
                        document.execCommand('selectAll', false, null);
                        etch.triggerCaret();
                    } catch (e) {
                        // firefox failboats on this command
                        // for some reason.  hence the try/catch
                        // console.log(e);
                    }
                }
            }
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

        _mouseup: function(e) {
            if (this.editing) {
                etch.triggerCaret(); // update font attr to editor model
                //etch.editableInit.call(this, e, this.model.get("y") * this.dragScale + 35);
            }
            ComponentView.prototype.mouseup.apply(this, arguments);
        },

        /**
         * Event: key has been pressed down. If textbox is in focus, and it was a charachter key pressed, then start
         * typing in the textbox.
         *
         * @param {Event} e
         */
        keydown: function(e) {
            // When user starts typing text in selected textbox, open edit mode immediately.
            if (this.model.get("selected") && !this.editing) {
                if (!e.ctrlKey && !e.altKey && !e.metaKey && String.fromCharCode(e.which).match(/[\w]/)) {
                    this.edit();
                }
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
                window.getSelection().removeAllRanges();
                this.$textEl.attr("contenteditable", false);
                this.$el.removeClass("editable");
                this.allowDragging = true;
            }
        },

        /**
         * React on component is being selected. If component have been unselected, hide it's editor, if in editing mode.
         *
         * @param {Component} model
         * @param {boolean} selected
         * @private
         */
        _selectionChanged: function(model, selected) {
            ComponentView.prototype._selectionChanged.apply(this, arguments);
            if (!selected && this.editing) {
                return this._editCompleted();
            }
        },

        /**
         * Open editor for the textbox.
         */
        edit: function() {
            this.model.set('selected', true);
            var e = $.Event("click", {
                pageX: this.model.get('x')
            });
            this._dblclicked(e);
            this.$el.find('.content').selectText();
        },

        /**
         * React on component style change. Update CSS classes of the element.
         *
         * @param {Component} model
         * @param {string} style
         * @param {Object} opts
         * @private
         */
        _styleChanged: function(model, style, opts) {
            // if not model.changed;
            if (!opts.changes) { return; }
            for (var i = 0; i < opts.changes.length; i+=1) {
                var key = opts.changes[i];
                var value = model.get(key);
                if (value) {
                    if (key === "decoration" || key === "align") {
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

        _handlePaste: function(elem, e) {
            e = e.originalEvent;
            document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
            // var sel = window.getSelection();
            // var range = sel.getRangeAt(0);
            // var text = document.createTextNode(e.clipboardData.getData('text/plain'));
            // range.deleteContents();
            // range.insertNode(text);

            // range.setStartAfter(text);
            // range.setEndAfter(text);

            // sel.removeAllRanges();
            // sel.addRange(range);

            e.preventDefault();
        },

        render: function() {
            ComponentView.prototype.render.call(this);
            this.$textEl = this.$el.find('.content');
            var self = this;
            this.$textEl.bind('paste', function(e) {
                self._handlePaste(this, e);
            });
            if(this.model.get("decoration")) {
                this.$textEl.html('<u>' + this.model.get('text') + '</u>');
            } else {
                this.$textEl.html(this.model.get('text'));
            }
            this.$el.css({
                fontFamily: this.model.get("face"),
                fontSize: this.model.get('size') + 'px',
                fontWeight: this.model.get("weight"),
                fontStyle: this.model.get("style"),
                color: this.model.get('color'),
                top: this.model.get('y') + 'px',
                left: this.model.get('x') + 'px'
                // textAlign: this.model.get("align")
            });
            return this.$el;
        }
    });
});
