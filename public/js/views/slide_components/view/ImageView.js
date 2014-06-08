define(["./Component", "./Mixers"],
function(ComponentView, Mixers) {
    "use strict";

    return ComponentView.extend({
        className: "component imageView",
        tagName: "div",
        initialize: function() {
            ComponentView.prototype.initialize.apply(this, arguments);
        },
        _finishRender: function($img) {
            var naturalWidth = $img[0].naturalWidth;
            var naturalHeight = $img[0].naturalHeight;

            this.origSize = {
                width: naturalWidth,
                height: naturalHeight
            };
            $img[0].width = naturalWidth;
            $img[0].height = naturalHeight;
            this._setUpdatedTransform();

            $img.bind("dragstart", function(e) {
                e.preventDefault();
                return false;
            });
            this.$content.append($img);
        },
        render: function() {
            var self = this;
            ComponentView.prototype.render.call(this);
            var $img = $("<img src=" + (this.model.get('src')) + "></img>");
            $img.load(function() {
                return self._finishRender($img);
            });
            $img.error(function() {
                return self.remove();
            });
            return this.$el;
        }
    });
});
