define(['AppView', 'etch_extension', 'bootstrap', 'colorpicker'], function(AppView, Etch) {
    var initialize = function() {
        // TODO: we'll have to make a more generic one that hooks into
        // the storage providers...
        window.clearPresentations = function() {
            var len = localStorage.length;
            for (var i = 0; i < len; i += 1) {
                var key = localStorage.key(i);
                if (key && key.indexOf(".cloudslide") !== -1) {
                    localStorage.removeItem(key);
                }
            }
        };

        // is there any better 3rd party zTracker
        window.zTracker = {
            z: 0,
            next: function() {
                return this.z += 1;
            }
        };

        // Init Etch, the text editor
        Etch.initialize();

        // start the App
        $('#content').append(new AppView().render().$el);
        $('.dropdown-toggle').dropdown();
    };

    return {
        initialize: initialize
    };
});
