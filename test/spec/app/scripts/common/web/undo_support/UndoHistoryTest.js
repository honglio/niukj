define(["common/web/undo_support/UndoHistory"],
function(UndoHistory) {
	"use strict";
	describe('UndoHistory', function () {
		var undoHistory = new UndoHistory(20);
		var list = [];
		var id = 0;
		
		function AddCmd() {
			id += 1;
		}

		AddCmd.prototype = {
			do: function() {
				list.push(id);
			},

			undo: function() {
				list.pop();
			}
		};

		function RemoveCmd() {}
		RemoveCmd.prototype = {
			do: function() {
				list.pop();
			},

			undo: function() {
				list.push(id);
			}
		};
		
		describe('Linear undo-redo', function() {
			it("AddCmd undo-redo method", function () {
				var add = new AddCmd();
				add.do();
				expect(list.length).to.deep.equal(1);

				undoHistory.push(add);
				undoHistory.undo();
				expect(list.length).to.deep.equal(0);

				undoHistory.redo();
				expect(list.length).to.deep.equal(1);
			});
			
			it("RemoveCmd undo-redo method", function () {
				var remove = new RemoveCmd();
				remove.do();
				expect(list.length).to.deep.equal(0);

				undoHistory.push(remove);
				undoHistory.undo(); // RemoveCmd.undo, push id into list
				expect(list.length).to.deep.equal(1);

				undoHistory.undo(); // AddCmd.undo, pop id from list
				expect(list.length).to.deep.equal(0);
			
				undoHistory.redo(); // AddCmd.do
				expect(list.length).to.deep.equal(1);
				undoHistory.redo(); // RemoveCmd.do
				expect(list.length).to.deep.equal(0);
			});
		});

		describe('Re-do history lost because of new action', function() {
			it("pushdo method", function () {
				id = 0;
				undoHistory.pushdo(new AddCmd());
				undoHistory.pushdo(new AddCmd());
				undoHistory.pushdo(new AddCmd());

				expect(list.toString()).to.deep.equal([1,2,3].toString());

				undoHistory.undo();
				undoHistory.undo();

				expect(list.toString()).to.deep.equal([1].toString());

				undoHistory.pushdo(new AddCmd());
				expect(list.toString()).to.deep.equal([1,4].toString());
				
				undoHistory.redo(); // this shouldn't execute anything
				undoHistory.redo(); // this shouldn't execute anything
				undoHistory.redo(); // this shouldn't execute anything

				expect(list.toString()).to.deep.equal([1,4].toString());

				undoHistory.undo();
				expect(list.toString()).to.deep.equal([1].toString());
				undoHistory.redo();
				expect(list.toString()).to.deep.equal([1,4].toString());
			});
		});
	});
});