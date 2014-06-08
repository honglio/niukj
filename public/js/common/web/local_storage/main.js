define(["./LocalStorageProvider"],
function(LocalStorageProvider) {
	"use strict";
	var service = new LocalStorageProvider();

	return {
		initialize: function(registry) {
			registry.register({
				interfaces: 'web.StorageProvider'
			}, service);
		}
	};
});
