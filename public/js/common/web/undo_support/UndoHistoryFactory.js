define(["./UndoHistory"],
function(UndoHistory) {
	"use strict";
	var managedInstances = {};

    function create(opts) {
        opts = opts || {};
        return new UndoHistory(opts.size || 20);
    }

	return {

		// TODO: this should be gotten from the editor model
		// and not some global managed instance.
		managedInstance: function(key, opts) {
			var instance = managedInstances[key];
			if (!instance) {
				instance = create(opts);
				managedInstances[key] = instance;
			}
			return instance;
		}
	};
});
