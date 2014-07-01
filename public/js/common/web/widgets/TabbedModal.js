/*
 * A modal for Services, Each serviceEntry gets a new tab.
 */
define(["backbone", "web/widgets/templates/TabbedModal"
], function(Backbone, tmplTabbedModal) {
	"use strict";
	return Backbone.View.extend({
		events: {
			hidden: '_hidden'
		},

		className: 'tabbedModal modal hide',

		initialize: function() {
		},

		_providerSelected: function(providerIndex, e) {
			var $curr;
			if (e) {
				$curr = $(e.currentTarget);
				if (this.$lastProviderTab && this.$lastProviderTab[0] === $curr[0]) {
					return;
				}
			}

			if (this.$lastProviderTab) {
				this.$lastProviderTab.removeClass('active');
			}

			this.$lastProviderTab = $curr;
			this.$lastProviderTab.addClass('active');

			if (this._currentProvider) {
				this._currentProvider.hide();
			}

			this._currentProvider = this._tabCollection[providerIndex];

			this._providerSelected(this._currentProvider, e);

			this._currentProvider.show(this.$tabContent, this.$el);
		},

		_hidden: function() {
			if (this._currentProvider) {
				this._currentProvider.hidden();
			}
		},

		show: function(cb, title) {
			this._cb = cb;
			this._$title.text(title);
			if (this._currentProvider) {
				this._currentProvider.show(this.$tabContent, this.$el);
			}
			this.$el.modal('show');
		},

		render: function() {
			this.$el.html(tmplTabbedModal(this._tabCollection));
			this._$ok = this.$el.find('.ok');
			this._$title = this.$el.find('.title');
			this.$tabContent = this.$el.find('.tabContent');

			var self = this;
			var $tabs = this.$el.find('.providerTab');
			$tabs.each(function(i) {
				var $item = $(this);
				$item.click(function(e) {
					self._providerSelected(i, e);
				});
			});

			if (this._tabCollection.length > 0) {
				self._providerSelected(0, {currentTarget: $tabs[0]});
			}

			return this;
		},

		// TODO: listen for tab additions and removals.
		// tabProviders should just be a "tabProvider" that can be listened to
		// and provides tabs.
		constructor: function TabbedModal(tabCollection) {
			this._tabCollection = tabCollection;
			Backbone.View.prototype.constructor.call(this);
		}
	});
});
