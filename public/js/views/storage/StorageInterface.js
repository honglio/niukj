define(["underscore", "common/web/storage/StorageProvidersFactory"],
function(_, StorageProviders) {
    "use strict";

    // remove presentation specific garbage

    function StorageInterface() {
        this._providers = new StorageProviders();
    }

    StorageInterface.prototype = {
        providerNames: function() {
            return this._providers.providerNames();
        },

        selectProvider: function(providerId) {
            return this._providers.selectProvider(providerId);
        },

        currentProvider: function() {
            return this._providers.currentProvider();
        },

        currentProviderId: function() {
            return this._providers._currentProviderId;
        },

        on: function() {
            return this._providers.on.apply(this._providers, arguments);
        },

		off: function() {
			this._providers.off.apply(this._providers, arguments);
		},

        store: function(filename, data, cb) {
            console.log(data);
            console.log(filename);
            this.selectProvider('remotestorage').setContents(filename, data, cb);

            return this;
        },

        load: function(identifier, cb) {
            // TODO: load localstorage first.
            this.selectProvider('remotestorage').getContents(identifier, cb);
            return this;
        },

        remove: function(identifier, cb) {
            this.currentProvider().rm(identifier, cb);
            return this;
        },

        list: function(cb) {
            this.selectProvider('remotestorage').ls(cb);
            return this;
        },

        listPresentation: function() {
            //TODO: list snapshot, filename, id
        },

        listPresentationNames: function(path, cb) {
            console.log('runned');
            this.selectProvider('localstorage').ls(path, /.*\.cloudslide$/, cb);
            return this;
        },

        savePresentation: function(filename, data, cb) {
            console.log("savePresentation");
            var idx = filename.indexOf('.cloudslide');
            // if fileName not contain surfix, add it.
            if (idx === -1 || idx + '.cloudslide'.length !== filename.length) {
                filename += '.cloudslide';
            }
            console.log(data);
            console.log(filename);
            this.store(filename, data, cb);

            // TODO: remove use localstorage to store slide.
            var d = _.clone(data);
            delete d.activeSlide;
            delete d.background;
            delete d.slides;
            this.selectProvider('localstorage').setContents(filename, d, cb);
        }
    };

    return StorageInterface;
});
