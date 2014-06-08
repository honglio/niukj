define(["backbone",
        "hbs!./templates/FileBrowser",
        "css!styles/widgets/fileBrowser.css"
], function(Backbone, FileBrowserTemplate ,css) {
    "use strict";
    return Backbone.View.extend({
        events: {
            "click li[data-filename]": '_fileClicked',
            "click button.close": '_deleteClicked',
            "dblclick li[data-filename]": '_fileChosen',
			destroyed: 'remove'
        },

        className: "fileBrowser",

        initialize: function() {
			console.log("initialize");
            this.render = this.render.bind(this);
            this.storageInterface.on("change:currentProvider", this.render);
            this.renderListing = this.renderListing.bind(this);
        },

        render: function() {
			console.log("render");
            this.$el.html('<div class="browserContent">');
            this.renderListing();

            return this;
        },

        dispose: function() {
            this.storageInterface.off(null, null, this);
			Backbone.View.prototype.dispose.call(this);
        },

        _fileClicked: function(e) {
			console.log("_fileClicked");
            this.fileName(e.currentTarget.dataset.filename);
            this.$el.find('.active').removeClass('active');
            $(e.currentTarget).addClass('active');
        },

        _fileChosen: function(e) {
			console.log("_fileChosen");
            this.$el.trigger("fileChosen", e.currentTarget.dataset.fileName);
        },

        _deleteClicked: function(e) {
			console.log("_deleteClicked");
            var $target = $(e.currentTarget);
            var $li = $target.parent().parent();
            this.storageInterface.remove($li.attr('data-filename'));
            $li.remove();

            e.stopPropagation();
        },

        renderListing: function() {
			console.log("renderListing");
            var self = this;
            this.storageInterface.listPresentationNames("/", function(filelist, err) {
                if (err) {
					console.log(err);
                    self.$el.find('.browserContent').html(err);
                } else {
					console.log(filelist);
                    self.$el.find('.browserContent').html(FileBrowserTemplate({
                        files: filelist
                    }));
                }

                self.$fileName = self.$el.find('.fileName');
				console.log(self.$fileName);
            });
        },

        fileName: function(fname) {
            console.log("fileName");
            if(fname) {
                this.$fileName.val(fname);
            } else {
                return this.$fileName.val();
            }
        },

        constructor: function ProviderTab(storageInterface, editorModel) {
			console.log("constructor");
            this.storageInterface = storageInterface;
            this.editorModel = editorModel;
            Backbone.View.prototype.constructor.call(this);
        }
    });
});
