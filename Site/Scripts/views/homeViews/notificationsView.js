var app = app || {};

(function ($) {
    'use strict';
    // The Home Application View
    app.NotificationsView = Backbone.View.extend({
        el: '#notifications-container',
        initialize: function (notifications) {
            this.model = notifications;
            this.notificationstpl = templateFromUrl("site/scripts/templates/notifications.html");
            this.render();
        },
        render: function () {
            this.$el.html(_.template(this.userHometpl, {
                    Model: notifications
                }));
            this.$el.html()
        }
    });
})(jQuery);
