define(["underscore", "jquery", "CustomView", "hbs!./templates/ItemImportModal", ], function(_, $, CustomView, ItemImportModalTemplate) {

    var modalCache = {};

    var ItemImportModal = CustomView.extend({
        className: "itemGrabber modal fade",
        events: {
            "click .ok": "_okClicked",
            "click div[data-option='browse']": "_browseClicked",
            "change input[type='file']": "_fileChosen",
            // "keyup input[name='itemUrl']": "_urlChanged",
            // "paste input[name='itemUrl']": "_urlChanged"
        },
        initialize: function() {
            this._loadItem = _.debounce(this._loadItem.bind(this), 200);
        },
        show: function(cb) {
            this.cb = cb;
            this.$el.modal('show');
        },
        _okClicked: function(e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            if (!this.$el.find('.ok').hasClass('disabled')) {
                this.cb(this.src);
                this.$el.modal('hide');
            }
        },
        _fileChosen: function(e) {
            var file = e.target.files[0]; // selected file
            console.log(file);
            this.fileName = file.name;
            this.fileType = file.type;
            if (!file.type.match('image.*')) {
                return;
            }
            var reader = new FileReader();

            var self = this;

            // run after file chosen
            reader.onload = function(e) {
                console.log(e.target.result);
                self.$input.val(e.target.result); // reader's return value after read.
                console.log(self.$input.val());
                return self._urlChanged({ // just return any return value of urlChanged func
                    which: -1 // keyup is -1
                });
            };

            return reader.readAsDataURL(file); // This run after file selected, because e.target block thread
        },
        _browseClicked: function() {
            this.$el.find('input[type="file"]').click();
        },
        _urlChanged: function(e) {
            if (this.$input.val()) {
                this.$el.find(".ok").removeAttr('disabled');
            } else {
                this.$el.find(".ok").attr('disabled', 'disabled');
            }

            if (e.which === 13) { // if keyup is Enter.
                this.src = this.$input.val();
                return this._okClicked();
            } else {
                var self = this;
                this._loadItem(e, function(res) {
                    self.$preview.src = res;
                    self.src = res;
                });
            }
        },
        /*
         * set $preview's src by input value
         */
        _loadItem: function(e, cb) {
            var val = this.$input.val();
            console.log(val);
            // var reg = /[a-z]+:/;
            // var r = reg.exec(val);
            // if (r == null || r.index !== 0) {
            //     val = 'http://' + val;
            // }
            // cb({
            //     src: val,
            //     name: this.fileName
            // });
            $.ajax({
                    url: '/articles/uploadImg',
                    type: 'POST',
                    data: {
                        src: val,
                        type: this.fileType
                    }
                })
                .success(function(res, status, body) {
                    // console.log("Success!!!");
                    // console.log('res:' + res);
                    // console.log('status:' + status);
                    // console.log(body);
                    cb(res);
                })
                .error(function(body, status, err) {
                    console.log("Error!!!");
                    console.log('body:' + body);
                    console.log('status:' + status);
                    console.log('err:' + err);
                });
        },
        _itemLoadError: function() {
            this.$el.find('.ok').addClass('disabled');
            this.$el.find('.alert').removeClass('hide');
        },
        _itemLoaded: function() {
            this.$el.find('.ok').removeClass('disabled');
            this.$el.find('.alert').addClass('hide');
        },
        render: function() {
            this.$el.html(ItemImportModalTemplate(this.options));
            this.$el.modal("hide");
            this.$preview = this.$el.find(this.options.tag)[0];

            var self = this;
            if (!this.options.ignoreErrors) {
                this.$preview.onerror = function() {
                    return self._itemLoadError();
                };
                this.$preview.onload = function() {
                    return self._itemLoaded();
                };
            }
            this.$input = this.$el.find("input[name='itemUrl']");
            return this.$el;
        }
    });

    return {
        get: function(options) {
            var previous = modalCache[options.tag];

            if (!previous) {
                previous = new ItemImportModal(options);
                previous.on("destroy", function() {
                    delete modalCache[options.tag];
                });

                modalCache[options.tag] = previous;

                previous.render();
                $('#modals').append(previous.$el);
            }

            return previous;
        }
    };
});
