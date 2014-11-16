define([
    "common/collections/LinkedList"
], function(LinkedList) {


    /**
     * Maintains a list of commands in an undo history.
     * Drops commands when they should no longer be reachable
     * via standard undo\redo semantics.
     * @class common.web.undo_support.UndoHistory
     * @constructor
     * @param {Integer} size Number of commands/actions to remember
     *
     */
    function UndoHistory(size) {
        this.size = size;
        this.count = 0;
        this.actions = new LinkedList();
    }

    /**
     * Clears undo history.
     *
     * @method clear
     */
    UndoHistory.prototype.clear = function() {
        this.count = 0;
        this.actions = new LinkedList();
    };

    /**
     * Adds a new command to the undo history. This re-sets the re-do history.
     *
     * @param {Command} [command] Command to be added to the history
     */
    UndoHistory.prototype.push = function(command) {
        this.actions.push(command);

        if (this.actions.length >= this.size) {
            this.actions.shift();
            this.actions.push(command);
        }
    };

    /**
     * Alias for executing "do" and "push".
     *
     * @param {*} command
     * @returns {*} Results of "do".
     */
    UndoHistory.prototype.pushdo = function(command) {
        var result = command.do();
        this.push(command);
        this.count += 1;
        return result;
    };

    /**
     * Undoes a command
     * @method undo
     * @returns {model.common_application.UndoHistory} this
     *
     */
    UndoHistory.prototype.undo = function() {
        if(this.count > 0) {
            this.actions.last().undo();
            this.actions.unshift(this.actions.last());
            this.actions.pop();
            this.count -= 1;
        }
        return this;
    };

    /**
     * Redoes a command
     * @method redo
     * @returns {model.common_application.UndoHistory} this
     *
     */
    UndoHistory.prototype.redo = function() {
        if(this.count <= (this.actions.length - 2)) {
            this.actions.first().do();
            this.actions.push(this.actions.first());
            this.actions.shift();
            this.count += 1;
        }
        return this;
    };

    return UndoHistory;
});
