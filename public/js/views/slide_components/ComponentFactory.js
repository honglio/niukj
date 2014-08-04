define(['models/TextBox',
        'models/Image',
        './view/TextBoxView',
        './view/ImageView',
        './drawers/TextBoxDrawer',
        './drawers/ImageDrawer'
], function(TextBox, Image,
            TextBoxView, ImageView,
            TextBoxDrawer, ImageDrawer) {
    "use strict";

    function ComponentFactory() {
        if (ComponentFactory.prototype.instance) {
            return ComponentFactory.prototype.instance;
        }
        ComponentFactory.prototype.instance = this;
        // Look up cloudslide.Component s
        // create our view map based on their component types
        // ComponentType must be same in model and view.
        // it is how they are mapped to one another.
        this._modelCtors = {
            'TextBox': TextBox,
            'Image': Image
        };
        this._viewCtors = {
            'TextBox': TextBoxView,
            'Image': ImageView
        };

        this._drawers = {
            'TextBox': TextBoxDrawer,
            'Image': ImageDrawer
        };
    }

    ComponentFactory.prototype = {
        /**
         * Create view for a given model.
         *
         * @param {Component} [model]
         * @returns {ComponentView}
         */
        createView: function(model) {
            var type = model.get('type') ? model.get('type') : model.type;
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
            console.log(rawModel);
            var type;
            if (typeof rawModel === 'string') {
                type = rawModel;
            } else {
                type = rawModel.type;
            }
            var Ctor = this._modelCtors[type];
            if (Ctor) {
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

    return ComponentFactory;
});
