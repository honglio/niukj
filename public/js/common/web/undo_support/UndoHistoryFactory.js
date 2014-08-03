define(["./UndoHistory"],
function(UndoHistory) {
	"use strict";
	var managedInstances = {};

    function create(opts) {
        opts = opts || {};
        return new UndoHistory(opts.size || 20);
    }

	return {
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
