define(["CustomView",
    "./StorageInterface",
    "hbs!templates/StorageModal",
    "css!styles/app/storage/storageModal.css"
], function(CustomView, StorageInterface, StorageModalTemplate, css) {
    "use strict";
    return CustomView.extend({
        className: "storageModal modal fade",
        events: {
            "paste input[name='filename']": '_filenameEnterd',
            "keyup input[name='filename']": '_filenameEnterd',
            "click .ok": '_okClicked',
            destroyed: 'remove'
        },

        initialize: function() {
            this.storageInterface = new StorageInterface();
        },

        render: function() {
            var fileName = this.model.deck().get('fileName');

            this.$el.html(StorageModalTemplate({
                title: '保存',
                filename: fileName
            }));

            this._filenameEnterd();
            return this;
        },

        show: function() {
            this.$el.modal('show'); // bootstrap function
        },

        _filenameEnterd: function() {
            this.$input = this.$el.find("input[name='filename']");
            if(this.$input.val()) {
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
            var filename = this.$input.val();

            var csrf = $("input[name='_csrf']").val();

            var serialized = {
                article: this.model.exportPresentation(filename),
                _csrf: csrf
            }
            // TODO: use saveAs if window.location.href has id.
            if(!this.model.deck().get('id')) {
                this.storageInterface.store(serialized, function(id) {
                    if(id) {
                        self.$el.modal('hide');
                        alert('保存成功');
                        window.location.replace("/articles/" + id + '/edit');
                    }
                });
            } else {
                this.storageInterface.saveAs(serialized, function(id) {
                    if(id) {
                        self.$el.modal('hide');
                        alert('保存成功');
                        window.location.replace("/articles/" + id + '/edit');
                    }
                });
            }
        }
    });
});
