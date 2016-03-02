var app = app || {};

(function ($) {
    'use strict';
    // The Home Application View
    app.UserHomeView = Backbone.View.extend({
        el: 'mainDiv',
        initialize: function (homeBlock) {
            this.model = homeBlock;
            this.userHometpl = _.templateFromUrl("site/scripts/templates/homeUser.html", {
                    WorkspaceHasOwners: this.model.getWorkspaceHasOwners(),
                    WorkspaceHasAccess: this.model.getWorkspaceHasAccess(),
                    publicWorkspaces: this.model.getpublicWorkspaces()
                });
            this.render();
            var that = this;
            $.ajax({
                type: "GET",
                url: APIServer + "/Home/GetNotifications",
                dataType: "json",
                data: { unreadOnly:true, size: 50 },
                contentType: "application/json",
                success: function (data) {
                    that.notificationsView = new app.NotificationsView(new app.Notifications);
                },
                error: function (xhr, status, error) {
                    $("#Result").html(error);
                }
            });
        },
        render: function () {
            return this.$el.html(this.userHometpl);
        }
    });
})(jQuery);
