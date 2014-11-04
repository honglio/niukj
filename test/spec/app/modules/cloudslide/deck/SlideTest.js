define(["underscore", "cloudslide/deck/Slide"],
    function(_, Slide) {
        "use strict";

        function MockComponent() {
            this.attrs = {
                x: 0,
                y: 0
            };
        }

        MockComponent.prototype = {
            on: function() {

            },

            get: function(key) {
                var result = this.attrs[key];
                console.log(result);
                return result;
            },

            set: function(key, value) {
                if (_.isObject(key)) {
                    _.extend(this.attrs, key);
                } else {
                    this.attrs[key] = value;
                }
            },

            trigger: function() {

            },

            off: function() {

            }
        };

        describe('Slide', function() {
            var slide = new Slide(),
                comp = new MockComponent();

            slide.remark = 'MySlide';

            describe("module load", function() {
                it("has load method", function() {
                    expect(slide).to.be.a("object");
                    expect(Slide).to.be.a("function");
                    expect(slide.add).to.be.a("function");
                });
            });

            describe("initialize", function() {
                it("slide", function() {
                    expect(slide.remark).to.deep.equal('MySlide');
                });
            });

            describe("add component", function() {
                it("should trigger 'contentsChanged' event", function() {
                    var contentsChanged = false,
                        addTriggered = false;
                    slide.on("contentsChanged", function() {
                        contentsChanged = true;
                    });

                    slide.on("change:components.add", function() {
                        addTriggered = true;
                    });

                    slide.add(comp);
                    // contentsChanged event triggered
                    expect(contentsChanged).to.deep.equal(true);
                    // add event triggered
                    expect(addTriggered).to.deep.equal(true);

                    expect(slide.get("components").length).to.deep.equal(1);
                });

                it("add another component which will have 20px offset", function() {
                    slide.add(comp);
                    // Offset from existing component
                    expect(comp.get("x")).to.deep.equal(20);
                    expect(comp.get("y")).to.deep.equal(20);
                    expect(slide.get("components").length).to.deep.equal(2);
                });
            });

            describe("remove component", function() {
                it("should trigger 'contentsChanged' event", function() {
                    var contentsChanged = false,
                        removeTriggered = false;

                    slide.on("contentsChanged", function() {
                        contentsChanged = true;
                    });

                    slide.on("change:components.remove", function() {
                        removeTriggered = true;
                    });

                    slide.remove(comp);

                    expect(contentsChanged).to.deep.equal(true);
                    expect(removeTriggered).to.deep.equal(true);
                    expect(slide.get("components").length).to.deep.equal(1);
                });
            });

            // TODO
            describe("dispose", function() {

            });

            describe("unselect components", function() {

            });

            describe("Change selection", function() {

            });

            describe("Update contained component change", function() {

            });
        });
    });
