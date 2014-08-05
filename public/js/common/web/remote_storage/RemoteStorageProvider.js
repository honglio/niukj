define(function() {
    "use strict";

    function RemoteStorageProvider() {}

    RemoteStorageProvider.prototype = {

        read: function(deckId, cb) {
            $.ajax({
                url: '/articles/' + deckId + '/get',
                method: 'GET',
                success: function(deck) {
                    cb(deck);
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
            $.ajax({
                url:'/articles',
                type: 'POST',
                data: deck,
                success: function(result) {
                    cb(result);
                }
            });
        },

        update: function(deck, cb) {
            $.ajax({
                url: '/articles/' + deck.article.id,
                type: 'PUT',
                data: deck,
                success: function(result) {
                    cb(result);
                }
            });
        }

    };

    return RemoteStorageProvider;
});
