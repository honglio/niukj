(function(){
    var Backbone = this.Backbone;
    Backbone.View.prototype.dispose = function() {
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
        if (this.model) {
            this.model.dispose();
        }
        if (this.collection) {
            this.collection.dispose();
        }
        this.undelegateEvents();
        this.remove();
        this.trigger("destroyed", this);
    };
    Backbone.Model.prototype.dispose = function() {
        console.log('Disposing Model ' + this);
        this.off();
    };
    Backbone.Collection.prototype.dispose = function() {
        console.log('Disposing Collection ' + this);
        this.off();
    };
}).call(this);