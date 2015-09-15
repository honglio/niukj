define(function() {

    /**
     * Base command class for simple attribute changing actions.
     *
     * @class BaseCommand
     * @param {*} initial Initial value of component's attribute.
     * @param {Component} component Affected component.
     * @param {string} attr Affected component's attribute.
     * @param {string} name Name of the command (will be shown in undo history and undo/redo hints).
     */
    function BaseCommand(initial, component, attr, name) {
        this.start = initial;
        if (component.get) {
            this.end = component.get(attr) || 0;
        } else {
            this.end = 0;
        }
        this.component = component;
        this.name = name;
        this.attr = attr;
    }
    BaseCommand.prototype.do = function() {
        if (this.component.slide) {
            this.component.slide.set('active', true);
        }
        this.component.set(this.attr, this.end);
        this.component.set('selected', true);
    };
    BaseCommand.prototype.undo = function() {
        if (this.component.slide) {
            this.component.slide.set('active', true);
        }
        this.component.set(this.attr, this.start);
        this.component.set('selected', true);
    };
    /**
     * Adds component to the slide.
     *
     * @class Add
     * @param {Slide} slide Target slide.
     * @param {Component} component Affected component.
     */
    var Add = function(slide, component) {
        this.slide = slide;
        this.component = component;
    };
    Add.prototype = {
        "do": function() {
            this.slide.set('active', true);
            this.slide.__doAdd(this.component);
        },
        undo: function() {
            this.slide.set('active', true);
            this.slide.__doRemove(this.component);
        },
        name: "Add Comp"
    };
    /**
     * Removes component from the slide.
     *
     * @class Remove
     * @param {Slide} slide Target slide.
     * @param {Component} component Affected component.
     */
    var Remove = function(slide, component) {
        this.slide = slide;
        this.component = component;
    };
    Remove.prototype = {
        "do": function() {
            this.slide.set('active', true);
            this.slide.__doRemove(this.component);
        },
        undo: function() {
            this.slide.set('active', true);
            this.slide.__doAdd(this.component);
        },
        name: "Remove Comp"
    };
    /**
     * Moves component from one location to another.
     *
     * @class Move
     * @param {number} startLoc
     * @param {Component} component
     */
    var Move = function(startLoc, component) {
        this.startLoc = startLoc;
        this.component = component;
        this.endLoc = {
            x: this.component.get('x'),
            y: this.component.get('y')
        };
    };
    Move.prototype.do = function() {
        if (this.component.slide) {
            this.component.slide.set('active', true);
        }
        this.component.set(this.endLoc);
        this.component.set('selected', true);
    };
    Move.prototype.undo = function() {
        if (this.component.slide) {
            this.component.slide.set('active', true);
        }
        this.component.set(this.startLoc);
        this.component.set('selected', true);
    };
    Move.prototype.name = "Move";

    return {
        Add: Add,
        Remove: Remove,
        Move: Move,
        Text: function(initial, component) {
            return new BaseCommand(initial, component, 'text', 'Text');
        }
    };
});
