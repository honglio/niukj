define(["backbone"], function(Backbone) {
    "use strict";
    return Backbone.View.extend({
        className: 'hide',
        events: {
            "change input[type='file']": '_fileChosen'
        },
        initialize: function(triggerElem, cb) {
            this._cb = cb;
            if (triggerElem) {
                return triggerElem.on("click", this.trigger.bind(this));
            }
        },
        trigger: function(cb) {
            if (cb) {
                this._cb = cb;
            }
            return this.$input.click();
        },
        _fileChosen: function(e) {
            return this._cb(e.target.files[0]);
        },
        render: function() {
            this.$input = $('<input type="file"></input>');
            this.$el.html(this.$input);
            return this;
        }
    });
});
