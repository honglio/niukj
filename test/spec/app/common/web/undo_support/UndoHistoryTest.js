define(["common/web/undo_support/UndoHistory"],
    function(UndoHistory) {

        describe('UndoHistory', function() {
            var undoHistory = new UndoHistory(20)

            function AddCmd() {}

            AddCmd.prototype = {
                name: "AddCmd",
                do: function() {
                    return "AddCmd.do";
                },

                undo: function() {
                    return "AddCmd.undo";
                }
            };

            function RemoveCmd() {}

            RemoveCmd.prototype = {
                name: "RemoveCmd",
                do: function() {
                    return "RemoveCmd.do";
                },

                undo: function() {
                    return "RemoveCmd.undo";
                }
            };

            describe('Linear undo-redo', function() {
                it("AddCmd undo-redo method", function() {
                    var add = new AddCmd();
                    expect(add.do()).to.deep.equal("AddCmd.do");
                    expect(add.undo()).to.deep.equal("AddCmd.undo");

                    expect(undoHistory.pushdo(add)).to.deep.equal("AddCmd.do");
                    expect(undoHistory.undoName()).to.deep.equal("AddCmd");
                    expect(undoHistory.redoName()).to.deep.equal("");

                    undoHistory.redo(); // upper bond test
                    expect(undoHistory.undoName()).to.deep.equal("AddCmd");
                    expect(undoHistory.redoName()).to.deep.equal("");
                    undoHistory.redo();
                    expect(undoHistory.undoName()).to.deep.equal("AddCmd");
                    expect(undoHistory.redoName()).to.deep.equal("");

                    undoHistory.undo(); // lower bond test
                    expect(undoHistory.undoName()).to.deep.equal("");
                    expect(undoHistory.redoName()).to.deep.equal("");
                    undoHistory.undo();
                    expect(undoHistory.undoName()).to.deep.equal("");
                    expect(undoHistory.redoName()).to.deep.equal("");

                    undoHistory.redo();
                    expect(undoHistory.undoName()).to.deep.equal("AddCmd");
                    expect(undoHistory.redoName()).to.deep.equal("");
                    undoHistory.undo();
                    expect(undoHistory.undoName()).to.deep.equal("");
                    expect(undoHistory.redoName()).to.deep.equal("");
                });

                it("Add RemoveCmd to UndoHistory and run undo-redo method", function() {
                    var remove = new RemoveCmd();
                    expect(remove.do()).to.deep.equal("RemoveCmd.do");
                    expect(remove.undo()).to.deep.equal("RemoveCmd.undo");

                    expect(undoHistory.pushdo(remove)).to.deep.equal("RemoveCmd.do");
                    expect(undoHistory.undoName()).to.deep.equal("RemoveCmd");
                    expect(undoHistory.redoName()).to.deep.equal("");

                    // upper bond test
                    undoHistory.redo();
                    expect(undoHistory.undoName()).to.deep.equal("RemoveCmd");
                    expect(undoHistory.redoName()).to.deep.equal("");

                    undoHistory.undo();
                    expect(undoHistory.undoName()).to.deep.equal("AddCmd");
                    expect(undoHistory.redoName()).to.deep.equal("RemoveCmd");

                    undoHistory.undo(); // AddCmd.undo, pop id from list

                    undoHistory.redo(); // AddCmd.do
                    undoHistory.redo(); // RemoveCmd.do
                });
            });

            describe('Re-do history lost because of new action', function() {
                it("pushdo method", function() {
                    var id = 0;
                    undoHistory.pushdo(new AddCmd());
                    undoHistory.pushdo(new AddCmd());
                    undoHistory.pushdo(new AddCmd());

                    // expect(list.toString()).to.deep.equal([1, 2, 3].toString());

                    // undoHistory.undo();
                    // undoHistory.undo();

                    // expect(list.toString()).to.deep.equal([1].toString());

                    // undoHistory.pushdo(new AddCmd());
                    // expect(list.toString()).to.deep.equal([1, 4].toString());

                    // undoHistory.redo(); // this shouldn't execute anything
                    // undoHistory.redo(); // this shouldn't execute anything
                    // undoHistory.redo(); // this shouldn't execute anything

                    // expect(list.toString()).to.deep.equal([1, 4].toString());

                    // undoHistory.undo();
                    // expect(list.toString()).to.deep.equal([1].toString());
                    // undoHistory.redo();
                    // expect(list.toString()).to.deep.equal([1, 4].toString());
                });
            });
        });
    });
