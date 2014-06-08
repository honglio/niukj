define(["jquery",
    "common/EventEmitter"
], function ($, EventEmitter) {
    "use strict";

    describe('EventEmitter', function () {
        var eventEmitter = new EventEmitter();
        describe("module", function () {
            it("has trigger method", function () {
                expect(eventEmitter).to.be.a("object");
                expect(EventEmitter).to.be.a("function");
                expect(eventEmitter._events).to.equal(null);
            });
        });

        describe("_listeners()", function () {
            it("insert Event", function () {
                expect(eventEmitter._listeners('click')).to.deep.equal([]);
            });
        });

        describe("on()", function () {
            it("insert callback", function () {
                eventEmitter.on("click", 'whatever');
                eventEmitter.on("click", 'callback');
            });
        });

        describe("getNumListeners()", function () {
            it("should return 0 if no topic exist", function () {
                expect(eventEmitter.getNumListeners('fasdf')).to.deep.equal(0);
            });
            it("should return the number of the given topic", function () {
                expect(eventEmitter.getNumListeners('click')).to.deep.equal(2);
            });
        });

        describe("_indexOfSub()", function () {
            it("return the index of subscriber", function () {
                expect(eventEmitter._indexOfSub(eventEmitter._listeners('click'), 'whatever')).to.deep.equal(0);
                expect(eventEmitter._indexOfSub(eventEmitter._listeners('click'), 'callback')).to.deep.equal(1);
            });
        });

        describe("_splice()", function () {
            it("return one spliced array", function () {
                var a = [1, 2, 3];
                expect(eventEmitter._splice(a, 1, 2)).to.deep.equal([2, 3]);
            });
        });

        describe("_emit()", function () {
            it("should not remove any topic from the event list", function () {
                eventEmitter._emit('cccc');
                expect(eventEmitter.getNumListeners('cccc')).to.deep.equal(0);
            });
            it("should not remove the topic from the event list", function () {
                eventEmitter._emit('click');
                expect(eventEmitter.getNumListeners('click')).to.deep.equal(2);
            });
        });

        describe("emit()", function () {
            it("should return undefined", function () {
                expect(eventEmitter.emit('cccc', 'Something')).to.deep.equal();
            });
            it("allow array", function () {
                eventEmitter.emit('click', 'Something');
                expect(eventEmitter.getNumListeners('click')).to.deep.equal(2);
            });
        });

        describe("once()", function () {
            it("should announced once and removed after emit", function () {
                eventEmitter.once('hover', 'Do something');
                expect(eventEmitter.getNumListeners('hover')).to.deep.equal(1);
                eventEmitter.emit('hover');
                expect(eventEmitter.getNumListeners('hover')).to.deep.equal(0);
            });
            it("trigger() align", function () {
                eventEmitter.once('hover', 'Do something');
                eventEmitter.once('hover', 'Do something else');
                eventEmitter.once('cover', 'Do another thing');
                expect(eventEmitter.getNumListeners('hover')).to.deep.equal(2);
                expect(eventEmitter.getNumListeners('cover')).to.deep.equal(1);
                eventEmitter.trigger('hover');
                eventEmitter.trigger('cover');
                expect(eventEmitter.getNumListeners('hover')).to.deep.equal(0);
                expect(eventEmitter.getNumListeners('cover')).to.deep.equal(0);
            });
        });
        describe("removeListener()", function () {
            it("should do nothing, if callback is not specified", function () {
                expect(eventEmitter.getNumListeners('click')).to.deep.equal(2);
                eventEmitter.removeListener('click');
                expect(eventEmitter.getNumListeners('click')).to.deep.equal(2);
            });
            it("should remove the topic from the event list, and off() align", function () {
                eventEmitter.removeListener('click', 'whatever');
                expect(eventEmitter.getNumListeners('click')).to.deep.equal(1);
                eventEmitter.off('click', 'callback');
                expect(eventEmitter.getNumListeners('click')).to.deep.equal(0);
            });
        });

    });
});