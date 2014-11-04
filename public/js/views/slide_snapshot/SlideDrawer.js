define(["underscore",
    "../slide_components/drawers/TextBoxDrawer",
    "../slide_components/drawers/ImageDrawer",
    "config"
], function(_, TextBoxDrawer, ImageDrawer, Config) {
    "use strict";
    /**
     * Slide snapshot drawer. Paints all elements on little slide thumbnail in SlideWell.
     */
    function SlideDrawer(model, g2d, bg) {
        this.model = model;
        this.g2d = g2d;
        this.bg = bg;

        this.size = {
            width: this.g2d.canvas.width,
            height: this.g2d.canvas.height
        };

        this.scale = {
            x: this.size.width / Config.slide.size.width * 0.66,
            y: this.size.height / Config.slide.size.height * 0.66
        };

        this._drawers = {};

        this._drawers.TextBox = new TextBoxDrawer(this.g2d);
        this._drawers.TextBox.scale = this.scale;
        this._drawers.Image = new ImageDrawer(this.g2d);
        this._drawers.Image.scale = this.scale;

    }

    SlideDrawer.prototype = {

        paint: function() {
            this.g2d.save();
            this.g2d.fillStyle = this.bg;
            this.g2d.fillRect(0, 0, this.size.width, this.size.height);
            this.g2d.restore();
            // paint component
            var components = this.model.get('components');
            for (var i in components) {
                if (components.hasOwnProperty(i)) {
                    var type = components[i].type ? components[i].type : components[i].get('type');

                    var drawer = this._drawers[type];
                    if (drawer) {
                        this.g2d.save();
                        drawer.paint(components[i]);
                        this.g2d.restore();
                    }
                }
            }
        },

        // __paintbgImg: function(bg) {
        //     var oImg = new Image();
        //     oImg.src = bg;
        //     console.log(oImg);

        //     this.g2d.drawImage(oImg, 0, 0);
        // },


        dispose: function() {
            this.model.off(null, null, this);
        }
    };

    return SlideDrawer;
});
