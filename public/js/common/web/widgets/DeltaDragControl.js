define(function() {
    "use strict";
    // events : ["mousedown", "mousemove", "mouseup"];

    function DragControl($el, stopProp) {
        this.$el = $el;
        this._stopProp = stopProp;
        this._dragging = false;
        this._mousemove = this.mousemove.bind(this);
        this._mouseup = this.mouseup.bind(this);
        this._mouseout = this._mouseup;
        $(document).bind("mousemove", this._mousemove);
        $(document).bind("mouseup", this._mouseup);
        this.$el.bind("mousedown", this.mousedown.bind(this));
        this.$el.bind("mouseup", this._mouseup);
    }

    DragControl.prototype.dispose = function() {
        $(document).unbind("mousemove", this._mousemove);
        return $(document).unbind("mouseup", this._mouseup);
    };

    DragControl.prototype.mousedown = function(e) {
        e.preventDefault();
        this._dragging = true;
        this._startPos = {
            x: e.pageX,
            y: e.pageY
        };
        this.$el.trigger("deltadragStart", {
            x: e.pageX,
            y: e.pageY
        });
        if (this._stopProp) {
            e.stopPropagation();
        }
    };

    DragControl.prototype.mousemove = function(e) {
        if (this._dragging) {
            var dx = e.pageX - this._startPos.x;
            var dy = e.pageY - this._startPos.y;
            this.$el.trigger("deltadrag", [{
                dx: dx,
                dy: dy,
                x: e.pageX,
                y: e.pageY
            }]);
            if (this._stopProp) {
                e.stopPropagation();
            }
        }
    };

    DragControl.prototype.mouseup = function() {
        if (this._dragging) {
            this._dragging = false;
            this.$el.trigger("deltadragStop");
        }
        return true;
    };

    return DragControl;

});
