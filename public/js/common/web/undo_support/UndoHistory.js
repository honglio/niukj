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
        this.actions = new LinkedList();
    }

    /**
     * Clears undo history.
     *
     * @method clear
     */
    UndoHistory.prototype.clear = function() {
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
        return result;
    };

    /**
     * Undoes a command
     * @method undo
     * @returns {model.common_application.UndoHistory} this
     *
     */
    UndoHistory.prototype.undo = function() {
        this.actions.last().undo();
        this.actions.pop();
        return this;
    };

    /**
     * Redoes a command
     * @method redo
     * @returns {model.common_application.UndoHistory} this
     *
     */
    UndoHistory.prototype.redo = function() {
        this.actions.last().do();
        this.actions.push(this.actions.last());
        return this;
    };

    return UndoHistory;
});
