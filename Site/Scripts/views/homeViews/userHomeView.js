var app = app || {};

(function ($) {
    'use strict';
    // The Home Application View
    app.UserHomeView = Backbone.View.extend({
        el: 'mainDiv',
        initialize: function (homeBlock) {
            this.model = homeblock;
            this.userHometpl = templateFromUrl("site/scripts/templates/homeGuest.html");
            this.render();
            $.ajax({
            type: "GET",
            url: APIServer + "/Home/GetNotifications",
            dataType: "json",
            data: { unreadOnly:true, size: 50 },
            contentType: "application/json",
            success: function (data) {
                app.category = new app.BookCategory(data);
                $("#mainDiv").html(_.templateFromUrl("site/scripts/templates/categoryGuest.html", { category: app.category }));
                app.CategoryView.render();
            },
            error: function (xhr, status, error) {
                $("#Result").html(error);
            }
        });
            this.notifications = new app.NotificationsView()
        },
        render: function () {
            this.$el.html(_.template(this.userHometpl, {
                    WorkspaceHasOwners: app.homeBlock.getWorkspaceHasOwners(),
                    WorkspaceHasAccess: app.homeBlock.getWorkspaceHasAccess(),
                    publicWorkspaces: app.homeBlock.getpublicWorkspaces()
                }));
        }
    });
})(jQuery);
