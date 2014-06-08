define(["CustomView",
    "common/web/widgets/FileBrowser",
    "hbs!templates/StorageModal"
    "css!styles/storage/storageModal.css"
], function(CustomView, FileBrowser, StorageModal, css) {
    "use strict";
    return CustomView.extend({
        className: "storageModal modal hide",
        events: {
            "click a[data-provider]": '_providerSelected',
            "click .ok": '_okClicked',
            destroyed: 'remove'
        },

        initialize: function() {
            this.storageInterface = new StorageInterface();
            this.storageInterface.on("change:providers", this.render, this);

            this.fileBrowser = new FileBrowser(this.storageInterface, this.editorModel);
        },

        title: function(title) {
            this.$el.find('.title').html(title);
        },

        dispose: function() {
            this.storageInterface.off(null, null, this);
            this.fileBrowser.dispose();
			Backbone.View.prototype.dispose.call(this);
        },

        render: function() {
			console.log('render');

            // Don't load the data for a provider until its tab is selected.
            var providerNames = this.storageInterface.providerNames();
            this.$el.html(StorageModal({
                title: 'none',
                tabs: providerNames
            }));

            var currentTab = this.$el.find('[data-provider="' +
                    this.storageInterface.currentProviderId() +
                    '"]').parent();
            currentTab.addClass('active');

            this.$el.find('.tabContent').append(this.fileBrowser.render().$el);

            return this;
        },

        show: function() {
            this.title('保存');
            this.$el.modal('show'); // bootstrap function
        },

        _okClicked: function(e) {
			console.log('_okClicked');
            if(e.preventDefault){
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            if (this.fileBrowser.fileName() === "") {
                alert('课件名不能为空');
                return;
            }

            var self = this;
            storageInterface.savePresentation(filename
                , this.model.exportPresentation(filename)
                , function(err) {
                    if (!err) {
                        self.$el.modal('hide');
                        alert('保存成功');
                    } else {
                        console.log(err.stack);
                        alert('保存失败，请稍后再试！');
                    }
                });
        },

        _providerSelected: function(e) {
            // change the storageInterface's selected storage provider
            this.storageInterface.selectProvider(e.target.dataset.provider);
        },

        constructor: function StorageModal(editorModel) {
            this.editorModel = editorModel;
            Backbone.View.prototype.constructor.apply(this, arguments);
        }
    });
});
