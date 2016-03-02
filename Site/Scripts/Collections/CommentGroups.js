var app = app || {};

(function () {
    'use strict';

    app.CommentGroups = Backbone.Collection.extend({
        model: app.CommentGroup
    });
})();
