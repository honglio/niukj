define(function() {
    "use strict";

    function ComponentFactory() {
        // Look up cloudslide.Component s
        // create our view map based on their component types
        // ComponentType must be same in model and view.
        // it is how they are mapped to one another.
        this._modelCtors = {};
        this._modelCtors.TextBox = TextBox;
        this._modelCtors.Image = Image;

        this._viewCtors = {};
        this._viewCtors.TextBox = TextBoxView;
        this._viewCtors.Image = ImageView;

        this._drawers = {};
        this._drawers.TextBox = TextBoxDrawer;
        this._drawers.Image = ImageDrawer;
    }

    ComponentFactory.prototype = {
        /**
         * Create view for a given model.
         *
         * @param {Component} [model]
         * @returns {ComponentView}
         */
        createView: function(model) {
            var type = model.get('type');
            var Ctor = this._viewCtors[type];
            if (Ctor) {
                return new Ctor({
                    model: model
                });
            }
        },

        /**
         * Create a model from a given raw object.
         *
         * @param {Object} [rawModel]
         * @returns {Component}
         */
        createModel: function(rawModel) {
            var type;
            // TODO: temporary hack until
            // everyone migrates to the new serialization format
            if (rawModel.type === "ImageModel") {
                rawModel.type = "Image";
            }

            if (typeof rawModel === 'string') {
                type = rawModel;
            } else {
                type = rawModel.type;
            }
            var Ctor = this._modelCtors[type];
            if (Ctor) {
                console.log(rawModel);
                return new Ctor(rawModel);
            }
        },

        /**
         * Return drawer object for a given component type.
         *
         * @param {string} [type]
         * @returns {AbstractDrawer|ImageDrawer|TextBoxDrawer}
         */
        getDrawer: function(type) {
            return this._drawers[type];
        }
    };

    return {
        initialize: function() {
            console.log('Init ComponentFactory');
            if (!this.instance) {
                this.instance = new ComponentFactory();
            }
        }
    };
});
