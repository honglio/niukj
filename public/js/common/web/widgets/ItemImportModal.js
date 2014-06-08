define(["underscore", "backbone", "hbs!./templates/ItemImportModal",
], function(_, Backbone, ItemImportModalTemplate) {
    "use strict";
    var modalCache = {};
    var reg = /[a-z]+:/;

    var ItemImportModal = Backbone.View.extend({
        className: "itemGrabber modal hide",
        events: {
            "click .ok": "_okClicked",
            "click div[data-option='browse']": "_browseClicked",
            "change input[type='file']": "_fileChosen",
            "keyup input[name='itemUrl']": "_urlChanged",
            "paste input[name='itemUrl']": "_urlChanged",
            "hidden": "_hidden"
        },
        initialize: function() {
            this._loadItem = _.debounce(this._loadItem.bind(this), 200);
        },
        show: function(cb) {
            this.cb = cb;
            this.$el.modal('show');
        },
        _okClicked: function(e) {
			if(e.preventDefault){
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

            if (!file.type.match('image.*')) {
                return;
            }
            var reader = new FileReader();

            var self = this;
			// run after file chosen
            reader.onload = function(e) {
                self.$input.val(e.target.result); // reader's return value after read.
                return self._urlChanged({ // just return any return value of urlChanged func
                    which: -1 // keyup is -1
                });
            };
			// run after file selected, because e.target block thread
            return reader.readAsDataURL(file);
        },
        _browseClicked: function() {
            this.$el.find('input[type="file"]').click();
        },
        _hidden: function() {
            if (this.$input) {
                return this.$input.val("");
            }
        },
        _urlChanged: function(e) {
            if (e.which === 13) { // if keyup is Enter.
                console.log("urlChanged if");
				this.src = this.$input.val();
                return this._okClicked();
            } else {
				console.log("urlChanged else");
                this._loadItem();
            }
        },
		/*
		 * set $preview's src by input value
		 */
        _loadItem: function() {
            var val = this.$input.val();

            var r = reg.exec(val);
            if (r == null || r.index !== 0) {
                val = 'http://' + val;
            }

            this.$preview.src = val;
            this.src = this.$preview.src;
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
        },
        constructor: function ItemImportModal() {
            Backbone.View.prototype.constructor.apply(this, arguments);
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
