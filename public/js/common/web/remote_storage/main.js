define(["./RemoteStorageProvider"],
function(RemoteStorageProvider) {
    "use strict";
    var service = new RemoteStorageProvider();

    return {
        initialize: function(registry) {
            registry.register({
                interfaces: 'web.StorageProvider'
            }, service);
        }
    };
});
