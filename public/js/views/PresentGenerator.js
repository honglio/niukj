define(["underscore", "handlebars", "common/Math2",
        "hbs!templates/ppt_gen/Image",
        "hbs!templates/ppt_gen/TextBox",
        "hbs!templates/ppt_gen/ComponentContainer",
        "hbs!templates/ppt_gen/Impress"
], function(_, Handlebars, Math2, ImageTemplate, TextBoxTemplate, ComponentContainer, Impress) {
    "use strict";


    var PresentGenerator = (function() {

        function PresentGenerator() {
            var self = this;
            Handlebars.registerPartial("ComponentContainer", ComponentContainer());

            Handlebars.registerHelper("renderComponent", function(componentModel, ignore) {
                var result;
                result = "";
                if (ignore && typeof ignore === 'string') {
                    ignore = ignore.split(" ");
                    if (ignore.indexOf(componentModel.get("type")) !== -1) {
                        return result;
                    }
                }
                switch (componentModel.get("type")) {
                    case "Image":
                        result = ImageTemplate(componentModel);
                        break;
                    case "TextBox":
                        result = TextBoxTemplate(self.convertTextBoxData(componentModel));
                        break;
                    // case "WebFrame":
                    //     result = JST["cloudslide/presentation_generator/WebFrame"](componentModel);
                    //     break;
                }
                return new Handlebars.SafeString(result);
            });
            Handlebars.registerHelper("round", function(v) {
                return Math2.round(v, 2);
            });
        }

        PresentGenerator.prototype.render = function(deckAttrs) {

            var colCnt = 6,
                cnt = 0,
                slides = deckAttrs.slides;

            slides.each(function(slide) {
                var x = slide.get('x');
                var y = slide.get('y');
                if (x == null) {
                    // adjust the distance between slides during display
                    slide.set('x', cnt * 260 + 30);
                    slide.set('y', parseInt(cnt / colCnt, 10) * 260 + 80);
                }

                cnt += 1;
            });

            return Impress(deckAttrs);
        };

        PresentGenerator.prototype.convertTextBoxData = function(attrs) {
            var copy = _.extend({}, attrs);
            copy.text = new Handlebars.SafeString(attrs.text);
            return copy;
        };

        return PresentGenerator;

    })();
    return new PresentGenerator();
});
