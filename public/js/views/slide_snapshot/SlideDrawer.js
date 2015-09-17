define(["underscore",
    "../slide_components/drawers/TextBoxDrawer",
    "../slide_components/drawers/ImageDrawer",
    "config"
], function(_, TextBoxDrawer, ImageDrawer, Config) {

    /**
     * Slide snapshot drawer. Paints all elements on little slide thumbnail in SlideWell.
     */
    function SlideDrawer(model, g2d, bg) {
        this.model = model;
        this.g2d = g2d;
        this.bg = bg;
        // console.log(bg);
        this.size = {
            width: this.g2d.canvas.width,
            height: this.g2d.canvas.height
        };

        this.scale = {
            x: this.size.width / Config.slide.size.width * 0.666666666,
            y: this.size.height / Config.slide.size.height * 0.666666666
        };

        this._drawers = {};

        this._drawers.TextBox = new TextBoxDrawer(this.g2d);
        this._drawers.TextBox.scale = this.scale;
        this._drawers.Image = new ImageDrawer(this.g2d);
        this._drawers.Image.scale = this.scale;

    }

    SlideDrawer.prototype = {

        paint: function() {
            if (this.bg.indexOf('img:') === -1) {
                this.g2d.save();
                this.g2d.fillStyle = this.bg;
                this.g2d.fillRect(0, 0, this.size.width, this.size.height);
                this.g2d.restore();
                this.__paintComponent();
            } else {
                this.__paintbgImg(this.bg.substring(4));
            }
        },

        __paintbgImg: function(bg) {
            var oImg = new Image();
            oImg.src = bg;
            var self = this;
            this.g2d.save();
            setTimeout(function() {
                // ensure bg img is loaded
                self.g2d.drawImage(oImg, 0, 0, 300, 195);
                self.g2d.restore();
                self.__paintComponent();
            }, 100);
        },

        __paintComponent: function() {
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


        dispose: function() {
            this.model.off(null, null, this);
        }
    };

    return SlideDrawer;
});
