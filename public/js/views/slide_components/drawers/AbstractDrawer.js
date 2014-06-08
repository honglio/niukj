define(function() {
    "use strict";

    function AbstractDrawer(g2d) {
        this.g2d = g2d;
    }

    AbstractDrawer.prototype.applyTransforms = function(component, bbox) {
        var scale = component.get('scale');
        this.g2d.translate(bbox.x, bbox.y); // draw on current position

		// if scaled, draw position by scale.
        this.g2d.translate(scale.x * bbox.width / 2, scale.y * bbox.height / 2);
    };

    return AbstractDrawer;
});
