define(["cloudslide/hotkey/GlobalEvents"
], function(GlobalEvents) {
    "use strict";

    return {
        initialize: function(registry) {
            var actions;
            if(navigator.appVersion.indexOf("Mac") !== -1) {
                actions = [
                    ['撤销', '⌘+Z'],
                    ['重复', '⌘+Y'],
                    ['剪切', '⌘+X'],
                    ['拷贝', '⌘+C'],
                    ['粘贴', '⌘+V'],
                    ['删除', '⌘+⌫']
                ];
            }
            else {
                actions = [
                    ['撤销', 'Ctrl+Z'],
                    ['重复', 'Ctrl+Y'],
                    ['剪切', 'Ctrl+X'],
                    ['拷贝', 'Ctrl+C'],
                    ['粘贴', 'Ctrl+V'],
                    ['删除', 'Del']
                ];
            }

            actions.forEach(function(action) {
                registry.register({
                    interfaces: 'cloudslide.editor.glob.action',
                    meta: {
                        title: action[0],
                        action: action[0],
                        hotkey: action[1]
                    }
                }, function() {
                    GlobalEvents.trigger(action[0]);
                });
            });
        }
    };
});
