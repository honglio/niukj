define(function(require) {
  var CustomView = Backbone.View.extend({
    dispose: function() {
        console.log('Disposing View ' + this);
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
    }
  });

  return CustomView;
});
