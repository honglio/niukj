define(function() {
    "use strict";
    var mixers = {
        scaleByResize: function(e, deltas) {
            var offset = this.$el.offset();
            var width = (deltas.x - offset.left) / this.dragScale;
            var height = (deltas.y - offset.top) / this.dragScale;
            this.model.set('scale', {
                width: width,
                height: height
            });
        },
        scaleChangeByResize: function(model, size) {
            if (this.origSize) {
                var factor = size.width / this.origSize.width;
                size.height = this.origSize.height * factor;
            }
            this.$el.css(size);
        },
        scaleObjectEmbed: function(e, deltas) {
            var offset = this.$el.offset();
            var width = (deltas.x - offset.left) / this.dragScale;
            var height = (deltas.y - offset.top) / this.dragScale;
            var size = {
                width: width,
                height: height
            };
            this.model.set('scale', size);
        },
        scaleChangeObjectEmbed: function(model, size) {
            this.$object.attr(size);
            this.$embed.attr(size);
            this.$el.css(size);
        }
    };

    return mixers;
});
