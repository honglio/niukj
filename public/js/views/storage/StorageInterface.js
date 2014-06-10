define(["common/web/local_storage/LocalStorageProvider",
        "common/web/remote_storage/RemoteStorageProvider"],
function(LocalStorageProvider, RemoteStorageProvider) {
    "use strict";

    function StorageInterface() {
        // change to LocalStorageProbider when you want.
        this._providers = new RemoteStorageProvider();
    }

    StorageInterface.prototype = {
        store: function(data, cb) {
            this._providers.create(data, cb);
            return this;
        },

        load: function(id, cb) {
            this._providers.read(id, cb);
            return this;
        },

        remove: function(data, cb) {
            this._providers.delete(data, cb);
            return this;
        },

        saveAs: function(data, cb) {
            this._providers.update(data, cb);
            return this;
        }
    };

    return StorageInterface;
});
