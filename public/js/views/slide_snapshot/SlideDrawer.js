define(["underscore",
    "../slide_components/drawers/TextBoxDrawer",
    "../slide_components/drawers/ImageDrawer",
    "config"
], function(_, TextBoxDrawer, ImageDrawer, Config) {

    /**
     * Slide snapshot drawer. Paints all elements on little slide thumbnail in SlideWell.
     */
    function SlideDrawer(model, g2d, bg, theme) {
        this.model = model;
        this.g2d = g2d;
        this.bg = bg;
        this.theme = theme;
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
            // paint background first, then paint theme, finally paint component
            if (this.bg.indexOf('img:') === -1) {
                // paint background
                this.g2d.save();
                this.g2d.fillStyle = this.bg;
                this.g2d.fillRect(0, 0, this.size.width, this.size.height);
                this.g2d.restore();

                this.__paintTheme(this.theme);
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

                self.__paintTheme(self.theme);
                self.__paintComponent();
            }, 100);
        },

        __paintTheme: function(theme) {
            this.g2d.save();
            this.g2d.fillStyle = "rgba(0,0,0,0.5)";
            // console.log(typeof this.size.width);
            switch (theme) {
                case 'theme-top':
                    this.g2d.fillRect(0, this.size.height * 0.1, this.size.width, this.size.height * 0.3);
                    break;
                case 'theme-middle':
                    this.g2d.fillRect(0, this.size.height * 0.35, this.size.width, this.size.height * 0.3);
                    break;
                case 'theme-bottom':
                    this.g2d.fillRect(0, this.size.height * 0.6, this.size.width, this.size.height * 0.3);
                    break;
                case 'theme-left':
                    this.g2d.fillRect(0, 0, this.size.width * 0.4, this.size.height);
                    break;
                case 'theme-right':
                    this.g2d.fillRect(this.size.width * 0.6, 0, this.size.width, this.size.height);
                    break;
                case 'theme-full':
                    this.g2d.fillRect(0, this.size.height * 0.1, this.size.width, this.size.height * 0.8);
                    break;
            }
            this.g2d.restore();
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
