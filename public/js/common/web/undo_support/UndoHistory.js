define([
    "underscore",
    "common/collections/LinkedList"
], function(_, LinkedList) {


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
        this.cursor = null;
        this.undoCount = 0;
    }

    /**
     * Clears undo history.
     *
     * @method clear
     */
    UndoHistory.prototype.clear = function() {
        this.cursor = null;
        this.undoCount = null;
        this.actions = new LinkedList();
    };

    /**
     * Adds a new command to the undo history. This re-sets the re-do history.
     *
     * @param {Command} [command] Command to be added to the history
     */
    UndoHistory.prototype.push = function(command) {
        if ((this.actions.length - this.undoCount) < this.size) {
            if (this.undoCount > 0) {
                var node = {
                    prev: null,
                    next: null,
                    value: command
                };
                if (!this.cursor) {
                    this.actions.head = node;
                    this.actions.length = 1;
                } else {
                    node.prev = this.cursor;
                    this.cursor.next.prev = null;
                    this.cursor.next = node;
                    this.actions.length += 1;
                    this.actions.length = this.actions.length - this.undoCount;
                }
                this.actions.tail = node;
                this.undoCount = 0;
                this.cursor = null;
            } else {
                this.actions.push(command);
                this.cursor = null;
            }
        } else {
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
     * This is useful for telling the user what command would be undone
     * if they pressed undo.
     * @method undoName
     * @returns {String} name of the next command to be undone
     *
     */
    UndoHistory.prototype.undoName = function() {
        if (this.undoCount < this.actions.length) {
            var node = this.cursor || this.actions.tail;
            if (node) {
                return node.value.name;
            } else {
                return "";
            }
        } else {
            return "";
        }
    };

    /**
     * This is useful for telling the user what command would be
     * redone if they pressed redo
     * @method redoName
     * @returns {String} name of the next command to be redone
     *
     */
    UndoHistory.prototype.redoName = function() {
        var node;
        if (this.undoCount > 0) {
            if (this.cursor === null || this.cursor === undefined) {
                node = this.actions.head;
            } else {
                node = this.cursor.next;
            }
            if (node != null) {
                return node.value.name;
            } else {
                return "";
            }
        } else {
            return "";
        }
    };

    /**
     * Undoes a command
     * @method undo
     * @returns {model.common_application.UndoHistory} this
     *
     */
    UndoHistory.prototype.undo = function() {
        if (this.undoCount < this.actions.length) {
            if (this.cursor === null || this.cursor === undefined) {
                this.cursor = this.actions.tail;
            }
            this.cursor.value.undo();
            this.undoCount += 1;
            if (this.cursor !== null && this.cursor !== undefined && this.cursor !== this.actions.head) {
                this.cursor = this.cursor.prev;
            }
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
        if (this.undoCount > 0) {
            if (this.cursor === null || this.cursor === undefined) {
                this.cursor = this.actions.head;
            }
            if (this.cursor !== null && this.cursor !== undefined && this.cursor !== this.actions.tail) {
                this.cursor = this.cursor.next;
            }
            this.cursor.value.do();
            this.undoCount -= 1;
        }
        return this;
    };

    return UndoHistory;
});
