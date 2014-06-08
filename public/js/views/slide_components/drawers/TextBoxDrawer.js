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
		console.log(textBox);

        this.g2d.fillStyle = '#' + textBox.get('color');
        var lineHeight = textBox.get('size') * this.scale.y;
        this.g2d.font = lineHeight + 'px ' + textBox.get('family');
        var text = this._convertSpaces(textBox.get('text'));
        var lines = this._extractLines(text);
        var txtWidth = this._findWidestWidth(lines) * this.scale.x;
        txtWidth *= 3;
        var bbox = {
            x: textBox.get('x') * this.scale.x,
            y: textBox.get('y') * this.scale.y + lineHeight * this.scale.y,
            width: txtWidth,
            height: lineHeight * lines.length * this.scale.y
        };

        this.applyTransforms(textBox, bbox);

        lines.forEach(function(line, i) {
            this._renderLine(line, i, bbox, lineHeight);
        }, this);
    };

    TextBoxDrawer.prototype._renderLine = function(line, cnt, bbox, lineHeight) {
        if (line !== '') {
            line = line.replace(tagReg, '');
            this.g2d.fillText(line, bbox.x, bbox.y + bbox.height + cnt * lineHeight);
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
