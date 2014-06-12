define(['AppView'],
function(AppView) {
  var AppRouter = Backbone.Router.extend({

    routes: {
      "": "home"
    },

    home: function() {
      $('#content').append(new AppView().render().$el);
    }

  });

  return new AppRouter();
});

