define(["CustomView",
    "./StorageInterface",
    "hbs!templates/StorageModal",
    "css!styles/app/storage/storageModal.css"
], function(CustomView, StorageInterface, StorageModalTemplate, css) {
    "use strict";
    return CustomView.extend({
        events: {
            "keyup #filename": '_filenameEnterd',
            "click .ok": '_okClicked',
            destroyed: 'remove'
        },

        initialize: function() {
            this.storageInterface = new StorageInterface();
        },

        render: function() {

            this.$el.html(StorageModalTemplate({
                title: '保存',
                filename: this.model.deck().get('fileName')
            }));
            return this;
        },

        show: function() {
            this.$el.modal('show'); // bootstrap function
        },

        _filenameEnterd: function() {
            if(this.$el.find("#fileName").val()) {
                this.$el.find(".ok").removeAttr('disabled');
            } else {
                this.$el.find(".ok").attr('disabled', 'disabled');
            }
        },

        _okClicked: function(e) {
			console.log('_okClicked');
            if(e.preventDefault){
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            var self = this;

            // TODO: use saveAs if window.location.href has id.
            storageInterface.store(this.model.exportPresentation(filename)
                , function(err) {
                    if (!err) {
                        self.$el.modal('hide');
                        alert('保存成功');
                    } else {
                        console.log(err.stack);
                        alert('保存失败，请稍后再试！');
                    }
                });
        }
    });
});
