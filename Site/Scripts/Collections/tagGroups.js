var app = app || {};

(function () {
    'use strict';

    app.TagGroups = Backbone.Collection.extend({
        model: app.TagGroup
    });
})();