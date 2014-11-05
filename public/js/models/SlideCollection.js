define(["backbone", "./Slide"],
    function(Backbone, Slide) {

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
                this.models.forEach(function(model, idx) {
                    return model.set('index', idx);
                });
            },
            /**
             * Update positions after slides have changed order
             *
             * @returns {SlideCollection} this
             */
            sortPosition: function() {
                this.models.forEach(function(model, i) {
                    model.set('index', i);
                }); // update index

                return this;
            }
        });
    });
