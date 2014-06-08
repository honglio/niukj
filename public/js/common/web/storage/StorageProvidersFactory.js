define(["lodash", "backbone"],
    function(_, Backbone) {
        "use strict";

        function StorageProvidersFactory(registry) {
            this.registry = registry;
            this.registry.on("registered:web.StorageProvider", this._providerRegistered, this);
            this._getProviders(); // must get after StorageProvider registered.
        }

		StorageProvidersFactory.prototype = {
            _currentProviderId: null,
            _providerRegistered: function(providerEntry) {
                var provider = providerEntry.service();
                this.providers[provider.id] = provider;

                if (this._currentProviderId == null) {
                    this._currentProviderId = provider.id;
                }

                this.trigger("change:providers", this.providers, provider);
            },

            _getProviders: function() {
                var providerEntries = this.registry.get('web.StorageProvider');
                var providers = {};
                providerEntries.forEach(function(providerEntry) {
                    var provider = providerEntry.service();
                    providers[provider.id] = provider;

                    if (this._currentProviderId == null) {
                        this._currentProviderId = provider.id;
                    }
                }, this);

                this.providers = providers;
            },

            _updateCurrentProvider: function(providerId) {
                console.log(providerId);
                console.log(this._currentProviderId);
                if (providerId !== this._currentProviderId) {
                    this._currentProviderId = providerId;
                    // this.trigger("change:currentProvider");
                }
            },

            currentProvider: function() {
                return this.providers[this._currentProviderId];
            },

            selectProvider: function(providerId) {
                this._updateCurrentProvider(providerId);
                return this.currentProvider();
            },

            providerNames: function() {
                var result = [];

                for (var id in this.providers) {
                    if (this.providers.hasOwnProperty(id)) {
                        result.push({
                            name: this.providers[id].name,
                            id: id
                        });
                    }
                }

                return result;
            }
        };

        _.extend(StorageProvidersFactory.prototype, Backbone.Events);

        return StorageProvidersFactory;
    });
