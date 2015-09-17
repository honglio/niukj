define(["underscore", "./AbstractDrawer"], function(_, AbstractDrawer) {


    function ImageModelDrawer(g2d) {
        AbstractDrawer.apply(this, arguments);
    }

    _.extend(ImageModelDrawer.prototype, AbstractDrawer.prototype);

    ImageModelDrawer.prototype.paint = function(imageModel) {
        if (imageModel._cachedImage) {
            this._imageLoaded(imageModel._cachedImage, imageModel);
        }
    };

    ImageModelDrawer.prototype._imageLoaded = function(image, imageModel) {
        var bbox = {
            x: (imageModel.x ? imageModel.x : imageModel.get('x')) * this.scale.x,
            y: (imageModel.y ? imageModel.y : imageModel.get('y')) * this.scale.y,
            width: (image.naturalWidth ? image.naturalWidth : 0) * this.scale.x * 1.5,
            height: (image.naturalHeight ? image.naturalHeight: 0) * this.scale.y * 1.5
        };
        this.applyTransforms(imageModel, bbox);
        this.g2d.drawImage(image, bbox.x, bbox.y, bbox.width, bbox.height);
    };

    return ImageModelDrawer;
});
