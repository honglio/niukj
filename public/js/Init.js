define(['router', 'etch_extension', 'bootstrap'], function(router, Etch, Bootstrap) {
  var initialize = function() {
    // TODO: we'll have to make a more generic one that hooks into
    // the storage providers...
    window.clearPresentations = function() {
      var len = localStorage.length;
      for (var i = 0; i < len; i += 1) {
        var key = localStorage.key(i);
        if (key && key.indexOf(".cloudslide") !== -1) {
          console.log('Removing: ' + key);
          localStorage.removeItem(key);
        }
      }
    };
    /*global function end*/

    // is there any better 3rd party zTracker
    window.zTracker = {
      z: 0,
      next: function() {
        return this.z += 1;
      }
    };

    // why we need to detect browser type? try use feature detect.
    var agent = window.navigator.userAgent;
    if (agent.indexOf('WebKit') >= 0) {
      window.browserPrefix = "-webkit-";
    } else if (agent.indexOf('Presto') >= 0) {
      window.browserPrefix = "-o-";
    } else if (agent.indexOf('Gecko') >= 0) {
      window.browserPrefix = "-moz-";
    } else if (agent.indexOf('Trident') >= 0) {
      window.browserPrefix = "-ms-";
    } else {
      window.browserPrefix = "";
    }

    // Init Etch, the text editor
    Etch.initialize();
    // Backbone App start
    Backbone.history.start();
  };

  return {
    initialize: initialize
  };
});
