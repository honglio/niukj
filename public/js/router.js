define([, 'AppView'],
function(AppModel, AppView) {
  var AppRouter = Backbone.Router.extend({

    routes: {
      "": "home"
    },

    home: function() {
      new AppView().render();
    }

  });

  return new AppRouter();
});

