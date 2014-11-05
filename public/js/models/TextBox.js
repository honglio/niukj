define(["./Component"],
    function(Component) {

        return Component.extend({
            initialize: function() {
                Component.prototype.initialize.apply(this, arguments);
                this.set('type', 'TextBox');
                if (!this.get('text')) {
                    this.set('text', '在此输入文字');
                    this.set('size', 48);
                    this.set('color', 444);
                }
            },

            constructor: function TextBox() {
                Component.prototype.constructor.apply(this, arguments);
            }
        });
    });
