define(function() {
    "use strict";

    function AbstractDrawer(g2d) {
        this.g2d = g2d;
    }

    AbstractDrawer.prototype.applyTransforms = function(component, bbox) {
        // var scale = component.get('scale');
        this.g2d.translate(bbox.x / 2, bbox.y / 1.5); // draw on current position

        // //  draw scale
        // if (scale) {
        //     this.g2d.scale(scale.x / 1.2, scale.y / 1.5);
        //     console.log(component)
        //     // if scaled, draw position by scale.
        //     if (component.get('type') === 'TextBox') {
        //         console.log('Textbox');
        //         this.g2d.translate(scale.x * bbox.width * 0.7, scale.y * bbox.height * 0.25);
        //     }
        //     else if (component.get('type') === 'Image') {
        //         console.log('Image');
        //         this.g2d.translate(scale.x * (bbox.width - 120) * 0.25, scale.y * (bbox.height - 76) * 0.2);
        //     }
        // }


        // this.g2d.translate(-1 * (bbox.x), -1 * (bbox.y));
    };

    return AbstractDrawer;
});
