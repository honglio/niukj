define(["backbone", "./Slide"],
function(Backbone, Slide) {
	"use strict";
    /**
     * @class SlideCollection
     * @augments Backbone.Collection
     */
    return Backbone.Collection.extend({
        model: Slide,
        initialize: function() {
            this.on("add", this._updateIndexes, this);
            this.on("remove", this._updateIndexes, this);
        },
        /**
         * Update slide indexes on any changes to the contents of collection.
         *
         * @private
         */
        _updateIndexes: function() {
            console.log('update Index');
            this.models.forEach(function(model, idx) {
                return model.set('index', idx);
            });
        },
        /**
         * Update positions after slides have changed order
         *
         * @param {Slide[]} slidesCopy
         * @returns {SlideCollection} this
         */
        sortPosition: function(slidesCopy) {
            var transitions = []; // new postion
            this.models.forEach(function(model, i) {
                // update postion of index
                transitions.push(slidesCopy[i].getPositionData());
            }, this);

            transitions.forEach(function(transition, i) {
                this.models[i].set(transition, { silent: true });
            }, this); // update postion for models

            this.models.forEach(function(model, i) {
                model.set('index', i);
            }); // update index

            return this;
        },
        /**
         * Change position of slides in SlideWell if their order is changed in collection.
         *
         * @param {Slide} l
         * @param {Slide} r
         * @private
         */
        _swapTransitionPositions: function(l, r) {
            l.set(r.getPositionData(), { silent: true });
            r.set(l.getPositionData(), { silent: true });
        }
    });
});
