define(function() {
    "use strict";

    var prefix = "cloudslide-";

    function LocalStorageProvider() {
        this.storageImpl = localStorage;
        this.name = "Local Storage";
        this.id = "localstorage";
    }

    LocalStorageProvider.prototype = {
        /*
         * list the filename of all file.
         */
        ls: function(path, regex, cb) {
            // Paths are currently ignored
            var numFiles = this.storageImpl.length;
            var fileNames = [];
            for (var i = 0; i < numFiles; i += 1) {
                var fileName = this.storageImpl.key(i);
                if (fileName.indexOf(prefix) === 0 &&
                    (regex == null || regex.exec(fileName) !== null)) {
                    fileNames.push(fileName.substring(prefix.length));
                }
            }

            cb(fileNames);

            return this;
        },

        rm: function(fname, cb) {
            // TODO: add this func to deleteDeck
            this.storageImpl.removeItem(prefix + fname);
            if (cb) {
                cb(true);
            }

            return this;
        },

        getContents: function(fname, cb) {
            var item = this.storageImpl.getItem(prefix + fname);
            if (item) {
                try {
                    var data = JSON.parse(item);
                    cb(data);
                } catch (e) {
                    console.log(e.stack);
                    cb(null, e);
                }
            }

            return item;
        },

        setContents: function(fname, data, cb) {
            try {
                this.storageImpl.setItem(prefix + fname, JSON.stringify(data));
                cb();
            } catch (e) {
                cb(e);
            }
            return this;
        }
    };

    return LocalStorageProvider;
});
