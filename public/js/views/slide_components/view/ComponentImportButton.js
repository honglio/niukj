define(["./ComponentButton", "common/web/widgets/ItemImportModal"],
function(ComponentButton, ItemImportModal) {
	"use strict";

	return ComponentButton.extend({
		initialize: function() {
			ComponentButton.prototype.initialize.apply(this, arguments);
			this._modal = ItemImportModal.get(this.options);
			this._itemImported = this._itemImported.bind(this);
		},

		_clicked: function() {
			this._modal.show(this._itemImported);
		},

		_itemImported: function(src) {
			this.model.addComponent({
				src: src,
				type: this.options.componentType
			});
		}
	});
});
