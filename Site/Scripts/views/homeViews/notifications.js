var app = app || {};

(function () {
    'use strict';

    app.Notifications = Backbone.Collection.extend({
        model: app.Notification;
    });
})();
