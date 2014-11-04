define(["underscore",
    "backbone",
    "./SpatialObject",
    "../views/slide_components/ComponentFactory",
    "common/Math2",
    "./ComponentCommands",
    "common/web/undo_support/UndoHistoryFactory"
], function(_, Backbone, SpatialObject, ComponentFactory, Math2, ComponentCommands, UndoHistoryFactory) {
    "use strict";
    var undoHistory = UndoHistoryFactory.managedInstance('editor');

    /**
     *  Represents a slide in the presentation!
     *  Slides contain components (text boxes, images, etc.)
     *  Slide fires a "contentsChanged" event whenever any of their
     *  components are updated.
     *
     *  Slide fires "change:components.add/remove" events when components are
     *  added or removed.
     *  @class model.presentation.Slide
     *  @extend model.geom.SpatialObject
     */
    return SpatialObject.extend({
        type: 'slide',

        initialize: function() {
            SpatialObject.prototype.initialize.apply(this, arguments);
            var components = this.get('components');
            if (!components) {
                this.set('components', []);
            } else {
                var hydratedComps = [];
                var compFactory = new ComponentFactory();
                components.forEach(function(rawComp) {
                    var comp;

                    if (rawComp instanceof Backbone.Model) {
                        comp = rawComp.clone();
                        hydratedComps.push(comp);
                    } else {
                        comp = compFactory.instance.createModel(rawComp);
                        hydratedComps.push(comp);
                    }
                    this._registerWithComponent(comp);

                }, this);
                this.set('components', hydratedComps);
            }
            this.set('background', this.get('background') || 'defaultbg');
            this.on("unrender", this._unrendered, this);
        },

        /**
         * React on slide being unrendered.
         */
        _unrendered: function() {
            if (this.get('components')) {
                this.get('components').forEach(function(component) {
                    component.trigger("unrender", true);
                });
            }
        },

        /**
         * Register callbacks on component events.
         *
         * @param {Component} component
         * @private
         */
        _registerWithComponent: function(component) {
            component.slide = this; // set a link back of the slide
            // component.on("dispose", this.remove, this);
            component.on("change:selected", this._selectionChanged, this);
            component.on("change", this._componentChanged, this);
        },

        /**
         * Adds a component in a space that has not already
         * been occupied.  Triggers "contentsChanged"
         * and "change:components.add" events.
         * The contentsChanged event is used by the preview canvas to re-render itself.
         * The change:components.add is used by the operating table to know to render the new component.
         * @method
         * @param {model.presentation.components.Component} component The component (text box,
         * image, etc. to be added)
         *
         */
        add: function(component) {
            this._placeComponent(component);
            var cmd = new ComponentCommands.Add(this, component);
            cmd.do();
            undoHistory.push(cmd);
        },

        /**
         * Callback for component addition command.
         * @see ComponentCommands.Add
         *
         * @method
         * @param {Component[]} components The component to be added (text box, image, etc.)
         */
        __doAdd: function(component) {
            this.get('components').push(component);
            this._registerWithComponent(component);
            this.trigger("contentsChanged");
            this.unselectComponents();
            component.set('selected', true);
            this.trigger("change:components.add", this, component);
        },

        /**
         * A pretty naive implementation but it should do the job just fine.
         * Places a new component in a location that doesn't currently contain a component
         * @method _placeComponent
         * @param {Component} component The component to be placed
         *
         */
        _placeComponent: function(component) {
            this.get('components').forEach(function(existingComponent) {
                var existingX = existingComponent.get('x');
                var existingY = existingComponent.get('y');
                if (Math2.withinThresh(existingX, component.get('x'), 5) && Math2.withinThresh(existingY, component.get('y'), 5)) {
                    component.set({
                        x: existingX + 20,
                        y: existingY + 20
                    });
                }
            });
        },

        /**
         * Dispose slide from the presentation.
         */
        dispose: function() {
            this.set({
                active: false,
                selected: false
            });
            SpatialObject.prototype.dispose.call(this);
        },

        /**
         * Remove one or more components from the slide.
         *
         * @param {Component|Component[]} components
         */
        remove: function(component) {
            undoHistory.pushdo(new ComponentCommands.Remove(this, component));
        },

        /**
         * Callback for component removal command.
         * @see ComponentCommands.Remove
         *
         * @param {Component[]} components
         * @private
         */
        __doRemove: function(component) {
            var idx = this.get('components').indexOf(component);
            if (idx !== -1) {
                this.get('components').splice(idx, 1);
                this.trigger("contentsChanged");
                this.trigger("change:components.remove", this, component);
                this._selectionChanged(component, false);
                component.trigger("unrender");
                //  component.off(null, null, this);
                component.off();
                return component;
            } else {
                return undefined;
            }
        },

        /**
         * React on component being changed.
         *
         * @private
         */
        _componentChanged: function() {
            this.trigger("contentsChanged");
        },

        /**
         * Select given component.
         *
         * @param {Component} components
         */
        selectComponent: function(component) {
            if (component) {
                this.get('components').forEach(function(comp) {
                    comp.set('selected', false);
                });
                component.set('selected', true);
            }
        },

        /**
         * Unselect given components. If no components passed, then all selected coponents will be unselected.
         *
         * @param {Component|Component[]} [components]
         */
        unselectComponents: function() {
            if (this.lastSelection) {
                this.lastSelection.set('selected', false);
            }
        },

        /**
         * React on component selection change.
         *
         * @param {Component} model
         * @param {boolean} selected
         * @private
         */
        _selectionChanged: function(model, selected) {
            if (selected) {
                if (this.lastSelection !== model) {
                    this.get('components').forEach(function(component) {
                        if (component !== model) {
                            return component.set('selected', false);
                        }
                    });
                    this.lastSelection = model;
                }
                this.trigger("change:activeComponent", this, model, selected);
            } else {
                this.trigger("change:activeComponent", this, undefined);
                this.lastSelection = undefined;
            }
        },

        constructor: function Slide() {
            SpatialObject.prototype.constructor.apply(this, arguments);
        }
    });
});
