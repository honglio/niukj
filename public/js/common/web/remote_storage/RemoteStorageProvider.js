define([], function() {
    "use strict";

    function RemoteStorageProvider() {}

    RemoteStorageProvider.prototype = {

        read: function(deckId, cb) {
            $.ajax({
                url: '/articles/' + deckId,
                method: 'GET',
                success: function(deck) {
                    cb(deck);
                },
                error: function(err) {
                    cb(err);
                }
            });
        },

        delete: function(deck, cb) {
            $.ajax({
                url: '/articles/' + deck.id,
                type: 'DELETE',
                data: {article: deck}
            })
            .done(function(result) {
                cb(result);
            })
            .fail(function(err) {
                cb(err);
            });
        },

        create: function(deck, cb) {
            $.post('/articles', {articles: deck}, function(result) {
                cb(result);
            }).error(function(err) {
                cb(err);
            });
        },

        update: function(deck, cb) {
            $.ajax({
                url: '/articles/' + deck.id,
                type: 'PUT',
                data: {article: deck},
            })
            .done(function(result) {
                cb(result);
            })
            .fail(function(err) {
                cb(err);
            });
        }

    };

    return RemoteStorageProvider;
});
