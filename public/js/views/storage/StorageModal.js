define(["CustomView",
    "./StorageInterface",
    "hbs!templates/StorageModal",
    "css!styles/app/storage/storageModal.css"
], function(CustomView, StorageInterface, StorageModalTemplate, css) {
    "use strict";
    var previous;

    var StorageModal = CustomView.extend({
        className: "storageModal modal fade",
        events: {
            "paste input[name='filename']": '_filenameEnterd',
            "keyup input[name='filename']": '_filenameEnterd',
            "click .ok": '_okClicked'
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

        showAlert: function(title, text, klass) {
            this.$alert = this.$('.alert');
            this.$alert.html('<strong>' + title + '</strong> ' + text);
            this.$alert.removeClass('hide');
            this.$alert.addClass(klass);
            setTimeout(this.hideAlert, 3000);
        },

        hideAlert: function() {
            this.$('.alert').addClass('hide');
        },

        _okClicked: function(e) {
            if(e.preventDefault){
                e.preventDefault();
            } else {
                e.returnValue = false;
            }

            this.$('.ok').text('保存中...');

            var self = this;
            var filename = this.$input.val();

            var csrf = $("input[name='_csrf']").val();

            var serialized = {
                article: this.model.exportPresentation(filename),
                _csrf: csrf
            };

            if(!this.model.deck().get('id')) {
                this.storageInterface.store(serialized, function (id) {
                    if(id) {
                        self.showAlert('成功！', '课件已保存成功', 'alert-success');
                        self.$('.ok').text('保存');
                        setTimeout(function(){
                            self.$el.modal('hide');
                            window.location.replace("/articles/" + id + '/edit');
                        }, 4000);
                    }
                });
            } else {
                this.storageInterface.saveAs(serialized, function (id) {
                    if(id) {
                        self.showAlert('成功！', '课件已保存成功', 'alert-success');
                        self.$('.ok').text('保存');
                        setTimeout(function(){
                            self.$el.modal('hide');
                            window.location.replace("/articles/" + id + '/edit');
                        }, 4000);
                    }
                });
            }
        }
    });

    return {
        get: function(options) {
            if (!previous) {
                previous = new StorageModal(options);
                previous.render();
                $('#modals').append(previous.$el);
            }

            return previous;
        }
    };
});
