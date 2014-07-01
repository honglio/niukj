define(["underscore", "./AbstractDrawer"
], function(_, AbstractDrawer) {
    "use strict";
    var newlineReg = /<br>/;
    var spaceReg = /&nbsp;/g;
    var tagReg = /<[^>]+>|<\/[^>]+>/g;

    function TextBoxDrawer(g2d) {
        AbstractDrawer.apply(this, arguments);
    }

    _.extend(TextBoxDrawer.prototype, AbstractDrawer.prototype);

    TextBoxDrawer.prototype.paint = function(textBox) {
        this.g2d.fillStyle = textBox.get('color');
        var lineHeight = textBox.get('size') * 0.35;
        this.g2d.font = lineHeight + 'px ' + textBox.get('face');
        var text = this._convertSpaces(textBox.get('text'));
        var lines = this._extractLines(text);
        var txtWidth = this._findWidestWidth(lines);
        var bbox = {
            x: textBox.get('x') * this.scale.x,
            y: textBox.get('y') * this.scale.y
        };

        this.applyTransforms(textBox, bbox);

        lines.forEach(function(line, i) {
            this._renderLine(line, i, bbox, lineHeight);
        }, this);
    };

    TextBoxDrawer.prototype._renderLine = function(line, cnt, bbox, lineHeight) {
        if (line !== '') {
            line = line.replace(tagReg, '');
            this.g2d.fillText(line, bbox.x, bbox.y);
            cnt += 1;
        }
    };

    TextBoxDrawer.prototype._extractLines = function(text) {
        return text.split(newlineReg);
    };

    TextBoxDrawer.prototype._convertSpaces = function(text) {
        return text.replace(spaceReg, ' ');
    };

    TextBoxDrawer.prototype._findWidestWidth = function(lines) {
        var widestWidth = 0;
        lines.forEach(function(line) {
            var width;
            width = this.g2d.measureText(line.replace(tagReg, "")).width;
            if (width > widestWidth) {
                widestWidth = width;
            }
        }, this);
        return widestWidth;
    };

    return TextBoxDrawer;
});
