var app = app || {};

(function ($) {
    'use strict';
    // The Home Application View
    app.NotificationsView = Backbone.View.extend({
        el: '#notifications-container',
        initialize: function (notifications) {
            this.collection = notifications;
            this.notificationstpl = _.templateFromUrl("site/scripts/templates/notifications.html", { Model: this.collection.models});
            this.render();
        },
        render: function () {
            return this.$el.html(this.notificationstpl);
        }
    });
})(jQuery);
