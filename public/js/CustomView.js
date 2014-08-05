define(["underscore", "backbone"], function(_, Backbone) {
  var CustomView = Backbone.View.extend({
    dispose: function() {
      // check whether the View can be disposed.
      if (this.subViews && this.subViews instanceof Object) {
        for (var i in this.subViews) {
          if (this.subViews.hasOwnProperty(i)) {
            if (this.subViews[i] instanceof Backbone.View) {
              this.subViews[i].dispose();
            }
          }
        }
      }
      this.undelegateEvents();
      this.remove();
      this.trigger("destroyed", this);
    },
    constructor: function(options) {
      this.configure(options || {});
      Backbone.View.prototype.constructor.apply(this, arguments);
    },

    configure: function(options) {
      if (this.options) {
        options = _.extend({}, _.result(this, 'options'), options);
      }
      this.options = options;
    }

  });

  return CustomView;
});
