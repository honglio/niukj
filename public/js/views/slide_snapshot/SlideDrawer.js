define(["underscore",
        "../slide_components/drawers/TextBoxDrawer",
        "../slide_components/drawers/ImageDrawer"
], function(_, TextBoxDrawer, ImageDrawer) {
    "use strict";

    /**
     * Slide snapshot drawer. Paints all elements on little slide thumbnail in SlideWell.
     */
    function SlideDrawer(model, g2d) {
        this.model = model;
        this.g2d = g2d;

        this.repaint = this.repaint.bind(this);
        this.repaint = _.debounce(this.repaint, 100);

        this.model.on("contentsChanged", this.repaint, this);

        this.size = {
            width: this.g2d.canvas.width,
            height: this.g2d.canvas.height
        };

        this.scale = {
            x: this.size.width / config.slide.size.width * 0.66,
            y: this.size.height / config.slide.size.height * 0.66
        };
        console.log(this.size.width);
        console.log(this.size.height);

        this._drawers = {};

        this._drawers.TextBox = new TextBoxDrawer(this.g2d);
        this._drawers.TextBox.scale = this.scale;
        this._drawers.Image = new ImageDrawer(this.g2d);
        this._drawers.Image.scale = this.scale;

    }

    SlideDrawer.prototype = {
        repaint: function(bg) {
            this._paint(bg);
        },

        _paint: function(bg) {
            this.g2d.clearRect(0, 0, this.size.width, this.size.height);

            this.__paintbg(bg, this.size.width, this.size.height);

            var components = this.model.get('components');

            components.forEach(function(component) {
                var type = component.get('type');
                var drawer = this._drawers[type];
                if (drawer) {
                    this.g2d.save();
                    drawer.paint(component);
                    this.g2d.restore();
                }
            }, this);
        },

        __paintbgImg: function(bg) {
            var oImg = new Image();
            oImg.src = bg;
            console.log(oImg);

            this.g2d.drawImage(oImg, 0, 0);
        },

        __paintbg: function(bg, w, h) {
            this.g2d.fillStyle = bg;
            this.g2d.fillRect(0, 0, w, h);
        },

        dispose: function() {
            this.model.off(null, null, this);
        }
    };

    return SlideDrawer;
});
