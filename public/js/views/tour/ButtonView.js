define(["CustomView"], function(CustomView) {
    "use strict";
    return CustomView.extend({
        className: 'btn hidden-phone',
        tagName: 'a',

        events: {
            click: '_clicked',
            destroyed: 'remove'
        },

        initialize: function() {},

        _clicked: function() {
            $("#slide-editor").onScreenHelp([{
                caption: "课件页面",
                selector: ".slideContainer",
                startWith: true,
                scrollTo: false
            }, {
                caption: "课件快照",
                navCaption: "2",
                selector: ".slideWell",
                description: "此处为课件页面的快照。您可以点击快照来切换课件页。",
                padding: "all",
                position: "right",
                scrollTo: false
            }, {
                navCaption: "3",
                selector: ".wellContextBox",
                description: "点击此按钮，给课件加入新的页面。",
                padding: "all",
                position: "right",
                scrollTo: false
            }, {
                selector: ".create-comp-buttons",
                addPadding: true,
                padding: "all",
                description: "您可以点击任意按钮，给当前课件页添加内容。",
                position: "bottom",
                scrollTo: false
            }, {
                selector: ".theme-buttons",
                addPadding: true,
                padding: "all",
                description: "还可以更换背景哦~",
                position: "bottom",
                scrollTo: false
            }, {
                selector: ".start-button",
                addPadding: true,
                padding: "all",
                description: "课件编辑好后不要忘记保存！",
                position: "bottom",
                scrollTo: false
            }, {
                selector: ".present-button",
                addPadding: true,
                padding: "all",
                description: "点击此按钮，将放映本课件。",
                position: "bottom",
                scrollTo: false
            }, {
                navCaption: "小提示",
                selector: ".slideSnapshot",
                addPadding: true,
                padding: "all",
                description: "您可以拖拽此快照来给页面排序。",
                position: "right",
                scrollTo: false
            }, {
                navCaption: "快捷键",
                selector: ".slideWell",
                addPadding: true,
                html: "<br><p>亲，对快照和课件内容的任何操作都支持撤销与重复，还有快捷键哦！</p><br><p>'ctrl+x' 剪切</p><p>'ctrl+c' 复制</p><p>'ctrl+v' 粘贴</p><p>'del' 删除</p><p>'ctrl+z' 撤销</p><p>'ctrl+y' 重复</p>",
                padding: "top",
                position: "right",
                scrollTo: false
            }], {
                scrollAlways: true, // allways scroll to the next / prev step, can be overwritten through step's setting (default => true)
                hideKeyCode: 27, // close on escape (default => 27)
                allowEventPropagation: true //(default => true)
            });
        },

        render: function() {
            this.$el.html('<i class="' + this.options.icon + '"></i>' + ' <strong>' + this.options
                .name + '</strong>');
            return this;
        },

        constructor: function() {
            Backbone.View.prototype.constructor.apply(this, arguments);
        }
    });
});
